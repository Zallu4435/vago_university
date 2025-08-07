import { EnquiryProps, IEnquiry } from "../../../domain/enquiry/entities/EnquiryTypes";

export interface IEnquiryRepository {
  create(data: EnquiryProps): Promise<IEnquiry>;
  find(filter, options: { skip?: number; limit?: number; sort? }): Promise<IEnquiry[]>;
  count(filter): Promise<number>;
  findById(id: string): Promise<IEnquiry | null>;
  update(id: string, data: EnquiryProps): Promise<IEnquiry | null>;
  delete(id: string): Promise<void>;
} 