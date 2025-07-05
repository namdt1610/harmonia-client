'use client'

import { useAppSelector } from '@/redux/hooks'
import { Bell, Search, UserCircle } from 'lucide-react'

export default function AdminHeader() {
    const { user } = useAppSelector((state) => state.auth)

    return (
        <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-2 w-64 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-muted-foreground hover:text-foreground">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                            3
                        </span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-card-foreground">
                                {user?.display_name || user?.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Administrator
                            </p>
                        </div>
                        {user?.image ? (
                            <img
                                src={user.image}
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <UserCircle className="h-8 w-8 text-muted-foreground" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
