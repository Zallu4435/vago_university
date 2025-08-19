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
  image?: string | File;
  link?: string;
}

export interface UpdateSiteSectionData {
  title?: string;
  description?: string;
  category?: string;
  image?: string | File;
  link?: string;
}

export interface SiteSectionsResponse {
  data: {
    sections: SiteSection[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SiteSectionResponse {
  data: {
    section: SiteSection;
  };
}

export interface RequestHeaders {
  [key: string]: string;
}

function isFile(value: unknown): value is File {
  return typeof File !== 'undefined' && value instanceof File;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUndefinedOrNull(value: unknown): value is undefined | null {
  return value === undefined || value === null;
}

class SiteManagementService {
  async getSections(
    sectionKey: 'highlights' | 'vagoNow' | 'leadership', 
    limit?: number, 
    page?: number,
    search?: string,
    category?: string,
    dateRange?: string,
    startDate?: string,
    endDate?: string
  ): Promise<SiteSection[]> {
    const params = new URLSearchParams();
    params.append('sectionKey', sectionKey);
    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (dateRange) params.append('dateRange', dateRange);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await httpClient.get<SiteSectionsResponse>(`/admin/site-sections?${params.toString()}`);
    return response.data.data.sections;
  }

  async getSectionById(id: string): Promise<SiteSection> {
    const response = await httpClient.get<SiteSectionResponse>(`/admin/site-sections/${id}`);
    return response.data.data.section;
  }

  async createSection(data: CreateSiteSectionData): Promise<SiteSection> {
    let payload: CreateSiteSectionData | FormData;
    let headers: RequestHeaders = {};
    
    if (data.image && isFile(data.image)) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (!isUndefinedOrNull(value)) {
          if (isFile(value)) {
            formData.append(key, value);
          } else if (isString(value)) {
            formData.append(key, value);
          }
        }
      });
      payload = formData;
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = data;
    }
    
    const response = await httpClient.post<SiteSectionResponse>('/admin/site-sections', payload, { headers });
    return response.data.data.section;
  }

  async updateSection(id: string, data: UpdateSiteSectionData): Promise<SiteSection> {
    let payload: UpdateSiteSectionData | FormData;
    let headers: RequestHeaders = {};
    
    if (data.image && isFile(data.image)) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (!isUndefinedOrNull(value)) {
          if (isFile(value)) {
            formData.append(key, value);
          } else if (isString(value)) {
            formData.append(key, value);
          }
        }
      });
      payload = formData;
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = data;
    }
    
    const response = await httpClient.put<SiteSectionResponse>(`/admin/site-sections/${id}`, payload, { headers });
    return response.data.data.section;
  }

  async deleteSection(id: string): Promise<void> {
    await httpClient.delete(`/admin/site-sections/${id}`);
  }
}

export const siteManagementService = new SiteManagementService(); 