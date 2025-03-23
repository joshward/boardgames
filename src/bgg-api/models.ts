export enum NameType {
  Primary = "primary",
  Alternate = "alternate",
}

export enum ResultType {
  Boardgame = "boardgame",
  Expansion = "expansion",
}

export interface SearchResult {
  id: number;
  name: string;
  yearPublished?: number;
  nameType: NameType;
  type: ResultType;
}

export interface SearchResults {
  items: SearchResult[];
}
