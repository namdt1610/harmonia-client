import Image from 'next/image'
import DefaultCover from '@/assets/images/default-cover.webp'

interface PlayerInfoProps {
    songTitle: string
    artistName: string
    albumCover: string | null
}

export function PlayerInfo({
    songTitle,
    artistName,
    albumCover,
}: PlayerInfoProps) {
    return (
        <div className="w-1/4 flex items-center">
            {albumCover ? (
                <Image
                    src={albumCover}
                    alt={songTitle}
                    className="w-14 h-14 bg-neutral-800 mr-3 flex-shrink-0 object-cover"
                />
            ) : (
                <div className="w-14 h-14 bg-neutral-800 mr-3 flex-shrink-0 flex items-center justify-center">
                    <Image
                        src={DefaultCover}
                        alt="Default cover"
                        width={56}
                        height={56}
                        className="object-cover"
                    />
                </div>
            )}
            <div>
                <p className="font-medium">{songTitle}</p>
                <p className="text-xs text-neutral-400">{artistName}</p>
            </div>
        </div>
    )
}
