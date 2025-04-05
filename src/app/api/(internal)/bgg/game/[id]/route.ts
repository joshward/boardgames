import type { NextRequest } from "next/server";
import * as v from "valibot";
import {
  makeErrorResponse,
  toErrorResponse,
} from "@/api/server/error-response";
import { ToStrNum } from "@/utils/validators";
import { getGame } from "@/bgg-api/actions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: unknown }> },
) {
  const { id } = await params;
  if (
    v.is(
      v.pipe(v.string(), ToStrNum, v.number(), v.integer(), v.minValue(1)),
      id,
    )
  ) {
    try {
      const item = await getGame(id as unknown as number);
      return Response.json(item);
    } catch (error) {
      return toErrorResponse(error);
    }
  }

  return makeErrorResponse({
    message: "Unexpected ID param - expecting positive integer",
    status: 400,
  });
}
