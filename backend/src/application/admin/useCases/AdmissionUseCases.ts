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
import { AdmissionErrorType } from "../../../domain/admission/enums/AdmissionErrorType";
import { IAdmissionRepository } from "../repositories/IAdmissionRepository";

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

export class GetAdmissionsUseCase implements IGetAdmissionsUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: GetAdmissionsRequestDTO): Promise<ResponseDTO<GetAdmissionsResponseDTO>> {
        try {
            const result = await this.admissionRepository.getAdmissions(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetAdmissionsUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.AdmissionNotFound }, success: false };
        }
    }
}

export class GetAdmissionByIdUseCase implements IGetAdmissionByIdUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: GetAdmissionByIdRequestDTO): Promise<ResponseDTO<GetAdmissionByIdResponseDTO>> {
        try {
            const result = await this.admissionRepository.getAdmissionById(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetAdmissionByIdUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.AdmissionNotFound }, success: false };
        }
    }
}

export class GetAdmissionByTokenUseCase implements IGetAdmissionByTokenUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: GetAdmissionByTokenRequestDTO): Promise<ResponseDTO<GetAdmissionByTokenResponseDTO>> {
        try {
            const result = await this.admissionRepository.getAdmissionByToken(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetAdmissionByTokenUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.AdmissionNotFound }, success: false };
        }
    }
}

export class ApproveAdmissionUseCase implements IApproveAdmissionUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: ApproveAdmissionRequestDTO): Promise<ResponseDTO<ApproveAdmissionResponseDTO>> {
        try {
            const result = await this.admissionRepository.approveAdmission(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("ApproveAdmissionUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.AdmissionAlreadyProcessed }, success: false };
        }
    }
}

export class RejectAdmissionUseCase implements IRejectAdmissionUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: RejectAdmissionRequestDTO): Promise<ResponseDTO<RejectAdmissionResponseDTO>> {
        try {
            const result = await this.admissionRepository.rejectAdmission(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("RejectAdmissionUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.AdmissionAlreadyProcessed }, success: false };
        }
    }
}

export class DeleteAdmissionUseCase implements IDeleteAdmissionUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: DeleteAdmissionRequestDTO): Promise<ResponseDTO<DeleteAdmissionResponseDTO>> {
        try {
            const result = await this.admissionRepository.deleteAdmission(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("DeleteAdmissionUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.AdmissionNotFound }, success: false };
        }
    }
}

export class ConfirmAdmissionOfferUseCase implements IConfirmAdmissionOfferUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: ConfirmAdmissionOfferRequestDTO): Promise<ResponseDTO<ConfirmAdmissionOfferResponseDTO>> {
        try {
            const result = await this.admissionRepository.confirmAdmissionOffer(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("ConfirmAdmissionOfferUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.InvalidToken }, success: false };
        }
    }
}