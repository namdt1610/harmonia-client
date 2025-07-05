'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
    children: ReactNode
}

export default function SubscriptionLayout({ children }: Props) {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Custom Header for Subscription */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.back()}
                                className="text-white hover:bg-white/10"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <div className="flex items-center gap-2">
                                <Crown className="h-6 w-6 text-yellow-400" />
                                <h1 className="text-xl font-bold text-white">
                                    Harmonia Premium
                                </h1>
                            </div>
                        </div>
                        <div className="text-sm text-gray-300">
                            Choose your plan
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-5 bg-cover bg-center" />

                {/* Content wrapper */}
                <div className="relative z-10">{children}</div>

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </main>

            {/* Footer */}
            <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-sm text-gray-400">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Crown className="h-4 w-4 text-yellow-400" />
                            <span>Powered by Harmonia Music</span>
                        </div>
                        <p>Secure payments • Cancel anytime • 24/7 support</p>
                        {process.env.NODE_ENV === 'development' && (
                            <p className="mt-2 text-blue-400 text-xs">
                                Development Mode: Test card 4242424242424242
                            </p>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    )
}
