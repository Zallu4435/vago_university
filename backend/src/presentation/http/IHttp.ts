export interface IHttpRequest {
  headers?: any;
  body?: any;
  query?: any;
  params?: any;
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
  user?: {
    id: string;
    collection: 'register' | 'admin' | 'user' | 'faculty';
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface IHttpResponse {
  statusCode: number;
  body: {
    error?: string;
    data?: any;
    details?: any;
  };
}

export class HttpRequest implements IHttpRequest {
  constructor(
    public headers?: any,
    public body?: any,
    public query?: any,
    public params?: any,
    public user?: {
      id: string;
      collection: 'register' | 'admin' | 'user' | 'faculty';
      firstName: string;
      lastName: string;
      email: string;
    },
    public file?: Express.Multer.File,
    public files?: Express.Multer.File[]
  ) { }
}

export interface IHttpErrors {
  error_400(message?: string, details?: any): IHttpResponse;
  error_401(message?: string, details?: any): IHttpResponse;
  error_403(message?: string, details?: any): IHttpResponse;
  error_404(message?: string, details?: any): IHttpResponse;
  error_500(message?: string, details?: any): IHttpResponse;
}

export interface IHttpSuccess {
  success_200(data: any): IHttpResponse;
  success_201(data: any): IHttpResponse;
}

export class HttpErrors implements IHttpErrors {
  error_400(message = "Bad Request", details?: any): IHttpResponse {
    return { statusCode: 400, body: { error: message, details } };
  }
  error_401(message = "Unauthorized", details?: any): IHttpResponse {
    return { statusCode: 401, body: { error: message, details } };
  }
  error_403(message = "Forbidden", details?: any): IHttpResponse {
    return { statusCode: 403, body: { error: message, details } };
  }
  error_404(message = "Not Found", details?: any): IHttpResponse {
    return { statusCode: 404, body: { error: message, details } };
  }
  error_500(message = "Internal Server Error", details?: any): IHttpResponse {
    return { statusCode: 500, body: { error: message, details } };
  }
}

export class HttpSuccess implements IHttpSuccess {
  success_200(data: any): IHttpResponse {
    return { statusCode: 200, body: { data } };
  }
  success_201(data: any): IHttpResponse {
    return { statusCode: 201, body: { data } };
  }
}

export interface IController { }

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

export interface IDiplomaController extends IController {
  getDiplomas(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getDiplomaById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  createDiploma(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateDiploma(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteDiploma(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IVideoController extends IController {
  getVideos(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getVideoById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  createVideo(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateVideo(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteVideo(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IMaterialController extends IController {
  getMaterials(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getMaterialById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  createMaterial(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateMaterial(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteMaterial(httpRequest: IHttpResponse): Promise<IHttpResponse>;
}

export interface IUserMaterialController extends IController {
  getMaterials(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getMaterialById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  toggleBookmark(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  toggleLike(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  downloadMaterial(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getBookmarkedMaterials(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getLikedMaterials(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IAssignmentController extends IController {
  getAssignments(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAssignmentById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  createAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getSubmissions(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getSubmissionById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  reviewSubmission(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  downloadSubmission(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAnalytics(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IUserAssignmentController extends IController {
  getAssignments(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAssignmentById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  submitAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAssignmentStatus(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAssignmentFeedback(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  downloadAssignmentFile(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IUserDiplomaController extends IController {
  getUserDiplomas(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getUserDiplomaById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getUserDiplomaChapter(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateVideoProgress(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  markChapterComplete(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  toggleBookmark(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getCompletedChapters(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getBookmarkedChapters(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface ICampusLifeController extends IController {
  getCampusLifeOverview(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getEvents(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getEventById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getSports(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getSportById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getClubs(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getClubById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  joinClub(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  joinSport(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  joinEvent(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IAcademicController extends IController {
  getStudentInfo(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getGradeInfo(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getCourses(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAcademicHistory(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getProgramInfo(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getProgressInfo(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getRequirementsInfo(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  registerCourse(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  dropCourse(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  requestTranscript(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  scheduleMeeting(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface ICommunicationController extends IController {
  getInboxMessages(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getSentMessages(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  sendMessage(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  markMessageAsRead(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteMessage(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getMessageDetails(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAllAdmins(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getUserGroups(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  fetchUsers(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAdminInboxMessages(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAdminSentMessages(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  sendAdminMessage(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteAdminMessage(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IAdmissionController extends IController {
  createApplication(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getApplication(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  saveSection(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  processPayment(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  confirmPayment(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  handleFinalSubmit(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  uploadDocument(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  uploadMultipleDocuments(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  serveDocument(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IAuthController extends IController {
  register(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  login(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  refreshToken(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  logout(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  registerFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  sendEmailOtp(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  verifyEmailOtp(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  resetPassword(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  confirmRegistration(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IAdminAdmissionController extends IController {
  getAdmissions(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAdmissionById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAdmissionByToken(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  approveAdmission(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  rejectAdmission(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteAdmission(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  confirmAdmissionOffer(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  serveDocument(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IFacultyController extends IController {
  getFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getFacultyById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getFacultyByToken(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  approveFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  rejectFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  confirmFacultyOffer(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  downloadCertificate(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  serveDocument(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IProfileController extends IController {
  getProfile(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateProfile(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  changePassword(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateProfilePicture(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface INotificationController extends IController {
  createNotification(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAllNotifications(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getIndividualNotification(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteNotification(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IFinancialController extends IController {
  getStudentFinancialInfo(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAllPayments(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  makePayment(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getFinancialAidApplications(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAllFinancialAidApplications(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  applyForFinancialAid(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAvailableScholarships(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getScholarshipApplications(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAllScholarshipApplications(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  applyForScholarship(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  uploadDocument(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getPaymentReceipt(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateFinancialAidApplication(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateScholarshipApplication(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  createCharge(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAllCharges(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getOnePayment(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IEnquiryController extends IController {
  createEnquiry(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getEnquiries(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getEnquiryById(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateEnquiryStatus(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteEnquiry(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  sendReply(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface IVideoSessionController extends IController {
  createSession(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  joinSession(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getSession(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateSession(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  deleteSession(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getAllSessions(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateSessionStatus(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  getSessionAttendance(httpRequest: IHttpRequest): Promise<IHttpResponse>;
  updateAttendanceStatus(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}