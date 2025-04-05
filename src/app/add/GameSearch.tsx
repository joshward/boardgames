"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { distance } from "fastest-levenshtein";
import SearchInput from "@/app/add/SearchInput";
import { skipToken, useQuery } from "@tanstack/react-query";
import { SearchResult, SearchResults } from "@/bgg-api/models";
import { fetcher, shouldRetry } from "@/api/client/fetcher";
import ErrorMessage from "@/components/ErrorMessage";
import { GameSearchResult } from "@/app/add/GameSearchResult";
import GameSearchResultLoader from "@/app/add/GameSearchResultLoader";
import { range } from "@/utils/numbers";

function sortSearchResults(
  term: string,
  results: SearchResult[] | undefined,
): SearchResult[] {
  if (!results) {
    return [];
  }

  const normalizedTerm = term.toLowerCase();
  const sorted = results
    .map((result) => ({
      item: result,
      score: distance(normalizedTerm, result.name.toLowerCase()),
    }))
    .sort((a, b) => {
      const scoreDiff = a.score - b.score;
      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      if (a.item.nameType !== b.item.nameType) {
        return a.item.nameType === "primary" ? -1 : 1;
      }

      return (
        (b.item.yearPublished ?? Number.MAX_VALUE) -
        (a.item.yearPublished ?? Number.MAX_VALUE)
      );
    });

  return sorted.map(({ item }) => item);
}

export default function GameSearch() {
  const pathName = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const searchTermParam = params.get("term");

  const [searchTerm, setSearchTerm] = useState(searchTermParam ?? "");
  const standardSearchTerm = searchTerm.trim();

  useEffect(() => {
    if (searchTermParam !== standardSearchTerm) {
      if (!standardSearchTerm) {
        router.replace(pathName);
        return;
      }

      router.replace(
        `${pathName}?term=${encodeURIComponent(standardSearchTerm)}`,
      );
    }
  }, [pathName, standardSearchTerm, searchTermParam, router]);

  const searchQuery = useQuery({
    queryKey: ["bgg-games", standardSearchTerm],
    queryFn: standardSearchTerm
      ? fetcher<SearchResults>(
          `/api/bgg/search?term=${encodeURIComponent(standardSearchTerm)}`,
        )
      : skipToken,
    retry: shouldRetry,
    staleTime: Infinity,
  });

  const results = sortSearchResults(
    standardSearchTerm,
    searchQuery.data?.items,
  ).slice(0, 10);
  // TODO - incremental slicing

  return (
    <div className="flex flex-col gap-8">
      <SearchInput
        onSearch={setSearchTerm}
        isSearching={searchQuery.isFetching}
        initialTerm={searchTerm}
      />

      {!searchQuery.isError && searchQuery.failureReason && (
        <ErrorMessage error={searchQuery.failureReason} />
      )}
      {searchQuery.error && <ErrorMessage error={searchQuery.error} />}
      {searchQuery.isLoading &&
        range(0, 4).map((i) => <GameSearchResultLoader key={i} />)}
      {results.map((item) => (
        <GameSearchResult searchResult={item} key={item.id} />
      ))}
    </div>
  );
}
