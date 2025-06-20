import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Image as ImageIcon, UploadCloud } from 'lucide-react'
import Image from 'next/image'

export default function AvatarUpload({
    avatar,
    onChange,
    disabled,
}: {
    avatar?: string
    onChange?: (file: File) => void
    disabled?: boolean
}) {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="flex flex-col items-center mb-6">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border border-neutral-700 mb-2 bg-neutral-900">
                {avatar ? (
                    <Image
                        src={avatar}
                        alt="Avatar"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-neutral-400">
                        <ImageIcon size={64} />
                    </div>
                )}
            </div>
            <Input
                type="file"
                accept="image/*"
                ref={inputRef}
                className="hidden"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0])
                        onChange?.(e.target.files[0])
                }}
                disabled={disabled}
            />
            <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
            >
                <UploadCloud size={16} className="mr-2" />
                Đổi ảnh
            </Button>
        </div>
    )
}
