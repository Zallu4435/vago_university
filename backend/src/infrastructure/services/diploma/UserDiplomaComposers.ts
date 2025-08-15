import { IUserDiplomaRepository } from "../../../application/diploma/repositories/IUserDiplomaRepository";
import {
  IGetUserDiplomasUseCase,
  IGetUserDiplomaByIdUseCase,
  IGetUserDiplomaChapterUseCase,
  IUpdateVideoProgressUseCase,
  IMarkChapterCompleteUseCase,
  IToggleBookmarkUseCase,
  IGetCompletedChaptersUseCase,
  IGetBookmarkedChaptersUseCase,
  GetUserDiplomasUseCase,
  GetUserDiplomaByIdUseCase,
  GetUserDiplomaChapterUseCase,
  UpdateVideoProgressUseCase,
  MarkChapterCompleteUseCase,
  ToggleBookmarkUseCase,
  GetCompletedChaptersUseCase,
  GetBookmarkedChaptersUseCase
} from "../../../application/diploma/useCases/UserDiplomaUseCases";
import { UserDiplomaRepository } from "../../repositories/diploma/UserDiplomaRepository";
import { IUserDiplomaController } from "../../../presentation/http/IHttp";
import { UserDiplomaController } from "../../../presentation/http/diploma/UserDiplomaController";

export function getUserDiplomaComposer(): IUserDiplomaController {
  const repository: IUserDiplomaRepository = new UserDiplomaRepository();

  const getUserDiplomasUseCase: IGetUserDiplomasUseCase = new GetUserDiplomasUseCase(repository);
  const getUserDiplomaByIdUseCase: IGetUserDiplomaByIdUseCase = new GetUserDiplomaByIdUseCase(repository);
  const getUserDiplomaChapterUseCase: IGetUserDiplomaChapterUseCase = new GetUserDiplomaChapterUseCase(repository);
  const updateVideoProgressUseCase: IUpdateVideoProgressUseCase = new UpdateVideoProgressUseCase(repository);
  const markChapterCompleteUseCase: IMarkChapterCompleteUseCase = new MarkChapterCompleteUseCase(repository);
  const toggleBookmarkUseCase: IToggleBookmarkUseCase = new ToggleBookmarkUseCase(repository);
  const getCompletedChaptersUseCase: IGetCompletedChaptersUseCase = new GetCompletedChaptersUseCase(repository);
  const getBookmarkedChaptersUseCase: IGetBookmarkedChaptersUseCase = new GetBookmarkedChaptersUseCase(repository);

  return new UserDiplomaController(
    getUserDiplomasUseCase,
    getUserDiplomaByIdUseCase,
    getUserDiplomaChapterUseCase,
    updateVideoProgressUseCase,
    markChapterCompleteUseCase,
    toggleBookmarkUseCase,
    getCompletedChaptersUseCase,
    getBookmarkedChaptersUseCase
  );
} 