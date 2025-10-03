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
  BlockFacultyUseCase,
} from '../../../application/faculty/useCases/FacultyUseCases';
import {
  IGetFacultyUseCase,
  IGetFacultyByIdUseCase,
  IGetFacultyByTokenUseCase,
  IApproveFacultyUseCase,
  IRejectFacultyUseCase,
  IDeleteFacultyUseCase,
  IConfirmFacultyOfferUseCase,
  IDownloadCertificateUseCase,
  IBlockFacultyUseCase,
} from '../../../application/faculty/useCases/IFacultyUseCases';
import { FacultyRepository } from '../../repositories/faculty/FacultyRepository';
import { FacultyController } from '../../../presentation/http/faculty/FacultyController';
import { IFacultyController } from '../../../presentation/http/IHttp';

export function getFacultyComposer(): IFacultyController {
  const repository: IFacultyRepository = new FacultyRepository();
  const getFacultyUseCase: IGetFacultyUseCase = new GetFacultyUseCase(repository);
  const getFacultyByIdUseCase: IGetFacultyByIdUseCase = new GetFacultyByIdUseCase(repository);
  const getFacultyByTokenUseCase: IGetFacultyByTokenUseCase = new GetFacultyByTokenUseCase(repository);
  const approveFacultyUseCase: IApproveFacultyUseCase = new ApproveFacultyUseCase(repository);
  const rejectFacultyUseCase: IRejectFacultyUseCase = new RejectFacultyUseCase(repository);
  const deleteFacultyUseCase: IDeleteFacultyUseCase = new DeleteFacultyUseCase(repository);
  const confirmFacultyOfferUseCase: IConfirmFacultyOfferUseCase = new ConfirmFacultyOfferUseCase(repository);
  const downloadCertificateUseCase: IDownloadCertificateUseCase = new DownloadCertificateUseCase(repository);
  const blockFacultyUseCase: IBlockFacultyUseCase = new BlockFacultyUseCase(repository);
  return new FacultyController(
    getFacultyUseCase,
    getFacultyByIdUseCase,
    getFacultyByTokenUseCase,
    approveFacultyUseCase,
    rejectFacultyUseCase,
    deleteFacultyUseCase,
    confirmFacultyOfferUseCase,
    downloadCertificateUseCase,
    blockFacultyUseCase
  );
}