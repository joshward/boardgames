export enum NameType {
  Primary = "primary",
  Alternate = "alternate",
}

export enum ThingType {
  Boardgame = "boardgame",
  Expansion = "boardgameexpansion",
}

export interface SearchResult {
  id: number;
  name: string;
  yearPublished?: number;
  nameType: NameType;
  type: ThingType;
}

export interface SearchResults {
  items: SearchResult[];
}

export interface Boardgame {
  id: number;
  type: ThingType;
  name: string;
  alternateNames: string[];
  artists: string[];
  categories: string[];
  mechanics: string[];
  designers: string[];
  publishers: string[];
  families: string[];
  maxPlayers: number;
  minPlayers: number;
  playTime: number;
  minPlayTime: number;
  maxPlayTime: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  yearPublished: number;
  description: string;
  rating?: number;
  weight?: number;
  numRatings?: number;
}
