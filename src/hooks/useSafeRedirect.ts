import { useRouter } from 'next/navigation'

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
export const useSafeRedirect = (path: string) => {
    const router = useRouter()

    try {
        router.push(path)
    } catch {
        window.location.href = path
    }
}
