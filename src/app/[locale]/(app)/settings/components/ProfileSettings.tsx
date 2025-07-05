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
import { Textarea } from '@/components/ui/textarea'

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
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle>{t('profile.title')}</CardTitle>
                <CardDescription>{t('profile.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src="/avatars/01.png" />
                        <AvatarFallback className="text-xl bg-muted">
                            JD
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <Button size="sm">{t('profile.changeImage')}</Button>
                        <p className="text-xs text-muted-foreground mt-2">
                            {t('profile.imageRequirements')}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label>{t('profile.displayName')}</Label>
                        <Input value="John Doe" className="bg-muted border-0" />
                    </div>
                    <div>
                        <Label>{t('profile.username')}</Label>
                        <Input value="@johndoe" className="bg-muted border-0" />
                    </div>
                    <div>
                        <Label>{t('profile.bio')}</Label>
                        <Textarea
                            placeholder={t('profile.bioPlaceholder')}
                            className="w-full h-24 px-3 py-2 rounded-md bg-muted border-0 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border pt-4">
                <Button variant="outline" className="mr-2">
                    {t('actions.cancel')}
                </Button>
                <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    {isLoading ? t('actions.saving') : t('actions.save')}
                </Button>
            </CardFooter>
        </Card>
    )
}
