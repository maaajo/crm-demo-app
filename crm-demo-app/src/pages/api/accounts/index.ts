import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { handler } from "@/lib/api/utils/custom-handler";
import { allowMethods } from "@/lib/api/middleware/allow-methods";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/types/supabase";
import axios from "redaxios";
import { TAccountSupabase } from "@/lib/types/account";
import getBearerTokenFromHeader from "@/lib/api/utils";
import { TypedApiResponse } from "@/lib/api/types";

const accountsApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<TypedApiResponse>
) => {
  let accounts: TAccountSupabase[] | null = null;
  let isError = false;
  let errorMessage = "";

  if (req.cookies["supabase-auth-token"]) {
    const supabaseClient = createServerSupabaseClient<Database>({ req, res });
    const { data: supabaseAccounts, error } = await supabaseClient
      .from("account")
      .select("*");

    if (error) {
      isError = true;
      errorMessage = error.message;
    } else {
      accounts = supabaseAccounts;
    }
  } else {
    try {
      const bearerToken = getBearerTokenFromHeader(req.headers.authorization);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/account`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
        }
      );

      const supabaseAccounts = response.data as TAccountSupabase[] | null;
      accounts = supabaseAccounts;
    } catch (error: any) {
      isError = true;
      errorMessage = error;
    }
  }

  if (!isError) {
    return res.status(StatusCodes.OK).json({
      result: "SUCCESS",
      data: accounts ? accounts : [],
      statusCode: StatusCodes.OK,
    });
  }
};

export default handler(allowMethods(["GET"]), accountsApiHandler);
