import { Material } from '../../domain/types/material';
import httpClient from '../../frameworks/api/httpClient';

export const materialService = {
  async getMaterials(
    filters: { subject?: string; course?: string; semester?: string; type?: string; uploadedBy?: string },
    page: number,
    limit: number
  ): Promise<{ materials: Material[]; totalPages: number }> {
    const response = await httpClient.get('/admin/materials', { params: { ...filters, page, limit } });
    return response.data.data;
  },

  async getMaterialById(id: string): Promise<Material> {
    const response = await httpClient.get(`/admin/materials/${id}`);
    return response.data.data.material;
  },

  async createMaterial(data: Omit<Material, 'id' | 'uploadedAt' | 'views' | 'downloads' | 'rating'> | FormData): Promise<Material> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await httpClient.post(
      '/admin/materials',
      data,
      isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    );
    return response.data.material;
  },

  async updateMaterial(id: string, data: Partial<Material> | FormData): Promise<Material> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await httpClient.put(
      `/admin/materials/${id}`,
      data,
      isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    );
    return response.data.material;
  },

  async deleteMaterial(id: string): Promise<void> {
    await httpClient.delete(`/admin/materials/${id}`);
  },

  async toggleRestriction(id: string, isRestricted: boolean): Promise<Material> {
    const response = await httpClient.put(`/admin/materials/${id}`, { isRestricted });
    return response.data.material;
  },
};