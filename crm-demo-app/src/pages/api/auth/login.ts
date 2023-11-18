import { TypedApiResponse } from "@/lib/api/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { handler } from "@/lib/api/utils/custom-handler";
import { allowMethods } from "@/lib/api/middleware/allow-methods";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { StatusCodes } from "http-status-codes";
import { allowContentType } from "@/lib/api/middleware/allow-content-type";
import * as z from "zod";
import { validateRequestBody } from "@/lib/api/middleware/validate-request-body";
import * as cookie from "cookie";

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
  res: NextApiResponse<TypedApiResponse<{ authCookie: string }>>
) => {
  const supabaseClient = createServerSupabaseClient({ req, res });
  const requestBody = req.body as LoginBody;
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: requestBody.email,
    password: requestBody.password,
  });

  const setCookieHeader = res.getHeader("set-cookie") as string[];
  console.log(setCookieHeader[0]);

  // const supabaseAuthCookie = cookie.parse(res.getHeader("cookie") as string);
  console.log(cookie.parse(setCookieHeader[0]));

  if (data.session) {
    res.status(StatusCodes.OK).json({
      result: "SUCCESS",
      statusCode: StatusCodes.OK,
      data: [{ authCookie: "test" }],
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
  validateRequestBody(loginBodySchema),
  loginApiHandler
);
