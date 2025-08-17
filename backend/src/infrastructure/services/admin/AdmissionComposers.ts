import { IAdmissionRepository } from '../../../application/admin/repositories/IAdmissionRepository';
import {
    GetAdmissionsUseCase,
    GetAdmissionByIdUseCase,
    GetAdmissionByTokenUseCase,
    ApproveAdmissionUseCase,
    RejectAdmissionUseCase,
    DeleteAdmissionUseCase,
    ConfirmAdmissionOfferUseCase,
    BlockAdmissionUseCase,
    IGetAdmissionsUseCase,
    IGetAdmissionByIdUseCase,
    IGetAdmissionByTokenUseCase,
    IApproveAdmissionUseCase,
    IRejectAdmissionUseCase,
    IDeleteAdmissionUseCase,
    IConfirmAdmissionOfferUseCase,
    IBlockAdmissionUseCase
} from '../../../application/admin/useCases/AdmissionUseCases';
import { AdmissionRepository } from '../../repositories/admin/AdmissionRepository';
import { AdminAdmissionController } from '../../../presentation/http/admin/AdmissionController';
import { IAdminAdmissionController } from '../../../presentation/http/IHttp';
import { emailService } from '../../services/email.service';
import { config } from '../../../config/config';

export function getAdminAdmissionsComposer(): IAdminAdmissionController {
    const repository: IAdmissionRepository = new AdmissionRepository();

    const getAdmissionsUseCase: IGetAdmissionsUseCase = new GetAdmissionsUseCase(repository);
    const getAdmissionByIdUseCase: IGetAdmissionByIdUseCase = new GetAdmissionByIdUseCase(repository);
    const getAdmissionByTokenUseCase: IGetAdmissionByTokenUseCase = new GetAdmissionByTokenUseCase(repository);
    const approveAdmissionUseCase: IApproveAdmissionUseCase = new ApproveAdmissionUseCase(repository, emailService, config);
    const rejectAdmissionUseCase: IRejectAdmissionUseCase = new RejectAdmissionUseCase(repository);
    const deleteAdmissionUseCase: IDeleteAdmissionUseCase = new DeleteAdmissionUseCase(repository);
    const confirmAdmissionOfferUseCase: IConfirmAdmissionOfferUseCase = new ConfirmAdmissionOfferUseCase(repository);
    const blockAdmissionUseCase: IBlockAdmissionUseCase = new BlockAdmissionUseCase(repository);

    return new AdminAdmissionController(
        getAdmissionsUseCase,
        getAdmissionByIdUseCase,
        getAdmissionByTokenUseCase,
        approveAdmissionUseCase,
        rejectAdmissionUseCase,
        deleteAdmissionUseCase,
        confirmAdmissionOfferUseCase,
        blockAdmissionUseCase
    );
}
