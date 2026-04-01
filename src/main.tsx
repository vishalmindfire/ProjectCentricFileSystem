import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import logErrorToServer from '@services/errorLogger';
import { type errorComponent } from '@entities/Error';
window.addEventListener('error', function (event) {
  const errorContext: errorComponent = {
    source: event.filename,
    lineNumber: event.lineno,
    columnNumber: event.colno,
  };
  logErrorToServer(
    {
      error: event.error instanceof Error ? event.error : new Error(String(event.message)),
      errorInfo: event.error,
      context: errorContext,
    },
    null
  );
  console.error(
    'Global error event:',
    event.message,
    event.filename,
    event.lineno,
    event.colno,
    event.error
  );
});
window.addEventListener('unhandledrejection', function (event) {
  logErrorToServer(
    {
      error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      errorInfo: { componentStack: 'Unhandled Promise Rejection' },
      context: {
        type: 'UnhandledPromiseRejection',
      },
    },
    null
  );
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
