import { GetDiplomasRequestDTO, GetDiplomaByIdRequestDTO, CreateDiplomaRequestDTO, UpdateDiplomaRequestDTO, DeleteDiplomaRequestDTO, EnrollStudentRequestDTO, UnenrollStudentRequestDTO } from "../../../domain/diploma/dtos/DiplomaRequestDTOs";
import { GetDiplomasResponseDTO, GetDiplomaByIdResponseDTO, CreateDiplomaResponseDTO, UpdateDiplomaResponseDTO, EnrollStudentResponseDTO, UnenrollStudentResponseDTO, DiplomaSummaryDTO, ResponseDTO } from "../../../domain/diploma/dtos/DiplomaResponseDTOs";

export interface IGetDiplomasUseCase {
  execute(params: GetDiplomasRequestDTO): Promise<ResponseDTO<GetDiplomasResponseDTO>>;
}
 
export interface IGetDiplomaByIdUseCase {
  execute(params: GetDiplomaByIdRequestDTO): Promise<ResponseDTO<GetDiplomaByIdResponseDTO>>;
}

export interface ICreateDiplomaUseCase {
  execute(params: CreateDiplomaRequestDTO): Promise<ResponseDTO<CreateDiplomaResponseDTO>>;
}

export interface IUpdateDiplomaUseCase {
  execute(params: UpdateDiplomaRequestDTO): Promise<ResponseDTO<UpdateDiplomaResponseDTO>>;
}

export interface IDeleteDiplomaUseCase {
  execute(params: DeleteDiplomaRequestDTO): Promise<ResponseDTO<{ message: string }>>;
}

export interface IEnrollStudentUseCase {
  execute(params: EnrollStudentRequestDTO): Promise<ResponseDTO<EnrollStudentResponseDTO>>;
}

export interface IUnenrollStudentUseCase {
  execute(params: UnenrollStudentRequestDTO): Promise<ResponseDTO<UnenrollStudentResponseDTO>>;
}
