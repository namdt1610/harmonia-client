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
import { Slider } from '@/components/ui/slider'
import { useTranslations } from 'next-intl'

export default function PlaybackSettings() {
    const t = useTranslations('Settings')

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle>{t('playback.title')}</CardTitle>
                <CardDescription>{t('playback.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-3">
                        <p className="font-medium">{t('playback.quality')}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <Button
                                variant="outline"
                                className="justify-start bg-muted border-primary border-2"
                            >
                                {t('playback.normalQuality')}
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start bg-muted"
                            >
                                {t('playback.highQuality')}
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start bg-muted"
                            >
                                {t('playback.veryHighQuality')}
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t('playback.qualityNote')}
                        </p>
                    </div>

                    <Separator className="bg-border" />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-medium">
                                    {t('playback.automix')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('playback.automixDescription')}
                                </p>
                            </div>
                            <Switch checked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-medium">
                                    {t('playback.autoplay')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('playback.autoplayDescription')}
                                </p>
                            </div>
                            <Switch checked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-medium">
                                    {t('playback.normalization')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('playback.normalizationDescription')}
                                </p>
                            </div>
                            <Switch />
                        </div>
                    </div>

                    <Separator className="bg-border" />

                    <div className="space-y-3">
                        <p className="font-medium">{t('playback.crossfade')}</p>
                        <Slider
                            className="w-full"
                            defaultValue={[5]}
                            max={12}
                            step={1}
                        />
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                                {t('playback.off')}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                12s
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border pt-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {t('actions.save')}
                </Button>
            </CardFooter>
        </Card>
    )
}
