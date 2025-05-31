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

export default function AppearanceSettings() {
    const t = useTranslations('Settings')

    return (
        <Card className="bg-[#181818] border-[#282828]">
            <CardHeader>
                <CardTitle>{t('appearance.title')}</CardTitle>
                <CardDescription>{t('appearance.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-medium">
                                {t('appearance.theme')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {t('appearance.themeDescription')}
                            </p>
                        </div>
                        <Switch checked={true} />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="font-medium">
                                {t('appearance.compactMode')}
                            </p>
                            <Switch />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t('appearance.compactDescription')}
                        </p>
                    </div>

                    <Separator className="bg-[#282828]" />

                    <div className="space-y-3">
                        <p className="font-medium">
                            {t('appearance.textSize')}
                        </p>
                        <Slider
                            className="w-full"
                            defaultValue={[50]}
                            max={100}
                            step={1}
                        />
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                                {t('appearance.smaller')}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {t('appearance.larger')}
                            </span>
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
