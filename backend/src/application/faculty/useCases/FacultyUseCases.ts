import mongoose from "mongoose";
import {
    GetFacultyRequestDTO,
    GetFacultyByIdRequestDTO,
    ApproveFacultyRequestDTO,
    RejectFacultyRequestDTO,
    DeleteFacultyRequestDTO,
    ConfirmFacultyOfferRequestDTO,
    DownloadCertificateRequestDTO,
} from "../../../domain/faculty/dtos/FacultyRequestDTOs";
import {
    GetFacultyResponseDTO,
    GetFacultyByIdResponseDTO,
    ApproveFacultyResponseDTO,
    RejectFacultyResponseDTO,
    DeleteFacultyResponseDTO,
    ConfirmFacultyOfferResponseDTO,
    DownloadCertificateResponseDTO,
} from "../../../domain/faculty/dtos/FacultyResponseDTOs";
import { FacultyErrorType } from "../../../domain/faculty/enums/FacultyErrorType";
import { IFacultyRepository } from "../repositories/IFacultyRepository";

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

export class GetFacultyUseCase implements IGetFacultyUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: GetFacultyRequestDTO): Promise<ResponseDTO<GetFacultyResponseDTO>> {
        try {
            const result = await this.facultyRepository.getFaculty(params);
            return { data: result, success: true };
        } catch (error: any) {
            return { data: { error: error.message || FacultyErrorType.FacultyNotFound }, success: false };
        }
    }
}

export class GetFacultyByIdUseCase implements IGetFacultyByIdUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: GetFacultyByIdRequestDTO): Promise<ResponseDTO<GetFacultyByIdResponseDTO>> {
        try {
            if (!mongoose.Types.ObjectId.isValid(params.id)) {
                return { data: { error: FacultyErrorType.InvalidFacultyId }, success: false };
            }
            const result = await this.facultyRepository.getFacultyById(params);
            return { data: result, success: true };
        } catch (error: any) {
            return { data: { error: error.message || FacultyErrorType.FacultyNotFound }, success: false };
        }
    }
}

export class ApproveFacultyUseCase implements IApproveFacultyUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: ApproveFacultyRequestDTO): Promise<ResponseDTO<ApproveFacultyResponseDTO>> {
        try {
            const result = await this.facultyRepository.approveFaculty(params);
            return { data: result, success: true };
        } catch (error: any) {
            return { data: { error: error.message || FacultyErrorType.FacultyAlreadyProcessed }, success: false };
        }
    }
}

export class RejectFacultyUseCase implements IRejectFacultyUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: RejectFacultyRequestDTO): Promise<ResponseDTO<RejectFacultyResponseDTO>> {
        try {
            const result = await this.facultyRepository.rejectFaculty(params);
            return { data: result, success: true };
        } catch (error: any) {
            return { data: { error: error.message || FacultyErrorType.FacultyAlreadyProcessed }, success: false };
        }
    }
}

export class DeleteFacultyUseCase implements IDeleteFacultyUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: DeleteFacultyRequestDTO): Promise<ResponseDTO<DeleteFacultyResponseDTO>> {
        try {
            const result = await this.facultyRepository.deleteFaculty(params);
            return { data: result, success: true };
        } catch (error: any) {
            return { data: { error: error.message || FacultyErrorType.FacultyNotFound }, success: false };
        }
    }
}

export class ConfirmFacultyOfferUseCase implements IConfirmFacultyOfferUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: ConfirmFacultyOfferRequestDTO): Promise<ResponseDTO<ConfirmFacultyOfferResponseDTO>> {
        try {
            const result = await this.facultyRepository.confirmFacultyOffer(params);
            return { data: result, success: true };
        } catch (error: any) {
            return { data: { error: error.message || FacultyErrorType.InvalidToken }, success: false };
        }
    }
}

export class DownloadCertificateUseCase implements IDownloadCertificateUseCase {
    constructor(private facultyRepository: IFacultyRepository) { }

    async execute(params: DownloadCertificateRequestDTO): Promise<ResponseDTO<DownloadCertificateResponseDTO>> {
        try {
            const result = await this.facultyRepository.downloadCertificate(params);
            return { data: result, success: true };
        } catch (error: any) {
            return { data: { error: error.message || FacultyErrorType.CertificateNotFound }, success: false };
        }
    }
}