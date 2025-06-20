import { IFinancialRepository } from '../../../application/financial/repositories/IFinancialRepository';
import {
  GetStudentFinancialInfoUseCase,
  GetAllPaymentsUseCase,
  GetOnePaymentUseCase,
  MakePaymentUseCase,
  GetFinancialAidApplicationsUseCase,
  GetAllFinancialAidApplicationsUseCase,
  ApplyForFinancialAidUseCase,
  GetAvailableScholarshipsUseCase,
  GetScholarshipApplicationsUseCase,
  GetAllScholarshipApplicationsUseCase,
  ApplyForScholarshipUseCase,
  UploadDocumentUseCase,
  GetPaymentReceiptUseCase,
  UpdateFinancialAidApplicationUseCase,
  UpdateScholarshipApplicationUseCase,
  CreateChargeUseCase,
  GetAllChargesUseCase,
  IGetStudentFinancialInfoUseCase,
  IGetAllPaymentsUseCase,
  IGetOnePaymentUseCase,
  IMakePaymentUseCase,
  IGetFinancialAidApplicationsUseCase,
  IGetAllFinancialAidApplicationsUseCase,
  IApplyForFinancialAidUseCase,
  IGetAvailableScholarshipsUseCase,
  IGetScholarshipApplicationsUseCase,
  IGetAllScholarshipApplicationsUseCase,
  IApplyForScholarshipUseCase,
  IUploadDocumentUseCase,
  IGetPaymentReceiptUseCase,
  IUpdateFinancialAidApplicationUseCase,
  IUpdateScholarshipApplicationUseCase,
  ICreateChargeUseCase,
  IGetAllChargesUseCase,
} from '../../../application/financial/useCases/FinancialUseCases';
import { FinancialRepository } from '../../repositories/financial/FinancialRepository';
import { FinancialController } from '../../../presentation/http/financial/FinancialController';
import { IFinancialController } from '../../../presentation/http/IHttp';

export function getFinancialComposer(): IFinancialController {
  const repository: IFinancialRepository = new FinancialRepository();
  const getStudentFinancialInfoUseCase: IGetStudentFinancialInfoUseCase = new GetStudentFinancialInfoUseCase(repository);
  const getAllPaymentsUseCase: IGetAllPaymentsUseCase = new GetAllPaymentsUseCase(repository);
  const getOnePaymentUseCase: IGetOnePaymentUseCase = new GetOnePaymentUseCase(repository);
  const makePaymentUseCase: IMakePaymentUseCase = new MakePaymentUseCase(repository);
  const getFinancialAidApplicationsUseCase: IGetFinancialAidApplicationsUseCase = new GetFinancialAidApplicationsUseCase(repository);
  const getAllFinancialAidApplicationsUseCase: IGetAllFinancialAidApplicationsUseCase = new GetAllFinancialAidApplicationsUseCase(repository);
  const applyForFinancialAidUseCase: IApplyForFinancialAidUseCase = new ApplyForFinancialAidUseCase(repository);
  const getAvailableScholarshipsUseCase: IGetAvailableScholarshipsUseCase = new GetAvailableScholarshipsUseCase(repository);
  const getScholarshipApplicationsUseCase: IGetScholarshipApplicationsUseCase = new GetScholarshipApplicationsUseCase(repository);
  const getAllScholarshipApplicationsUseCase: IGetAllScholarshipApplicationsUseCase = new GetAllScholarshipApplicationsUseCase(repository);
  const applyForScholarshipUseCase: IApplyForScholarshipUseCase = new ApplyForScholarshipUseCase(repository);
  const uploadDocumentUseCase: IUploadDocumentUseCase = new UploadDocumentUseCase(repository);
  const getPaymentReceiptUseCase: IGetPaymentReceiptUseCase = new GetPaymentReceiptUseCase(repository);
  const updateFinancialAidApplicationUseCase: IUpdateFinancialAidApplicationUseCase = new UpdateFinancialAidApplicationUseCase(repository);
  const updateScholarshipApplicationUseCase: IUpdateScholarshipApplicationUseCase = new UpdateScholarshipApplicationUseCase(repository);
  const createChargeUseCase: ICreateChargeUseCase = new CreateChargeUseCase(repository);
  const getAllChargesUseCase: IGetAllChargesUseCase = new GetAllChargesUseCase(repository);
  return new FinancialController(
    getStudentFinancialInfoUseCase,
    getAllPaymentsUseCase,
    getOnePaymentUseCase,
    makePaymentUseCase,
    getFinancialAidApplicationsUseCase,
    getAllFinancialAidApplicationsUseCase,
    applyForFinancialAidUseCase,
    getAvailableScholarshipsUseCase,
    getScholarshipApplicationsUseCase,
    getAllScholarshipApplicationsUseCase,
    applyForScholarshipUseCase,
    uploadDocumentUseCase,
    getPaymentReceiptUseCase,
    updateFinancialAidApplicationUseCase,
    updateScholarshipApplicationUseCase,
    createChargeUseCase,
    getAllChargesUseCase
  );
} 