// backend/src/application/use-cases/admission/getAdmissions.ts
import { Admission } from '../../../infrastructure/database/mongoose/models/admission.model';

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
  status: 'pending' | 'approved' | 'rejected';
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
    status = 'all',
    program = 'all',
    dateRange = 'all',
    startDate,
    endDate,
  }: GetAdmissionsParams): Promise<GetAdmissionsResult> {
    console.log(`Executing getAdmissions use case with params:`, {
      page,
      limit,
      status,
      program,
      dateRange,
      startDate,
      endDate,
    });

    // Build dynamic filter
    const filter: Record<string, any> = {};

    // Status filter
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Program filter
    if (program && program !== 'all') {
      filter.program = program;
    }

    // Date range filter
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      if (dateRange === 'last_week') {
        filter.createdAt = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      } else if (dateRange === 'last_month') {
        filter.createdAt = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
      } else if (dateRange === 'last_3_months') {
        filter.createdAt = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
      } else if (dateRange === 'custom' && startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
    }

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Fields to project
    const projection = {
      _id: 1,
      'personal.fullName': 1,
      'personal.email': 1,
      createdAt: 1,
      status: 1,
      program: 1,
    };

    // Fetch admissions with pagination, sorting, projection
    const admissionsRaw = await Admission.find(filter)
      .select(projection)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Map fields to required structure
    const admissions = admissionsRaw.map((admission) => ({
      _id: admission._id.toString(),
      fullName: admission.personal?.fullName || 'N/A',
      email: admission.personal?.email || 'N/A',
      createdAt: admission.createdAt.toISOString(),
      status: admission.status || 'pending',
      program: admission.program || 'N/A',
    }));

    // Total count for pagination
    const totalAdmissions = await Admission.countDocuments(filter);
    const totalPages = Math.ceil(totalAdmissions / limit);

    console.log(`Found ${admissions.length} admissions out of ${totalAdmissions} total`);

    return {
      admissions,
      totalAdmissions,
      totalPages,
      currentPage: page,
    };
  }
}

export const getAdmissions = new GetAdmissions();