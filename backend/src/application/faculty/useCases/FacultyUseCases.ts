import mongoose from "mongoose";
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
import { IFacultyRepository } from "../repositories/IFacultyRepository";
import { emailService } from '../../../infrastructure/services/email.service';
import { config } from '../../../config/config';
import { generatePassword } from '../../../infrastructure/services/passwordService';
import { Faculty as FacultyModel } from '../../../infrastructure/database/mongoose/auth/faculty.model';
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import {
    FacultyNotFoundError,
    FacultyAlreadyProcessedError,
    InvalidFacultyIdError,
    InvalidTokenError,
    InvalidActionError,
    MissingRequiredFieldsError,
    InvalidCertificateUrlError,
    CertificateNotFoundError,
    UnauthorizedAccessError,
    AuthenticationRequiredError,
    InvalidDocumentTypeError,
} from '../../../domain/faculty/errors/FacultyErrors';
import { FacultyFilter } from "../../../domain/faculty/entities/Faculty";

interface ResponseDTO<T> {
    data: T | { error: string };
    success: boolean;
}

export interface IGetFacultyUseCase {
    execute(params: GetFacultyRequestDTO): Promise<ResponseDTO<GetFacultyResponseDTO>>;
}

export interface IGetFacultyByIdUseCase {
    execute(params: GetFacultyByIdRequestDTO): Promise<ResponseDTO<GetFacultyByIdResponseDTO>>;
}

export interface IGetFacultyByTokenUseCase {
    execute(params: GetFacultyByTokenRequestDTO): Promise<ResponseDTO<GetFacultyByTokenResponseDTO>>;
}

export interface IApproveFacultyUseCase {
    execute(params: ApproveFacultyRequestDTO): Promise<ResponseDTO<ApproveFacultyResponseDTO>>;
}

export interface IRejectFacultyUseCase {
    execute(params: RejectFacultyRequestDTO): Promise<ResponseDTO<RejectFacultyResponseDTO>>;
}

export interface IDeleteFacultyUseCase {
    execute(params: DeleteFacultyRequestDTO): Promise<ResponseDTO<DeleteFacultyResponseDTO>>;
}

export interface IConfirmFacultyOfferUseCase {
    execute(params: ConfirmFacultyOfferRequestDTO): Promise<ResponseDTO<ConfirmFacultyOfferResponseDTO>>;
}

export interface IDownloadCertificateUseCase {
    execute(params: DownloadCertificateRequestDTO): Promise<ResponseDTO<DownloadCertificateResponseDTO>>;
}

export interface IBlockFacultyUseCase {
    execute(params: { id: string }): Promise<ResponseDTO<{ message: string }>>;
}

function mapFacultyToDTO(f): FacultyResponseDTO {
    return {
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
        createdAt: f.createdAt instanceof Date ? f.createdAt.toISOString() : new Date(f.createdAt).toISOString(),
        status: f.status,
        blocked: f.blocked,
    };
} 

export class GetFacultyUseCase implements IGetFacultyUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: GetFacultyRequestDTO): Promise<ResponseDTO<GetFacultyResponseDTO>> {
        const { page = 1, limit = 5, status = "all", department = "all_departments", dateRange = "all", search, startDate, endDate } = params;

        const query: FacultyFilter = {};

        if (status && !status.startsWith("all")) {
            query.status = { $regex: `^${status}$`, $options: "i" };
        }
        if (department && !department.startsWith("all")) {
            const normalizedDepartment = department.toLowerCase().replace(/\s+/g, '_');            
            query.department = { $regex: `^${normalizedDepartment}$`, $options: "i" };
        }

        if (dateRange && !dateRange.startsWith("all")) {
            const now = new Date();
            let calculatedStartDate: Date;
            switch (dateRange) {
                case "last_week":
                    calculatedStartDate = new Date(now.setDate(now.getDate() - 7));
                    break;
                case "last_month":
                    calculatedStartDate = new Date(now.setDate(now.getDate() - 30));
                    break;
                case "last_3_months":
                    calculatedStartDate = new Date(now.setDate(now.getDate() - 90));
                    break;
                case "custom":
                    if (startDate && endDate) {
                        const startDateTime = new Date(startDate);
                        const endDateTime = new Date(endDate);

                        endDateTime.setHours(23, 59, 59, 999);

                        query.createdAt = {
                            $gte: startDateTime,
                            $lte: endDateTime,
                        };
                    } else {
                        console.log('Custom date range missing startDate or endDate:', { startDate, endDate });
                    }
                    break;
                default:
                    throw new Error(`Invalid dateRange: ${dateRange}`);
            }
            if (dateRange !== "custom") {
                query.createdAt = { $gte: calculatedStartDate };
            }
        }

        if (search && search.trim()) {
            query.$or = [
                { fullName: { $regex: search.trim(), $options: "i" } },
                { email: { $regex: search.trim(), $options: "i" } }
            ];
        }

        const skip = (page - 1) * limit;
        const faculty = await this.facultyRepository.findFaculty(query, {
            skip,
            limit,
            select: "fullName email phone department qualification experience aboutMe cvUrl certificatesUrl createdAt status",
        });
        const totalFaculty = await this.facultyRepository.countFaculty(query);
        const totalPages = Math.ceil(totalFaculty / limit);
        const facultyResponse: FacultyResponseDTO[] = (faculty || []).map(mapFacultyToDTO);
        return {
            data: {
                faculty: facultyResponse,
                totalFaculty,
                totalPages,
                currentPage: page,
            },
            success: true,
        };
    }
}

export class GetFacultyByIdUseCase implements IGetFacultyByIdUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: GetFacultyByIdRequestDTO): Promise<ResponseDTO<GetFacultyByIdResponseDTO>> {
        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            throw new InvalidFacultyIdError();
        }
        const faculty = await this.facultyRepository.getFacultyById(params);
        if (!faculty) {
            throw new FacultyNotFoundError();
        }
        return {
            data: { faculty: mapFacultyToDTO(faculty) },
            success: true,
        };
    }
}

export class GetFacultyByTokenUseCase implements IGetFacultyByTokenUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: GetFacultyByTokenRequestDTO): Promise<ResponseDTO<GetFacultyByTokenResponseDTO>> {
        // Validation
        if (!params.facultyId || !mongoose.isValidObjectId(params.facultyId)) {
            throw new InvalidFacultyIdError();
        }
        if (!params.token) {
            throw new InvalidTokenError();
        }
        const faculty = await this.facultyRepository.getFacultyByToken(params);
        if (!faculty) {
            throw new FacultyNotFoundError();
        }
        if (faculty.status !== "offered") {
            throw new FacultyAlreadyProcessedError();
        }
        return { data: { faculty: mapFacultyToDTO(faculty) }, success: true };
    }
}

export class ApproveFacultyUseCase implements IApproveFacultyUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    private generateConfirmationToken(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    async execute(params: ApproveFacultyRequestDTO): Promise<ResponseDTO<ApproveFacultyResponseDTO>> {
        if (!params.id || !mongoose.isValidObjectId(params.id)) {
            throw new InvalidFacultyIdError();
        }
        if (!params.additionalInfo.department || !params.additionalInfo.startDate) {
            throw new MissingRequiredFieldsError();
        }

        const faculty = await this.facultyRepository.getFacultyById({ id: params.id });
        if (!faculty) {
            throw new FacultyNotFoundError();
        }
        if (faculty.status !== "pending") {
            throw new FacultyAlreadyProcessedError();
        }

        const confirmationToken = this.generateConfirmationToken();
        const tokenExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        await this.facultyRepository.approveFaculty({
            id: params.id,
            additionalInfo: {
                ...params.additionalInfo,
                status: "offered",
                confirmationToken,
                tokenExpiry,
            },
        });

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

        return { data: { message: "Faculty approval email sent" }, success: true };
    }
}

export class RejectFacultyUseCase implements IRejectFacultyUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: RejectFacultyRequestDTO): Promise<ResponseDTO<RejectFacultyResponseDTO>> {
        if (!params.id || !mongoose.isValidObjectId(params.id)) {
            throw new InvalidFacultyIdError();
        }
        const faculty = await this.facultyRepository.getFacultyById({ id: params.id });
        if (!faculty) {
            throw new FacultyNotFoundError();
        }
        if (faculty.status !== "pending") {
            throw new FacultyAlreadyProcessedError();
        }
        await this.facultyRepository.rejectFaculty(params);
        return { data: { message: "Faculty registration rejected" }, success: true };
    }
}

export class DeleteFacultyUseCase implements IDeleteFacultyUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: DeleteFacultyRequestDTO): Promise<ResponseDTO<DeleteFacultyResponseDTO>> {
        if (!params.id || !mongoose.isValidObjectId(params.id)) {
            throw new InvalidFacultyIdError();
        }
        const faculty = await this.facultyRepository.getFacultyById({ id: params.id });
        if (!faculty) {
            throw new FacultyNotFoundError();
        }
        if (faculty.status !== "pending") {
            throw new FacultyAlreadyProcessedError();
        }
        await this.facultyRepository.deleteFaculty(params);
        return { data: { message: "Faculty registration deleted" }, success: true };
    }
}

export class ConfirmFacultyOfferUseCase implements IConfirmFacultyOfferUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: ConfirmFacultyOfferRequestDTO): Promise<ResponseDTO<ConfirmFacultyOfferResponseDTO>> {
        // Validation
        if (!params.facultyId || !mongoose.isValidObjectId(params.facultyId)) {
            throw new InvalidFacultyIdError();
        }
        if (!params.token) {
            throw new InvalidTokenError();
        }
        if (params.action !== "accept" && params.action !== "reject") {
            throw new InvalidActionError();
        }
        const faculty = await this.facultyRepository.getFacultyById({ id: params.facultyId });
        if (!faculty) {
            throw new FacultyNotFoundError();
        }
        if (faculty.status !== "offered") {
            throw new FacultyAlreadyProcessedError();
        }
        if (params.action === "accept") {
            const temporaryPassword = generatePassword();
            const fullNameParts = faculty.fullName.split(" ");
            const firstName = fullNameParts[0];
            const lastName = fullNameParts.slice(1).join(" ") || "";
            const facultyAccount = new FacultyModel({
                firstName,
                lastName,
                email: faculty.email,
                password: temporaryPassword,
                createdAt: new Date(),
            });
            await facultyAccount.save();
            const loginUrl = `${config.frontendUrl}/faculty/login`;
            await emailService.sendFacultyCredentialsEmail({
                to: faculty.email,
                name: faculty.fullName,
                email: faculty.email,
                password: temporaryPassword,
                loginUrl,
                department: faculty.department,
                additionalInstructions: "Please log in and change your temporary password as soon as possible for security purposes.",
            });
        }
        await this.facultyRepository.confirmFacultyOffer(params);
        return {
            data: {
                message: params.action === "accept"
                    ? "Faculty offer accepted and faculty account created"
                    : "Faculty offer rejected",
            },
            success: true,
        };
    }
}

export class DownloadCertificateUseCase implements IDownloadCertificateUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: DownloadCertificateRequestDTO): Promise<ResponseDTO<DownloadCertificateResponseDTO>> {
        if (!params.facultyId || !mongoose.isValidObjectId(params.facultyId)) {
            throw new InvalidFacultyIdError();
        }
        if (!params.certificateUrl || typeof params.certificateUrl !== "string") {
            throw new InvalidCertificateUrlError();
        }
        if (!params.certificateUrl.match(/^https:\/\/res\.cloudinary\.com\/vago-university\/image\/upload\/v[0-9]+\/faculty-documents\/[a-zA-Z0-9]+\.pdf$/)) {
            throw new InvalidCertificateUrlError();
        }
        if (!params.type || !["cv", "certificate"].includes(params.type.toLowerCase())) {
            throw new InvalidDocumentTypeError();
        }
        if (!params.requestingUserId) {
            throw new AuthenticationRequiredError();
        }
        const faculty = await this.facultyRepository.getFacultyById({ id: params.facultyId });
        if (!faculty) {
            throw new FacultyNotFoundError();
        }
        const isAuthorized = params.requestingUserId === faculty._id;
        if (!isAuthorized) {
            throw new UnauthorizedAccessError();
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
            throw new CertificateNotFoundError();
        }
        const fileName = params.certificateUrl.split("/").pop() || `${params.type}_${params.facultyId}.pdf`;
        const fileStream = response.data;
        return { data: { fileStream, fileSize, fileName }, success: true };
    }
}

export class BlockFacultyUseCase implements IBlockFacultyUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: { id: string }): Promise<ResponseDTO<{ message: string }>> {
        const result = await this.facultyRepository.blockFaculty(params.id);
        return { data: result, success: true };
    }
}