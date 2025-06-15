import {
  GetDiplomasRequestDTO,
  GetDiplomaByIdRequestDTO,
  CreateDiplomaRequestDTO,
  UpdateDiplomaRequestDTO,
  DeleteDiplomaRequestDTO,
  EnrollStudentRequestDTO,
  UnenrollStudentRequestDTO,
} from "../../../domain/diploma/dtos/DiplomaRequestDTOs";
import {
  GetDiplomasResponseDTO,
  GetDiplomaByIdResponseDTO,
  CreateDiplomaResponseDTO,
  UpdateDiplomaResponseDTO,
  EnrollStudentResponseDTO,
  UnenrollStudentResponseDTO,
} from "../../../domain/diploma/dtos/DiplomaResponseDTOs";

export interface IDiplomaRepository {
  getDiplomas(params: GetDiplomasRequestDTO): Promise<GetDiplomasResponseDTO>;
  getDiplomaById(params: GetDiplomaByIdRequestDTO): Promise<GetDiplomaByIdResponseDTO | null>;
  createDiploma(params: CreateDiplomaRequestDTO): Promise<CreateDiplomaResponseDTO>;
  updateDiploma(params: UpdateDiplomaRequestDTO): Promise<UpdateDiplomaResponseDTO | null>;
  deleteDiploma(params: DeleteDiplomaRequestDTO): Promise<void>;
  enrollStudent(params: EnrollStudentRequestDTO): Promise<EnrollStudentResponseDTO>;
  unenrollStudent(params: UnenrollStudentRequestDTO): Promise<UnenrollStudentResponseDTO>;
} 