'use client'

import { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    Shield,
    Key,
    UserPlus,
    ShieldCheck,
    Settings,
} from 'lucide-react'

import RolesManagement from '@/modules/admin/components/permissions/RolesManagement'
import PermissionsManagement from '@/modules/admin/components/permissions/PermissionsManagement'
import UserRolesManagement from '@/modules/admin/components/permissions/UserRolesManagement'

export default function PermissionsPage() {
    const [activeTab, setActiveTab] = useState('overview')

    const stats = [
        {
            title: 'Total Roles',
            value: '8',
            description: 'Active roles in system',
            icon: Shield,
            color: 'bg-blue-500',
        },
        {
            title: 'Total Permissions',
            value: '32',
            description: 'Available permissions',
            icon: Key,
            color: 'bg-green-500',
        },
        {
            title: 'Users with Roles',
            value: '156',
            description: 'Users assigned to roles',
            icon: UserPlus,
            color: 'bg-purple-500',
        },
        {
            title: 'Admin Users',
            value: '12',
            description: 'Users with admin access',
            icon: ShieldCheck,
            color: 'bg-orange-500',
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Permissions Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage roles, permissions, and user access control
                    </p>
                </div>
                <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                </Button>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
            >
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="roles">Roles</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="user-roles">User Roles</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.color}`}
                                    >
                                        <stat.icon className="h-4 w-4 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stat.value}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Role Changes</CardTitle>
                                <CardDescription>
                                    Latest modifications to roles and
                                    permissions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    {
                                        action: 'Role Created',
                                        target: 'Content Manager',
                                        time: '2 hours ago',
                                    },
                                    {
                                        action: 'Permission Added',
                                        target: 'edit_track to Editor',
                                        time: '5 hours ago',
                                    },
                                    {
                                        action: 'User Assigned',
                                        target: 'john@example.com to Admin',
                                        time: '1 day ago',
                                    },
                                    {
                                        action: 'Role Modified',
                                        target: 'Moderator permissions',
                                        time: '2 days ago',
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {item.action}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.target}
                                            </p>
                                        </div>
                                        <Badge variant="outline">
                                            {item.time}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Permission Categories</CardTitle>
                                <CardDescription>
                                    Breakdown of permissions by category
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    {
                                        category: 'User Management',
                                        count: 8,
                                        color: 'bg-blue-100 text-blue-800',
                                    },
                                    {
                                        category: 'Content Management',
                                        count: 12,
                                        color: 'bg-green-100 text-green-800',
                                    },
                                    {
                                        category: 'Analytics',
                                        count: 6,
                                        color: 'bg-purple-100 text-purple-800',
                                    },
                                    {
                                        category: 'System Admin',
                                        count: 6,
                                        color: 'bg-red-100 text-red-800',
                                    },
                                ].map((category, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-3 h-3 rounded-full ${category.color.split(' ')[0]}`}
                                            ></div>
                                            <span className="text-sm font-medium">
                                                {category.category}
                                            </span>
                                        </div>
                                        <Badge className={category.color}>
                                            {category.count}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="roles">
                    <RolesManagement />
                </TabsContent>

                <TabsContent value="permissions">
                    <PermissionsManagement />
                </TabsContent>

                <TabsContent value="user-roles">
                    <UserRolesManagement />
                </TabsContent>
            </Tabs>
        </div>
    )
}
