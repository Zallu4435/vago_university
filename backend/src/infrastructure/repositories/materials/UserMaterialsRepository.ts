import { IUserMaterialsRepository } from '../../../application/materials/repositories/IUserMaterialsRepository';
import { Material } from '../../../domain/materials/entities/Material';
import { MaterialModel } from '../../database/mongoose/material/MaterialModel';
import { 
  GetUserMaterialsRequestDTO, 
  GetUserMaterialByIdRequestDTO,
  ToggleBookmarkRequestDTO, 
  ToggleLikeRequestDTO, 
  DownloadMaterialRequestDTO
} from '../../../domain/materials/dtos/UserMaterialRequestDTOs';
import { GetUserMaterialsResponseDTO } from '../../../domain/materials/dtos/UserMaterialResponseDTOs';

export class UserMaterialsRepository implements IUserMaterialsRepository {
  async getUserMaterials(params: GetUserMaterialsRequestDTO): Promise<GetUserMaterialsResponseDTO> {
    const { userId, subject, course, semester, type, difficulty, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (subject) query.subject = { $regex: `^${subject.replace(/\+/g, ' ')}`, $options: 'i' };
    if (course) {
      query.course = course;
    } else if (subject) {
      query.course = { $regex: `^${subject.replace(/\+/g, ' ')}`, $options: 'i' };
    }
    if (semester) query.semester = semester;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { uploadedBy: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let sortOptions: any = {};
    switch (sortBy) {
      case 'createdAt':
        sortOptions.uploadedAt = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'downloads':
        sortOptions.downloads = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'views':
        sortOptions.views = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'rating':
        sortOptions.rating = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'title':
        sortOptions.title = sortOrder === 'asc' ? 1 : -1;
        break;
      default:
        sortOptions.uploadedAt = -1; 
    }

    const [materials, total] = await Promise.all([
      (MaterialModel as any).find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('bookmarks')
        .populate('likes'),
      (MaterialModel as any).countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      materials: materials.map((material: any) => {
        const obj = material.toObject();
        return {
          id: obj._id.toString(),
          title: obj.title,
          description: obj.description,
          subject: obj.subject,
          course: obj.course,
          semester: obj.semester,
          type: obj.type as any,
          fileUrl: obj.fileUrl,
          thumbnailUrl: obj.thumbnailUrl,
          tags: obj.tags,
          difficulty: obj.difficulty as any,
          estimatedTime: obj.estimatedTime,
          isNew: obj.isNew,
          isRestricted: obj.isRestricted,
          uploadedBy: obj.uploadedBy,
          uploadedAt: obj.uploadedAt.toISOString(),
          views: obj.views,
          downloads: obj.downloads,
          rating: obj.rating,
        };
      }),
      totalPages,
      bookmarkedMaterials: [],
      likedMaterials: []
    };
  }

  async getUserMaterialById(params: GetUserMaterialByIdRequestDTO): Promise<GetUserMaterialsResponseDTO> {
    const { userId, id } = params;
    const material = await (MaterialModel as any).findById(id)
      .populate('bookmarks')
      .populate('likes');

    if (!material) {
      return {
        materials: [],
        totalPages: 0,
        bookmarkedMaterials: [],
        likedMaterials: []
      };
    }

    const obj = material.toObject();
    return {
      materials: [{
        id: obj._id.toString(),
        title: obj.title,
        description: obj.description,
        subject: obj.subject,
        course: obj.course,
        semester: obj.semester,
        type: obj.type as any,
        fileUrl: obj.fileUrl,
        thumbnailUrl: obj.thumbnailUrl,
        tags: obj.tags,
        difficulty: obj.difficulty as any,
        estimatedTime: obj.estimatedTime,
        isNew: obj.isNew,
        isRestricted: obj.isRestricted,
        uploadedBy: obj.uploadedBy,
        uploadedAt: obj.uploadedAt.toISOString(),
        views: obj.views,
        downloads: obj.downloads,
        rating: obj.rating,
      }],
      totalPages: 1,
      bookmarkedMaterials: [],
      likedMaterials: []
    };
  }

  async toggleBookmark(params: ToggleBookmarkRequestDTO): Promise<void> {
    const { materialId, userId } = params;
    const material = await (MaterialModel as any).findById(materialId);
    if (!material) throw new Error('Material not found');

    const bookmarkIndex = material.bookmarks.findIndex((b: any) => b.userId === userId);
    if (bookmarkIndex > -1) {
      material.bookmarks.splice(bookmarkIndex, 1);
    } else {
      material.bookmarks.push({ userId });
    }
    await material.save();
  }

  async toggleLike(params: ToggleLikeRequestDTO): Promise<void> {
    const { materialId, userId } = params;
    const material = await (MaterialModel as any).findById(materialId);
    if (!material) throw new Error('Material not found');

    const likeIndex = material.likes.findIndex((l: any) => l.userId === userId);
    if (likeIndex > -1) {
      material.likes.splice(likeIndex, 1);
    } else {
      material.likes.push({ userId });
    }
    await material.save();
  }

  async downloadMaterial(params: DownloadMaterialRequestDTO): Promise<string> {
    const { materialId } = params;
    
    const material = await (MaterialModel as any).findByIdAndUpdate(
      materialId,
      { $inc: { downloads: 1 } }, 
      { new: true, select: 'fileUrl' }
    );
    
    if (!material) throw new Error('Material not found');
    return material.fileUrl;
  }
} 