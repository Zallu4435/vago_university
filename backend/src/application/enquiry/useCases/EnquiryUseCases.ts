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
import { Enquiry, EnquiryProps } from "../../../domain/enquiry/entities/Enquiry";
import { EnquiryStatus } from "../../../domain/enquiry/entities/EnquiryTypes";
import { IEmailService } from "../../auth/service/IEmailService";
import {
  EnquiryNotFoundError,
  InvalidEnquiryIdError,
  InvalidEmailError,
  EnquiryValidationError,
  EnquiryReplyFailedError,
} from "../../../domain/enquiry/errors/EnquiryErrors";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toEnquiryProps(raw: any): EnquiryProps {
  return {
    id: raw._id?.toString() ?? raw.id,
    name: raw.name,
    email: raw.email,
    subject: raw.subject,
    message: raw.message,
    status: raw.status,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

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
      throw new InvalidEmailError(params.email);
    }

    const enquiry = Enquiry.create({
      ...params,
      status: EnquiryStatus.PENDING,
    });
    
    const dbResult = await this.enquiryRepository.create(enquiry.props);
    
    return {
      enquiry: toEnquiryProps(dbResult),
    };
  }
}

export class GetEnquiriesUseCase implements IGetEnquiriesUseCase {
  constructor(private enquiryRepository: IEnquiryRepository) {}

  async execute(params: GetEnquiriesRequestDTO): Promise<GetEnquiriesResponseDTO> {
    const { page = 1, limit = 10, status, startDate, endDate, search } = params;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (status && typeof status === 'string') {
      const statusStr = status.toLowerCase();
      if (statusStr !== "all" && statusStr !== "all statuses" && Object.values(EnquiryStatus).includes(statusStr as EnquiryStatus)) {
        filter.status = statusStr;
      }
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        filter.createdAt = {
          $gte: start,
          $lte: end,
        };
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const sort = { createdAt: -1 };
    const enquiries = await this.enquiryRepository.find(filter, { skip, limit, sort });
    const total = await this.enquiryRepository.count(filter);
    const totalPages = Math.ceil(total / limit);

    return {
      enquiries: enquiries.map(toEnquiryProps),
      total,
      page,
      limit,
      totalPages,
    };
  }
}

export class GetEnquiryByIdUseCase implements IGetEnquiryByIdUseCase {
  constructor(private enquiryRepository: IEnquiryRepository) {}

  async execute(params: GetEnquiryByIdRequestDTO): Promise<GetEnquiryByIdResponseDTO> {
    if (!params.id) {
      throw new InvalidEnquiryIdError();
    }

    const enquiry = await this.enquiryRepository.findById(params.id);
    if (!enquiry) {
      throw new EnquiryNotFoundError(params.id);
    }

    return {
      enquiry: toEnquiryProps(enquiry),
    };
  }
}

export class UpdateEnquiryStatusUseCase implements IUpdateEnquiryStatusUseCase {
  constructor(private enquiryRepository: IEnquiryRepository) {}

  async execute(params: UpdateEnquiryStatusRequestDTO): Promise<UpdateEnquiryStatusResponseDTO> {
    if (!params.id) {
      throw new InvalidEnquiryIdError();
    }

    const existingEnquiry = await this.enquiryRepository.findById(params.id);
    if (!existingEnquiry) {
      throw new EnquiryNotFoundError(params.id);
    }

    const existingProps = toEnquiryProps(existingEnquiry);
    const updatedEnquiry = Enquiry.update(existingProps, { status: params.status });
    
    const dbResult = await this.enquiryRepository.update(params.id, updatedEnquiry.props);
    if (!dbResult) {
      throw new EnquiryNotFoundError(params.id);
    }

    return {
      enquiry: toEnquiryProps(dbResult),
    };
  }
}

export class DeleteEnquiryUseCase implements IDeleteEnquiryUseCase {
  constructor(private enquiryRepository: IEnquiryRepository) {}

  async execute(params: DeleteEnquiryRequestDTO): Promise<DeleteEnquiryResponseDTO> {
    if (!params.id) {
      throw new InvalidEnquiryIdError();
    }

    const enquiry = await this.enquiryRepository.findById(params.id);
    if (!enquiry) {
      throw new EnquiryNotFoundError(params.id);
    }

    await this.enquiryRepository.delete(params.id);

    return {
      success: true,
      message: "Enquiry deleted successfully",
    };
  }
}

export class SendEnquiryReplyUseCase implements ISendEnquiryReplyUseCase {
  constructor(
    private enquiryRepository: IEnquiryRepository,
    private emailService: IEmailService
  ) {}

  async execute(params: SendEnquiryReplyRequestDTO): Promise<SendEnquiryReplyResponseDTO> {
    if (!params.id) {
      throw new InvalidEnquiryIdError();
    }

    if (!params.replyMessage || params.replyMessage.trim().length === 0) {
      throw new EnquiryValidationError("replyMessage", "Reply message is required");
    }

    const enquiry = await this.enquiryRepository.findById(params.id);
    if (!enquiry) {
      throw new EnquiryNotFoundError(params.id);
    }

    try {
      await this.emailService.sendEnquiryReplyEmail({
        to: enquiry.email,
        name: enquiry.name,
        originalSubject: enquiry.subject,
        originalMessage: enquiry.message,
        replyMessage: params.replyMessage,
        adminName: "Support Team"
      });

      return {
        success: true,
        message: "Reply sent successfully",
      };
    } catch (error) {
      console.error("Error sending reply:", error);
      throw new EnquiryReplyFailedError("Failed to send reply");
    }
  }
} 