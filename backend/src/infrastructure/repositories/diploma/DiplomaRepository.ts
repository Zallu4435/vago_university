import { IDiplomaRepository } from "../../../application/diploma/repositories/IDiplomaRepository";
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
  DiplomaSummaryDTO,
} from "../../../domain/diploma/dtos/DiplomaResponseDTOs";
import { Diploma } from "../../../domain/diploma/entities/Diploma";
import { Diploma as DiplomaModel, IDiploma } from "../../../infrastructure/database/mongoose/models/diploma.model";
import mongoose from "mongoose";

export class DiplomaRepository implements IDiplomaRepository {
  async getDiplomas(params: GetDiplomasRequestDTO): Promise<GetDiplomasResponseDTO> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [diplomas, totalItems] = await Promise.all([
      DiplomaModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      DiplomaModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    const mappedDiplomas: DiplomaSummaryDTO[] = diplomas.map((diploma: IDiploma) => ({
      id: diploma._id.toString(),
      title: diploma.title,
      description: diploma.description,
      price: diploma.price,
      category: diploma.category,
      thumbnail: diploma.thumbnail,
      duration: diploma.duration,
      prerequisites: diploma.prerequisites,
      status: diploma.status,
      createdAt: diploma.createdAt.toISOString(),
      updatedAt: diploma.updatedAt.toISOString(),
      videoIds: diploma.videoIds.map((id: mongoose.Types.ObjectId) => id.toString()),
    }));

    return {
      diplomas: mappedDiplomas,
      totalPages,
      currentPage: page,
      totalItems,
    };
  }

  async getDiplomaById(params: GetDiplomaByIdRequestDTO): Promise<GetDiplomaByIdResponseDTO | null> {
    const diploma = await DiplomaModel.findById(params.id).lean();
    if (!diploma) return null;

    return {
      diploma: new Diploma({
        id: diploma._id.toString(),
        title: diploma.title,
        description: diploma.description,
        price: diploma.price,
        category: diploma.category,
        thumbnail: diploma.thumbnail,
        duration: diploma.duration,
        prerequisites: diploma.prerequisites,
        status: diploma.status,
        createdAt: diploma.createdAt,
        updatedAt: diploma.updatedAt,
        videoIds: diploma.videoIds.map((id: mongoose.Types.ObjectId) => id.toString()),
      }),
    };
  }

  async createDiploma(params: CreateDiplomaRequestDTO): Promise<CreateDiplomaResponseDTO> {
    const diploma = await DiplomaModel.create({
      ...params,
      videoIds: [],
    });

    return {
      diploma: new Diploma({
        id: diploma._id.toString(),
        title: diploma.title,
        description: diploma.description,
        price: diploma.price,
        category: diploma.category,
        thumbnail: diploma.thumbnail,
        duration: diploma.duration,
        prerequisites: diploma.prerequisites,
        status: diploma.status,
        createdAt: diploma.createdAt,
        updatedAt: diploma.updatedAt,
        videoIds: diploma.videoIds.map((id: mongoose.Types.ObjectId) => id.toString()),
      }),
    };
  }

  async updateDiploma(params: UpdateDiplomaRequestDTO): Promise<UpdateDiplomaResponseDTO | null> {
    const diploma = await DiplomaModel.findByIdAndUpdate(
      params.id,
      { $set: params },
      { new: true }
    ).lean();

    if (!diploma) return null;

    return {
      diploma: new Diploma({
        id: diploma._id.toString(),
        title: diploma.title,
        description: diploma.description,
        price: diploma.price,
        category: diploma.category,
        thumbnail: diploma.thumbnail,
        duration: diploma.duration,
        prerequisites: diploma.prerequisites,
        status: diploma.status,
        createdAt: diploma.createdAt,
        updatedAt: diploma.updatedAt,
        videoIds: diploma.videoIds.map((id: mongoose.Types.ObjectId) => id.toString()),
      }),
    };
  }

  async deleteDiploma(params: DeleteDiplomaRequestDTO): Promise<void> {
    await DiplomaModel.findByIdAndDelete(params.id);
  }

  async enrollStudent(params: EnrollStudentRequestDTO): Promise<EnrollStudentResponseDTO> {
    const diploma = await DiplomaModel.findById(params.diplomaId);
    if (!diploma) {
      throw new Error("Diploma not found");
    }

    await DiplomaModel.findByIdAndUpdate(params.diplomaId, {
      $addToSet: { students: new mongoose.Types.ObjectId(params.studentId) },
    });

    return {
      success: true,
      message: "Student enrolled successfully",
    };
  }

  async unenrollStudent(params: UnenrollStudentRequestDTO): Promise<UnenrollStudentResponseDTO> {
    const diploma = await DiplomaModel.findById(params.diplomaId);
    if (!diploma) {
      throw new Error("Diploma not found");
    }

    await DiplomaModel.findByIdAndUpdate(params.diplomaId, {
      $pull: { students: new mongoose.Types.ObjectId(params.studentId) },
    });

    return {
      success: true,
      message: "Student unenrolled successfully",
    };
  }
} 