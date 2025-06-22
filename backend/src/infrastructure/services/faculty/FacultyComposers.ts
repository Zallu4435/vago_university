import { IFacultyRepository } from '../../../application/faculty/repositories/IFacultyRepository';
import {
  GetFacultyUseCase,
  GetFacultyByIdUseCase,
  GetFacultyByTokenUseCase,
  ApproveFacultyUseCase,
  RejectFacultyUseCase,
  DeleteFacultyUseCase,
  ConfirmFacultyOfferUseCase,
  DownloadCertificateUseCase,
} from '../../../application/faculty/useCases/FacultyUseCases';
import { FacultyRepository } from '../../repositories/faculty/FacultyRepository';
import { FacultyController } from '../../../presentation/http/faculty/FacultyController';
import { IFacultyController } from '../../../presentation/http/IHttp';

export function getFacultyComposer(): IFacultyController {
  const repository: IFacultyRepository = new FacultyRepository();
  const getFacultyUseCase = new GetFacultyUseCase(repository);
  const getFacultyByIdUseCase = new GetFacultyByIdUseCase(repository);
  const getFacultyByTokenUseCase = new GetFacultyByTokenUseCase(repository);
  const approveFacultyUseCase = new ApproveFacultyUseCase(repository);
  const rejectFacultyUseCase = new RejectFacultyUseCase(repository);
  const deleteFacultyUseCase = new DeleteFacultyUseCase(repository);
  const confirmFacultyOfferUseCase = new ConfirmFacultyOfferUseCase(repository);
  const downloadCertificateUseCase = new DownloadCertificateUseCase(repository);
  return new FacultyController(
    getFacultyUseCase,
    getFacultyByIdUseCase,
    getFacultyByTokenUseCase,
    approveFacultyUseCase,
    rejectFacultyUseCase,
    deleteFacultyUseCase,
    confirmFacultyOfferUseCase,
    downloadCertificateUseCase
  );
}