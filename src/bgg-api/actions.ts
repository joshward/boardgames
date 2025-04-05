import * as v from "valibot";
import { ToStrNum, UnescapeHtml } from "@/utils/validators";
import { callBggApi } from "./call";
import { parseBggApiResponse } from "./parser";
import { asArray } from "./utilities";
import {
  NameType,
  ThingType,
  SearchResult,
  SearchResults,
  Boardgame,
} from "./models";
import { ParseError } from "./errors";

const AsNumber = v.pipe(v.string(), ToStrNum, v.number());
const AsInt = v.pipe(AsNumber, v.integer());

const SearchResultScheme = v.object({
  "@_id": v.pipe(AsInt, v.minValue(1)),
  "@_type": v.enum(ThingType),
  name: v.object({
    "@_type": v.enum(NameType),
    "@_value": v.pipe(v.string(), UnescapeHtml),
  }),
  yearpublished: v.optional(
    v.object({
      "@_value": AsInt,
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
    .filter((item) => item.type === ThingType.Boardgame);

  return {
    items,
  };
}

const SingleItemResultsScheme = v.object({
  items: v.optional(
    v.object({
      item: v.optional(v.looseObject({})),
    }),
  ),
});

const LinkScheme = v.object({
  "@_type": v.string(),
  "@_value": v.string(),
});

const PrimaryNameScheme = v.object({
  "@_type": v.literal("primary"),
  "@_value": v.string(),
});

const NameScheme = v.object({
  "@_type": v.union([v.literal("primary"), v.literal("alternate")]),
  "@_value": v.string(),
});

const GameResultScheme = v.object({
  "@_id": v.pipe(AsInt, v.minValue(1)),
  "@_type": v.enum(ThingType),
  link: v.union([LinkScheme, v.array(LinkScheme)]),
  name: v.union([
    PrimaryNameScheme,
    v.pipe(
      v.array(NameScheme),
      v.someItem(
        (item) => item["@_type"] === "primary",
        "Expecting primary name",
      ),
    ),
  ]),
  thumbnail: v.optional(v.pipe(v.string(), v.url())),
  image: v.optional(v.pipe(v.string(), v.url())),
  description: v.string(),
  yearpublished: v.object({
    "@_value": AsInt,
  }),
  minplayers: v.object({
    "@_value": v.pipe(AsInt, v.minValue(0)),
  }),
  maxplayers: v.object({
    "@_value": v.pipe(AsInt, v.minValue(0)),
  }),
  playingtime: v.object({
    "@_value": v.pipe(AsInt, v.minValue(0)),
  }),
  minplaytime: v.object({
    "@_value": v.pipe(AsInt, v.minValue(0)),
  }),
  maxplaytime: v.object({
    "@_value": v.pipe(AsInt, v.minValue(0)),
  }),
  statistics: v.optional(
    v.object({
      ratings: v.optional(
        v.object({
          usersrated: v.object({
            "@_value": AsInt,
          }),
          average: v.object({
            "@_value": AsNumber,
          }),
          averageweight: v.object({
            "@_value": AsNumber,
          }),
        }),
      ),
    }),
  ),
});

function mapGameResult(record: unknown, id: number): Boardgame {
  const parsed = v.safeParse(GameResultScheme, record);
  if (!parsed.success) {
    throw new ParseError(
      `Failed to parse game result item [${id}]`,
      record,
      v.flatten(parsed.issues),
    );
  }

  const names = asArray(parsed.output.name);
  const links = asArray(parsed.output.link);

  function getLinks(type: string): string[] {
    return links
      .filter((link) => link["@_type"] === type)
      .map((link) => link["@_value"]);
  }

  return {
    id: parsed.output["@_id"],
    type: parsed.output["@_type"],
    name: names.find((name) => name["@_type"] === "primary")?.["@_value"] ?? "", // this is validated to exist
    alternateNames: names
      .filter((name) => name["@_type"] === "alternate")
      .map((name) => name["@_value"]),
    description: parsed.output.description,
    imageUrl: parsed.output.image,
    thumbnailUrl: parsed.output.thumbnail,
    playTime: parsed.output.playingtime["@_value"],
    minPlayTime: parsed.output.minplaytime["@_value"],
    maxPlayTime: parsed.output.maxplaytime["@_value"],
    yearPublished: parsed.output.yearpublished["@_value"],
    maxPlayers: parsed.output.maxplayers["@_value"],
    minPlayers: parsed.output.minplayers["@_value"],
    rating: parsed.output.statistics?.ratings?.average["@_value"],
    weight: parsed.output.statistics?.ratings?.averageweight["@_value"],
    numRatings: parsed.output.statistics?.ratings?.usersrated["@_value"],
    artists: getLinks("boardgameartist"),
    categories: getLinks("boardgamecategory"),
    designers: getLinks("boardgamedesigner"),
    families: getLinks("boardgamefamily"),
    mechanics: getLinks("boardgamemechanic"),
    publishers: getLinks("boardgamepublisher"),
  };
}

export async function getGame(id: number): Promise<Boardgame> {
  const response = await callBggApi(
    `thing?id=${id}&type=${ThingType.Boardgame},${ThingType.Expansion}&stats=1&versions=1`,
  );

  const rawParsed = parseBggApiResponse(response);
  const parsed = v.safeParse(SingleItemResultsScheme, rawParsed);
  if (!parsed.success) {
    throw new ParseError(
      `Failed to parse game result root [${id}]`,
      rawParsed,
      v.flatten(parsed.issues),
    );
  }

  if (!parsed.output.items?.item) {
    throw new Error("Failed to parse game result root: no item found");
  }

  const result = mapGameResult(parsed.output.items?.item, id);

  return result;
}
