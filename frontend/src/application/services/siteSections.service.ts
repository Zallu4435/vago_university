import httpClient from '../../frameworks/api/httpClient';

export interface SiteSection {
  id: string;
  sectionKey: 'highlights' | 'vagoNow' | 'leadership';
  title: string;
  description: string;
  category?: string;
  image: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSectionsResponse {
  sections: SiteSection[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class SiteSectionsService {
  // Get highlights for home page
  async getHighlights(): Promise<SiteSection[]> {
    const response = await httpClient.get<SiteSectionsResponse>('/site-sections?sectionKey=highlights');
    return response.data.sections;
  }

  // Get VAGO Now for home page
  async getVagoNow(): Promise<SiteSection[]> {
    const response = await httpClient.get<SiteSectionsResponse>('/site-sections?sectionKey=vagoNow');
    return response.data.sections;
  }

  // Get leadership for home page
  async getLeadership(): Promise<SiteSection[]> {
    const response = await httpClient.get<SiteSectionsResponse>('/site-sections?sectionKey=leadership');
    return response.data.sections;
  }

  // Get all sections by type (generic method)
  async getSectionsByType(sectionKey: 'highlights' | 'vagoNow' | 'leadership'): Promise<SiteSection[]> {
    const response = await httpClient.get<SiteSectionsResponse>(`/site-sections?sectionKey=${sectionKey}`);
    return response.data.sections;
  }
}

export const siteSectionsService = new SiteSectionsService(); 