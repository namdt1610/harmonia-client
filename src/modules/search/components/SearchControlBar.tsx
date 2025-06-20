import { useTranslations } from 'next-intl'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

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

interface SearchControlBarProps {
    sortOptionsList: SortOption[]
    limitOptionsList: LimitOption[]
    currentSortValue: string
    currentLimitValue: string
    onSortChange: (value: string) => void
    onLimitChange: (value: string) => void
}

export default function SearchControlBar({
    sortOptionsList,
    limitOptionsList,
    currentSortValue,
    currentLimitValue,
    onSortChange,
    onLimitChange,
}: SearchControlBarProps) {
    const t = useTranslations('SearchResults')

    return (
        <div className="w-full flex flex-col justify-between items-start rounded-lg gap-4">
            {/* Limit Control */}
            <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-400">
                    {t('showingResultsFor', {
                        fallback: 'Showing',
                    })}
                </span>
                <Select onValueChange={onLimitChange} value={currentLimitValue}>
                    <SelectTrigger className="w-20 h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {limitOptionsList.map((limit, index) => (
                            <SelectItem key={index} value={limit.value}>
                                {limit.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <span className="text-neutral-400">
                    {t('resultsPerPage', {
                        fallback: 'per page',
                    })}
                </span>
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-400">
                    {t('sortedBy', { fallback: 'Sort by' })}:
                </span>
                <Select onValueChange={onSortChange} value={currentSortValue}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptionsList.map((option, index) => (
                            <SelectItem key={index} value={option.value}>
                                {option.label}
                                {option.value === 'relevance' && (
                                    <span className="text-xs text-neutral-500 ml-1">
                                        (
                                        {t('default', {
                                            fallback: 'default',
                                        })}
                                        )
                                    </span>
                                )}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
