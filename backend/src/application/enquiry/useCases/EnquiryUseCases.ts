import mongoose from "mongoose";
import { EnquiryErrorType } from "../../../domain/enquiry/enums/EnquiryErrorType";
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
import { IEnquiryRepository } from "../repositories/IEnquiryRepository";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export class CreateEnquiryUseCase implements ICreateEnquiryUseCase {
  constructor(private enquiryRepository: IEnquiryRepository) {}

  async execute(params: CreateEnquiryRequestDTO): Promise<CreateEnquiryResponseDTO> {
    if (!emailRegex.test(params.email)) {
      throw new Error(EnquiryErrorType.InvalidEmail);
    }

    try {
      return await this.enquiryRepository.createEnquiry(params);
    } catch (error) {
      console.error("CreateEnquiryUseCase: Error:", error);
      throw new Error(error.message || EnquiryErrorType.EnquiryCreationFailed);
    }
  }
}

export class GetEnquiriesUseCase implements IGetEnquiriesUseCase {
  constructor(private enquiryRepository: IEnquiryRepository) {}

  async execute(params: GetEnquiriesRequestDTO): Promise<GetEnquiriesResponseDTO> {
    try {
      return await this.enquiryRepository.getEnquiries(params);
    } catch (error) {
      console.error("GetEnquiriesUseCase: Error:", error);
      throw new Error(error.message || "Failed to fetch enquiries");
    }
  }
}

export class GetEnquiryByIdUseCase implements IGetEnquiryByIdUseCase {
  constructor(private enquiryRepository: IEnquiryRepository) {}

  async execute(params: GetEnquiryByIdRequestDTO): Promise<GetEnquiryByIdResponseDTO> {
    if (!params.id) {
      throw new Error(EnquiryErrorType.InvalidEnquiryId);
    }

    try {
      return await this.enquiryRepository.getEnquiryById(params);
    } catch (error) {
      console.error("GetEnquiryByIdUseCase: Error:", error);
      throw new Error(error.message || EnquiryErrorType.EnquiryNotFound);
    }
  }
}

export class UpdateEnquiryStatusUseCase implements IUpdateEnquiryStatusUseCase {
  constructor(private enquiryRepository: IEnquiryRepository) {}

  async execute(params: UpdateEnquiryStatusRequestDTO): Promise<UpdateEnquiryStatusResponseDTO> {
    if (!params.id) {
      throw new Error(EnquiryErrorType.InvalidEnquiryId);
    }

    try {
      return await this.enquiryRepository.updateEnquiryStatus(params);
    } catch (error) {
      console.error("UpdateEnquiryStatusUseCase: Error:", error);
      throw new Error(error.message || EnquiryErrorType.EnquiryUpdateFailed);
    }
  }
}

export class DeleteEnquiryUseCase implements IDeleteEnquiryUseCase {
  constructor(private enquiryRepository: IEnquiryRepository) {}

  async execute(params: DeleteEnquiryRequestDTO): Promise<DeleteEnquiryResponseDTO> {
    if (!params.id) {
      throw new Error(EnquiryErrorType.InvalidEnquiryId);
    }

    try {
      return await this.enquiryRepository.deleteEnquiry(params);
    } catch (error) {
      console.error("DeleteEnquiryUseCase: Error:", error);
      throw new Error(error.message || EnquiryErrorType.EnquiryDeletionFailed);
    }
  }
}

export class SendEnquiryReplyUseCase implements ISendEnquiryReplyUseCase {
  constructor(private enquiryRepository: IEnquiryRepository) {}

  async execute(params: SendEnquiryReplyRequestDTO): Promise<SendEnquiryReplyResponseDTO> {
    if (!params.id) {
      throw new Error(EnquiryErrorType.InvalidEnquiryId);
    }

    if (!params.replyMessage || params.replyMessage.trim().length === 0) {
      throw new Error("Reply message is required");
    }

    try {
      return await this.enquiryRepository.sendReply(params);
    } catch (error) {
      console.error("SendEnquiryReplyUseCase: Error:", error);
      throw new Error(error.message || "Failed to send reply");
    }
  }
} 