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

export interface IFinancialRepository {
    getStudentFinancialInfo(params: GetStudentFinancialInfoRequestDTO): Promise<GetStudentFinancialInfoResponseDTO>;
    getAllPayments(params: GetAllPaymentsRequestDTO): Promise<GetAllPaymentsResponseDTO>;
    getOnePayment(params: GetOnePaymentRequestDTO): Promise<GetOnePaymentResponseDTO>;
    makePayment(params: MakePaymentRequestDTO): Promise<MakePaymentResponseDTO>;
    getFinancialAidApplications(params: GetFinancialAidApplicationsRequestDTO): Promise<GetFinancialAidApplicationsResponseDTO>;
    getAllFinancialAidApplications(params: GetAllFinancialAidApplicationsRequestDTO): Promise<GetAllFinancialAidApplicationsResponseDTO>;
    applyForFinancialAid(params: ApplyForFinancialAidRequestDTO): Promise<ApplyForFinancialAidResponseDTO>;
    getAvailableScholarships(params: GetAvailableScholarshipsRequestDTO): Promise<GetAvailableScholarshipsResponseDTO>;
    getScholarshipApplications(params: GetScholarshipApplicationsRequestDTO): Promise<GetScholarshipApplicationsResponseDTO>;
    getAllScholarshipApplications(params: GetAllScholarshipApplicationsRequestDTO): Promise<GetAllScholarshipApplicationsResponseDTO>;
    applyForScholarship(params: ApplyForScholarshipRequestDTO): Promise<ApplyForScholarshipResponseDTO>;
    uploadDocument(params: UploadDocumentRequestDTO): Promise<UploadDocumentResponseDTO>;
    getPaymentReceipt(params: GetPaymentReceiptRequestDTO): Promise<GetPaymentReceiptResponseDTO>;
    updateFinancialAidApplication(params: UpdateFinancialAidApplicationRequestDTO): Promise<UpdateFinancialAidApplicationResponseDTO>;
    updateScholarshipApplication(params: UpdateScholarshipApplicationRequestDTO): Promise<UpdateScholarshipApplicationResponseDTO>;
    createCharge(params: CreateChargeRequestDTO): Promise<CreateChargeResponseDTO>;
    getAllCharges(params: GetAllChargesRequestDTO): Promise<GetAllChargesResponseDTO>;
}