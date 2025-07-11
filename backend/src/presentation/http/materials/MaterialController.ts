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
      const { query } = httpRequest;
      console.log('=== MaterialController getMaterials DEBUG ===');
      console.log('Query parameters received:', query);
      console.log('=== MaterialController getMaterials DEBUG END ===');
      
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
    console.log('=== MATERIAL CONTROLLER CREATE DEBUG ===');
    console.log('Request body:', httpRequest.body);
    console.log('Request file:', httpRequest.file);
    console.log('Request files:', httpRequest.files);
    console.log('=== MATERIAL CONTROLLER CREATE DEBUG END ===');
    
    if (!httpRequest.body || !httpRequest.files) {
        return this.httpErrors.error_400();
      }
    
    let file, thumbnail;
    const files = httpRequest.files as any;
    if (Array.isArray(files)) {
      file = files.find((f: any) => f.fieldname === 'file');
      thumbnail = files.find((f: any) => f.fieldname === 'thumbnail');
    } else if (files) {
      file = files.file?.[0];
      thumbnail = files.thumbnail?.[0];
    }
    
    if (!file) {
      return this.httpErrors.error_400();
    }
    
    // Map and normalize the request body to match Material entity expectations
    const materialData = {
      ...httpRequest.body,
      // Convert isNew to isNewMaterial
      isNewMaterial: httpRequest.body.isNew === 'true',
      // Add uploadedBy (you might want to get this from auth context)
      uploadedBy: httpRequest.body.uploadedBy || 'default-user', // TODO: Get from auth context
      // Convert tags from string to array if needed
      tags: typeof httpRequest.body.tags === 'string' ? [httpRequest.body.tags] : httpRequest.body.tags,
      // Convert booleans from string to boolean
      isRestricted: httpRequest.body.isRestricted === 'true',
      fileUrl: file.path,
      thumbnailUrl: thumbnail?.path || file.path // Use thumbnail if available, otherwise use file
    };
    
    const result = await this.createMaterialUseCase.execute(materialData);
    return this.httpSuccess.success_201(result);
  }

  async updateMaterial(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    console.log('=== MATERIAL CONTROLLER UPDATE DEBUG ===');
    console.log('Request body:', httpRequest.body);
    console.log('Request file:', httpRequest.file);
    console.log('Request files:', httpRequest.files);
    console.log('=== MATERIAL CONTROLLER UPDATE DEBUG END ===');
    
      const { id } = httpRequest.params;
      if (!id || !httpRequest.body) {
        return this.httpErrors.error_400();
      }
    
    let file, thumbnail;
    const files = httpRequest.files as any;
    if (Array.isArray(files)) {
      file = files.find((f: any) => f.fieldname === 'file');
      thumbnail = files.find((f: any) => f.fieldname === 'thumbnail');
    } else if (files) {
      file = files.file?.[0];
      thumbnail = files.thumbnail?.[0];
    }
    
    // Map and normalize the request body to match Material entity expectations
    const updateData: any = {
      id,
          ...httpRequest.body,
      // Convert isNew to isNewMaterial if present
      ...(httpRequest.body.isNew !== undefined && { isNewMaterial: httpRequest.body.isNew === 'true' }),
      // Convert tags from string to array if needed
      ...(httpRequest.body.tags && { tags: typeof httpRequest.body.tags === 'string' ? [httpRequest.body.tags] : httpRequest.body.tags }),
      // Convert booleans from string to boolean
      ...(httpRequest.body.isRestricted !== undefined && { isRestricted: httpRequest.body.isRestricted === 'true' })
    };
    
    if (file?.path) {
      console.error('[MaterialController] Updating material with new fileUrl:', file.path);
      updateData.fileUrl = file.path;
    }
    
    if (thumbnail?.path) {
      console.error('[MaterialController] Updating material with new thumbnailUrl:', thumbnail.path);
      updateData.thumbnailUrl = thumbnail.path;
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