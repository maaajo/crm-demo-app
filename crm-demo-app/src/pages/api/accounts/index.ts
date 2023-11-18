import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { handler } from "@/lib/api/utils/custom-handler";
import { allowMethods } from "@/lib/api/middleware/allow-methods";
import { ensureHeaderHasAuth } from "@/lib/api/middleware/ensure-header-has-auth";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/types/supabase";

const accountsApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const supabaseClient = createServerSupabaseClient<Database>({ req, res });
  const { data, error } = await supabaseClient.from("account").select("id");

  console.log(data, error);

  return res.status(StatusCodes.OK).json({ data });
};

export default handler(
  allowMethods(["GET"]),
  ensureHeaderHasAuth(),
  accountsApiHandler
);
