import { IHttpRequest, IHttpResponse, ICourseController, HttpSuccess, HttpErrors } from "../IHttp";
import { IGetCoursesUseCase, IGetCourseByIdUseCase, ICreateCourseUseCase, IUpdateCourseUseCase, IDeleteCourseUseCase } from "../../../application/courses/useCases/CourseUseCases";
import { GetCoursesRequestDTO, GetCourseByIdRequestDTO, CreateCourseRequestDTO, UpdateCourseRequestDTO, DeleteCourseRequestDTO } from "../../../domain/courses/dtos/CourseRequestDTOs";

export class CourseController implements ICourseController {
  private httpSuccess = new HttpSuccess();
  private httpErrors = new HttpErrors();

  constructor(
    private readonly getCoursesUseCase: IGetCoursesUseCase,
    private readonly getCourseByIdUseCase: IGetCourseByIdUseCase,
    private readonly createCourseUseCase: ICreateCourseUseCase,
    private readonly updateCourseUseCase: IUpdateCourseUseCase,
    private readonly deleteCourseUseCase: IDeleteCourseUseCase
  ) { }

  async getCourses(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page = 1, limit = 10, search, specialization, faculty, term } = httpRequest.query;
    const defaultLimit = search ? Number(limit) : 5;
    const params: GetCoursesRequestDTO = {
      page: Number(page),
      limit: defaultLimit,
      search: search as string,
      specialization: specialization as string,
      faculty: faculty as string,
      term: term as string,
    };
    const result = await this.getCoursesUseCase.execute(params);
    if (!result.success) {
      return this.httpErrors.error_400("Failed to get courses");
    }
    return this.httpSuccess.success_200(result.data);
  }

  async getCourseById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const params: GetCourseByIdRequestDTO = { id };
    const result = await this.getCourseByIdUseCase.execute(params);
    if (!result.success) {
      return this.httpErrors.error_400("Failed to get course");
    }
    if (!result.data) {
      return this.httpErrors.error_404("Course not found");
    }
    return this.httpSuccess.success_200(result.data);
  }

  async createCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { _id: _omitId, id: _omitStringId, ...body } = (httpRequest.body || {}) as Record<string, unknown>;
    const params: CreateCourseRequestDTO = body as CreateCourseRequestDTO;
    const result = await this.createCourseUseCase.execute(params);
    if (!result.success) {
      return this.httpErrors.error_400("Failed to create course");
    }
    return this.httpSuccess.success_201(result.data);
  }

  async updateCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    // Prevent client from overriding identifiers in the payload
    const { _id: _omitId, id: _omitStringId, ...body } = (httpRequest.body || {}) as Record<string, unknown>;
    const params: UpdateCourseRequestDTO = {
      id,
      ...(body as any),
    };
    const result = await this.updateCourseUseCase.execute(params);
    if (!result.success) {
      return this.httpErrors.error_400("Failed to update course");
    }
    if (!result.data) {
      return this.httpErrors.error_404("Course not found");
    }
    return this.httpSuccess.success_200(result.data);
  }

  async deleteCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const params: DeleteCourseRequestDTO = { id };
    const result = await this.deleteCourseUseCase.execute(params);
    if (!result.success) {
      return this.httpErrors.error_400("Failed to delete course");
    }
    return { statusCode: 204, body: { data: null } };
  }
} 