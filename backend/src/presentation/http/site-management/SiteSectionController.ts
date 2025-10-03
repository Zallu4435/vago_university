import { IHttpRequest, IHttpResponse } from "../IHttp";
import {
  IGetSiteSectionsUseCase,
  IGetSiteSectionByIdUseCase,
  ICreateSiteSectionUseCase,
  IUpdateSiteSectionUseCase,
  IDeleteSiteSectionUseCase
} from "../../../application/site-management/useCases/ISiteSectionUseCases";
import {
  GetSiteSectionsRequestDTO,
  GetSiteSectionByIdRequestDTO,
  CreateSiteSectionRequestDTO,
  UpdateSiteSectionRequestDTO,
  DeleteSiteSectionRequestDTO
} from "../../../domain/site-management/dtos/SiteSectionDTOs";

export class SiteSectionController {
  constructor(
    private readonly _getSiteSectionsUseCase: IGetSiteSectionsUseCase,
    private readonly _getSiteSectionByIdUseCase: IGetSiteSectionByIdUseCase,
    private readonly _createSiteSectionUseCase: ICreateSiteSectionUseCase,
    private readonly _updateSiteSectionUseCase: IUpdateSiteSectionUseCase,
    private readonly _deleteSiteSectionUseCase: IDeleteSiteSectionUseCase
  ) { }

  async getSections(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { 
      sectionKey, 
      page = 1, 
      limit = 10, 
      search,
      category,
      dateRange,
      startDate,
      endDate,
      status
    } = httpRequest.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    if (isNaN(pageNum) || pageNum < 1) {
      return {
        statusCode: 400,
        body: { error: "Page must be a positive number" }
      };
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return {
        statusCode: 400,
        body: { error: "Limit must be between 1 and 100" }
      };
    }
    const params: GetSiteSectionsRequestDTO = {
      sectionKey: sectionKey,
      page: pageNum,
      limit: limitNum,
      search: search as string,
      category: category as string,
      dateRange: dateRange as string,
      startDate: startDate as string,
      endDate: endDate as string,
      status: status as string,
    };
    const result = await this._getSiteSectionsUseCase.execute(params);
    if (!result.success) {
      return { statusCode: 400, body: { error: "Failed to get site sections" } };
    }
    return { statusCode: 200, body: { data: result.data } };
  }

  async getSectionById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const params: GetSiteSectionByIdRequestDTO = { id };
    const result = await this._getSiteSectionByIdUseCase.execute(params);
    if (!result.success) {
      return { statusCode: 400, body: { error: "Failed to get site section" } };
    }
    if (!result.data) {
      return { statusCode: 404, body: { error: "Site section not found" } };
    }
    return { statusCode: 200, body: { data: result.data } };
  }

  async createSection(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let params: CreateSiteSectionRequestDTO = httpRequest.body;
    if (httpRequest.file) {
      if (params.sectionKey !== 'leadership') {
        params = { ...params, image: httpRequest.file.path };
      }
    }
    const result = await this._createSiteSectionUseCase.execute(params);
    if (!result.success) {
      return { statusCode: 400, body: { error: "Failed to create site section" } };
    }
    return { statusCode: 201, body: { data: result.data } };
  }

  async updateSection(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    let params: UpdateSiteSectionRequestDTO = {
      id,
      ...httpRequest.body,
    };
    if (httpRequest.file) {
      params = { ...params, image: httpRequest.file.path };
    }
    const result = await this._updateSiteSectionUseCase.execute(params);
    if (!result.success) {
      return { statusCode: 400, body: { error: "Failed to update site section" } };
    }
    if (!result.data) {
      return { statusCode: 404, body: { error: "Site section not found" } };
    }
    return { statusCode: 200, body: { data: result.data } };
  }

  async deleteSection(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const params: DeleteSiteSectionRequestDTO = { id };
    const result = await this._deleteSiteSectionUseCase.execute(params);
    if (!result.success) {
      return { statusCode: 400, body: { error: "Failed to delete site section" } };
    }
    return { statusCode: 204, body: { data: null } };
  }
}
