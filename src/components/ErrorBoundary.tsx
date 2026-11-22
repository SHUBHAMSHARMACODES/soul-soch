import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F6F2EA] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl p-8 text-center shadow-sm">
            <h2 className="font-serif-display text-2xl font-semibold text-[#1D1B18] mb-3">
              Something interrupted the reading room
            </h2>
            <p className="text-sm text-[#5B554B] mb-6 leading-relaxed">
              We encountered an unexpected issue loading content. Please refresh the page to continue reading.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#1D1B18] text-[#FBF9F5] text-sm font-medium rounded-lg hover:bg-[#332F2A] transition-colors cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
