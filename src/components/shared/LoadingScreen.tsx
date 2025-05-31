import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1e1e2f] to-[#2a2a40] z-50">
            <div className="flex flex-col items-center gap-6">
                <Loader2 className="animate-spin text-primary w-16 h-16" />
                <Skeleton className="h-8 w-48 rounded-md bg-muted" />
                <Skeleton className="h-4 w-64 rounded-md bg-muted" />
                <Skeleton className="h-4 w-56 rounded-md bg-muted" />
            </div>
            <span className="mt-8 text-lg text-muted-foreground tracking-wide">
                Đang tải ứng dụng...
            </span>
        </div>
    )
}
