import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import AvatarUpload from './AvatarUpload'
import { useCurrentUser, useUploadUserAvatar } from '../hooks/useUsers'

export default function ProfileEditForm() {
    const { user, isLoading, updateMe, updateState } = useCurrentUser()
    const { uploadAvatar, uploadState } = useUploadUserAvatar()
    const [form, setForm] = useState({
        username: '',
        email: '',
        display_name: '',
    })
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
        undefined
    )

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || '',
                email: user.email || '',
                display_name: user.display_name || '',
            })
            setAvatarPreview(user.avatar)
        }
    }, [user])

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    }

    function handleAvatarChange(file: File) {
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        // 1. Nếu có file avatar mới, upload trước
        if (avatarFile) {
            try {
                await uploadAvatar(avatarFile).unwrap()
                toast.success('Cập nhật ảnh thành công')
            } catch {
                toast.error('Lỗi khi cập nhật ảnh đại diện')
                return
            }
            setAvatarFile(null)
        }

        // 2. Cập nhật thông tin user (JSON)
        try {
            await updateMe(form).unwrap()
            toast.success('Cập nhật hồ sơ thành công')
        } catch {
            toast.error('Lỗi khi cập nhật hồ sơ')
        }
    }

    if (isLoading) return <div>Đang tải dữ liệu...</div>

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-6">
            <AvatarUpload
                avatar={avatarPreview}
                onChange={handleAvatarChange}
                disabled={uploadState.isLoading}
            />

            <div>
                <label className="block mb-1 text-sm font-medium text-neutral-300">
                    Tên đăng nhập
                </label>
                <Input
                    name="username"
                    value={form.username}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium text-neutral-300">
                    Email
                </label>
                <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium text-neutral-300">
                    Tên hiển thị
                </label>
                <Input
                    name="display_name"
                    value={form.display_name}
                    onChange={handleInputChange}
                />
            </div>

            <Button
                type="submit"
                disabled={updateState.isLoading || uploadState.isLoading}
            >
                {updateState.isLoading || uploadState.isLoading
                    ? 'Đang lưu...'
                    : 'Lưu thay đổi'}
            </Button>
        </form>
    )
}
