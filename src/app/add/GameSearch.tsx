"use client";

import { useState } from "react";
import SearchInput from "@/app/add/SearchInput";
import { useQuery } from "@tanstack/react-query";

export default function GameSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  const query = useQuery({
    queryKey: ["bgg-games", searchTerm],
    queryFn: () =>
      fetch(`/api/bgg/search?term=${encodeURIComponent(searchTerm)}`).then(
        (res) => res.json(),
      ),
    retry: true,
    enabled: Boolean(searchTerm),
    staleTime: Infinity,
  });

  return (
    <div>
      <SearchInput onSearch={setSearchTerm} />
      {query.isLoading ? "Loading..." : null}
      {query.isError ? "Error" : null}
      {query.data ? (
        <pre>{JSON.stringify(query.data, undefined, " ")}</pre>
      ) : null}
    </div>
  );
}
