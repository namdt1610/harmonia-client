import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'

interface SearchPaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function SearchPagination({
    currentPage,
    totalPages,
    onPageChange,
}: SearchPaginationProps) {
    if (totalPages <= 1) return null

    const renderPaginationItems = () => {
        const items = []

        // Previous button
        items.push(
            <PaginationItem key="prev">
                <PaginationPrevious
                    onClick={() =>
                        currentPage > 1 && onPageChange(currentPage - 1)
                    }
                    className={
                        currentPage <= 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                    }
                />
            </PaginationItem>
        )

        // Page numbers (simplified: show current and adjacent pages)
        for (
            let i = Math.max(1, currentPage - 1);
            i <= Math.min(totalPages, currentPage + 1);
            i++
        ) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        isActive={i === currentPage}
                        onClick={() => onPageChange(i)}
                        className="cursor-pointer"
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        // Next button
        items.push(
            <PaginationItem key="next">
                <PaginationNext
                    onClick={() =>
                        currentPage < totalPages &&
                        onPageChange(currentPage + 1)
                    }
                    className={
                        currentPage >= totalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                    }
                />
            </PaginationItem>
        )

        return items
    }

    return (
        <Pagination className="mt-8">
            <PaginationContent>{renderPaginationItems()}</PaginationContent>
        </Pagination>
    )
}
