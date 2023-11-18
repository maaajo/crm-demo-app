import { NextApiRequest, NextApiResponse } from "next";
import { ApiMiddleware, NextFunction } from "../utils/custom-handler";
import getBearerTokenFromHeader from "../utils";
import { TypedApiResponse } from "../types";
import { StatusCodes } from "http-status-codes";

export const ensureHeaderHasAuth =
  (): ApiMiddleware =>
  async (
    req: NextApiRequest,
    res: NextApiResponse<TypedApiResponse>,
    next: NextFunction
  ) => {
    const supabaseCookie = req.cookies["supabase-auth-token"];

    if (supabaseCookie) {
      return next();
    }

    const failedResponse: TypedApiResponse = {
      result: "ERROR",
      statusCode: StatusCodes.BAD_REQUEST,
      errorMessage: "Missing authentication",
    };

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(StatusCodes.BAD_REQUEST).json(failedResponse);
    }

    const bearerToken = getBearerTokenFromHeader(authHeader);

    if (!bearerToken) {
      return res.status(StatusCodes.BAD_REQUEST).json(failedResponse);
    }

    // this should be changed to cookie supabase-auth-token

    req.headers["apikey"] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    req.headers["authorization"] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return next();
  };
