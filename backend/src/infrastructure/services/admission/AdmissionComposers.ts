import { IAdmissionsRepository } from "../../../application/admission/repositories/IAdmissionsRepository";
import { CreateApplicationUseCase, GetApplicationUseCase, SaveSectionUseCase, ProcessPaymentUseCase, ConfirmPaymentUseCase, FinalizeAdmissionUseCase, UploadDocumentUseCase, UploadMultipleDocumentsUseCase, GetDocumentByKeyUseCase } from "../../../application/admission/useCases/AdmissionUseCases";
import { ICreateApplicationUseCase, IGetApplicationUseCase, ISaveSectionUseCase, IProcessPaymentUseCase, IConfirmPaymentUseCase, IFinalizeAdmissionUseCase, IUploadDocumentUseCase, IUploadMultipleDocumentsUseCase, IGetDocumentByKeyUseCase } from "../../../application/admission/useCases/IAdmissionUseCases";
import { AdmissionsRepository } from "../../repositories/admission/AdmissionsRepository";
import { AdmissionController } from "../../../presentation/http/admission/AdmissionController";
import { IAdmissionController } from "../../../presentation/http/IHttp";

export function getAdmissionsComposer(): IAdmissionController {
  const repository: IAdmissionsRepository = new AdmissionsRepository();
  const createApplicationUseCase: ICreateApplicationUseCase = new CreateApplicationUseCase(repository);
  const getApplicationUseCase: IGetApplicationUseCase = new GetApplicationUseCase(repository);
  const saveSectionUseCase: ISaveSectionUseCase = new SaveSectionUseCase(repository);
  const processPaymentUseCase: IProcessPaymentUseCase = new ProcessPaymentUseCase(repository);
  const confirmPaymentUseCase: IConfirmPaymentUseCase = new ConfirmPaymentUseCase(repository);
  const finalizeAdmissionUseCase: IFinalizeAdmissionUseCase = new FinalizeAdmissionUseCase(repository);
  const uploadDocumentUseCase: IUploadDocumentUseCase = new UploadDocumentUseCase(repository);
  const uploadMultipleDocumentsUseCase: IUploadMultipleDocumentsUseCase = new UploadMultipleDocumentsUseCase(repository);
  const getDocumentByKeyUseCase: IGetDocumentByKeyUseCase = new GetDocumentByKeyUseCase(repository);
  return new AdmissionController(
    createApplicationUseCase,
    getApplicationUseCase,
    saveSectionUseCase,
    processPaymentUseCase,
    confirmPaymentUseCase,
    finalizeAdmissionUseCase,
    uploadDocumentUseCase,
    uploadMultipleDocumentsUseCase,
    getDocumentByKeyUseCase,
  );
}