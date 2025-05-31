'use client'

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
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'

export default function AccountSettings() {
    const t = useTranslations('Settings')

    return (
        <Card className="bg-[#181818] border-[#282828]">
            <CardHeader>
                <CardTitle>{t('account.title')}</CardTitle>
                <CardDescription>{t('account.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('account.email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                className="bg-[#282828] border-0"
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">{t('account.phone')}</Label>
                            <Input
                                id="phone"
                                className="bg-[#282828] border-0"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>
                </div>

                <Separator className="bg-[#282828]" />

                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        {t('account.security')}
                    </h3>
                    <Button variant="outline" className="mb-4">
                        {t('account.changePassword')}
                    </Button>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-medium">
                                    {t('account.twoFactor')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('account.twoFactorDescription')}
                                </p>
                            </div>
                            <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-medium">
                                    {t('account.sessions')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('account.sessionsDescription')}
                                </p>
                            </div>
                            <Button variant="outline" size="sm">
                                {t('account.manageSessions')}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-[#282828] pt-4">
                <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                >
                    {t('account.deleteAccount')}
                </Button>
                <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-white">
                    {t('actions.save')}
                </Button>
            </CardFooter>
        </Card>
    )
}
