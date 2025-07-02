import { useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setQueue, setCurrentTrack } from '@/modules/queue/slice'
import { queueApi } from '@/modules/queue/api'
import { RootState } from '@/redux/store'
import { useAppSelector } from '@/redux/hooks'
import { createLogger } from '@/lib/utils/debugLogger'
import { isValidTrackId } from '@/lib/invalidTrackHandler'

// Tạo logger cho WebSocket
const wsLogger = createLogger('WEBSOCKET')

export const useQueueWebSocket = () => {
    const dispatch = useDispatch()
    const accessToken = useSelector(
        (state: RootState) => state.auth.accessToken
    )
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)
    const ws = useRef<WebSocket | null>(null)
    const reconnectAttempts = useRef(0)
    const maxReconnectAttempts = 5
    const pingInterval = useRef<NodeJS.Timeout | null>(null)
    const lastSyncTimestamp = useRef<string | null>(null)
    const syncCheckInterval = useRef<NodeJS.Timeout | null>(null)
    const authInitialized = useRef(false)
    const { isLoggedIn: appIsLoggedIn, accessToken: appAccessToken } =
        useAppSelector((state) => state.auth)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const messageQueueRef = useRef<any[]>([])
    const connectionStatusRef = useRef<
        'disconnected' | 'connecting' | 'connected'
    >('disconnected')
    const pendingMessagesRef = useRef<
        Array<{ message: any; timestamp: number }>
    >([])
    const lastConnectionAttemptRef = useRef<number>(0)
    const reconnectDelay = 3000

    const connect = useCallback(() => {
        // Don't connect if not logged in or no access token
        if (!isLoggedIn || !accessToken) {
            wsLogger.logOnChange(
                'skipConnection',
                { isLoggedIn, hasToken: !!accessToken },
                'WebSocket connection skipped: Not authenticated or no access token'
            )
            return
        }

        // Don't create a new connection if one is already connecting or open
        if (
            ws.current &&
            (ws.current.readyState === WebSocket.CONNECTING ||
                ws.current.readyState === WebSocket.OPEN)
        ) {
            wsLogger.log('WebSocket already connecting or connected, skipping')
            return
        }

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

        // Debug: Log token from Redux state
        wsLogger.logOnChange(
            'tokenInfo',
            accessToken ? accessToken.substring(0, 20) + '...' : null,
            'Token from Redux state:'
        )

        let wsUrl = `${protocol}//localhost:8000/ws/queue/`

        // Add token as query parameter if available
        if (accessToken) {
            wsUrl += `?token=${encodeURIComponent(accessToken)}`
        }

        wsLogger.log(
            'WebSocket URL:',
            wsUrl.replace(/token=[^&]+/, 'token=***')
        )
        wsLogger.log('Creating new WebSocket connection...')

        // Create WebSocket connection
        ws.current = new WebSocket(wsUrl)
        connectionStatusRef.current = 'connecting'

        // Add connection state logging
        ws.current.addEventListener('readystatechange', () => {
            const state = ws.current?.readyState
            let stateText = 'UNKNOWN'
            switch (state) {
                case WebSocket.CONNECTING:
                    stateText = 'CONNECTING'
                    break
                case WebSocket.OPEN:
                    stateText = 'OPEN'
                    break
                case WebSocket.CLOSING:
                    stateText = 'CLOSING'
                    break
                case WebSocket.CLOSED:
                    stateText = 'CLOSED'
                    break
            }
            wsLogger.logOnChange(
                'connectionState',
                { state: stateText, timestamp: Date.now() },
                'WebSocket state changed to:'
            )
        })

        ws.current.onopen = () => {
            connectionStatusRef.current = 'connected'
            reconnectAttempts.current = 0

            const stateText = getReadyStateText(ws.current?.readyState)
            wsLogger.logOnChange(
                'connectionState',
                { state: stateText, timestamp: Date.now() },
                'WebSocket state changed to:'
            )
            wsLogger.log('WebSocket connected successfully')

            // Process pending messages
            if (pendingMessagesRef.current.length > 0) {
                pendingMessagesRef.current.forEach(({ message }) => {
                    if (ws.current?.readyState === WebSocket.OPEN) {
                        ws.current.send(JSON.stringify(message))
                    }
                })
                pendingMessagesRef.current = []
            }

            // Process queued messages
            if (messageQueueRef.current.length > 0) {
                messageQueueRef.current.forEach((message) => {
                    if (ws.current?.readyState === WebSocket.OPEN) {
                        ws.current.send(JSON.stringify(message))
                    }
                })
                messageQueueRef.current = []
            }

            // Wait a bit before sending initial requests to ensure connection is stable
            setTimeout(() => {
                if (ws.current?.readyState === WebSocket.OPEN) {
                    // Request initial queue data
                    ws.current.send(JSON.stringify({ type: 'get_queue' }))
                } else {
                    wsLogger.warn(
                        'WebSocket not in OPEN state after connection, skipping initial request'
                    )
                }
            }, 100)

            // Start ping/pong to keep connection alive
            pingInterval.current = setInterval(() => {
                if (ws.current?.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({ type: 'ping' }))
                }
            }, 30000) // Ping every 30 seconds

            // Start periodic sync check
            syncCheckInterval.current = setInterval(() => {
                if (ws.current?.readyState === WebSocket.OPEN) {
                    // Request queue data to verify sync
                    ws.current.send(JSON.stringify({ type: 'get_queue' }))
                }
            }, 60000) // Check sync every minute
        }

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                wsLogger.logOnChange(
                    'messageType',
                    data.type,
                    'WebSocket message received:'
                )

                if (
                    data.type === 'queue_update' ||
                    data.type === 'queue_sync'
                ) {
                    const { tracks, current_index, timestamp } = data.queue

                    // Verify sync timestamp if available
                    if (timestamp) {
                        const syncTime = new Date(timestamp)
                        const now = new Date()
                        const timeDiff = Math.abs(
                            now.getTime() - syncTime.getTime()
                        )

                        // If timestamp is more than 5 minutes old, request fresh data
                        if (timeDiff > 5 * 60 * 1000) {
                            wsLogger.warn(
                                'Queue data appears stale, requesting fresh data'
                            )
                            ws.current?.send(
                                JSON.stringify({ type: 'get_queue' })
                            )
                            return
                        }

                        lastSyncTimestamp.current = timestamp
                    }

                    // Update Redux state
                    dispatch(setQueue(tracks))

                    if (tracks[current_index]) {
                        const trackToSet = tracks[current_index].track

                        // Validate track ID before setting
                        if (
                            trackToSet &&
                            trackToSet.id &&
                            isValidTrackId(trackToSet.id)
                        ) {
                            dispatch(setCurrentTrack(trackToSet))
                        } else {
                            wsLogger.warn(
                                `Invalid track ID ${trackToSet?.id} received from WebSocket, skipping`
                            )
                            // Try to find a valid track in the queue
                            const validTrack = tracks.find(
                                (t) => t.track && isValidTrackId(t.track.id)
                            )
                            if (validTrack) {
                                dispatch(setCurrentTrack(validTrack.track))
                                wsLogger.log(
                                    `Set valid track ${validTrack.track.id} instead`
                                )
                            } else {
                                dispatch(setCurrentTrack(null))
                                wsLogger.warn('No valid tracks found in queue')
                            }
                        }
                    } else if (tracks.length > 0) {
                        // If current_index is invalid, set first valid track
                        const validTrack = tracks.find(
                            (t) => t.track && isValidTrackId(t.track.id)
                        )
                        if (validTrack) {
                            dispatch(setCurrentTrack(validTrack.track))
                            wsLogger.log(
                                `Set first valid track ${validTrack.track.id}`
                            )
                        } else {
                            dispatch(setCurrentTrack(null))
                            wsLogger.warn('No valid tracks found in queue')
                        }
                    } else {
                        // No tracks in queue
                        dispatch(setCurrentTrack(null))
                    }

                    // Invalidate RTK Query cache to trigger refetch in UI components
                    dispatch(queueApi.util.invalidateTags(['Queue']))

                    if (data.type === 'queue_sync') {
                        wsLogger.log('Queue synchronized:', data.message)
                    }
                } else if (data.type === 'pong') {
                    // Connection is alive
                    wsLogger.log('WebSocket pong received')
                } else if (data.type === 'error') {
                    wsLogger.error('WebSocket error:', data.message)
                    // Request fresh data on error
                    setTimeout(() => {
                        if (ws.current?.readyState === WebSocket.OPEN) {
                            ws.current.send(
                                JSON.stringify({ type: 'get_queue' })
                            )
                        }
                    }, 1000)
                } else {
                    wsLogger.warn('Unknown message type:', data.type)
                }
            } catch (error) {
                wsLogger.error('Error parsing WebSocket message:', error)
                // Request fresh data on parsing error
                setTimeout(() => {
                    if (ws.current?.readyState === WebSocket.OPEN) {
                        ws.current.send(JSON.stringify({ type: 'get_queue' }))
                    }
                }, 1000)
            }
        }

        ws.current.onclose = (event) => {
            connectionStatusRef.current = 'disconnected'
            wsLogger.logOnChange(
                'disconnection',
                {
                    code: event.code,
                    reason: event.reason,
                    timestamp: Date.now(),
                },
                'WebSocket disconnected'
            )

            // Clear intervals
            if (pingInterval.current) {
                clearInterval(pingInterval.current)
                pingInterval.current = null
            }
            if (syncCheckInterval.current) {
                clearInterval(syncCheckInterval.current)
                syncCheckInterval.current = null
            }

            // Only attempt reconnection if we're still authenticated and haven't exceeded max attempts
            if (
                isLoggedIn &&
                accessToken &&
                reconnectAttempts.current < maxReconnectAttempts &&
                !event.wasClean
            ) {
                reconnectAttempts.current += 1
                wsLogger.log(
                    `Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`
                )

                reconnectTimeoutRef.current = setTimeout(() => {
                    connect()
                }, reconnectDelay)
            }
        }

        ws.current.onerror = (error) => {
            wsLogger.error('WebSocket error:', error)
            connectionStatusRef.current = 'disconnected'
        }
    }, [dispatch, accessToken, isLoggedIn])

    const disconnect = useCallback(() => {
        if (pingInterval.current) {
            clearInterval(pingInterval.current)
            pingInterval.current = null
        }
        if (syncCheckInterval.current) {
            clearInterval(syncCheckInterval.current)
            syncCheckInterval.current = null
        }

        if (ws.current) {
            ws.current.close()
            ws.current = null
        }
        connectionStatusRef.current = 'disconnected'
        messageQueueRef.current = []
        pendingMessagesRef.current = []
        reconnectAttempts.current = 0
        wsLogger.log('WebSocket manually disconnected')
    }, [])

    const waitForConnection = useCallback(
        (timeout = 5000): Promise<boolean> => {
            return new Promise((resolve) => {
                if (ws.current?.readyState === WebSocket.OPEN) {
                    resolve(true)
                    return
                }

                const startTime = Date.now()
                const checkConnection = () => {
                    if (ws.current?.readyState === WebSocket.OPEN) {
                        resolve(true)
                    } else if (Date.now() - startTime > timeout) {
                        wsLogger.warn('WebSocket connection timeout')
                        resolve(false)
                    } else if (
                        ws.current?.readyState === WebSocket.CLOSED ||
                        ws.current?.readyState === WebSocket.CLOSING
                    ) {
                        wsLogger.warn('WebSocket connection failed or closed')
                        resolve(false)
                    } else {
                        setTimeout(checkConnection, 100)
                    }
                }
                checkConnection()
            })
        },
        []
    )

    const sendMessage = useCallback(
        async (message: any) => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify(message))
                return true
            } else if (ws.current?.readyState === WebSocket.CONNECTING) {
                wsLogger.warn(
                    'WebSocket is still connecting, waiting for connection...'
                )
                const connected = await waitForConnection(5000)
                if (connected) {
                    ws.current!.send(JSON.stringify(message))
                    wsLogger.log('Message sent after waiting for connection')
                    return true
                } else {
                    wsLogger.error(
                        'WebSocket connection timeout, message not sent:',
                        message
                    )
                    return false
                }
            } else {
                wsLogger.warn(
                    'WebSocket is not connected, attempting to reconnect...'
                )
                // Attempt to reconnect
                connect()
                const connected = await waitForConnection(5000)
                if (connected) {
                    ws.current!.send(JSON.stringify(message))
                    wsLogger.log('Message sent after reconnection')
                    return true
                } else {
                    wsLogger.error(
                        'Failed to send message after reconnection attempt'
                    )
                    return false
                }
            }
        },
        [connect, waitForConnection]
    )

    const requestSync = useCallback(() => {
        sendMessage({ type: 'get_queue' })
    }, [sendMessage])

    const getConnectionStatus = useCallback(() => {
        if (!ws.current) return 'NOT_CREATED'

        switch (ws.current.readyState) {
            case WebSocket.CONNECTING:
                return 'CONNECTING'
            case WebSocket.OPEN:
                return 'OPEN'
            case WebSocket.CLOSING:
                return 'CLOSING'
            case WebSocket.CLOSED:
                return 'CLOSED'
            default:
                return 'UNKNOWN'
        }
    }, [])

    const isConnected = useCallback(() => {
        return ws.current?.readyState === WebSocket.OPEN
    }, [])

    // Effect to handle authentication state changes
    useEffect(() => {
        const authState = { isLoggedIn, hasToken: !!accessToken }
        wsLogger.logOnChange(
            'authStateChange',
            authState,
            'WebSocket auth state change:'
        )

        if (isLoggedIn && accessToken) {
            // Authentication is ready, connect if not already connected
            if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
                wsLogger.log('Starting WebSocket connection...')
                // Small delay to ensure token refresh process is complete
                setTimeout(() => {
                    connect()
                }, 100)
            }
            authInitialized.current = true
        } else if (authInitialized.current) {
            // Was authenticated but now not, disconnect
            wsLogger.log('Authentication lost, disconnecting WebSocket')
            disconnect()
            authInitialized.current = false
        } else {
            wsLogger.logOnChange(
                'waitingAuth',
                { isLoggedIn, hasToken: !!accessToken, timestamp: Date.now() },
                'WebSocket waiting for authentication...'
            )
        }
    }, [isLoggedIn, accessToken, connect, disconnect])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect()
        }
    }, [disconnect])

    // Helper function to get readable state text
    const getReadyStateText = (readyState?: number) => {
        switch (readyState) {
            case WebSocket.CONNECTING:
                return 'CONNECTING'
            case WebSocket.OPEN:
                return 'OPEN'
            case WebSocket.CLOSING:
                return 'CLOSING'
            case WebSocket.CLOSED:
                return 'CLOSED'
            default:
                return 'UNKNOWN'
        }
    }

    return {
        ws: ws.current,
        sendMessage,
        disconnect,
        reconnect: connect,
        requestSync,
        isConnected,
        getConnectionStatus,
        waitForConnection,
        lastSyncTimestamp: lastSyncTimestamp.current,
    }
}
