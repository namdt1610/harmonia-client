// Debug logging utility
export const DEBUG_CONFIG = {
    // Bật/tắt các loại logging
    AUTH: false, // Auth-related logs
    API: false, // API request/response logs
    WEBSOCKET: false, // WebSocket logs
    RENDER: false, // Component render logs

    // Chỉ bật trong development
    ENABLED: process.env.NODE_ENV === 'development',
}

// Utility để track previous values và chỉ log khi có thay đổi
export const createChangeTracker = () => {
    const prevValues = new Map<string, any>()

    return (key: string, currentValue: any, forceLog = false) => {
        if (!DEBUG_CONFIG.ENABLED) return false

        const prevValue = prevValues.get(key)
        const hasChanged =
            JSON.stringify(prevValue) !== JSON.stringify(currentValue)

        if (hasChanged || forceLog) {
            prevValues.set(key, currentValue)
            return true
        }
        return false
    }
}

// Tạo logger cho từng module
export const createLogger = (module: keyof typeof DEBUG_CONFIG) => {
    const tracker = createChangeTracker()

    return {
        // Log thông thường
        log: (message: string, ...args: any[]) => {
            if (DEBUG_CONFIG.ENABLED && DEBUG_CONFIG[module]) {
                console.log(`[${module}]`, message, ...args)
            }
        },

        // Log khi có thay đổi
        logOnChange: (
            key: string,
            value: any,
            message: string,
            forceLog = false
        ) => {
            if (
                DEBUG_CONFIG.ENABLED &&
                DEBUG_CONFIG[module] &&
                tracker(key, value, forceLog)
            ) {
                console.log(`[${module}]`, message, value)
            }
        },

        // Log warning
        warn: (message: string, ...args: any[]) => {
            if (DEBUG_CONFIG.ENABLED && DEBUG_CONFIG[module]) {
                console.warn(`[${module}]`, message, ...args)
            }
        },

        // Log error (luôn hiện)
        error: (message: string, ...args: any[]) => {
            console.error(`[${module}]`, message, ...args)
        },

        // Group logging
        group: (label: string, callback: () => void) => {
            if (DEBUG_CONFIG.ENABLED && DEBUG_CONFIG[module]) {
                console.group(`[${module}] ${label}`)
                callback()
                console.groupEnd()
            }
        },
    }
}
