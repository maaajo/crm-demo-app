export const ApiResult = {
  success: "SUCCESS",
  error: "ERROR",
} as const;

export type TypedResponse =
  | { statusCode: number; result: "SUCCESS"; data: any }
  | { statusCode: number; result: "ERROR"; errorMessage: string };
