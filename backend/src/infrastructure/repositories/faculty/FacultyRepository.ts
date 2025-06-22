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
} from "../../../domain/faculty/dtos/FacultyResponseDTOs";
import { IFacultyRepository } from "../../../application/faculty/repositories/IFacultyRepository";
import { Faculty as FacultyModel } from "../../database/mongoose/models/faculty.model";
import { FacultyRegister } from "../../database/mongoose/models/facultyRegister.model";


export class FacultyRepository implements IFacultyRepository {
    async getFaculty(params: GetFacultyRequestDTO): Promise<GetFacultyResponseDTO> {
        const { page = 1, limit = 5, status = "all", department = "all_departments", dateRange = "all" } = params;

        const query: any = {};
        if (status !== "all") {
            query.status = { $regex: `^${status}$`, $options: "i" };
        }
        if (department !== "all_departments") {
            const normalizedDepartment = department.replace(/_/g, "-");
            query.department = { $regex: `^${normalizedDepartment}$`, $options: "i" };
        }
        if (dateRange !== "all") {
            const now = new Date();
            let startDate: Date;
            switch (dateRange) {
                case "last7days":
                    startDate = new Date(now.setDate(now.getDate() - 7));
                    break;
                case "last30days":
                case "last_month":
                    startDate = new Date(now.setDate(now.getDate() - 30));
                    break;
                case "last90days":
                    startDate = new Date(now.setDate(now.getDate() - 90));
                    break;
                default:
                    throw new Error(`Invalid dateRange: ${dateRange}`);
            }
            query.createdAt = { $gte: startDate };
        }

        const totalFaculty = await FacultyRegister.countDocuments(query);
        const totalPages = Math.ceil(totalFaculty / limit);
        const skip = (page - 1) * limit;

        const faculty = await FacultyRegister.find(query)
            .select("fullName email phone department qualification experience aboutMe cvUrl certificatesUrl createdAt status")
            .skip(skip)
            .limit(limit)
            .lean();

        const facultyResponse: FacultyResponseDTO[] = faculty.map((f) => ({
            _id: f._id.toString(),
            fullName: f.fullName,
            email: f.email,
            phone: f.phone,
            department: f.department,
            qualification: f.qualification,
            experience: f.experience,
            aboutMe: f.aboutMe,
            cvUrl: f.cvUrl,
            certificatesUrl: f.certificatesUrl,
            createdAt: f.createdAt.toISOString(),
            status: f.status,
        }));

        return {
            faculty: facultyResponse,
            totalFaculty,
            totalPages,
            currentPage: page,
        };
    }

    async getFacultyById(params: GetFacultyByIdRequestDTO): Promise<GetFacultyByIdResponseDTO> {
        if (!mongoose.isValidObjectId(params.id)) {
            throw new Error(FacultyErrorType.InvalidFacultyId);
        }

        const faculty = await FacultyRegister.findById(params.id)
            .select("fullName email phone department qualification experience aboutMe cvUrl certificatesUrl createdAt status")
            .lean();

        if (!faculty) {
            throw new Error(FacultyErrorType.FacultyNotFound);
        }

        return {
            faculty: {
                _id: faculty._id.toString(),
                fullName: faculty.fullName,
                email: faculty.email,
                phone: faculty.phone,
                department: faculty.department,
                qualification: faculty.qualification,
                experience: faculty.experience,
                aboutMe: faculty.aboutMe,
                cvUrl: faculty.cvUrl,
                certificatesUrl: faculty.certificatesUrl,
                createdAt: faculty.createdAt.toISOString(),
                status: faculty.status,
            },
        };
    }

    async getFacultyByToken(params: GetFacultyByTokenRequestDTO): Promise<GetFacultyByTokenResponseDTO> {
        if (!mongoose.isValidObjectId(params.facultyId)) {
            throw new Error(FacultyErrorType.InvalidFacultyId);
        }

        const faculty = await FacultyRegister.findById(params.facultyId)
            .select("fullName email phone department qualification experience aboutMe cvUrl certificatesUrl createdAt status confirmationToken tokenExpiry")
            .lean();

        if (!faculty) {
            throw new Error(FacultyErrorType.FacultyNotFound);
        }

        // Validate token
        if (!faculty.confirmationToken || faculty.confirmationToken !== params.token) {
            throw new Error(FacultyErrorType.InvalidToken);
        }

        // Check if token is expired
        if (!faculty.tokenExpiry || new Date() > faculty.tokenExpiry) {
            throw new Error(FacultyErrorType.TokenExpired);
        }

        // Check if faculty status is "offered" (waiting for confirmation)
        if (faculty.status !== "offered") {
            throw new Error(FacultyErrorType.FacultyAlreadyProcessed);
        }

        return {
            faculty: {
                _id: faculty._id.toString(),
                fullName: faculty.fullName,
                email: faculty.email,
                phone: faculty.phone,
                department: faculty.department,
                qualification: faculty.qualification,
                experience: faculty.experience,
                aboutMe: faculty.aboutMe,
                cvUrl: faculty.cvUrl,
                certificatesUrl: faculty.certificatesUrl,
                createdAt: faculty.createdAt.toISOString(),
                status: faculty.status,
            },
        };
    }

    async approveFaculty(params: ApproveFacultyRequestDTO): Promise<ApproveFacultyResponseDTO> {
        if (!mongoose.isValidObjectId(params.id)) {
            throw new Error(FacultyErrorType.InvalidFacultyId);
        }

        const faculty = await FacultyRegister.findById(params.id);
        if (!faculty) {
            throw new Error(FacultyErrorType.FacultyNotFound);
        }
        if (faculty.status !== "pending") {
            throw new Error(FacultyErrorType.FacultyAlreadyProcessed);
        }

        if (!params.additionalInfo.department || !params.additionalInfo.startDate) {
            throw new Error(FacultyErrorType.MissingRequiredFields);
        }

        const confirmationToken = this.generateConfirmationToken();
        faculty.department = params.additionalInfo.department;
        faculty.status = "offered";
        faculty.confirmationToken = confirmationToken;
        faculty.tokenExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        await faculty.save();

        const baseUrl = config.frontendUrl;
        const acceptUrl = `${baseUrl}/confirm-faculty/${params.id}/accept?token=${confirmationToken}`;
        const rejectUrl = `${baseUrl}/confirm-faculty/${params.id}/reject?token=${confirmationToken}`;

        await emailService.sendFacultyOfferEmail({
            to: faculty.email,
            name: faculty.fullName,
            department: params.additionalInfo.department,
            position: params.additionalInfo.position,
            startDate: params.additionalInfo.startDate,
            salary: params.additionalInfo.salary,
            benefits: params.additionalInfo.benefits,
            additionalNotes: params.additionalInfo.additionalNotes,
            acceptUrl,
            rejectUrl,
            expiryDays: 14,
        });

        return { message: "Faculty approval email sent" };
    }

    async rejectFaculty(params: RejectFacultyRequestDTO): Promise<RejectFacultyResponseDTO> {
        if (!mongoose.isValidObjectId(params.id)) {
            throw new Error(FacultyErrorType.InvalidFacultyId);
        }

        const faculty = await FacultyRegister.findById(params.id);
        if (!faculty) {
            throw new Error(FacultyErrorType.FacultyNotFound);
        }
        if (faculty.status !== "pending") {
            throw new Error(FacultyErrorType.FacultyAlreadyProcessed);
        }

        faculty.status = "rejected";
        faculty.rejectedBy = "admin";
        await faculty.save();

        return { message: "Faculty registration rejected" };
    }

    async deleteFaculty(params: DeleteFacultyRequestDTO): Promise<DeleteFacultyResponseDTO> {
        if (!mongoose.isValidObjectId(params.id)) {
            throw new Error(FacultyErrorType.InvalidFacultyId);
        }

        const faculty = await FacultyRegister.findById(params.id);
        if (!faculty) {
            throw new Error(FacultyErrorType.FacultyNotFound);
        }
        if (faculty.status !== "pending") {
            throw new Error(FacultyErrorType.FacultyAlreadyProcessed);
        }

        await FacultyRegister.deleteOne({ _id: params.id });

        return { message: "Faculty registration deleted" };
    }

    async confirmFacultyOffer(params: ConfirmFacultyOfferRequestDTO): Promise<ConfirmFacultyOfferResponseDTO> {
        if (!mongoose.isValidObjectId(params.facultyId)) {
            throw new Error(FacultyErrorType.InvalidFacultyId);
        }

        const facultyRegister = await FacultyRegister.findById(params.facultyId);
        if (!facultyRegister) {
            throw new Error(FacultyErrorType.FacultyNotFound);
        }
        if (facultyRegister.status !== "offered") {
            throw new Error(FacultyErrorType.FacultyAlreadyProcessed);
        }
        if (!facultyRegister.confirmationToken || facultyRegister.confirmationToken !== params.token) {
            throw new Error(FacultyErrorType.InvalidToken);
        }
        if (!facultyRegister.tokenExpiry || new Date() > facultyRegister.tokenExpiry) {
            throw new Error(FacultyErrorType.TokenExpired);
        }
        if (params.action !== "accept" && params.action !== "reject") {
            throw new Error(FacultyErrorType.InvalidAction);
        }

        if (params.action === "accept") {
            facultyRegister.status = "approved";
            facultyRegister.rejectedBy = undefined;

            const temporaryPassword = generatePassword();
            const fullNameParts = facultyRegister.fullName.split(" ");
            const firstName = fullNameParts[0];
            const lastName = fullNameParts.slice(1).join(" ") || "";

            const faculty = new FacultyModel({
                firstName,
                lastName,
                email: facultyRegister.email,
                password: temporaryPassword,
                createdAt: new Date(),
            });

            await faculty.save();

            const loginUrl = `${config.frontendUrl}/faculty/login`;
            await emailService.sendFacultyCredentialsEmail({
                to: facultyRegister.email,
                name: facultyRegister.fullName,
                email: facultyRegister.email,
                password: temporaryPassword,
                loginUrl,
                department: facultyRegister.department,
                additionalInstructions: "Please log in and change your temporary password as soon as possible for security purposes.",
            });
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
        if (!Types.ObjectId.isValid(params.facultyId)) {
            throw new Error(FacultyErrorType.InvalidFacultyId);
        }

        const faculty = await FacultyRegister.findById(params.facultyId);
        if (!faculty) {
            throw new Error(FacultyErrorType.FacultyNotFound);
        }

        if (!params.certificateUrl || typeof params.certificateUrl !== "string") {
            throw new Error(FacultyErrorType.InvalidCertificateUrl);
        }

        if (!params.certificateUrl.match(/^https:\/\/res\.cloudinary\.com\/vago-university\/image\/upload\/v[0-9]+\/faculty-documents\/[a-zA-Z0-9]+\.pdf$/)) {
            throw new Error(FacultyErrorType.InvalidCertificateUrl);
        }

        if (!params.type || !["cv", "certificate"].includes(params.type.toLowerCase())) {
            throw new Error(FacultyErrorType.InvalidDocumentType);
        }

        if (!params.requestingUserId) {
            throw new Error(FacultyErrorType.AuthenticationRequired);
        }

        // Authorization check (simplified; replace with actual logic if needed)
        const isAuthorized = await this.isAdmin(params.requestingUserId) || params.requestingUserId === faculty._id.toString();
        if (!isAuthorized) {
            throw new Error(FacultyErrorType.UnauthorizedAccess);
        }

        const publicId = params.certificateUrl
            .replace(/^https:\/\/res\.cloudinary\.com\/vago-university\/image\/upload\/v[0-9]+\//, "")
            .replace(/\.pdf$/, "");

        const downloadUrl = cloudinary.url(publicId, {
            resource_type: "image",
            secure: true,
            type: "upload",
            sign_url: true,
            api_secret: config.cloudinary.apiSecret,
        });

        const response = await axios.get(downloadUrl, { responseType: "stream" });
        const fileSize = parseInt(response.headers["content-length"] || "0", 10);
        if (!fileSize) {
            throw new Error(FacultyErrorType.CertificateNotFound);
        }

        const fileName = params.certificateUrl.split("/").pop() || `${params.type}_${params.facultyId}.pdf`;
        const fileStream = response.data;

        return { fileStream, fileSize, fileName };
    }

    private generateConfirmationToken(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    private async isAdmin(userId: string): Promise<boolean> {
        // Placeholder: Implement actual admin role check
        return false;
    }
}