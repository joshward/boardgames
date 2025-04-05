import { ApiError } from "@/api/client/error";

export function fetcher<T>(url: string): () => Promise<T> {
  return async () => {
    const response = await fetch(url);

    if (response.ok) {
      return response.json();
    }

    let jsonResponse: unknown = null;
    try {
      jsonResponse = await response.json();
    } catch {}

    if (
      typeof jsonResponse === "object" &&
      jsonResponse &&
      "error" in jsonResponse &&
      typeof jsonResponse.error === "string"
    ) {
      const retryable =
        "retryable" in jsonResponse && Boolean(jsonResponse.retryable);
      throw new ApiError(jsonResponse.error, response.status, retryable);
    }

    throw new ApiError(response.statusText, response.status, true);
  };
}

export function shouldRetry(_retryCount: number, error: Error) {
  return error instanceof ApiError ? error.retryable : true;
}
