import { allowMethods } from "@/lib/api/middleware/allow-methods";
import {
  VALIDATE_TYPES,
  validateSchema,
} from "@/lib/api/middleware/validate-schema";
import { TypedApiResponse } from "@/lib/api/types";
import { handler } from "@/lib/api/utils/custom-handler";
import { generateFakeAccounts } from "@/lib/utils";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";
import { json2csv } from "json-2-csv";
import { promisify } from "util";
import stream, { Readable } from "stream";

export const OUTPUT_TYPES = {
  JSON: "json",
  CSV: "csv",
} as const;

const querySchema = z.object({
  outputType: z.nativeEnum(OUTPUT_TYPES, {
    errorMap: () => ({ message: "Invalid output type" }),
  }),
  size: z.coerce.number().positive(),
});

type QueryProps = z.infer<typeof querySchema>;
const pipeline = promisify(stream.pipeline);

const fakeAccountsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<TypedApiResponse>
) => {
  try {
    const outputType = req.query.outputType as QueryProps["outputType"];
    const size = parseInt(req.query.size as string) as QueryProps["size"];
    const fakeAccounts = generateFakeAccounts(size);

    if (outputType === OUTPUT_TYPES.JSON) {
      return res.status(StatusCodes.OK).json({
        result: "SUCCESS",
        statusCode: StatusCodes.OK,
        data: fakeAccounts,
      });
    }

    if (outputType === OUTPUT_TYPES.CSV) {
      const fakeAccountsCSVAsString = json2csv(fakeAccounts);
      res.setHeader("Content-Type", "application/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=fake-accounts.csv"
      );

      res.status(StatusCodes.OK);

      await pipeline(Readable.from(Buffer.from(fakeAccountsCSVAsString)), res);
    }
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      result: "ERROR",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorMessage: error,
    });
  }
};

export default handler(
  allowMethods(["GET"]),
  validateSchema(querySchema, VALIDATE_TYPES.QUERY),
  fakeAccountsHandler
);
