import { NextApiRequest, NextApiResponse } from "next";
import { ApiMiddleware, NextFunction } from "../utils/custom-handler";
import { TypedApiResponse } from "../types";
import { ApiResult } from "../types";
import { StatusCodes } from "http-status-codes";

type HTTPMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export const allowMethods =
  (allowedMethods: HTTPMethod[]): ApiMiddleware =>
  async (
    req: NextApiRequest,
    res: NextApiResponse<TypedApiResponse>,
    next: NextFunction
  ) => {
    if (allowedMethods.includes(req.method as HTTPMethod)) {
      return next();
    } else {
      res.status(405).json({
        result: ApiResult.ERROR,
        statusCode: StatusCodes.METHOD_NOT_ALLOWED,
        errorMessage: `This endpoint doesn't support requests of method: ${req.method}`,
      });
    }
  };
