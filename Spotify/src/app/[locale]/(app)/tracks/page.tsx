'use client'
import { useTracks } from "../../../../hooks/useTracks";
import { TracksUI } from "../../../../components/features/tracks/TrackUI";

export default function TracksPage() {
  const {
    tracks,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleSearch
  } = useTracks();

  return (
    <TracksUI
      tracks={tracks}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      handleSearch={handleSearch}
      isLoading={isLoading}
      error={error}
    />
  );
}