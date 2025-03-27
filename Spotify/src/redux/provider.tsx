'use client'

import { ReactNode } from 'react'
import { store } from './store'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'

export function ReduxProvider({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <Toaster position="top-center" richColors />
            {children}
        </Provider>
    )
}
