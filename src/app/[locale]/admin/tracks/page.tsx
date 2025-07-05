'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Search,
    Filter,
    Play,
    Pause,
    MoreHorizontal,
    Music,
    Download,
    Eye,
    Edit,
    Trash2,
    Clock,
    BarChart3,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

// Import từ tracks API thông thường thay vì admin API
import {
    useGetTracksQuery,
    useUpdateTrackMutation,
    useDeleteTrackMutation,
} from '@/modules/tracks/api'
import { Track } from '@/types'
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

// Extended Track interface for admin with additional fields
interface AdminTrack extends Track {
    upload_date?: string
    status?: 'active' | 'pending' | 'blocked'
    is_downloadable?: boolean
    file_size?: number
    plays_count?: number
    likes_count?: number
}

export default function AdminTracksPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [playingTrack, setPlayingTrack] = useState<string | null>(null)

    // RTK Query hooks - sử dụng tracks API thông thường
    const {
        data: tracks = [],
        isLoading,
        error,
        refetch,
    } = useGetTracksQuery({})
    const [updateTrack, { isLoading: isUpdating }] = useUpdateTrackMutation()
    const [deleteTrack, { isLoading: isDeleting }] = useDeleteTrackMutation()

    // Filter tracks based on search and status
    const filteredTracks = (tracks as AdminTrack[]).filter((track) => {
        const matchesSearch =
            track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            track.artist.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus =
            statusFilter === 'all' || track.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleStatusUpdate = async (trackId: number, newStatus: string) => {
        try {
            await updateTrack({
                id: trackId,
                updates: { status: newStatus } as any,
            }).unwrap()
            toast.success(`Track status updated to ${newStatus}`)
            refetch()
        } catch (error) {
            toast.error('Failed to update track status')
        }
    }

    const handleDeleteTrack = async (trackId: number) => {
        if (confirm('Are you sure you want to delete this track?')) {
            try {
                await deleteTrack(trackId).unwrap()
                toast.success('Track deleted successfully')
                refetch()
            } catch (error) {
                toast.error('Failed to delete track')
            }
        }
    }

    const handlePlayToggle = (trackId: number) => {
        if (playingTrack === trackId.toString()) {
            setPlayingTrack(null)
        } else {
            setPlayingTrack(trackId.toString())
        }
    }

    const getStatusBadge = (status: string = 'active') => {
        switch (status) {
            case 'active':
                return (
                    <Badge
                        variant="default"
                        className="bg-green-500 hover:bg-green-600"
                    >
                        Active
                    </Badge>
                )
            case 'pending':
                return (
                    <Badge
                        variant="secondary"
                        className="bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                        Pending
                    </Badge>
                )
            case 'blocked':
                return <Badge variant="destructive">Blocked</Badge>
            default:
                return <Badge variant="outline">Unknown</Badge>
        }
    }

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'N/A'
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return (
            Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
        )
    }

    const formatDuration = (duration: number) => {
        if (!duration) return 'N/A'
        const minutes = Math.floor(duration / 60)
        const seconds = duration % 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
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
                                    <Skeleton className="h-12 w-12 rounded" />
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
                        <p className="text-red-500 mb-4">
                            Error loading tracks
                        </p>
                        <Button onClick={() => refetch()}>Retry</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Track Management
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Manage and moderate tracks on the platform
                </p>
            </div>

            {/* Search and Filter Bar */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search tracks or artists..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
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
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="blocked">Blocked</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tracks Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Music className="h-5 w-5" />
                        Tracks ({filteredTracks.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Track</TableHead>
                                <TableHead>Artist/Album</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Stats</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Upload Date</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTracks.map((track: AdminTrack) => (
                                <TableRow key={track.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                    handlePlayToggle(track.id)
                                                }
                                            >
                                                {playingTrack ===
                                                track.id.toString() ? (
                                                    <Pause className="h-4 w-4" />
                                                ) : (
                                                    <Play className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {track.title}
                                                </p>
                                                {track.genre && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs mt-1"
                                                    >
                                                        {track.genre.name}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-foreground">
                                                {track.artist.name}
                                            </p>
                                            {track.album && (
                                                <p className="text-sm text-muted-foreground">
                                                    {track.album.title}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(track.status)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Play className="h-3 w-3 text-muted-foreground" />
                                                <span>
                                                    {track.plays_count?.toLocaleString() ||
                                                        track.play_count?.toLocaleString() ||
                                                        '0'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <BarChart3 className="h-3 w-3 text-muted-foreground" />
                                                <span>
                                                    {formatFileSize(
                                                        track.file_size
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {formatDuration(track.duration)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">
                                            {track.upload_date
                                                ? new Date(
                                                      track.upload_date
                                                  ).toLocaleDateString()
                                                : new Date(
                                                      track.created_at
                                                  ).toLocaleDateString()}
                                        </span>
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
                                                    Edit track
                                                </DropdownMenuItem>
                                                {track.status === 'pending' && (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                track.id,
                                                                'active'
                                                            )
                                                        }
                                                        disabled={isUpdating}
                                                    >
                                                        <Play className="mr-2 h-4 w-4" />
                                                        Approve
                                                    </DropdownMenuItem>
                                                )}
                                                {track.status === 'active' && (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                track.id,
                                                                'blocked'
                                                            )
                                                        }
                                                        disabled={isUpdating}
                                                    >
                                                        <Pause className="mr-2 h-4 w-4" />
                                                        Block
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDeleteTrack(
                                                            track.id
                                                        )
                                                    }
                                                    disabled={isDeleting}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete track
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {filteredTracks.length === 0 && (
                        <div className="text-center py-8">
                            <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                No tracks found
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
