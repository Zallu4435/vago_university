import { Request, Response, NextFunction } from "express";
import { IHttpRequest, IHttpResponse, HttpRequest } from "../http/IHttp";

export async function expressAdapter(
  req: Request,
  res: Response,
  next: NextFunction,
  handler: (httpRequest: IHttpRequest) => Promise<IHttpResponse>
): Promise<void> {
  const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : undefined;

  const httpRequest: IHttpRequest = new HttpRequest(
    req.headers,
    req.body,
    req.query,
    req.params,
    req.user ? { ...req.user, id: req.user.userId } : undefined,
    req.file,
    files,
    req.cookies,
    req.ip
  );

  try {
    const response = await handler(httpRequest);

    if (response.cookies) {
      for (const cookie of response.cookies) {
        res.cookie(cookie.name, cookie.value, cookie.options);
      }
    }

    if (response.headers) {
      for (const [key, value] of Object.entries(response.headers)) {
        res.setHeader(key, value as string);
      }
    }

    if (response.body && response.body.data && Buffer.isBuffer(response.body.data)) {
      res.status(response.statusCode).send(response.body.data);
    } else {
      res.status(response.statusCode).json(response.body);
    }
  } catch (error) {
    next(error);
  }
}