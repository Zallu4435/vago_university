import { Request, Response } from "express";
import { IHttpRequest, IHttpResponse, HttpRequest } from "../http/IHttp";

export async function expressAdapter(
  req: Request,
  res: Response,
  handler: (httpRequest: IHttpRequest) => Promise<IHttpResponse>
): Promise<void> {
  try {        
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
    
    const response: IHttpResponse = await handler(httpRequest);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    console.error('ExpressAdapter - Error:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}