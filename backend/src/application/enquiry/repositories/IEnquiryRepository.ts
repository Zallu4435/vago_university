import {
  CreateEnquiryRequestDTO,
  GetEnquiriesRequestDTO,
  GetEnquiryByIdRequestDTO,
  UpdateEnquiryStatusRequestDTO,
  DeleteEnquiryRequestDTO,
  SendEnquiryReplyRequestDTO,
} from "../../../domain/enquiry/dtos/EnquiryRequestDTOs";
import {
  CreateEnquiryResponseDTO,
  GetEnquiriesResponseDTO,
  GetEnquiryByIdResponseDTO,
  UpdateEnquiryStatusResponseDTO,
  DeleteEnquiryResponseDTO,
  SendEnquiryReplyResponseDTO,
} from "../../../domain/enquiry/dtos/EnquiryResponseDTOs";

export interface IEnquiryRepository {
  createEnquiry(params: CreateEnquiryRequestDTO): Promise<CreateEnquiryResponseDTO>;
  getEnquiries(params: GetEnquiriesRequestDTO): Promise<GetEnquiriesResponseDTO>;
  getEnquiryById(params: GetEnquiryByIdRequestDTO): Promise<GetEnquiryByIdResponseDTO>;
  updateEnquiryStatus(params: UpdateEnquiryStatusRequestDTO): Promise<UpdateEnquiryStatusResponseDTO>;
  deleteEnquiry(params: DeleteEnquiryRequestDTO): Promise<DeleteEnquiryResponseDTO>;
  sendReply(params: SendEnquiryReplyRequestDTO): Promise<SendEnquiryReplyResponseDTO>;
} 