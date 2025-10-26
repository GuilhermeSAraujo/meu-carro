export class HttpError extends Error {
  public readonly status: number;
  public readonly data: any;

  //   constructor(res: Response, data: Api.Error) {
  constructor(res: Response, data: any) {
    super(data.message ?? "Ops 😬\nAlgo inesperado ocorreu ao carregar seus dados.");
    this.status = res.status;
    this.data = data;
  }
}
