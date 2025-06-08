// import { CourseModel } from "../../../infrastructure/database/mongoose/models/course.model";

// interface GetCoursesParams {
//   page: number;
//   limit: number;
//   specialization: string;
//   faculty: string;
//   term: string;
//   search: string;
// }

// interface GetCoursesResponse {
//   courses: any[];
//   totalCourses: number;
//   totalPages: number;
//   currentPage: number;
// }

// class GetCourses {
//   async execute({
//     page,
//     limit,
//     specialization,
//     faculty,
//     term,
//     search,
//   }: GetCoursesParams): Promise<GetCoursesResponse> {
//     try {
//       if (page < 1 || limit < 1) throw new Error("Invalid pagination params");

//       const query: any = {};
//       if (specialization && specialization !== "all") {
//         const formattedSpecialization = specialization.replace(/_/g, " ");
//         query.specialization = {
//           $regex: `^${formattedSpecialization.replace(
//             /[.*+?^${}()|[\]\\]/g,
//             "\\$&"
//           )}$`,
//           $options: "i",
//         };
//       }
//       if (faculty && faculty !== "all") {
//         query.faculty = {
//           $regex: `^${faculty.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
//           $options: "i",
//         };
//       }
//       if (term && term !== "all") {
//         const formattedTerm = term.replace(/_/g, " ");
//         query.term = {
//           $regex: `^${formattedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
//           $options: "i",
//         };
//       }
//       if (search) {
//         query.$text = {
//           $search: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
//         };
//       }

//       const totalCourses = await CourseModel.countDocuments(query).catch(
//         (err) => {
//           throw new Error(`Failed to count courses: ${err.message}`);
//         }
//       );
//       const totalPages = Math.ceil(totalCourses / limit);
//       const skip = (page - 1) * limit;

//       const courses = await CourseModel.find(query)
//         .select(
//           "title specialization faculty credits schedule maxEnrollment currentEnrollment description prerequisites term"
//         )
//         .skip(skip)
//         .limit(limit)
//         .lean()
//         .catch((err) => {
//           throw new Error(`Failed to query courses: ${err.message}`);
//         });

//       return {
//         courses,
//         totalCourses,
//         totalPages,
//         currentPage: page,
//       };
//     } catch (err) {
//       console.error(`Error in getCourses use case:`, err);
//       throw new Error(err.message || "Failed to fetch courses");
//     }
//   }
// }

// export const getCourses = new GetCourses();
