import mongoose from "mongoose";
import { FinancialErrorType } from "../../../domain/financial/enums/FinancialErrorType";
import {
    GetStudentFinancialInfoRequestDTO,
    GetAllPaymentsRequestDTO,
    GetOnePaymentRequestDTO,
    MakePaymentRequestDTO,
    GetFinancialAidApplicationsRequestDTO,
    GetAllFinancialAidApplicationsRequestDTO,
    ApplyForFinancialAidRequestDTO,
    GetAvailableScholarshipsRequestDTO,
    GetScholarshipApplicationsRequestDTO,
    GetAllScholarshipApplicationsRequestDTO,
    ApplyForScholarshipRequestDTO,
    UploadDocumentRequestDTO,
    GetPaymentReceiptRequestDTO,
    UpdateFinancialAidApplicationRequestDTO,
    UpdateScholarshipApplicationRequestDTO,
    CreateChargeRequestDTO,
    GetAllChargesRequestDTO,
} from "../../../domain/financial/dtos/FinancialRequestDTOs";
import {
    GetStudentFinancialInfoResponseDTO,
    GetAllPaymentsResponseDTO,
    GetOnePaymentResponseDTO,
    MakePaymentResponseDTO,
    GetFinancialAidApplicationsResponseDTO,
    GetAllFinancialAidApplicationsResponseDTO,
    ApplyForFinancialAidResponseDTO,
    GetAvailableScholarshipsResponseDTO,
    GetScholarshipApplicationsResponseDTO,
    GetAllScholarshipApplicationsResponseDTO,
    ApplyForScholarshipResponseDTO,
    UploadDocumentResponseDTO,
    GetPaymentReceiptResponseDTO,
    UpdateFinancialAidApplicationResponseDTO,
    UpdateScholarshipApplicationResponseDTO,
    CreateChargeResponseDTO,
    GetAllChargesResponseDTO,
} from "../../../domain/financial/dtos/FinancialResponseDTOs";
import { IFinancialRepository } from "../repositories/IFinancialRepository";

interface ResponseDTO<T> {
    data: T | { error: string };
    success: boolean;
}

export interface IGetStudentFinancialInfoUseCase {
    execute(params: GetStudentFinancialInfoRequestDTO): Promise<ResponseDTO<GetStudentFinancialInfoResponseDTO>>;
}

export interface IGetAllPaymentsUseCase {
    execute(params: GetAllPaymentsRequestDTO): Promise<ResponseDTO<GetAllPaymentsResponseDTO>>;
}

export interface IGetOnePaymentUseCase {
    execute(params: GetOnePaymentRequestDTO): Promise<ResponseDTO<GetOnePaymentResponseDTO>>;
}

export interface IMakePaymentUseCase {
    execute(params: MakePaymentRequestDTO): Promise<ResponseDTO<MakePaymentResponseDTO>>;
}

export interface IGetFinancialAidApplicationsUseCase {
    execute(params: GetFinancialAidApplicationsRequestDTO): Promise<ResponseDTO<GetFinancialAidApplicationsResponseDTO>>;
}

export interface IGetAllFinancialAidApplicationsUseCase {
    execute(params: GetAllFinancialAidApplicationsRequestDTO): Promise<ResponseDTO<GetAllFinancialAidApplicationsResponseDTO>>;
}

export interface IApplyForFinancialAidUseCase {
    execute(params: ApplyForFinancialAidRequestDTO): Promise<ResponseDTO<ApplyForFinancialAidResponseDTO>>;
}

export interface IGetAvailableScholarshipsUseCase {
    execute(params: GetAvailableScholarshipsRequestDTO): Promise<ResponseDTO<GetAvailableScholarshipsResponseDTO>>;
}

export interface IGetScholarshipApplicationsUseCase {
    execute(params: GetScholarshipApplicationsRequestDTO): Promise<ResponseDTO<GetScholarshipApplicationsResponseDTO>>;
}

export interface IGetAllScholarshipApplicationsUseCase {
    execute(params: GetAllScholarshipApplicationsRequestDTO): Promise<ResponseDTO<GetAllScholarshipApplicationsResponseDTO>>;
}

export interface IApplyForScholarshipUseCase {
    execute(params: ApplyForScholarshipRequestDTO): Promise<ResponseDTO<ApplyForScholarshipResponseDTO>>;
}

export interface IUploadDocumentUseCase {
    execute(params: UploadDocumentRequestDTO): Promise<ResponseDTO<UploadDocumentResponseDTO>>;
}

export interface IGetPaymentReceiptUseCase {
    execute(params: GetPaymentReceiptRequestDTO): Promise<ResponseDTO<GetPaymentReceiptResponseDTO>>;
}

export interface IUpdateFinancialAidApplicationUseCase {
    execute(params: UpdateFinancialAidApplicationRequestDTO): Promise<ResponseDTO<UpdateFinancialAidApplicationResponseDTO>>;
}

export interface IUpdateScholarshipApplicationUseCase {
    execute(params: UpdateScholarshipApplicationRequestDTO): Promise<ResponseDTO<UpdateScholarshipApplicationResponseDTO>>;
}

export interface ICreateChargeUseCase {
    execute(params: CreateChargeRequestDTO): Promise<ResponseDTO<CreateChargeResponseDTO>>;
}

export interface IGetAllChargesUseCase {
    execute(params: GetAllChargesRequestDTO): Promise<ResponseDTO<GetAllChargesResponseDTO>>;
}

export class GetStudentFinancialInfoUseCase implements IGetStudentFinancialInfoUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetStudentFinancialInfoRequestDTO): Promise<ResponseDTO<GetStudentFinancialInfoResponseDTO>> {
        try {
            console.log(`Executing getStudentFinancialInfo use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.studentId)) {
                return { data: { error: FinancialErrorType.InvalidStudentId }, success: false };
            }
            const result = await this.financialRepository.getStudentFinancialInfo(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetStudentFinancialInfoUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.MissingRequiredFields }, success: false };
        }
    }
}

export class GetAllPaymentsUseCase implements IGetAllPaymentsUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetAllPaymentsRequestDTO): Promise<ResponseDTO<GetAllPaymentsResponseDTO>> {
        try {
            console.log(`Executing getAllPayments use case with params:`, params);
            const result = await this.financialRepository.getAllPayments(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetAllPaymentsUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.PaymentNotFound }, success: false };
        }
    }
}

export class GetOnePaymentUseCase implements IGetOnePaymentUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetOnePaymentRequestDTO): Promise<ResponseDTO<GetOnePaymentResponseDTO>> {
        try {
            console.log(`Executing getOnePayment use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.paymentId)) {
                return { data: { error: FinancialErrorType.InvalidPaymentId }, success: false };
            }
            const result = await this.financialRepository.getOnePayment(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetOnePaymentUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.PaymentNotFound }, success: false };
        }
    }
}

export class MakePaymentUseCase implements IMakePaymentUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: MakePaymentRequestDTO): Promise<ResponseDTO<MakePaymentResponseDTO>> {
        try {
            console.log(`Executing makePayment use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.studentId)) {
                return { data: { error: FinancialErrorType.InvalidStudentId }, success: false };
            }
            if (params.amount <= 0) {
                return { data: { error: FinancialErrorType.InvalidAmount }, success: false };
            }
            const result = await this.financialRepository.makePayment(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("MakePaymentUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.MissingRequiredFields }, success: false };
        }
    }
}

export class GetFinancialAidApplicationsUseCase implements IGetFinancialAidApplicationsUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetFinancialAidApplicationsRequestDTO): Promise<ResponseDTO<GetFinancialAidApplicationsResponseDTO>> {
        try {
            console.log(`Executing getFinancialAidApplications use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.studentId)) {
                return { data: { error: FinancialErrorType.InvalidStudentId }, success: false };
            }
            const result = await this.financialRepository.getFinancialAidApplications(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetFinancialAidApplicationsUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.ApplicationNotFound }, success: false };
        }
    }
}

export class GetAllFinancialAidApplicationsUseCase implements IGetAllFinancialAidApplicationsUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetAllFinancialAidApplicationsRequestDTO): Promise<ResponseDTO<GetAllFinancialAidApplicationsResponseDTO>> {
        try {
            console.log(`Executing getAllFinancialAidApplications use case with params:`, params);
            const result = await this.financialRepository.getAllFinancialAidApplications(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetAllFinancialAidApplicationsUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.ApplicationNotFound }, success: false };
        }
    }
}

export class ApplyForFinancialAidUseCase implements IApplyForFinancialAidUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: ApplyForFinancialAidRequestDTO): Promise<ResponseDTO<ApplyForFinancialAidResponseDTO>> {
        try {
            console.log(`Executing applyForFinancialAid use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.studentId)) {
                return { data: { error: FinancialErrorType.InvalidStudentId }, success: false };
            }
            if (params.amount <= 0) {
                return { data: { error: FinancialErrorType.InvalidAmount }, success: false };
            }
            if (!params.documents.length) {
                return { data: { error: FinancialErrorType.MissingDocuments }, success: false };
            }
            const result = await this.financialRepository.applyForFinancialAid(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("ApplyForFinancialAidUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.MissingRequiredFields }, success: false };
        }
    }
}

export class GetAvailableScholarshipsUseCase implements IGetAvailableScholarshipsUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetAvailableScholarshipsRequestDTO): Promise<ResponseDTO<GetAvailableScholarshipsResponseDTO>> {
        try {
            console.log(`Executing getAvailableScholarships use case with params:`, params);
            const result = await this.financialRepository.getAvailableScholarships(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetAvailableScholarshipsUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.ScholarshipNotFound }, success: false };
        }
    }
}

export class GetScholarshipApplicationsUseCase implements IGetScholarshipApplicationsUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetScholarshipApplicationsRequestDTO): Promise<ResponseDTO<GetScholarshipApplicationsResponseDTO>> {
        try {
            console.log(`Executing getScholarshipApplications use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.studentId)) {
                return { data: { error: FinancialErrorType.InvalidStudentId }, success: false };
            }
            const result = await this.financialRepository.getScholarshipApplications(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetScholarshipApplicationsUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.ApplicationNotFound }, success: false };
        }
    }
}

export class GetAllScholarshipApplicationsUseCase implements IGetAllScholarshipApplicationsUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetAllScholarshipApplicationsRequestDTO): Promise<ResponseDTO<GetAllScholarshipApplicationsResponseDTO>> {
        try {
            console.log(`Executing getAllScholarshipApplications use case with params:`, params);
            const result = await this.financialRepository.getAllScholarshipApplications(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetAllScholarshipApplicationsUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.ApplicationNotFound }, success: false };
        }
    }
}

export class ApplyForScholarshipUseCase implements IApplyForScholarshipUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: ApplyForScholarshipRequestDTO): Promise<ResponseDTO<ApplyForScholarshipResponseDTO>> {
        try {
            console.log(`Executing applyForScholarship use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.studentId) || !mongoose.Types.ObjectId.isValid(params.scholarshipId)) {
                return { data: { error: FinancialErrorType.InvalidId }, success: false };
            }
            if (!params.documents.length) {
                return { data: { error: FinancialErrorType.MissingDocuments }, success: false };
            }
            const result = await this.financialRepository.applyForScholarship(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("ApplyForScholarshipUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.MissingRequiredFields }, success: false };
        }
    }
}

export class UploadDocumentUseCase implements IUploadDocumentUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: UploadDocumentRequestDTO): Promise<ResponseDTO<UploadDocumentResponseDTO>> {
        try {
            console.log(`Executing uploadDocument use case with params:`, params);
            if (!params.file) {
                return { data: { error: FinancialErrorType.FileRequired }, success: false };
            }
            const result = await this.financialRepository.uploadDocument(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("UploadDocumentUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.FileRequired }, success: false };
        }
    }
}

export class GetPaymentReceiptUseCase implements IGetPaymentReceiptUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetPaymentReceiptRequestDTO): Promise<ResponseDTO<GetPaymentReceiptResponseDTO>> {
        try {
            console.log(`Executing getPaymentReceipt use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.studentId) || !mongoose.Types.ObjectId.isValid(params.paymentId)) {
                return { data: { error: FinancialErrorType.InvalidId }, success: false };
            }
            const result = await this.financialRepository.getPaymentReceipt(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetPaymentReceiptUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.ReceiptNotFound }, success: false };
        }
    }
}

export class UpdateFinancialAidApplicationUseCase implements IUpdateFinancialAidApplicationUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: UpdateFinancialAidApplicationRequestDTO): Promise<ResponseDTO<UpdateFinancialAidApplicationResponseDTO>> {
        try {
            console.log(`Executing updateFinancialAidApplication use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.studentId) || !mongoose.Types.ObjectId.isValid(params.applicationId)) {
                return { data: { error: FinancialErrorType.InvalidId }, success: false };
            }
            if (params.amount !== undefined && params.amount <= 0) {
                return { data: { error: FinancialErrorType.InvalidAmount }, success: false };
            }
            const result = await this.financialRepository.updateFinancialAidApplication(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("UpdateFinancialAidApplicationUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.ApplicationNotFound }, success: false };
        }
    }
}

export class UpdateScholarshipApplicationUseCase implements IUpdateScholarshipApplicationUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: UpdateScholarshipApplicationRequestDTO): Promise<ResponseDTO<UpdateScholarshipApplicationResponseDTO>> {
        try {
            console.log(`Executing updateScholarshipApplication use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.studentId) || !mongoose.Types.ObjectId.isValid(params.applicationId)) {
                return { data: { error: FinancialErrorType.InvalidId }, success: false };
            }
            const result = await this.financialRepository.updateScholarshipApplication(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("UpdateScholarshipApplicationUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.ApplicationNotFound }, success: false };
        }
    }
}

export class CreateChargeUseCase implements ICreateChargeUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: CreateChargeRequestDTO): Promise<ResponseDTO<CreateChargeResponseDTO>> {
        try {
            console.log(`Executing createCharge use case with params:`, params);
            if (params.amount <= 0) {
                return { data: { error: FinancialErrorType.InvalidAmount }, success: false };
            }
            if (!params.title || !params.description || !params.term || !params.applicableFor) {
                return { data: { error: FinancialErrorType.MissingRequiredFields }, success: false };
            }
            const result = await this.financialRepository.createCharge(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("CreateChargeUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.MissingRequiredFields }, success: false };
        }
    }
}

export class GetAllChargesUseCase implements IGetAllChargesUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetAllChargesRequestDTO): Promise<ResponseDTO<GetAllChargesResponseDTO>> {
        try {
            console.log(`Executing getAllCharges use case with params:`, params);
            const result = await this.financialRepository.getAllCharges(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetAllChargesUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.MissingRequiredFields }, success: false };
        }
    }
}