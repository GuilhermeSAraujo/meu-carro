export class HttpError extends Error {
  constructor(
    message: string,
    public status: number = 400
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function throwError(message: string, status: number = 400) {
  throw new HttpError(message, status);
}
