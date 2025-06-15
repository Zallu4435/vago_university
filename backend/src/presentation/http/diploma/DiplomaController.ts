import {
  IGetDiplomasUseCase,
  IGetDiplomaByIdUseCase,
  ICreateDiplomaUseCase,
  IUpdateDiplomaUseCase,
  IDeleteDiplomaUseCase,
} from "../../../application/diploma/useCases/DiplomaUseCases";
import { IDiplomaController, IHttpRequest, IHttpResponse, HttpSuccess, HttpErrors } from "../IHttp";

export class DiplomaController implements IDiplomaController {
  private httpSuccess: HttpSuccess;
  private httpErrors: HttpErrors;

  constructor(
    private readonly getDiplomasUseCase: IGetDiplomasUseCase,
    private readonly getDiplomaByIdUseCase: IGetDiplomaByIdUseCase,
    private readonly createDiplomaUseCase: ICreateDiplomaUseCase,
    private readonly updateDiplomaUseCase: IUpdateDiplomaUseCase,
    private readonly deleteDiplomaUseCase: IDeleteDiplomaUseCase
  ) {
    this.httpSuccess = new HttpSuccess();
    this.httpErrors = new HttpErrors();
  }

  async getDiplomas(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
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
    } catch (err) {
      console.error(`Error in getDiplomas:`, err);
      return this.httpErrors.error_400();
    }
  }

  async getDiplomaById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return this.httpErrors.error_400();
      }

      const result = await this.getDiplomaByIdUseCase.execute({ id });
      if (!result.success) {
        return this.httpErrors.error_404();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`Error in getDiplomaById:`, err);
      return this.httpErrors.error_500();
    }
  }

  async createDiploma(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const result = await this.createDiplomaUseCase.execute(httpRequest.body);
      if (!result.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_201(result.data);
    } catch (err) {
      console.error(`Error in createDiploma:`, err);
      return this.httpErrors.error_400();
    }
  }

  async updateDiploma(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
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
    } catch (err) {
      console.error(`Error in updateDiploma:`, err);
      return this.httpErrors.error_400();
    }
  }

  async deleteDiploma(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      if (!id) {
        return this.httpErrors.error_400();
      }

      const result = await this.deleteDiplomaUseCase.execute({ id });
      if (!result.success) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`Error in deleteDiploma:`, err);
      return this.httpErrors.error_400();
    }
  }
} 