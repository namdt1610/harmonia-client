import { LoginUI } from '@/modules/auth/login/components/forms/LoginUI'

interface LoginPageProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    // SSR fetch initial data if needed
    const redirectUrl = searchParams.redirect as string
    const error = searchParams.error as string

    // Có thể fetch thêm data từ server nếu cần
    // const initialData = await fetch('your-api-endpoint').then(res => res.json())

    return (
        <LoginUI
            redirectUrl={redirectUrl}
            serverError={error}
            // initialData={initialData}
        />
    )
}
