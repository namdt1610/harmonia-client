/**
 * Debug utility for invalid track references in frontend
 * Helps identify and clear stale track data
 */

import { store } from '@/redux/store'

export interface DebugInfo {
    reduxState: {
        player: any
        queue: any
    }
    apiCache: any[]
    localStorage: Record<string, any>
    sessionStorage: Record<string, any>
}

export function getDebugInfo(): DebugInfo {
    const state = store.getState()

    // Get localStorage data
    const localStorageData: Record<string, any> = {}
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
            try {
                localStorageData[key] = JSON.parse(
                    localStorage.getItem(key) || 'null'
                )
            } catch {
                localStorageData[key] = localStorage.getItem(key)
            }
        }
    }

    // Get sessionStorage data
    const sessionStorageData: Record<string, any> = {}
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key) {
            try {
                sessionStorageData[key] = JSON.parse(
                    sessionStorage.getItem(key) || 'null'
                )
            } catch {
                sessionStorageData[key] = sessionStorage.getItem(key)
            }
        }
    }

    // Get RTK Query cache
    const apiCache: any[] = []
    // @ts-ignore - accessing internal RTK Query state
    if (state.tracksApi?.queries) {
        Object.entries(state.tracksApi.queries).forEach(([key, value]) => {
            apiCache.push({ api: 'tracksApi', key, value })
        })
    }
    // @ts-ignore
    if (state.queueApi?.queries) {
        Object.entries(state.queueApi.queries).forEach(([key, value]) => {
            apiCache.push({ api: 'queueApi', key, value })
        })
    }
    // @ts-ignore
    if (state.userApi?.queries) {
        Object.entries(state.userApi.queries).forEach(([key, value]) => {
            apiCache.push({ api: 'userApi', key, value })
        })
    }

    return {
        reduxState: {
            player: state.player,
            queue: state.queue,
        },
        apiCache,
        localStorage: localStorageData,
        sessionStorage: sessionStorageData,
    }
}

export function logDebugInfo() {
    const info = getDebugInfo()

    console.group('DEBUG Debug Invalid Tracks')

    console.group('STORAGE Redux State')
    console.log('Player:', info.reduxState.player)
    console.log('Queue:', info.reduxState.queue)
    console.groupEnd()

    console.group('CACHE API Cache')
    info.apiCache.forEach((item) => {
        console.log(`${item.api}.${item.key}:`, item.value)
    })
    console.groupEnd()

    console.group('STORAGE Browser Storage')
    console.log('localStorage:', info.localStorage)
    console.log('sessionStorage:', info.sessionStorage)
    console.groupEnd()

    console.groupEnd()

    return info
}

export function findInvalidTrackReferences(debugInfo?: DebugInfo): string[] {
    const info = debugInfo || getDebugInfo()
    const invalidTrackIds: string[] = []

    // Check Redux player state
    if (info.reduxState.player?.currentTrack) {
        const trackId = info.reduxState.player.currentTrack.toString()
        if (trackId === '1156' || parseInt(trackId) > 1000) {
            invalidTrackIds.push(`player.currentTrack: ${trackId}`)
        }
    }

    // Check Redux queue
    if (info.reduxState.player?.queue) {
        info.reduxState.player.queue.forEach((track: any, index: number) => {
            if (track.id === 1156 || track.id > 1000) {
                invalidTrackIds.push(`player.queue[${index}]: ${track.id}`)
            }
        })
    }

    // Check API cache
    info.apiCache.forEach((item) => {
        const dataStr = JSON.stringify(item.value)
        if (dataStr.includes('1156')) {
            invalidTrackIds.push(`${item.api}.${item.key}: contains 1156`)
        }
    })

    // Check browser storage
    Object.entries(info.localStorage).forEach(([key, value]) => {
        const valueStr = JSON.stringify(value)
        if (valueStr.includes('1156')) {
            invalidTrackIds.push(`localStorage.${key}: contains 1156`)
        }
    })

    Object.entries(info.sessionStorage).forEach(([key, value]) => {
        const valueStr = JSON.stringify(value)
        if (valueStr.includes('1156')) {
            invalidTrackIds.push(`sessionStorage.${key}: contains 1156`)
        }
    })

    return invalidTrackIds
}

export function clearAllCache() {
    console.log('Clearing all frontend cache...')

    // Clear Redux state
    const { clearQueue } = require('@/modules/player/slice')
    store.dispatch(clearQueue())

    // Clear RTK Query cache
    const apis = ['tracksApi', 'queueApi', 'userApi', 'playlistsApi']
    apis.forEach((apiName) => {
        // @ts-ignore
        if (store.getState()[apiName]) {
            // @ts-ignore
            store.dispatch({ type: `${apiName}/resetApiState` })
        }
    })

    // Clear browser storage (be selective)
    const keysToRemove = Object.keys(localStorage).filter(
        (key) =>
            key.includes('track') ||
            key.includes('queue') ||
            key.includes('player') ||
            key.includes('rtk')
    )

    keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
        console.log(`Removed localStorage.${key}`)
    })

    // Clear session storage completely
    sessionStorage.clear()
    console.log('Cleared sessionStorage')

    console.log('Cache cleared! Please refresh the page.')
}

// Make these available globally for debugging
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.debugInvalidTracks = {
        getDebugInfo,
        logDebugInfo,
        findInvalidTrackReferences,
        clearAllCache,
    }

    console.log('DEBUG Debug tools available: window.debugInvalidTracks')
}
