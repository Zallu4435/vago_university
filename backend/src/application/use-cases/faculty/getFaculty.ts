import { FacultyRegister } from "../../../infrastructure/database/mongoose/models/facultyRegister.model";

interface GetFacultyParams {
  page: number;
  limit: number;
  status: string;
  department: string;
  dateRange: string;
}

interface GetFacultyResponse {
  faculty: any[];
  totalFaculty: number;
  totalPages: number;
  currentPage: number;
}

class GetFaculty {
  async execute({
    page,
    limit,
    status,
    department,
    dateRange,
  }: GetFacultyParams): Promise<GetFacultyResponse> {
    try {
      const query: any = {};

      if (status !== "all") {
        query.status = { $regex: `^${status}$`, $options: "i" };
      }

      if (department !== "all_departments") {
        const normalizedDepartment = department.replace(/_/g, "-");
        query.department = {
          $regex: `^${normalizedDepartment}$`,
          $options: "i",
        };
      }

      if (dateRange !== "all") {
        const now = new Date();
        let startDate: Date;
        switch (dateRange) {
          case "last7days":
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case "last_month":
          case "last30days":
            startDate = new Date(now.setDate(now.getDate() - 30));
            break;
          case "last90days":
            startDate = new Date(now.setDate(now.getDate() - 90));
            break;
          default:
            throw new Error(`Invalid dateRange: ${dateRange}`);
        }
        query.createdAt = { $gte: startDate };
      }

      const totalFaculty = await FacultyRegister.countDocuments(query).catch(
        (err) => {
          throw new Error(`Failed to count faculty documents: ${err.message}`);
        }
      );
      const totalPages = Math.ceil(totalFaculty / limit);
      const skip = (page - 1) * limit;

      const faculty = await FacultyRegister.find(query)
        .select(
          "fullName email phone department qualification experience aboutMe cvUrl certificatesUrl createdAt status"
        )
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query faculty: ${err.message}`);
        });

      return {
        faculty,
        totalFaculty,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getFaculty use case:`, err);
      throw err;
    }
  }
}

export const getFaculty = new GetFaculty();
