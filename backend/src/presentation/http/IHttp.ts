export interface IHttpRequest {
  headers?: any;
  body?: any;
  path?: any;
  query?: any;
}

export interface IHttpResponse {
  statusCode: number;
  body: any;
}

export class HttpRequest implements IHttpRequest {
  constructor(public headers?: any, public body?: any, public path?: any, public query?: any) {}
}

export interface IHttpErrors {
  error_400(): IHttpResponse;
  error_404(): IHttpResponse;
  error_500(): IHttpResponse;
}

export interface IHttpSuccess {
  success_200(data: any): IHttpResponse;
  success_201(data: any): IHttpResponse;
}

export class HttpErrors implements IHttpErrors {
  error_400(): IHttpResponse {
    return { statusCode: 400, body: { error: "Bad Request" } };
  }
  error_404(): IHttpResponse {
    return { statusCode: 404, body: { error: "Not Found" } };
  }
  error_500(): IHttpResponse {
    return { statusCode: 500, body: { error: "Internal Server Error" } };
  }
}

export class HttpSuccess implements IHttpSuccess {
  success_200(data: any): IHttpResponse {
    return { statusCode: 200, body: data };
  }
  success_201(data: any): IHttpResponse {
    return { statusCode: 201, body: data };
  }
}

export interface IController {
  getEvents(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getEventById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  createEvent(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateEvent(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteEvent(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IEventRequestController {
  getEventRequests(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  approveEventRequest(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  rejectEventRequest(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getEventRequestDetails(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}