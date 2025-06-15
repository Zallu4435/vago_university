import { IMaterialsRepository } from '../repositories/IMaterialsRepository';
import { GetMaterialsRequestDTO, GetMaterialByIdRequestDTO, CreateMaterialRequestDTO, UpdateMaterialRequestDTO, DeleteMaterialRequestDTO } from '../../../domain/materials/dtos/MaterialRequestDTOs';
import { GetMaterialsResponseDTO, GetMaterialByIdResponseDTO, CreateMaterialResponseDTO, UpdateMaterialResponseDTO } from '../../../domain/materials/dtos/MaterialResponseDTOs';

export class GetMaterialsUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: GetMaterialsRequestDTO): Promise<GetMaterialsResponseDTO> {
    return this.repo.getMaterials(params);
  }
}

export class GetMaterialByIdUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: GetMaterialByIdRequestDTO): Promise<GetMaterialByIdResponseDTO | null> {
    return this.repo.getMaterialById(params);
  }
}

export class CreateMaterialUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: CreateMaterialRequestDTO): Promise<CreateMaterialResponseDTO> {
    return this.repo.createMaterial(params);
  }
}

export class UpdateMaterialUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: UpdateMaterialRequestDTO): Promise<UpdateMaterialResponseDTO | null> {
    return this.repo.updateMaterial(params);
  }
}

export class DeleteMaterialUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: DeleteMaterialRequestDTO): Promise<void> {
    return this.repo.deleteMaterial(params);
  }
} 