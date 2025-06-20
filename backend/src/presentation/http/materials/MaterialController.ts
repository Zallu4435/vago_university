import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IMaterialController } from '../IHttp';
import { GetMaterialsUseCase, GetMaterialByIdUseCase, CreateMaterialUseCase, UpdateMaterialUseCase, DeleteMaterialUseCase } from '../../../application/materials/useCases/MaterialUseCases';

export class MaterialController implements IMaterialController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getMaterialsUseCase: GetMaterialsUseCase,
    private getMaterialByIdUseCase: GetMaterialByIdUseCase,
    private createMaterialUseCase: CreateMaterialUseCase,
    private updateMaterialUseCase: UpdateMaterialUseCase,
    private deleteMaterialUseCase: DeleteMaterialUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getMaterials(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { query } = httpRequest;
      const result = await this.getMaterialsUseCase.execute(query);
      return this.httpSuccess.success_200(result);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getMaterialById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      if (!id) {
        return this.httpErrors.error_400();
      }
      const result = await this.getMaterialByIdUseCase.execute({ id });
      if (!result) {
        return this.httpErrors.error_404();
      }
      return this.httpSuccess.success_200(result);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async createMaterial(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.body || !httpRequest.file) {
        return this.httpErrors.error_400();
      }
      console.log('[MaterialController] Creating material with fileUrl:', httpRequest.file.path);
      const result = await this.createMaterialUseCase.execute({
        ...httpRequest.body,
        fileUrl: httpRequest.file.path
      });
      return this.httpSuccess.success_201(result);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async updateMaterial(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      if (!id || !httpRequest.body) {
        return this.httpErrors.error_400();
      }
      if (httpRequest.file?.path) {
        console.log('[MaterialController] Updating material with new fileUrl:', httpRequest.file.path);
      }
      const result = await this.updateMaterialUseCase.execute({
        id,
        data: {
          ...httpRequest.body,
          ...(httpRequest.file?.path ? { fileUrl: httpRequest.file.path } : {})
        }
      });
      if (!result) {
        return this.httpErrors.error_404();
      }
      return this.httpSuccess.success_200(result);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async deleteMaterial(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      if (!id) {
        return this.httpErrors.error_400();
      }
      await this.deleteMaterialUseCase.execute({ id });
      return this.httpSuccess.success_200({ message: 'Material deleted successfully' });
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }
} 