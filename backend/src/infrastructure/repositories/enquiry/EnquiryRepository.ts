import mongoose from "mongoose";
import { Enquiry, EnquiryStatus } from "../../../domain/enquiry/entities/Enquiry";
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
import { IEnquiryRepository } from "../../../application/enquiry/repositories/IEnquiryRepository";
import { Enquiry as EnquiryModel } from "../../database/mongoose/models/enquiry.model";
import { emailService } from "../../services/email.service";

export class EnquiryRepository implements IEnquiryRepository {
  async createEnquiry(params: CreateEnquiryRequestDTO): Promise<CreateEnquiryResponseDTO> {
    const enquiry = new EnquiryModel({
      name: params.name,
      email: params.email,
      subject: params.subject,
      message: params.message,
      status: EnquiryStatus.PENDING,
    });

    const savedEnquiry = await enquiry.save();
    
    return {
      enquiry: new Enquiry({
        id: savedEnquiry._id.toString(),
        name: savedEnquiry.name,
        email: savedEnquiry.email,
        subject: savedEnquiry.subject,
        message: savedEnquiry.message,
        status: savedEnquiry.status,
        createdAt: savedEnquiry.createdAt,
        updatedAt: savedEnquiry.updatedAt,
      }),
    };
  }

  async getEnquiries(params: GetEnquiriesRequestDTO): Promise<GetEnquiriesResponseDTO> {
    const { page = 1, limit = 10, status, dateRange, startDate, endDate, search } = params;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    // Status filter
    if (status && status !== "all") {
      query.status = status;
    }

    // Date range filter
    if (dateRange && dateRange !== "all") {
      const now = new Date();
      let start: Date;
      let end: Date = now;

      switch (dateRange) {
        case "today":
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          start = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          start = new Date(0);
      }

      query.createdAt = { $gte: start, $lte: end };
    }

    // Custom date range
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const [enquiries, total] = await Promise.all([
      EnquiryModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      EnquiryModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      enquiries: enquiries.map((enquiry) =>
        new Enquiry({
          id: enquiry._id.toString(),
          name: enquiry.name,
          email: enquiry.email,
          subject: enquiry.subject,
          message: enquiry.message,
          status: enquiry.status,
          createdAt: enquiry.createdAt,
          updatedAt: enquiry.updatedAt,
        })
      ),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getEnquiryById(params: GetEnquiryByIdRequestDTO): Promise<GetEnquiryByIdResponseDTO> {
    const enquiry = await EnquiryModel.findById(params.id).lean();

    if (!enquiry) {
      throw new Error(EnquiryErrorType.EnquiryNotFound);
    }

    return {
      enquiry: new Enquiry({
        id: enquiry._id.toString(),
        name: enquiry.name,
        email: enquiry.email,
        subject: enquiry.subject,
        message: enquiry.message,
        status: enquiry.status,
        createdAt: enquiry.createdAt,
        updatedAt: enquiry.updatedAt,
      }),
    };
  }

  async updateEnquiryStatus(params: UpdateEnquiryStatusRequestDTO): Promise<UpdateEnquiryStatusResponseDTO> {
    const enquiry = await EnquiryModel.findById(params.id);
    if (!enquiry) {
      throw new Error(EnquiryErrorType.EnquiryNotFound);
    }

    enquiry.status = params.status;
    await enquiry.save();

    return {
      enquiry: new Enquiry({
        id: enquiry._id.toString(),
        name: enquiry.name,
        email: enquiry.email,
        subject: enquiry.subject,
        message: enquiry.message,
        status: enquiry.status,
        createdAt: enquiry.createdAt,
        updatedAt: enquiry.updatedAt,
      }),
    };
  }

  async deleteEnquiry(params: DeleteEnquiryRequestDTO): Promise<DeleteEnquiryResponseDTO> {
    const enquiry = await EnquiryModel.findById(params.id);
    if (!enquiry) {
      throw new Error(EnquiryErrorType.EnquiryNotFound);
    }

    await EnquiryModel.findByIdAndDelete(params.id);

    return {
      success: true,
      message: "Enquiry deleted successfully",
    };
  }

  async sendReply(params: SendEnquiryReplyRequestDTO): Promise<SendEnquiryReplyResponseDTO> {
    const enquiry = await EnquiryModel.findById(params.id);
    if (!enquiry) {
      throw new Error(EnquiryErrorType.EnquiryNotFound);
    }

    try {
      // Send email reply to the user
      await emailService.sendEnquiryReplyEmail({
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
      throw new Error(EnquiryErrorType.ReplyFailed);
    }
  }
} 