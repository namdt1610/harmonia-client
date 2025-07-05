import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@/lib/baseQuery'

export interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    username: string
    role: 'user' | 'admin' | 'moderator'
    is_active: boolean
    date_joined: string
    last_login?: string
    profile?: {
        bio?: string
        location?: string
        website?: string
        image?: string
    }
}

export interface Track {
    id: string
    title: string
    artist: string
    album: string
    genre: string
    duration: string
    file_size: number
    upload_date: string
    plays_count: number
    likes_count: number
    status: 'active' | 'pending' | 'blocked'
}

export interface AnalyticsOverview {
    total_plays: number
    active_users: number
    total_tracks: number
    total_revenue: number
    plays_change: number
    users_change: number
}

export interface ContentAnalytics {
    top_tracks: Array<{
        title: string
        artist: string
        plays: number
    }>
    genres: Array<{
        name: string
        percentage: number
    }>
}

export interface UserAnalytics {
    total_users: number
    premium_users: number
    free_users: number
    moderators: number
    new_users_this_month: number
}

export interface ActivityData {
    id: string
    user: {
        name: string
        location?: string
    }
    track: {
        title: string
        artist: string
    }
    action: 'play' | 'pause' | 'skip' | 'complete'
    timestamp: string
    device: string
    session_time?: string
}

export interface SystemMetrics {
    cpu_usage: number
    memory_usage: number
    disk_usage: number
    network_in: number
    network_out: number
    active_connections: number
    response_time: number
    uptime: string
}

export interface PlayClickData {
    timestamp: string
    count: number
    track_id: number
    track_title: string
    artist_name: string
}

export interface PlayStats {
    totalPlaysToday: number
    playsThisHour: number
    topTrack: {
        title: string
        artist: string
        plays: number
    }
    recentPlays: PlayClickData[]
}

export interface AdminSettings {
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

export interface Role {
    id: number
    name: string
    description: string
    permissions: Permission[]
    permission_count: number
}

export interface Permission {
    id: number
    code: string
    description: string
}

export interface UserRole {
    id: number
    user: number
    role: number
    username: string
    email: string
    role_name: string
    role_description: string
}

export interface UserWithRoles {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    is_active: boolean
    is_staff: boolean
    is_superuser: boolean
    date_joined: string
    roles: Array<{
        id: number
        name: string
        description: string
    }>
    role_names: string[]
}

export interface AssignRoleRequest {
    user_id: number
    role_id: number
}

export interface AssignPermissionToRoleRequest {
    role_id: number
    permission_id: number
}

export interface SubscriptionAnalytics {
    total_subscribers: number
    active_subscribers: number
    trial_users: number
    cancelled_subscriptions: number
    revenue_this_month: number
    revenue_last_month: number
    plan_distribution: Record<string, number>
    churn_rate: number
}

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery,
    tagTypes: [
        'Users',
        'Tracks',
        'Analytics',
        'Activity',
        'Settings',
        'SystemMetrics',
        'PlayStats',
        'SubscriptionAnalytics',
    ],
    endpoints: (builder) => ({
        // Users
        getUsers: builder.query<
            User[],
            { role?: string; status?: string; search?: string }
        >({
            query: (params) => ({
                url: '/users/',
                params,
            }),
            providesTags: ['Users'],
        }),
        updateUserRole: builder.mutation<User, { id: string; role: string }>({
            query: ({ id, ...patch }) => ({
                url: `/admin/users/${id}/`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Users'],
        }),
        deleteUser: builder.mutation<void, string>({
            query: (id) => ({
                url: `/admin/users/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),

        // Tracks - COMMENTED OUT: Backend doesn't have admin tracks endpoints
        // getAdminTracks: builder.query<
        //     Track[],
        //     { status?: string; search?: string }
        // >({
        //     query: (params) => ({
        //         url: '/admin/tracks/',
        //         params,
        //     }),
        //     providesTags: ['Tracks'],
        // }),
        // updateTrackStatus: builder.mutation<
        //     Track,
        //     { id: string; status: string }
        // >({
        //     query: ({ id, ...patch }) => ({
        //         url: `/admin/tracks/${id}/`,
        //         method: 'PATCH',
        //         body: patch,
        //     }),
        //     invalidatesTags: ['Tracks'],
        // }),
        // deleteTrack: builder.mutation<void, string>({
        //     query: (id) => ({
        //         url: `/admin/tracks/${id}/`,
        //         method: 'DELETE',
        //     }),
        //     invalidatesTags: ['Tracks'],
        // }),

        // Analytics
        getAnalyticsOverview: builder.query<AnalyticsOverview, void>({
            query: () => '/admin/analytics/overview/',
            providesTags: ['Analytics'],
        }),
        getContentAnalytics: builder.query<ContentAnalytics, void>({
            query: () => '/admin/analytics/content/',
            providesTags: ['Analytics'],
        }),
        getUserAnalytics: builder.query<UserAnalytics, void>({
            query: () => '/admin/analytics/users/',
            providesTags: ['Analytics'],
        }),

        // Activity & Monitoring
        getLiveActivity: builder.query<ActivityData[], void>({
            query: () => '/admin/analytics/live-activity/',
            providesTags: ['Activity'],
        }),
        getRealTimeAnalytics: builder.query<SystemMetrics, void>({
            query: () => '/admin/analytics/real-time/',
            providesTags: ['SystemMetrics'],
        }),

        // Play Stats
        getPlayClicksStats: builder.query<PlayStats, void>({
            query: () => '/admin/analytics/play-clicks/',
            providesTags: ['PlayStats'],
        }),

        // Subscription Analytics
        getSubscriptionAnalytics: builder.query<SubscriptionAnalytics, void>({
            query: () => '/subscriptions/analytics/',
            providesTags: ['SubscriptionAnalytics'],
        }),

        // Settings - COMMENTED OUT: Backend doesn't have admin settings endpoints
        // getAdminSettings: builder.query<AdminSettings, void>({
        //     query: () => '/admin/settings/',
        //     providesTags: ['Settings'],
        // }),
        // updateAdminSettings: builder.mutation<
        //     AdminSettings,
        //     Partial<AdminSettings>
        // >({
        //     query: (settings) => ({
        //         url: '/admin/settings/',
        //         method: 'PUT',
        //         body: settings,
        //     }),
        //     invalidatesTags: ['Settings'],
        // }),
    }),
})

export const {
    useGetUsersQuery,
    useUpdateUserRoleMutation,
    useDeleteUserMutation,
    // useGetAdminTracksQuery,
    // useUpdateTrackStatusMutation,
    // useDeleteTrackMutation,
    useGetAnalyticsOverviewQuery,
    useGetContentAnalyticsQuery,
    useGetUserAnalyticsQuery,
    useGetLiveActivityQuery,
    useGetRealTimeAnalyticsQuery,
    useGetPlayClicksStatsQuery,
    useGetSubscriptionAnalyticsQuery,
    // useGetAdminSettingsQuery,
    // useUpdateAdminSettingsMutation,
} = adminApi

// RBAC API
export const rbacApi = createApi({
    reducerPath: 'rbacApi',
    baseQuery,
    tagTypes: ['Role', 'Permission', 'UserRole'],
    endpoints: (builder) => ({
        // Roles
        getRoles: builder.query<Role[], void>({
            query: () => '/admin/permissions/roles/',
            providesTags: ['Role'],
        }),

        getRole: builder.query<Role, number>({
            query: (id) => `/admin/permissions/roles/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Role', id }],
        }),

        createRole: builder.mutation<
            Role,
            Omit<Role, 'id' | 'permissions' | 'permission_count'>
        >({
            query: (data) => ({
                url: '/admin/permissions/roles/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Role'],
        }),

        updateRole: builder.mutation<
            Role,
            {
                id: number
                data: Partial<
                    Omit<Role, 'id' | 'permissions' | 'permission_count'>
                >
            }
        >({
            query: ({ id, data }) => ({
                url: `/admin/permissions/roles/${id}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }],
        }),

        deleteRole: builder.mutation<void, number>({
            query: (id) => ({
                url: `/admin/permissions/roles/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Role'],
        }),

        assignPermissionToRole: builder.mutation<
            { message: string },
            { roleId: number; permissionId: number }
        >({
            query: ({ roleId, permissionId }) => ({
                url: `/admin/permissions/roles/${roleId}/assign_permission/`,
                method: 'POST',
                body: {
                    role_id: roleId,
                    permission_id: permissionId,
                },
            }),
            invalidatesTags: (result, error, { roleId }) => [
                { type: 'Role', id: roleId },
            ],
        }),

        removePermissionFromRole: builder.mutation<
            { message: string },
            { roleId: number; permissionId: number }
        >({
            query: ({ roleId, permissionId }) => ({
                url: `/admin/permissions/roles/${roleId}/remove_permission/`,
                method: 'DELETE',
                body: { permission_id: permissionId },
            }),
            invalidatesTags: (result, error, { roleId }) => [
                { type: 'Role', id: roleId },
            ],
        }),

        // Permissions
        getPermissions: builder.query<Permission[], void>({
            query: () => '/admin/permissions/permissions/',
            providesTags: ['Permission'],
        }),

        getPermission: builder.query<Permission, number>({
            query: (id) => `/admin/permissions/permissions/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Permission', id }],
        }),

        createPermission: builder.mutation<Permission, Omit<Permission, 'id'>>({
            query: (data) => ({
                url: '/admin/permissions/permissions/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Permission'],
        }),

        updatePermission: builder.mutation<
            Permission,
            { id: number; data: Partial<Omit<Permission, 'id'>> }
        >({
            query: ({ id, data }) => ({
                url: `/admin/permissions/permissions/${id}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Permission', id },
            ],
        }),

        deletePermission: builder.mutation<void, number>({
            query: (id) => ({
                url: `/admin/permissions/permissions/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Permission'],
        }),

        // User Roles
        getUserRoles: builder.query<UserRole[], void>({
            query: () => '/admin/permissions/user-roles/',
            providesTags: ['UserRole'],
        }),

        getUsersWithRoles: builder.query<UserWithRoles[], void>({
            query: () => '/admin/permissions/users-with-roles/',
            providesTags: ['UserRole'],
        }),

        assignRoleToUser: builder.mutation<
            { message: string },
            AssignRoleRequest
        >({
            query: (data) => ({
                url: '/admin/permissions/assign-role/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['UserRole'],
        }),

        removeRoleFromUser: builder.mutation<
            { message: string },
            AssignRoleRequest
        >({
            query: (data) => ({
                url: '/admin/permissions/remove-role/',
                method: 'DELETE',
                body: data,
            }),
            invalidatesTags: ['UserRole'],
        }),

        getUserPermissions: builder.query<
            { user_id: number; username: string; permissions: string[] },
            number | void
        >({
            query: (userId) =>
                userId
                    ? `/admin/permissions/user-permissions/${userId}/`
                    : '/admin/permissions/user-permissions/',
        }),
    }),
})

export const {
    // Roles
    useGetRolesQuery,
    useGetRoleQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useAssignPermissionToRoleMutation,
    useRemovePermissionFromRoleMutation,

    // Permissions
    useGetPermissionsQuery,
    useGetPermissionQuery,
    useCreatePermissionMutation,
    useUpdatePermissionMutation,
    useDeletePermissionMutation,

    // User Roles
    useGetUserRolesQuery,
    useGetUsersWithRolesQuery,
    useAssignRoleToUserMutation,
    useRemoveRoleFromUserMutation,
    useGetUserPermissionsQuery,
} = rbacApi
