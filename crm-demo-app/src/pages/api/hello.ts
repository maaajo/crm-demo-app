// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TypedApiResponse } from "@/lib/api/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { handler } from "@/lib/api/utils/custom-handler";
import { allowMethods } from "@/lib/api/middleware/allow-methods";
import { StatusCodes } from "http-status-codes";

const helloApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse<TypedApiResponse<{ key: string }>>
) => {
  res.status(StatusCodes.OK).json({
    result: "SUCCESS",
    statusCode: StatusCodes.OK,
    data: [{ key: "hello" }],
  });
};

export default handler(allowMethods(["GET"]), helloApiHandler);
