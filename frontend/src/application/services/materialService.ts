import dummyData from '../../presentation/pages/admin/material/dummyData';
import { Material } from '../../domain/types/material';

export const materialService = {
  async getMaterials(
    filters: { subject?: string; course?: string; semester?: string; type?: string; uploadedBy?: string },
    page: number,
    limit: number
  ): Promise<{ materials: Material[]; totalPages: number }> {
    let materials = [...dummyData.materials];
    
    if (filters.subject && filters.subject !== 'All Subjects') {
      materials = materials.filter((m) => m.subject === filters.subject);
    }
    if (filters.course && filters.course !== 'All Courses') {
      materials = materials.filter((m) => m.course === filters.course);
    }
    if (filters.semester && filters.semester !== 'All Semesters') {
      materials = materials.filter((m) => m.semester === parseInt(filters.semester));
    }
    if (filters.type && filters.type !== 'All Types') {
      materials = materials.filter((m) => m.type === filters.type);
    }
    if (filters.uploadedBy && filters.uploadedBy !== 'All Uploaders') {
      materials = materials.filter((m) => m.uploadedBy === filters.uploadedBy);
    }

    const totalPages = Math.ceil(materials.length / limit);
    const startIndex = (page - 1) * limit;
    materials = materials.slice(startIndex, startIndex + limit);

    return { materials, totalPages };
  },

  async getMaterialById(id: string): Promise<Material> {
    const material = dummyData.materials.find((m) => m._id === id);
    if (!material) throw new Error('Material not found');
    return material;
  },

  async createMaterial(data: Omit<Material, '_id' | 'uploadedAt' | 'views' | 'downloads' | 'rating'>): Promise<Material> {
    const newMaterial: Material = {
      _id: `mat_${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      ...data,
      uploadedAt: new Date().toISOString(),
      views: 0,
      downloads: 0,
      rating: 0,
    };
    dummyData.materials.push(newMaterial);
    return newMaterial;
  },

  async updateMaterial(id: string, data: Partial<Material>): Promise<Material> {
    const index = dummyData.materials.findIndex((m) => m._id === id);
    if (index === -1) throw new Error('Material not found');
    dummyData.materials[index] = { ...dummyData.materials[index], ...data };
    return dummyData.materials[index];
  },

  async deleteMaterial(id: string): Promise<void> {
    const index = dummyData.materials.findIndex((m) => m._id === id);
    if (index === -1) throw new Error('Material not found');
    dummyData.materials.splice(index, 1);
  },

  async toggleRestriction(id: string, isRestricted: boolean): Promise<Material> {
    const index = dummyData.materials.findIndex((m) => m._id === id);
    if (index === -1) throw new Error('Material not found');
    dummyData.materials[index].isRestricted = isRestricted;
    return dummyData.materials[index];
  },
};