'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'

export default function NotificationSettings() {
    const t = useTranslations('Settings')

    return (
        <Card className="bg-[#181818] border-[#282828]">
            <CardHeader>
                <CardTitle>{t('notifications.title')}</CardTitle>
                <CardDescription>
                    {t('notifications.description')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-medium">
                                {t('notifications.pushNotifications')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {t('notifications.pushDescription')}
                            </p>
                        </div>
                        <Switch checked={true} />
                    </div>

                    <Separator className="bg-[#282828]" />

                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            {t('notifications.emailPreferences')}
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">
                                        {t('notifications.newMusic')}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {t('notifications.newMusicDescription')}
                                    </p>
                                </div>
                                <Switch checked={true} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">
                                        {t('notifications.playlists')}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            'notifications.playlistsDescription'
                                        )}
                                    </p>
                                </div>
                                <Switch />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">
                                        {t('notifications.product')}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {t('notifications.productDescription')}
                                    </p>
                                </div>
                                <Switch checked={true} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">
                                        {t('notifications.offers')}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {t('notifications.offersDescription')}
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-[#282828] pt-4">
                <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-white">
                    {t('actions.save')}
                </Button>
            </CardFooter>
        </Card>
    )
}
