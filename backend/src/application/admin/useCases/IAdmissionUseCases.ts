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
    ResponseDTO
} from "../../../domain/admin/dtos/AdmissionResponseDTOs";

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
