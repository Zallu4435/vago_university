import { AdminAdmission, FullAdmissionDetails } from "../../../domain/admin/entities/AdminAdmissionTypes";
import { User } from "../../../domain/auth/entities/Auth";

export interface IAdmissionRepository {
  find(filter: any, projection: any, skip: number, limit: number): Promise<AdminAdmission[]>;
  count(filter: any): Promise<number>;  
  getAdmissionById(id: string): Promise<FullAdmissionDetails>;
  getAdmissionByToken(admissionId: string, token: string): Promise<FullAdmissionDetails>;
  deleteAdmission(id: string): Promise<FullAdmissionDetails>;
  confirmAdmissionOffer(admissionId: string, token: string, action: string);
  findAdmissionById(id: string): Promise<FullAdmissionDetails | null>;
  saveAdmission(admission: AdminAdmission): Promise<AdminAdmission>;
  findUserByEmail(email: string): Promise<User | null>;
  saveUser(user: User): Promise<User>;
}