import { EnquiryProps } from "../../../domain/enquiry/entities/EnquiryTypes";

export interface IEnquiryRepository {
  create(data: EnquiryProps): Promise<any>;
  find(filter: any, options: { skip?: number; limit?: number; sort?: any }): Promise<any[]>;
  count(filter: any): Promise<number>;
  findById(id: string): Promise<any | null>;
  update(id: string, data: EnquiryProps): Promise<any | null>;
  delete(id: string): Promise<void>;
} 