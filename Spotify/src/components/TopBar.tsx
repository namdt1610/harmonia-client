import { User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import SearchBar from '@/components/SearchBar'
import { useSelector, useDispatch } from 'react-redux'
import { clearAuth } from '@/redux/slices/authSlice'
import { RootState } from '@/redux/store'

interface TopBarProps {
    locale: string
    onSearchResults: (results: any) => void
}

export default function TopBar({ locale, onSearchResults }: TopBarProps) {
    const t = useTranslations('TopBar')
    const { isLoggedIn, user } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(clearAuth())
        localStorage.removeItem('access_token')
    }

    return (
        <header className="h-16 bg-neutral-900 bg-opacity-80 backdrop-filter backdrop-blur sticky top-0 z-10 flex items-center px-8">
            <div className="flex items-center space-x-4">
                <button className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z"></path>
                    </svg>
                </button>
                <button className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 5.97.47a.75.75 0 0 0-1.06 0z"></path>
                    </svg>
                </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
                <SearchBar onSearchResults={onSearchResults} />
            </div>

            <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                    <>
                        <button className="px-4 py-1 text-sm font-bold bg-white text-black rounded-full hover:scale-105 transition-transform">
                            {t('upgrade', { fallback: 'Upgrade' })}
                        </button>
                        <button className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                            <User size={16} />
                        </button>
                        <span className="text-sm text-white">{user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-1 text-sm font-bold bg-red-500 text-white rounded-full hover:scale-105 transition-transform"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        className="px-4 py-1 text-sm font-bold bg-white text-black rounded-full hover:scale-105 transition-transform"
                        onClick={() => (window.location.href = '/login')}
                    >
                        Login
                    </button>
                )}
            </div>
        </header>
    )
}
