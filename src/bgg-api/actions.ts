import * as v from "valibot";
import { callBggApi } from "./call";
import { parseBggApiResponse } from "./parser";
import { asArray } from "./utilities";
import { NameType, ResultType, SearchResult, SearchResults } from "./models";
import { ParseError } from "./errors";

const SearchResultScheme = v.object({
  "@_id": v.pipe(v.number(), v.integer(), v.minValue(1)),
  "@_type": v.enum(ResultType),
  name: v.object({
    "@_type": v.enum(NameType),
    "@_value": v.string(),
  }),
  yearpublished: v.optional(
    v.object({
      "@_value": v.number(),
    }),
  ),
});

const SearchResultsScheme = v.object({
  items: v.optional(
    v.object({
      item: v.optional(
        v.union([v.array(v.looseObject({})), v.looseObject({})]),
      ),
    }),
  ),
});

function mapSearchResult(item: unknown): SearchResult {
  const parsed = v.safeParse(SearchResultScheme, item);
  if (!parsed.success) {
    throw new ParseError(
      "Failed to parse search result item",
      item,
      v.flatten(parsed.issues),
    );
  }

  const data = parsed.output;

  return {
    id: data["@_id"],
    name: data.name?.["@_value"],
    nameType: data.name?.["@_type"],
    type: data["@_type"],
    yearPublished: data.yearpublished?.["@_value"],
  };
}

export async function search(term: string): Promise<SearchResults> {
  const response = await callBggApi(
    `search?type=boardgame&query=${encodeURIComponent(term)}`,
  );

  const rawParsed = parseBggApiResponse(response);
  const parsed = v.safeParse(SearchResultsScheme, rawParsed);
  if (!parsed.success) {
    throw new ParseError(
      "Failed to parse search results root",
      rawParsed,
      v.flatten(parsed.issues),
    );
  }

  const items: SearchResult[] = asArray(parsed.output.items?.item)
    .map(mapSearchResult)
    .filter((item) => item.type === ResultType.Boardgame);

  return {
    items,
  };
}
