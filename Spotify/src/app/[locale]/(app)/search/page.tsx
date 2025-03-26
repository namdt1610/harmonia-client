'use client'
import { useSearch } from './hooks/useSearch';
import { SearchUI } from './components/SearchUI';

export default function SearchPage() {
  const {
    searchResults,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleSearch,
  } = useSearch();

  return (
    <SearchUI
      searchResults={searchResults}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      handleSearch={handleSearch}
      isLoading={isLoading}
      error={error}
    />
  );
}