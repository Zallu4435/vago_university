import { Request, Response } from "express";
import { IHttpRequest, IHttpResponse, HttpRequest } from "../http/IHttp";

export async function expressAdapter(
  req: Request,
  res: Response,
  handler: (httpRequest: IHttpRequest) => Promise<IHttpResponse>
): Promise<void> {
  try {    
    console.log('ExpressAdapter - Original request file:', req.file);
    
    // Convert req.files to Express.Multer.File[] if it exists
    const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : undefined;
    
    const httpRequest: IHttpRequest = new HttpRequest(
      req.headers,
      req.body,
      req.query,
      req.params,
      req.user,
      req.file, // single file
      files // array of files
    );
    
    console.log('ExpressAdapter - Created httpRequest:', {
      params: httpRequest.params,
      body: httpRequest.body,
      user: httpRequest.user,
      file: httpRequest.file
    });

    const response: IHttpResponse = await handler(httpRequest);
    console.log('ExpressAdapter - Handler response:', response);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    console.error('ExpressAdapter - Error:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}