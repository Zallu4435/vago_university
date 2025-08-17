import { IUserMaterialsRepository } from '../../../application/materials/repositories/IUserMaterialsRepository';
import { MaterialModel } from '../../database/mongoose/material/MaterialModel';
import { UserMaterialFilter, MaterialProps } from '../../../domain/materials/entities/MaterialTypes';

export class UserMaterialsRepository implements IUserMaterialsRepository {
  async find(filter: UserMaterialFilter, options: { skip?: number; limit?: number; sort? } = {}) {
    const result = await MaterialModel.find(filter)
      .sort(options.sort ?? {})
      .skip(options.skip ?? 0)
      .limit(options.limit ?? 0)
      .populate('bookmarks')
      .populate('likes')
      .lean();
    return result as unknown as MaterialProps[];
  }

  async count(filter: UserMaterialFilter) {
    return MaterialModel.countDocuments(filter);
  }

  async findById(id: string) {
    const result = await MaterialModel.findById(id).populate('bookmarks').populate('likes').lean();
    return result as unknown as MaterialProps;
  }

  async update(id: string, data: Partial<MaterialProps>) {
    const result = await MaterialModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return result as unknown as MaterialProps;
  }

  async toggleBookmark(materialId: string, userId: string) {
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

  async toggleLike(materialId: string, userId: string) {
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

  async incrementDownloads(materialId: string) {
    const material = await MaterialModel.findByIdAndUpdate(
      materialId,
      { $inc: { downloads: 1 } }, 
      { new: true, select: 'fileUrl' }
    );
    if (!material) throw new Error('Material not found');
    return material.fileUrl;
  }
} 