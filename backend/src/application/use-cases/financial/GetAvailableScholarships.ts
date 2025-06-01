import { ScholarshipModel } from '../../../infrastructure/database/mongoose/models/financial.model';

export class GetAvailableScholarships {
  async execute(filters: { status?: string; term?: string }): Promise<any[]> {
    try {
      const query: any = {};
      if (filters.status) query.status = filters.status;
      if (filters.term) query.term = filters.term;
      const scholarships = await ScholarshipModel.find(query).lean();
      if (!scholarships.length) return [];
      return scholarships.map(s => ({
        id: s._id.toString(),
        name: s.name,
        description: s.description,
        amount: s.amount,
        deadline: s.deadline.toISOString(),
        requirements: s.requirements,
        status: s.status,
        term: s.term,
      }));
    } catch (err) {
      console.error('GetAvailableScholarships Error:', err);
      throw new Error(`Failed to fetch scholarships: ${err.message}`);
    }
  }
}