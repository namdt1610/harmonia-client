'use client'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function LanguageSwitcher() {
    const { locale, locales, defaultLocale } = useRouter()
    return (
        <div className="mt-4 space-x-4">
            <h1>Chào mừng bạn đến với ứng dụng đa ngôn ngữ!</h1>
            <p>
                Locale hiện tại: <strong>{locale}</strong>
            </p>
            <p>Các locale khả dụng: {locales?.join(', ')}</p>
            <p>Locale mặc định: {defaultLocale}</p>
            <Link href="/" locale="en">
                🇺🇸 English
            </Link>
            <Link href="/" locale="vi">
                🇻🇳 Tiếng Việt
            </Link>
        </div>
    )
}

// Hàm này giúp load file messages tương ứng với locale hiện tại
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default,
    },
  };
}
