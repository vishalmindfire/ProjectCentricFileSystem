import React from 'react';
import ErrorPage from '@pages/error';
interface Props {
    children: React.ReactNode;
    fallback: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props ) {
      super(props);
      this.state = { 
        hasError: false ,
        error: null,
        errorInfo: null
      };
    }
    
    static getDerivedStateFromError(error: Error){
        return { hasError: true, error: error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo){
        this.setState({errorInfo: errorInfo});
        //Log to external API or service
        console.error("Error Boundary Caught an error", error, errorInfo);
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            return this.props.fallback ? this.props.fallback : ErrorPage();    
        }
        
        return this.props.children; 
    }
}

export default ErrorBoundary;
