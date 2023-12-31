import { NextApiRequest, NextApiResponse } from "next";
import { AnyZodObject, SafeParseReturnType, ZodError } from "zod";
import { ApiMiddleware, NextFunction } from "../utils/custom-handler";
import { StatusCodes } from "http-status-codes";
import { TypedApiResponse } from "../types";

const getZodError = (zodError: ZodError) => {
  const zodErrorMessage = zodError.issues
    .map((issue) => issue.message)
    .join(",");

  return `Failed to validate request body. Error(s): ${zodErrorMessage}`;
};

export const VALIDATE_TYPES = {
  BODY: "body",
  QUERY: "query",
} as const;

export const validateSchema =
  (
    schema: AnyZodObject,
    validateType: (typeof VALIDATE_TYPES)[keyof typeof VALIDATE_TYPES]
  ): ApiMiddleware =>
  async (
    req: NextApiRequest,
    res: NextApiResponse<TypedApiResponse>,
    next: NextFunction
  ) => {
    if (!schema) {
      throw new Error("Invalid schema");
    }

    let schemaParseResult: SafeParseReturnType<
      { [x: string]: any },
      { [x: string]: any }
    >;

    switch (validateType) {
      case VALIDATE_TYPES.BODY:
        schemaParseResult = await schema.safeParseAsync(req.body);
        break;
      case VALIDATE_TYPES.QUERY:
        schemaParseResult = await schema.safeParseAsync(req.query);
        break;
    }

    if (schemaParseResult.success) {
      return next();
    }

    return res.status(StatusCodes.BAD_REQUEST).json({
      result: "ERROR",
      statusCode: StatusCodes.BAD_REQUEST,
      errorMessage: getZodError(schemaParseResult.error),
    });
  };
