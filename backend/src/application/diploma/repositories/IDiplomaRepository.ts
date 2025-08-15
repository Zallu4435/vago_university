import { Diploma } from "../../../domain/diploma/entities/Diploma";
import { DiplomaDocument, DiplomaListResult, EnrollStudent, UnenrollStudent } from "../../../domain/diploma/entities/diplomatypes";

export interface IDiplomaRepository {
  getDiplomas(page: number, limit: number, department: string, category: string, status: string, instructor: string, dateRange: string, search: string, startDate: string, endDate: string): Promise<DiplomaListResult>;
  getDiplomaById(id: string): Promise<DiplomaDocument | null>;
  createDiploma(params: Diploma): Promise<DiplomaDocument>;
  updateDiploma(params: Diploma): Promise<DiplomaDocument | null>;
  deleteDiploma(id: string): Promise<void>;
  enrollStudent(params: EnrollStudent): Promise<boolean>;
  unenrollStudent(params: UnenrollStudent): Promise<boolean>;
} 