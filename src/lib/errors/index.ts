/**
 * Error codes used throughout the application
 */
export const ERROR_CODES = {
    // Authentication & Authorization
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',

    // Validation
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',

    // Network
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT',

    // File handling
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',

    // General
    SERVER_ERROR: 'SERVER_ERROR',
    NOT_FOUND: 'NOT_FOUND',
} as const

/**
 * Custom Application Error Class
 * Provides structured error handling across the application
 */
export class AppError extends Error {
    public readonly code: string
    public readonly statusCode: number
    public readonly isOperational: boolean
    public readonly timestamp: Date
    public readonly context?: Record<string, unknown>

    constructor(
        message: string,
        code: string = ERROR_CODES.SERVER_ERROR,
        statusCode: number = 500,
        isOperational: boolean = true,
        context?: Record<string, unknown>
    ) {
        super(message)

        this.name = 'AppError'
        this.code = code
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.timestamp = new Date()
        this.context = context

        // Maintains proper stack trace for V8
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError)
        }
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            timestamp: this.timestamp.toISOString(),
            context: this.context,
        }
    }
}

/**
 * Predefined Error Types
 */
export class AuthenticationError extends AppError {
    constructor(
        message: string = 'Authentication required',
        context?: Record<string, unknown>
    ) {
        super(message, ERROR_CODES.UNAUTHORIZED, 401, true, context)
    }
}

export class AuthorizationError extends AppError {
    constructor(
        message: string = 'Insufficient permissions',
        context?: Record<string, unknown>
    ) {
        super(message, ERROR_CODES.FORBIDDEN, 403, true, context)
    }
}

export class ValidationError extends AppError {
    constructor(message: string, context?: Record<string, unknown>) {
        super(message, ERROR_CODES.VALIDATION_ERROR, 400, true, context)
    }
}

export class NetworkError extends AppError {
    constructor(
        message: string = 'Network request failed',
        context?: Record<string, unknown>
    ) {
        super(message, ERROR_CODES.NETWORK_ERROR, 0, true, context)
    }
}

export class NotFoundError extends AppError {
    constructor(
        resource: string = 'Resource',
        context?: Record<string, unknown>
    ) {
        super(`${resource} not found`, 'NOT_FOUND', 404, true, context)
    }
}

/**
 * Error Handler Utility
 */
export class ErrorHandler {
    /**
     * Handles API errors and converts them to AppError instances
     */
    static handleApiError(error: unknown): AppError {
        if (error instanceof AppError) {
            return error
        }

        if (error instanceof Error) {
            // Network timeout
            if (
                error.name === 'AbortError' ||
                error.message.includes('timeout')
            ) {
                return new AppError(
                    'Request timeout. Please try again.',
                    ERROR_CODES.TIMEOUT,
                    408,
                    true,
                    { originalError: error.message }
                )
            }

            // Network error
            if (
                error.message.includes('fetch') ||
                error.message.includes('network')
            ) {
                return new NetworkError(
                    'Network connection error. Please check your internet connection.',
                    {
                        originalError: error.message,
                    }
                )
            }

            return new AppError(
                error.message,
                ERROR_CODES.SERVER_ERROR,
                500,
                true,
                {
                    originalError: error.message,
                    stack: error.stack,
                }
            )
        }

        // Handle Axios errors
        if (isAxiosError(error)) {
            const axiosError = error as any
            const status = axiosError.response?.status || 500
            const message =
                axiosError.response?.data?.message || axiosError.message
            const code = getErrorCodeFromStatus(status)

            return new AppError(message, code, status, true, {
                url: axiosError.config?.url,
                method: axiosError.config?.method,
                responseData: axiosError.response?.data,
            })
        }

        // Fallback for unknown errors
        return new AppError(
            'An unexpected error occurred',
            ERROR_CODES.SERVER_ERROR,
            500,
            false,
            { originalError: String(error) }
        )
    }

    /**
     * Determines if an error should be retried
     */
    static isRetryableError(error: AppError): boolean {
        return (
            error.isOperational &&
            [408, 429, 500, 502, 503, 504].includes(error.statusCode)
        )
    }

    /**
     * Creates user-friendly error messages
     */
    static getUserMessage(error: AppError): string {
        const userMessages: Record<string, string> = {
            [ERROR_CODES.UNAUTHORIZED]: 'Please log in to continue',
            [ERROR_CODES.FORBIDDEN]:
                "You don't have permission to perform this action",
            [ERROR_CODES.NETWORK_ERROR]:
                'Connection problem. Please check your internet',
            [ERROR_CODES.TIMEOUT]: 'Request took too long. Please try again',
            [ERROR_CODES.FILE_TOO_LARGE]:
                'File is too large. Please select a smaller file',
            [ERROR_CODES.INVALID_FILE_TYPE]:
                'Invalid file type. Please select a supported format',
            [ERROR_CODES.VALIDATION_ERROR]:
                'Please check your input and try again',
        }

        return (
            userMessages[error.code] || 'Something went wrong. Please try again'
        )
    }
}

/**
 * Error Boundary Configuration
 */
export const ERROR_BOUNDARY_CONFIG = {
    createFallbackMessage: (componentName: string) => ({
        title: 'Something went wrong',
        description: `An error occurred in ${componentName}. Please try again.`,
        actionText: 'Try again',
    }),
}

// Helper functions
function isAxiosError(error: any): boolean {
    return error?.isAxiosError === true
}

function getErrorCodeFromStatus(status: number): string {
    switch (status) {
        case 400:
            return ERROR_CODES.VALIDATION_ERROR
        case 401:
            return ERROR_CODES.UNAUTHORIZED
        case 403:
            return ERROR_CODES.FORBIDDEN
        case 408:
            return ERROR_CODES.TIMEOUT
        case 422:
            return ERROR_CODES.INVALID_INPUT
        default:
            return ERROR_CODES.SERVER_ERROR
    }
}

/**
 * Error Reporting Service
 */
export class ErrorReporter {
    static report(error: AppError, context?: Record<string, unknown>) {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.group('🚨 Error Report')
            console.error('Error:', error)
            console.log('Context:', { ...error.context, ...context })
            console.groupEnd()
        }

        // Report to external service in production
        if (process.env.NODE_ENV === 'production') {
            // Integrate with external error tracking services if needed
        }
    }
}
