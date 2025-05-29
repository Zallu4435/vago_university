import mongoose from 'mongoose';
import { User as UserModel } from '../../../infrastructure/database/mongoose/models/user.model';
import { ProgramModel } from '../../../infrastructure/database/mongoose/models/studentProgram.model';
import { EnrollmentModel } from '../../../infrastructure/database/mongoose/models/enrollment.model';

interface GetStudentInfoInput {
  userId: string;
}

interface GetStudentInfoOutput {
  name: string;
  id: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  major: string;
  catalogYear: string;
  academicStanding: string;
  advisor: string;
  pendingCredits: number;
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
        .select('degree catalogYear credits')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch program info: ${err.message}`);
        });

      if (!program) {
        throw new Error('Program information not found');
      }

      // Fetch pending enrollments and populate course credits
      const pendingEnrollments = await EnrollmentModel.find({
        studentId: userId,
        status: { $regex: /^pending$/, $options: 'i' }, // Case-insensitive match for 'pending'
      })
        .populate({
          path: 'courseId',
          select: 'credits', // Only need credits for pendingCredits
        })
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch enrollments: ${err.message}`);
        });

        console.log(pendingEnrollments, "pendingEnrollments credits");
      // Calculate pending credits

      const pendingCredits = pendingEnrollments
        .filter((enrollment) => enrollment.courseId) // Ensure courseId is populated
        .reduce((sum, enrollment) => sum + (enrollment.courseId.credits || 0), 0);


        console.log(pendingCredits, "pending credits");

      return {
        name: `${user.firstName} ${user.lastName}`.trim(),
        id: userId,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        major: program.degree,
        catalogYear: program.catalogYear,
        credits: program.credits,
        academicStanding: 'Good', // Placeholder
        advisor: 'Unknown', // Placeholder
        pendingCredits,
      };
    } catch (err) {
      console.error(`Error in getStudentInfo use case:`, err);
      throw err;
    }
  }
}

export const getStudentInfo = new GetStudentInfo();