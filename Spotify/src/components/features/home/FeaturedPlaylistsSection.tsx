import React from 'react';
import Link from 'next/link';
import PlaylistCard from './PlaylistCard';

interface Playlist {
    id: number;
    title: string;
    cover: string;
    description: string;
}

interface FeaturedPlaylistsSectionProps {
    title: string;
    seeAllLabel: string;
    playlists: Playlist[];
}

export default function FeaturedPlaylistsSection({ 
    title, 
    seeAllLabel, 
    playlists 
}: FeaturedPlaylistsSectionProps) {
    return (
        <section className="mb-5 md:mb-8">
            <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{title}</h2>
                <Link
                    href="/playlists"
                    className="text-xs sm:text-sm text-neutral-400 hover:underline hidden sm:block"
                >
                    {seeAllLabel}
                </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {playlists.map(playlist => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
            </div>
        </section>
    );
}