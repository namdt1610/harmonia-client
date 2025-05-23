'use client'
import React, { createContext, useContext, useState } from 'react'

const AppLoadingContext = createContext<{
    isAppReady: boolean
    setAppReady: (ready: boolean) => void
}>({
    isAppReady: false,
    setAppReady: () => {},
})

export const useAppLoading = () => useContext(AppLoadingContext)

export const AppLoadingProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [isAppReady, setAppReady] = useState(false)
    return (
        <AppLoadingContext.Provider value={{ isAppReady, setAppReady }}>
            {children}
        </AppLoadingContext.Provider>
    )
}
