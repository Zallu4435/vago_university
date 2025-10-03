import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IMaterialController } from '../IHttp';
import { IGetMaterialByIdUseCase, ICreateMaterialUseCase, IUpdateMaterialUseCase, IDeleteMaterialUseCase, IGetMaterialsUseCase } from '../../../application/materials/useCases/IMaterialUseCases';
import { MaterialUpdateData, UploadedFile } from '../../../domain/materials/entities/MaterialTypes';

export class MaterialController implements IMaterialController {
  private _httpErrors: HttpErrors;
  private _httpSuccess: HttpSuccess;

  constructor(
    private _getMaterialsUseCase: IGetMaterialsUseCase,
    private _getMaterialByIdUseCase: IGetMaterialByIdUseCase,
    private _createMaterialUseCase: ICreateMaterialUseCase,
    private _updateMaterialUseCase: IUpdateMaterialUseCase,
    private _deleteMaterialUseCase: IDeleteMaterialUseCase
  ) {
    this._httpErrors = new HttpErrors();
    this._httpSuccess = new HttpSuccess();
  }

  async getMaterials(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const { query } = httpRequest;
      
      const result = await this._getMaterialsUseCase.execute(query);
      return this._httpSuccess.success_200(result);
  }

  async getMaterialById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const { id } = httpRequest.params;
      if (!id) {
        return this._httpErrors.error_400();
      }
      const result = await this._getMaterialByIdUseCase.execute({ id });
      if (!result) {
        return this._httpErrors.error_404();
      }
      return this._httpSuccess.success_200(result);
  }

  async createMaterial(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body || !httpRequest.files) {
        return this._httpErrors.error_400();
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
      return this._httpErrors.error_400();
    }
    
    let processedTags: string[] = [];
    if (httpRequest.body.tags) {
      if (typeof httpRequest.body.tags === 'string') {
        try {
          const parsed = JSON.parse(httpRequest.body.tags);
          processedTags = Array.isArray(parsed) ? parsed : [httpRequest.body.tags];
        } catch {
          processedTags = httpRequest.body.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        }
      } else if (Array.isArray(httpRequest.body.tags)) {
        processedTags = httpRequest.body.tags;
      }
    }
    
    const materialData = {
      ...httpRequest.body,
      isNewMaterial: httpRequest.body.isNew === 'true',
      uploadedBy: httpRequest.body.uploadedBy || 'default-user',
      tags: processedTags,
      isRestricted: httpRequest.body.isRestricted === 'true',
      fileUrl: file.path,
      thumbnailUrl: thumbnail?.path || file.path
    };
        
    const result = await this._createMaterialUseCase.execute(materialData);
    return this._httpSuccess.success_201(result);
  }

  async updateMaterial(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    if (!id || !httpRequest.body) {
      return this._httpErrors.error_400();
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
    
    let processedTags: string[] | undefined;
    if (httpRequest.body.tags) {
      if (typeof httpRequest.body.tags === 'string') {
        try {
          const parsed = JSON.parse(httpRequest.body.tags);
          processedTags = Array.isArray(parsed) ? parsed : [httpRequest.body.tags];
        } catch {
          processedTags = httpRequest.body.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        }
      } else if (Array.isArray(httpRequest.body.tags)) {
        processedTags = httpRequest.body.tags;
      }
    }
    
    const updateData: MaterialUpdateData = {
      id,
      ...httpRequest.body,
      ...(httpRequest.body.isNew !== undefined && { isNewMaterial: httpRequest.body.isNew === 'true' }),
      ...(processedTags && { tags: processedTags }),
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
        
    const result = await this._updateMaterialUseCase.execute(updateData);
    if (!result) {
      return this._httpErrors.error_404();
    }
    return this._httpSuccess.success_200(result);
  }

  async deleteMaterial(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const { id } = httpRequest.params;
      if (!id) {
        return this._httpErrors.error_400();
      }
      await this._deleteMaterialUseCase.execute({ id });
      return this._httpSuccess.success_200({ message: 'Material deleted successfully' });
  }
} 