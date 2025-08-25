import mongoose from "mongoose";
import { FacultyErrorType } from "../../../domain/faculty/enums/FacultyErrorType";
import { IFacultyRepository } from "../../../application/faculty/repositories/IFacultyRepository";
import { Faculty as FacultyModel } from "../../database/mongoose/auth/faculty.model";
import { FacultyRegister } from "../../database/mongoose/auth/facultyRegister.model";
import { FacultyStatus } from "../../../domain/faculty/FacultyTypes";

 
export class FacultyRepository implements IFacultyRepository {
    async findFaculty(query, options: { skip?: number; limit?: number; select?: string }) {
        return FacultyRegister.find(query)
            .select((options.select ? options.select + ' blocked' : 'blocked'))
            .sort({ updatedAt: -1, createdAt: -1 }) 
            .skip(options.skip || 0)
            .limit(options.limit || 0)
            .lean();
    }

    async countFaculty(query): Promise<number> {
        return FacultyRegister.countDocuments(query);
    }

    async getFacultyById(id: string) {
        if (!mongoose.isValidObjectId(id)) {
            throw new Error(FacultyErrorType.InvalidFacultyId);
        }

        const faculty = await FacultyRegister.findById(id)
            .select('fullName email phone department qualification experience aboutMe cvUrl certificatesUrl createdAt status blocked')
            .lean();

        if (!faculty) {
            throw new Error(FacultyErrorType.FacultyNotFound);
        }

        return faculty;
    }

    async getFacultyByToken(token: string) {
        const faculty = await FacultyRegister.findOne({ confirmationToken: token })
            .select("fullName email phone department qualification experience aboutMe cvUrl certificatesUrl createdAt status confirmationToken tokenExpiry")
            .lean();
        if (!faculty) {
            return null;
        }
        return faculty;
    }

    async approveFaculty(params: { id: string, additionalInfo: { status: FacultyStatus, confirmationToken: string, tokenExpiry: Date, department: string } }) {
        const faculty = await FacultyRegister.findById(params.id);
        if (!faculty) {
            return null;
        }
        faculty.department = params.additionalInfo.department;
        if ((params.additionalInfo).status) faculty.status = (params.additionalInfo).status as FacultyStatus;
        if ((params.additionalInfo).confirmationToken) faculty.confirmationToken = (params.additionalInfo).confirmationToken;
        if ((params.additionalInfo).tokenExpiry) faculty.tokenExpiry = (params.additionalInfo).tokenExpiry;
        await faculty.save();
        return { message: "Faculty updated" };
    }

    async rejectFaculty(id: string) {
        const faculty = await FacultyRegister.findById(id);
        if (!faculty) {
            return null;
        }
        faculty.status = "rejected";
        faculty.rejectedBy = "admin";
        await faculty.save();
        return { message: "Faculty registration rejected" };
    }

    async deleteFaculty(id: string) {
        const faculty = await FacultyRegister.findById(id);
        if (!faculty) {
            return null;
        }
        await FacultyRegister.deleteOne({ _id: id });
        return { message: "Faculty registration deleted" };
    }

    async confirmFacultyOffer(params: { id: string, action: "accept" | "reject" }) {
        const facultyRegister = await FacultyRegister.findById(params.id);
        if (!facultyRegister) {
            return null;
        }
        if (params.action === "accept") {
            facultyRegister.status = "approved";
            facultyRegister.rejectedBy = undefined;
        } else {
            facultyRegister.status = "rejected";
            facultyRegister.rejectedBy = "user";
        }
        facultyRegister.confirmationToken = undefined;
        facultyRegister.tokenExpiry = undefined;
        await facultyRegister.save();
        return {
            message: params.action === "accept"
                ? "Faculty offer accepted and faculty account created"
                : "Faculty offer rejected",
        };
    }

    async downloadCertificate(id: string) {
        const faculty = await FacultyRegister.findById(id);
        if (!faculty) {
            return null;
        }
        return null;
    }

    async blockFaculty(id: string): Promise<{ message: string }> {
        const facultyRegister = await FacultyRegister.findById(id);
        const email = facultyRegister ? facultyRegister.email : undefined;
        let facultyModel = email ? await FacultyModel.findOne({ email }) : null;
        let blockedStatus: boolean | undefined = undefined;
        if (facultyModel) {
            facultyModel.blocked = !facultyModel.blocked;
            blockedStatus = facultyModel.blocked;
            await facultyModel.save();
        }
        if (facultyRegister) {
            facultyRegister.blocked = blockedStatus !== undefined ? blockedStatus : !facultyRegister.blocked;
            await facultyRegister.save();
        }
        if (!facultyModel && !facultyRegister) {
            throw new Error('Faculty not found in FacultyRegister or FacultyModel');
        }
        return { message: (blockedStatus ?? facultyRegister?.blocked) ? 'Faculty blocked' : 'Faculty unblocked' };
    }

    async saveFaculty(faculty) {
        return faculty.save();
    }
}