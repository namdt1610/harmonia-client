'use client'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import AvatarUpload from './AvatarUpload'
import { useCurrentUser, useUploadUserImage } from '../hooks/useUsers'

export default function ProfileEditForm() {
    const { user, isLoading, updateMe, updateState } = useCurrentUser()
    const { uploadImage, uploadState } = useUploadUserImage()
    const [form, setForm] = useState({
        username: '',
        email: '',
        display_name: '',
    })
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
        user?.image
    )

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || '',
                email: user.email || '',
                display_name: user.display_name || '',
            })
            setAvatarPreview(user.image)
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

        try {
            // 1. Nếu có file image mới, upload trước
            if (avatarFile) {
                try {
                    await uploadImage(avatarFile).unwrap()
                    toast.success('Update image successfully')
                } catch (error) {
                    toast.error('Error when updating image')
                    return
                }
                setAvatarFile(null)
            }

            // 2. Sau đó cập nhật thông tin user
            await updateMe(form).unwrap()
            toast.success('Update profile successfully')
        } catch (error) {
            toast.error('Error when updating profile')
        }
    }

    if (isLoading) return <div>Đang tải dữ liệu...</div>

    return (
        <div onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-6">
            <AvatarUpload
                avatar={avatarPreview}
                onChange={handleAvatarChange}
                disabled={uploadState.isLoading}
            />

            <div>
                <Label className="block mb-1 text-sm font-medium text-neutral-300">
                    Tên đăng nhập
                </Label>
                <Input
                    name="username"
                    value={form.username}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <Label className="block mb-1 text-sm font-medium text-neutral-300">
                    Email
                </Label>
                <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <Label className="block mb-1 text-sm font-medium text-neutral-300">
                    Tên hiển thị
                </Label>
                <Input
                    name="display_name"
                    value={form.display_name}
                    onChange={handleInputChange}
                />
            </div>

            <Button
                type="submit"
                onClick={handleSubmit}
                disabled={updateState.isLoading || uploadState.isLoading}
            >
                {updateState.isLoading || uploadState.isLoading
                    ? 'Đang lưu...'
                    : 'Lưu thay đổi'}
            </Button>
        </div>
    )
}
