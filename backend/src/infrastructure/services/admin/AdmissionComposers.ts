import { IAdmissionRepository } from '../../../application/admin/repositories/IAdmissionRepository';
import {
    GetAdmissionsUseCase,
    GetAdmissionByIdUseCase,
    ApproveAdmissionUseCase,
    RejectAdmissionUseCase,
    DeleteAdmissionUseCase,
    ConfirmAdmissionOfferUseCase,
} from '../../../application/admin/useCases/AdmissionUseCases';
import { AdmissionRepository } from '../../repositories/admin/AdmissionRepository';
import { AdminAdmissionController } from '../../../presentation/http/admin/AdmissionController';
import { IAdminAdmissionController } from '../../../presentation/http/IHttp';

export function getAdminAdmissionsComposer(): IAdminAdmissionController {
    const repository: IAdmissionRepository = new AdmissionRepository();
    const getAdmissionsUseCase = new GetAdmissionsUseCase(repository);
    const getAdmissionByIdUseCase = new GetAdmissionByIdUseCase(repository);
    const approveAdmissionUseCase = new ApproveAdmissionUseCase(repository);
    const rejectAdmissionUseCase = new RejectAdmissionUseCase(repository);
    const deleteAdmissionUseCase = new DeleteAdmissionUseCase(repository);
    const confirmAdmissionOfferUseCase = new ConfirmAdmissionOfferUseCase(repository);
    return new AdminAdmissionController(
        getAdmissionsUseCase,
        getAdmissionByIdUseCase,
        approveAdmissionUseCase,
        rejectAdmissionUseCase,
        deleteAdmissionUseCase,
        confirmAdmissionOfferUseCase
    );
}