import { IUserMaterialsRepository } from '../../../application/materials/repositories/IUserMaterialsRepository';
import { MaterialModel } from '../../database/mongoose/material/MaterialModel';

export class UserMaterialsRepository implements IUserMaterialsRepository {
  async find(filter: any, options: { skip?: number; limit?: number; sort?: any } = {}): Promise<any[]> {
    return MaterialModel.find(filter)
      .sort(options.sort ?? {})
      .skip(options.skip ?? 0)
      .limit(options.limit ?? 0)
      .populate('bookmarks')
      .populate('likes');
  }

  async count(filter): Promise<number> {
    return MaterialModel.countDocuments(filter);
  }

  async findById(id: string): Promise<any | null> {
    return MaterialModel.findById(id).populate('bookmarks').populate('likes');
  }

  async update(id: string, data): Promise<any | null> {
    return MaterialModel.findByIdAndUpdate(id, data, { new: true });
  }

  async toggleBookmark(materialId: string, userId: string): Promise<void> {
    const material = await MaterialModel.findById(materialId);
    if (!material) throw new Error('Material not found');
    const bookmarkIndex = material.bookmarks.findIndex((b) => b.userId === userId);
    if (bookmarkIndex > -1) {
      material.bookmarks.splice(bookmarkIndex, 1);
    } else {
      material.bookmarks.push({ userId });
    }
    await material.save();
  }

  async toggleLike(materialId: string, userId: string): Promise<void> {
    const material = await MaterialModel.findById(materialId);
    if (!material) throw new Error('Material not found');
    const likeIndex = material.likes.findIndex((l) => l.userId === userId);
    if (likeIndex > -1) {
      material.likes.splice(likeIndex, 1);
    } else {
      material.likes.push({ userId });
    }
    await material.save();
  }

  async incrementDownloads(materialId: string): Promise<string> {
    const material = await MaterialModel.findByIdAndUpdate(
      materialId,
      { $inc: { downloads: 1 } }, 
      { new: true, select: 'fileUrl' }
    );
    if (!material) throw new Error('Material not found');
    return material.fileUrl;
  }
} 