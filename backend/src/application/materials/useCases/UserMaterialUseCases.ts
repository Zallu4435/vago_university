import { IUserMaterialsRepository } from '../repositories/IUserMaterialsRepository';
import {
  GetUserMaterialsRequestDTO,
  GetUserMaterialByIdRequestDTO,
  ToggleBookmarkRequestDTO,
  ToggleLikeRequestDTO,
  DownloadMaterialRequestDTO,
} from '../../../domain/materials/dtos/UserMaterialRequestDTOs';
import { GetUserMaterialsResponseDTO } from '../../../domain/materials/dtos/UserMaterialResponseDTOs';
import { MaterialNotFoundError, MaterialValidationError } from '../../../domain/materials/errors/MaterialErrors';

function toUserMaterialProps(obj: any, userId: string) {
  const isBookmarked = obj.bookmarks && obj.bookmarks.some((b: any) => b.userId === userId);
  const isLiked = obj.likes && obj.likes.some((l: any) => l.userId === userId);
  return {
    id: obj._id.toString(),
    title: obj.title,
    description: obj.description,
    subject: obj.subject,
    course: obj.course,
    semester: obj.semester,
    type: obj.type,
    fileUrl: obj.fileUrl,
    thumbnailUrl: obj.thumbnailUrl,
    tags: obj.tags,
    difficulty: obj.difficulty,
    estimatedTime: obj.estimatedTime,
    isNewMaterial: obj.isNewMaterial,
    isRestricted: obj.isRestricted,
    uploadedBy: obj.uploadedBy,
    uploadedAt: obj.uploadedAt instanceof Date ? obj.uploadedAt.toISOString() : obj.uploadedAt,
    views: obj.views,
    downloads: obj.downloads,
    rating: obj.rating,
    isBookmarked,
    isLiked,
  };
}

export class GetUserMaterialsUseCase {
  constructor(private repo: IUserMaterialsRepository) { }
  async execute(params: GetUserMaterialsRequestDTO): Promise<GetUserMaterialsResponseDTO> {
    const { userId, subject, course, semester, type, difficulty, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (subject) filter.subject = { $regex: `^${subject.replace(/\+/g, ' ')}`, $options: 'i' };
    if (course) {
      filter.course = course;
    } else if (subject) {
      filter.course = { $regex: `^${subject.replace(/\+/g, ' ')}`, $options: 'i' };
    }
    if (semester) filter.semester = semester;
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
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
      this.repo.find(filter, { skip, limit, sort: sortOptions }),
      this.repo.count(filter)
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      materials: materials.map((m: any) => toUserMaterialProps(m, userId)),
      totalPages,
      bookmarkedMaterials: [],
      likedMaterials: []
    };
  }
}

export class GetUserMaterialByIdUseCase {
  constructor(private repo: IUserMaterialsRepository) { }
  async execute(params: GetUserMaterialByIdRequestDTO): Promise<GetUserMaterialsResponseDTO> {
    const { userId, id } = params;
    const material = await this.repo.findById(id);
    if (!material) throw new MaterialNotFoundError(id);
    return {
      materials: [toUserMaterialProps(material, userId)],
      totalPages: 1,
      bookmarkedMaterials: [],
      likedMaterials: []
    };
  }
}

export class ToggleBookmarkUseCase {
  constructor(private repo: IUserMaterialsRepository) { }
  async execute(params: ToggleBookmarkRequestDTO): Promise<void> {
    if (!params.id || !params.userId) throw new MaterialValidationError('Material ID and User ID are required');
    await this.repo.toggleBookmark(params.id, params.userId);
  }
}

export class ToggleLikeUseCase {
  constructor(private repo: IUserMaterialsRepository) { }
  async execute(params: ToggleLikeRequestDTO): Promise<void> {
    if (!params.id || !params.userId) throw new MaterialValidationError('Material ID and User ID are required');
    await this.repo.toggleLike(params.id, params.userId);
  }
}

export class DownloadMaterialUseCase {
  constructor(private repo: IUserMaterialsRepository) { }
  async execute(params: DownloadMaterialRequestDTO): Promise<string> {
    if (!params.id) throw new MaterialValidationError('Material ID is required');
    return this.repo.incrementDownloads(params.id);
  }
} 