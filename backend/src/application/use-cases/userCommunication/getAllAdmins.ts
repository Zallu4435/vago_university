import { Admin as AdminModel } from '../../../infrastructure/database/mongoose/models/admin.model';

interface AdminInfo {
  _id: string;
  name: string;
  email: string;
}

class GetAllAdmins {
  async execute(): Promise<AdminInfo[]> {
    try {
      console.log('Executing GetAllAdmins use case');

      const admins = await AdminModel.find()
        .select('firstName lastName email')
        .lean();

      return admins.map((admin: any) => ({
        _id: admin._id.toString(),
        name: `${admin.firstName ?? ''} ${admin.lastName ?? ''}`.trim(),
        email: admin.email,
      }));
    } catch (err) {
      console.error('Error in GetAllAdmins:', err);
      throw new Error('Failed to fetch admins');
    }
  }
}

export const getAllAdmins = new GetAllAdmins();
