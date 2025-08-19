import { IDiplomaRepository } from "../../../application/diploma/repositories/IDiplomaRepository";
import { Diploma } from "../../../domain/diploma/entities/Diploma";
import { EnrollStudent, UnenrollStudent, DiplomaDocument } from "../../../domain/diploma/entities/diplomatypes";
import { Diploma as DiplomaModel } from "../../../infrastructure/database/mongoose/models/diploma.model";
import mongoose from "mongoose";
import { DiplomaFilter } from "../../../domain/diploma/entities/diplomatypes";

type WithStringId<T> = Omit<T, "_id"> & { _id: string };

export class DiplomaRepository implements IDiplomaRepository {
  async getDiplomas(page: number, limit: number, department: string, category: string, status: string, instructor: string, dateRange: string, search: string, startDate: string, endDate: string) {
    const skip = (page - 1) * limit;

    const filter: DiplomaFilter = {};

    let dept = undefined;
    if (category && category !== 'all' && category !== 'All' && category !== 'All Categories') {
      dept = category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } else if (department && department !== 'all' && department !== 'All' && department !== 'All Categories') {
      dept = department;
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
      if (dateRange === 'custom' && startDate && endDate) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);
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
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const [diplomas, totalItems] = await Promise.all([
      DiplomaModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean<WithStringId<DiplomaDocument>[]>({ getters: true }),
      DiplomaModel.countDocuments(filter),
    ]);

    return { diplomas, totalItems };
  }

  async getDiplomaById(id: string) {
    return DiplomaModel.findById(id).lean<WithStringId<DiplomaDocument>>({ getters: true });
  }

  async createDiploma(diploma: Diploma) {
    const doc = await DiplomaModel.create({ ...diploma, videoIds: [] });
    const result = doc.toObject({ getters: true });
    return {
      ...result,
      _id: result._id.toString(),
      videoIds: result.videoIds.map(id => id.toString()),
      students: result.students?.map(id => id.toString()) || []
    } as WithStringId<DiplomaDocument>;
  }

  async updateDiploma(diploma: Diploma) {
    return DiplomaModel.findByIdAndUpdate(
      diploma.id,
      { $set: diploma },
      { new: true }
    ).lean<WithStringId<DiplomaDocument>>({ getters: true });
  }

  async deleteDiploma(id: string) {
    await DiplomaModel.findByIdAndDelete(id);
  }

  async enrollStudent(enrollStudent: EnrollStudent) {
    const diploma = await DiplomaModel.findById(enrollStudent.diplomaId);
    if (!diploma) return null;
    await DiplomaModel.findByIdAndUpdate(enrollStudent.diplomaId, {
      $addToSet: { students: new mongoose.Types.ObjectId(enrollStudent.studentId) },
    });
    return true;
  }

  async unenrollStudent(unenrollStudent: UnenrollStudent) {
    const diploma = await DiplomaModel.findById(unenrollStudent.diplomaId);
    if (!diploma) return null;
    await DiplomaModel.findByIdAndUpdate(unenrollStudent.diplomaId, {
      $pull: { students: new mongoose.Types.ObjectId(unenrollStudent.studentId) },
    });
    return true;
  }
} 