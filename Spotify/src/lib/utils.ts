export function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

/**
 * Format a duration in seconds to mm:ss format
 */
export const formatDuration = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00'

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Sidebar visibility control - using event bus pattern
const sidebarEventListeners: { [key: string]: (() => void)[] } = {
    'toggle-queue': [],
}

export const sidebarEvents = {
    /**
     * Toggle the queue sidebar
     */
    toggleQueue: () => {
        sidebarEventListeners['toggle-queue'].forEach((listener) => listener())
    },

    /**
     * Subscribe to sidebar events
     */
    on: (event: 'toggle-queue', callback: () => void) => {
        sidebarEventListeners[event].push(callback)
        return () => {
            sidebarEventListeners[event] = sidebarEventListeners[event].filter(
                (cb) => cb !== callback
            )
        }
    },
}
