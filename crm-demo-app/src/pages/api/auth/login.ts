import { TypedApiResponse } from "@/lib/api/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { handler } from "@/lib/api/utils/custom-handler";
import { allowMethods } from "@/lib/api/middleware/allow-methods";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { StatusCodes } from "http-status-codes";
import { allowContentType } from "@/lib/api/middleware/allow-content-type";

const loginApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<TypedApiResponse<{ accessToken: string }>>
) => {
  const supabaseClient = createServerSupabaseClient({ req, res });
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: req.body.email,
    password: req.body.password,
  });

  if (data.session) {
    res.status(StatusCodes.OK).json({
      result: "SUCCESS",
      statusCode: StatusCodes.OK,
      data: [{ accessToken: data.session.access_token }],
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
  loginApiHandler
);
