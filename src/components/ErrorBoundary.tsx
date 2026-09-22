"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex items-center justify-center h-full p-8">
          <div className="bg-cpd-bg-secondary border border-cpd-danger/50 rounded p-6 max-w-md text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-cpd-danger mx-auto" />
            <h3 className="text-sm font-bold text-cpd-text">Something went wrong</h3>
            <p className="text-xs text-cpd-text-dim">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-cpd-accent text-cpd-bg-primary rounded text-xs font-bold hover:bg-cpd-accent/80 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
