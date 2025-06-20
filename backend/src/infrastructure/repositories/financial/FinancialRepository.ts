import Razorpay from "razorpay";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { StudentFinancialInfoModel, ChargeModel, PaymentModel, FinancialAidApplicationModel, ScholarshipModel, ScholarshipApplicationModel } from "../../database/mongoose/models/financial.model"
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
        const infos = await StudentFinancialInfoModel.find({ studentId: params.studentId })
            .populate("chargeId", "title description")
            .lean();

        const formattedInfos = infos.map((info) => ({
            id: info._id.toString(),
            studentId: info.studentId.toString(),
            chargeId: info.chargeId?._id?.toString() || "",
            amount: info.amount,
            paymentDueDate: info.paymentDueDate.toISOString(),
            status: info.status,
            term: info.term,
            issuedAt: info.issuedAt.toISOString(),
            paidAt: info.paidAt ? info.paidAt.toISOString() : undefined,
            method: info.method,
            createdAt: info.createdAt.toISOString(),
            updatedAt: info.updatedAt.toISOString(),
            chargeTitle: info.chargeId?.title || "",
            chargeDescription: info.chargeId?.description || "",
        }));

        return {
            info: formattedInfos.filter((item) => item.status === "Pending"),
            history: formattedInfos
                .filter((item) => item.status === "Paid")
                .map((item) => ({
                    paidAt: item.paidAt,
                    chargeTitle: item.chargeTitle,
                    method: item.method,
                    amount: item.amount,
                })),
        };
    }

    async getAllPayments(params: GetAllPaymentsRequestDTO): Promise<GetAllPaymentsResponseDTO> {
        const query: any = {};
        if (params.startDate) query.date = { $gte: new Date(params.startDate) };
        if (params.endDate) query.date = { ...query.date, $lte: new Date(params.endDate) };
        if (params.status) query.status = params.status;

        const total = await PaymentModel.countDocuments(query);
        const payments = await PaymentModel.find(query)
            .skip((params.page - 1) * params.limit)
            .limit(params.limit)
            .lean();

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
            total,
        };
    }

    async getOnePayment(params: GetOnePaymentRequestDTO): Promise<GetOnePaymentResponseDTO> {
        const payment = await PaymentModel.findById(params.paymentId).lean();
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

                const payment = await PaymentModel.findOneAndUpdate(
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

                if (!payment) throw new Error(FinancialErrorType.PaymentNotFound);

                await StudentFinancialInfoModel.updateMany(
                    { studentId: params.studentId, term: params.term, status: "Pending" },
                    { $set: { status: "Paid", method: params.method } }
                );

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
                    metadata: { razorpayOrderId: order.id },
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
            });

            await payment.save();

            await StudentFinancialInfoModel.updateMany(
                { studentId: params.studentId, term: params.term, status: "Pending" },
                { $set: { status: "Paid", method: params.method } }
            );

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

        const applications = await FinancialAidApplicationModel.find(query).lean();

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

        const total = await FinancialAidApplicationModel.countDocuments(query);
        const applications = await FinancialAidApplicationModel.find(query)
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
        const application = new FinancialAidApplicationModel({
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

        const scholarships = await ScholarshipModel.find(query).lean();

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

        const applications = await ScholarshipApplicationModel.find(query).lean();

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

        const total = await ScholarshipApplicationModel.countDocuments(query);
        const applications = await ScholarshipApplicationModel.find(query)
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
        const scholarship = await ScholarshipModel.findById(params.scholarshipId);
        if (!scholarship) {
            throw new Error(FinancialErrorType.ScholarshipNotFound);
        }
        if (scholarship.status === "Closed") {
            throw new Error(FinancialErrorType.ScholarshipClosed);
        }

        const application = new ScholarshipApplicationModel({
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
            publicId: result.public_id,
        };
    }

    async getPaymentReceipt(params: GetPaymentReceiptRequestDTO): Promise<GetPaymentReceiptResponseDTO> {
        const payment = await PaymentModel.findById(params.paymentId).lean();
        if (!payment) throw new Error(FinancialErrorType.PaymentNotFound);
        return {
            receiptUrl: payment.receiptUrl,
            paymentId: payment._id.toString(),
        };
    }

    async updateFinancialAidApplication(params: UpdateFinancialAidApplicationRequestDTO): Promise<UpdateFinancialAidApplicationResponseDTO> {
        const application = await FinancialAidApplicationModel.findByIdAndUpdate(
            params.applicationId,
            { status: params.status, amount: params.amount },
            { new: true }
        ).lean();
        if (!application) throw new Error(FinancialErrorType.ApplicationNotFound);
        return {
            id: application._id.toString(),
            status: application.status,
            amount: application.amount,
        };
    }

    async updateScholarshipApplication(params: UpdateScholarshipApplicationRequestDTO): Promise<UpdateScholarshipApplicationResponseDTO> {
        const application = await ScholarshipApplicationModel.findByIdAndUpdate(
            params.applicationId,
            { status: params.status },
            { new: true }
        ).lean();
        if (!application) throw new Error(FinancialErrorType.ApplicationNotFound);
        return {
            id: application._id.toString(),
            status: application.status,
        };
    }

    async createCharge(params: CreateChargeRequestDTO): Promise<CreateChargeResponseDTO> {
        const charge = new ChargeModel({
            studentId: params.studentId,
            amount: params.amount,
            dueDate: params.dueDate,
            description: params.description,
            status: "Pending",
            createdAt: new Date(),
        });
        await charge.save();
        return {
            id: charge._id.toString(),
            studentId: charge.studentId.toString(),
            amount: charge.amount,
            dueDate: charge.dueDate.toISOString(),
            description: charge.description,
            status: charge.status,
        };
    }

    async getAllCharges(params: GetAllChargesRequestDTO): Promise<GetAllChargesResponseDTO> {
        const query: any = {};
        if (params.studentId) query.studentId = params.studentId;
        if (params.status) query.status = params.status;

        const total = await ChargeModel.countDocuments(query);
        const charges = await ChargeModel.find(query)
            .skip((params.page - 1) * params.limit)
            .limit(params.limit)
            .lean();

        return {
            data: charges.map((charge) => ({
                id: charge._id.toString(),
                studentId: charge.studentId.toString(),
                amount: charge.amount,
                dueDate: charge.dueDate.toISOString(),
                description: charge.description,
                status: charge.status,
            })),
            total,
        };
    }
}