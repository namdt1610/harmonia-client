import {
    User,
    Home,
    BellRing,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import SearchBar from '@/components/layouts/SearchBar'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/clsx'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { useLogout } from '@/hooks/useLogout'

interface TopBarProps {
    onSearchResults: (results: any) => void
}

export default function TopBar({ onSearchResults }: TopBarProps) {
    const t = useTranslations('TopBar')
    const { isLoggedIn, user } = useSelector((state: RootState) => state.auth)
    const router = useRouter()
    const pathname = usePathname()
    const locale = pathname?.split('/')[1] || 'en'
    const { logout, isLoggingOut } = useLogout()

    return (
        <header className="h-16 bg-black/80 backdrop-filter backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 border-b border-neutral-800/50">
            {/* Left Section: Navigation Controls */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full w-8 h-8 bg-black/60"
                        onClick={() => router.back()}
                        aria-label="Back"
                    >
                        <ChevronLeft size={16} />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full w-8 h-8 bg-black/60"
                        onClick={() => router.forward()}
                        aria-label="Forward"
                    >
                        <ChevronRight size={16} />
                    </Button>
                </div>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    'rounded-full w-8 h-8 ml-2',
                                    pathname === `/${locale}`
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-black/60 hover:bg-neutral-800'
                                )}
                                asChild
                            >
                                <Link href={`/${locale}`}>
                                    <Home size={16} />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Home</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Center Section: Search */}
            <div className="flex-1 max-w-xl px-4">
                <SearchBar onSearchResults={onSearchResults} />
            </div>

            {/* Right Section: User */}
            <div className="flex items-center gap-3">
                {isLoggedIn ? (
                    <>
                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full text-xs font-semibold px-4 py-1 h-8 border-neutral-700 bg-transparent hover:bg-neutral-800 hover:border-neutral-600"
                        >
                            <ExternalLink size={12} className="mr-1.5" />
                            {t('upgrade', { fallback: 'Upgrade' })}
                        </Button>

                        <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-full w-8 h-8 bg-black/60"
                        >
                            <BellRing size={16} />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="rounded-full h-8 p-0 bg-transparent hover:bg-transparent"
                                >
                                    <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                                        <AvatarImage
                                            src={user?.avatar || ''}
                                            alt={user?.display_name || 'User'}
                                        />
                                        <AvatarFallback className="bg-neutral-700 text-xs">
                                            {user?.display_name?.charAt(0) ||
                                                'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">
                                            {user?.display_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {user?.is_superuser && (
                                    <>
                                        <DropdownMenuItem>
                                            <Link href="http://localhost:3030/admin/">
                                                Admin Panel
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                <DropdownMenuItem
                                    onClick={() =>
                                        router.push(`/${locale}/profile`)
                                    }
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        router.push(`/${locale}/settings`)
                                    }
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={logout}
                                    disabled={isLoggingOut}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>
                                        {isLoggingOut
                                            ? 'Logging out...'
                                            : 'Log out'}
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            className="text-neutral-400 hover:text-white hover:bg-transparent"
                            onClick={() =>
                                (window.location.href = `/${locale}/register`)
                            }
                        >
                            Sign up
                        </Button>
                        <Button
                            className="bg-white hover:bg-white/90 text-black font-semibold rounded-full"
                            onClick={() =>
                                (window.location.href = `/${locale}/login`)
                            }
                        >
                            Log in
                        </Button>
                    </div>
                )}
            </div>
        </header>
    )
}
