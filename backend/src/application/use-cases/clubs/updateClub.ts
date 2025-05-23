import { ClubModel } from '../../../infrastructure/database/mongoose/models/club.model';

interface UpdateClubParams {
  name?: string;
  category?: string;
  description?: string;
  status?: string;
}

class UpdateClub {
  async execute(id: string, data: UpdateClubParams): Promise<any> {
    try {
      console.log(`Executing updateClub use case with id:`, id, `and data:`, data);

      const club = await ClubModel.findByIdAndUpdate(
        id,
        { ...data, updatedAt: Date.now() },
        { new: true, runValidators: true }
      )
        .select('name category description createdBy status')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to update club: ${err.message}`);
        });

      if (!club) {
        throw new Error('Club not found');
      }

      return club;
    } catch (err) {
      console.error(`Error in updateClub use case:`, err);
      throw err;
    }
  }
}

export const updateClub = new UpdateClub();