import {
    GetFacultyByIdRequestDTO,
    GetFacultyByTokenRequestDTO,
    ApproveFacultyRequestDTO,
    RejectFacultyRequestDTO,
    DeleteFacultyRequestDTO,
    ConfirmFacultyOfferRequestDTO,
    DownloadCertificateRequestDTO,
} from "../../../domain/faculty/dtos/FacultyRequestDTOs";
import {
    ApproveFacultyResponseDTO,
    RejectFacultyResponseDTO,
    DeleteFacultyResponseDTO,
    ConfirmFacultyOfferResponseDTO,
    DownloadCertificateResponseDTO,
} from "../../../domain/faculty/dtos/FacultyResponseDTOs";

export interface IFacultyRepository {
    findFaculty(query, options: { skip?: number; limit?: number; select?: string });
    countFaculty(query);
    getFacultyById(params: GetFacultyByIdRequestDTO);
    getFacultyByToken(params: GetFacultyByTokenRequestDTO);
    approveFaculty(params: ApproveFacultyRequestDTO): Promise<ApproveFacultyResponseDTO>;
    rejectFaculty(params: RejectFacultyRequestDTO): Promise<RejectFacultyResponseDTO>;
    deleteFaculty(params: DeleteFacultyRequestDTO): Promise<DeleteFacultyResponseDTO>;
    confirmFacultyOffer(params: ConfirmFacultyOfferRequestDTO): Promise<ConfirmFacultyOfferResponseDTO>;
    downloadCertificate(params: DownloadCertificateRequestDTO): Promise<DownloadCertificateResponseDTO>;
    blockFaculty(id: string): Promise<{ message: string }>;
    saveFaculty(faculty);
}