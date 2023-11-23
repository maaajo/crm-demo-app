import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";

export default function getBearerTokenFromHeader(
  authHeader: string | undefined
) {
  if (!authHeader) {
    return "";
  }

  const authHeaderCleaned = authHeader.trim();

  if (!authHeaderCleaned) {
    return "";
  }

  const authHeaderSplit = authHeaderCleaned.split(" ");

  if (authHeaderSplit.length !== 2) {
    return "";
  }

  if (authHeaderSplit[0].toLowerCase() !== "bearer") {
    return "";
  }

  return authHeaderSplit[1].trim();
}

type PrepareFileDownloadResponseParams = {
  res: NextApiResponse;
  contentType: string;
  filename: string;
};

export const prepareFileDownloadResponse = ({
  res,
  contentType,
  filename,
}: PrepareFileDownloadResponseParams) => {
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; file-name=${filename}`);
  res.status(StatusCodes.OK);
};
