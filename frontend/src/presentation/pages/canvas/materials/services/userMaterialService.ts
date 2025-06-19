import httpClient from '../../../../../frameworks/api/httpClient';

export const userMaterialService = {
  getMaterials: async (filters: {
    subject?: string;
    course?: string;
    semester?: string;
    type?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await httpClient.get('/materials', { params: filters });
    return response.data;
  },

  getMaterialById: async (id: string) => {
    const response = await httpClient.get(`/materials/${id}`);
    return response.data;
  },

  toggleBookmark: async (id: string) => {
    const response = await httpClient.post(`/materials/${id}/bookmark`);
    return response.data;
  },

  toggleLike: async (id: string) => {
    const response = await httpClient.post(`/materials/${id}/like`);
    return response.data;
  },

  downloadMaterial: async (id: string) => {
    const response = await httpClient.get(`/materials/${id}/download`);
    return response.data.url;
  },

  getBookmarkedMaterials: async () => {
    const response = await httpClient.get('/materials/bookmarks');
    return response.data;
  },

  getLikedMaterials: async () => {
    const response = await httpClient.get('/materials/likes');
    return response.data;
  }
};