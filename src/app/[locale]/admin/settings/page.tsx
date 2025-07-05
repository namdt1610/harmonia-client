'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    CogIcon,
    MusicIcon,
    UsersIcon,
    BellIcon,
    ShieldCheckIcon,
    CheckIcon,
    XIcon,
} from 'lucide-react'
import { toast } from 'sonner'

// Comment out admin settings imports vì chưa có trong backend
// import {
//     useGetAdminSettingsQuery,
//     useUpdateAdminSettingsMutation,
// } from '@/modules/admin/api'

interface AdminSettings {
    general: {
        site_name: string
        description: string
        default_language: string
        maintenance_mode: boolean
    }
    music: {
        max_file_size: number
        default_quality: string
        allowed_formats: string[]
        auto_approve: boolean
    }
    users: {
        allow_registration: boolean
        require_email_verification: boolean
        default_role: string
    }
    notifications: {
        email_enabled: boolean
        push_enabled: boolean
        admin_alerts: boolean
    }
    security: {
        session_timeout: number
        max_login_attempts: number
        require_2fa: boolean
        strong_passwords: boolean
    }
}

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('general')
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    // Sử dụng local state thay vì API tạm thời
    const [settings, setSettings] = useState<AdminSettings>({
        general: {
            site_name: 'Harmonia Music',
            description: 'A modern music streaming platform',
            default_language: 'en',
            maintenance_mode: false,
        },
        music: {
            max_file_size: 50, // MB
            default_quality: 'high',
            allowed_formats: ['mp3', 'flac', 'wav'],
            auto_approve: false,
        },
        users: {
            allow_registration: true,
            require_email_verification: true,
            default_role: 'user',
        },
        notifications: {
            email_enabled: true,
            push_enabled: true,
            admin_alerts: true,
        },
        security: {
            session_timeout: 30, // minutes
            max_login_attempts: 5,
            require_2fa: false,
            strong_passwords: true,
        },
    })

    // Comment out RTK Query hooks tạm thời
    // const {
    //     data: settings,
    //     isLoading,
    //     error,
    //     refetch,
    // } = useGetAdminSettingsQuery()
    // const [updateSettings, { isLoading: isUpdating }] =
    //     useUpdateAdminSettingsMutation()

    const isLoading = false
    const isUpdating = false
    const error = null

    const updateSettings = async (newSettings: Partial<AdminSettings>) => {
        try {
            setSettings((prev) => ({ ...prev, ...newSettings }))
            setHasUnsavedChanges(false)
            toast.success('Settings updated successfully')
        } catch (error) {
            toast.error('Failed to update settings')
        }
    }

    const handleSettingChange = (
        section: keyof AdminSettings,
        key: string,
        value: any
    ) => {
        setSettings((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }))
        setHasUnsavedChanges(true)
    }

    const handleSave = async () => {
        try {
            await updateSettings(settings)
        } catch (error) {
            toast.error('Failed to save settings')
        }
    }

    const handleReset = () => {
        // Reset to original values - tạm thời reset về default
        setSettings({
            general: {
                site_name: 'Harmonia Music',
                description: 'A modern music streaming platform',
                default_language: 'en',
                maintenance_mode: false,
            },
            music: {
                max_file_size: 50,
                default_quality: 'high',
                allowed_formats: ['mp3', 'flac', 'wav'],
                auto_approve: false,
            },
            users: {
                allow_registration: true,
                require_email_verification: true,
                default_role: 'user',
            },
            notifications: {
                email_enabled: true,
                push_enabled: true,
                admin_alerts: true,
            },
            security: {
                session_timeout: 30,
                max_login_attempts: 5,
                require_2fa: false,
                strong_passwords: true,
            },
        })
        setHasUnsavedChanges(false)
        toast.success('Settings reset to default values')
    }

    const tabs = [
        { id: 'general', name: 'General', icon: CogIcon },
        { id: 'music', name: 'Music', icon: MusicIcon },
        { id: 'users', name: 'Users', icon: UsersIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">
                    Error loading settings
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Admin Settings
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Configure platform settings and preferences
                    </p>
                </div>
                {hasUnsavedChanges && (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-yellow-600 dark:text-yellow-400">
                            You have unsaved changes
                        </span>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isUpdating}
                            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                        >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                {tab.name}
                            </button>
                        )
                    })}
                </div>

                <div className="p-6">
                    {activeTab === 'general' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                General Settings
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Site Name
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.general.site_name}
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'general',
                                                'site_name',
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Default Language
                                    </label>
                                    <select
                                        value={
                                            settings.general.default_language
                                        }
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'general',
                                                'default_language',
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="en">English</option>
                                        <option value="vi">Tiếng Việt</option>
                                        <option value="es">Español</option>
                                        <option value="fr">Français</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Site Description
                                </label>
                                <textarea
                                    value={settings.general.description}
                                    onChange={(e) =>
                                        handleSettingChange(
                                            'general',
                                            'description',
                                            e.target.value
                                        )
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="maintenance_mode"
                                    checked={settings.general.maintenance_mode}
                                    onChange={(e) =>
                                        handleSettingChange(
                                            'general',
                                            'maintenance_mode',
                                            e.target.checked
                                        )
                                    }
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="maintenance_mode"
                                    className="ml-2 block text-sm text-gray-900 dark:text-white"
                                >
                                    Enable Maintenance Mode
                                </label>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'music' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Music Settings
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Max File Size (MB)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.music.max_file_size}
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'music',
                                                'max_file_size',
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Default Quality
                                    </label>
                                    <select
                                        value={settings.music.default_quality}
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'music',
                                                'default_quality',
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="low">
                                            Low (128kbps)
                                        </option>
                                        <option value="medium">
                                            Medium (256kbps)
                                        </option>
                                        <option value="high">
                                            High (320kbps)
                                        </option>
                                        <option value="lossless">
                                            Lossless
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="auto_approve"
                                    checked={settings.music.auto_approve}
                                    onChange={(e) =>
                                        handleSettingChange(
                                            'music',
                                            'auto_approve',
                                            e.target.checked
                                        )
                                    }
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="auto_approve"
                                    className="ml-2 block text-sm text-gray-900 dark:text-white"
                                >
                                    Auto-approve uploaded tracks
                                </label>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'users' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                User Settings
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Default User Role
                                </label>
                                <select
                                    value={settings.users.default_role}
                                    onChange={(e) =>
                                        handleSettingChange(
                                            'users',
                                            'default_role',
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="user">User</option>
                                    <option value="moderator">Moderator</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="allow_registration"
                                        checked={
                                            settings.users.allow_registration
                                        }
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'users',
                                                'allow_registration',
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="allow_registration"
                                        className="ml-2 block text-sm text-gray-900 dark:text-white"
                                    >
                                        Allow user registration
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="require_email_verification"
                                        checked={
                                            settings.users
                                                .require_email_verification
                                        }
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'users',
                                                'require_email_verification',
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="require_email_verification"
                                        className="ml-2 block text-sm text-gray-900 dark:text-white"
                                    >
                                        Require email verification
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'notifications' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Notification Settings
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="email_enabled"
                                        checked={
                                            settings.notifications.email_enabled
                                        }
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'notifications',
                                                'email_enabled',
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="email_enabled"
                                        className="ml-2 block text-sm text-gray-900 dark:text-white"
                                    >
                                        Enable email notifications
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="push_enabled"
                                        checked={
                                            settings.notifications.push_enabled
                                        }
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'notifications',
                                                'push_enabled',
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="push_enabled"
                                        className="ml-2 block text-sm text-gray-900 dark:text-white"
                                    >
                                        Enable push notifications
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="admin_alerts"
                                        checked={
                                            settings.notifications.admin_alerts
                                        }
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'notifications',
                                                'admin_alerts',
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="admin_alerts"
                                        className="ml-2 block text-sm text-gray-900 dark:text-white"
                                    >
                                        Enable admin alerts
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Security Settings
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Session Timeout (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        value={
                                            settings.security.session_timeout
                                        }
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'security',
                                                'session_timeout',
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Max Login Attempts
                                    </label>
                                    <input
                                        type="number"
                                        value={
                                            settings.security.max_login_attempts
                                        }
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'security',
                                                'max_login_attempts',
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="require_2fa"
                                        checked={settings.security.require_2fa}
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'security',
                                                'require_2fa',
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="require_2fa"
                                        className="ml-2 block text-sm text-gray-900 dark:text-white"
                                    >
                                        Require Two-Factor Authentication
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="strong_passwords"
                                        checked={
                                            settings.security.strong_passwords
                                        }
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'security',
                                                'strong_passwords',
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="strong_passwords"
                                        className="ml-2 block text-sm text-gray-900 dark:text-white"
                                    >
                                        Enforce strong passwords
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
