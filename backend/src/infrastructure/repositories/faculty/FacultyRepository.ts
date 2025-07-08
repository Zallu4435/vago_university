import mongoose, { Types } from "mongoose";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../../../config/config";
import { emailService } from "../../services/email.service";
import { generatePassword } from "../../services/passwordService";
import { FacultyErrorType } from "../../../domain/faculty/enums/FacultyErrorType";
import {
    GetFacultyRequestDTO,
    GetFacultyByIdRequestDTO,
    GetFacultyByTokenRequestDTO,
    ApproveFacultyRequestDTO,
    RejectFacultyRequestDTO,
    DeleteFacultyRequestDTO,
    ConfirmFacultyOfferRequestDTO,
    DownloadCertificateRequestDTO,
} from "../../../domain/faculty/dtos/FacultyRequestDTOs";
import {
    GetFacultyResponseDTO,
    GetFacultyByIdResponseDTO,
    GetFacultyByTokenResponseDTO,
    ApproveFacultyResponseDTO,
    RejectFacultyResponseDTO,
    DeleteFacultyResponseDTO,
    ConfirmFacultyOfferResponseDTO,
    DownloadCertificateResponseDTO,
    FacultyResponseDTO,
} from "../../../domain/faculty/dtos/FacultyResponseDTOs";
import { IFacultyRepository } from "../../../application/faculty/repositories/IFacultyRepository";
import { Faculty as FacultyModel } from "../../database/mongoose/auth/faculty.model";
import { FacultyRegister } from "../../database/mongoose/models/facultyRegister.model";


export class FacultyRepository implements IFacultyRepository {
    async findFaculty(query: any, options: { skip?: number; limit?: number; select?: string }): Promise<any[]> {
        return (FacultyRegister as any).find(query)
            .select(options.select || "")
            .skip(options.skip || 0)
            .limit(options.limit || 0)
            .lean();
    }

    async countFaculty(query: any): Promise<number> {
        return (FacultyRegister as any).countDocuments(query);
    }

    async getFacultyById(params: GetFacultyByIdRequestDTO): Promise<any> {
        if (!mongoose.isValidObjectId(params.id)) {
            throw new Error(FacultyErrorType.InvalidFacultyId);
        }

        const faculty = await (FacultyRegister as any).findById(params.id)
            .select("fullName email phone department qualification experience aboutMe cvUrl certificatesUrl createdAt status")
            .lean();

        if (!faculty) {
            throw new Error(FacultyErrorType.FacultyNotFound);
        }

        return faculty;
    }

    async getFacultyByToken(params: GetFacultyByTokenRequestDTO): Promise<any> {
        // Only perform DB fetch, no validation or business logic
        const faculty = await (FacultyRegister as any).findById(params.facultyId)
            .select("fullName email phone department qualification experience aboutMe cvUrl certificatesUrl createdAt status confirmationToken tokenExpiry")
            .lean();
        if (!faculty) {
            return null;
        }
        return faculty;
    }

    async approveFaculty(params: ApproveFacultyRequestDTO): Promise<ApproveFacultyResponseDTO> {
        // Only perform DB update, no validation or business logic
        const faculty = await (FacultyRegister as any).findById(params.id);
        if (!faculty) {
            // Still return null or throw, as the use case will handle the error
            return null;
        }
        // Only update fields as requested (department, status, confirmationToken, tokenExpiry)
        faculty.department = params.additionalInfo.department;
        if ((params.additionalInfo as any).status) faculty.status = (params.additionalInfo as any).status;
        if ((params.additionalInfo as any).confirmationToken) faculty.confirmationToken = (params.additionalInfo as any).confirmationToken;
        if ((params.additionalInfo as any).tokenExpiry) faculty.tokenExpiry = (params.additionalInfo as any).tokenExpiry;
        await faculty.save();
        return { message: "Faculty updated" };
    }

    async rejectFaculty(params: RejectFacultyRequestDTO): Promise<RejectFacultyResponseDTO> {
        // Only perform DB update, no validation or business logic
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
        // Only perform DB delete, no validation or business logic
        const faculty = await (FacultyRegister as any).findById(params.id);
        if (!faculty) {
            return null;
        }
        await (FacultyRegister as any).deleteOne({ _id: params.id });
        return { message: "Faculty registration deleted" };
    }

    async confirmFacultyOffer(params: ConfirmFacultyOfferRequestDTO): Promise<ConfirmFacultyOfferResponseDTO> {
        // Only perform DB update, no validation or business logic
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
        // Only perform DB fetch, no validation or business logic
        const faculty = await (FacultyRegister as any).findById(params.facultyId);
        if (!faculty) {
            return null;
        }
        // The rest of the logic (authorization, file fetch, etc) should be in the use case
        return null as any;
    }

    private generateConfirmationToken(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    private async isAdmin(userId: string): Promise<boolean> {
        // Placeholder: Implement actual admin role check
        return false;
    }
}