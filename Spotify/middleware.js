import { withAuth } from 'next-auth/middleware'

export default withAuth({
    pages: {
        signIn: '/login', // Điều hướng về trang login nếu chưa đăng nhập
    },
})

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'], // Chỉ bảo vệ các route này
}
