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
import { Textarea } from '@/components/ui/textarea'
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Plus,
    Edit,
    Trash2,
    Shield,
    Users,
    Settings,
    Search,
} from 'lucide-react'
import { toast } from 'sonner'
import {
    useGetRolesQuery,
    useGetPermissionsQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useAssignPermissionToRoleMutation,
    useRemovePermissionFromRoleMutation,
    type Role,
    type Permission,
} from '@/modules/admin/api'

export default function RolesManagement() {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] =
        useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [newRoleName, setNewRoleName] = useState('')
    const [newRoleDescription, setNewRoleDescription] = useState('')

    // API hooks
    const {
        data: roles = [],
        isLoading: rolesLoading,
        refetch: refetchRoles,
    } = useGetRolesQuery()
    const { data: permissions = [] } = useGetPermissionsQuery()
    const [createRole] = useCreateRoleMutation()
    const [updateRole] = useUpdateRoleMutation()
    const [deleteRole] = useDeleteRoleMutation()
    const [assignPermission] = useAssignPermissionToRoleMutation()
    const [removePermission] = useRemovePermissionFromRoleMutation()

    const filteredRoles = roles.filter(
        (role) =>
            role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateRole = async () => {
        if (!newRoleName.trim()) {
            toast.error('Role name is required')
            return
        }

        try {
            await createRole({
                name: newRoleName.trim(),
                description: newRoleDescription.trim(),
            }).unwrap()

            toast.success('Role created successfully')

            setNewRoleName('')
            setNewRoleDescription('')
            setIsCreateDialogOpen(false)
            refetchRoles()
        } catch (error) {
            toast.error('Failed to create role')
        }
    }

    const handleUpdateRole = async () => {
        if (!selectedRole) return

        try {
            await updateRole({
                id: selectedRole.id,
                data: {
                    name: newRoleName.trim(),
                    description: newRoleDescription.trim(),
                },
            }).unwrap()

            toast.success('Role updated successfully')

            setIsEditDialogOpen(false)
            setSelectedRole(null)
            refetchRoles()
        } catch (error) {
            toast.error('Failed to update role')
        }
    }

    const handleDeleteRole = async (role: Role) => {
        try {
            await deleteRole(role.id).unwrap()
            toast.success('Role deleted successfully')
            refetchRoles()
        } catch (error) {
            toast.error('Failed to delete role')
        }
    }

    const handlePermissionToggle = async (
        permission: Permission,
        isAssigned: boolean
    ) => {
        if (!selectedRole) return

        try {
            if (isAssigned) {
                await removePermission({
                    roleId: selectedRole.id,
                    permissionId: permission.id,
                }).unwrap()
            } else {
                await assignPermission({
                    roleId: selectedRole.id,
                    permissionId: permission.id,
                }).unwrap()
            }

            toast.success(
                `Permission ${isAssigned ? 'removed from' : 'assigned to'} role`
            )

            refetchRoles()
        } catch (error) {
            toast.error(
                `Failed to ${isAssigned ? 'remove' : 'assign'} permission`
            )
        }
    }

    const openEditDialog = (role: Role) => {
        setSelectedRole(role)
        setNewRoleName(role.name)
        setNewRoleDescription(role.description)
        setIsEditDialogOpen(true)
    }

    const openPermissionsDialog = (role: Role) => {
        setSelectedRole(role)
        setIsPermissionsDialogOpen(true)
    }

    if (rolesLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                Loading roles...
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Roles Management
                    </h2>
                    <p className="text-muted-foreground">
                        Create and manage user roles and their permissions
                    </p>
                </div>
                <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Role</DialogTitle>
                            <DialogDescription>
                                Create a new role that can be assigned to users.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="role-name">Role Name</Label>
                                <Input
                                    id="role-name"
                                    value={newRoleName}
                                    onChange={(e) =>
                                        setNewRoleName(e.target.value)
                                    }
                                    placeholder="Enter role name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="role-description">
                                    Description
                                </Label>
                                <Textarea
                                    id="role-description"
                                    value={newRoleDescription}
                                    onChange={(e) =>
                                        setNewRoleDescription(e.target.value)
                                    }
                                    placeholder="Enter role description"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleCreateRole}>
                                Create Role
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRoles.map((role) => (
                    <Card key={role.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center space-x-2">
                                <Shield className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">
                                    {role.name}
                                </CardTitle>
                            </div>
                            <Badge variant="secondary">
                                {role.permission_count} permissions
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CardDescription>
                                {role.description || 'No description'}
                            </CardDescription>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditDialog(role)}
                                    >
                                        <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            openPermissionsDialog(role)
                                        }
                                    >
                                        <Settings className="h-3 w-3" />
                                    </Button>
                                </div>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete Role
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete
                                                the role "{role.name}"? This
                                                action cannot be undone and will
                                                remove all user assignments.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    handleDeleteRole(role)
                                                }
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Role Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                        <DialogDescription>
                            Update the role information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-role-name">Role Name</Label>
                            <Input
                                id="edit-role-name"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                placeholder="Enter role name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-role-description">
                                Description
                            </Label>
                            <Textarea
                                id="edit-role-description"
                                value={newRoleDescription}
                                onChange={(e) =>
                                    setNewRoleDescription(e.target.value)
                                }
                                placeholder="Enter role description"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateRole}>Update Role</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Permissions Dialog */}
            <Dialog
                open={isPermissionsDialogOpen}
                onOpenChange={setIsPermissionsDialogOpen}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Manage Permissions - {selectedRole?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Select which permissions to assign to this role.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                        {permissions.map((permission) => {
                            const isAssigned =
                                selectedRole?.permissions.some(
                                    (p) => p.id === permission.id
                                ) || false
                            return (
                                <div
                                    key={permission.id}
                                    className="flex items-center space-x-2 p-2 border rounded"
                                >
                                    <Checkbox
                                        id={`permission-${permission.id}`}
                                        checked={isAssigned}
                                        onCheckedChange={() =>
                                            handlePermissionToggle(
                                                permission,
                                                isAssigned
                                            )
                                        }
                                    />
                                    <div className="flex-1">
                                        <Label
                                            htmlFor={`permission-${permission.id}`}
                                            className="text-sm font-medium"
                                        >
                                            {permission.code}
                                        </Label>
                                        {permission.description && (
                                            <p className="text-xs text-muted-foreground">
                                                {permission.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => setIsPermissionsDialogOpen(false)}
                        >
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
