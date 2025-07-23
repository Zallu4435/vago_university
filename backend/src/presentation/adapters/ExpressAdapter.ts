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
    req.user,
    req.file,
    files,
    req.cookies,
    req.ip // Add IP address as the last argument
  );

  try {
    const response = await handler(httpRequest);

    // Set cookies if present
    if (response.cookies) {
      for (const cookie of response.cookies) {
        res.cookie(cookie.name, cookie.value, cookie.options);
      }
    }

    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error); // Let errors propagate to the global error handler
  }
}