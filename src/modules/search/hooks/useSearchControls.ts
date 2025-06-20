import { useMemo } from 'react'

interface SortOption {
    label: string
    value: string
    sortBy?: string
    order?: string
}

interface LimitOption {
    label: string
    value: string
}

interface UseSearchControlsProps {
    currentSort: { sortBy?: string; order?: string }
    currentLimit: string
    onSortChange: (sortBy?: string, order?: string) => void
    onLimitChange: (limit: string) => void
    onPageChange: (page: number) => void
}

export const useSearchControls = ({
    currentSort,
    currentLimit,
    onSortChange,
    onLimitChange,
    onPageChange,
}: UseSearchControlsProps) => {
    const sortOptionsList: SortOption[] = [
        {
            label: 'Relevance',
            value: 'relevance',
            sortBy: undefined,
            order: undefined,
        },
        {
            label: 'Newest',
            value: 'newest',
            sortBy: 'created_at',
            order: 'desc',
        },
        {
            label: 'Oldest',
            value: 'oldest',
            sortBy: 'created_at',
            order: 'asc',
        },
        { label: 'A-Z', value: 'az', sortBy: 'title', order: 'asc' },
        { label: 'Z-A', value: 'za', sortBy: 'title', order: 'desc' },
    ]

    const limitOptionsList: LimitOption[] = [
        { label: '10', value: '10' },
        { label: '20', value: '20' },
        { label: '50', value: '50' },
    ]

    const getCurrentSortValue = useMemo(() => {
        const current = sortOptionsList.find(
            (option) =>
                option.sortBy === currentSort.sortBy &&
                option.order === currentSort.order
        )
        return current?.value || 'relevance'
    }, [currentSort.sortBy, currentSort.order])

    const getCurrentLimitValue = useMemo(() => {
        const current = limitOptionsList.find(
            (option) => option.value === currentLimit
        )
        return current?.value || '10'
    }, [currentLimit])

    const handleSortChange = (value: string) => {
        const selectedOption = sortOptionsList.find(
            (option) => option.value === value
        )
        if (selectedOption) {
            onSortChange(selectedOption.sortBy, selectedOption.order)
        }
    }

    const handleLimitChange = (value: string) => {
        const selectedOption = limitOptionsList.find(
            (option) => option.value === value
        )
        if (selectedOption) {
            onLimitChange(selectedOption.value)
        }
    }

    const handlePageChange = (page: number) => {
        onPageChange(page)
    }

    return {
        sortOptionsList,
        limitOptionsList,
        getCurrentSortValue,
        getCurrentLimitValue,
        handleSortChange,
        handleLimitChange,
        handlePageChange,
    }
}
