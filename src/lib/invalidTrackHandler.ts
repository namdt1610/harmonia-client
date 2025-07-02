/**
 * Invalid Track Handler
 * Provides utilities to handle and recover from invalid track references
 */

import { toast } from 'sonner'

// Known invalid track IDs that should be blocked
const KNOWN_INVALID_IDS = [1156, 1203, 1185] // Add 1185 to the list

// Valid track ID range (based on current database)
const VALID_ID_RANGE = { min: 152, max: 999 }

export function isValidTrackId(trackId: number): boolean {
    return trackId >= VALID_ID_RANGE.min && trackId <= VALID_ID_RANGE.max
}

export function isKnownInvalidId(trackId: number): boolean {
    return KNOWN_INVALID_IDS.includes(trackId)
}

export function handleInvalidTrackError(trackId: number, context?: string) {
    const message = context
        ? `Track ${trackId} not found in ${context}`
        : `Track ${trackId} not found`

    console.warn(`BLOCKED ${message}`)

    if (isKnownInvalidId(trackId) || !isValidTrackId(trackId)) {
        console.error(
            `INVALID Invalid track ID ${trackId} detected - likely from stale cache`
        )

        toast.error(`Track not available`, {
            description:
                'This track may have been removed. Try refreshing the page.',
            duration: 5000,
        })

        // Add to known invalid IDs for future reference
        KNOWN_INVALID_IDS.push(trackId)

        return true // Handled
    }

    return false // Not handled, let normal error handling proceed
}

export function cleanInvalidTracksFromArray(tracks: any[]): any[] {
    return tracks.filter((track) => {
        const trackId = typeof track === 'number' ? track : track?.id
        if (!trackId || !isValidTrackId(trackId)) {
            console.warn(`Filtering out invalid track ID: ${trackId}`)
            return false
        }
        return true
    })
}

export function validateTrackQueue(queue: any[]): any[] {
    const validQueue = cleanInvalidTracksFromArray(queue)

    if (validQueue.length !== queue.length) {
        const removedCount = queue.length - validQueue.length
        toast.warning(`Removed ${removedCount} invalid tracks from queue`, {
            description: 'These tracks may have been deleted from the server.',
        })
    }

    return validQueue
}

// Utility to suggest alternative tracks when one is not found
export function suggestAlternativeTracks(invalidTrackId: number): number[] {
    // Simple strategy: suggest tracks around the valid range
    const suggestions = []

    if (invalidTrackId > VALID_ID_RANGE.max) {
        // If ID is too high, suggest recent tracks
        for (let i = VALID_ID_RANGE.max; i >= VALID_ID_RANGE.max - 5; i--) {
            suggestions.push(i)
        }
    } else if (invalidTrackId < VALID_ID_RANGE.min) {
        // If ID is too low, suggest early tracks
        for (let i = VALID_ID_RANGE.min; i <= VALID_ID_RANGE.min + 5; i++) {
            suggestions.push(i)
        }
    } else {
        // ID is in range but doesn't exist, suggest nearby tracks
        const nearby = [
            invalidTrackId - 2,
            invalidTrackId - 1,
            invalidTrackId + 1,
            invalidTrackId + 2,
            invalidTrackId + 3,
        ].filter((id) => id >= VALID_ID_RANGE.min && id <= VALID_ID_RANGE.max)

        suggestions.push(...nearby)
    }

    return suggestions.slice(0, 3) // Return max 3 suggestions
}

// Global error handler for track-related errors
export function setupGlobalTrackErrorHandler() {
    // Listen for unhandled API errors
    window.addEventListener('unhandledrejection', (event) => {
        const error = event.reason

        // Check if this is a track-related 404 error
        if (error?.status === 404 && error?.data?.error?.includes?.('Track')) {
            const trackIdMatch = error.data.error.match(/track\s*(\d+)/i)
            if (trackIdMatch) {
                const trackId = parseInt(trackIdMatch[1])
                if (handleInvalidTrackError(trackId, 'API request')) {
                    event.preventDefault() // Prevent the error from bubbling up
                }
            }
        }
    })

    console.log('Global track error handler initialized')
}

// Clear RTK Query cache for invalid tracks
export function clearInvalidTrackCache() {
    if (typeof window !== 'undefined') {
        // Clear RTK Query cache
        const store = (window as any).__REDUX_STORE__
        if (store) {
            // Clear track API cache
            store.dispatch({ type: 'trackApi/resetApiState' })
            store.dispatch({ type: 'queueApi/resetApiState' })
            console.log('Cleared RTK Query cache for invalid tracks')
        }

        // Clear localStorage
        localStorage.removeItem('persist:root')
        console.log('Cleared persisted state')

        toast.success('Cache cleared. Please refresh the page.', {
            duration: 5000,
            action: {
                label: 'Refresh',
                onClick: () => window.location.reload(),
            },
        })
    }
}

// Initialize on load
if (typeof window !== 'undefined') {
    setupGlobalTrackErrorHandler()
}
