import { ClubModel } from '../../../infrastructure/database/mongoose/models/club.model';

class DeleteClub {
  async execute(id: string): Promise<void> {
    try {
      console.log(`Executing deleteClub use case with id:`, id);

      const club = await ClubModel.findByIdAndDelete(id).catch((err) => {
        throw new Error(`Failed to delete club: ${err.message}`);
      });

      if (!club) {
        throw new Error('Club not found');
      }
    } catch (err) {
      console.error(`Error in deleteClub use case:`, err);
      throw err;
    }
  }
}

export const deleteClub = new DeleteClub();