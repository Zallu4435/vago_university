import { IFinancialRepository } from '../../../application/financial/repositories/IFinancialRepository';
import {
  GetStudentFinancialInfoUseCase,
  GetAllPaymentsUseCase,
  GetOnePaymentUseCase,
  MakePaymentUseCase,
  UploadDocumentUseCase,
  GetPaymentReceiptUseCase,
  CreateChargeUseCase,
  GetAllChargesUseCase,
  UpdateChargeUseCase,
  DeleteChargeUseCase,
  IGetStudentFinancialInfoUseCase,
  IGetAllPaymentsUseCase,
  IGetOnePaymentUseCase,
  IMakePaymentUseCase,
  IUploadDocumentUseCase,
  IGetPaymentReceiptUseCase,
  ICreateChargeUseCase,
  IGetAllChargesUseCase,
  IUpdateChargeUseCase,
  IDeleteChargeUseCase,
  CheckPendingPaymentUseCase,
  ICheckPendingPaymentUseCase,
  ClearPendingPaymentUseCase,
  IClearPendingPaymentUseCase,
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
  const uploadDocumentUseCase: IUploadDocumentUseCase = new UploadDocumentUseCase(repository);
  const getPaymentReceiptUseCase: IGetPaymentReceiptUseCase = new GetPaymentReceiptUseCase(repository);
  const createChargeUseCase: ICreateChargeUseCase = new CreateChargeUseCase(repository);
  const getAllChargesUseCase: IGetAllChargesUseCase = new GetAllChargesUseCase(repository);
  const updateChargeUseCase: IUpdateChargeUseCase = new UpdateChargeUseCase(repository);
  const deleteChargeUseCase: IDeleteChargeUseCase = new DeleteChargeUseCase(repository);
  const checkPendingPaymentUseCase: ICheckPendingPaymentUseCase = new CheckPendingPaymentUseCase(repository);
  const clearPendingPaymentUseCase: IClearPendingPaymentUseCase = new ClearPendingPaymentUseCase(repository);

  return new FinancialController(
    getStudentFinancialInfoUseCase,
    getAllPaymentsUseCase,
    getOnePaymentUseCase,
    makePaymentUseCase,
    uploadDocumentUseCase,
    getPaymentReceiptUseCase,
    createChargeUseCase,
    getAllChargesUseCase,
    updateChargeUseCase,
    deleteChargeUseCase,
    checkPendingPaymentUseCase,
    clearPendingPaymentUseCase
  );
} 