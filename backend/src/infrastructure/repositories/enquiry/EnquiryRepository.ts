import { EnquiryProps } from "../../../domain/enquiry/entities/EnquiryTypes";
import { IEnquiryRepository } from "../../../application/enquiry/repositories/IEnquiryRepository";
import { Enquiry as EnquiryModel } from "../../database/mongoose/models/enquiry.model";

export class EnquiryRepository implements IEnquiryRepository {
  async create(data: EnquiryProps): Promise<any> {
    const enquiry = new EnquiryModel({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: data.status,
    });

    return await enquiry.save();
  }

  async find(filter: any, options: { skip?: number; limit?: number; sort?: any } = {}): Promise<any[]> {
    return EnquiryModel.find(filter)
      .sort(options.sort ?? {})
      .skip(options.skip ?? 0)
      .limit(options.limit ?? 0)
      .lean();
  }

  async count(filter: any): Promise<number> {
    return EnquiryModel.countDocuments(filter);
  }

  async findById(id: string): Promise<any | null> {
    return EnquiryModel.findById(id).lean();
  }

  async update(id: string, data: EnquiryProps): Promise<any | null> {
    return EnquiryModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await EnquiryModel.findByIdAndDelete(id);
  }
} 