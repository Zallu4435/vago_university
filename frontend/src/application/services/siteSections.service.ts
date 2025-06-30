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
  async getHighlights(limit?: number, page?: number): Promise<SiteSection[]> {
    const params = new URLSearchParams();
    params.append('sectionKey', 'highlights');
    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());
    
    const response = await httpClient.get<SiteSectionsResponse>(`/site-sections?${params.toString()}`);
    return response.data.data.sections;
  }

  // Get VAGO Now for home page
  async getVagoNow(limit?: number, page?: number): Promise<SiteSection[]> {
    const params = new URLSearchParams();
    params.append('sectionKey', 'vagoNow');
    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());
    
    const response = await httpClient.get<SiteSectionsResponse>(`/site-sections?${params.toString()}`);
    return response.data.data.sections;
  }

  // Get leadership for home page
  async getLeadership(limit?: number, page?: number): Promise<SiteSection[]> {
    const params = new URLSearchParams();
    params.append('sectionKey', 'leadership');
    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());
    
    const response = await httpClient.get<SiteSectionsResponse>(`/site-sections?${params.toString()}`);
    return response.data.data.sections;
  }

  // Get all sections by type (generic method)
  async getSectionsByType(sectionKey: 'highlights' | 'vagoNow' | 'leadership', limit?: number, page?: number): Promise<SiteSection[]> {
    const params = new URLSearchParams();
    params.append('sectionKey', sectionKey);
    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());
    
    const response = await httpClient.get<SiteSectionsResponse>(`/site-sections?${params.toString()}`);
    return response.data.sections;
  }
}

export const siteSectionsService = new SiteSectionsService(); 