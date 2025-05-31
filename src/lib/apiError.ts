import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

/**
 ** Kiểm tra xem error có phải là lỗi từ RTK Query không
 ** Dùng trong hooks
 */
export function isFetchBaseQueryError(
    error: unknown
): error is FetchBaseQueryError {
    return (
        typeof error === 'object' &&
        error !== null &&
        ('status' in error || 'data' in error)
    )
}
