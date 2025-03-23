import { XMLParser } from "fast-xml-parser";

export function parseBggApiResponse(response: string): unknown {
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

  return parser.parse(response);
}
