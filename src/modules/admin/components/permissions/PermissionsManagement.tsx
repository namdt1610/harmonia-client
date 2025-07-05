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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Plus, Edit, Trash2, Key, Search, Code } from 'lucide-react'
import { toast } from 'sonner'
import {
    useGetPermissionsQuery,
    useCreatePermissionMutation,
    useUpdatePermissionMutation,
    useDeletePermissionMutation,
    type Permission,
} from '@/modules/admin/api'

export default function PermissionsManagement() {
    const [selectedPermission, setSelectedPermission] =
        useState<Permission | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [newPermissionCode, setNewPermissionCode] = useState('')
    const [newPermissionDescription, setNewPermissionDescription] = useState('')

    // API hooks
    const {
        data: permissions = [],
        isLoading: permissionsLoading,
        refetch: refetchPermissions,
    } = useGetPermissionsQuery()
    const [createPermission] = useCreatePermissionMutation()
    const [updatePermission] = useUpdatePermissionMutation()
    const [deletePermission] = useDeletePermissionMutation()

    const filteredPermissions = permissions.filter(
        (permission) =>
            permission.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (permission.description &&
                permission.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
    )

    const handleCreatePermission = async () => {
        if (!newPermissionCode.trim()) {
            toast.error('Permission code is required')
            return
        }

        try {
            await createPermission({
                code: newPermissionCode.trim(),
                description: newPermissionDescription.trim(),
            }).unwrap()

            toast.success('Permission created successfully')

            setNewPermissionCode('')
            setNewPermissionDescription('')
            setIsCreateDialogOpen(false)
            refetchPermissions()
        } catch (error) {
            toast.error('Failed to create permission')
        }
    }

    const handleUpdatePermission = async () => {
        if (!selectedPermission) return

        try {
            await updatePermission({
                id: selectedPermission.id,
                data: {
                    code: newPermissionCode.trim(),
                    description: newPermissionDescription.trim(),
                },
            }).unwrap()

            toast.success('Permission updated successfully')

            setIsEditDialogOpen(false)
            setSelectedPermission(null)
            refetchPermissions()
        } catch (error) {
            toast.error('Failed to update permission')
        }
    }

    const handleDeletePermission = async (permission: Permission) => {
        try {
            await deletePermission(permission.id).unwrap()
            toast.success('Permission deleted successfully')
            refetchPermissions()
        } catch (error) {
            toast.error('Failed to delete permission')
        }
    }

    const openEditDialog = (permission: Permission) => {
        setSelectedPermission(permission)
        setNewPermissionCode(permission.code)
        setNewPermissionDescription(permission.description)
        setIsEditDialogOpen(true)
    }

    // Group permissions by category for better organization
    const groupedPermissions = filteredPermissions.reduce(
        (acc, permission) => {
            const category = permission.code.split('_')[0] || 'other'
            if (!acc[category]) {
                acc[category] = []
            }
            acc[category].push(permission)
            return acc
        },
        {} as Record<string, Permission[]>
    )

    const categoryColors = {
        user: 'bg-blue-100 text-blue-800',
        track: 'bg-green-100 text-green-800',
        album: 'bg-purple-100 text-purple-800',
        playlist: 'bg-yellow-100 text-yellow-800',
        admin: 'bg-red-100 text-red-800',
        analytics: 'bg-indigo-100 text-indigo-800',
        other: 'bg-gray-100 text-gray-800',
    }

    if (permissionsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                Loading permissions...
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Permissions Management
                    </h2>
                    <p className="text-muted-foreground">
                        Create and manage system permissions that can be
                        assigned to roles
                    </p>
                </div>
                <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Permission
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Permission</DialogTitle>
                            <DialogDescription>
                                Create a new permission that can be assigned to
                                roles.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="permission-code">
                                    Permission Code
                                </Label>
                                <Input
                                    id="permission-code"
                                    value={newPermissionCode}
                                    onChange={(e) =>
                                        setNewPermissionCode(e.target.value)
                                    }
                                    placeholder="e.g. user_create, track_edit"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Use lowercase with underscores (e.g.,
                                    user_create, track_edit)
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="permission-description">
                                    Description
                                </Label>
                                <Textarea
                                    id="permission-description"
                                    value={newPermissionDescription}
                                    onChange={(e) =>
                                        setNewPermissionDescription(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Describe what this permission allows"
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
                            <Button onClick={handleCreatePermission}>
                                Create Permission
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="space-y-6">
                {Object.entries(groupedPermissions).map(
                    ([category, categoryPermissions]) => (
                        <Card key={category}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Key className="h-5 w-5 text-primary" />
                                        <CardTitle className="capitalize">
                                            {category} Permissions
                                        </CardTitle>
                                    </div>
                                    <Badge
                                        className={
                                            categoryColors[
                                                category as keyof typeof categoryColors
                                            ] || categoryColors.other
                                        }
                                    >
                                        {categoryPermissions.length} permissions
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categoryPermissions.map(
                                            (permission) => (
                                                <TableRow key={permission.id}>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <Code className="h-4 w-4 text-muted-foreground" />
                                                            <code className="text-sm bg-muted px-2 py-1 rounded">
                                                                {
                                                                    permission.code
                                                                }
                                                            </code>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {permission.description || (
                                                            <span className="text-muted-foreground italic">
                                                                No description
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    openEditDialog(
                                                                        permission
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="h-3 w-3" />
                                                            </Button>

                                                            <AlertDialog>
                                                                <AlertDialogTrigger
                                                                    asChild
                                                                >
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
                                                                            Delete
                                                                            Permission
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are
                                                                            you
                                                                            sure
                                                                            you
                                                                            want
                                                                            to
                                                                            delete
                                                                            the
                                                                            permission
                                                                            "
                                                                            {
                                                                                permission.code
                                                                            }
                                                                            "?
                                                                            This
                                                                            action
                                                                            cannot
                                                                            be
                                                                            undone
                                                                            and
                                                                            will
                                                                            remove
                                                                            it
                                                                            from
                                                                            all
                                                                            roles.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>
                                                                            Cancel
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() =>
                                                                                handleDeletePermission(
                                                                                    permission
                                                                                )
                                                                            }
                                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )
                )}
            </div>

            {/* Edit Permission Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Permission</DialogTitle>
                        <DialogDescription>
                            Update the permission information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-permission-code">
                                Permission Code
                            </Label>
                            <Input
                                id="edit-permission-code"
                                value={newPermissionCode}
                                onChange={(e) =>
                                    setNewPermissionCode(e.target.value)
                                }
                                placeholder="e.g. user_create, track_edit"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-permission-description">
                                Description
                            </Label>
                            <Textarea
                                id="edit-permission-description"
                                value={newPermissionDescription}
                                onChange={(e) =>
                                    setNewPermissionDescription(e.target.value)
                                }
                                placeholder="Describe what this permission allows"
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
                        <Button onClick={handleUpdatePermission}>
                            Update Permission
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
