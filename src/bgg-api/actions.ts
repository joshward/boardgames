import { XMLParser } from "fast-xml-parser";

interface SearchResult {
  id: number;
  name: string;
  yearPublished?: number;
  nameType: string;
  type: string;
}

interface SearchResults {
  items: SearchResult[];
}

type OneOrMany<T> = T | T[];

interface RawParsedSearchGameResult {
  "@_id": number;
  "@_type": string;
  name: {
    "@_type": string;
    "@_value": string;
  };
  yearpublished?: {
    "@_value": number;
  };
}

interface RawParsedSearchResults {
  items?: {
    item?: OneOrMany<RawParsedSearchGameResult>;
  };
}

function asArray<T>(value: OneOrMany<T> | undefined): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function mapSearchResult(item: RawParsedSearchGameResult): SearchResult {
  return {
    id: item["@_id"],
    name: item.name["@_value"],
    nameType: item.name["@_type"],
    type: item["@_type"],
    yearPublished: item.yearpublished?.["@_value"],
  };
}

type WithRaw<T> = T & { rawXml: string; rawJson: unknown };

export async function search(term: string): Promise<WithRaw<SearchResults>> {
  const result = await fetch(
    `https://www.boardgamegeek.com/xmlapi2/search?type=boardgame&query=${encodeURIComponent(term)}`,
  );

  if (!result.ok) {
    throw new Error(`Failed to fetch search results: ${result.statusText}`);
  }

  const rawXml = await result.text();

  const parser = new XMLParser({
    allowBooleanAttributes: true,
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    ignoreDeclaration: true,
    ignorePiTags: true,
    processEntities: false,
    parseAttributeValue: true,
    parseTagValue: true,
  });
  const rawJson = parser.parse(rawXml) as RawParsedSearchResults;

  const items: SearchResult[] = asArray(rawJson.items?.item)
    .map(mapSearchResult)
    .filter((item) => item.type === "boardgame");

  return {
    rawXml,
    rawJson,
    items,
  };
}
