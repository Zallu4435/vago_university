import { MaterialsRepository } from '../../repositories/materials/MaterialsRepository';
import { GetMaterialsUseCase, GetMaterialByIdUseCase, CreateMaterialUseCase, UpdateMaterialUseCase, DeleteMaterialUseCase } from '../../../application/materials/useCases/MaterialUseCases';
import { IGetMaterialsUseCase, IGetMaterialByIdUseCase, ICreateMaterialUseCase, IUpdateMaterialUseCase, IDeleteMaterialUseCase } from '../../../application/materials/useCases/IMaterialUseCases';
import { MaterialController } from '../../../presentation/http/materials/MaterialController';

export class MaterialComposers {
  static composeMaterialController(): MaterialController {
    const repository = new MaterialsRepository();
    const getMaterialsUseCase: IGetMaterialsUseCase = new GetMaterialsUseCase(repository);
    const getMaterialByIdUseCase: IGetMaterialByIdUseCase = new GetMaterialByIdUseCase(repository);
    const createMaterialUseCase: ICreateMaterialUseCase = new CreateMaterialUseCase(repository);
    const updateMaterialUseCase: IUpdateMaterialUseCase = new UpdateMaterialUseCase(repository);
    const deleteMaterialUseCase: IDeleteMaterialUseCase = new DeleteMaterialUseCase(repository);
    return new MaterialController(
      getMaterialsUseCase,
      getMaterialByIdUseCase,
      createMaterialUseCase,
      updateMaterialUseCase,
      deleteMaterialUseCase
    );
  }
} 