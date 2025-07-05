'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Music,
    BarChart3,
    Settings,
    PlayCircle,
    Activity,
    Shield,
    CreditCard,
} from 'lucide-react'

const sidebarItems = [
    {
        name: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
    },
    {
        name: 'Users',
        href: '/admin/users',
        icon: Users,
    },
    {
        name: 'Permissions',
        href: '/admin/permissions',
        icon: Shield,
    },
    {
        name: 'Subscriptions',
        href: '/admin/subscriptions',
        icon: CreditCard,
    },
    {
        name: 'Tracks',
        href: '/admin/tracks',
        icon: Music,
    },
    {
        name: 'Play Activity',
        href: '/admin/activity',
        icon: Activity,
    },
    {
        name: 'Real-time Monitor',
        href: '/admin/monitor',
        icon: PlayCircle,
    },
    {
        name: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="w-64 bg-sidebar border-r border-border">
            <div className="p-6">
                <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2"
                >
                    <Music className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold text-sidebar-foreground">
                        Harmonia Admin
                    </span>
                </Link>
            </div>

            <nav className="mt-6">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-6 py-3 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                                isActive
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border-r-2 border-primary'
                                    : ''
                            }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
