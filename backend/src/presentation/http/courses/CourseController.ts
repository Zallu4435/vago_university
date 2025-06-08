import { IHttpRequest, IHttpResponse, ICourseController } from "../IHttp";
import { IGetCoursesUseCase, IGetCourseByIdUseCase, ICreateCourseUseCase, IUpdateCourseUseCase, IDeleteCourseUseCase } from "../../../application/courses/useCases/CourseUseCases";
import { GetCoursesRequestDTO, GetCourseByIdRequestDTO, CreateCourseRequestDTO, UpdateCourseRequestDTO, DeleteCourseRequestDTO } from "../../../domain/courses/dtos/CourseRequestDTOs";

export class CourseController implements ICourseController {
  constructor(
    private readonly getCoursesUseCase: IGetCoursesUseCase,
    private readonly getCourseByIdUseCase: IGetCourseByIdUseCase,
    private readonly createCourseUseCase: ICreateCourseUseCase,
    private readonly updateCourseUseCase: IUpdateCourseUseCase,
    private readonly deleteCourseUseCase: IDeleteCourseUseCase
  ) {}

  async getCourses(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { page = 1, limit = 10, search, department, status } = httpRequest.query;
      const params: GetCoursesRequestDTO = {
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        department: department as string,
        status: status as string,
      };

      const result = await this.getCoursesUseCase.execute(params);
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to get courses" } };
      }

      return { statusCode: 200, body: result.data };
    } catch (error) {
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }

  async getCourseById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log("[CourseController] getCourseById called with params:", httpRequest.params);
      const { id } = httpRequest.params;
      console.log("[CourseController] Course ID:", id);
      
      const params: GetCourseByIdRequestDTO = { id };
      console.log("[CourseController] Calling use case with params:", params);
      
      const result = await this.getCourseByIdUseCase.execute(params);
      console.log("[CourseController] Use case result:", result);
      
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to get course" } };
      }

      if (!result.data) {
        return { statusCode: 404, body: { message: "Course not found" } };
      }

      return { statusCode: 200, body: result.data };
    } catch (error) {
      console.error("[CourseController] Error in getCourseById:", error);
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }

  async createCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const params: CreateCourseRequestDTO = httpRequest.body;
      const result = await this.createCourseUseCase.execute(params);
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to create course" } };
      }

      return { statusCode: 201, body: result.data };
    } catch (error) {
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }

  async updateCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      const params: UpdateCourseRequestDTO = {
        id,
        ...httpRequest.body,
      };

      const result = await this.updateCourseUseCase.execute(params);
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to update course" } };
      }

      if (!result.data) {
        return { statusCode: 404, body: { message: "Course not found" } };
      }

      return { statusCode: 200, body: result.data };
    } catch (error) {
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }

  async deleteCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      const params: DeleteCourseRequestDTO = { id };

      const result = await this.deleteCourseUseCase.execute(params);
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to delete course" } };
      }

      return { statusCode: 204, body: null };
    } catch (error) {
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }
} 