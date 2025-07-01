'use client'

import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import { Provider as ReduxProvider } from 'react-redux'
import { Suspense, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { store } from '@/redux/store'
import { logger } from '@/lib/utils/logger'
import { ErrorHandler } from '@/lib/errors'
import { PerformanceMonitor } from '@/lib/performance'

import { LoadingScreen } from './LoadingScreen'

interface ProvidersProps {
    children: React.ReactNode
    locale: string
    messages: any
}

function ErrorFallback({ error, resetErrorBoundary }: any) {
    useEffect(() => {
        // Log the error to our logging system
        logger.error('React Error Boundary caught error:', error)
        ErrorHandler.handleApiError(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center p-8 max-w-md">
                <h2 className="text-2xl font-bold text-destructive mb-4">
                    Something went wrong
                </h2>
                <p className="text-muted-foreground mb-6">
                    An unexpected error occurred. Please try refreshing the
                    page.
                </p>
                <button
                    onClick={resetErrorBoundary}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                    Try again
                </button>
            </div>
        </div>
    )
}

export function Providers({ children, locale, messages }: ProvidersProps) {
    useEffect(() => {
        // Initialize performance monitoring
        if (process.env.NODE_ENV === 'production') {
            // PerformanceMonitor.init() // TODO: Implement init method
        }

        // Initialize error handling
        // ErrorHandler.init() // TODO: Implement init method

        logger.info('Application providers initialized', {
            locale,
            environment: process.env.NODE_ENV,
            apiUrl: process.env.NEXT_PUBLIC_API_URL,
        })
    }, [locale])

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error: Error, errorInfo: any) => {
                logger.error('Error Boundary triggered:', {
                    error: error.message,
                    stack: error.stack,
                })
                ErrorHandler.handleApiError(error)
            }}
            onReset={() => {
                // Optionally reload the page or reset app state
                window.location.reload()
            }}
        >
            <ReduxProvider store={store}>
                <SessionProvider>
                    <NextIntlClientProvider messages={messages} locale={locale}>
                        <Suspense fallback={<LoadingScreen />}>
                            {children}
                        </Suspense>
                    </NextIntlClientProvider>
                </SessionProvider>
            </ReduxProvider>
        </ErrorBoundary>
    )
}
