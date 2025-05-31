// backend/src/application/use-cases/admission/getAdmissions.ts
import { Admission } from "../../../infrastructure/database/mongoose/models/admission.model";

interface GetAdmissionsParams {
  page: number;
  limit: number;
  status?: string;
  program?: string;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
}

interface AdmissionResponse {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  program: string;
}

interface GetAdmissionsResult {
  admissions: AdmissionResponse[];
  totalAdmissions: number;
  totalPages: number;
  currentPage: number;
}

class GetAdmissions {
  async execute({
    page = 1,
    limit = 5,
    status = "all",
    program = "all",
    dateRange = "all",
    startDate,
    endDate,
  }: GetAdmissionsParams): Promise<GetAdmissionsResult> {
    const filter: Record<string, any> = {};

    if (status && status !== "all") {
      filter.status =
        status === "approved" ? { $in: ["approved", "offered"] } : status;
    }

    if (program && program !== "all" && program !== "all_programs") {
      filter.choiceOfStudy = {
        $elemMatch: {
          programme: { $regex: `^${program}$`, $options: "i" },
        },
      };
    }

    if (dateRange && dateRange !== "all") {
      const now = new Date();
      if (dateRange === "last_week") {
        filter.createdAt = {
          $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        };
      } else if (dateRange === "last_month") {
        filter.createdAt = {
          $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        };
      } else if (dateRange === "last_3_months") {
        filter.createdAt = {
          $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        };
      } else if (dateRange === "custom" && startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
    }

    const skip = (page - 1) * limit;

    const projection = {
      _id: 1,
      "personal.fullName": 1,
      "personal.emailAddress": 1,
      createdAt: 1,
      status: 1,
      choiceOfStudy: 1,
    };

    const admissionsRaw = await Admission.find(filter)
      .select(projection)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const admissions = admissionsRaw.map((admission) => ({
      _id: admission._id.toString(),
      fullName: admission.personal?.fullName || "N/A",
      email: admission.personal?.emailAddress || "N/A",
      createdAt: admission.createdAt.toISOString(),
      status: admission.status || "pending",
      program: admission.choiceOfStudy?.[0]?.programme || "N/A",
    }));

    const totalAdmissions = await Admission.countDocuments(filter);
    const totalPages = Math.ceil(totalAdmissions / limit);

    return {
      admissions,
      totalAdmissions,
      totalPages,
      currentPage: page,
    };
  }
}

export const getAdmissions = new GetAdmissions();
