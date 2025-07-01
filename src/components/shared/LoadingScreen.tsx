import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Music, Volume2 } from 'lucide-react'
import { cn } from '@/lib/clsx'
import { PerformanceMonitor } from '@/lib/performance'

interface LoadingScreenProps {
    message?: string
    progress?: number
    showProgress?: boolean
    variant?: 'default' | 'minimal' | 'splash'
    className?: string
}

export function LoadingScreen({
    message,
    progress,
    showProgress = false,
    variant = 'default',
    className,
}: LoadingScreenProps) {
    const [loadingTime, setLoadingTime] = useState(0)
    const t = useTranslations('common')

    // Track loading time for performance monitoring
    useEffect(() => {
        const startTime = Date.now()
        const interval = setInterval(() => {
            setLoadingTime(Date.now() - startTime)
        }, 100)

        return () => {
            clearInterval(interval)
            PerformanceMonitor.measure('loading_screen_duration')
        }
    }, [variant, showProgress])

    if (variant === 'minimal') {
        return (
            <div
                className={cn(
                    'flex items-center justify-center p-8 bg-background rounded-md border border-muted',
                    className
                )}
            >
                <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin text-primary w-5 h-5" />
                    <span className="text-sm text-muted-foreground font-medium">
                        {message || t('loading')}
                    </span>
                </div>
            </div>
        )
    }

    if (variant === 'splash') {
        return (
            <div
                className={cn(
                    'fixed inset-0 flex flex-col items-center justify-center bg-background z-50',
                    className
                )}
            >
                <div className="flex flex-col items-center gap-6 max-w-md mx-auto px-6 py-8 rounded-xl border border-muted bg-card shadow-lg">
                    {/* Logo/Brand */}
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-2">
                        <Music className="w-10 h-10 text-primary" />
                    </div>
                    {/* Brand name */}
                    <h1 className="text-3xl font-bold text-primary mb-2">
                        Harmonia
                    </h1>
                    {/* Loading indicator */}
                    <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin text-primary w-5 h-5" />
                        <span className="text-base text-muted-foreground font-medium">
                            {message || t('loading_application')}
                        </span>
                    </div>
                    {/* Progress bar */}
                    {showProgress && typeof progress === 'number' && (
                        <div className="w-full max-w-xs">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>{t('loading')}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
                {/* Footer */}
                <div className="absolute bottom-8 text-center w-full">
                    <p className="text-xs text-muted-foreground">
                        {t('enterprise_grade_music_platform')}
                    </p>
                </div>
            </div>
        )
    }

    // Default variant
    return (
        <div
            className={cn(
                'fixed inset-0 flex flex-col items-center justify-center bg-background z-50',
                className
            )}
        >
            <div className="flex flex-col items-center gap-6 max-w-sm mx-auto px-6 py-8 rounded-xl border border-muted bg-card shadow-lg">
                {/* Animated loader */}
                <div className="relative flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary w-12 h-12" />
                    <div className="absolute flex items-center justify-center">
                        <Volume2 className="w-5 h-5 text-primary/60" />
                    </div>
                </div>
                {/* Content skeletons */}
                <div className="space-y-3 w-full">
                    <Skeleton className="h-7 w-40 rounded-md bg-muted mx-auto" />
                    <Skeleton className="h-4 w-56 rounded-md bg-muted mx-auto" />
                    <Skeleton className="h-4 w-44 rounded-md bg-muted mx-auto" />
                </div>
                {/* Loading message */}
                <div className="text-center space-y-2">
                    <span className="text-base text-muted-foreground font-medium">
                        {message || t('loading_application')}
                    </span>
                    {/* Performance debug info (dev only) */}
                    {process.env.NODE_ENV === 'development' && (
                        <p className="text-xs text-muted-foreground/60">
                            {Math.round(loadingTime)}ms
                        </p>
                    )}
                </div>
                {/* Progress indicator */}
                {showProgress && typeof progress === 'number' && (
                    <div className="w-full max-w-xs">
                        <div className="w-full bg-muted rounded-full h-1">
                            <div
                                className="bg-primary h-1 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            {Math.round(progress)}% {t('complete')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Export default for backward compatibility
export default LoadingScreen
