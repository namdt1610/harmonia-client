// next-intl.config.js
/**
 * @type {import('next-intl').Config}
 */
const config = {
    // Danh sách các locale được hỗ trợ
    locales: ['en', 'vi'],
    // Locale mặc định khi không có giá trị phù hợp
    defaultLocale: 'vi',
    // Cấu hình các namespace cho từng trang (ở đây tất cả đều dùng 'common' làm ví dụ)
    pages: {
        '*': ['HomePage'],
    },
}

export default config
