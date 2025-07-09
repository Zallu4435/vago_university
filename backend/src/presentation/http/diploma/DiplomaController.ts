import {
  IGetDiplomasUseCase,
  IGetDiplomaByIdUseCase,
  ICreateDiplomaUseCase,
  IUpdateDiplomaUseCase,
  IDeleteDiplomaUseCase,
  IEnrollStudentUseCase,
} from "../../../application/diploma/useCases/DiplomaUseCases";
import { IDiplomaController, IHttpRequest, IHttpResponse, HttpSuccess, HttpErrors } from "../IHttp";
import { EnrollStudentRequestDTO } from "../../../domain/diploma/dtos/DiplomaRequestDTOs";

export class DiplomaController implements IDiplomaController {
  private httpSuccess: HttpSuccess;
  private httpErrors: HttpErrors;

  constructor(
    private readonly getDiplomasUseCase: IGetDiplomasUseCase,
    private readonly getDiplomaByIdUseCase: IGetDiplomaByIdUseCase,
    private readonly createDiplomaUseCase: ICreateDiplomaUseCase,
    private readonly updateDiplomaUseCase: IUpdateDiplomaUseCase,
    private readonly deleteDiplomaUseCase: IDeleteDiplomaUseCase,
    private readonly enrollStudentUseCase: IEnrollStudentUseCase
  ) {
    this.httpSuccess = new HttpSuccess();
    this.httpErrors = new HttpErrors();
  }

  async getDiplomas(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page = "1", limit = "10", department = "all", status = "all", instructor = "all", dateRange = "all" } = httpRequest.query;

    if (
      isNaN(Number(page)) ||
      isNaN(Number(limit)) ||
      Number(page) < 1 ||
      Number(limit) < 1
    ) {
      return this.httpErrors.error_400();
    }

    const result = await this.getDiplomasUseCase.execute({
      page: Number(page),
      limit: Number(limit),
      department: String(department),
      status: String(status),
      instructor: String(instructor),
      dateRange: String(dateRange),
    });

    if (!result.success) {
      return this.httpErrors.error_400();
    }

    return this.httpSuccess.success_200(result.data);
  }

  async getDiplomaById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this.httpErrors.error_400();
    }

    const result = await this.getDiplomaByIdUseCase.execute({ id });
    if (!result.success) {
      return this.httpErrors.error_404();
    }

    return this.httpSuccess.success_200(result.data);
  }

  async createDiploma(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const result = await this.createDiplomaUseCase.execute(httpRequest.body);
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_201(result.data);
  }

  async updateDiploma(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    if (!id) {
      return this.httpErrors.error_400();
    }

    const result = await this.updateDiplomaUseCase.execute({
      id,
      ...httpRequest.body,
    });

    if (!result.success) {
      return this.httpErrors.error_404();
    }

    return this.httpSuccess.success_200(result.data);
  }

  async deleteDiploma(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    if (!id) {
      return this.httpErrors.error_400();
    }

    const result = await this.deleteDiplomaUseCase.execute({ id });
    if (!result.success) {
      return this.httpErrors.error_400();
    }

    return this.httpSuccess.success_200(result.data);
  }

  async enrollStudent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { diplomaId } = httpRequest.params;
    const studentId = httpRequest.user?.id;
    if (!diplomaId || !studentId) {
      return this.httpErrors.error_400("Diploma ID and Student ID are required");
    }
    const result = await this.enrollStudentUseCase.execute({ diplomaId, studentId } as EnrollStudentRequestDTO);
    if (!result.success) {
      return this.httpErrors.error_400("Failed to enroll student");
    }
    return this.httpSuccess.success_200(result.data);
  }
} 