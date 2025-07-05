'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    User,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Settings,
    Crown,
} from 'lucide-react'
import PlaylistSection from '@/components/shared/PlaylistSection'
import DefaultLogo from '@/assets/images/default-logo.png'
import { cn } from '@/lib/clsx'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useGetMySubscriptionQuery } from '@/lib/api/subscription'

interface SidebarProps {
    locale: string
}

export default function Sidebar({ locale }: SidebarProps) {
    // Default sidebar states and constraints
    const [width, setWidth] = useState(280) // Default width
    const [collapsed, setCollapsed] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const MIN_WIDTH = 90
    const MAX_WIDTH = 400
    const COLLAPSED_WIDTH = 80
    const EXPANDED_WIDTH = 280

    // Resize handling
    const isDragging = useRef(false)
    const startX = useRef(0)
    const startWidth = useRef(width)
    const sidebarRef = useRef<HTMLDivElement>(null)

    // Get user and subscription data
    const { user, isLoggedIn } = useSelector((state: RootState) => state.auth)
    const { data: subscription } = useGetMySubscriptionQuery(undefined, {
        skip: !isLoggedIn,
    })

    // Helper function to get subscription status display
    const getSubscriptionStatus = () => {
        if (!subscription) {
            return { text: 'Free', variant: 'secondary' as const }
        }

        if (subscription.plan.plan_type === 'FREE') {
            return { text: 'Free', variant: 'secondary' as const }
        }

        if (subscription.status === 'ACTIVE') {
            return { text: 'Premium', variant: 'default' as const }
        }

        if (subscription.status === 'TRIAL') {
            return { text: 'Trial', variant: 'default' as const }
        }

        return { text: 'Free', variant: 'secondary' as const }
    }

    // Handle quick collapse/expand with smooth transition
    const toggleSidebar = () => {
        setIsTransitioning(true)

        if (collapsed) {
            setCollapsed(false)
            // Let the DOM update the collapsed state first
            requestAnimationFrame(() => {
                setWidth(EXPANDED_WIDTH)
            })
        } else {
            setWidth(COLLAPSED_WIDTH)
            // Only update the collapsed state after width transition has started
            requestAnimationFrame(() => {
                setCollapsed(true)
            })
        }

        // Reset transitioning state after animation completes
        const transitionDuration = 300 // Match the duration in the CSS transition
        setTimeout(() => {
            setIsTransitioning(false)
        }, transitionDuration)
    }

    // Resize handlers
    const handleMouseDown = (event: React.MouseEvent) => {
        if (isTransitioning) return // Prevent resizing during transitions
        isDragging.current = true
        startX.current = event.clientX
        startWidth.current = width
        document.documentElement.classList.add('cursor-ew-resize')
        document.addEventListener('selectstart', preventSelection)
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging.current) return
        const delta = event.clientX - startX.current
        const newWidth = Math.max(
            MIN_WIDTH,
            Math.min(MAX_WIDTH, startWidth.current + delta)
        )
        setWidth(newWidth)

        // Only update collapsed state if not actively transitioning
        if (!isTransitioning) {
            setCollapsed(newWidth <= MIN_WIDTH + 10)
        }
    }

    const handleMouseUp = () => {
        isDragging.current = false
        document.documentElement.classList.remove('cursor-ew-resize')
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('selectstart', preventSelection)

        // Add a short transition when snapping
        setIsTransitioning(true)

        // Snap to collapsed or minimum expanded width
        if (width < MIN_WIDTH + 30) {
            setWidth(COLLAPSED_WIDTH)
            setCollapsed(true)
        } else if (width < MIN_WIDTH + 60) {
            setWidth(MIN_WIDTH)
        }

        // Reset transitioning flag after animation
        setTimeout(() => {
            setIsTransitioning(false)
        }, 300)
    }

    const preventSelection = (event: Event) => {
        event.preventDefault()
    }

    return (
        <div
            className={cn(
                'relative h-full flex-shrink-0 transition-all',
                isTransitioning ? 'duration-300 ease-out' : 'duration-0'
            )}
            style={{ width }}
        >
            <aside
                ref={sidebarRef}
                className={cn(
                    'h-full flex flex-col bg-black border-r border-neutral-800/50 w-full',
                    isTransitioning
                        ? 'transition-all duration-300 ease-out'
                        : ''
                )}
            >
                {/* Logo section */}
                <div className="flex items-center p-4 h-16">
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-3"
                    >
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-1.5 flex items-center justify-center">
                            <Image
                                src={DefaultLogo}
                                alt="Spotify"
                                width={collapsed ? 28 : 24}
                                height={collapsed ? 28 : 24}
                                className="object-contain transition-all duration-300"
                            />
                        </div>
                        <span
                            className={cn(
                                'text-xl font-semibold tracking-tight transition-all duration-300',
                                collapsed
                                    ? 'opacity-0 w-0 overflow-hidden'
                                    : 'opacity-100 w-auto'
                            )}
                        >
                            Harmonia
                        </span>
                    </Link>
                </div>

                {/* Divider */}
                <div className="mx-3 h-px bg-neutral-800 my-2"></div>

                {/* Playlists section - takes up remaining space with scrolling */}
                <div className="flex-1 overflow-hidden">
                    <PlaylistSection isCollapsed={collapsed} />
                </div>

                {/* Bottom user section */}
                <div className="border-t border-neutral-800/50 p-3">
                    {isLoggedIn ? (
                        <div className="flex items-center justify-between">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-2 w-full justify-start px-2 py-1.5 h-auto rounded-md hover:bg-neutral-800/80"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
                                            <User
                                                size={16}
                                                className="text-white"
                                            />
                                        </div>

                                        <div
                                            className={cn(
                                                'truncate flex-1 text-left transition-all duration-300',
                                                collapsed
                                                    ? 'opacity-0 w-0 overflow-hidden'
                                                    : 'opacity-100 w-auto'
                                            )}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-sm font-medium truncate">
                                                    {user?.display_name ||
                                                        'User'}
                                                </p>
                                                <Badge
                                                    variant={
                                                        getSubscriptionStatus()
                                                            .variant
                                                    }
                                                    className={cn(
                                                        'text-xs px-1.5 py-0 h-4 border-none',
                                                        getSubscriptionStatus()
                                                            .variant ===
                                                            'default'
                                                            ? 'bg-yellow-500/20 text-yellow-300'
                                                            : 'bg-gray-500/20 text-gray-400'
                                                    )}
                                                >
                                                    {
                                                        getSubscriptionStatus()
                                                            .text
                                                    }
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-neutral-400 truncate">
                                                {user?.email ||
                                                    'user@example.com'}
                                            </p>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    align="start"
                                    sideOffset={8}
                                    className="w-56"
                                >
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Crown className="mr-2 h-4 w-4" />
                                        <span>Subscription</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-400">
                                {collapsed
                                    ? '?'
                                    : 'Sign in to access your music'}
                            </p>
                            {!collapsed && (
                                <Button
                                    size="sm"
                                    className="w-full bg-white text-black hover:bg-gray-200"
                                    onClick={() =>
                                        (window.location.href = `/${locale}/login`)
                                    }
                                >
                                    Sign In
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </aside>

            {/* Resize handle - now positioned at the right edge of the sidebar container */}
            <div
                className={cn(
                    'absolute top-0 right-0 h-full w-3 cursor-ew-resize z-20',
                    'hover:bg-primary/20 active:bg-primary/30',
                    isDragging.current && 'bg-primary/30',
                    isTransitioning && 'pointer-events-none' // Disable during transitions
                )}
                onMouseDown={handleMouseDown}
            />

            {/* Collapse/expand button */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            disabled={isTransitioning}
                            className={cn(
                                'absolute -right-3 top-20 h-6 w-6 rounded-full bg-neutral-800 shadow-md border border-neutral-700 hover:scale-105 transition-all p-0 z-20',
                                isTransitioning ? 'opacity-50' : 'opacity-100'
                            )}
                        >
                            {collapsed ? (
                                <ChevronRight className="h-3 w-3 transition-transform duration-300" />
                            ) : (
                                <ChevronLeft className="h-3 w-3 transition-transform duration-300" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        {collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}
