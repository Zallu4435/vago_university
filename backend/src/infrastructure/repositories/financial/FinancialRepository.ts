import Razorpay from "razorpay";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { StudentFinancialInfoModel, ChargeModel, PaymentModel } from "../../database/mongoose/models/financial.model"
import { ProgramModel } from "../../database/mongoose/models/studentProgram.model";
import { FinancialErrorType } from "../../../domain/financial/enums/FinancialErrorType";
import {
    GetStudentFinancialInfoRequestDTO,
    GetAllPaymentsRequestDTO,
    GetOnePaymentRequestDTO,
    MakePaymentRequestDTO,
    GetAllChargesRequestDTO,
    UpdateChargeRequestDTO,
    DeleteChargeRequestDTO,
} from "../../../domain/financial/dtos/FinancialRequestDTOs";
import {
    GetStudentFinancialInfoResponseDTO,
    GetAllPaymentsResponseDTO,
    GetOnePaymentResponseDTO,
    MakePaymentResponseDTO,
    GetAllChargesResponseDTO,
    UpdateChargeResponseDTO,
    DeleteChargeResponseDTO,
} from "../../../domain/financial/dtos/FinancialResponseDTOs";
import { IFinancialRepository } from "../../../application/financial/repositories/IFinancialRepository";
import { ChargeDocument, FinancialInfoDocument, PaymentDocument } from "../../../domain/financial/financialtypes";
import mongoose from 'mongoose';

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
            const studentProgram = await ProgramModel.findOne({ studentId: params.studentId }).lean();

            if (!studentProgram) {
                return {
                    info: [],
                    history: [],
                };
            }

            const allCharges = await ChargeModel.find({}).lean() as unknown as ChargeDocument[];

            const applicableCharges = allCharges.filter((charge) => {
                if (charge.applicableFor === "All Students") {
                    return true;
                }

                if (studentProgram.degree === charge.applicableFor) {
                    return true;
                }

                return false;
            });

            const studentFinancialInfo = await StudentFinancialInfoModel.find({
                studentId: params.studentId
            }).populate('paymentId').lean();

            const formattedCharges = applicableCharges.map((charge) => {
                const financialInfo = studentFinancialInfo.find((info) =>
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

            const formattedHistory = studentFinancialInfo
                .filter((info) => info.status === "Paid")
                .map((info) => ({
                    id: info.paymentId ? info.paymentId.toString() : undefined,
                    paidAt: info.paidAt.toISOString(),
                    chargeTitle: info.chargeId ? "Payment for " + info.term : "Payment",
                    method: info.method,
                    amount: info.amount,
                }))
                .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());


            const unpaidCharges = formattedCharges.filter(charge => charge.status === "Pending");

            return {
                info: unpaidCharges,
                history: formattedHistory,
            };
        } catch (error) {
            console.error('[FinancialRepository] Error in getStudentFinancialInfo:', error);
            throw error;
        }
    }

    async getAllPayments(params: GetAllPaymentsRequestDTO): Promise<GetAllPaymentsResponseDTO> {
        const query: any = {};
        if (params.startDate && params.endDate) {
            query.date = { $gte: new Date(params.startDate), $lte: new Date(params.endDate) };
        } else if (params.startDate) {
            query.date = { $gte: new Date(params.startDate) };
        } else if (params.endDate) {
            query.date = { $lte: new Date(params.endDate) };
        }
        if (params.status) query.status = params.status;
        if (params.studentId) {
            if (mongoose.Types.ObjectId.isValid(params.studentId)) {
                query.studentId = params.studentId;
            } else {
                return { data: [], totalPages: 1, totalPayments: 0, currentPage: params.page };
            }
        }

        const total = await PaymentModel.countDocuments(query);
        const payments = await PaymentModel.find(query)
            .sort({ date: -1 })
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
        if (!params.chargeId) {
            throw new Error('Charge ID is required for payment');
        }

        const charge = await ChargeModel.findById(params.chargeId).lean();
        if (!charge) {
            throw new Error(`Charge with ID ${params.chargeId} not found`);
        }

        const existingPending = await StudentFinancialInfoModel.findOne({
            studentId: params.studentId,
            chargeId: params.chargeId,
            status: "Pending",
            paymentId: { $exists: false }
        }).lean();

        if (existingPending) {
            const timeSinceStart = Date.now() - new Date(existingPending.issuedAt).getTime();
            const fiveMinutesInMs = 5 * 60 * 1000;

            if (timeSinceStart < fiveMinutesInMs) {
                throw new Error("Payment for this charge is already in progress. Please complete the transaction in your other tab or wait for the pending transaction to expire.");
            } else {
                await StudentFinancialInfoModel.deleteOne({
                    _id: existingPending._id
                });
            }
        }

        const existingPaid = await StudentFinancialInfoModel.findOne({
            studentId: params.studentId,
            chargeId: params.chargeId,
            status: "Paid"
        }).lean();

        if (existingPaid) {
            throw new Error("This charge has already been paid.");
        }

        const transactionLock = new StudentFinancialInfoModel({
            studentId: params.studentId,
            chargeId: charge._id,
            amount: params.amount,
            status: "Pending",
            term: params.term,
            issuedAt: new Date(),
            paymentDueDate: charge.dueDate,
            method: params.method
        });

        await transactionLock.save();

        try {
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

                    if (!payment) {
                        throw new Error(FinancialErrorType.PaymentNotFound);
                    }

                    await StudentFinancialInfoModel.findByIdAndUpdate(
                        transactionLock._id,
                        {
                            paymentId: payment._id,
                            status: "Paid",
                            paidAt: new Date(),
                        }
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
                        metadata: {
                            razorpayOrderId: order.id,
                            chargeId: params.chargeId,
                            transactionLockId: transactionLock._id
                        },
                    });

                    await payment.save();

                    await StudentFinancialInfoModel.findByIdAndUpdate(
                        transactionLock._id,
                        {
                            paymentId: payment._id
                        }
                    );

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
                        chargeId: params.chargeId,
                        transactionLockId: transactionLock._id
                    },
                });

                await payment.save();

                await StudentFinancialInfoModel.findByIdAndUpdate(
                    transactionLock._id,
                    {
                        paymentId: payment._id,
                        status: "Paid",
                        paidAt: new Date(),
                    }
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
        } catch (error) {
            console.error('[FinancialRepository] Error during payment processing:', error);
            await StudentFinancialInfoModel.findByIdAndDelete(transactionLock._id);
            console.log(`[FinancialRepository] Removed transaction lock ${transactionLock._id} due to error`);
            throw error;
        }
    }

    async uploadDocument(params) {
        const result = await cloudinary.uploader.upload(params.file.path, {
            folder: "financial-documents",
        });
        return {
            url: result.secure_url,
        };
    }

    async getPaymentReceipt(params) {
        const payment = await PaymentModel.findById(params.paymentId).lean();
        if (!payment) throw new Error(FinancialErrorType.PaymentNotFound);
        return {
            url: payment.receiptUrl || "",
        };
    }

    async createCharge(params) {
        const charge = new ChargeModel({
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

        if (params.term && params.term !== 'All Terms') query.term = params.term;
        if (params.status && params.status !== 'All Statuses') query.status = params.status;

        if (params.search && params.search.trim()) {
            const searchRegex = new RegExp(params.search.trim(), 'i');
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { term: searchRegex },
                { applicableFor: searchRegex }
            ];
        }

        const total = await ChargeModel.countDocuments(query);
        const charges = await ChargeModel.find(query)
            .sort({ createdAt: -1 })
            .skip((params.page - 1) * params.limit)
            .limit(params.limit)
            .lean();

        return {
            data: charges.map((charge) => ({
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

    async updateCharge(params: UpdateChargeRequestDTO): Promise<UpdateChargeResponseDTO> {
        const { id, ...updateFields } = params;
        const updated = await ChargeModel.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        ).lean();
        if (!updated) throw new Error('Charge not found');
        return {
            charge: {
                id: updated._id.toString(),
                title: updated.title,
                description: updated.description,
                amount: updated.amount,
                term: updated.term,
                dueDate: updated.dueDate.toISOString(),
                applicableFor: updated.applicableFor,
                createdBy: updated.createdBy,
                createdAt: updated.createdAt.toISOString(),
                updatedAt: updated.updatedAt.toISOString(),
                status: updated.status,
            },
        };
    }

    async deleteCharge(params: DeleteChargeRequestDTO): Promise<DeleteChargeResponseDTO> {
        const deleted = await ChargeModel.findByIdAndDelete(params.id);
        return { success: !!deleted };
    }

    async hasPendingPayment(studentId: string): Promise<boolean> {
        const pending = await PaymentModel.exists({ studentId, status: 'Pending' });
        console.log(pending, "sonsoosndonson")
        return !!pending;
    }

    async clearPendingPayment(studentId: string): Promise<boolean> {
        try {
            await StudentFinancialInfoModel.deleteMany({
                studentId: studentId,
                status: "Pending",
                paymentId: { $exists: false }
            });

            await PaymentModel.updateMany(
                {
                    studentId: studentId,
                    status: 'Pending'
                },
                {
                    $set: {
                        status: 'Cancelled',
                        updatedAt: new Date()
                    }
                }
            );

            const cancelledPayments = await PaymentModel.find({
                studentId: studentId,
                status: 'Cancelled'
            }).select('_id').lean();

            if (cancelledPayments.length > 0) {
                const cancelledPaymentIds = cancelledPayments.map(p => p._id);
                await StudentFinancialInfoModel.deleteMany({
                    studentId: studentId,
                    paymentId: { $in: cancelledPaymentIds },
                    status: 'Pending'
                });
            }
            return true;
        } catch (error) {
            console.error('[FinancialRepository] Error clearing pending payment:', error);
            return false;
        }
    }

}