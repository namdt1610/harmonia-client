import ProfileEditForm from '@/modules/user/components/ProfileEditForm'
export default function ProfileEditPage() {
    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Chỉnh sửa hồ sơ cá nhân</h2>
            <ProfileEditForm />
        </div>
    )
}
