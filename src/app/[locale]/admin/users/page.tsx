'use client'

import { useState } from 'react'
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    UserPlus,
    Download,
    Eye,
    Edit,
    Trash2,
    Shield,
    ShieldCheck,
    Calendar,
} from 'lucide-react'
import {
    useGetUsersQuery,
    useUpdateUserRoleMutation,
    useDeleteUserMutation,
    type User,
} from '@/modules/admin/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    // RTK Query hooks
    const { data: users = [], isLoading, error, refetch } = useGetUsersQuery({})
    const [updateUserRole, { isLoading: isUpdating }] =
        useUpdateUserRoleMutation()
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

    const handleUpdateRole = async (userId: string, newRole: string) => {
        try {
            await updateUserRole({ id: userId, role: newRole }).unwrap()
            // Show success message (you can add a toast notification here)
            console.log('User role updated successfully')
        } catch (error) {
            console.error('Failed to update user role:', error)
            // Show error message
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId).unwrap()
                // Show success message
                console.log('User deleted successfully')
            } catch (error) {
                console.error('Failed to delete user:', error)
                // Show error message
            }
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <ShieldCheck className="h-4 w-4 text-red-500" />
            case 'moderator':
                return <Shield className="h-4 w-4 text-blue-500" />
            default:
                return <Users className="h-4 w-4 text-gray-500" />
        }
    }

    const getStatusBadge = (isActive: boolean) => {
        if (isActive) {
            return (
                <Badge
                    variant="default"
                    className="bg-green-500 hover:bg-green-600"
                >
                    Active
                </Badge>
            )
        } else {
            return <Badge variant="destructive">Inactive</Badge>
        }
    }

    // Helper function to determine subscription type (since it's not in the User interface)
    const getSubscriptionBadge = (user: User) => {
        // For now, we'll use a simple logic - you can enhance this based on your subscription model
        const subscriptionType = user.role === 'admin' ? 'pro' : 'free'

        switch (subscriptionType) {
            case 'pro':
                return (
                    <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                    >
                        Pro
                    </Badge>
                )
            case 'free':
                return <Badge variant="outline">Free</Badge>
            default:
                return <Badge variant="outline">Unknown</Badge>
        }
    }

    const filteredUsers = users.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
        const matchesSearch =
            fullName.includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && user.is_active) ||
            (statusFilter === 'inactive' && !user.is_active)
        return matchesSearch && matchesRole && matchesStatus
    })

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center space-x-4"
                                >
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[200px]" />
                                        <Skeleton className="h-4 w-[160px]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-red-500 mb-4">Error loading users</p>
                        <Button onClick={() => refetch()}>Retry</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Users
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage user accounts and permissions
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={roleFilter}
                            onValueChange={setRoleFilter}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="moderator">
                                    Moderator
                                </SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Users ({filteredUsers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Subscription</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-medium">
                                                    {user.first_name?.charAt(
                                                        0
                                                    ) ||
                                                        user.username?.charAt(
                                                            0
                                                        ) ||
                                                        'U'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {user.first_name &&
                                                    user.last_name
                                                        ? `${user.first_name} ${user.last_name}`
                                                        : user.username}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getRoleIcon(user.role)}
                                            <Badge
                                                variant="outline"
                                                className="capitalize"
                                            >
                                                {user.role}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(user.is_active)}
                                    </TableCell>
                                    <TableCell>
                                        {getSubscriptionBadge(user)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {new Date(
                                                    user.date_joined
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit user
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleUpdateRole(
                                                            user.id,
                                                            user.role ===
                                                                'admin'
                                                                ? 'user'
                                                                : 'admin'
                                                        )
                                                    }
                                                    disabled={isUpdating}
                                                >
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    {user.role === 'admin'
                                                        ? 'Remove admin'
                                                        : 'Make admin'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDeleteUser(
                                                            user.id
                                                        )
                                                    }
                                                    disabled={isDeleting}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete user
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                No users found
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
