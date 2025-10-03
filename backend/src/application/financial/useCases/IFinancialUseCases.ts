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

export interface ICheckPendingPaymentUseCase {
    execute(studentId: string): Promise<ResponseDTO<{ hasPending: boolean }>>;
}

export interface IClearPendingPaymentUseCase {
    execute(studentId: string): Promise<ResponseDTO<{ success: boolean }>>;
}
