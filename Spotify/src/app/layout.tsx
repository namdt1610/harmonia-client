import './globals.css'
import { ReactNode } from 'react'
import { ReduxProvider } from '@/redux/provider'
import { AuthBootstrap } from '@/modules/auth/login/components/AuthBootstrap'

type Props = {
    children: ReactNode
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
