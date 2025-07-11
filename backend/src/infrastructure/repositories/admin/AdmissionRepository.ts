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
    ApproveAdmissionResponseDTO,
    RejectAdmissionResponseDTO,
    DeleteAdmissionResponseDTO,
    ConfirmAdmissionOfferResponseDTO,
} from "../../../domain/admin/dtos/AdmissionResponseDTOs";
import { IAdmissionRepository } from "../../../application/admin/repositories/IAdmissionRepository";
import { Admission as AdmissionModel } from '../../database/mongoose/admission/AdmissionModel'
import { Register } from "../../database/mongoose/auth/register.model";
import { User } from "../../database/mongoose/auth/user.model";
import { ProgramModel } from "../../database/mongoose/models/studentProgram.model";


export class AdmissionRepository implements IAdmissionRepository {
    async getAdmissions(params: GetAdmissionsRequestDTO): Promise<any> {
        const { page = 1, limit = 5, status = "all", program = "all", dateRange = "all", startDate, endDate, search } = params;

        // Debug logging
        console.log('Backend received filter values:', { page, limit, status, program, dateRange, startDate, endDate, search });

        const filter: Record<string, any> = {};
        
        // Handle status filter - accept "all", "all_status", "all_statuses", etc.
        if (status && !status.startsWith("all")) {
            filter.status = status === "approved" ? { $in: ["approved", "offered"] } : status;
        }
        
        // Handle program filter - accept "all", "all_program", "all_programs", etc.
        if (program && !program.startsWith("all")) {
            // Convert frontend program name to database format
            // e.g., "computer_science" -> "Computer Science"
            const normalizedProgram = program.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            console.log('Program filter:', { original: program, normalized: normalizedProgram });
            
            filter.choiceOfStudy = {
                $elemMatch: {
                    programme: { $regex: `^${normalizedProgram}$`, $options: "i" },
                },
            };
        }
        
        // Handle date range filter - accept "all", "all_date", "all_dates", etc.
        if (dateRange && !dateRange.startsWith("all")) {
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
                console.log('Processing custom date range:', { startDate, endDate });
                const startDateTime = new Date(startDate);
                const endDateTime = new Date(endDate);
                
                // Set end date to end of day (23:59:59.999)
                endDateTime.setHours(23, 59, 59, 999);
                
                console.log('Processed dates:', { 
                    startDateTime: startDateTime.toISOString(), 
                    endDateTime: endDateTime.toISOString() 
                });
                
                filter.createdAt = {
                    $gte: startDateTime,
                    $lte: endDateTime,
                };
            }
        }
        
        // Add search functionality
        if (search && search.trim()) {
            filter.$or = [
                { "personal.fullName": { $regex: search.trim(), $options: "i" } },
                { "personal.emailAddress": { $regex: search.trim(), $options: "i" } }
            ];
        }

        console.log('Admission backend final query object:', filter);

        const skip = (page - 1) * limit;
        const projection = {
            _id: 1,
            "personal.fullName": 1,
            "personal.emailAddress": 1,
            createdAt: 1,
            status: 1,
            choiceOfStudy: 1,
        };

        // Debug: Show all unique programs in the database
        if (program && !program.startsWith("all")) {
            const allAdmissions = await AdmissionModel.find({}).select('choiceOfStudy').lean();
            const allPrograms = allAdmissions
                .map(admission => admission.choiceOfStudy?.[0]?.programme)
                .filter(Boolean);
            const uniquePrograms = [...new Set(allPrograms)];
            console.log('All programs in database:', uniquePrograms);
            console.log('Exact query being executed:', JSON.stringify(filter, null, 2));
        }

        const admissions = await AdmissionModel.find(filter)
            .select(projection)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalAdmissions = await AdmissionModel.countDocuments(filter);
        const totalPages = Math.ceil(totalAdmissions / limit);

        console.log('Backend query results:', { totalAdmissions, totalPages, admissionsCount: admissions.length });

        return {
            admissions, // raw admissions, not mapped
            totalAdmissions,
            totalPages,
            currentPage: page,
        };
    }

    async getAdmissionById(params: GetAdmissionByIdRequestDTO): Promise<any> {
        const admission = await AdmissionModel.findById(params.id).lean();
        if (!admission) {
            throw new Error(AdmissionErrorType.AdmissionNotFound);
        }
        return { admission };
    }

    async getAdmissionByToken(params: GetAdmissionByTokenRequestDTO): Promise<any> {

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

    async findAdmissionById(id: string) {
        return AdmissionModel.findById(id);
    }

    async saveAdmission(admission: any) {
        return admission.save();
    }

    async findUserByEmail(email: string) {
        return User.findOne({ email });
    }

    async saveUser(user: any) {
        return user.save();
    }

    async approveAdmission(params: ApproveAdmissionRequestDTO): Promise<ApproveAdmissionResponseDTO> {
        throw new Error('Business logic moved to use case layer. Use findAdmissionById and saveAdmission instead.');
    }

    async rejectAdmission(params: RejectAdmissionRequestDTO): Promise<RejectAdmissionResponseDTO> {
        throw new Error('Business logic moved to use case layer. Use findAdmissionById and saveAdmission instead.');
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
            admission.status = "approved" as any;
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
            admission.status = "rejected" as any;
            admission.rejectedBy = "user" as any;
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