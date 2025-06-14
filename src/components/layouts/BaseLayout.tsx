'use client'
import { ReactNode, useState } from 'react'
import { NextIntlClientProvider } from 'next-intl'

import TopBar from './TopBar'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import PlayerBar from '@/modules/player/components/PlayerBar'

type Props = {
    children: ReactNode
    locale: string
    messages: any
}

export default function BaseLayout({ children, locale, messages }: Props) {
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)

    const toggleRightSidebar = () => {
        setIsRightSidebarOpen((prev) => !prev)
    }

    return (
        <NextIntlClientProvider
            timeZone="Asia/Ho_Chi_Minh"
            locale={locale}
            messages={messages}
        >
            <div className="h-screen flex flex-col bg-black text-white">
                {/* TopBar */}
                <TopBar />
                {/* Main content */}
                <main className="flex-1 overflow-hidden flex flex-row">
                    <LeftSidebar locale={locale} />
                    <div className="flex-1 overflow-auto">{children}</div>
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
