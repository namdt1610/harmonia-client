import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'
import { toast } from 'sonner'

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
            videoRef.current.requestFullscreen().catch((error) => {
                console.error('Error attempting to enable fullscreen:', error)
                toast.error('Failed to enter fullscreen mode')
            })
        } else {
            document.exitFullscreen().catch((error) => {
                console.error('Error attempting to exit fullscreen:', error)
                toast.error('Failed to exit fullscreen mode')
            })
        }
    }

    const handleDownloadClick = () => {
        try {
            if (onDownload) {
                onDownload()
            } else {
                // Fallback download method
                const link = document.createElement('a')
                link.href = videoUrl
                link.download = 'video.mp4'
                link.target = '_blank'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                toast.success('Video download started')
            }
        } catch (error) {
            console.error('Error downloading video:', error)
            toast.error('Failed to download video')
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
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-4 right-4 text-white hover:text-white/80"
                    onClick={handleDownloadClick}
                    title="Download video"
                >
                    <Download size={24} />
                </Button>
            </div>
        </div>
    )
}
