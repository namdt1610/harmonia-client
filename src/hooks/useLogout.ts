'use client'

import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { clearCredentials } from '@/modules/auth/slice'
import { useLogoutMutation } from '@/modules/auth/api'

export const useLogout = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [logout, { isLoading }] = useLogoutMutation()

    /*
     * * Clear Redux store trước
     * * Gọi API logout
     * * Chuyển hướng về trang login
     * * Reload trang để đảm bảo xóa hết cache và state
     * * Nếu logout thất bại, vẫn xóa hết dữ liệu ở frontend
     * * Force redirect to login page
     */
    const handleLogout = async () => {
        /**
         * TODO: Thêm toast xác nhận logout
         * * Nếu người dùng không muốn logout, họ có thể bấm vào nút cancel
         * Example:
         * const confirmLogout = window.confirm("Bạn chắc chắn muốn đăng xuất?");
         * if (!confirmLogout) return;
         */
        try {
            dispatch(clearCredentials())
            await logout().unwrap()
            router.push('/login')
            window.location.href = '/login'
        } catch (error) {
            console.error('Logout failed:', error)
            dispatch(clearCredentials())
            /**
             * TODO: Cần làm sạch pathname trước khi redirect, vì:
             * * Đây là client-side routing → phụ thuộc vào JS engine, trạng thái của hydration, hook state v.v.
             * * Nếu:
             * * Component bị unmounted
             * * App crash
             * * JS chưa hydrate
             * * Hoặc đang logout → store bị clear quá sớm
             * * router.push() có thể không thực hiện được!
             * * Vì vậy, chúng ta cần tạo hook làm sạch pathname trước khi redirect (useSafeRedirect)
             */
            window.location.href = '/login'
        }
    }

    return {
        logout: handleLogout,
        isLoggingOut: isLoading,
    }
}
