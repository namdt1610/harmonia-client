import './globals.css'
import { ReactNode } from 'react'
import { ReduxProvider } from '@/contexts/Provider'
import { Metadata } from 'next'

type Props = {
    children: ReactNode
}

export const metadata: Metadata = {
    title: 'Harmonia',
    description: 'Music streaming platform',
    icons: {
        icon: '/favicon.svg',
    },
}

export default function RootLayout({ children }: Props) {
    return (
        <html className="dark">
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </head>
            <body>
                <ReduxProvider>{children}</ReduxProvider>
            </body>
        </html>
    )
}
