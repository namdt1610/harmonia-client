'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    UserPlus,
    UserMinus,
    Users,
    Search,
    Shield,
    Mail,
    Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import {
    useGetUsersWithRolesQuery,
    useGetRolesQuery,
    useAssignRoleToUserMutation,
    useRemoveRoleFromUserMutation,
    useGetUserPermissionsQuery,
    type UserWithRoles,
    type Role,
} from '@/modules/admin/api'

export default function UserRolesManagement() {
    const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null)
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
    const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] =
        useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRoleId, setSelectedRoleId] = useState<string>('')
    const [selectedUserId, setSelectedUserId] = useState<string>('')

    // API hooks
    const {
        data: usersWithRoles = [],
        isLoading: usersLoading,
        refetch: refetchUsers,
    } = useGetUsersWithRolesQuery()
    const { data: roles = [] } = useGetRolesQuery()
    const { data: userPermissions } = useGetUserPermissionsQuery(
        selectedUser?.id
    )
    const [assignRole] = useAssignRoleToUserMutation()
    const [removeRole] = useRemoveRoleFromUserMutation()

    const filteredUsers = usersWithRoles.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role_names.some((role) =>
                role.toLowerCase().includes(searchTerm.toLowerCase())
            )
    )

    const handleAssignRole = async () => {
        if (!selectedRoleId || !selectedUserId) {
            toast.error('Please select both user and role')
            return
        }

        try {
            await assignRole({
                user_id: parseInt(selectedUserId),
                role_id: parseInt(selectedRoleId),
            }).unwrap()

            toast.success('Role assigned successfully')

            setSelectedRoleId('')
            setSelectedUserId('')
            setIsAssignDialogOpen(false)
            refetchUsers()
        } catch (error) {
            toast.error('Failed to assign role')
        }
    }

    const handleRemoveRole = async (
        userId: number,
        roleId: number,
        roleName: string
    ) => {
        try {
            await removeRole({
                user_id: userId,
                role_id: roleId,
            }).unwrap()

            toast.success(`Role "${roleName}" removed successfully`)

            refetchUsers()
        } catch (error) {
            toast.error('Failed to remove role')
        }
    }

    const openPermissionsDialog = (user: UserWithRoles) => {
        setSelectedUser(user)
        setIsPermissionsDialogOpen(true)
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    if (usersLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                Loading users...
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        User Roles Management
                    </h2>
                    <p className="text-muted-foreground">
                        Assign and manage roles for users in the system
                    </p>
                </div>
                <Dialog
                    open={isAssignDialogOpen}
                    onOpenChange={setIsAssignDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assign Role to User</DialogTitle>
                            <DialogDescription>
                                Select a user and role to create a new
                                assignment.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="select-user">Select User</Label>
                                <Select
                                    value={selectedUserId}
                                    onValueChange={setSelectedUserId}
                                >
                                    <SelectTrigger id="select-user">
                                        <SelectValue placeholder="Choose a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {usersWithRoles.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={user.id.toString()}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src="" />
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(
                                                                user.first_name,
                                                                user.last_name
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>
                                                        {user.username} (
                                                        {user.email})
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="select-role">Select Role</Label>
                                <Select
                                    value={selectedRoleId}
                                    onValueChange={setSelectedRoleId}
                                >
                                    <SelectTrigger id="select-role">
                                        <SelectValue placeholder="Choose a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role.id}
                                                value={role.id.toString()}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <Shield className="h-4 w-4" />
                                                    <span>{role.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsAssignDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleAssignRole}>
                                Assign Role
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search users by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Users and Their Roles</span>
                    </CardTitle>
                    <CardDescription>
                        Overview of all users and their assigned roles
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Status</TableHead>
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
                                        <div className="flex items-center space-x-3">
                                            <Avatar>
                                                <AvatarImage src="" />
                                                <AvatarFallback>
                                                    {getInitials(
                                                        user.first_name,
                                                        user.last_name
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">
                                                    {user.first_name}{' '}
                                                    {user.last_name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    @{user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span>{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.length > 0 ? (
                                                user.roles.map((role) => (
                                                    <div
                                                        key={role.id}
                                                        className="flex items-center space-x-1"
                                                    >
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {role.name}
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                                                            onClick={() =>
                                                                handleRemoveRole(
                                                                    user.id,
                                                                    role.id,
                                                                    role.name
                                                                )
                                                            }
                                                        >
                                                            <UserMinus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="text-muted-foreground"
                                                >
                                                    No roles
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className={`w-2 h-2 rounded-full ${
                                                    user.is_active
                                                        ? 'bg-green-500'
                                                        : 'bg-red-500'
                                                }`}
                                            />
                                            <span className="text-sm">
                                                {user.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>
                                            {user.is_staff && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    Staff
                                                </Badge>
                                            )}
                                            {user.is_superuser && (
                                                <Badge
                                                    variant="destructive"
                                                    className="text-xs"
                                                >
                                                    Superuser
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {formatDate(user.date_joined)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                openPermissionsDialog(user)
                                            }
                                        >
                                            View Permissions
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* User Permissions Dialog */}
            <Dialog
                open={isPermissionsDialogOpen}
                onOpenChange={setIsPermissionsDialogOpen}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            User Permissions - {selectedUser?.first_name}{' '}
                            {selectedUser?.last_name}
                        </DialogTitle>
                        <DialogDescription>
                            All permissions granted to this user through their
                            roles
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">
                                Assigned Roles:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedUser?.roles.map((role) => (
                                    <Badge key={role.id} variant="secondary">
                                        {role.name}
                                    </Badge>
                                )) || (
                                    <span className="text-sm text-muted-foreground">
                                        No roles assigned
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium mb-2">
                                Effective Permissions:
                            </h4>
                            <div className="max-h-64 overflow-y-auto border rounded p-3">
                                {userPermissions?.permissions.length ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {userPermissions.permissions.map(
                                            (permission, index) => (
                                                <div
                                                    key={index}
                                                    className="text-sm font-mono bg-muted px-2 py-1 rounded"
                                                >
                                                    {permission}
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        No permissions granted
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => setIsPermissionsDialogOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
