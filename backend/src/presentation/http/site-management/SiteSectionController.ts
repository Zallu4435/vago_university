import { IHttpRequest, IHttpResponse } from "../IHttp";
import { 
  IGetSiteSectionsUseCase, 
  IGetSiteSectionByIdUseCase, 
  ICreateSiteSectionUseCase, 
  IUpdateSiteSectionUseCase, 
  IDeleteSiteSectionUseCase 
} from "../../../application/site-management/useCases/SiteSectionUseCases";
import { 
  GetSiteSectionsRequestDTO, 
  GetSiteSectionByIdRequestDTO, 
  CreateSiteSectionRequestDTO, 
  UpdateSiteSectionRequestDTO, 
  DeleteSiteSectionRequestDTO 
} from "../../../domain/site-management/dtos/SiteSectionDTOs";

export class SiteSectionController {
  constructor(
    private readonly getSiteSectionsUseCase: IGetSiteSectionsUseCase,
    private readonly getSiteSectionByIdUseCase: IGetSiteSectionByIdUseCase,
    private readonly createSiteSectionUseCase: ICreateSiteSectionUseCase,
    private readonly updateSiteSectionUseCase: IUpdateSiteSectionUseCase,
    private readonly deleteSiteSectionUseCase: IDeleteSiteSectionUseCase
  ) {}

  async getSections(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { sectionKey, page = 1, limit = 10, search } = httpRequest.query;
      const params: GetSiteSectionsRequestDTO = {
        sectionKey: sectionKey as any,
        page: Number(page),
        limit: Number(limit),
        search: search as string,
      };

      const result = await this.getSiteSectionsUseCase.execute(params);
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to get site sections" } };
      }

      return { statusCode: 200, body: result.data };
    } catch (error) {
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }

  async getSectionById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      const params: GetSiteSectionByIdRequestDTO = { id };
      
      const result = await this.getSiteSectionByIdUseCase.execute(params);
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to get site section" } };
      }

      if (!result.data) {
        return { statusCode: 404, body: { message: "Site section not found" } };
      }

      return { statusCode: 200, body: result.data };
    } catch (error) {
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }

  async createSection(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const params: CreateSiteSectionRequestDTO = httpRequest.body;
      const result = await this.createSiteSectionUseCase.execute(params);
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to create site section" } };
      }

      return { statusCode: 201, body: result.data };
    } catch (error) {
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }

  async updateSection(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      const params: UpdateSiteSectionRequestDTO = {
        id,
        ...httpRequest.body,
      };

      const result = await this.updateSiteSectionUseCase.execute(params);
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to update site section" } };
      }

      if (!result.data) {
        return { statusCode: 404, body: { message: "Site section not found" } };
      }

      return { statusCode: 200, body: result.data };
    } catch (error) {
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }

  async deleteSection(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      const params: DeleteSiteSectionRequestDTO = { id };

      const result = await this.deleteSiteSectionUseCase.execute(params);
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to delete site section" } };
      }

      return { statusCode: 204, body: null };
    } catch (error) {
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }
}
