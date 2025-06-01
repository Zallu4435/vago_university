import mongoose from 'mongoose';
import { StudentFinancialInfoModel } from '../../../infrastructure/database/mongoose/models/financial.model';

interface FinancialInfo {
  id: string;
  studentId: string;
  chargeId: string;
  amount: number;
  paymentDueDate: string;
  status: 'Paid' | 'Pending';
  term: string;
  issuedAt: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  chargeTitle?: string;
  chargeDescription?: string;
}

interface GetStudentFinancialInfoOutput {
  info: FinancialInfo[]; // Pending records
  history: FinancialInfo[]; // Paid records
}

export class GetStudentFinancialInfo {
  async execute(studentId: string): Promise<GetStudentFinancialInfoOutput> {
    try {
      // Validate studentId
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }

      // Fetch all financial info for the student
      const infos = await StudentFinancialInfoModel.find({ studentId })
        .lean()
        .populate('chargeId', 'title description'); // Populate charge details if needed

      if (!infos || infos.length === 0) {
        return { info: [], history: [] };
      }

      // Format full record
      const formattedInfos = infos.map((info) => ({
        id: info._id.toString(),
        studentId: info.studentId.toString(),
        chargeId: info.chargeId?._id?.toString?.() || '', // safely access
        amount: info.amount,
        paymentDueDate: info.paymentDueDate.toISOString(),
        status: info.status,
        term: info.term,
        issuedAt: info.issuedAt.toISOString(),
        paidAt: info.paidAt ? info.paidAt.toISOString() : undefined,
        createdAt: info.createdAt.toISOString(),
        updatedAt: info.updatedAt.toISOString(),
        chargeTitle: info.chargeId?.title || '',
        chargeDescription: info.chargeId?.description || '',
        method: info.method || 'Online', // add method if available
      }));

      // Pending: return full detail
      const info = formattedInfos.filter((item) => item.status === 'Pending');

      // History: return only selected fields
      const history = formattedInfos
        .filter((item) => item.status === 'Paid')
        .map((item) => ({
          paidAt: item.paidAt,
          chargeTitle: item.chargeTitle,
          method: item.method,
          amount: item.amount,
        }));

      return { info, history };
    } catch (err) {
      console.error('GetStudentFinancialInfo Error:', err);
      throw new Error(`Failed to fetch financial info: ${(err as Error).message}`);
    }
  }
}

export const getStudentFinancialInfo = new GetStudentFinancialInfo();