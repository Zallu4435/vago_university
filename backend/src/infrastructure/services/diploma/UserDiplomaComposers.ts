import { UserDiplomaController } from "../../../presentation/http/diploma/UserDiplomaController";
import { UserDiplomaRepository } from "../../repositories/diploma/UserDiplomaRepository";
import {
  GetUserDiplomasUseCase,
  GetUserDiplomaByIdUseCase,
  GetUserDiplomaChapterUseCase,
  UpdateVideoProgressUseCase,
  MarkChapterCompleteUseCase,
  ToggleBookmarkUseCase,
  GetCompletedChaptersUseCase,
  GetBookmarkedChaptersUseCase
} from "../../../application/diploma/useCases/UserDiplomaUseCases";

export const getUserDiplomaComposer = () => {
  const userDiplomaRepository = new UserDiplomaRepository();
  
  const getUserDiplomasUseCase = new GetUserDiplomasUseCase(userDiplomaRepository);
  const getUserDiplomaByIdUseCase = new GetUserDiplomaByIdUseCase(userDiplomaRepository);
  const getUserDiplomaChapterUseCase = new GetUserDiplomaChapterUseCase(userDiplomaRepository);
  const updateVideoProgressUseCase = new UpdateVideoProgressUseCase(userDiplomaRepository);
  const markChapterCompleteUseCase = new MarkChapterCompleteUseCase(userDiplomaRepository);
  const toggleBookmarkUseCase = new ToggleBookmarkUseCase(userDiplomaRepository);
  const getCompletedChaptersUseCase = new GetCompletedChaptersUseCase(userDiplomaRepository);
  const getBookmarkedChaptersUseCase = new GetBookmarkedChaptersUseCase(userDiplomaRepository);

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
}; 