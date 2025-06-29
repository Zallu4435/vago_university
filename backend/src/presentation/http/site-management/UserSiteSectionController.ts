import { IHttpRequest, IHttpResponse } from "../IHttp";
import { IGetUserSiteSectionsUseCase } from "../../../application/site-management/useCases/UserSiteSectionUseCases";
import { GetUserSiteSectionsRequestDTO } from "../../../domain/site-management/dtos/UserSiteSectionDTOs";
import { SiteSectionKey } from "../../../domain/site-management/entities/SiteSection";

export class UserSiteSectionController {
  constructor(
    private readonly getUserSiteSectionsUseCase: IGetUserSiteSectionsUseCase
  ) { }

  async getSections(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { sectionKey, page = 1, limit = 10 } = httpRequest.query;

      if (!sectionKey || typeof sectionKey !== 'string') {
        return {
          statusCode: 400,
          body: { error: "Section key is required" }
        };
      }

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

      let mappedSectionKey: SiteSectionKey;
      switch (sectionKey) {
        case 'highlights':
          mappedSectionKey = SiteSectionKey.Highlights;
          break;
        case 'vagoNow':
          mappedSectionKey = SiteSectionKey.VagoNow;
          break;
        case 'leadership':
          mappedSectionKey = SiteSectionKey.Leadership;
          break;
        default:
          return {
            statusCode: 400,
            body: { error: "Invalid section key. Must be one of: highlights, vagoNow, leadership" }
          };
      }

      const params: GetUserSiteSectionsRequestDTO = {
        sectionKey: mappedSectionKey,
        page: pageNum,
        limit: limitNum,
      };

      const result = await this.getUserSiteSectionsUseCase.execute(params);
      if (!result.success) {
        return {
          statusCode: 400,
          body: { error: "Failed to get site sections" }
        };
      }

      return { statusCode: 200, body: { data: result.data } };
    } catch (error) {
      return { statusCode: 500, body: { error: "Internal server error" } };
    }
  }
} 