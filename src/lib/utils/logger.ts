// Helper functions
const isDevelopment = () => process.env.NODE_ENV === 'development'
const isProduction = () => process.env.NODE_ENV === 'production'

export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
}

interface LogEntry {
    level: LogLevel
    message: string
    timestamp: Date
    context?: Record<string, unknown>
    userId?: string
    sessionId?: string
}

interface LoggerConfig {
    level: LogLevel
    enableConsole: boolean
    enableRemote: boolean
    enableStorage: boolean
    maxStorageEntries: number
}

class Logger {
    private config: LoggerConfig
    private storage: LogEntry[] = []

    constructor(config: Partial<LoggerConfig> = {}) {
        this.config = {
            level: isDevelopment() ? LogLevel.DEBUG : LogLevel.WARN,
            enableConsole: isDevelopment(),
            enableRemote: isProduction(),
            enableStorage: true,
            maxStorageEntries: 1000,
            ...config,
        }
    }

    private shouldLog(level: LogLevel): boolean {
        return level <= this.config.level
    }

    private createLogEntry(
        level: LogLevel,
        message: string,
        context?: Record<string, unknown>
    ): LogEntry {
        return {
            level,
            message,
            timestamp: new Date(),
            context,
            userId: this.getUserId(),
            sessionId: this.getSessionId(),
        }
    }

    private formatConsoleMessage(entry: LogEntry): string {
        const timestamp = entry.timestamp.toISOString()
        const levelName = LogLevel[entry.level]
        const userId = entry.userId ? ` [${entry.userId}]` : ''
        return `[${timestamp}] ${levelName}${userId}: ${entry.message}`
    }

    private logToConsole(entry: LogEntry): void {
        if (!this.config.enableConsole) return

        const message = this.formatConsoleMessage(entry)
        const context = entry.context ? [entry.context] : []

        switch (entry.level) {
            case LogLevel.ERROR:
                console.error(message, ...context)
                break
            case LogLevel.WARN:
                console.warn(message, ...context)
                break
            case LogLevel.INFO:
                console.info(message, ...context)
                break
            case LogLevel.DEBUG:
                console.debug(message, ...context)
                break
        }
    }

    private logToStorage(entry: LogEntry): void {
        if (!this.config.enableStorage) return

        this.storage.push(entry)

        // Maintain max storage size
        if (this.storage.length > this.config.maxStorageEntries) {
            this.storage = this.storage.slice(-this.config.maxStorageEntries)
        }
    }

    private logToRemote(entry: LogEntry): void {
        if (!this.config.enableRemote) return

        // Send to remote logging service in production
        // This could be implemented with external logging services if needed
        if (isProduction()) {
            // Example: Send to analytics service
            // analytics.track('log_entry', entry)
        }
    }

    private log(
        level: LogLevel,
        message: string,
        context?: Record<string, unknown>
    ): void {
        if (!this.shouldLog(level)) return

        const entry = this.createLogEntry(level, message, context)

        this.logToConsole(entry)
        this.logToStorage(entry)
        this.logToRemote(entry)
    }

    private getUserId(): string | undefined {
        // Get current user ID from your auth system
        // This is a placeholder - implement based on your auth setup
        try {
            return typeof window !== 'undefined'
                ? localStorage.getItem('userId') || undefined
                : undefined
        } catch {
            return undefined
        }
    }

    private getSessionId(): string | undefined {
        // Get current session ID
        try {
            return typeof window !== 'undefined'
                ? sessionStorage.getItem('sessionId') || undefined
                : undefined
        } catch {
            return undefined
        }
    }

    // Public API
    error(message: string, context?: Record<string, unknown>): void {
        this.log(LogLevel.ERROR, message, context)
    }

    warn(message: string, context?: Record<string, unknown>): void {
        this.log(LogLevel.WARN, message, context)
    }

    info(message: string, context?: Record<string, unknown>): void {
        this.log(LogLevel.INFO, message, context)
    }

    debug(message: string, context?: Record<string, unknown>): void {
        this.log(LogLevel.DEBUG, message, context)
    }

    // Utility methods
    setUserId(userId: string): void {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem('userId', userId)
            }
        } catch (error) {
            this.warn('Failed to set user ID', { error })
        }
    }

    setSessionId(sessionId: string): void {
        try {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('sessionId', sessionId)
            }
        } catch (error) {
            this.warn('Failed to set session ID', { error })
        }
    }

    getLogs(level?: LogLevel, limit?: number): LogEntry[] {
        let logs =
            level !== undefined
                ? this.storage.filter((entry) => entry.level === level)
                : this.storage

        if (limit) {
            logs = logs.slice(-limit)
        }

        return logs
    }

    clearLogs(): void {
        this.storage = []
    }

    exportLogs(): string {
        return JSON.stringify(this.storage, null, 2)
    }

    // Performance logging
    time(label: string): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.time(label)
        }
    }

    timeEnd(label: string): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.timeEnd(label)
        }
    }

    // Group logging for complex operations
    group(label: string): void {
        if (this.config.enableConsole && this.shouldLog(LogLevel.DEBUG)) {
            console.group(label)
        }
    }

    groupEnd(): void {
        if (this.config.enableConsole && this.shouldLog(LogLevel.DEBUG)) {
            console.groupEnd()
        }
    }
}

// Create singleton instance
export const logger = new Logger()

// Convenience exports for backward compatibility
export const log = {
    error: (message: string, context?: Record<string, unknown>) =>
        logger.error(message, context),
    warn: (message: string, context?: Record<string, unknown>) =>
        logger.warn(message, context),
    info: (message: string, context?: Record<string, unknown>) =>
        logger.info(message, context),
    debug: (message: string, context?: Record<string, unknown>) =>
        logger.debug(message, context),
}

// Development helpers
if (isDevelopment()) {
    // Make logger available globally for debugging
    if (typeof window !== 'undefined') {
        ;(window as any).logger = logger
    }
}
