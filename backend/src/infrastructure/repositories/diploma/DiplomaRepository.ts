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
  async getDiplomas(params: GetDiplomasRequestDTO & { search?: string }) {
    const { page, limit, department, category, status, instructor, dateRange, search, startDate, endDate } = params;
    const skip = (page - 1) * limit;

    const filter: any = {};

    let dept = undefined;
    if (params.category && params.category !== 'all' && params.category !== 'All' && params.category !== 'All Categories') {
      dept = params.category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } else if (params.department && params.department !== 'all' && params.department !== 'All' && params.department !== 'All Categories') {
      dept = params.department;
    }
    if (dept) {
      filter.category = dept;
    }

    if (status && status !== 'All' && status !== 'all') {
      if (status.toLowerCase() === 'active') filter.status = true;
      else if (status.toLowerCase() === 'inactive') filter.status = false;
    }

    if (instructor && instructor !== 'All' && instructor !== 'all') {
      filter.instructor = instructor;
    }

    if (dateRange && dateRange !== 'All' && dateRange !== 'all') {
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      const now = new Date();
      if (dateRange === 'custom' && params.startDate && params.endDate) {
        startDate = new Date(params.startDate);
        endDate = new Date(params.endDate);
        // Set endDate to end of day
        endDate.setHours(23, 59, 59, 999);
      } else {
        endDate = now;
        switch (dateRange) {
          case 'last_week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'last_month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'last_3_months':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        }
      }
      if (startDate && endDate) {
        filter.createdAt = { $gte: startDate, $lte: endDate };
      }
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
      ];
    }

    const [diplomas, totalItems] = await Promise.all([
      DiplomaModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      DiplomaModel.countDocuments(filter),
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