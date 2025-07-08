import {
    GetFacultyRequestDTO,
    GetFacultyByIdRequestDTO,
    GetFacultyByTokenRequestDTO,
    ApproveFacultyRequestDTO,
    RejectFacultyRequestDTO,
    DeleteFacultyRequestDTO,
    ConfirmFacultyOfferRequestDTO,
    DownloadCertificateRequestDTO,
} from "../../../domain/faculty/dtos/FacultyRequestDTOs";
import {
    GetFacultyResponseDTO,
    GetFacultyByIdResponseDTO,
    GetFacultyByTokenResponseDTO,
    ApproveFacultyResponseDTO,
    RejectFacultyResponseDTO,
    DeleteFacultyResponseDTO,
    ConfirmFacultyOfferResponseDTO,
    DownloadCertificateResponseDTO,
} from "../../../domain/faculty/dtos/FacultyResponseDTOs";

export interface IFacultyRepository {
    findFaculty(query: any, options: { skip?: number; limit?: number; select?: string }): Promise<any[]>;
    countFaculty(query: any): Promise<number>;
    getFacultyById(params: GetFacultyByIdRequestDTO): Promise<any>;
    getFacultyByToken(params: GetFacultyByTokenRequestDTO): Promise<any>;
    approveFaculty(params: ApproveFacultyRequestDTO): Promise<ApproveFacultyResponseDTO>;
    rejectFaculty(params: RejectFacultyRequestDTO): Promise<RejectFacultyResponseDTO>;
    deleteFaculty(params: DeleteFacultyRequestDTO): Promise<DeleteFacultyResponseDTO>;
    confirmFacultyOffer(params: ConfirmFacultyOfferRequestDTO): Promise<ConfirmFacultyOfferResponseDTO>;
    downloadCertificate(params: DownloadCertificateRequestDTO): Promise<DownloadCertificateResponseDTO>;
}