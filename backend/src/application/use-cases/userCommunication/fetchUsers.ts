import mongoose from 'mongoose';
import { User as StudentModel } from '../../../infrastructure/database/mongoose/models/user.model';
import { Faculty as FacultyModel } from '../../../infrastructure/database/mongoose/models/faculty.model';

interface FetchUsersInput {
  type: 'all_students' | 'all_faculty' | 'all_users' | 'individual_students' | 'individual_faculty';
  search?: string;
  requesterId: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface FetchUsersOutput extends Array<User> {}

class FetchUsers {
  async execute({ type, search, requesterId }: FetchUsersInput): Promise<FetchUsersOutput> {
    try {
      console.log(`Executing fetchUsers for type: ${type}, search: ${search}, requesterId: ${requesterId}`);

      if (!mongoose.isValidObjectId(requesterId)) {
        throw new Error('Invalid requester ID');
      }

      let users: User[] = [];
      const query: any = {};

      if (search && ['individual_students', 'individual_faculty'].includes(type)) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      // Exclude the requester from the results
      query._id = { $ne: requesterId };

      switch (type) {
        case 'all_students':
        case 'individual_students':
          users = await StudentModel.find(query)
            .select('_id firstName lastName email role')
            .lean()
            .then((docs) =>
              docs.map((doc) => ({
                _id: doc._id,
                name: `${doc.firstName} ${doc.lastName}`.trim(),
                email: doc.email,
                role: doc.role,
              }))
            );
          break;
        case 'all_faculty':
        case 'individual_faculty':
          users = await FacultyModel.find(query)
            .select('_id firstName lastName email role')
            .lean()
            .then((docs) =>
              docs.map((doc) => ({
                _id: doc._id,
                name: `${doc.firstName} ${doc.lastName}`.trim(),
                email: doc.email,
                role: doc.role,
              }))
            );
          break;
        case 'all_users':
          const [students, faculty] = await Promise.all([
            StudentModel.find(search ? {
              $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
              ],
              _id: { $ne: requesterId },
            } : { _id: { $ne: requesterId } })
              .select('_id firstName lastName email role')
              .lean()
              .then((docs) =>
                docs.map((doc) => ({
                  _id: doc._id,
                  name: `${doc.firstName} ${doc.lastName}`.trim(),
                  email: doc.email,
                  role: doc.role,
                }))
              ),
            FacultyModel.find(search ? {
              $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
              ],
              _id: { $ne: requesterId },
            } : { _id: { $ne: requesterId } })
              .select('_id firstName lastName email role')
              .lean()
              .then((docs) =>
                docs.map((doc) => ({
                  _id: doc._id,
                  name: `${doc.firstName} ${doc.lastName}`.trim(),
                  email: doc.email,
                  role: doc.role,
                }))
              ),
          ]);
          users = [...students, ...faculty];
          break;
        default:
          throw new Error('Invalid user type');
      }

      return users;
    } catch (err) {
      console.error(`Error in fetchUsers:`, err);
      throw err;
    }
  }
}

export const fetchUsers = new FetchUsers();