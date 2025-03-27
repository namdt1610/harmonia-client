import { useState, useEffect, useRef } from 'react';
import { useLazyGetCurrentTrackQuery } from '@/redux/services/trackApi';
import { formatTime } from '../utils/formatTime';

interface Song {
      id: string;
      name: string;
      artist: string;
      audioUrl: string;
      albumArt: string;
}

export const usePlayer = () => {
      const [currentSong, setCurrentSong] = useState<Song | null>(null);
      const [isPlaying, setIsPlaying] = useState(false);
      const [currentTime, setCurrentTime] = useState(0);
      const [duration, setDuration] = useState(0);

      const audioRef = useRef<HTMLAudioElement | null>(null);

      // Lazy query to fetch the current track
      const [fetchCurrentTrack, { data, isLoading, isError }] =
            useLazyGetCurrentTrackQuery();

      useEffect(() => {
            // Fetch the current track when the component mounts
            const fetchTrack = async () => {
                  try {
                        const result = await fetchCurrentTrack({}).unwrap();
                        setCurrentSong(result);
                  } catch (error) {
                        console.error('Failed to fetch current track:', error);
                  }
            };

            fetchTrack();
      }, [fetchCurrentTrack]);

      const togglePlayPause = () => {
            if (!audioRef.current) return;

            if (isPlaying) {
                  audioRef.current.pause();
            } else {
                  audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
      };

      const handleTimeUpdate = () => {
            if (audioRef.current) {
                  setCurrentTime(audioRef.current.currentTime);
            }
      };

      const handleLoadedMetadata = () => {
            if (audioRef.current) {
                  setDuration(audioRef.current.duration);
            }
      };

      return {
            currentSong,
            isPlaying,
            currentTime,
            duration,
            togglePlayPause,
            formatTime,
            audioRef,
            handleTimeUpdate,
            handleLoadedMetadata,
            isLoading,
            isError,
      };
};