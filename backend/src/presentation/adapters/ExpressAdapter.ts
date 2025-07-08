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
    files
  );

  handler(httpRequest)
    .then((response: IHttpResponse) => {
      res.status(response.statusCode).json(response.body);
    })
    .catch(next); // Let errors propagate to the global error handler
}