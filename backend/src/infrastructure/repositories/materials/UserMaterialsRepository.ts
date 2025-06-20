import { IUserMaterialsRepository } from '../../../application/materials/repositories/IUserMaterialsRepository';
import { Material } from '../../../domain/materials/entities/Material';
import { MaterialModel } from '../../database/mongoose/material/MaterialModel';
import { 
  GetUserMaterialsRequestDTO, 
  GetUserMaterialByIdRequestDTO,
  ToggleBookmarkRequestDTO, 
  ToggleLikeRequestDTO, 
  DownloadMaterialRequestDTO,
  GetUserBookmarkedMaterialsRequestDTO,
  GetUserLikedMaterialsRequestDTO
} from '../../../domain/materials/dtos/UserMaterialRequestDTOs';
import { GetUserMaterialsResponseDTO } from '../../../domain/materials/dtos/UserMaterialResponseDTOs';

export class UserMaterialsRepository implements IUserMaterialsRepository {
  async getUserMaterials(params: GetUserMaterialsRequestDTO): Promise<GetUserMaterialsResponseDTO> {
    const { userId, subject, course, semester, type, difficulty, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (subject) query.subject = subject;
    if (course) query.course = course;
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
      MaterialModel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('bookmarks')
        .populate('likes'),
      MaterialModel.countDocuments(query)
    ]);

    return {
      materials: materials.map(material => new Material({
        ...material.toObject(),
        isBookmarked: material.bookmarks.some(b => b.userId === userId),
        isLiked: material.likes.some(l => l.userId === userId)
      })),
      total,
      page,
      limit
    };
  }

  async getUserMaterialById(params: GetUserMaterialByIdRequestDTO): Promise<GetUserMaterialsResponseDTO> {
    const { userId, id } = params;
    const material = await MaterialModel.findById(id)
      .populate('bookmarks')
      .populate('likes');

    if (!material) {
      return {
        materials: [],
        total: 0,
        page: 1,
        limit: 1
      };
    }

    return {
      materials: [new Material({
        ...material.toObject(),
        isBookmarked: material.bookmarks.some(b => b.userId === userId),
        isLiked: material.likes.some(l => l.userId === userId)
      })],
      total: 1,
      page: 1,
      limit: 1
    };
  }

  async toggleBookmark(params: ToggleBookmarkRequestDTO): Promise<void> {
    const { materialId, userId } = params;
    const material = await MaterialModel.findById(materialId);
    if (!material) throw new Error('Material not found');

    const bookmarkIndex = material.bookmarks.findIndex(b => b.userId === userId);
    if (bookmarkIndex > -1) {
      material.bookmarks.splice(bookmarkIndex, 1);
    } else {
      material.bookmarks.push({ userId });
    }
    await material.save();
  }

  async toggleLike(params: ToggleLikeRequestDTO): Promise<void> {
    const { materialId, userId } = params;
    const material = await MaterialModel.findById(materialId);
    if (!material) throw new Error('Material not found');

    const likeIndex = material.likes.findIndex(l => l.userId === userId);
    if (likeIndex > -1) {
      material.likes.splice(likeIndex, 1);
    } else {
      material.likes.push({ userId });
    }
    await material.save();
  }

  async downloadMaterial(params: DownloadMaterialRequestDTO): Promise<string> {
    const { materialId } = params;
    
    const material = await MaterialModel.findByIdAndUpdate(
      materialId,
      { $inc: { downloads: 1 } }, 
      { new: true, select: 'fileUrl' }
    );
    
    if (!material) throw new Error('Material not found');
    return material.fileUrl;
  }

  async getUserBookmarkedMaterials(params: GetUserBookmarkedMaterialsRequestDTO): Promise<GetUserMaterialsResponseDTO> {
    const { userId, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [materials, total] = await Promise.all([
      MaterialModel.find({
        'bookmarks.userId': userId
      })
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('bookmarks')
      .populate('likes'),
      MaterialModel.countDocuments({
        'bookmarks.userId': userId
      })
    ]);

    return {
      materials: materials.map(material => new Material({
        ...material.toObject(),
        isBookmarked: true,
        isLiked: material.likes.some(l => l.userId === userId)
      })),
      total,
      page,
      limit
    };
  }

  async getUserLikedMaterials(params: GetUserLikedMaterialsRequestDTO): Promise<GetUserMaterialsResponseDTO> {
    const { userId, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [materials, total] = await Promise.all([
      MaterialModel.find({
        'likes.userId': userId
      })
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('bookmarks')
      .populate('likes'),
      MaterialModel.countDocuments({
        'likes.userId': userId
      })
    ]);

    return {
      materials: materials.map(material => new Material({
        ...material.toObject(),
        isBookmarked: material.bookmarks.some(b => b.userId === userId),
        isLiked: true
      })),
      total,
      page,
      limit
    };
  }
} 