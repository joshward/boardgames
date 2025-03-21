import { type NextRequest, NextResponse } from "next/server";
import { search } from "@/bgg-api/actions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const term = searchParams.get("term");
  if (!term) {
    return NextResponse.json({ error: "Missing search term" }, { status: 400 });
  }

  const { items } = await search(term);

  return Response.json({ items });
}
