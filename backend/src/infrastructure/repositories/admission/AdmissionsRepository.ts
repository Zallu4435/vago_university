import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import { AdmissionDraft, Admission } from "../../../domain/admission/entities/Admission";
import { AdmissionErrorType } from "../../../domain/admission/enums/AdmissionErrorType";
import {
    CreateApplicationRequestDTO,
    GetApplicationRequestDTO,
    SaveSectionRequestDTO,
    ProcessPaymentRequestDTO,
    ConfirmPaymentRequestDTO,
    FinalizeAdmissionRequestDTO,
    UploadDocumentRequestDTO,
    UploadMultipleDocumentsRequestDTO,
} from "../../../domain/admission/dtos/AdmissionRequestDTOs";
import {
    CreateApplicationResponseDTO,
    GetApplicationResponseDTO,
    SaveSectionResponseDTO,
    ProcessPaymentResponseDTO,
    ConfirmPaymentResponseDTO,
    FinalizeAdmissionResponseDTO,
    UploadDocumentResponseDTO,
    UploadMultipleDocumentsResponseDTO,
} from "../../../domain/admission/dtos/AdmissionResponseDTOs";

import { IAdmissionsRepository } from "../../../application/admission/repositories/IAdmissionsRepository";
import { AdmissionDraft as AdmissionDraftModel } from "../../database/mongoose/admission/AdmissionDraftModel";
import { Admission as AdmissionModel } from "../../database/mongoose/models/admission.model";
import { PaymentModel } from "../../database/mongoose/models/financial.model";
import { DocumentUploadService } from '../../services/admission/DocumentUploadService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-04-30.basil" });

export class AdmissionsRepository implements IAdmissionsRepository {
    private documentUploadService: DocumentUploadService;

    constructor() {
        this.documentUploadService = new DocumentUploadService();
    }

    async createApplication(params: CreateApplicationRequestDTO): Promise<CreateApplicationResponseDTO> {
        let draft = await AdmissionDraftModel.findOne({ registerId: params.userId });
        if (draft) {
            return { applicationId: draft.applicationId };
        }

        const applicationId = uuidv4();
        draft = new AdmissionDraftModel({
            applicationId,
            registerId: params.userId,
            personal: {},
            choiceOfStudy: [],
            education: {},
            achievements: {},
            otherInformation: {},
            documents: {},
            declaration: {},
            completedSteps: [],
        });
        await draft.save();

        return { applicationId: draft.applicationId };
    }

    async getApplication(params: GetApplicationRequestDTO): Promise<GetApplicationResponseDTO> {
        const draft = await AdmissionDraftModel.findOne({ registerId: params.userId }).lean();
        if (!draft) {
            return { draft: null };
        }
        return {
            draft: new AdmissionDraft({
                applicationId: draft.applicationId,
                registerId: draft.registerId,
                personal: draft.personal,
                choiceOfStudy: draft.choiceOfStudy,
                education: draft.education,
                achievements: draft.achievements,
                otherInformation: draft.otherInformation,
                documents: draft.documents,
                declaration: draft.declaration,
                completedSteps: draft.completedSteps,
                createdAt: draft.createdAt,
                updatedAt: draft.updatedAt,
            }),
        };
    }

    async saveSection(params: SaveSectionRequestDTO): Promise<SaveSectionResponseDTO> {
        const draft = await AdmissionDraftModel.findOne({ applicationId: params.applicationId });
        if (!draft) {
            throw new Error(AdmissionErrorType.ApplicationNotFound);
        }

        const sectionMap: { [key: string]: string } = {
            personalInfo: "personal",
            choiceOfStudy: "choiceOfStudy",
            education: "education",
            achievements: "achievements",
            otherInformation: "otherInformation",
            documents: "documents",
            declaration: "declaration",
        };

        const field = sectionMap[params.section];
        if (!field) {
            throw new Error(AdmissionErrorType.InvalidSection);
        }

        draft[field] = params.data;
        if (!draft.completedSteps.includes(field)) {
            draft.completedSteps.push(field);
        }
        await draft.save();

        return {
            success: true,
            message: "Section saved successfully",
            data: new AdmissionDraft({
                applicationId: draft.applicationId,
                registerId: draft.registerId,
                personal: draft.personal,
                choiceOfStudy: draft.choiceOfStudy,
                education: draft.education,
                achievements: draft.achievements,
                otherInformation: draft.otherInformation,
                documents: draft.documents,
                declaration: draft.declaration,
                completedSteps: draft.completedSteps,
                createdAt: draft.createdAt,
                updatedAt: draft.updatedAt,
            }),
        };
    }

    async processPayment(params: ProcessPaymentRequestDTO): Promise<ProcessPaymentResponseDTO> {
        const { applicationId, paymentDetails } = params;
        const draft = await AdmissionDraftModel.findOne({ applicationId });
        if (!draft) throw new Error(AdmissionErrorType.ApplicationNotFound);

        const payment = new PaymentModel({
            studentId: draft.registerId,
            date: new Date(),
            description: "Admission Application Fee",
            method: paymentDetails.method,
            amount: paymentDetails.amount,
            status: "Pending",
            metadata: {
                currency: paymentDetails.currency,
                paymentMethodId: paymentDetails.paymentMethodId,
                applicationId: applicationId,
            }
        });
        await payment.save();

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(paymentDetails.amount * 100),
                currency: paymentDetails.currency.toLowerCase(),
                automatic_payment_methods: { enabled: true, allow_redirects: "never" },
                confirm: false, // let frontend confirm
                payment_method: paymentDetails.paymentMethodId,
                metadata: {
                    paymentId: payment._id.toString(),
                    applicationId: applicationId,
                    studentId: draft.registerId.toString(),
                }
            });

            payment.metadata = {
                ...payment.metadata,
                stripePaymentIntentId: paymentIntent.id,
                returnUrl: paymentDetails.returnUrl,
                clientSecret: paymentIntent.client_secret,
            };
            await payment.save();

            return {
                paymentId: payment._id.toString(),
                status: "pending",
                message: "Payment created successfully. Please complete the payment.",
                clientSecret: paymentIntent.client_secret,
                stripePaymentIntentId: paymentIntent.id,
            };
        } catch (error) {
            payment.status = "Failed";
            payment.metadata = {
                ...payment.metadata,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            await payment.save();

            throw new Error(`Payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async confirmPayment(params: ConfirmPaymentRequestDTO): Promise<ConfirmPaymentResponseDTO> {
        const { paymentId, stripePaymentIntentId } = params;
        const payment = await PaymentModel.findById(paymentId);
        if (!payment) throw new Error(AdmissionErrorType.PaymentNotFound);

        try {
            const paymentIntent = await stripe.paymentIntents.confirm(stripePaymentIntentId, {
                payment_method: payment.metadata?.paymentMethodId,
            });

            const stripeStatus = paymentIntent.status;
            const paymentStatus = this.mapStripeStatusToPaymentStatus(stripeStatus);


            payment.status = paymentStatus === "completed" ? "Completed" :
                paymentStatus === "pending" ? "Pending" : "Failed";

            payment.metadata = {
                ...payment.metadata,
                stripeStatus: stripeStatus,
                confirmedAt: new Date(),
                lastChecked: new Date(),
            };

            await payment.save();

            return {
                paymentId: payment._id.toString(),
                status: paymentStatus,
                message: this.getPaymentMessage(stripeStatus),
                stripePaymentIntentId: stripePaymentIntentId,
            };
        } catch (error) {
            console.error('Error confirming payment:', error);
            payment.status = "Failed";
            payment.metadata = {
                ...payment.metadata,
                confirmationError: error instanceof Error ? error.message : 'Unknown error',
                lastError: new Date(),
            };
            await payment.save();

            throw new Error(`Payment confirmation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async finalizeAdmission(params: FinalizeAdmissionRequestDTO): Promise<FinalizeAdmissionResponseDTO> {
        const draft = await AdmissionDraftModel.findOne({ applicationId: params.applicationId });
        if (!draft) throw new Error(AdmissionErrorType.ApplicationNotFound);

        const payment = await PaymentModel.findById(params.paymentId);
        if (!payment) throw new Error(AdmissionErrorType.PaymentNotFound);

        if (!payment.studentId.equals(draft.registerId)) {
            throw new Error(AdmissionErrorType.PaymentMismatch);
        }

        if (payment.status !== "Completed") {
            payment.status = "Completed";
            await payment.save();
        }

        const newAdmission = new AdmissionModel({
            applicationId: draft.applicationId,
            registerId: draft.registerId,
            personal: draft.personal,
            choiceOfStudy: draft.choiceOfStudy,
            education: draft.education,
            achievements: draft.achievements,
            otherInformation: draft.otherInformation,
            documents: draft.documents,
            declaration: draft.declaration,
            paymentId: payment._id,
            status: "pending",
            rejectedBy: null,
            confirmationToken: null,
            tokenExpiry: null,
        });

        await newAdmission.save();
        await AdmissionDraftModel.deleteOne({ applicationId: params.applicationId });

        return {
            admission: new Admission({
                applicationId: newAdmission.applicationId,
                registerId: newAdmission.registerId,
                personal: newAdmission.personal,
                choiceOfStudy: newAdmission.choiceOfStudy,
                education: newAdmission.education,
                achievements: newAdmission.achievements,
                otherInformation: newAdmission.otherInformation,
                documents: newAdmission.documents,
                declaration: newAdmission.declaration,
                createdAt: newAdmission.createdAt,
                updatedAt: newAdmission.updatedAt,
                paymentId: newAdmission.paymentId.toString(),
                status: newAdmission.status as any,
                rejectedBy: newAdmission.rejectedBy as any,
                confirmationToken: newAdmission.confirmationToken,
                tokenExpiry: newAdmission.tokenExpiry,
            }),
        };
    }

    private mapStripeStatusToPaymentStatus(stripeStatus: string | null): string {
        switch (stripeStatus) {
            case "succeeded":
                return "completed";
            case "processing":
                return "pending";
            default:
                return "failed";
        }
    }

    private getPaymentMessage(status: string | null): string {
        switch (status) {
            case "succeeded":
                return "Payment processed successfully";
            case "requires_payment_method":
                return "Additional payment method required";
            case "requires_confirmation":
            case "requires_action":
                return "Additional verification required";
            case "processing":
                return "Payment is processing";
            default:
                return "Payment failed";
        }
    }

    async uploadDocument(params: UploadDocumentRequestDTO): Promise<UploadDocumentResponseDTO> {
        try {
            const uploadResult = await this.documentUploadService.uploadDocument(params.file, params.applicationId, params.documentType);

            return {
                success: true,
                message: 'Document uploaded successfully',
                document: {
                    url: uploadResult.data.document.url,
                    publicId: uploadResult.data.document.publicId,
                    fileName: uploadResult.data.document.fileName,
                    fileType: uploadResult.data.document.fileType,
                }
            };
        } catch (error) {
            console.error('[AdmissionsRepository] Document upload failed:', error);
            throw new Error(`Document upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async uploadMultipleDocuments(params: UploadMultipleDocumentsRequestDTO): Promise<UploadMultipleDocumentsResponseDTO> {
        try {
            const uploadResults = await this.documentUploadService.uploadMultipleDocuments(params.files, params.applicationId, params.documentTypes);

            return {
                success: true,
                message: 'Documents uploaded successfully',
                documents: uploadResults.data.documents.map(result => ({
                    url: result.url,
                    publicId: result.publicId,
                    fileName: result.fileName,
                    fileType: result.fileType,
                }))
            };
        } catch (error) {
            console.error('[AdmissionsRepository] Multiple document upload failed:', error);
            throw new Error(`Multiple document upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}