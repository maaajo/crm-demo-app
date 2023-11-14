import { NextApiRequest, NextApiResponse } from "next";
import { AnyZodObject, ZodError } from "zod";
import { ApiMiddleware, NextFunction } from "../utils/custom-handler";
import { StatusCodes } from "http-status-codes";
import { TypedApiResponse } from "../types";

const getZodError = (zodError: ZodError) => {
  const zodErrorMessage = zodError.issues
    .map((issue) => issue.message)
    .join(",");

  return `Failed to validate request body. Error(s): ${zodErrorMessage}`;
};

export const validateRequestBody =
  (schema: AnyZodObject): ApiMiddleware =>
  async (
    req: NextApiRequest,
    res: NextApiResponse<TypedApiResponse>,
    next: NextFunction
  ) => {
    if (!schema) {
      throw new Error("Invalid schema");
    }

    const schemaParseResult = await schema.safeParseAsync(req.body);

    if (schemaParseResult.success) {
      return next();
    }

    return res.status(StatusCodes.BAD_REQUEST).json({
      result: "ERROR",
      statusCode: StatusCodes.BAD_REQUEST,
      errorMessage: getZodError(schemaParseResult.error),
    });
  };
