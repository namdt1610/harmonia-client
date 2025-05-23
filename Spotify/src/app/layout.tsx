import './globals.css'
import { ReactNode } from 'react'
import { ReduxProvider } from '@/redux/provider'
import { AuthBootstrap } from '@/modules/auth/login/components/AuthBootstrap'
import { AppLoadingProvider } from '@/contexts/AppLoadingContext'
import AppLoader from '@/components/shared/AppLoader'

type Props = {
    children: ReactNode
}

export default function RootLayout({ children }: Props) {
    return (
        <html className="dark">
            <body>
                <AppLoadingProvider>
                    <ReduxProvider>
                        <AuthBootstrap />
                        <AppLoader>{children}</AppLoader>
                    </ReduxProvider>
                </AppLoadingProvider>
            </body>
        </html>
    )
}
