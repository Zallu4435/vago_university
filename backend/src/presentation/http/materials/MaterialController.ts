import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IMaterialController } from '../IHttp';
import { IGetMaterialByIdUseCase, ICreateMaterialUseCase, IUpdateMaterialUseCase, IDeleteMaterialUseCase, IGetMaterialsUseCase } from '../../../application/materials/useCases/MaterialUseCases';
import { MaterialUpdateData, UploadedFile } from '../../../domain/materials/entities/MaterialTypes';

export class MaterialController implements IMaterialController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getMaterialsUseCase: IGetMaterialsUseCase,
    private getMaterialByIdUseCase: IGetMaterialByIdUseCase,
    private createMaterialUseCase: ICreateMaterialUseCase,
    private updateMaterialUseCase: IUpdateMaterialUseCase,
    private deleteMaterialUseCase: IDeleteMaterialUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getMaterials(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const { query } = httpRequest;
      
      const result = await this.getMaterialsUseCase.execute(query);
      return this.httpSuccess.success_200(result);
  }

  async getMaterialById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const { id } = httpRequest.params;
      if (!id) {
        return this.httpErrors.error_400();
      }
      const result = await this.getMaterialByIdUseCase.execute({ id });
      if (!result) {
        return this.httpErrors.error_404();
      }
      return this.httpSuccess.success_200(result);
  }

  async createMaterial(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body || !httpRequest.files) {
        return this.httpErrors.error_400();
      }
    
    let file: UploadedFile | undefined, thumbnail: UploadedFile | undefined;
    const files = httpRequest.files as UploadedFile[] | { [fieldname: string]: UploadedFile[] };
    if (Array.isArray(files)) {
      file = files.find((f) => f.fieldname === 'file');
      thumbnail = files.find((f) => f.fieldname === 'thumbnail');
    } else if (files) {
      file = files.file?.[0];
      thumbnail = files.thumbnail?.[0];
    }
    
    if (!file) {
      return this.httpErrors.error_400();
    }
    
    const materialData = {
      ...httpRequest.body,
      isNewMaterial: httpRequest.body.isNew === 'true',
      uploadedBy: httpRequest.body.uploadedBy || 'default-user',
      tags: typeof httpRequest.body.tags === 'string' ? [httpRequest.body.tags] : [httpRequest.body.tags],
      isRestricted: httpRequest.body.isRestricted === 'true',
      fileUrl: file.path,
      thumbnailUrl: thumbnail?.path || file.path
    };
        
    const result = await this.createMaterialUseCase.execute(materialData);
    return this.httpSuccess.success_201(result);
  }

  async updateMaterial(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    if (!id || !httpRequest.body) {
      return this.httpErrors.error_400();
    }
    
    let file: UploadedFile | undefined, thumbnail: UploadedFile | undefined;
    const files = httpRequest.files as UploadedFile[] | { [fieldname: string]: UploadedFile[] };
    
    if (files) {
      if (Array.isArray(files)) {
        file = files.find((f) => f.fieldname === 'file');
        thumbnail = files.find((f) => f.fieldname === 'thumbnail');
      } else {
        file = files.file?.[0];
        thumbnail = files.thumbnail?.[0];
      }
    }
    
    const updateData: MaterialUpdateData = {
      id,
      ...httpRequest.body,
      ...(httpRequest.body.isNew !== undefined && { isNewMaterial: httpRequest.body.isNew === 'true' }),
      ...(httpRequest.body.tags && { tags: typeof httpRequest.body.tags === 'string' ? [httpRequest.body.tags] : [httpRequest.body.tags] }),
      ...(httpRequest.body.isRestricted !== undefined && { isRestricted: httpRequest.body.isRestricted === true || httpRequest.body.isRestricted === 'true' })
    };
    
    if (file?.path) {
      updateData.fileUrl = file.path;
    }
    else if (httpRequest.body.fileUrl) {
      updateData.fileUrl = httpRequest.body.fileUrl;
    }
    
    if (thumbnail?.path) {
      updateData.thumbnailUrl = thumbnail.path;
    }
    else if (httpRequest.body.thumbnailUrl) {
      updateData.thumbnailUrl = httpRequest.body.thumbnailUrl;
    }
        
    const result = await this.updateMaterialUseCase.execute(updateData);
    if (!result) {
      return this.httpErrors.error_404();
    }
    return this.httpSuccess.success_200(result);
  }

  async deleteMaterial(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const { id } = httpRequest.params;
      if (!id) {
        return this.httpErrors.error_400();
      }
      await this.deleteMaterialUseCase.execute({ id });
      return this.httpSuccess.success_200({ message: 'Material deleted successfully' });
  }
} 