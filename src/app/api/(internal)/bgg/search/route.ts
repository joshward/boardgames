import { type NextRequest, NextResponse } from "next/server";
import { search } from "@/bgg-api/actions";
import {
  RateLimitError,
  RequestFailedError,
  ParseError,
} from "@/bgg-api/errors";

function errorResponse(error: unknown): Response {
  if (error instanceof RateLimitError) {
    console.warn(error.message);
    return NextResponse.json(
      { error: "Request to BGG API was rate limited", retryable: true },
      { status: 429 },
    );
  }

  if (error instanceof RequestFailedError) {
    console.error(error.message, { retryable: error.retryable });
    return NextResponse.json(
      { error: "Request to BGG API failed", retryable: error.retryable },
      { status: 500 },
    );
  }

  if (error instanceof ParseError) {
    console.error(error.message, error.issues.join(" | "), error.raw);
    return NextResponse.json(
      { error: "Unexpected response from BGG API" },
      { status: 500 },
    );
  }

  console.error("unexpected error:", error);
  return NextResponse.json(
    { error: "Unexpected error", retryable: true },
    { status: 500 },
  );
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const term = searchParams.get("term");
  if (!term) {
    return NextResponse.json({ error: "Missing search term" }, { status: 400 });
  }

  try {
    const { items } = await search(term);
    return Response.json({ items });
  } catch (error) {
    return errorResponse(error);
  }
}
