import {
    ApproveFacultyResponseDTO,
    RejectFacultyResponseDTO,
    DeleteFacultyResponseDTO,
    ConfirmFacultyOfferResponseDTO,
    DownloadCertificateResponseDTO,
} from "../../../domain/faculty/dtos/FacultyResponseDTOs";
import { FacultyStatus } from "../../../domain/faculty/FacultyTypes";

export interface IFacultyRepository {
    findFaculty(query, options: { skip?: number; limit?: number; select?: string });
    countFaculty(query);
    getFacultyById(id: string);
    getFacultyByToken(token: string);
    approveFaculty(params: { id: string, additionalInfo: { status: FacultyStatus, confirmationToken: string, tokenExpiry: Date, department: string } }): Promise<ApproveFacultyResponseDTO>;
    rejectFaculty(id: string): Promise<RejectFacultyResponseDTO>;
    deleteFaculty(id: string): Promise<DeleteFacultyResponseDTO>;
    confirmFacultyOffer(params: { id: string, action: "accept" | "reject" }): Promise<ConfirmFacultyOfferResponseDTO>;
    downloadCertificate(id: string): Promise<DownloadCertificateResponseDTO>;
    blockFaculty(id: string): Promise<{ message: string }>;
    saveFaculty(faculty);
} 