import { TypedApiResponse } from "@/lib/api/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { handler } from "@/lib/api/utils/custom-handler";
import { allowMethods } from "@/lib/api/middleware/allow-methods";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { StatusCodes } from "http-status-codes";
import { allowContentType } from "@/lib/api/middleware/allow-content-type";
import * as z from "zod";
import {
  VALIDATE_TYPES,
  validateSchema,
} from "@/lib/api/middleware/validate-schema";

const loginBodySchema = z.object({
  email: z
    .string({ required_error: "Email field is missing" })
    .min(1, { message: "Email field has to be filled" })
    .email({ message: "This is not a valid email" }),
  password: z
    .string({ required_error: "Password field is missing" })
    .min(1, { message: "Password field has to be filled" }),
});

type LoginBody = z.infer<typeof loginBodySchema>;

const loginApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<TypedApiResponse<{ token: string }>>
) => {
  const supabaseClient = createServerSupabaseClient({ req, res });
  const requestBody = req.body as LoginBody;
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: requestBody.email,
    password: requestBody.password,
  });

  if (data.session) {
    res.status(StatusCodes.OK).json({
      result: "SUCCESS",
      statusCode: StatusCodes.OK,
      data: [{ token: data.session.access_token }],
    });
  }

  if (!data.session || error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      errorMessage: error ? error.message : "Failed to authorize",
      result: "ERROR",
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }
};

export default handler(
  allowMethods(["POST"]),
  allowContentType(["application/json"]),
  validateSchema(loginBodySchema, VALIDATE_TYPES.BODY),
  loginApiHandler
);
