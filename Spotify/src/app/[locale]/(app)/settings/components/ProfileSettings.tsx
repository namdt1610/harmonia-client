'use client'

import { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export default function ProfileSettings() {
    const t = useTranslations('Settings')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSaveProfile = async () => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            toast.success('Profile updated successfully')
        }, 1000)
    }

    return (
        <Card className="bg-[#181818] border-[#282828]">
            <CardHeader>
                <CardTitle>{t('profile.title')}</CardTitle>
                <CardDescription>{t('profile.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <Avatar className="w-24 h-24">
                        <AvatarImage
                            src="/placeholder-avatar.jpg"
                            alt="Profile"
                        />
                        <AvatarFallback className="text-xl bg-[#282828]">
                            USER
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <Button
                            variant="outline"
                            className="mb-2 w-full sm:w-auto"
                        >
                            {t('profile.uploadAvatar')}
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            {t('profile.avatarRequirements')}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">
                                {t('profile.username')}
                            </Label>
                            <Input
                                id="username"
                                className="bg-[#282828] border-0"
                                placeholder="username"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="displayName">
                                {t('profile.displayName')}
                            </Label>
                            <Input
                                id="displayName"
                                className="bg-[#282828] border-0"
                                placeholder="Display Name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">{t('profile.bio')}</Label>
                        <textarea
                            id="bio"
                            className="w-full h-24 px-3 py-2 rounded-md bg-[#282828] border-0 resize-none focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                            placeholder="Tell us about yourself..."
                        ></textarea>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-[#282828] pt-4">
                <Button variant="outline" className="mr-2">
                    {t('actions.cancel')}
                </Button>
                <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
                >
                    {isLoading ? t('actions.saving') : t('actions.save')}
                </Button>
            </CardFooter>
        </Card>
    )
}
