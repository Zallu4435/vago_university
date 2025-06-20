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
  
  export interface IAdmissionRepository {
    getAdmissions(params: GetAdmissionsRequestDTO): Promise<GetAdmissionsResponseDTO>;
    getAdmissionById(params: GetAdmissionByIdRequestDTO): Promise<GetAdmissionByIdResponseDTO>;
    approveAdmission(params: ApproveAdmissionRequestDTO): Promise<ApproveAdmissionResponseDTO>;
    rejectAdmission(params: RejectAdmissionRequestDTO): Promise<RejectAdmissionResponseDTO>;
    deleteAdmission(params: DeleteAdmissionRequestDTO): Promise<DeleteAdmissionResponseDTO>;
    confirmAdmissionOffer(params: ConfirmAdmissionOfferRequestDTO): Promise<ConfirmAdmissionOfferResponseDTO>;
  }