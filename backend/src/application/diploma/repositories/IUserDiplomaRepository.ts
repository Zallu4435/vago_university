import {
  GetUserDiplomasRequestDTO,
  GetUserDiplomaByIdRequestDTO,
  GetUserDiplomaChapterRequestDTO,
  UpdateVideoProgressRequestDTO,
  MarkChapterCompleteRequestDTO,
  ToggleBookmarkRequestDTO,
} from "../../../domain/diploma/dtos/UserDiplomaRequestDTOs";
import {
  GetUserDiplomasResponseDTO,
  GetUserDiplomaByIdResponseDTO,
  GetUserDiplomaChapterResponseDTO,
  UpdateVideoProgressResponseDTO,
  MarkChapterCompleteResponseDTO,
  ToggleBookmarkResponseDTO,
} from "../../../domain/diploma/dtos/UserDiplomaResponseDTOs";

export interface IUserDiplomaRepository {
  getUserDiplomas(params: GetUserDiplomasRequestDTO): Promise<GetUserDiplomasResponseDTO>;
  getUserDiplomaById(params: GetUserDiplomaByIdRequestDTO): Promise<GetUserDiplomaByIdResponseDTO | null>;
  getUserDiplomaChapter(params: GetUserDiplomaChapterRequestDTO): Promise<GetUserDiplomaChapterResponseDTO | null>;
  updateVideoProgress(params: UpdateVideoProgressRequestDTO): Promise<UpdateVideoProgressResponseDTO>;
  markChapterComplete(params: MarkChapterCompleteRequestDTO): Promise<MarkChapterCompleteResponseDTO>;
  toggleBookmark(params: ToggleBookmarkRequestDTO): Promise<ToggleBookmarkResponseDTO>;
  getCompletedChapters(userId: string, courseId: string): Promise<string[]>;
  getBookmarkedChapters(userId: string, courseId: string): Promise<string[]>;
} 