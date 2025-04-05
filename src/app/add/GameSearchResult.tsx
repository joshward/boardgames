import { useQuery } from "@tanstack/react-query";
import { twJoin } from "tailwind-merge";
import { SearchResult, SearchResults } from "@/bgg-api/models";
import { fetcher, shouldRetry } from "@/api/client/fetcher";
import ErrorMessage from "@/components/ErrorMessage";

interface GameSearchResultProps {
  searchResult: SearchResult;
}

export function GameSearchResult({ searchResult }: GameSearchResultProps) {
  const getQuery = useQuery({
    queryKey: ["bgg-game", searchResult.id],
    queryFn: fetcher<SearchResults>(`/api/bgg/game/${searchResult.id}`),
    retry: shouldRetry,
    staleTime: Infinity,
  });

  return (
    <div
      className={twJoin(
        getQuery.isLoading && "animate-pulse",
        "bg-slate-3 text-slate-12 rounded p-4",
      )}
    >
      <div className="flex flex-row items-baseline gap-4">
        <h3 className="text-xl">{searchResult.name}</h3>
        {searchResult.yearPublished && (
          <div className="text-slate-11 text-sm">
            {searchResult.yearPublished}
          </div>
        )}
        {searchResult.nameType !== "primary" && (
          <div className="text-slate-11 bg-orange-3 rounded-full px-2 py-1 text-sm">
            {searchResult.nameType}
          </div>
        )}
      </div>

      {!getQuery.isError && getQuery.failureReason && (
        <ErrorMessage error={getQuery.failureReason} />
      )}
      {getQuery.error && <ErrorMessage error={getQuery.error} />}

      {getQuery.data && <pre>{JSON.stringify(getQuery.data, null, 2)}</pre>}
    </div>
  );
}
