import './globals.css'
import { ReactNode } from 'react'
import { ReduxProvider } from '@/contexts/Provider'
import { AuthBootstrap } from '@/components/shared/AuthBootstrap'
import { Metadata } from 'next'

type Props = {
    children: ReactNode
}

export const metadata: Metadata = {
    title: 'Harmonia',
    description: 'Music streaming platform',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({ children }: Props) {
    return (
        <html className="dark">
            <body>
                <ReduxProvider>
                    <AuthBootstrap />
                    {children}
                </ReduxProvider>
            </body>
        </html>
    )
}
