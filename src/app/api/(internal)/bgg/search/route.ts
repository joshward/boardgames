import { type NextRequest } from "next/server";
import { search } from "@/bgg-api/actions";
import {
  makeErrorResponse,
  toErrorResponse,
} from "@/api/server/error-response";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const term = searchParams.get("term");
  if (!term) {
    return makeErrorResponse({ message: "Missing search term", status: 400 });
  }

  try {
    const { items } = await search(term);
    return Response.json({ items });
  } catch (error) {
    return toErrorResponse(error);
  }
}
