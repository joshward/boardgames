import { NextResponse } from "next/server";
import {
  ParseError,
  RateLimitError,
  RequestFailedError,
} from "@/bgg-api/errors";

export function toErrorResponse(error: unknown): Response {
  if (error instanceof RateLimitError) {
    console.warn(error.message);
    return makeErrorResponse({
      message: "Request to BGG API was rate limited",
      retryable: true,
      status: 429,
    });
  }

  if (error instanceof RequestFailedError) {
    console.error(error.message, { retryable: error.retryable });
    return makeErrorResponse({
      message: "Request to BGG API failed",
      retryable: error.retryable,
      status: 500,
    });
  }

  if (error instanceof ParseError) {
    console.error(error.message, error.issues.join(" | "), error.raw);
    return makeErrorResponse({
      message: "Unexpected response from BGG API",
      status: 500,
    });
  }

  console.error("unexpected error:", error);
  return makeErrorResponse({
    message: "Unexpected error",
    retryable: true,
    status: 500,
  });
}

export function makeErrorResponse({
  message,
  retryable,
  status,
}: {
  message: string;
  retryable?: boolean;
  status: number;
}) {
  return NextResponse.json({ error: message, retryable }, { status });
}
