import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'

interface VideoPlayerProps {
    videoUrl: string
    onClose: () => void
    onDownload?: () => void
}

export default function VideoPlayer({
    videoUrl,
    onClose,
    onDownload,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement !== null)
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            )
        }
    }, [])

    const toggleFullscreen = () => {
        if (!videoRef.current) return

        if (!document.fullscreenElement) {
            videoRef.current.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-4xl mx-4">
                {/* Close button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-12 right-0 text-white hover:text-white/80"
                    onClick={onClose}
                >
                    <X size={24} />
                </Button>

                {/* Video player */}
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full aspect-video rounded-lg"
                    controls
                    autoPlay
                    onDoubleClick={toggleFullscreen}
                />

                {/* Download button */}
                {onDownload && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-4 right-4 text-white hover:text-white/80"
                        onClick={onDownload}
                    >
                        <Download size={24} />
                    </Button>
                )}
            </div>
        </div>
    )
}
