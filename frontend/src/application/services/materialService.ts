import { Material } from '../../domain/types/management/materialmanagement';
import httpClient from '../../frameworks/api/httpClient';
import { isAxiosErrorWithApiError } from '../../shared/types/apiError';

export const materialService = {
  async getMaterials(
    filters: { 
      subject?: string; 
      course?: string; 
      semester?: string; 
      search?: string;
      status?: string;
      dateRange?: string;
      startDate?: string;
      endDate?: string;
    },
    page: number,
    limit: number
  ): Promise<{ materials: Material[]; totalPages: number }> {
    try {
      const params: any = { page, limit };
      if (filters.subject && filters.subject !== 'All Subjects') params.subject = filters.subject;
      if (filters.course && filters.course !== 'All Courses') params.course = filters.course;
      if (filters.semester && filters.semester !== 'All Semesters') params.semester = filters.semester;
      if (filters.search && filters.search.trim()) params.search = filters.search.trim();
      if (filters.status && filters.status !== 'all') params.status = filters.status;
      if (filters.dateRange && filters.dateRange !== 'all') params.dateRange = filters.dateRange;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const response = await httpClient.get('/admin/materials', { params });
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch materials');
      }
      throw new Error('Failed to fetch materials');
    }
  },

  async getMaterialById(id: string): Promise<Material> {
    try {
      const response = await httpClient.get(`/admin/materials/${id}`);
      return response.data.data.material;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch material');
      }
      throw new Error('Failed to fetch material');
    }
  },

  async createMaterial(data: Omit<Material, 'id' | 'uploadedAt' | 'views' | 'downloads' | 'rating'> | FormData): Promise<Material> {
    try {
      const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
      const response = await httpClient.post(
        '/admin/materials',
        data,
        isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
      );
      return response.data.material;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create material');
      }
      throw new Error('Failed to create material');
    }
  },

  async updateMaterial(id: string, data: Partial<Material> | FormData): Promise<Material> {
    try {
      const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
      const response = await httpClient.put(
        `/admin/materials/${id}`,
        data,
        isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
      );
      return response.data.material;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update material');
      }
      throw new Error('Failed to update material');
    }
  },

  async deleteMaterial(id: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/materials/${id}`);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to delete material');
      }
      throw new Error('Failed to delete material');
    }
  },

  async toggleRestriction(id: string, isRestricted: boolean): Promise<Material> {
    try {
      const response = await httpClient.put(`/admin/materials/${id}`, { isRestricted });
      return response.data.material;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update restriction');
      }
      throw new Error('Failed to update restriction');
    }
  },
};