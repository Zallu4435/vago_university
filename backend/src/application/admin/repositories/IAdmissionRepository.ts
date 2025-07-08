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
  
  export interface IAdmissionRepository {
    getAdmissions(params: GetAdmissionsRequestDTO): Promise<GetAdmissionsResponseDTO>;
    getAdmissionById(params: GetAdmissionByIdRequestDTO): Promise<GetAdmissionByIdResponseDTO>;
    getAdmissionByToken(params: GetAdmissionByTokenRequestDTO): Promise<GetAdmissionByTokenResponseDTO>;
    approveAdmission(params: ApproveAdmissionRequestDTO): Promise<ApproveAdmissionResponseDTO>;
    rejectAdmission(params: RejectAdmissionRequestDTO): Promise<RejectAdmissionResponseDTO>;
    deleteAdmission(params: DeleteAdmissionRequestDTO): Promise<DeleteAdmissionResponseDTO>;
    confirmAdmissionOffer(params: ConfirmAdmissionOfferRequestDTO): Promise<ConfirmAdmissionOfferResponseDTO>;
    findAdmissionById(id: string): Promise<any>;
    saveAdmission(admission: any): Promise<any>;
  }