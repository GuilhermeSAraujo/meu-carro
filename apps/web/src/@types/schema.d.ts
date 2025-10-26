// NOTE: File automatically generated, do not edit
type ApiSchema = import("hono").Hono<
  {},
  | {
      "/healthz": {
        $get: {
          input: {};
          output: {
            ok: true;
          };
          outputFormat: "json";
          status: import("hono/utils/http-status").ContentfulStatusCode;
        };
      };
    }
  | import("hono/types").MergeSchemaPath<
      {
        "/google": {
          $post:
            | {
                input: {
                  json: {
                    email: string;
                    name: string;
                    googleId: string;
                    profilePicture: string;
                  };
                };
                output: {
                  rows: never[];
                  command: string;
                  rowCount: number | null;
                  oid: number;
                  fields: {
                    name: string;
                    tableID: number;
                    columnID: number;
                    dataTypeID: number;
                    dataTypeSize: number;
                    dataTypeModifier: number;
                    format: string;
                  }[];
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              }
            | {
                input: {
                  json: {
                    email: string;
                    name: string;
                    googleId: string;
                    profilePicture: string;
                  };
                };
                output: {
                  name: string;
                  id: string;
                  email: string;
                  googleId: string;
                  image: string | null;
                  createdAt: string | null;
                  updatedAt: string | null;
                  deletedAt: string | null;
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
        };
      },
      "/auth"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/": {
          $post: {
            input: {
              json: {
                brand: string;
                model: string;
                year: unknown;
                kilometers: unknown;
                licensePlate?: string | undefined;
                tankVolume?: number | undefined;
                chassis?: string | undefined;
                renavam?: string | undefined;
              };
            };
            output: {
              brand: string;
              model: string;
              year: number;
              kilometers: number;
              licensePlate: string | null;
              tankVolume: number;
              chassis: string | null;
              renavam: string | null;
              id: string;
              createdAt: string | null;
              updatedAt: string | null;
              deletedAt: string | null;
              userId: string;
            };
            outputFormat: "json";
            status: 201;
          };
        };
      } & {
        "/": {
          $get: {
            input: {};
            output: {
              brand: string;
              model: string;
              year: number;
              kilometers: number;
              licensePlate: string | null;
              tankVolume: number;
              chassis: string | null;
              renavam: string | null;
              id: string;
              createdAt: string | null;
              updatedAt: string | null;
              deletedAt: string | null;
              userId: string;
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
          };
        };
      },
      "/cars"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/:carId": {
          $post: {
            input: {
              json: {
                date: string;
                km: number;
                volume: number;
                price: number;
                totalPrice: number;
                fuelType: string;
                isFullTank?: boolean | undefined;
              };
            } & {
              param: {
                carId: string;
              };
            };
            output: {};
            outputFormat: "json";
            status: 201;
          };
        };
      } & {
        "/:carId": {
          $get: {
            input: {
              query: {
                maxResult?: unknown;
              };
            } & {
              param: {
                carId: string;
              };
            };
            output: {
              createdAt: string | null;
              updatedAt: string | null;
              deletedAt: string | null;
              id: string;
              userId: string;
              carId: string;
              date: string;
              km: number;
              volume: number;
              price: number;
              totalPrice: number;
              fuelType: string;
              isFullTank: boolean;
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
          };
        };
      } & {
        "/:carId/:fuelId": {
          $get: {
            input: {
              param: {
                carId: string;
              } & {
                fuelId: string;
              };
            };
            output: {
              createdAt: string | null;
              updatedAt: string | null;
              deletedAt: string | null;
              id: string;
              userId: string;
              carId: string;
              date: string;
              km: number;
              volume: number;
              price: number;
              totalPrice: number;
              fuelType: string;
              isFullTank: boolean;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
          };
        };
      } & {
        "/:carId/:fuelId": {
          $put: {
            input: {
              json: {
                date: string;
                km: number;
                volume: number;
                price: number;
                totalPrice: number;
                fuelType: string;
                isFullTank?: boolean | undefined;
              };
            } & {
              param: {
                carId: string;
              } & {
                fuelId: string;
              };
            };
            output: {
              createdAt: string | null;
              updatedAt: string | null;
              deletedAt: string | null;
              id: string;
              userId: string;
              carId: string;
              date: string;
              km: number;
              volume: number;
              price: number;
              totalPrice: number;
              fuelType: string;
              isFullTank: boolean;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
          };
        };
      } & {
        "/:carId/:fuelId": {
          $delete: {
            input: {
              param: {
                carId: string;
              } & {
                fuelId: string;
              };
            };
            output: null;
            outputFormat: "body";
            status: 204;
          };
        };
      },
      "/fuel"
    >,
  "/"
>;

declare namespace Api {
  type Error = {
    error: string;
  };
}
