// application/auth/services/IEmailService.ts (Updated)

import {
    AdmissionOfferEmailParams,
    FacultyOfferEmailParams,
    FacultyCredentialsEmailParams,
    PasswordResetOtpEmailParams,
    RegistrationConfirmationEmailParams,
    EnquiryReplyEmailParams,
} from './EmailServiceParams'; // Import from the new file

export interface IEmailService {
    sendAdmissionOfferEmail(params: AdmissionOfferEmailParams): Promise<void>;
    sendFacultyOfferEmail(params: FacultyOfferEmailParams): Promise<void>;
    sendFacultyCredentialsEmail(params: FacultyCredentialsEmailParams): Promise<void>;
    sendPasswordResetOtpEmail(params: PasswordResetOtpEmailParams): Promise<void>;
    sendRegistrationConfirmationEmail(params: RegistrationConfirmationEmailParams): Promise<void>;
    sendEnquiryReplyEmail(params: EnquiryReplyEmailParams): Promise<void>;
}