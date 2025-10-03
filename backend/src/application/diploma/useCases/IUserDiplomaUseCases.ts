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
  GetBookmarkedChaptersResponseDTO,
  ResponseDTO
} from "../../../domain/diploma/dtos/UserDiplomaResponseDTOs";

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
