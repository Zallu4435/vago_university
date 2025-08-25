import {
    CreateApplicationRequestDTO, GetApplicationRequestDTO, SaveSectionRequestDTO, ProcessPaymentRequestDTO, ConfirmPaymentRequestDTO, FinalizeAdmissionRequestDTO, UploadDocumentRequestDTO, UploadMultipleDocumentsRequestDTO,
} from "../../../domain/admission/dtos/AdmissionRequestDTOs";
import {
    CreateApplicationResponseDTO, GetApplicationResponseDTO, SaveSectionResponseDTO, ProcessPaymentResponseDTO, ConfirmPaymentResponseDTO, FinalizeAdmissionResponseDTO, UploadDocumentResponseDTO, UploadMultipleDocumentsResponseDTO,
} from "../../../domain/admission/dtos/AdmissionResponseDTOs";
import { IAdmissionsRepository } from "../repositories/IAdmissionsRepository";
import {
    InvalidUserIdException, InvalidSectionException, PaymentProcessingFailedException, PaymentNotFoundException, AdmissionFinalizationFailedException, DocumentUploadFailedException
} from "../../../domain/admission/errors/AdmissionErrors";
import { isValidObjectId } from "mongoose";
import { IAdmissionDraft, IAdmission } from '../../../domain/admission/entities/AdmissionTypes';


export class CreateApplicationUseCase {
    constructor(private _admissionsRepository: IAdmissionsRepository) { }
    async execute(params: CreateApplicationRequestDTO): Promise<CreateApplicationResponseDTO> {
        if (!params.userId || !isValidObjectId(params.userId)) {
            throw new InvalidUserIdException();
        }
        return this._admissionsRepository.createApplication(params);
    }
}
 
export class GetApplicationUseCase {
    constructor(private _admissionsRepository: IAdmissionsRepository) { }
    async execute(params: GetApplicationRequestDTO): Promise<GetApplicationResponseDTO> {
        if (!params.userId || !isValidObjectId(params.userId)) {
            throw new InvalidUserIdException();
        }
        const draft = await this._admissionsRepository.findDraftByRegisterId(params.userId);
        return {
            draft: draft ? mapToIAdmissionDraft(draft) : null,
        };
    }
}

export class SaveSectionUseCase {
    constructor(private _admissionsRepository: IAdmissionsRepository) { }
    async execute(params: SaveSectionRequestDTO): Promise<SaveSectionResponseDTO> {
        const validSections = [
            "personalInfo", "choiceOfStudy", "education", "achievements", "otherInformation", "documents", "declaration"
        ];
        if (!validSections.includes(params.section)) {
            throw new InvalidSectionException();
        }
        const draft = await this._admissionsRepository.findDraftByApplicationId(params.applicationId);
        if (!draft) throw new Error("Application not found");

        const sectionMap: { [key: string]: string } = {
            personalInfo: "personal",
            choiceOfStudy: "choiceOfStudy",
            education: "education",
            achievements: "achievements",
            otherInformation: "otherInformation",
            documents: "documents",
            declaration: "declaration",
        };
        const field = sectionMap[params.section];
        if (!field) throw new InvalidSectionException();

        draft[field] = params.data;
        if (!draft.completedSteps.includes(field)) {
            draft.completedSteps.push(field);
        }
        await this._admissionsRepository.saveDraft(draft);

        return {
            success: true,
            message: "Section saved successfully",
            data: mapToIAdmissionDraft(draft),
        };
    }
}

export class ProcessPaymentUseCase {
    constructor(private _admissionsRepository: IAdmissionsRepository) { }
    async execute(params: ProcessPaymentRequestDTO): Promise<ProcessPaymentResponseDTO> {
        if (!params.applicationId || !params.paymentDetails) {
            throw new PaymentProcessingFailedException();
        }
        return this._admissionsRepository.processPayment(params);
    }
}

export class ConfirmPaymentUseCase {
    constructor(private _admissionsRepository: IAdmissionsRepository) { }
    async execute(params: ConfirmPaymentRequestDTO): Promise<ConfirmPaymentResponseDTO> {
        if (!params.paymentId || !params.stripePaymentIntentId) {
            throw new PaymentProcessingFailedException();
        }
        return this._admissionsRepository.confirmPayment(params);
    }
}

export class FinalizeAdmissionUseCase {
    constructor(private _admissionsRepository: IAdmissionsRepository) { }
    async execute(params: FinalizeAdmissionRequestDTO): Promise<FinalizeAdmissionResponseDTO> {
        if (!params.applicationId || !params.paymentId) {
            throw new AdmissionFinalizationFailedException();
        }
        const result = await this._admissionsRepository.finalizeAdmission(params);
        return {
            admission: mapToIAdmission(result.admission),
        };
    }
}

export class UploadDocumentUseCase {
    constructor(private _admissionsRepository: IAdmissionsRepository) { }
    async execute(params: UploadDocumentRequestDTO): Promise<UploadDocumentResponseDTO> {
        if (!params.applicationId || !params.file) {
            throw new DocumentUploadFailedException();
        }
        return this._admissionsRepository.uploadDocument(params);
    }
}

export class UploadMultipleDocumentsUseCase {
    constructor(private _admissionsRepository: IAdmissionsRepository) { }
    async execute(params: UploadMultipleDocumentsRequestDTO): Promise<UploadMultipleDocumentsResponseDTO> {
        if (!params.applicationId || !params.files) {
            throw new DocumentUploadFailedException();
        }
        return this._admissionsRepository.uploadMultipleDocuments(params);
    }
}

export class GetDocumentByKeyUseCase {
    constructor(private _admissionsRepository: IAdmissionsRepository) { }
    async execute(params: { userId: string; documentKey: string }) {
        return this._admissionsRepository.getDocumentByKey(params);
    }
}


function mapToIAdmissionDraft(draft): IAdmissionDraft {
    return {
        id: draft._id?.toString(),
        applicationId: draft.applicationId,
        registerId: draft.registerId,
        personal: draft.personal,
        choiceOfStudy: draft.choiceOfStudy,
        education: draft.education,
        achievements: draft.achievements,
        otherInformation: draft.otherInformation,
        documents: draft.documents,
        declaration: draft.declaration,
        completedSteps: draft.completedSteps,
        createdAt: draft.createdAt,
        updatedAt: draft.updatedAt,
    };
}

function mapToIAdmission(admission): IAdmission {
    return {
        id: admission._id?.toString(),
        applicationId: admission.applicationId,
        registerId: admission.registerId,
        personal: admission.personal,
        choiceOfStudy: admission.choiceOfStudy,
        education: admission.education,
        achievements: admission.achievements,
        otherInformation: admission.otherInformation,
        documents: admission.documents,
        declaration: admission.declaration,
        completedSteps: admission.completedSteps,
        createdAt: admission.createdAt,
        updatedAt: admission.updatedAt,
        paymentId: admission.paymentId?.toString(),
        status: admission.status,
        rejectedBy: admission.rejectedBy,
        confirmationToken: admission.confirmationToken,
        tokenExpiry: admission.tokenExpiry,
    };
}