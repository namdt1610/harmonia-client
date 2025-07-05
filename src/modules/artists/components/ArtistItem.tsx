import { Card, CardFooter, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

import type { Artist } from '@/types'

export default function ArtistItem({
    artist,
    onMoreOptions,
}: {
    artist: Artist
    onMoreOptions?: (id: number) => void
}) {
    return (
        <Card className="group p-3 aspect-[1/1.13] bg-neutral-900/70 border-none shadow-none relative hover:bg-neutral-800/90 transition-colors">
            <CardContent className="p-0 flex flex-col items-center pb-2">
                <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-md">
                    <img
                        className="w-full h-full object-cover"
                        src={artist.image}
                        alt={artist.name}
                    />
                </div>
            </CardContent>
            <CardFooter className="p-0 flex flex-col items-center">
                <h4 className="font-semibold text-base truncate mt-1 mb-0.5 w-full text-center">
                    {artist.name}
                </h4>
                {artist.genres && artist.genres.length > 0 && (
                    <span className="text-xs text-neutral-400 text-center">
                        {artist.genres.join(', ')}
                    </span>
                )}
            </CardFooter>
            <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 text-neutral-400 hover:text-white"
                onClick={(e) => {
                    e.stopPropagation()
                    onMoreOptions?.(artist.id)
                }}
                aria-label="Artist options"
            >
                <MoreHorizontal size={18} />
            </Button>
        </Card>
    )
}
