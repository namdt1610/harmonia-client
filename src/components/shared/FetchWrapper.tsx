import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Loader2, AlertCircle, Package } from 'lucide-react'

interface FetchWrapperProps {
    isLoading: boolean
    isError: boolean
    error?: any
    data?: any
    children: ReactNode
}

export default function FetchWrapper({
    isLoading,
    isError,
    error,
    data,
    children,
}: FetchWrapperProps) {
    if (isLoading) {
        return (
            <Card className="p-4 flex justify-center items-center">
                <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                <span className="ml-2 text-gray-500">Loading...</span>
            </Card>
        )
    }

    if (isError) {
        return (
            <Card className="p-4 flex flex-col items-center text-destructive">
                <AlertCircle className="w-6 h-6 mb-2" />
                <p className="text-sm">Error loading data</p>
                <pre className="text-xs text-gray-500 mt-2">
                    {JSON.stringify(error, null, 2)}
                </pre>
            </Card>
        )
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
        return (
            <Card className="p-4 flex flex-col items-center text-gray-500">
                <Package className="w-6 h-6 mb-2" />
                <p className="text-sm">No data available</p>
            </Card>
        )
    }

    return <>{children}</>
}
