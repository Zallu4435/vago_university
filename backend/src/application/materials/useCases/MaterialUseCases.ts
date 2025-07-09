import { IMaterialsRepository } from '../repositories/IMaterialsRepository';
import { GetMaterialsRequestDTO, GetMaterialByIdRequestDTO, CreateMaterialRequestDTO, UpdateMaterialRequestDTO, DeleteMaterialRequestDTO } from '../../../domain/materials/dtos/MaterialRequestDTOs';
import { GetMaterialsResponseDTO, GetMaterialByIdResponseDTO, CreateMaterialResponseDTO, UpdateMaterialResponseDTO } from '../../../domain/materials/dtos/MaterialResponseDTOs';
import { Material, MaterialProps } from '../../../domain/materials/entities/Material';
import { MaterialNotFoundError, MaterialValidationError } from '../../../domain/materials/errors/MaterialErrors';

function toMaterialProps(raw: any): MaterialProps {
  return {
    id: raw._id?.toString() ?? raw.id,
    title: raw.title,
    description: raw.description,
    subject: raw.subject,
    course: raw.course,
    semester: raw.semester,
    type: raw.type,
    fileUrl: raw.fileUrl,
    thumbnailUrl: raw.thumbnailUrl,
    tags: raw.tags,
    difficulty: raw.difficulty,
    estimatedTime: raw.estimatedTime,
    isNewMaterial: raw.isNewMaterial,
    isRestricted: raw.isRestricted,
    uploadedBy: raw.uploadedBy,
    uploadedAt: raw.uploadedAt,
    views: raw.views,
    downloads: raw.downloads,
    rating: raw.rating,
  };
}

export class GetMaterialsUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: GetMaterialsRequestDTO): Promise<GetMaterialsResponseDTO> {
    // Build query/filter logic here (not in repository)
    const filter: any = {};
    if (params.subject && params.subject !== 'All Subjects') filter.subject = params.subject;
    if (params.course && params.course !== 'All Courses') filter.course = params.course;
    if (
      params.semester !== undefined &&
      params.semester !== null &&
      params.semester !== 0 &&
      typeof params.semester === 'number' &&
      !isNaN(params.semester)
    ) {
      filter.semester = params.semester;
    }
    if (params.type && params.type !== 'All Types') filter.type = params.type;
    if (params.uploadedBy && params.uploadedBy !== 'All Uploaders') filter.uploadedBy = params.uploadedBy;

    const skip = (params.page - 1) * params.limit;
    const sort = { uploadedAt: -1 };
    const materials = await this.repo.find(filter, { skip, limit: params.limit, sort });
    const total = await this.repo.count(filter);
    const totalPages = Math.ceil(total / params.limit);
    return {
      materials: materials.map(toMaterialProps),
      totalPages,
    };
  }
}

export class GetMaterialByIdUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: GetMaterialByIdRequestDTO): Promise<GetMaterialByIdResponseDTO | null> {
    if (!params.id) throw new MaterialValidationError('Material ID is required');
    const material = await this.repo.findById(params.id);
    if (!material) throw new MaterialNotFoundError(params.id);
    return { material: toMaterialProps(material) };
  }
}

export class CreateMaterialUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: CreateMaterialRequestDTO): Promise<CreateMaterialResponseDTO> {
    // Business logic/validation
    const material = Material.create(params);
    const dbResult = await this.repo.create(material.props);
    return { material: toMaterialProps(dbResult) };
  }
}

export class UpdateMaterialUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: UpdateMaterialRequestDTO): Promise<UpdateMaterialResponseDTO | null> {
    if (!params.id) throw new MaterialValidationError('Material ID is required');
    
    // First, get the existing material
    const existingMaterial = await this.repo.findById(params.id);
    if (!existingMaterial) throw new MaterialNotFoundError(params.id);
    
    // Create updated material using the entity's update method
    const existingProps = toMaterialProps(existingMaterial);
    console.log('=== UPDATE MATERIAL USE CASE DEBUG ===');
    console.log('Existing props:', existingProps);
    console.log('Update params:', params);
    
    // Create updated material using the entity's update method
    const { id, ...updateData } = params;
    const updatedMaterial = Material.update(existingProps, updateData);
    console.log('Updated material props:', updatedMaterial.props);
    console.log('=== UPDATE MATERIAL USE CASE DEBUG END ===');
    
    // Update in database
    const dbResult = await this.repo.update(params.id, updatedMaterial.props);
    if (!dbResult) throw new MaterialNotFoundError(params.id);
    
    return { material: toMaterialProps(dbResult) };
  }
}

export class DeleteMaterialUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: DeleteMaterialRequestDTO): Promise<void> {
    if (!params.id) throw new MaterialValidationError('Material ID is required');
    const material = await this.repo.findById(params.id);
    if (!material) throw new MaterialNotFoundError(params.id);
    await this.repo.delete(params.id);
  }
} 