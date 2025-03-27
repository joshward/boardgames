"use client";

import { useState } from "react";
import SearchInput from "@/app/add/SearchInput";
import { skipToken, useQuery } from "@tanstack/react-query";
import { SearchResults } from "@/bgg-api/models";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public retryable: boolean,
  ) {
    super(message);
  }
}

function fetcher<T>(url: string): () => Promise<T> {
  return async () => {
    const response = await fetch(url);

    if (response.ok) {
      return response.json();
    }

    let jsonResponse: unknown = null;
    try {
      jsonResponse = await response.json();
    } catch {}

    if (
      typeof jsonResponse === "object" &&
      jsonResponse &&
      "error" in jsonResponse &&
      typeof jsonResponse.error === "string"
    ) {
      const retryable =
        "retryable" in jsonResponse && Boolean(jsonResponse.retryable);
      throw new ApiError(jsonResponse.error, response.status, retryable);
    }

    throw new ApiError(response.statusText, response.status, true);
  };
}

function shouldRetry(_retryCount: number, error: Error) {
  return error instanceof ApiError ? error.retryable : true;
}

export default function GameSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const standardSearchTerm = searchTerm.trim();

  const searchQuery = useQuery({
    queryKey: ["bgg-games", standardSearchTerm],
    queryFn: standardSearchTerm
      ? fetcher<SearchResults>(`/api/bgg/search?term=${standardSearchTerm}`)
      : skipToken,
    retry: shouldRetry,
    staleTime: Infinity,
  });

  return (
    <div>
      <SearchInput
        onSearch={setSearchTerm}
        isSearching={searchQuery.isLoading}
      />
      {searchQuery.isLoading ? "Loading..." : null}
      {searchQuery.isError ? "Error" : null}
      {searchQuery.data ? (
        <pre>{JSON.stringify(searchQuery.data, undefined, " ")}</pre>
      ) : null}
    </div>
  );
}
