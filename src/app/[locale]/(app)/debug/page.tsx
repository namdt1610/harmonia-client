'use client'

import { DebugPanel } from '@/components/debug/DebugPanel'
import { useTranslations } from 'next-intl'

export default function DebugPage() {
    const t = useTranslations('DebugPage')

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Debug Tools</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Use these tools to diagnose and fix issues with invalid
                    track references.
                </p>
            </div>

            <DebugPanel />
        </div>
    )
}
