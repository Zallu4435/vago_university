import { emailService } from "../../services/email.service";
import { config } from "../../../config/config";
import { AdmissionErrorType } from "../../../domain/admin/enums/AdmissionErrorType";
import {
    GetAdmissionsRequestDTO,
    GetAdmissionByIdRequestDTO,
    GetAdmissionByTokenRequestDTO,
    ApproveAdmissionRequestDTO,
    RejectAdmissionRequestDTO,
    DeleteAdmissionRequestDTO,
    ConfirmAdmissionOfferRequestDTO,
} from "../../../domain/admin/dtos/AdmissionRequestDTOs";
import {
    GetAdmissionsResponseDTO,
    GetAdmissionByIdResponseDTO,
    GetAdmissionByTokenResponseDTO,
    ApproveAdmissionResponseDTO,
    RejectAdmissionResponseDTO,
    DeleteAdmissionResponseDTO,
    ConfirmAdmissionOfferResponseDTO,
} from "../../../domain/admin/dtos/AdmissionResponseDTOs";
import { IAdmissionRepository } from "../../../application/admin/repositories/IAdmissionRepository";
import { Admission as AdmissionModel } from '../../database/mongoose/admission/AdmissionModel'
import { Register } from "../../database/mongoose/models/register.model";
import { User } from "../../database/mongoose/models/user.model";
import { ProgramModel } from "../../database/mongoose/models/studentProgram.model";


export class AdmissionRepository implements IAdmissionRepository {
    async getAdmissions(params: GetAdmissionsRequestDTO): Promise<GetAdmissionsResponseDTO> {
        const { page = 1, limit = 5, status = "all", program = "all", dateRange = "all", startDate, endDate } = params;

        const filter: Record<string, any> = {};
        if (status !== "all") {
            filter.status = status === "approved" ? { $in: ["approved", "offered"] } : status;
        }
        if (program !== "all" && program !== "all_programs") {
            filter.choiceOfStudy = {
                $elemMatch: {
                    programme: { $regex: `^${program}$`, $options: "i" },
                },
            };
        }
        if (dateRange !== "all") {
            const now = new Date();
            if (dateRange === "last_week") {
                filter.createdAt = {
                    $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                };
            } else if (dateRange === "last_month") {
                filter.createdAt = {
                    $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
                };
            } else if (dateRange === "last_3_months") {
                filter.createdAt = {
                    $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
                };
            } else if (dateRange === "custom" && startDate && endDate) {
                filter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }
        }

        const skip = (page - 1) * limit;
        const projection = {
            _id: 1,
            "personal.fullName": 1,
            "personal.emailAddress": 1,
            createdAt: 1,
            status: 1,
            choiceOfStudy: 1,
        };

        const admissionsRaw = await AdmissionModel.find(filter)
            .select(projection)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const admissions = admissionsRaw.map((admission) => ({
            _id: admission._id.toString(),
            fullName: admission.personal?.fullName || "N/A",
            email: admission.personal?.emailAddress || "N/A",
            createdAt: admission.createdAt.toISOString(),
            status: admission.status || "pending",
            program: admission.choiceOfStudy?.[0]?.programme || "N/A",
        }));

        const totalAdmissions = await AdmissionModel.countDocuments(filter);
        const totalPages = Math.ceil(totalAdmissions / limit);

        return {
            admissions,
            totalAdmissions,
            totalPages,
            currentPage: page,
        };
    }

    async getAdmissionById(params: GetAdmissionByIdRequestDTO): Promise<GetAdmissionByIdResponseDTO> {
        const admission = await AdmissionModel.findById(params.id).lean();
        if (!admission) {
            throw new Error(AdmissionErrorType.AdmissionNotFound);
        }
        return { admission };
    }

    async getAdmissionByToken(params: GetAdmissionByTokenRequestDTO): Promise<GetAdmissionByTokenResponseDTO> {

        const admission = await AdmissionModel.findById(params.admissionId)
            .select("personal choiceOfStudy status confirmationToken tokenExpiry")
            .lean();


        if (!admission) {
            throw new Error(AdmissionErrorType.AdmissionNotFound);
        }


        if (!admission.confirmationToken || admission.confirmationToken !== params.token) {
            throw new Error(AdmissionErrorType.InvalidToken);
        }

        // Check if token is expired
        if (!admission.tokenExpiry || new Date() > admission.tokenExpiry) {
            throw new Error(AdmissionErrorType.TokenExpired);
        }

        if (admission.status !== "offered") {
            throw new Error(AdmissionErrorType.AdmissionAlreadyProcessed);
        }

        return { admission };
    }

    async approveAdmission(params: ApproveAdmissionRequestDTO): Promise<ApproveAdmissionResponseDTO> {
        const admission = await AdmissionModel.findById(params.id);
        if (!admission) {
            throw new Error(AdmissionErrorType.AdmissionNotFound);
        }
        if (admission.status !== "pending") {
            throw new Error(AdmissionErrorType.AdmissionAlreadyProcessed);
        }

        const confirmationToken = this.generateConfirmationToken();
        admission.confirmationToken = confirmationToken;
        admission.tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        admission.status = "offered";
        await admission.save();

        const acceptUrl = `${config.frontendUrl}/confirm-admission/${params.id}/accept?token=${confirmationToken}`;
        const rejectUrl = `${config.frontendUrl}/confirm-admission/${params.id}/reject?token=${confirmationToken}`;

        await emailService.sendAdmissionOfferEmail({
            to: admission.personal.emailAddress,
            name: admission.personal.fullName,
            programDetails: params.additionalInfo?.programDetails || "",
            startDate: admission.createdAt.toDateString() || "",
            scholarshipInfo: params.additionalInfo?.scholarshipInfo || "",
            additionalNotes: params.additionalInfo?.additionalNotes || "",
            acceptUrl,
            rejectUrl,
            expiryDays: 7,
        });

        return { message: "Admission offer email sent" };
    }

    async rejectAdmission(params: RejectAdmissionRequestDTO): Promise<RejectAdmissionResponseDTO> {
        const admission = await AdmissionModel.findById(params.id);
        if (!admission) {
            throw new Error(AdmissionErrorType.AdmissionNotFound);
        }
        if (admission.status !== "pending") {
            throw new Error(AdmissionErrorType.AdmissionAlreadyProcessed);
        }

        admission.status = "rejected";
        admission.rejectedBy = "admin";
        await admission.save();

        return { message: "Admission rejected" };
    }

    async deleteAdmission(params: DeleteAdmissionRequestDTO): Promise<DeleteAdmissionResponseDTO> {
        const admission = await AdmissionModel.findById(params.id);
        if (!admission) {
            throw new Error(AdmissionErrorType.AdmissionNotFound);
        }
        if (admission.status !== "pending") {
            throw new Error(AdmissionErrorType.AdmissionAlreadyProcessed);
        }

        await AdmissionModel.deleteOne({ _id: params.id });

        return { message: "Admission deleted" };
    }

    async confirmAdmissionOffer(params: ConfirmAdmissionOfferRequestDTO): Promise<ConfirmAdmissionOfferResponseDTO> {
        const admission = await AdmissionModel.findById(params.admissionId);
        if (!admission) {
            throw new Error(AdmissionErrorType.AdmissionNotFound);
        }
        if (admission.status !== "offered") {
            throw new Error(AdmissionErrorType.AdmissionAlreadyProcessed);
        }
        if (!admission.confirmationToken || admission.confirmationToken !== params.token) {
            throw new Error(AdmissionErrorType.InvalidToken);
        }
        if (!admission.tokenExpiry || new Date() > admission.tokenExpiry) {
            throw new Error(AdmissionErrorType.TokenExpired);
        }
        if (params.action !== "accept" && params.action !== "reject") {
            throw new Error(AdmissionErrorType.InvalidAction);
        }

        if (params.action === "accept") {
            admission.status = "approved";
            admission.rejectedBy = undefined;

            const registerUser = await Register.findById(admission.registerId);
            if (!registerUser) {
                throw new Error(AdmissionErrorType.RegisterUserNotFound);
            }

            const fullNameParts = admission.personal.fullName.split(" ");
            const firstName = fullNameParts[0];
            const lastName = fullNameParts.slice(1).join(" ") || "";

            const user = new User({
                firstName,
                lastName,
                email: admission.personal.emailAddress,
                password: registerUser.password,
                createdAt: new Date(),
            });

            await user.save();

            let degree = "";
            let catalogYear = "";

            const currentYear = new Date().getFullYear();
            const yearRange = `${currentYear}-${currentYear + 4}`;

            if (admission.choiceOfStudy && admission.choiceOfStudy.length > 0) {
                degree = admission.choiceOfStudy[0]?.programme || "";
                catalogYear = admission.choiceOfStudy[0]?.catalogYear || yearRange;
            }

            if (degree && catalogYear) {
                await ProgramModel.create({
                    studentId: user._id,
                    degree,
                    catalogYear,
                    credits: 20,
                });
            }

        } else {
            admission.status = "rejected";
            admission.rejectedBy = "user";
        }

        admission.confirmationToken = undefined;
        admission.tokenExpiry = undefined;
        await admission.save();

        return {
            message: params.action === "accept"
                ? "Admission accepted and user account created"
                : "Admission offer rejected",
        };
    }

    private generateConfirmationToken(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}