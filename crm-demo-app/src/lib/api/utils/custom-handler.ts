import { NextApiRequest, NextApiResponse } from "next";

export type NextFunction = () => void;

export type ApiMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextFunction
) => Promise<void> | void;

const executeApiMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  apiMiddleware: ApiMiddleware[],
  index = 0
) => {
  if (res.headersSent || !apiMiddleware[index]) {
    return;
  }

  if (typeof apiMiddleware[index] !== "function") {
    const responseMessage = "Middleware must be a function";
    res.status(500).end(responseMessage);
    throw new Error(responseMessage);
  }

  await apiMiddleware[index](req, res, async () => {
    await executeApiMiddleware(req, res, apiMiddleware, index + 1);
  });
};

export const handler =
  (...apiMiddleware: ApiMiddleware[]) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    await executeApiMiddleware(req, res, apiMiddleware);
  };
