import { BaseIssue, BaseSchema, BaseSchemaAsync, FlatErrors } from "valibot";

export class ParseError<
  T extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | undefined,
> extends Error {
  public raw: string;
  public issues: string[];

  constructor(message: string, raw: unknown, issues: FlatErrors<T>) {
    super(message);

    this.raw = JSON.stringify(raw);
    this.issues = [
      ...(issues.root?.map((issue) => `root issue: ${issue}`) ?? []),
      ...(issues.other?.map((issue) => `other issue: ${issue}`) ?? []),
      ...Object.entries(issues.nested ?? {}).flatMap(([key, values]) =>
        (values as string[]).map((value) => `${key} issue: ${value}`),
      ),
    ];
    this.name = "ParseError";
  }
}

export class RequestFailedError extends Error {
  constructor(
    message: string,
    public retryable: boolean,
  ) {
    super(message);
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
  }
}
