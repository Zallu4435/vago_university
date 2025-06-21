import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import { AdmissionDraft } from "../../../domain/admission/entities/Admission";
import { AdmissionErrorType } from "../../../domain/admission/enums/AdmissionErrorType";
import {
    CreateApplicationRequestDTO,
    GetApplicationRequestDTO,
    SaveSectionRequestDTO,
    ProcessPaymentRequestDTO,
    ConfirmPaymentRequestDTO,
    FinalizeAdmissionRequestDTO,
} from "../../../domain/admission/dtos/AdmissionRequestDTOs";
import {
    CreateApplicationResponseDTO,
    GetApplicationResponseDTO,
    SaveSectionResponseDTO,
    ProcessPaymentResponseDTO,
    ConfirmPaymentResponseDTO,
    FinalizeAdmissionResponseDTO,
} from "../../../domain/admission/dtos/AdmissionResponseDTOs";

import { IAdmissionsRepository } from "../../../application/admission/repositories/IAdmissionsRepository";
import { AdmissionDraft as AdmissionDraftModel } from "../../database/mongoose/admission/AdmissionDraftModel";
import { Admission as AdmissionModel } from "../../database/mongoose/models/admission.model";
import { PaymentModel } from "../../database/mongoose/models/financial.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2023-10-16" });

export class AdmissionsRepository implements IAdmissionsRepository {
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

    async processPayment(params: ProcessPaymentRequestDTO): Promise<ProcessPaymentResponseDTO> {
        const { applicationId, paymentDetails } = params;
        const draft = await AdmissionDraftModel.findOne({ applicationId });
        if (!draft) throw new Error(AdmissionErrorType.ApplicationNotFound);

        // 1. Create PaymentModel record first
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
            // 2. Create Stripe PaymentIntent
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

            // 3. Update payment record with Stripe details
            payment.metadata = {
                ...payment.metadata,
                stripePaymentIntentId: paymentIntent.id,
                returnUrl: paymentDetails.returnUrl,
                clientSecret: paymentIntent.client_secret,
            };
            await payment.save();

            // 4. Return payment details for frontend
            return {
                paymentId: payment._id.toString(),
                status: "pending",
                message: "Payment created successfully. Please complete the payment.",
                clientSecret: paymentIntent.client_secret,
                stripePaymentIntentId: paymentIntent.id,
            };
        } catch (error) {
            // If Stripe fails, update payment status to failed
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
        console.log('=== CONFIRM PAYMENT REPOSITORY START ===');
        console.log('Repository params:', params);
        
        const { paymentId, stripePaymentIntentId } = params;
        const payment = await PaymentModel.findById(paymentId);
        if (!payment) throw new Error(AdmissionErrorType.PaymentNotFound);

        try {
            // First, confirm the PaymentIntent with Stripe using the stored payment method
            const paymentIntent = await stripe.paymentIntents.confirm(stripePaymentIntentId, {
                payment_method: payment.metadata?.paymentMethodId,
            });
            console.log('Stripe PaymentIntent confirmed:', paymentIntent.id, 'Status:', paymentIntent.status);
            
            // Update payment status based on Stripe status
            const stripeStatus = paymentIntent.status;
            const paymentStatus = this.mapStripeStatusToPaymentStatus(stripeStatus);
            
            console.log('Mapping Stripe status:', stripeStatus, 'to payment status:', paymentStatus);
            
            payment.status = paymentStatus === "completed" ? "Completed" : 
                           paymentStatus === "pending" ? "Pending" : "Failed";
            
            payment.metadata = {
                ...payment.metadata,
                stripeStatus: stripeStatus,
                confirmedAt: new Date(),
                lastChecked: new Date(),
            };
            
            await payment.save();
            console.log('Payment updated in database:', payment._id, 'Status:', payment.status);

            return {
                paymentId: payment._id.toString(),
                status: paymentStatus,
                message: this.getPaymentMessage(stripeStatus),
                stripePaymentIntentId: stripePaymentIntentId,
            };
        } catch (error) {
            console.error('Error confirming payment:', error);
            // If confirmation fails, update payment status to failed
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
            admission: newAdmission,
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
}