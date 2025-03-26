import { store } from '@/redux/store';
import { setAuth, clearAuth } from '@/redux/slices/authSlice';

export const checkAuthStatus = async () => {
    try {
        const response = await fetch('/api/users/me', {
            credentials: 'include', // Gửi cookie HTTP-only nếu có từ trình duyệt đến server
        });

        if (response.ok) {
            const data = await response.json();
            store.dispatch(setAuth(data.user)); // Cập nhật trạng thái đăng nhập
        } else {
            store.dispatch(clearAuth()); // Xóa trạng thái nếu không xác thực được
        }
    } catch (error) {
        console.error('Failed to check auth status:', error);
        store.dispatch(clearAuth()); // Xóa trạng thái nếu có lỗi
    }
};