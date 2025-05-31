'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'

import ProfileSettings from './components/ProfileSettings'
import AccountSettings from './components/AccountSettings'
import AppearanceSettings from './components/AppearanceSettings'
import PlaybackSettings from './components/PlaybackSettings'
import NotificationSettings from './components/NotificationSettings'

export default function SettingsPage() {
    const t = useTranslations('Settings')

    return (
        <div className="container py-10 max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-6 bg-[#282828]">
                    <TabsTrigger value="profile">
                        {t('tabs.profile')}
                    </TabsTrigger>
                    <TabsTrigger value="account">
                        {t('tabs.account')}
                    </TabsTrigger>
                    <TabsTrigger value="appearance">
                        {t('tabs.appearance')}
                    </TabsTrigger>
                    <TabsTrigger value="playback">
                        {t('tabs.playback')}
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        {t('tabs.notifications')}
                    </TabsTrigger>
                </TabsList>

                {/* Profile Settings */}
                <TabsContent value="profile">
                    <ProfileSettings />
                </TabsContent>

                {/* Account Settings */}
                <TabsContent value="account">
                    <AccountSettings />
                </TabsContent>

                {/* Appearance Settings */}
                <TabsContent value="appearance">
                    <AppearanceSettings />
                </TabsContent>

                {/* Playback Settings */}
                <TabsContent value="playback">
                    <PlaybackSettings />
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications">
                    <NotificationSettings />
                </TabsContent>
            </Tabs>
        </div>
    )
}
