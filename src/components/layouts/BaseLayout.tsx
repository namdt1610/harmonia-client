'use client'
import { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { AuthBootstrap } from '@/modules/auth/components/AuthBootstrap'
import TopBar from './TopBar'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import PlayerBar from '@/modules/player/components/PlayerBar'
import { useIsMobile } from '@/components/ui/use-mobile'

type Props = {
    children: ReactNode
    locale: string
    messages: any
}

export default function BaseLayout({ children, locale, messages }: Props) {
    const isMobile = useIsMobile()
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false) // Default to closed

    // Set initial state based on screen size
    useEffect(() => {
        if (isMobile !== undefined) {
            // Close sidebar on mobile, open on desktop
            setIsRightSidebarOpen(!isMobile)
        }
    }, [isMobile])

    const toggleRightSidebar = () => {
        setIsRightSidebarOpen((prev) => !prev)
    }

    return (
        <NextIntlClientProvider
            timeZone="Asia/Ho_Chi_Minh"
            locale={locale}
            messages={messages}
        >
            <AuthBootstrap />
            <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
                {/* TopBar */}
                <TopBar />
                {/* Main content */}
                <main className="flex-1 overflow-hidden flex flex-row min-h-0 w-full max-w-full">
                    <LeftSidebar locale={locale} />
                    <div className="flex-1 overflow-auto min-w-0 custom-scrollbar">
                        {children}
                    </div>
                    <RightSidebar
                        isOpen={isRightSidebarOpen}
                        onClose={() => setIsRightSidebarOpen(false)}
                    />
                </main>

                {/* Player bar */}
                <PlayerBar onToggleQueue={toggleRightSidebar} />
            </div>
        </NextIntlClientProvider>
    )
}
