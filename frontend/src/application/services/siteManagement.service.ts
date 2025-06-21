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

export interface CreateSiteSectionData {
  sectionKey: 'highlights' | 'vagoNow' | 'leadership';
  title: string;
  description: string;
  category?: string;
  image?: string;
  link?: string;
}

export interface UpdateSiteSectionData {
  title?: string;
  description?: string;
  category?: string;
  image?: string;
  link?: string;
}

export interface SiteSectionsResponse {
  sections: SiteSection[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class SiteManagementService {
  // Get all sections by type
  async getSections(sectionKey: 'highlights' | 'vagoNow' | 'leadership'): Promise<SiteSection[]> {
    const response = await httpClient.get<SiteSectionsResponse>(`/admin/site-sections?sectionKey=${sectionKey}`);
    return response.data.sections;
  }

  // Get section by ID
  async getSectionById(id: string): Promise<SiteSection> {
    const response = await httpClient.get<{ section: SiteSection }>(`/admin/site-sections/${id}`);
    return response.data.section;
  }

  // Create new section
  async createSection(data: CreateSiteSectionData): Promise<SiteSection> {
    const response = await httpClient.post<{ section: SiteSection }>('/admin/site-sections', data);
    return response.data.section;
  }

  // Update section
  async updateSection(id: string, data: UpdateSiteSectionData): Promise<SiteSection> {
    const response = await httpClient.put<{ section: SiteSection }>(`/admin/site-sections/${id}`, data);
    return response.data.section;
  }

  // Delete section
  async deleteSection(id: string): Promise<void> {
    await httpClient.delete(`/admin/site-sections/${id}`);
  }
}

export const siteManagementService = new SiteManagementService(); 