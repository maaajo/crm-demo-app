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
import { prepareFileDownloadResponse } from "@/lib/api/utils";

const invalidOutputMessage = "Invalid output type";

export const OUTPUT_TYPES = {
  JSON: "json",
  CSV: "csv",
  XLSX: "xlsx",
} as const;

const querySchema = z.object({
  outputType: z.nativeEnum(OUTPUT_TYPES, {
    errorMap: () => ({ message: invalidOutputMessage }),
  }),
  size: z
    .string()
    .transform(Number)
    .refine((value) => !isNaN(value) && value > 0, {
      message: "Size must be a positive number",
    }),
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

    switch (outputType) {
      case OUTPUT_TYPES.JSON:
        return res.status(StatusCodes.OK).json({
          result: "SUCCESS",
          statusCode: StatusCodes.OK,
          data: fakeAccounts,
        });
      case OUTPUT_TYPES.CSV:
        const fakeAccountsCSVAsString = json2csv(fakeAccounts);
        prepareFileDownloadResponse({
          res,
          contentType: "application/csv",
          filename: "fake-accounts.csv",
        });

        await pipeline(Readable.from(fakeAccountsCSVAsString), res);
        break;
      case OUTPUT_TYPES.XLSX:
        const name = "fake-accounts";
        const workbook = utils.book_new();
        const worksheet = utils.json_to_sheet(fakeAccounts);
        utils.book_append_sheet(workbook, worksheet, name);
        const binaryWorkbookString = write(workbook, { type: "binary" });
        prepareFileDownloadResponse({
          res,
          contentType: "application/vnd.ms-excel",
          filename: `${name}.xlsx`,
        });

        return res.send(Buffer.from(binaryWorkbookString, "binary"));
      default:
        return res.status(StatusCodes.BAD_REQUEST).json({
          result: "ERROR",
          statusCode: StatusCodes.BAD_REQUEST,
          errorMessage: invalidOutputMessage,
        });
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
