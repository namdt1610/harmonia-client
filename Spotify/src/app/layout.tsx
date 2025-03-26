import './globals.css'
import { ReactNode } from 'react'
import { ReduxProvider } from '@/redux/provider'
import { checkAuthStatus } from '../../middlewares/checkAuthStatus'

type Props = {
    children: ReactNode
}

export default function RootLayout({ children }: Props) {
    checkAuthStatus() // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi động

    return (
        <html>
            <body>
                <ReduxProvider>{children}</ReduxProvider>
            </body>
        </html>
    )
}
