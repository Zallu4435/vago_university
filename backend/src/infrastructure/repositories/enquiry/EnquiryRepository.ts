import { EnquiryProps } from "../../../domain/enquiry/entities/EnquiryTypes";
import { IEnquiryRepository } from "../../../application/enquiry/repositories/IEnquiryRepository";
import { Enquiry as EnquiryModel } from "../../database/mongoose/enquiry/enquiry.model";

export class EnquiryRepository implements IEnquiryRepository {
  async create(data: EnquiryProps) {
    const enquiry = new EnquiryModel({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: data.status,
    });

    return await enquiry.save();
  }

  async find(filter, options: { skip?: number; limit?: number; sort? } = {}) {
    return EnquiryModel.find(filter)
      .sort(options.sort ?? {})
      .skip(options.skip ?? 0)
      .limit(options.limit ?? 0)
      .lean();
  }

  async count(filter) {
    return EnquiryModel.countDocuments(filter);
  }

  async findById(id: string) {
    return EnquiryModel.findById(id).lean();
  }

  async update(id: string, data: EnquiryProps) {
    return EnquiryModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    await EnquiryModel.findByIdAndDelete(id);
  }
} 