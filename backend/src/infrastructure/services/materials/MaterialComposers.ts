import { MaterialsRepository } from '../../repositories/materials/MaterialsRepository';
import { GetMaterialsUseCase, GetMaterialByIdUseCase, CreateMaterialUseCase, UpdateMaterialUseCase, DeleteMaterialUseCase } from '../../../application/materials/useCases/MaterialUseCases';
import { MaterialController } from '../../../presentation/http/materials/MaterialController';

export class MaterialComposers {
  static composeMaterialController(): MaterialController {
    const repository = new MaterialsRepository();
    const getMaterialsUseCase = new GetMaterialsUseCase(repository);
    const getMaterialByIdUseCase = new GetMaterialByIdUseCase(repository);
    const createMaterialUseCase = new CreateMaterialUseCase(repository);
    const updateMaterialUseCase = new UpdateMaterialUseCase(repository);
    const deleteMaterialUseCase = new DeleteMaterialUseCase(repository);
    return new MaterialController(
      getMaterialsUseCase,
      getMaterialByIdUseCase,
      createMaterialUseCase,
      updateMaterialUseCase,
      deleteMaterialUseCase
    );
  }
} 