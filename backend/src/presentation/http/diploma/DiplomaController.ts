import {
  IGetDiplomasUseCase,
  IGetDiplomaByIdUseCase,
  ICreateDiplomaUseCase,
  IUpdateDiplomaUseCase,
  IDeleteDiplomaUseCase,
  IEnrollStudentUseCase,
} from "../../../application/diploma/useCases/IDiplomaUseCases";
import { IDiplomaController, IHttpRequest, IHttpResponse, HttpSuccess, HttpErrors } from "../IHttp";
import { EnrollStudentRequestDTO } from "../../../domain/diploma/dtos/DiplomaRequestDTOs";

export class DiplomaController implements IDiplomaController {
  private _httpSuccess: HttpSuccess;
  private _httpErrors: HttpErrors;

  constructor(
    private readonly _getDiplomasUseCase: IGetDiplomasUseCase,
    private readonly _getDiplomaByIdUseCase: IGetDiplomaByIdUseCase,
    private readonly _createDiplomaUseCase: ICreateDiplomaUseCase,
    private readonly _updateDiplomaUseCase: IUpdateDiplomaUseCase,
    private readonly _deleteDiplomaUseCase: IDeleteDiplomaUseCase,
    private readonly _enrollStudentUseCase: IEnrollStudentUseCase
  ) {
    this._httpSuccess = new HttpSuccess();
    this._httpErrors = new HttpErrors();
  }

  async getDiplomas(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const {
      page = "1",
      limit = "10",
      department = "all",
      category = "all",
      status = "all",
      instructor = "all",
      dateRange = "all",
      startDate,
      endDate,
      search
    } = httpRequest.query;

    if (
      isNaN(Number(page)) ||
      isNaN(Number(limit)) ||
      Number(page) < 1 ||
      Number(limit) < 1
    ) {
      return this._httpErrors.error_400();
    }

    const result = await this._getDiplomasUseCase.execute({
      page: Number(page),
      limit: Number(limit),
      department: String(department),
      category: String(category),
      status: String(status),
      instructor: String(instructor),
      dateRange: String(dateRange),
      startDate: startDate ? String(startDate) : undefined,
      endDate: endDate ? String(endDate) : undefined,
      search: search ? String(search) : undefined,
    });

    if (!result.success) {
      return this._httpErrors.error_400();
    }

    return this._httpSuccess.success_200(result.data);
  }

  async getDiplomaById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this._httpErrors.error_400();
    }

    const result = await this._getDiplomaByIdUseCase.execute({ id });
    if (!result.success) {
      return this._httpErrors.error_404();
    }

    return this._httpSuccess.success_200(result.data);
  }

  async createDiploma(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const result = await this._createDiplomaUseCase.execute(httpRequest.body);
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_201(result.data);
  }

  async updateDiploma(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    if (!id) {
      return this._httpErrors.error_400();
    }

    const result = await this._updateDiplomaUseCase.execute({
      id,
      ...httpRequest.body,
    });

    if (!result.success) {
      return this._httpErrors.error_404();
    }

    return this._httpSuccess.success_200(result.data);
  }

  async deleteDiploma(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    if (!id) {
      return this._httpErrors.error_400();
    }

    const result = await this._deleteDiplomaUseCase.execute({ id });
    if (!result.success) {
      return this._httpErrors.error_400();
    }

    return this._httpSuccess.success_200(result.data);
  }

  async enrollStudent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { diplomaId } = httpRequest.params;
    const studentId = httpRequest.user?.id;
    if (!diplomaId || !studentId) {
      return this._httpErrors.error_400("Diploma ID and Student ID are required");
    }
    const result = await this._enrollStudentUseCase.execute({ diplomaId, studentId } as EnrollStudentRequestDTO);
    if (!result.success) {
      return this._httpErrors.error_400("Failed to enroll student");
    }
    return this._httpSuccess.success_200(result.data);
  }
} 