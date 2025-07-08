import { IAdmissionRepository } from '../../../application/admin/repositories/IAdmissionRepository';
import {
    GetAdmissionsUseCase,
    GetAdmissionByIdUseCase,
    GetAdmissionByTokenUseCase,
    ApproveAdmissionUseCase,
    RejectAdmissionUseCase,
    DeleteAdmissionUseCase,
    ConfirmAdmissionOfferUseCase,
} from '../../../application/admin/useCases/AdmissionUseCases';
import { AdmissionRepository } from '../../repositories/admin/AdmissionRepository';
import { AdminAdmissionController } from '../../../presentation/http/admin/AdmissionController';
import { IAdminAdmissionController } from '../../../presentation/http/IHttp';
import { emailService } from '../../services/email.service';
import { config } from '../../../config/config';

export function getAdminAdmissionsComposer(): IAdminAdmissionController {
    const repository: IAdmissionRepository = new AdmissionRepository();
    const getAdmissionsUseCase = new GetAdmissionsUseCase(repository);
    const getAdmissionByIdUseCase = new GetAdmissionByIdUseCase(repository);
    const getAdmissionByTokenUseCase = new GetAdmissionByTokenUseCase(repository);
    const approveAdmissionUseCase = new ApproveAdmissionUseCase(repository, emailService, config);
    const rejectAdmissionUseCase = new RejectAdmissionUseCase(repository);
    const deleteAdmissionUseCase = new DeleteAdmissionUseCase(repository);
    const confirmAdmissionOfferUseCase = new ConfirmAdmissionOfferUseCase(repository);
    return new AdminAdmissionController(
        getAdmissionsUseCase,
        getAdmissionByIdUseCase,
        getAdmissionByTokenUseCase,
        approveAdmissionUseCase,
        rejectAdmissionUseCase,
        deleteAdmissionUseCase,
        confirmAdmissionOfferUseCase
    );
}