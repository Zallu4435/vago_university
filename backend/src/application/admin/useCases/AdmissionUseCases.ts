import {
    GetAdmissionsRequestDTO,
    GetAdmissionByIdRequestDTO,
    ApproveAdmissionRequestDTO,
    RejectAdmissionRequestDTO,
    DeleteAdmissionRequestDTO,
    ConfirmAdmissionOfferRequestDTO,
} from "../../../domain/admin/dtos/AdmissionRequestDTOs";
import {
    GetAdmissionsResponseDTO,
    GetAdmissionByIdResponseDTO,
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
            console.log(`Executing getAdmissions use case with params:`, params);
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
            console.log(`Executing getAdmissionById use case with id: ${params.id}`);
            const result = await this.admissionRepository.getAdmissionById(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetAdmissionByIdUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.AdmissionNotFound }, success: false };
        }
    }
}

export class ApproveAdmissionUseCase implements IApproveAdmissionUseCase {
    constructor(private admissionRepository: IAdmissionRepository) { }

    async execute(params: ApproveAdmissionRequestDTO): Promise<ResponseDTO<ApproveAdmissionResponseDTO>> {
        try {
            console.log(`Executing approveAdmission use case with id: ${params.id}`);
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
            console.log(`Executing rejectAdmission use case with id: ${params.id}`);
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
            console.log(`Executing deleteAdmission use case with id: ${params.id}`);
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
            console.log(`Executing confirmAdmissionOffer use case with id: ${params.admissionId}, action: ${params.action}`);
            const result = await this.admissionRepository.confirmAdmissionOffer(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("ConfirmAdmissionOfferUseCase: Error:", error);
            return { data: { error: error.message || AdmissionErrorType.InvalidToken }, success: false };
        }
    }
}