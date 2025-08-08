import mongoose from "mongoose";
import { FacultyErrorType } from "../../../domain/faculty/enums/FacultyErrorType";
import {
    GetFacultyByIdRequestDTO,
    GetFacultyByTokenRequestDTO,
    ApproveFacultyRequestDTO,
    RejectFacultyRequestDTO,
    DeleteFacultyRequestDTO,
    ConfirmFacultyOfferRequestDTO,
    DownloadCertificateRequestDTO,
} from "../../../domain/faculty/dtos/FacultyRequestDTOs";
import {
    ApproveFacultyResponseDTO,
    RejectFacultyResponseDTO,
    DeleteFacultyResponseDTO,
    ConfirmFacultyOfferResponseDTO,
    DownloadCertificateResponseDTO,
} from "../../../domain/faculty/dtos/FacultyResponseDTOs";
import { IFacultyRepository } from "../../../application/faculty/repositories/IFacultyRepository";
import { Faculty as FacultyModel } from "../../database/mongoose/auth/faculty.model";
import { FacultyRegister } from "../../database/mongoose/models/facultyRegister.model";


export class FacultyRepository implements IFacultyRepository {
    async findFaculty(query, options: { skip?: number; limit?: number; select?: string }): Promise<any[]> {
        return (FacultyRegister as any).find(query)
            .select((options.select ? options.select + ' blocked' : 'blocked'))
            .sort({ updatedAt: -1, createdAt: -1 }) 
            .skip(options.skip || 0)
            .limit(options.limit || 0)
            .lean();
    }

    async countFaculty(query): Promise<number> {
        return (FacultyRegister as any).countDocuments(query);
    }

    async getFacultyById(params: GetFacultyByIdRequestDTO) {
        if (!mongoose.isValidObjectId(params.id)) {
            throw new Error(FacultyErrorType.InvalidFacultyId);
        }

        const faculty = await (FacultyRegister as any).findById(params.id)
            .select('fullName email phone department qualification experience aboutMe cvUrl certificatesUrl createdAt status blocked')
            .lean();

        if (!faculty) {
            throw new Error(FacultyErrorType.FacultyNotFound);
        }

        return faculty;
    }

    async getFacultyByToken(params: GetFacultyByTokenRequestDTO) {
        const faculty = await (FacultyRegister as any).findById(params.facultyId)
            .select("fullName email phone department qualification experience aboutMe cvUrl certificatesUrl createdAt status confirmationToken tokenExpiry")
            .lean();
        if (!faculty) {
            return null;
        }
        return faculty;
    }

    async approveFaculty(params: ApproveFacultyRequestDTO): Promise<ApproveFacultyResponseDTO> {
        const faculty = await (FacultyRegister as any).findById(params.id);
        if (!faculty) {
            return null;
        }
        faculty.department = params.additionalInfo.department;
        if ((params.additionalInfo as any).status) faculty.status = (params.additionalInfo as any).status;
        if ((params.additionalInfo as any).confirmationToken) faculty.confirmationToken = (params.additionalInfo as any).confirmationToken;
        if ((params.additionalInfo as any).tokenExpiry) faculty.tokenExpiry = (params.additionalInfo as any).tokenExpiry;
        await faculty.save();
        return { message: "Faculty updated" };
    }

    async rejectFaculty(params: RejectFacultyRequestDTO): Promise<RejectFacultyResponseDTO> {
        const faculty = await (FacultyRegister as any).findById(params.id);
        if (!faculty) {
            return null;
        }
        faculty.status = "rejected";
        faculty.rejectedBy = "admin";
        await faculty.save();
        return { message: "Faculty registration rejected" };
    }

    async deleteFaculty(params: DeleteFacultyRequestDTO): Promise<DeleteFacultyResponseDTO> {
        const faculty = await (FacultyRegister as any).findById(params.id);
        if (!faculty) {
            return null;
        }
        await (FacultyRegister as any).deleteOne({ _id: params.id });
        return { message: "Faculty registration deleted" };
    }

    async confirmFacultyOffer(params: ConfirmFacultyOfferRequestDTO): Promise<ConfirmFacultyOfferResponseDTO> {
        const facultyRegister = await (FacultyRegister as any).findById(params.facultyId);
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

    async downloadCertificate(params: DownloadCertificateRequestDTO): Promise<DownloadCertificateResponseDTO> {
        const faculty = await (FacultyRegister as any).findById(params.facultyId);
        if (!faculty) {
            return null;
        }
        return null as any;
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

    async saveFaculty(faculty: any) {
        return faculty.save();
    }
}