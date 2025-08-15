import { IDiplomaRepository } from "../repositories/IDiplomaRepository";
import { GetDiplomasRequestDTO, GetDiplomaByIdRequestDTO, CreateDiplomaRequestDTO, UpdateDiplomaRequestDTO, DeleteDiplomaRequestDTO, EnrollStudentRequestDTO, UnenrollStudentRequestDTO } from "../../../domain/diploma/dtos/DiplomaRequestDTOs";
import { GetDiplomasResponseDTO, GetDiplomaByIdResponseDTO, CreateDiplomaResponseDTO, UpdateDiplomaResponseDTO, EnrollStudentResponseDTO, UnenrollStudentResponseDTO, DiplomaSummaryDTO } from "../../../domain/diploma/dtos/DiplomaResponseDTOs";
import { Diploma } from "../../../domain/diploma/entities/Diploma";
import { DiplomaNotFoundError, InvalidDiplomaStatusError } from "../../../domain/diploma/errors/DiplomaErrors";
import mongoose from "mongoose";
import { DiplomaDocument } from "../../../domain/diploma/entities/diplomatypes";

interface ResponseDTO<T> {
  data: T;
  success: boolean;
}

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

function mapDiplomaToSummaryDTO(diploma): DiplomaSummaryDTO {
  return {
    id: diploma._id?.toString() || diploma.id,
    title: diploma.title,
    description: diploma.description,
    price: diploma.price,
    category: diploma.category,
    thumbnail: diploma.thumbnail,
    duration: diploma.duration,
    prerequisites: diploma.prerequisites,
    status: diploma.status,
    createdAt: diploma.createdAt?.toISOString?.() || diploma.createdAt,
    updatedAt: diploma.updatedAt?.toISOString?.() || diploma.updatedAt,
    videoIds: (diploma.videoIds || []).map((id) => id.toString()),
  };
}

export class GetDiplomasUseCase implements IGetDiplomasUseCase {
  constructor(private readonly diplomaRepository: IDiplomaRepository) { }

  async execute(params: GetDiplomasRequestDTO): Promise<ResponseDTO<GetDiplomasResponseDTO>> {
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      throw new Error("Invalid page or limit parameters");
    }
    const { diplomas, totalItems } = await this.diplomaRepository.getDiplomas(params.page, params.limit, params.department, params.category, params.status, params.instructor, params.dateRange, params.search, params.startDate, params.endDate);
    const totalPages = Math.ceil(totalItems / params.limit);
    const mappedDiplomas: DiplomaSummaryDTO[] = diplomas.map(mapDiplomaToSummaryDTO);
    return {
      success: true,
      data: {
        diplomas: mappedDiplomas,
        totalPages,
        currentPage: params.page,
        totalItems,
      },
    };
  }
}

export class GetDiplomaByIdUseCase implements IGetDiplomaByIdUseCase {
  constructor(private readonly diplomaRepository: IDiplomaRepository) { }

  async execute(params: GetDiplomaByIdRequestDTO): Promise<ResponseDTO<GetDiplomaByIdResponseDTO>> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new InvalidDiplomaStatusError("Invalid diploma ID");
    }
    const diplomaDoc = await this.diplomaRepository.getDiplomaById(params.id);
    if (!diplomaDoc) {
      throw new DiplomaNotFoundError(params.id);
    }
    return {
      success: true,
      data: {
        diploma: new Diploma({
          id: diplomaDoc._id?.toString() || diplomaDoc._id,
          title: diplomaDoc.title,
          description: diplomaDoc.description,
          price: diplomaDoc.price,
          category: diplomaDoc.category,
          thumbnail: diplomaDoc.thumbnail,
          duration: diplomaDoc.duration,
          prerequisites: diplomaDoc.prerequisites,
          status: diplomaDoc.status,
          createdAt: diplomaDoc.createdAt,
          updatedAt: diplomaDoc.updatedAt,
          videoIds: (diplomaDoc.videoIds || []).map((id) => id.toString()),
        }),
      },
    };
  }
}

export class CreateDiplomaUseCase implements ICreateDiplomaUseCase {
  constructor(private readonly diplomaRepository: IDiplomaRepository) { }

  async execute(params: CreateDiplomaRequestDTO): Promise<ResponseDTO<CreateDiplomaResponseDTO>> {
    const diplomaDoc: DiplomaDocument = await this.diplomaRepository.createDiploma(params);
    return {
      success: true,
      data: {
        diploma: new Diploma({
          id: diplomaDoc._id?.toString() || '',
          title: diplomaDoc.title,
          description: diplomaDoc.description,
          price: diplomaDoc.price,
          category: diplomaDoc.category,
          thumbnail: diplomaDoc.thumbnail,
          duration: diplomaDoc.duration,
          prerequisites: diplomaDoc.prerequisites,
          status: diplomaDoc.status,
          createdAt: diplomaDoc.createdAt,
          updatedAt: diplomaDoc.updatedAt,
          videoIds: (diplomaDoc.videoIds || []).map((id) => id.toString()),
        }),
      },
    };
  }
}

export class UpdateDiplomaUseCase implements IUpdateDiplomaUseCase {
  constructor(private readonly diplomaRepository: IDiplomaRepository) { }

  async execute(params: UpdateDiplomaRequestDTO): Promise<ResponseDTO<UpdateDiplomaResponseDTO>> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new InvalidDiplomaStatusError("Invalid diploma ID");
    }
    const existingDiploma = await this.diplomaRepository.getDiplomaById(params.id);
    if (!existingDiploma) throw new DiplomaNotFoundError(params.id);
    const updatedDiploma = { ...existingDiploma, ...params };
    const diplomaDoc: DiplomaDocument = await this.diplomaRepository.updateDiploma(updatedDiploma);
    return {
      success: true,
      data: {
        diploma: new Diploma({
          id: diplomaDoc._id?.toString() || diplomaDoc._id,
          title: diplomaDoc.title,
          description: diplomaDoc.description,
          price: diplomaDoc.price,
          category: diplomaDoc.category,
          thumbnail: diplomaDoc.thumbnail,
          duration: diplomaDoc.duration,
          prerequisites: diplomaDoc.prerequisites,
          status: diplomaDoc.status,
          createdAt: diplomaDoc.createdAt,
          updatedAt: diplomaDoc.updatedAt,
          videoIds: (diplomaDoc.videoIds || []).map((id) => id.toString()),
        }),
      },
    };
  }
}

export class DeleteDiplomaUseCase implements IDeleteDiplomaUseCase {
  constructor(private readonly diplomaRepository: IDiplomaRepository) { }

  async execute(params: DeleteDiplomaRequestDTO): Promise<ResponseDTO<{ message: string }>> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new InvalidDiplomaStatusError("Invalid diploma ID");
    }
    await this.diplomaRepository.deleteDiploma(params.id);
    return { success: true, data: { message: "Diploma deleted successfully" } };
  }
}

export class EnrollStudentUseCase implements IEnrollStudentUseCase {
  constructor(private readonly diplomaRepository: IDiplomaRepository) { }

  async execute(params: EnrollStudentRequestDTO): Promise<ResponseDTO<EnrollStudentResponseDTO>> {
    const result = await this.diplomaRepository.enrollStudent(params);
    if (!result) {
      throw new DiplomaNotFoundError(params.diplomaId);
    }
    return { success: true, data: { success: true, message: "Student enrolled successfully" } };
  }
}

export class UnenrollStudentUseCase implements IUnenrollStudentUseCase {
  constructor(private readonly diplomaRepository: IDiplomaRepository) { }

  async execute(params: UnenrollStudentRequestDTO): Promise<ResponseDTO<UnenrollStudentResponseDTO>> {
    const result = await this.diplomaRepository.unenrollStudent(params);
    if (!result) {
      throw new DiplomaNotFoundError(params.diplomaId);
    }
    return { success: true, data: { success: true, message: "Student unenrolled successfully" } };
  }
} 