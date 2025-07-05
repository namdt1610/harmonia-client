'use client'

import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useLazyGlobalSearchQuery } from '@/modules/search/api'

export default function SearchBar() {
    const t = useTranslations('SearchBar')
    const locale = useLocale()
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const [triggerSearch, { data: searchResults, isLoading, error }] =
        useLazyGlobalSearchQuery()

    // Debug logging - moved to useEffect to prevent state updates during render
    useEffect(() => {
        console.log('SEARCH SearchBar component rendered')
    }, [])

    // Debug current locale
    useEffect(() => {
        console.log('LOCALE SearchBar locale:', locale)
        console.log('ROUTER SearchBar router:', !!router)
    }, [locale, router])

    // Debug search API results
    useEffect(() => {
        // Debug API URL
        console.log('API API URL:', process.env.NEXT_PUBLIC_API_URL)
        console.log(
            'ENDPOINT Search endpoint:',
            `${process.env.NEXT_PUBLIC_API_URL}/search/global_search/`
        )

        if (searchResults) {
            console.log('RESPONSE API Response received:', searchResults)
        }
        if (error) {
            console.error('ERROR API Error:', error)
        }
        if (isLoading) {
            console.log('LOADING API Loading...')
        }
    }, [searchResults, error, isLoading])

    const performSearch = async (query: string) => {
        const trimmedQuery = query.trim()
        if (trimmedQuery.length >= 1) {
            console.log('PERFORM Performing search for:', trimmedQuery)

            // Test API call trực tiếp
            try {
                console.log('TEST Testing direct API call...')
                const apiResult = await triggerSearch({
                    q: trimmedQuery,
                    page: 1,
                    page_size: 10,
                }).unwrap()
                console.log('SUCCESS Direct API call successful:', apiResult)
            } catch (apiError) {
                console.error('FAIL Direct API call failed:', apiError)
            }

            // Navigation như bình thường
            const searchUrl = `/${locale}/search?q=${encodeURIComponent(trimmedQuery)}`
            console.log('URL Search URL:', searchUrl)
            console.log('CURRENT Current URL:', window.location.href)

            try {
                console.log('ROUTER Using router.push...')
                router.push(searchUrl)
                console.log('PUSH router.push initiated')

                // Check navigation sau 500ms
                setTimeout(() => {
                    console.log(
                        'AFTER URL after router.push:',
                        window.location.href
                    )
                    if (!window.location.href.includes('/search')) {
                        console.log(
                            'FALLBACK router.push failed, trying window.location...'
                        )
                        window.location.href = searchUrl
                    }
                }, 500)
            } catch (error) {
                console.error('NAV Navigation failed:', error)
                console.log('WINDOW Fallback to window.location...')
                window.location.href = searchUrl
            }
        } else {
            console.log('SHORT Query too short:', trimmedQuery)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)
        console.log('INPUT Input changed:', value)

        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // Set new timeout for auto-search (chỉ khi gõ >= 2 ký tự)
        if (value.trim().length >= 2) {
            console.log('TIMEOUT Setting auto-search timeout for:', value)
            timeoutRef.current = setTimeout(() => {
                console.log('AUTO Auto-search triggered for:', value)
                performSearch(value)
            }, 500) // Tăng timeout lên 500ms để tránh gọi API quá nhiều
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log('KEY Key pressed:', e.key)
        if (e.key === 'Enter') {
            console.log('ENTER Enter key detected, performing search')
            // Clear timeout để tránh double search
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                console.log('CLEAR Cleared auto-search timeout')
            }
            performSearch(searchQuery)
        }
    }

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return (
        <div className="relative flex items-center">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={20} className="text-neutral-400" />
                </div>
                <Input
                    type="text"
                    className="bg-neutral-800 text-white rounded-l-full pl-10 py-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-white border-r-0 rounded-r-none"
                    placeholder={t('searchPlaceholder', {
                        fallback: 'What do you want to listen to?',
                    })}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    aria-label={t('search', { fallback: 'Search' })}
                />
            </div>
            <Button
                type="button"
                variant="default"
                size="icon"
                className="bg-neutral-700 hover:bg-neutral-600 text-white rounded-l-none rounded-r-full h-[42px] px-4 border-l-0"
                onClick={() => {
                    console.log('CLICK Search button clicked')
                    performSearch(searchQuery)
                }}
                aria-label={t('searchButton', { fallback: 'Search' })}
            >
                <Search size={16} />
            </Button>
        </div>
    )
}
