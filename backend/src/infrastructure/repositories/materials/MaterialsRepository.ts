import { IMaterialsRepository } from '../../../application/materials/repositories/IMaterialsRepository';
import { GetMaterialsRequestDTO, GetMaterialByIdRequestDTO, CreateMaterialRequestDTO, UpdateMaterialRequestDTO, DeleteMaterialRequestDTO } from '../../../domain/materials/dtos/MaterialRequestDTOs';
import { GetMaterialsResponseDTO, GetMaterialByIdResponseDTO, CreateMaterialResponseDTO, UpdateMaterialResponseDTO } from '../../../domain/materials/dtos/MaterialResponseDTOs';
import { MaterialModel } from '../../database/mongoose/material/MaterialModel';

export class MaterialsRepository implements IMaterialsRepository {
  async getMaterials(params: GetMaterialsRequestDTO): Promise<GetMaterialsResponseDTO> {
    const { subject, course, semester, type, uploadedBy, page, limit } = params;
    const query: any = {};
    if (subject && subject !== 'All Subjects') query.subject = subject;
    if (course && course !== 'All Courses') query.course = course;
    if (semester && semester !== 'All Semesters') query.semester = semester;
    if (type && type !== 'All Types') query.type = type;
    if (uploadedBy && uploadedBy !== 'All Uploaders') query.uploadedBy = uploadedBy;

    const skip = (page - 1) * limit;
    const materials = await MaterialModel.find(query).sort({ uploadedAt: -1 }).skip(skip).limit(limit);
    const total = await MaterialModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return { materials: materials.map(m => m.toObject()), totalPages };
  }

  async getMaterialById(params: GetMaterialByIdRequestDTO): Promise<GetMaterialByIdResponseDTO | null> {
    const material = await MaterialModel.findById(params.id);
    return material ? { material: material.toObject() } : null;
  }

  async createMaterial(params: CreateMaterialRequestDTO): Promise<CreateMaterialResponseDTO> {
    const material = new MaterialModel({ ...params, uploadedBy: params.uploadedBy || 'defaultUser' });
    await material.save();
    return { material: material.toObject() };
  }

  async updateMaterial(params: UpdateMaterialRequestDTO): Promise<UpdateMaterialResponseDTO | null> {
    const material = await MaterialModel.findByIdAndUpdate(params.id, params.data, { new: true });
    return material ? { material: material.toObject() } : null;
  }

  async deleteMaterial(params: DeleteMaterialRequestDTO): Promise<void> {
    await MaterialModel.findByIdAndDelete(params.id);
  }
} 