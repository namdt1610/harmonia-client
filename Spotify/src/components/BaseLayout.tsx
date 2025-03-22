'use client'
import { clsx } from 'clsx'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { ReactNode, useState } from 'react'


import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSibebar'
import TopBar from './TopBar'
import PlayerBar from './PlayerBar'

const inter = Inter({ subsets: ['latin'] })

type Props = {
    children: ReactNode
    locale: string
    messages: any
}

export default function BaseLayout({ children, locale, messages }: Props) {
    const [leftWidth, setLeftWidth] = useState(256);
    const [rightWidth, setRightWidth] = useState(320);
    return (

        <NextIntlClientProvider locale={locale} messages={messages}>
            {/* <Navigation /> */}
            <div className={clsx("h-screen flex flex-col bg-black text-white", inter.className)}>
                {/* TopBar */}
                <TopBar locale={locale} />

                {/* Main content */}
                <div className="flex-1 overflow-hidden flex flex-row" >
                    <LeftSidebar locale={locale} />

                    <div className="flex-1 overflow-auto "
                    >
                        {children}
                    </div>

                    <RightSidebar locale={locale} />
                </div>

                {/* Player bar */}
                <PlayerBar />
            </div>
        </NextIntlClientProvider >
    )
}
