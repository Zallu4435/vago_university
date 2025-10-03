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
    ResponseDTO,
} from "../../../domain/financial/dtos/FinancialResponseDTOs";
import { IFinancialRepository } from "../repositories/IFinancialRepository";
import { CreateChargeParams, UploadDocumentParams } from "../../../domain/financial/entities/Charge";
import {
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
    ICheckPendingPaymentUseCase,
    IClearPendingPaymentUseCase
} from "./IFinancialUseCases";




export class GetStudentFinancialInfoUseCase implements IGetStudentFinancialInfoUseCase {
    constructor(private _financialRepository: IFinancialRepository) { }

    async execute(params: GetStudentFinancialInfoRequestDTO): Promise<ResponseDTO<GetStudentFinancialInfoResponseDTO>> {
        if (!params.studentId) {
            return { data: { error: FinancialErrorType.InvalidStudentId }, success: false };
        }
        const result = await this._financialRepository.getStudentFinancialInfo(params.studentId);
        return { data: result, success: true };
    }
}

export class GetAllPaymentsUseCase implements IGetAllPaymentsUseCase {
    constructor(private _financialRepository: IFinancialRepository) { }

    async execute(params: GetAllPaymentsRequestDTO): Promise<ResponseDTO<GetAllPaymentsResponseDTO>> {
        const result = await this._financialRepository.getAllPayments(params.startDate, params.endDate, params.status, params.studentId, params.page, params.limit);
        return { data: result, success: true };
    }
}

export class GetOnePaymentUseCase implements IGetOnePaymentUseCase {
    constructor(private _financialRepository: IFinancialRepository) { }

    async execute(params: GetOnePaymentRequestDTO): Promise<ResponseDTO<GetOnePaymentResponseDTO>> {
        if (!params.paymentId) {
            return { data: { error: FinancialErrorType.InvalidPaymentId }, success: false };
        }
        const result = await this._financialRepository.getOnePayment(params.paymentId);
        return { data: result, success: true };
    }
}

export class MakePaymentUseCase implements IMakePaymentUseCase {
    constructor(private _financialRepository: IFinancialRepository) { }

    async execute(params: MakePaymentRequestDTO): Promise<ResponseDTO<MakePaymentResponseDTO>> {
        if (!params.studentId) {
            return { data: { error: FinancialErrorType.InvalidStudentId }, success: false };
        }
        if (params.amount <= 0) {
            return { data: { error: FinancialErrorType.InvalidAmount }, success: false };
        }
        const result = await this._financialRepository.makePayment(params.studentId, params.chargeId, params.amount, params.term, params.method, params.razorpayPaymentId, params.razorpayOrderId, params.razorpaySignature);
        return { data: result, success: true };
    }
}

export class UploadDocumentUseCase implements IUploadDocumentUseCase {
    constructor(private _financialRepository: IFinancialRepository) { }

    async execute(params: UploadDocumentRequestDTO): Promise<ResponseDTO<UploadDocumentResponseDTO>> {
        if (!params.file) {
            return { data: { error: FinancialErrorType.FileRequired }, success: false };
        }
        const repoParams: UploadDocumentParams = { file: params.file, type: params.type };
        const result = await this._financialRepository.uploadDocument(repoParams);
        return { data: result, success: true };
    }
}

export class GetPaymentReceiptUseCase implements IGetPaymentReceiptUseCase {
    constructor(private _financialRepository: IFinancialRepository) { }

    async execute(params: GetPaymentReceiptRequestDTO): Promise<ResponseDTO<GetPaymentReceiptResponseDTO>> {
        if (!params.studentId || !params.paymentId) {
            return { data: { error: FinancialErrorType.InvalidId }, success: false };
        }
        const result = await this._financialRepository.getPaymentReceipt(params.paymentId);
        return { data: result, success: true };
    }
}

export class CreateChargeUseCase implements ICreateChargeUseCase {
    constructor(private _financialRepository: IFinancialRepository) { }

    async execute(params: CreateChargeRequestDTO): Promise<ResponseDTO<CreateChargeResponseDTO>> {
        if (params.amount <= 0) {
            return { data: { error: FinancialErrorType.InvalidAmount }, success: false };
        }
        if (!params.title || !params.description || !params.term || !params.applicableFor) {
            return { data: { error: FinancialErrorType.MissingRequiredFields }, success: false };
        }
        const repoParams: CreateChargeParams = {
            title: params.title,
            description: params.description,
            amount: params.amount,
            term: params.term,
            dueDate: new Date(params.dueDate),
            applicableFor: params.applicableFor,
            createdBy: params.createdBy,
        };
        const result = await this._financialRepository.createCharge(repoParams);
        return { data: result, success: true };
    }
}

export class UpdateChargeUseCase implements IUpdateChargeUseCase {
    constructor(private _financialRepository: IFinancialRepository) { }

    async execute(params: UpdateChargeRequestDTO): Promise<ResponseDTO<UpdateChargeResponseDTO>> {
        if (!params.id) {
            return { data: { error: FinancialErrorType.InvalidChargeId }, success: false };
        }
        if (params.data.amount <= 0) {
            return { data: { error: FinancialErrorType.InvalidAmount }, success: false };
        }
        if (!params.data.title || !params.data.description || !params.data.term || !params.data.applicableFor) {
            return { data: { error: FinancialErrorType.MissingRequiredFields }, success: false };
        }
        const updateFields: any = { ...params.data };
        if (updateFields.dueDate) {
            updateFields.dueDate = new Date(updateFields.dueDate);
        }
        const result = await this._financialRepository.updateCharge(params.id, updateFields);
        return { data: result, success: true };
    }
}

export class DeleteChargeUseCase implements IDeleteChargeUseCase {
    constructor(private _financialRepository: IFinancialRepository) { }

    async execute(params: DeleteChargeRequestDTO): Promise<ResponseDTO<DeleteChargeResponseDTO>> {
        if (!params.id) {
            return { data: { error: FinancialErrorType.InvalidChargeId }, success: false };
        }
        const result = await this._financialRepository.deleteCharge(params.id);
        return { data: result, success: true };
    }
}

export class GetAllChargesUseCase implements IGetAllChargesUseCase {
    constructor(private _financialRepository: IFinancialRepository) { }

    async execute(params: GetAllChargesRequestDTO): Promise<ResponseDTO<GetAllChargesResponseDTO>> {
        const result = await this._financialRepository.getAllCharges(params.term, params.status, params.search, params.page, params.limit);
        return { data: result, success: true };
    }
}

export class CheckPendingPaymentUseCase implements ICheckPendingPaymentUseCase {
    constructor(private _financialRepository: IFinancialRepository) { }
    async execute(studentId: string): Promise<ResponseDTO<{ hasPending: boolean }>> {
        if (!studentId) {
            return { data: { error: FinancialErrorType.InvalidStudentId }, success: false };
        }
        const hasPending = await this._financialRepository.hasPendingPayment(studentId);
        return { data: { hasPending }, success: true };
    }
}

export class ClearPendingPaymentUseCase implements IClearPendingPaymentUseCase {
    constructor(private _financialRepository: IFinancialRepository) { }

    async execute(studentId: string): Promise<ResponseDTO<{ success: boolean }>> {
        if (!studentId) {
            return { data: { error: FinancialErrorType.InvalidStudentId }, success: false };
        }
        const result = await this._financialRepository.clearPendingPayment(studentId);
        return { data: { success: result }, success: true };
    }
}
