import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import { AdmissionErrorType } from "../../../domain/admission/enums/AdmissionErrorType";
import {
    CreateApplicationRequestDTO,
    ProcessPaymentRequestDTO,
    ConfirmPaymentRequestDTO,
    FinalizeAdmissionRequestDTO,
    UploadDocumentRequestDTO,
    UploadMultipleDocumentsRequestDTO,
} from "../../../domain/admission/dtos/AdmissionRequestDTOs";
import {
    CreateApplicationResponseDTO,
    ProcessPaymentResponseDTO,
    ConfirmPaymentResponseDTO,
    FinalizeAdmissionResponseDTO,
    UploadDocumentResponseDTO,
    UploadMultipleDocumentsResponseDTO,
} from "../../../domain/admission/dtos/AdmissionResponseDTOs";
 
import { IAdmissionsRepository } from "../../../application/admission/repositories/IAdmissionsRepository";
import { AdmissionDraft as AdmissionDraftModel } from "../../database/mongoose/admission/AdmissionDraftModel";
import { Admission as AdmissionModel } from "../../database/mongoose/admission/AdmissionModel";
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

    async findDraftByRegisterId(userId: string) {
        return AdmissionDraftModel.findOne({ registerId: userId }).lean();
    }

    async findDraftByApplicationId(applicationId: string) {
        return AdmissionDraftModel.findOne({ applicationId });
    }

    async saveDraft(draft: any) {
        return draft.save();
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
    }

    async confirmPayment(params: ConfirmPaymentRequestDTO): Promise<ConfirmPaymentResponseDTO> {
        const { paymentId, stripePaymentIntentId } = params;
        const payment = await PaymentModel.findById(paymentId);
        if (!payment) throw new Error(AdmissionErrorType.PaymentNotFound);

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
            admission: newAdmission.toObject(),
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
        const uploadResult = await this.documentUploadService.uploadDocument(params.file, params.applicationId, params.documentType);
        return {
            success: true,
            message: 'Document uploaded successfully',
            document: {
                url: uploadResult.url,
                publicId: uploadResult.publicId,
                fileName: uploadResult.fileName,
                fileType: uploadResult.fileType,
            }
        };
    }

    async uploadMultipleDocuments(params: UploadMultipleDocumentsRequestDTO): Promise<UploadMultipleDocumentsResponseDTO> {
        const uploadResults = await this.documentUploadService.uploadMultipleDocuments(params.files, params.applicationId, params.documentTypes);
        return {
            success: true,
            message: 'Documents uploaded successfully',
            documents: uploadResults.map(result => ({
                url: result.url,
                publicId: result.publicId,
                fileName: result.fileName,
                fileType: result.fileType,
            }))
        };
    }

    async getDocumentByKey(params: { userId: string; documentKey: string }): Promise<any | null> {
        console.log('[getDocumentByKey] userId:', params.userId, 'documentKey:', params.documentKey);
        const draft = await AdmissionDraftModel.findOne({ registerId: params.userId }).lean();
        console.log('[getDocumentByKey] fetched draft:', draft);
        if (!draft || !draft.documents) {
            console.log('[getDocumentByKey] No draft or no documents field');
            return null;
        }
        console.log('[getDocumentByKey] documents field:', draft.documents);
        const docsArray = Array.isArray(draft.documents.documents)
            ? draft.documents.documents
            : [];
        const found = docsArray.find((doc: any) => doc.id === params.documentKey);
        console.log('[getDocumentByKey] found document:', found);
        return found || null;
    }
}