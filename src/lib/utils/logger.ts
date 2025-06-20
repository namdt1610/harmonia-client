const isDev = process.env.NODE_ENV === 'development'

export const logger = {
    info: (...args: string[]) => {
        if (isDev) {
            console.info('[INFO]', ...args)
        }
    },
    debug: (...args: string[]) => {
        if (isDev) {
            console.debug('[DEBUG]', ...args)
        }
    },
    warn: (...args: string[]) => {
        if (isDev) {
            console.warn('[WARN]', ...args)
        }
    },
    error: (...args: unknown[]) => {
        if (isDev) {
            console.error('[ERROR]', ...args)
        }
    },
}
