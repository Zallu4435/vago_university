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
import mongoose from "mongoose";

interface ResponseDTO<T> {
  data: T | { error: string };
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
    try {
      if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
        return { success: false, data: { error: "Invalid page or limit parameters" } };
      }
      const result = await this.userDiplomaRepository.getUserDiplomas(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetUserDiplomaByIdUseCase implements IGetUserDiplomaByIdUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(params: GetUserDiplomaByIdRequestDTO): Promise<ResponseDTO<GetUserDiplomaByIdResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { success: false, data: { error: "Invalid diploma ID" } };
      }
      const result = await this.userDiplomaRepository.getUserDiplomaById(params);
      if (!result) {
        return { success: false, data: { error: "Diploma not found" } };
      }
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetUserDiplomaChapterUseCase implements IGetUserDiplomaChapterUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(params: GetUserDiplomaChapterRequestDTO): Promise<ResponseDTO<GetUserDiplomaChapterResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.courseId) || !mongoose.isValidObjectId(params.chapterId)) {
        return { success: false, data: { error: "Invalid course or chapter ID" } };
      }
      const result = await this.userDiplomaRepository.getUserDiplomaChapter(params);
      if (!result) {
        return { success: false, data: { error: "Chapter not found" } };
      }
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class UpdateVideoProgressUseCase implements IUpdateVideoProgressUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(params: UpdateVideoProgressRequestDTO): Promise<ResponseDTO<UpdateVideoProgressResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.courseId) || !mongoose.isValidObjectId(params.chapterId)) {
        return { success: false, data: { error: "Invalid course or chapter ID" } };
      }
      if (typeof params.progress !== 'number' || params.progress < 0 || params.progress > 100) {
        return { success: false, data: { error: "Invalid progress value" } };
      }
      const result = await this.userDiplomaRepository.updateVideoProgress(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class MarkChapterCompleteUseCase implements IMarkChapterCompleteUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(params: MarkChapterCompleteRequestDTO): Promise<ResponseDTO<MarkChapterCompleteResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.courseId) || !mongoose.isValidObjectId(params.chapterId)) {
        return { success: false, data: { error: "Invalid course or chapter ID" } };
      }
      const result = await this.userDiplomaRepository.markChapterComplete(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class ToggleBookmarkUseCase implements IToggleBookmarkUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(params: ToggleBookmarkRequestDTO): Promise<ResponseDTO<ToggleBookmarkResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.courseId) || !mongoose.isValidObjectId(params.chapterId)) {
        return { success: false, data: { error: "Invalid course or chapter ID" } };
      }
      const result = await this.userDiplomaRepository.toggleBookmark(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetCompletedChaptersUseCase implements IGetCompletedChaptersUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(userId: string, courseId: string): Promise<ResponseDTO<GetCompletedChaptersResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(courseId)) {
        return { success: false, data: { error: "Invalid course ID" } };
      }
      const chapters = await this.userDiplomaRepository.getCompletedChapters(userId, courseId);
      return { success: true, data: { chapters } };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetBookmarkedChaptersUseCase implements IGetBookmarkedChaptersUseCase {
  constructor(private readonly userDiplomaRepository: IUserDiplomaRepository) {}

  async execute(userId: string, courseId: string): Promise<ResponseDTO<GetBookmarkedChaptersResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(courseId)) {
        return { success: false, data: { error: "Invalid course ID" } };
      }
      const chapters = await this.userDiplomaRepository.getBookmarkedChapters(userId, courseId);
      return { success: true, data: { chapters } };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
} 