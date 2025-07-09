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

function isFile(value: any): value is File {
  return typeof File !== 'undefined' && value instanceof File;
}

class SiteManagementService {
  // Get all sections by type
  async getSections(sectionKey: 'highlights' | 'vagoNow' | 'leadership', limit?: number, page?: number): Promise<SiteSection[]> {
    const params = new URLSearchParams();
    params.append('sectionKey', sectionKey);
    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());
    
    const response = await httpClient.get<SiteSectionsResponse>(`/admin/site-sections?${params.toString()}`);
    return response.data.data.sections;
  }

  // Get section by ID
  async getSectionById(id: string): Promise<SiteSection> {
    const response = await httpClient.get<{ section: SiteSection }>(`/admin/site-sections/${id}`);
    return response.data.data.section;
  }

  // Create new section
  async createSection(data: CreateSiteSectionData): Promise<SiteSection> {
    let payload: any = data;
    let headers: any = {};
    if (data.image && isFile(data.image)) {
      payload = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (isFile(value)) {
            payload.append(key, value);
          } else {
            payload.append(key, value as string);
          }
        }
      });
      headers['Content-Type'] = 'multipart/form-data';
    }
    const response = await httpClient.post<{ section: SiteSection }>('/admin/site-sections', payload, { headers });
    console.log(response, "popopopopop")
    return response.data.data.section;
  }

  // Update section
  async updateSection(id: string, data: UpdateSiteSectionData): Promise<SiteSection> {
    let payload: any = data;
    let headers: any = {};
    if (data.image && isFile(data.image)) {
      payload = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (isFile(value)) {
            payload.append(key, value);
          } else {
            payload.append(key, value as string);
          }
        }
      });
      headers['Content-Type'] = 'multipart/form-data';
    }
    const response = await httpClient.put<{ section: SiteSection }>(`/admin/site-sections/${id}`, payload, { headers });
    console.log(response, "pl[k[akof[kdf")
    return response.data.data.section;
  }

  // Delete section
  async deleteSection(id: string): Promise<void> {
    await httpClient.delete(`/admin/site-sections/${id}`);
  }
}

export const siteManagementService = new SiteManagementService(); 