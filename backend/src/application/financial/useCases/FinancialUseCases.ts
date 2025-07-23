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
        if (!mongoose.Types.ObjectId.isValid(params.studentId)) {
            return { data: { error: FinancialErrorType.InvalidStudentId }, success: false };
        }
        const result = await this.financialRepository.getStudentFinancialInfo(params);
        return { data: result, success: true };
    }
}

export class GetAllPaymentsUseCase implements IGetAllPaymentsUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetAllPaymentsRequestDTO): Promise<ResponseDTO<GetAllPaymentsResponseDTO>> {
        const result = await this.financialRepository.getAllPayments(params);
        return { data: result, success: true };
    }
}

export class GetOnePaymentUseCase implements IGetOnePaymentUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetOnePaymentRequestDTO): Promise<ResponseDTO<GetOnePaymentResponseDTO>> {
        if (!mongoose.Types.ObjectId.isValid(params.paymentId)) {
            return { data: { error: FinancialErrorType.InvalidPaymentId }, success: false };
        }
        const result = await this.financialRepository.getOnePayment(params);
        return { data: result, success: true };
    }
}

export class MakePaymentUseCase implements IMakePaymentUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: MakePaymentRequestDTO): Promise<ResponseDTO<MakePaymentResponseDTO>> {
        if (!mongoose.Types.ObjectId.isValid(params.studentId)) {
            return { data: { error: FinancialErrorType.InvalidStudentId }, success: false };
        }
        if (params.amount <= 0) {
            return { data: { error: FinancialErrorType.InvalidAmount }, success: false };
        }
        const result = await this.financialRepository.makePayment(params);
        return { data: result, success: true };
    }
}

export class UploadDocumentUseCase implements IUploadDocumentUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: UploadDocumentRequestDTO): Promise<ResponseDTO<UploadDocumentResponseDTO>> {
        if (!params.file) {
            return { data: { error: FinancialErrorType.FileRequired }, success: false };
        }
        const result = await this.financialRepository.uploadDocument(params);
        return { data: result, success: true };
    }
}

export class GetPaymentReceiptUseCase implements IGetPaymentReceiptUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetPaymentReceiptRequestDTO): Promise<ResponseDTO<GetPaymentReceiptResponseDTO>> {
        if (!mongoose.Types.ObjectId.isValid(params.studentId) || !mongoose.Types.ObjectId.isValid(params.paymentId)) {
            return { data: { error: FinancialErrorType.InvalidId }, success: false };
        }
        const result = await this.financialRepository.getPaymentReceipt(params);
        return { data: result, success: true };
    }
}

export class CreateChargeUseCase implements ICreateChargeUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: CreateChargeRequestDTO): Promise<ResponseDTO<CreateChargeResponseDTO>> {
        if (params.amount <= 0) {
            return { data: { error: FinancialErrorType.InvalidAmount }, success: false };
        }
        if (!params.title || !params.description || !params.term || !params.applicableFor) {
            return { data: { error: FinancialErrorType.MissingRequiredFields }, success: false };
        }
        const result = await this.financialRepository.createCharge(params);
        return { data: result, success: true };
    }
}

export class UpdateChargeUseCase implements IUpdateChargeUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: UpdateChargeRequestDTO): Promise<ResponseDTO<UpdateChargeResponseDTO>> {
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
    }
}

export class DeleteChargeUseCase implements IDeleteChargeUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: DeleteChargeRequestDTO): Promise<ResponseDTO<DeleteChargeResponseDTO>> {
        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            return { data: { error: FinancialErrorType.InvalidChargeId }, success: false };
        }
        const result = await this.financialRepository.deleteCharge(params);
        return { data: result, success: true };
    }
}

export class GetAllChargesUseCase implements IGetAllChargesUseCase {
    constructor(private financialRepository: IFinancialRepository) { }

    async execute(params: GetAllChargesRequestDTO): Promise<ResponseDTO<GetAllChargesResponseDTO>> {
        const result = await this.financialRepository.getAllCharges(params);
        return { data: result, success: true };
    }
}