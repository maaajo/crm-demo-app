import { StatusCodes } from "http-status-codes";

export const ApiResult = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
} as const;

export type TypedApiResponse<T = any> =
  | { statusCode: StatusCodes; result: "SUCCESS"; data: T[] }
  | { statusCode: StatusCodes; result: "ERROR"; errorMessage: string };
