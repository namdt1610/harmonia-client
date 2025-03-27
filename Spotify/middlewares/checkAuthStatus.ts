import { store } from '@/redux/store';
import { setAuth, clearAuth } from '@/redux/slices/authSlice';
import { userApi } from '@/redux/services/userApi';

export const checkAuthStatus = async () => {
    try {
        // Gửi request để lấy thông tin người dùng
        const result = await store.dispatch(userApi.endpoints.getUserProfile.initiate(undefined));

        if (result.data) {
            store.dispatch(setAuth(result.data)); // Cập nhật trạng thái đăng nhập
        } else {
            store.dispatch(clearAuth()); // Xóa trạng thái nếu không xác thực được
        }
    } catch (error) {
        console.error('Failed to check auth status:', error);
        store.dispatch(clearAuth()); // Xóa trạng thái nếu có lỗi
    }
};