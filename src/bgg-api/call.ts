import { RateLimitError, RequestFailedError } from "@/bgg-api/errors";

export async function callBggApi(route: string): Promise<string> {
  let result: Response;

  try {
    result = await fetch(`https://www.boardgamegeek.com/xmlapi2/${route}`);
  } catch (error) {
    throw new RequestFailedError(`Failed to fetch ${route}: ${error}`, true);
  }

  if (!result.ok) {
    if (result.status === 429) {
      throw new RateLimitError(`Rate limit exceeded for ${route}`);
    }

    throw new RequestFailedError(
      `Failed to fetch ${route}: ${result.status} - ${result.statusText}`,
      result.status >= 500,
    );
  }

  try {
    return await result.text();
  } catch (error) {
    throw new RequestFailedError(
      `Failed to get body of ${route}: ${error}`,
      true,
    );
  }
}
