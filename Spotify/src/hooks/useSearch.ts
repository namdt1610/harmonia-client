"use client";
import { useState } from "react";
import { useLazyGlobalSearchQuery } from "@/redux/services/searchApi";

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [globalSearch, { data: searchResults, isLoading }] =
    useLazyGlobalSearchQuery();

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setSearchQuery(query);
    setError(null);

    try {
      await globalSearch(query).unwrap();
    } catch (err) {
      setError("An error occurred while searching");
      console.error(err);
    }
  };

  return {
    searchResults,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleSearch,
  };
}
