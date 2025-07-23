import mongoose from "mongoose";
import { FinancialErrorType } from "../../../domain/financial/enums/FinancialErrorType";
import {
    GetStudentFinancialInfoRequestDTO,
    GetAllPaymentsRequestDTO,
    GetOnePaymentRequestDTO,
    MakePaymentRequestDTO,
    UploadDocumentRequestDTO,
    GetPaymentReceiptRequestDTO,
    CreateChargeRequestDTO,
    GetAllChargesRequestDTO,
    UpdateChargeRequestDTO,
    DeleteChargeRequestDTO,
} from "../../../domain/financial/dtos/FinancialRequestDTOs";
import {
    GetStudentFinancialInfoResponseDTO,
    GetAllPaymentsResponseDTO,
    GetOnePaymentResponseDTO,
    MakePaymentResponseDTO,
    UploadDocumentResponseDTO,
    GetPaymentReceiptResponseDTO,
    CreateChargeResponseDTO,
    GetAllChargesResponseDTO,
    UpdateChargeResponseDTO,
    DeleteChargeResponseDTO,
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

export interface IUploadDocumentUseCase {
    execute(params: UploadDocumentRequestDTO): Promise<ResponseDTO<UploadDocumentResponseDTO>>;
}

export interface IGetPaymentReceiptUseCase {
    execute(params: GetPaymentReceiptRequestDTO): Promise<ResponseDTO<GetPaymentReceiptResponseDTO>>;
}

export interface ICreateChargeUseCase {
    execute(params: CreateChargeRequestDTO): Promise<ResponseDTO<CreateChargeResponseDTO>>;
}

export interface IGetAllChargesUseCase {
    execute(params: GetAllChargesRequestDTO): Promise<ResponseDTO<GetAllChargesResponseDTO>>;
}

export interface IUpdateChargeUseCase {
    execute(params: UpdateChargeRequestDTO): Promise<ResponseDTO<UpdateChargeResponseDTO>>;
}

export interface IDeleteChargeUseCase {
    execute(params: DeleteChargeRequestDTO): Promise<ResponseDTO<DeleteChargeResponseDTO>>;
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

export class UpdateChargeUseCase implements IUpdateChargeUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: UpdateChargeRequestDTO): Promise<ResponseDTO<UpdateChargeResponseDTO>> {
        try {
            console.log(`Executing updateCharge use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.id)) {
                return { data: { error: FinancialErrorType.InvalidChargeId }, success: false };
            }
            if (params.amount <= 0) {
                return { data: { error: FinancialErrorType.InvalidAmount }, success: false };
            }
            if (!params.title || !params.description || !params.term || !params.applicableFor) {
                return { data: { error: FinancialErrorType.MissingRequiredFields }, success: false };
            }
            const result = await this.financialRepository.updateCharge(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("UpdateChargeUseCase: Error:", error);
            return { data: { error: error.message || FinancialErrorType.MissingRequiredFields }, success: false };
        }
    }
}

export class DeleteChargeUseCase implements IDeleteChargeUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: DeleteChargeRequestDTO): Promise<ResponseDTO<DeleteChargeResponseDTO>> {
        try {
            console.log(`Executing deleteCharge use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.id)) {
                return { data: { error: FinancialErrorType.InvalidChargeId }, success: false };
            }
            const result = await this.financialRepository.deleteCharge(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("DeleteChargeUseCase: Error:", error);
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