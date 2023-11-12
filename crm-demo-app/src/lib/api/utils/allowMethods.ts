import { NextApiRequest, NextApiResponse } from "next";
import { ApiMiddleware, NextFunction } from "./customHandler";

type HTTPMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export const allowMethods =
  (allowedMethods: HTTPMethod[]): ApiMiddleware =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    if (allowedMethods.includes(req.method as HTTPMethod)) {
      return next();
    } else {
      res.status(405).send({
        error: `Endpoint doesn't support requests of type ${req.method}`,
      });
    }
  };
