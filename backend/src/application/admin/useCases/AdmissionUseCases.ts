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
import { IAdmissionRepository } from "../repositories/IAdmissionRepository";
import { IEmailService } from "../../auth/service/IEmailService";
import { config } from '../../../config/config';
import {
    AdminAdmissionNotFoundError,
    AdminAdmissionAlreadyProcessedError,
    AdminInvalidTokenError,
    AdminTokenExpiredError,
    AdminRegisterUserNotFoundError,
    AdminInvalidActionError
} from '../../../domain/admin/errors/AdminAdmissionErrors';

interface ResponseDTO<T> {
    data: T | { error: string };
    success: boolean;
}

export interface IGetAdmissionsUseCase {
    execute(params: GetAdmissionsRequestDTO): Promise<ResponseDTO<GetAdmissionsResponseDTO>>;
}

export interface IGetAdmissionByIdUseCase {
    execute(params: GetAdmissionByIdRequestDTO): Promise<ResponseDTO<GetAdmissionByIdResponseDTO>>;
}

export interface IGetAdmissionByTokenUseCase {
    execute(params: GetAdmissionByTokenRequestDTO): Promise<ResponseDTO<GetAdmissionByTokenResponseDTO>>;
}

export interface IApproveAdmissionUseCase {
    execute(params: ApproveAdmissionRequestDTO): Promise<ResponseDTO<ApproveAdmissionResponseDTO>>;
}

export interface IRejectAdmissionUseCase {
    execute(params: RejectAdmissionRequestDTO): Promise<ResponseDTO<RejectAdmissionResponseDTO>>;
}

export interface IDeleteAdmissionUseCase {
    execute(params: DeleteAdmissionRequestDTO): Promise<ResponseDTO<DeleteAdmissionResponseDTO>>;
}

export interface IConfirmAdmissionOfferUseCase {
    execute(params: ConfirmAdmissionOfferRequestDTO): Promise<ResponseDTO<ConfirmAdmissionOfferResponseDTO>>;
}

export interface IBlockAdmissionUseCase {
    execute(params: { id: string }): Promise<ResponseDTO<{ message: string }>>;
}

export class GetAdmissionsUseCase implements IGetAdmissionsUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: GetAdmissionsRequestDTO): Promise<ResponseDTO<GetAdmissionsResponseDTO>> {
        // Debug logging
        console.log('Admission backend received filter values:', { 
            page: params.page, 
            limit: params.limit, 
            status: params.status, 
            program: params.program, 
            dateRange: params.dateRange, 
            startDate: params.startDate, 
            endDate: params.endDate, 
            search: params.search 
        });
        
        const result = await this.admissionRepository.getAdmissions(params);
        const admissions = await Promise.all(result.admissions.map(async (admission: any) => {
            let blocked = false;
            if (admission.personal?.emailAddress) {
                const user = await this.admissionRepository.findUserByEmail(admission.personal.emailAddress);
                blocked = user?.blocked ?? false;
            }
            return {
                _id: admission._id.toString(),
                fullName: admission.personal?.fullName || "N/A",
                email: admission.personal?.emailAddress || "N/A",
                createdAt: admission.createdAt instanceof Date ? admission.createdAt.toISOString() : new Date(admission.createdAt).toISOString(),
                status: (admission.status || "pending") as "pending" | "approved" | "rejected" | "offered",
                program: admission.choiceOfStudy?.[0]?.programme || "N/A",
                blocked,
            };
        }));
        return {
            data: {
                ...result,
                admissions,
            },
            success: true,
        };
    }
}

export class GetAdmissionByIdUseCase implements IGetAdmissionByIdUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: GetAdmissionByIdRequestDTO): Promise<ResponseDTO<GetAdmissionByIdResponseDTO>> {
        const result = await this.admissionRepository.getAdmissionById(params);
        if (!result || !result.admission) {
            throw new AdminAdmissionNotFoundError();
        }
        let blocked = false;
        if (result.admission.personal?.emailAddress) {
            const user = await this.admissionRepository.findUserByEmail(result.admission.personal.emailAddress);
            blocked = user?.blocked ?? false;
        }
        return { data: { ...result, admission: { ...result.admission, blocked } }, success: true };
    }
}

export class GetAdmissionByTokenUseCase implements IGetAdmissionByTokenUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: GetAdmissionByTokenRequestDTO): Promise<ResponseDTO<GetAdmissionByTokenResponseDTO>> {
        const result = await this.admissionRepository.getAdmissionByToken(params);
        if (!result || !result.admission) {
            throw new AdminAdmissionNotFoundError();
        }
        return { data: result, success: true };
    }
}

export class ApproveAdmissionUseCase implements IApproveAdmissionUseCase {
    constructor(
        private admissionRepository: IAdmissionRepository,
        private emailService: IEmailService,
        private config: any
    ) { }

    async execute(params: ApproveAdmissionRequestDTO): Promise<ResponseDTO<ApproveAdmissionResponseDTO>> {
        const admission = await this.admissionRepository.findAdmissionById(params.id);
        if (!admission) throw new AdminAdmissionNotFoundError();
        if (admission.status !== "pending") throw new AdminAdmissionAlreadyProcessedError();

        const confirmationToken = this.generateConfirmationToken();
        admission.confirmationToken = confirmationToken;
        admission.tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        admission.status = "offered";

        await this.admissionRepository.saveAdmission(admission);

        const acceptUrl = `${this.config.frontendUrl}/confirm-admission/${params.id}/accept?token=${confirmationToken}`;
        const rejectUrl = `${this.config.frontendUrl}/confirm-admission/${params.id}/reject?token=${confirmationToken}`;

        await this.emailService.sendAdmissionOfferEmail({
            to: admission.personal.emailAddress,
            name: admission.personal.fullName,
            programDetails: params.additionalInfo?.programDetails || "",
            startDate: admission.createdAt?.toDateString?.() || "",
            scholarshipInfo: params.additionalInfo?.scholarshipInfo || "",
            additionalNotes: params.additionalInfo?.additionalNotes || "",
            acceptUrl,
            rejectUrl,
            expiryDays: 7,
        });

        return { data: { message: "Admission offer email sent" }, success: true };
    }

    private generateConfirmationToken(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}

export class RejectAdmissionUseCase implements IRejectAdmissionUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: RejectAdmissionRequestDTO): Promise<ResponseDTO<RejectAdmissionResponseDTO>> {
        const admission = await this.admissionRepository.findAdmissionById(params.id);
        if (!admission) throw new AdminAdmissionNotFoundError();
        if (admission.status !== "pending") throw new AdminAdmissionAlreadyProcessedError();

        admission.status = "rejected";
        admission.rejectedBy = "admin";

        await this.admissionRepository.saveAdmission(admission);

        return { data: { message: "Admission rejected" }, success: true };
    }
}

export class DeleteAdmissionUseCase implements IDeleteAdmissionUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: DeleteAdmissionRequestDTO): Promise<ResponseDTO<DeleteAdmissionResponseDTO>> {
        const result = await this.admissionRepository.deleteAdmission(params);
        if (!result) {
            throw new AdminAdmissionNotFoundError();
        }
        return { data: result, success: true };
    }
}

export class ConfirmAdmissionOfferUseCase implements IConfirmAdmissionOfferUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: ConfirmAdmissionOfferRequestDTO): Promise<ResponseDTO<ConfirmAdmissionOfferResponseDTO>> {
        const result = await this.admissionRepository.confirmAdmissionOffer(params);
        if (!result) {
            throw new AdminAdmissionNotFoundError();
        }
        return { data: result, success: true };
    }
}

export class BlockAdmissionUseCase implements IBlockAdmissionUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: { id: string }): Promise<ResponseDTO<{ message: string }>> {
        const admission = await this.admissionRepository.findAdmissionById(params.id);
        if (!admission) {
            throw new AdminAdmissionNotFoundError();
        }
        const user = await this.admissionRepository.findUserByEmail(admission.personal.emailAddress);
        if (!user) {
            throw new AdminRegisterUserNotFoundError();
        }
        user.blocked = !user.blocked;
        await this.admissionRepository.saveUser(user);
        return {
            data: { message: user.blocked ? 'User blocked' : 'User unblocked' },
            success: true,
        };
    }
}