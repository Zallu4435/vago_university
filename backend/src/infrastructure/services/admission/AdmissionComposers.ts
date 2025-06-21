import { IAdmissionsRepository } from "../../../application/admission/repositories/IAdmissionsRepository";
import { CreateApplicationUseCase, GetApplicationUseCase, SaveSectionUseCase, ProcessPaymentUseCase, ConfirmPaymentUseCase, FinalizeAdmissionUseCase, UploadDocumentUseCase, UploadMultipleDocumentsUseCase } from "../../../application/admission/useCases/AdmissionUseCases";
import { AdmissionsRepository } from "../../repositories/admission/AdmissionsRepository";
import { AdmissionController } from "../../../presentation/http/admission/AdmissionController";
import { IAdmissionController } from "../../../presentation/http/IHttp";

export function getAdmissionsComposer(): IAdmissionController {
  const repository: IAdmissionsRepository = new AdmissionsRepository();
  const createApplicationUseCase = new CreateApplicationUseCase(repository);
  const getApplicationUseCase = new GetApplicationUseCase(repository);
  const saveSectionUseCase = new SaveSectionUseCase(repository);
  const processPaymentUseCase = new ProcessPaymentUseCase(repository);
  const confirmPaymentUseCase = new ConfirmPaymentUseCase(repository);
  const finalizeAdmissionUseCase = new FinalizeAdmissionUseCase(repository);
  const uploadDocumentUseCase = new UploadDocumentUseCase(repository);
  const uploadMultipleDocumentsUseCase = new UploadMultipleDocumentsUseCase(repository);
  return new AdmissionController(
    createApplicationUseCase,
    getApplicationUseCase,
    saveSectionUseCase,
    processPaymentUseCase,
    confirmPaymentUseCase,
    finalizeAdmissionUseCase,
    uploadDocumentUseCase,
    uploadMultipleDocumentsUseCase,
  );
}