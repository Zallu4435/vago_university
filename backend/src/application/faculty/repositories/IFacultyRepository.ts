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

export interface IFacultyRepository {
    getFaculty(params: GetFacultyRequestDTO): Promise<GetFacultyResponseDTO>;
    getFacultyById(params: GetFacultyByIdRequestDTO): Promise<GetFacultyByIdResponseDTO>;
    approveFaculty(params: ApproveFacultyRequestDTO): Promise<ApproveFacultyResponseDTO>;
    rejectFaculty(params: RejectFacultyRequestDTO): Promise<RejectFacultyResponseDTO>;
    deleteFaculty(params: DeleteFacultyRequestDTO): Promise<DeleteFacultyResponseDTO>;
    confirmFacultyOffer(params: ConfirmFacultyOfferRequestDTO): Promise<ConfirmFacultyOfferResponseDTO>;
    downloadCertificate(params: DownloadCertificateRequestDTO): Promise<DownloadCertificateResponseDTO>;
}