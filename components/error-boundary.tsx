'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>
}

const DefaultErrorFallback = ({ error, retry }: { error?: Error; retry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Une erreur s'est produite
      </h2>
      <p className="text-gray-600 mb-4">
        Nous nous excusons pour ce désagrément. Veuillez réessayer.
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="text-left mb-4 p-3 bg-gray-100 rounded text-sm">
          <summary className="cursor-pointer font-medium">Détails de l'erreur</summary>
          <pre className="mt-2 text-red-600 whitespace-pre-wrap">{error.message}</pre>
        </details>
      )}
      <button
        onClick={retry}
        className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
      >
        Réessayer
      </button>
    </div>
  </div>
)

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} retry={this.retry} />
    }

    return this.props.children
  }
}
