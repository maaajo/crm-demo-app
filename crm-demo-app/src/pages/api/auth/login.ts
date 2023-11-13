import { TypedApiResponse } from "@/lib/api/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { handler } from "@/lib/api/utils/custom-handler";
import { allowMethods } from "@/lib/api/utils/allow-methods";
import {
  Session,
  User,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { StatusCodes } from "http-status-codes";

const helloApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<
    TypedApiResponse<{ user: User | null; session: Session | null }>
  >
) => {
  const supabaseClient = createServerSupabaseClient({ req, res });
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: "test@test.com",
    password: "#Test123",
  });

  res.status(StatusCodes.OK).json({
    result: "SUCCESS",
    statusCode: StatusCodes.OK,
    data: [{ user: data.user, session: data.session }],
  });
};

export default handler(allowMethods(["GET"]), helloApiHandler);
