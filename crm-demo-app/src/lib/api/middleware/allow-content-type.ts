import { ApiMiddleware, NextFunction } from "../utils/custom-handler";
import { TypedApiResponse } from "../types";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";

export const allowContentType =
  (allowedContentTypes: string[]): ApiMiddleware =>
  async (
    req: NextApiRequest,
    res: NextApiResponse<TypedApiResponse>,
    next: NextFunction
  ) => {
    const requestContentType = req.headers["content-type"]?.toLowerCase();
    const errorResponse: TypedApiResponse = {
      result: "ERROR",
      statusCode: StatusCodes.UNSUPPORTED_MEDIA_TYPE,
      errorMessage: `Unsupported Content-Type. Used: ${requestContentType}. Supported: ${allowedContentTypes.join(
        ","
      )}`,
    };

    if (!requestContentType) {
      return res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).json(errorResponse);
    }

    if (!allowedContentTypes.includes(requestContentType)) {
      return res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).json(errorResponse);
    }

    return next();
  };
