export interface IHttpRequest {
  headers?: any;
  body?: any;
  query?: any;
  params?: any;
}

export interface IHttpResponse {
  statusCode: number;
  body: any;
}

export class HttpRequest implements IHttpRequest {
  constructor(public headers?: any, public body?: any, public query?: any, public params?: any) {}
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

export interface IController {}

export interface IEventController extends IController {
  getEvents(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getEventById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  createEvent(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateEvent(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteEvent(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IEventRequestController extends IController {
  getEventRequests(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  approveEventRequest(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  rejectEventRequest(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getEventRequestDetails(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IClubsController extends IController {
  getClubs(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getClubById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  createClub(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateClub(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteClub(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IClubRequestController extends IController {
  getClubRequests(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  approveClubRequest(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  rejectClubRequest(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getClubRequestDetails(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface ISportsController extends IController {
  getSports(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getSportById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  createSport(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateSport(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteSport(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface ISportRequestController extends IController {
  getSportRequests(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  approveSportRequest(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  rejectSportRequest(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getSportRequestDetails(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  joinSport(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface ICourseController extends IController {
  getCourses(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getCourseById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  createCourse(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateCourse(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteCourse(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface ICourseEnrollmentController extends IController {
  getEnrollments(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getEnrollmentDetails(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  approveEnrollment(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  rejectEnrollment(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}