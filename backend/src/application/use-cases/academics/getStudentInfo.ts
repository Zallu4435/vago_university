import mongoose from 'mongoose';
import { User as UserModel} from '../../../infrastructure/database/mongoose/models/user.model';
import { ProgramModel } from '../../../infrastructure/database/mongoose/models/studentProgram.model';
import { EnrollmentModel } from '../../../infrastructure/database/mongoose/models/enrollment.model';

interface GetStudentInfoInput {
  userId: string;
}

interface Course {
  code: string;
  title: string;
  credits: number;
  instructor: string;
  schedule: string;
  id: number;
  term: string;
  section: string;
}

interface GetStudentInfoOutput {
  name: string;
  id: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  major: string;
  catalogYear: string;
  academicStanding: string; // Placeholder, as not in User or Program schema
  advisor: string; // Placeholder, as not in User or Program schema
  enrolledCourses: Course[];
}

class GetStudentInfo {
  async execute({ userId }: GetStudentInfoInput): Promise<GetStudentInfoOutput> {
    try {
      console.log(`Executing getStudentInfo use case for userId: ${userId}`);

      // Validate userId
      if (!mongoose.isValidObjectId(userId)) {
        throw new Error('Invalid student ID');
      }

      // Fetch user details 
      const user = await UserModel.findById(userId)
        .select('firstName lastName email phone profilePicture')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch user info: ${err.message}`);
        });

      if (!user) {
        throw new Error('Student not found');
      }
      // Fetch program details
      const program = await ProgramModel.findOne({ studentId: userId })
        .select('degree catalogYear')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch program info: ${err.message}`);
        });

      if (!program) {
        throw new Error('Program information not found');
      }

      // Fetch approved enrollments and populate course details
      const enrollments = await EnrollmentModel.find({ 
        userId, 
        status: 'Approved' 
      })
        .select('courseId term section')
        .populate({
          path: 'courseId',
          select: 'code title credits instructor schedule id',
          model: 'Course'
        })
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch enrollments: ${err.message}`);
        });

      // Map enrollments to course details
      const enrolledCourses = enrollments.map((enrollment) => ({
        code: enrollment.courseId.code,
        title: enrollment.courseId.title,
        credits: enrollment.courseId.credits,
        instructor: enrollment.courseId.instructor,
        schedule: enrollment.courseId.schedule,
        id: enrollment.courseId.id,
        term: enrollment.term,
        section: enrollment.section,
      }));

      return {
        name: `${user.firstName} ${user.lastName}`,
        id: userId,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        major: program.degree,
        catalogYear: program.catalogYear,
        academicStanding: 'Good', // Placeholder, as not in schema
        advisor: 'Unknown', // Placeholder, as not in schema
        enrolledCourses,
      };
    } catch (err) {
      console.error(`Error in getStudentInfo use case:`, err);
      throw err;
    }
  }
}

export const getStudentInfo = new GetStudentInfo();

