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

export interface IFinancialRepository {
    getStudentFinancialInfo(params: GetStudentFinancialInfoRequestDTO): Promise<GetStudentFinancialInfoResponseDTO>;
    getAllPayments(params: GetAllPaymentsRequestDTO): Promise<GetAllPaymentsResponseDTO>;
    getOnePayment(params: GetOnePaymentRequestDTO): Promise<GetOnePaymentResponseDTO>;
    makePayment(params: MakePaymentRequestDTO): Promise<MakePaymentResponseDTO>;
    uploadDocument(params: UploadDocumentRequestDTO): Promise<UploadDocumentResponseDTO>;
    getPaymentReceipt(params: GetPaymentReceiptRequestDTO): Promise<GetPaymentReceiptResponseDTO>;
    createCharge(params: CreateChargeRequestDTO): Promise<CreateChargeResponseDTO>;
    getAllCharges(params: GetAllChargesRequestDTO): Promise<GetAllChargesResponseDTO>;
    updateCharge(params: UpdateChargeRequestDTO): Promise<UpdateChargeResponseDTO>;
    deleteCharge(params: DeleteChargeRequestDTO): Promise<DeleteChargeResponseDTO>;
}