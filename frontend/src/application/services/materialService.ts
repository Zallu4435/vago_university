import { Material } from '../../domain/types/material';
import httpClient from '../../frameworks/api/httpClient';

export const materialService = {
  async getMaterials(
    filters: { subject?: string; course?: string; semester?: string; type?: string; uploadedBy?: string },
    page: number,
    limit: number
  ): Promise<{ materials: Material[]; totalPages: number }> {
    const response = await httpClient.get('/admin/materials', { params: { ...filters, page, limit } });
    return response.data;
  },

  async getMaterialById(id: string): Promise<Material> {
    const response = await httpClient.get(`/admin/materials/${id}`);
    return response.data.material;
  },

  async createMaterial(data: Omit<Material, '_id' | 'uploadedAt' | 'views' | 'downloads' | 'rating'>): Promise<Material> {
    const response = await httpClient.post('/admin/materials', data);
    return response.data.material;
  },

  async updateMaterial(id: string, data: Partial<Material>): Promise<Material> {
    const response = await httpClient.put(`/admin/materials/${id}`, data);
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