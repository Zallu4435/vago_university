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
import { Diploma as DiplomaModel } from "../../../infrastructure/database/mongoose/models/diploma.model";
import mongoose from "mongoose";

export class DiplomaRepository implements IDiplomaRepository {
  async getDiplomas(params: GetDiplomasRequestDTO) {
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

    return { diplomas, totalItems };
  }

  async getDiplomaById(params: GetDiplomaByIdRequestDTO) {
    return DiplomaModel.findById(params.id).lean();
  }

  async createDiploma(params: CreateDiplomaRequestDTO) {
    return DiplomaModel.create({ ...params, videoIds: [] });
  }

  async updateDiploma(params: UpdateDiplomaRequestDTO) {
    return DiplomaModel.findByIdAndUpdate(
      params.id,
      { $set: params },
      { new: true }
    ).lean();
  }

  async deleteDiploma(params: DeleteDiplomaRequestDTO) {
    await DiplomaModel.findByIdAndDelete(params.id);
  }

  async enrollStudent(params: EnrollStudentRequestDTO) {
    const diploma = await DiplomaModel.findById(params.diplomaId);
    if (!diploma) return null;
    await DiplomaModel.findByIdAndUpdate(params.diplomaId, {
      $addToSet: { students: new mongoose.Types.ObjectId(params.studentId) },
    });
    return true;
  }

  async unenrollStudent(params: UnenrollStudentRequestDTO) {
    const diploma = await DiplomaModel.findById(params.diplomaId);
    if (!diploma) return null;
    await DiplomaModel.findByIdAndUpdate(params.diplomaId, {
      $pull: { students: new mongoose.Types.ObjectId(params.studentId) },
    });
    return true;
  }
} 