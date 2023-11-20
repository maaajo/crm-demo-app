import { allowMethods } from "@/lib/api/middleware/allow-methods";
import { validateSchema } from "@/lib/api/middleware/validate-schema";
import { handler } from "@/lib/api/utils/custom-handler";
import { getDefaultFromSchema } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";

export const OUTPUT_TYPES = {
  JSON: "json",
  CSV: "csv",
} as const;

const querySchema = z.object({
  outputType: z
    .nativeEnum(OUTPUT_TYPES, {
      errorMap: () => ({ message: "Invalid output type" }),
    })
    .default(OUTPUT_TYPES.JSON),
  size: z.coerce.number().default(10),
});

const fakeAccountsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const defaultQueryValues = getDefaultFromSchema(querySchema);
  console.log(req.query);

  return res.status(200).json({ status: "OK" });
};

export default handler(
  allowMethods(["GET"]),
  validateSchema(querySchema, "QUERY"),
  fakeAccountsHandler
);
