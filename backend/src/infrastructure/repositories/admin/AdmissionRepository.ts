import { IAdmissionRepository } from "../../../application/admin/repositories/IAdmissionRepository";
import { Admission as AdmissionModel } from '../../database/mongoose/admission/AdmissionModel'
import { Register } from "../../database/mongoose/auth/register.model";
import { User as UserModel } from "../../database/mongoose/auth/user.model";
import { ProgramModel } from "../../database/mongoose/models/studentProgram.model";
import { AdminAdmission, FullAdmissionDetails } from "../../../domain/admin/entities/AdminAdmissionTypes";
import { AdmissionErrorType } from "../../../domain/admin/enums/AdmissionErrorType";
import { User } from "../../../domain/auth/entities/Auth";


export class AdmissionRepository implements IAdmissionRepository {
    async find(filter: any, projection: any, skip: number, limit: number) {
        const results = await AdmissionModel.find(filter)
            .select(projection)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean({ getters: true });
        return results as unknown as AdminAdmission[];
    }

    async count(filter: any) {
        return AdmissionModel.countDocuments(filter);
    }


    async getAdmissionById(id: string) {
        const admission = await AdmissionModel.findById(id).lean({ getters: true });
        return { admission } as unknown as FullAdmissionDetails;
    }

    async getAdmissionByToken(admissionId: string, token: string) {

        const admission = await AdmissionModel.findById(admissionId)
            .select("personal choiceOfStudy status confirmationToken tokenExpiry")
            .lean({ getters: true });

        return admission as unknown as FullAdmissionDetails;
    }

    async findAdmissionById(id: string) {
        return AdmissionModel.findById(id).lean({ getters: true }) as unknown as FullAdmissionDetails;
    }

    async saveAdmission(admission: any) {
        return admission.save();
    }

    async findUserByEmail(email: string) {
        return UserModel.findOne({ email }).lean({ getters: true }) as unknown as User;
    }

    async saveUser(user: any) {
        return user.save();
    }


    async deleteAdmission(id: string) {
        const admission = await AdmissionModel.findById(id);
        if (!admission) {
            throw new Error(AdmissionErrorType.AdmissionNotFound);
        }
        if (admission.status !== "pending") {
            throw new Error(AdmissionErrorType.AdmissionAlreadyProcessed);
        }

        await AdmissionModel.deleteOne({ _id: id });

        return admission as unknown as FullAdmissionDetails;
    }

    async confirmAdmissionOffer(admissionId: string, token: string, action: string) {
        const admission = await AdmissionModel.findById(admissionId);
        if (!admission) {
            throw new Error(AdmissionErrorType.AdmissionNotFound);
        }
        if (admission.status !== "offered") {
            throw new Error(AdmissionErrorType.AdmissionAlreadyProcessed);
        }
        if (!admission.confirmationToken || admission.confirmationToken !== token) {
            throw new Error(AdmissionErrorType.InvalidToken);
        }
        if (!admission.tokenExpiry || new Date() > admission.tokenExpiry) {
            throw new Error(AdmissionErrorType.TokenExpired);
        }
        if (action !== "accept" && action !== "reject") {
            throw new Error(AdmissionErrorType.InvalidAction);
        }

        if (action === "accept") {
            admission.status = "approved" as any;
            admission.rejectedBy = undefined;
            const registerUser = await Register.findById(admission.registerId);
            if (!registerUser) {
                throw new Error(AdmissionErrorType.RegisterUserNotFound);
            }

            const fullNameParts = admission.personal.fullName.split(" ");
            const firstName = fullNameParts[0];
            const lastName = fullNameParts.slice(1).join(" ") || "";

            const user = new UserModel({
                firstName,
                lastName,
                email: admission.personal.emailAddress,
                password: registerUser.password,
                createdAt: new Date(),
            });

            await user.save();

            let degree = "";
            let catalogYear = "";

            const currentYear = new Date().getFullYear();
            const yearRange = `${currentYear}-${currentYear + 4}`;

            if (admission.choiceOfStudy && admission.choiceOfStudy.length > 0) {
                degree = admission.choiceOfStudy[0]?.programme || "";
                catalogYear = admission.choiceOfStudy[0]?.catalogYear || yearRange;
            }

            if (degree && catalogYear) {
                await ProgramModel.create({
                    studentId: user._id,
                    degree,
                    catalogYear,
                    credits: 20,
                });
            }

        } else {
            admission.status = "rejected" as any;
            admission.rejectedBy = "user" as any;
        }

        admission.confirmationToken = undefined;
        admission.tokenExpiry = undefined;
        await admission.save();

        return {
            message: action === "accept"
                ? "Admission accepted and user account created"
                : "Admission offer rejected",
        };
    }
}