import type React from "react";

function ErrorPage(): React.ReactNode {
  return (
    <div className="error-page">
      <h1>Something went wrong.</h1>
      <p>We're sorry, but an error occurred while loading the page.</p>
    </div>
  );
};

export default ErrorPage;