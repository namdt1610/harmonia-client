import { useAppLoading } from '@/contexts/AppLoadingContext'
import LoadingScreen from './LoadingScreen'

export default function AppLoader({ children }: { children: React.ReactNode }) {
    const { isAppReady } = useAppLoading()
    if (!isAppReady) return <LoadingScreen />
    return <>{children}</>
}
