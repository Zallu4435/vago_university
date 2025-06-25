import mongoose from "mongoose";
import { AdmissionErrorType } from "../../../domain/admission/enums/AdmissionErrorType";
import {
    CreateApplicationRequestDTO,
    GetApplicationRequestDTO,
    SaveSectionRequestDTO,
    ProcessPaymentRequestDTO,
    ConfirmPaymentRequestDTO,
    FinalizeAdmissionRequestDTO,
    UploadDocumentRequestDTO,
    UploadMultipleDocumentsRequestDTO,
} from "../../../domain/admission/dtos/AdmissionRequestDTOs";
import {
    CreateApplicationResponseDTO,
    GetApplicationResponseDTO,
    SaveSectionResponseDTO,
    ProcessPaymentResponseDTO,
    ConfirmPaymentResponseDTO,
    FinalizeAdmissionResponseDTO,
    UploadDocumentResponseDTO,
    UploadMultipleDocumentsResponseDTO,
} from "../../../domain/admission/dtos/AdmissionResponseDTOs";

import { IAdmissionsRepository } from "../repositories/IAdmissionsRepository";

interface ResponseDTO<T> {
    data: T | { error: string };
    success: boolean;
}

export interface ICreateApplicationUseCase {
    execute(params: CreateApplicationRequestDTO): Promise<ResponseDTO<CreateApplicationResponseDTO>>;
}

export interface IGetApplicationUseCase {
    execute(params: GetApplicationRequestDTO): Promise<ResponseDTO<GetApplicationResponseDTO>>;
}

export interface ISaveSectionUseCase {
    execute(params: SaveSectionRequestDTO): Promise<ResponseDTO<SaveSectionResponseDTO>>;
}

export interface IProcessPaymentUseCase {
    execute(params: ProcessPaymentRequestDTO): Promise<ResponseDTO<ProcessPaymentResponseDTO>>;
}

export interface IConfirmPaymentUseCase {
    execute(params: ConfirmPaymentRequestDTO): Promise<ResponseDTO<ConfirmPaymentResponseDTO>>;
}

export interface IUploadDocumentUseCase {
    execute(params: UploadDocumentRequestDTO): Promise<ResponseDTO<UploadDocumentResponseDTO>>;
}

export interface IUploadMultipleDocumentsUseCase {
    execute(params: UploadMultipleDocumentsRequestDTO): Promise<ResponseDTO<UploadMultipleDocumentsResponseDTO>>;
}

export interface IFinalizeAdmissionUseCase {
    execute(params: FinalizeAdmissionRequestDTO): Promise<ResponseDTO<FinalizeAdmissionResponseDTO>>;
}

export class CreateApplicationUseCase implements ICreateApplicationUseCase {
    constructor(private admissionsRepository: IAdmissionsRepository) { }

    async execute(params: CreateApplicationRequestDTO): Promise<ResponseDTO<CreateApplicationResponseDTO>> {
        try {
            if (!mongoose.Types.ObjectId.isValid(params.userId)) {
                return { data: { error: AdmissionErrorType.InvalidRegisterId }, success: false };
            }
            const result = await this.admissionsRepository.createApplication(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("CreateApplicationUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.ApplicationNotFound }, success: false };
        }
    }
}

export class GetApplicationUseCase implements IGetApplicationUseCase {
    constructor(private admissionsRepository: IAdmissionsRepository) { }

    async execute(params: GetApplicationRequestDTO): Promise<ResponseDTO<GetApplicationResponseDTO>> {
        try {
            if (!mongoose.Types.ObjectId.isValid(params.userId)) {
                return { data: { error: AdmissionErrorType.InvalidRegisterId }, success: false };
            }
            const result = await this.admissionsRepository.getApplication(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetApplicationUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.ApplicationNotFound }, success: false };
        }
    }
}

export class SaveSectionUseCase implements ISaveSectionUseCase {
    constructor(private admissionsRepository: IAdmissionsRepository) { }

    async execute(params: SaveSectionRequestDTO): Promise<ResponseDTO<SaveSectionResponseDTO>> {
        try {
            const validSections = [
                "personalInfo",
                "choiceOfStudy",
                "education",
                "achievements",
                "otherInformation",
                "documents",
                "declaration",
            ];
            if (!validSections.includes(params.section)) {
                return { data: { error: AdmissionErrorType.InvalidSection }, success: false };
            }
            const result = await this.admissionsRepository.saveSection(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("SaveSectionUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.ApplicationNotFound }, success: false };
        }
    }
}

export class ProcessPaymentUseCase implements IProcessPaymentUseCase {
    constructor(private admissionsRepository: IAdmissionsRepository) { }

    async execute(params: ProcessPaymentRequestDTO): Promise<ResponseDTO<ProcessPaymentResponseDTO>> {
        try {
            if (!params.applicationId || !params.paymentDetails) {
                return { data: { error: AdmissionErrorType.PaymentProcessingFailed }, success: false };
            }
            const result = await this.admissionsRepository.processPayment(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("ProcessPaymentUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.PaymentProcessingFailed }, success: false };
        }
    }
}

export class ConfirmPaymentUseCase implements IConfirmPaymentUseCase {
    constructor(private admissionsRepository: IAdmissionsRepository) { }

    async execute(params: ConfirmPaymentRequestDTO): Promise<ResponseDTO<ConfirmPaymentResponseDTO>> {
        try {
            
            if (!params.paymentId || !params.stripePaymentIntentId) {
                return { data: { error: AdmissionErrorType.PaymentProcessingFailed }, success: false };
            }
            
            const result = await this.admissionsRepository.confirmPayment(params);
            
            return { data: result, success: true };
        } catch (error: any) {
            return { data: { error: error.message || AdmissionErrorType.PaymentProcessingFailed }, success: false };
        }
    }
}

export class FinalizeAdmissionUseCase implements IFinalizeAdmissionUseCase {
    constructor(private admissionsRepository: IAdmissionsRepository) { }

    async execute(params: FinalizeAdmissionRequestDTO): Promise<ResponseDTO<FinalizeAdmissionResponseDTO>> {
        try {
            if (!params.applicationId || !params.paymentId) {
                return { data: { error: AdmissionErrorType.InvalidApplicationId }, success: false };
            }
            const result = await this.admissionsRepository.finalizeAdmission(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("FinalizeAdmissionUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.ApplicationNotFound }, success: false };
        }
    }
}

export class UploadDocumentUseCase implements IUploadDocumentUseCase {
    constructor(private admissionsRepository: IAdmissionsRepository) { }

    async execute(params: UploadDocumentRequestDTO): Promise<ResponseDTO<UploadDocumentResponseDTO>> {
        try {
            if (!params.applicationId || !params.file) {
                return { data: { error: 'Document upload failed' }, success: false };
            }
            const result = await this.admissionsRepository.uploadDocument(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("UploadDocumentUseCase: Error:", error);
            return { data: { error: error.message || 'Document upload failed' }, success: false };
        }
    }
}

export class UploadMultipleDocumentsUseCase implements IUploadMultipleDocumentsUseCase {
    constructor(private admissionsRepository: IAdmissionsRepository) { }

    async execute(params: UploadMultipleDocumentsRequestDTO): Promise<ResponseDTO<UploadMultipleDocumentsResponseDTO>> {
        try {
            if (!params.applicationId || !params.files) {
                return { data: { error: 'Documents upload failed' }, success: false };
            }
            const result = await this.admissionsRepository.uploadMultipleDocuments(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("UploadMultipleDocumentsUseCase: Error:", error);
            return { data: { error: error.message || 'Documents upload failed' }, success: false };
        }
    }
}