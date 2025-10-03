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

export interface ICreateEnquiryUseCase {
  execute(params: CreateEnquiryRequestDTO): Promise<CreateEnquiryResponseDTO>;
}

export interface IGetEnquiriesUseCase {
  execute(params: GetEnquiriesRequestDTO): Promise<GetEnquiriesResponseDTO>;
}

export interface IGetEnquiryByIdUseCase {
  execute(params: GetEnquiryByIdRequestDTO): Promise<GetEnquiryByIdResponseDTO>;
}

export interface IUpdateEnquiryStatusUseCase {
  execute(params: UpdateEnquiryStatusRequestDTO): Promise<UpdateEnquiryStatusResponseDTO>;
}

export interface IDeleteEnquiryUseCase {
  execute(params: DeleteEnquiryRequestDTO): Promise<DeleteEnquiryResponseDTO>;
}

export interface ISendEnquiryReplyUseCase {
  execute(params: SendEnquiryReplyRequestDTO): Promise<SendEnquiryReplyResponseDTO>;
}
