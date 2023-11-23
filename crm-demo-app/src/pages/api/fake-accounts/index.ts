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
import { utils, write } from "xlsx";

export const OUTPUT_TYPES = {
  JSON: "json",
  CSV: "csv",
  XLSX: "xlsx",
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
  res: NextApiResponse<TypedApiResponse | Buffer>
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

    if (outputType === OUTPUT_TYPES.XLSX) {
      const workbook = utils.book_new();
      const worksheet = utils.json_to_sheet(fakeAccounts);
      utils.book_append_sheet(workbook, worksheet, "fake-accounts");
      const binaryWorkbookString = write(workbook, { type: "binary" });

      res.setHeader("Content-Type", "application/vnd.ms-excel");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="fake-accounts.xlsx"'
      );
      res
        .status(StatusCodes.OK)
        .send(Buffer.from(binaryWorkbookString, "binary"));
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
