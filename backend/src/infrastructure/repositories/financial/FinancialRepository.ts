import Razorpay from "razorpay";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { StudentFinancialInfoModel, ChargeModel, PaymentModel, FinancialAidApplicationModel, ScholarshipModel, ScholarshipApplicationModel } from "../../database/mongoose/models/financial.model"
import { User as UserModel } from "../../database/mongoose/auth/user.model";
import { ProgramModel } from "../../database/mongoose/models/studentProgram.model";
import { EnrollmentModel } from "../../database/mongoose/models/courses/CourseModel";
import { FinancialErrorType } from "../../../domain/financial/enums/FinancialErrorType";
import {
    GetStudentFinancialInfoRequestDTO,
    GetAllPaymentsRequestDTO,
    GetOnePaymentRequestDTO,
    MakePaymentRequestDTO,
    GetFinancialAidApplicationsRequestDTO,
    GetAllFinancialAidApplicationsRequestDTO,
    ApplyForFinancialAidRequestDTO,
    GetAvailableScholarshipsRequestDTO,
    GetScholarshipApplicationsRequestDTO,
    GetAllScholarshipApplicationsRequestDTO,
    ApplyForScholarshipRequestDTO,
    UploadDocumentRequestDTO,
    GetPaymentReceiptRequestDTO,
    UpdateFinancialAidApplicationRequestDTO,
    UpdateScholarshipApplicationRequestDTO,
    CreateChargeRequestDTO,
    GetAllChargesRequestDTO,
} from "../../../domain/financial/dtos/FinancialRequestDTOs";
import {
    GetStudentFinancialInfoResponseDTO,
    GetAllPaymentsResponseDTO,
    GetOnePaymentResponseDTO,
    MakePaymentResponseDTO,
    GetFinancialAidApplicationsResponseDTO,
    GetAllFinancialAidApplicationsResponseDTO,
    ApplyForFinancialAidResponseDTO,
    GetAvailableScholarshipsResponseDTO,
    GetScholarshipApplicationsResponseDTO,
    GetAllScholarshipApplicationsResponseDTO,
    ApplyForScholarshipResponseDTO,
    UploadDocumentResponseDTO,
    GetPaymentReceiptResponseDTO,
    UpdateFinancialAidApplicationResponseDTO,
    UpdateScholarshipApplicationResponseDTO,
    CreateChargeResponseDTO,
    GetAllChargesResponseDTO,
} from "../../../domain/financial/dtos/FinancialResponseDTOs";
import { IFinancialRepository } from "../../../application/financial/repositories/IFinancialRepository";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class FinancialRepository implements IFinancialRepository {
    async getStudentFinancialInfo(params: GetStudentFinancialInfoRequestDTO): Promise<GetStudentFinancialInfoResponseDTO> {
        try {
            console.log('[FinancialRepository] getStudentFinancialInfo called with studentId:', params.studentId);
            
            // Get student's program information
            const studentProgram = await ProgramModel.findOne({ studentId: params.studentId }).lean();
            console.log('[FinancialRepository] Student program:', studentProgram);
            
            if (!studentProgram) {
                console.log('[FinancialRepository] No program found for student');
                return {
                    info: [],
                    history: [],
                };
            }
            
            // Get all active charges that haven't exceeded the due date
            const currentDate = new Date();
            const allCharges = await (ChargeModel as any).find({ 
                dueDate: { $gte: currentDate } // Only charges that haven't exceeded due date
            }).lean();
            console.log('[FinancialRepository] Active charges not exceeded due date:', allCharges.length);
            
            // Filter charges that apply to this student based on their program
            const applicableCharges = allCharges.filter((charge: any) => {
                // If charge is for "All Students", it applies to everyone
                if (charge.applicableFor === "All Students") {
                    return true;
                }
                
                // If charge is for a specific program, check student's program
                if (studentProgram.degree === charge.applicableFor) {
                    return true;
                }
                
                return false;
            });
            
            console.log('[FinancialRepository] Applicable charges for student:', applicableCharges.length);
            
            // Get StudentFinancialInfo records for this student to check which charges have been paid
            const studentFinancialInfo = await (StudentFinancialInfoModel as any).find({ 
                studentId: params.studentId 
            }).populate('paymentId').lean();
            console.log('[FinancialRepository] StudentFinancialInfo records for student:', studentFinancialInfo.length);
            
            // Format charges for response and check payment status using StudentFinancialInfo
            const formattedCharges = applicableCharges.map((charge: any) => {
                // Check if student has already paid for this charge by looking in StudentFinancialInfo
                const financialInfo = studentFinancialInfo.find((info: any) => 
                    info.chargeId.toString() === charge._id.toString() && 
                    info.status === "Paid"
                );
                
                const isPaid = !!financialInfo;
                
                return {
                    id: charge._id.toString(),
                    studentId: params.studentId,
                    chargeId: charge._id.toString(),
                    amount: charge.amount,
                    paymentDueDate: charge.dueDate.toISOString(),
                    status: isPaid ? "Paid" as const : "Pending" as const,
                    term: charge.term,
                    issuedAt: charge.createdAt.toISOString(),
                    paidAt: isPaid ? financialInfo.paidAt.toISOString() : undefined,
                    method: isPaid ? financialInfo.method : undefined,
                    createdAt: charge.createdAt.toISOString(),
                    updatedAt: charge.updatedAt.toISOString(),
                    chargeTitle: charge.title,
                    chargeDescription: charge.description,
                };
            });
            
            // Format payment history from StudentFinancialInfo records
            const formattedHistory = studentFinancialInfo
                .filter((info: any) => info.status === "Paid")
                .map((info: any) => ({
                    id: info.paymentId ? info.paymentId.toString() : undefined, // Include payment ID
                    paidAt: info.paidAt.toISOString(),
                    chargeTitle: info.chargeId ? "Payment for " + info.term : "Payment",
                    method: info.method,
                    amount: info.amount,
                }));
            
            console.log('[FinancialRepository] Returning formatted data:', {
                chargesCount: formattedCharges.length,
                historyCount: formattedHistory.length
            });
            
            return {
                info: formattedCharges,
                history: formattedHistory,
            };
        } catch (error) {
            console.error('[FinancialRepository] Error in getStudentFinancialInfo:', error);
            throw error;
        }
    }

    async getAllPayments(params: GetAllPaymentsRequestDTO): Promise<GetAllPaymentsResponseDTO> {
        const query: any = {};
        if (params.startDate) query.date = { $gte: new Date(params.startDate) };
        if (params.endDate) query.date = { ...query.date, $lte: new Date(params.endDate) };
        if (params.status) query.status = params.status;

        const total = await (PaymentModel as any).countDocuments(query);
        const payments = await (PaymentModel as any).find(query)
            .sort({ date: -1 }) // Sort by date in descending order (newest first)
            .skip((params.page - 1) * params.limit)
            .limit(params.limit)
            .lean();

        const totalPages = Math.ceil(total / params.limit);
        
        return {
            data: payments.map((payment) => ({
                id: payment._id.toString(),
                studentId: payment.studentId.toString(),
                date: payment.date.toISOString(),
                description: payment.description,
                method: payment.method,
                amount: payment.amount,
                status: payment.status,
                receiptUrl: payment.receiptUrl,
                metadata: payment.metadata,
            })),
            totalPayments: total,
            totalPages,
            currentPage: params.page,
        };
    }

    async getOnePayment(params: GetOnePaymentRequestDTO): Promise<GetOnePaymentResponseDTO> {
        const payment = await (PaymentModel as any).findById(params.paymentId).lean();
        if (!payment) {
            throw new Error(FinancialErrorType.PaymentNotFound);
        }

        return {
            payment: {
                id: payment._id.toString(),
                studentId: payment.studentId.toString(),
                date: payment.date.toISOString(),
                description: payment.description,
                method: payment.method,
                amount: payment.amount,
                status: payment.status,
                receiptUrl: payment.receiptUrl,
                metadata: payment.metadata,
            },
        };
    }

    async makePayment(params: MakePaymentRequestDTO): Promise<MakePaymentResponseDTO> {
        if (params.method === "Razorpay") {
            if (params.razorpayPaymentId && params.razorpayOrderId && params.razorpaySignature) {
                const generatedSignature = crypto
                    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
                    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
                    .digest("hex");

                if (generatedSignature !== params.razorpaySignature) {
                    throw new Error(FinancialErrorType.InvalidPaymentSignature);
                }

                const payment = await (PaymentModel as any).findOneAndUpdate(
                    { "metadata.razorpayOrderId": params.razorpayOrderId, studentId: params.studentId },
                    {
                        $set: {
                            "metadata.razorpayPaymentId": params.razorpayPaymentId,
                            "metadata.razorpaySignature": params.razorpaySignature,
                            status: "Completed",
                            date: new Date(),
                            description: `Payment for ${params.term}`,
                        },
                    },
                    { new: true }
                ).lean();

                // Get the charge details to create proper StudentFinancialInfo record
                if (!params.chargeId) {
                    throw new Error('Charge ID is required for payment');
                }
                
                const charge = await (ChargeModel as any).findById(params.chargeId).lean();
                if (!charge) {
                    throw new Error(`Charge with ID ${params.chargeId} not found`);
                }
                
                if (charge) {
                    const studentFinancialInfo = new (StudentFinancialInfoModel as any)({
                        studentId: params.studentId,
                        chargeId: charge._id,
                        paymentId: payment._id, // Store the payment ID
                        amount: payment.amount,
                        paymentDueDate: charge.dueDate,
                        status: "Paid",
                        term: params.term,
                        paidAt: new Date(), // Add the paidAt field
                        issuedAt: charge.createdAt,
                        method: payment.method
                    });
                    await studentFinancialInfo.save();
                    console.log('[FinancialRepository] Created StudentFinancialInfo record for payment:', payment._id, 'with chargeId:', charge._id);
                }

                if (!payment) throw new Error(FinancialErrorType.PaymentNotFound);

                return {
                    id: payment._id.toString(),
                    date: payment.date.toISOString(),
                    description: payment.description,
                    method: payment.method,
                    amount: payment.amount,
                    status: payment.status,
                    metadata: payment.metadata,
                };
            } else {
                const shortStudentId = params.studentId.slice(-6);
                const shortReceipt = `r_${shortStudentId}_${Date.now()}`;
                const order = await razorpay.orders.create({
                    amount: params.amount * 100,
                    currency: "INR",
                    receipt: shortReceipt,
                });

                const payment = new PaymentModel({
                    studentId: params.studentId,
                    amount: params.amount,
                    method: params.method,
                    term: params.term,
                    date: new Date(),
                    description: `Payment for ${params.term}`,
                    status: "Pending",
                    metadata: { 
                        razorpayOrderId: order.id,
                        chargeId: params.chargeId // Store chargeId in payment metadata
                    },
                });

                await payment.save();

                return {
                    id: payment._id.toString(),
                    orderId: order.id,
                    amount: payment.amount,
                    currency: "INR",
                    status: payment.status,
                };
            }
        } else {
            const payment = new PaymentModel({
                studentId: params.studentId,
                date: new Date(),
                description: `Payment for ${params.term}`,
                method: params.method,
                amount: params.amount,
                status: "Completed",
                metadata: { 
                    chargeId: params.chargeId // Store chargeId in payment metadata
                },
            });

            await payment.save();

            // Create StudentFinancialInfo record for non-Razorpay payment
            if (!params.chargeId) {
                throw new Error('Charge ID is required for payment');
            }
            
            const charge = await (ChargeModel as any).findById(params.chargeId).lean();
            if (!charge) {
                throw new Error(`Charge with ID ${params.chargeId} not found`);
            }
            
            const studentFinancialInfo = new (StudentFinancialInfoModel as any)({
                studentId: params.studentId,
                chargeId: charge._id,
                paymentId: payment._id, // Store the payment ID
                amount: payment.amount,
                paymentDueDate: charge.dueDate,
                status: "Paid",
                term: params.term,
                paidAt: new Date(), // Add the paidAt field
                issuedAt: charge.createdAt,
                method: payment.method
            });
            await studentFinancialInfo.save();
            console.log('[FinancialRepository] Created StudentFinancialInfo record for non-Razorpay payment:', payment._id, 'with chargeId:', charge._id);

            return {
                id: payment._id.toString(),
                date: payment.date.toISOString(),
                description: payment.description,
                method: payment.method,
                amount: payment.amount,
                status: payment.status,
            };
        }
    }

    async getFinancialAidApplications(params: GetFinancialAidApplicationsRequestDTO): Promise<GetFinancialAidApplicationsResponseDTO> {
        const query: any = { studentId: params.studentId };
        if (params.status) query.status = params.status;

        const applications = await (FinancialAidApplicationModel as any).find(query).lean();

        return {
            data: applications.map((app) => ({
                id: app._id.toString(),
                studentId: app.studentId.toString(),
                term: app.term,
                status: app.status,
                amount: app.amount,
                type: app.type,
                applicationDate: app.applicationDate.toISOString(),
                documents: app.documents.map((doc) => ({
                    id: doc.id,
                    name: doc.name,
                    url: doc.url,
                    status: doc.status,
                })),
            })),
        };
    }

    async getAllFinancialAidApplications(params: GetAllFinancialAidApplicationsRequestDTO): Promise<GetAllFinancialAidApplicationsResponseDTO> {
        const query: any = {};
        if (params.status) query.status = params.status;
        if (params.term) query.term = params.term;

        const total = await (FinancialAidApplicationModel as any).countDocuments(query);
        const applications = await (FinancialAidApplicationModel as any).find(query)
            .skip((params.page - 1) * params.limit)
            .limit(params.limit)
            .lean();

        return {
            data: applications.map((app) => ({
                id: app._id.toString(),
                studentId: app.studentId.toString(),
                term: app.term,
                status: app.status,
                amount: app.amount,
                type: app.type,
                applicationDate: app.applicationDate.toISOString(),
                documents: app.documents.map((doc) => ({
                    id: doc.id,
                    name: doc.name,
                    url: doc.url,
                    status: doc.status,
                })),
            })),
            total,
        };
    }

    async applyForFinancialAid(params: ApplyForFinancialAidRequestDTO): Promise<ApplyForFinancialAidResponseDTO> {
        const application = new (FinancialAidApplicationModel as any)({
            studentId: params.studentId,
            term: params.term,
            status: "Pending",
            amount: params.amount,
            type: params.type,
            applicationDate: new Date(),
            documents: params.documents.map((doc) => ({
                id: uuidv4(),
                name: doc.name,
                url: doc.url,
                status: "Pending",
            })),
        });

        await application.save();

        return {
            data: {
                id: application._id.toString(),
                studentId: application.studentId.toString(),
                term: application.term,
                status: application.status,
                amount: application.amount,
                type: application.type,
                applicationDate: application.applicationDate.toISOString(),
                documents: application.documents.map((doc) => ({
                    id: doc.id,
                    name: doc.name,
                    url: doc.url,
                    status: doc.status,
                })),
            },
        };
    }

    async getAvailableScholarships(params: GetAvailableScholarshipsRequestDTO): Promise<GetAvailableScholarshipsResponseDTO> {
        const query: any = {};
        if (params.status) query.status = params.status;
        if (params.term) query.term = params.term;

        const scholarships = await (ScholarshipModel as any).find(query).lean();

        return {
            data: scholarships.map((s) => ({
                id: s._id.toString(),
                name: s.name,
                description: s.description,
                amount: s.amount,
                deadline: s.deadline.toISOString(),
                requirements: s.requirements,
                status: s.status,
                term: s.term,
            })),
        };
    }

    async getScholarshipApplications(params: GetScholarshipApplicationsRequestDTO): Promise<GetScholarshipApplicationsResponseDTO> {
        const query: any = { studentId: params.studentId };
        if (params.status) query.status = params.status;

        const applications = await (ScholarshipApplicationModel as any).find(query).lean();

        return {
            data: applications.map((app) => ({
                id: app._id.toString(),
                scholarshipId: app.scholarshipId.toString(),
                studentId: app.studentId.toString(),
                status: app.status,
                applicationDate: app.applicationDate.toISOString(),
                documents: app.documents.map((doc) => ({
                    id: doc.id,
                    name: doc.name,
                    url: doc.url,
                    status: doc.status,
                })),
            })),
        };
    }

    async getAllScholarshipApplications(params: GetAllScholarshipApplicationsRequestDTO): Promise<GetAllScholarshipApplicationsResponseDTO> {
        const query: any = {};
        if (params.status) query.status = params.status;

        const total = await (ScholarshipApplicationModel as any).countDocuments(query);
        const applications = await (ScholarshipApplicationModel as any).find(query)
            .skip((params.page - 1) * params.limit)
            .limit(params.limit)
            .lean();

        return {
            data: applications.map((app) => ({
                id: app._id.toString(),
                scholarshipId: app.scholarshipId.toString(),
                studentId: app.studentId.toString(),
                status: app.status,
                applicationDate: app.applicationDate.toISOString(),
                documents: app.documents.map((doc) => ({
                    id: doc.id,
                    name: doc.name,
                    url: doc.url,
                    status: doc.status,
                })),
            })),
            total,
        };
    }

    async applyForScholarship(params: ApplyForScholarshipRequestDTO): Promise<ApplyForScholarshipResponseDTO> {
        const scholarship = await (ScholarshipModel as any).findById(params.scholarshipId);
        if (!scholarship) {
            throw new Error(FinancialErrorType.ScholarshipNotFound);
        }
        if (scholarship.status === "Closed") {
            throw new Error(FinancialErrorType.ScholarshipClosed);
        }

        const application = new (ScholarshipApplicationModel as any)({
            studentId: params.studentId,
            scholarshipId: params.scholarshipId,
            status: "Pending",
            applicationDate: new Date(),
            documents: params.documents.map((doc) => ({
                id: uuidv4(),
                name: doc.name,
                url: doc.url,
                status: "Pending",
            })),
        });

        await application.save();

        return {
            data: {
                id: application._id.toString(),
                studentId: application.studentId.toString(),
                scholarshipId: application.scholarshipId.toString(),
                status: application.status,
                applicationDate: application.applicationDate.toISOString(),
                documents: application.documents.map((doc) => ({
                    id: doc.id,
                    name: doc.name,
                    url: doc.url,
                    status: doc.status,
                })),
            },
        };
    }

    async uploadDocument(params: UploadDocumentRequestDTO): Promise<UploadDocumentResponseDTO> {
        const result = await cloudinary.uploader.upload(params.file.path, {
            folder: "financial-documents",
        });
        return {
            url: result.secure_url,
        };
    }

    async getPaymentReceipt(params: GetPaymentReceiptRequestDTO): Promise<GetPaymentReceiptResponseDTO> {
        const payment = await (PaymentModel as any).findById(params.paymentId).lean();
        if (!payment) throw new Error(FinancialErrorType.PaymentNotFound);
        return {
            url: payment.receiptUrl || "",
        };
    }

    async updateFinancialAidApplication(params: UpdateFinancialAidApplicationRequestDTO): Promise<UpdateFinancialAidApplicationResponseDTO> {
        const application = await (FinancialAidApplicationModel as any).findByIdAndUpdate(
            params.applicationId,
            { status: params.status, amount: params.amount },
            { new: true }
        ).lean();
        if (!application) throw new Error(FinancialErrorType.ApplicationNotFound);
        return {
            data: {
                id: application._id.toString(),
                studentId: application.studentId.toString(),
                term: application.term,
                status: application.status,
                amount: application.amount,
                type: application.type,
                applicationDate: application.applicationDate.toISOString(),
                documents: application.documents.map((doc: any) => ({
                    id: doc.id,
                    name: doc.name,
                    url: doc.url,
                    status: doc.status,
                })),
            },
        };
    }

    async updateScholarshipApplication(params: UpdateScholarshipApplicationRequestDTO): Promise<UpdateScholarshipApplicationResponseDTO> {
        const application = await (ScholarshipApplicationModel as any).findByIdAndUpdate(
            params.applicationId,
            { status: params.status },
            { new: true }
        ).lean();
        if (!application) throw new Error(FinancialErrorType.ApplicationNotFound);
        return {
            data: {
                id: application._id.toString(),
                studentId: application.studentId.toString(),
                scholarshipId: application.scholarshipId.toString(),
                status: application.status,
                applicationDate: application.applicationDate.toISOString(),
                documents: application.documents.map((doc: any) => ({
                    id: doc.id,
                    name: doc.name,
                    url: doc.url,
                    status: doc.status,
                })),
            },
        };
    }

    async createCharge(params: CreateChargeRequestDTO): Promise<CreateChargeResponseDTO> {
        const charge = new (ChargeModel as any)({
            title: params.title,
            description: params.description,
            amount: params.amount,
            term: params.term,
            dueDate: params.dueDate,
            applicableFor: params.applicableFor,
            createdBy: params.createdBy,
            status: "Active",
            createdAt: new Date(),
        });
        await charge.save();
        return {
            charge: {
                id: charge._id.toString(),
                title: charge.title,
                description: charge.description,
                amount: charge.amount,
                term: charge.term,
                dueDate: charge.dueDate.toISOString(),
                applicableFor: charge.applicableFor,
                createdBy: charge.createdBy,
                createdAt: charge.createdAt.toISOString(),
                updatedAt: charge.updatedAt.toISOString(),
                status: charge.status,
            },
            studentFinancialInfos: [],
        };
    }

    async getAllCharges(params: GetAllChargesRequestDTO): Promise<GetAllChargesResponseDTO> {
        const query: any = {};
        
        // Add filters
        if (params.term && params.term !== 'All Terms') query.term = params.term;
        if (params.status && params.status !== 'All Statuses') query.status = params.status;
        
        // Add search functionality
        if (params.search && params.search.trim()) {
            const searchRegex = new RegExp(params.search.trim(), 'i');
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { term: searchRegex },
                { applicableFor: searchRegex }
            ];
        }

        const total = await (ChargeModel as any).countDocuments(query);
        const charges = await (ChargeModel as any).find(query)
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip((params.page - 1) * params.limit)
            .limit(params.limit)
            .lean();

        return {
            data: charges.map((charge: any) => ({
                id: charge._id.toString(),
                title: charge.title,
                description: charge.description,
                amount: charge.amount,
                term: charge.term,
                dueDate: charge.dueDate.toISOString(),
                applicableFor: charge.applicableFor,
                createdBy: charge.createdBy,
                createdAt: charge.createdAt.toISOString(),
                updatedAt: charge.updatedAt.toISOString(),
                status: charge.status,
            })),
            total,
        };
    }
}