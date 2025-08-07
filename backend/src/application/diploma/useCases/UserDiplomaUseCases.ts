import { IUserDiplomaRepository } from "../repositories/IUserDiplomaRepository";
import {
  GetUserDiplomasRequestDTO,
  GetUserDiplomaByIdRequestDTO,
  GetUserDiplomaChapterRequestDTO,
  UpdateVideoProgressRequestDTO,
  MarkChapterCompleteRequestDTO,
  ToggleBookmarkRequestDTO
} from "../../../domain/diploma/dtos/UserDiplomaRequestDTOs";
import {
  GetUserDiplomasResponseDTO,
  GetUserDiplomaByIdResponseDTO,
  GetUserDiplomaChapterResponseDTO,
  UpdateVideoProgressResponseDTO,
  MarkChapterCompleteResponseDTO,
  ToggleBookmarkResponseDTO,
  GetCompletedChaptersResponseDTO,
  GetBookmarkedChaptersResponseDTO
} from "../../../domain/diploma/dtos/UserDiplomaResponseDTOs";
import { DiplomaNotFoundError, InvalidDiplomaStatusError } from "../../../domain/diploma/errors/DiplomaErrors";
import mongoose from "mongoose";
 
interface ResponseDTO<T> {
  data: T;
  success: boolean;
}

export interface IGetUserDiplomasUseCase {
  execute(params: GetUserDiplomasRequestDTO): Promise<ResponseDTO<GetUserDiplomasResponseDTO>>;
}

export interface IGetUserDiplomaByIdUseCase {
  execute(params: GetUserDiplomaByIdRequestDTO): Promise<ResponseDTO<GetUserDiplomaByIdResponseDTO>>;
}

export interface IGetUserDiplomaChapterUseCase {
  execute(params: GetUserDiplomaChapterRequestDTO): Promise<ResponseDTO<GetUserDiplomaChapterResponseDTO>>;
}

export interface IUpdateVideoProgressUseCase {
  execute(params: UpdateVideoProgressRequestDTO): Promise<ResponseDTO<UpdateVideoProgressResponseDTO>>;
}

export interface IMarkChapterCompleteUseCase {
  execute(params: MarkChapterCompleteRequestDTO): Promise<ResponseDTO<MarkChapterCompleteResponseDTO>>;
}

export interface IToggleBookmarkUseCase {
  execute(params: ToggleBookmarkRequestDTO): Promise<ResponseDTO<ToggleBookmarkResponseDTO>>;
}

export interface IGetCompletedChaptersUseCase {
  execute(userId: string, courseId: string): Promise<ResponseDTO<GetCompletedChaptersResponseDTO>>;
}

export interface IGetBookmarkedChaptersUseCase {
  execute(userId: string, courseId: string): Promise<ResponseDTO<GetBookmarkedChaptersResponseDTO>>;
}

export class GetUserDiplomasUseCase implements IGetUserDiplomasUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(params: GetUserDiplomasRequestDTO): Promise<ResponseDTO<GetUserDiplomasResponseDTO>> {
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      throw new Error("Invalid page or limit parameters");
    }
    const { courses, total, page, limit } = await this.userDiplomaRepository.getUserDiplomas(params.page, params.limit, params.category, params.status, params.dateRange);
    return {
      success: true,
      data: {
        courses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

export class GetUserDiplomaByIdUseCase implements IGetUserDiplomaByIdUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(params: GetUserDiplomaByIdRequestDTO): Promise<ResponseDTO<GetUserDiplomaByIdResponseDTO>> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new InvalidDiplomaStatusError("Invalid diploma ID");
    }
    const diploma = await this.userDiplomaRepository.getUserDiplomaById(params.id);
    if (!diploma) {
      throw new DiplomaNotFoundError(params.id);
    }
    return {
      success: true,
      data: diploma
    };
  }
}

export class GetUserDiplomaChapterUseCase implements IGetUserDiplomaChapterUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(params: GetUserDiplomaChapterRequestDTO): Promise<ResponseDTO<GetUserDiplomaChapterResponseDTO>> {
    if (!mongoose.isValidObjectId(params.courseId) || !mongoose.isValidObjectId(params.chapterId)) {
      throw new InvalidDiplomaStatusError("Invalid course or chapter ID");
    }
    const chapter = await this.userDiplomaRepository.getUserDiplomaChapter(params.courseId, params.chapterId);
    if (!chapter) {
      throw new DiplomaNotFoundError(params.chapterId);
    }
    return {
      success: true,
      data: chapter
    };
  }
}

export class UpdateVideoProgressUseCase implements IUpdateVideoProgressUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(params: UpdateVideoProgressRequestDTO): Promise<ResponseDTO<UpdateVideoProgressResponseDTO>> {
    if (!mongoose.isValidObjectId(params.courseId) || !mongoose.isValidObjectId(params.chapterId)) {
      throw new InvalidDiplomaStatusError("Invalid course or chapter ID");
    }
    if (typeof params.progress !== 'number' || params.progress < 0 || params.progress > 100) {
      throw new Error("Invalid progress value");
    }
    const userProgress = await this.userDiplomaRepository.updateVideoProgress(params.userId, params.courseId, params.chapterId, params.progress);
    return {
      success: true,
      data: {
        message: 'Progress updated successfully',
        progress: userProgress.progress
      }
    };
  }
}

export class MarkChapterCompleteUseCase implements IMarkChapterCompleteUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(params: MarkChapterCompleteRequestDTO): Promise<ResponseDTO<MarkChapterCompleteResponseDTO>> {
    if (!mongoose.isValidObjectId(params.courseId) || !mongoose.isValidObjectId(params.chapterId)) {
      throw new InvalidDiplomaStatusError("Invalid course or chapter ID");
    }
    const userProgress = await this.userDiplomaRepository.markChapterComplete(params.userId, params.courseId, params.chapterId);
    return {
      success: true,
      data: {
        message: 'Chapter marked as complete',
        completed: true
      }
    };
  }
}

export class ToggleBookmarkUseCase implements IToggleBookmarkUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(params: ToggleBookmarkRequestDTO): Promise<ResponseDTO<ToggleBookmarkResponseDTO>> {
    if (!mongoose.isValidObjectId(params.courseId) || !mongoose.isValidObjectId(params.chapterId)) {
      throw new InvalidDiplomaStatusError("Invalid course or chapter ID");
    }
    const userProgress = await this.userDiplomaRepository.toggleBookmark(params.userId, params.courseId, params.chapterId);
    return {
      success: true,
      data: {
        message: userProgress.bookmarked ? 'Chapter bookmarked' : 'Chapter unbookmarked',
        bookmarked: userProgress.bookmarked
      }
    };
  }
}

export class GetCompletedChaptersUseCase implements IGetCompletedChaptersUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(userId: string, courseId: string): Promise<ResponseDTO<GetCompletedChaptersResponseDTO>> {
    if (!mongoose.isValidObjectId(courseId)) {
      throw new InvalidDiplomaStatusError("Invalid course ID");
    }
    const completedChapters = await this.userDiplomaRepository.getCompletedChapters(userId, courseId);
    return {
      success: true,
      data: { chapters: completedChapters.map((chapter: any) => chapter.chapterId.toString()) }
    };
  }
}

export class GetBookmarkedChaptersUseCase implements IGetBookmarkedChaptersUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(userId: string, courseId: string): Promise<ResponseDTO<GetBookmarkedChaptersResponseDTO>> {
    if (!mongoose.isValidObjectId(courseId)) {
      throw new InvalidDiplomaStatusError("Invalid course ID");
    }
    const bookmarkedChapters = await this.userDiplomaRepository.getBookmarkedChapters(userId, courseId);
    return {
      success: true,
      data: { chapters: bookmarkedChapters.map((chapter: any) => chapter.chapterId.toString()) }
    };
  }
} 