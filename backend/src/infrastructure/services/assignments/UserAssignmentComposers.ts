import { UserAssignmentController } from '../../../presentation/http/assignments/UserAssignmentController';
import { UserAssignmentRepository } from '../../repositories/assignments/UserAssignmentRepository';
import {
  GetUserAssignmentsUseCase,
  GetUserAssignmentByIdUseCase,
  SubmitUserAssignmentUseCase,
  GetUserAssignmentStatusUseCase,
  GetUserAssignmentFeedbackUseCase
} from '../../../application/assignments/useCases/UserAssignmentUseCases';

export class UserAssignmentComposers {
  static composeUserAssignmentController(): UserAssignmentController {
    const repository = new UserAssignmentRepository();

    const getUserAssignmentsUseCase = new GetUserAssignmentsUseCase(repository);
    const getUserAssignmentByIdUseCase = new GetUserAssignmentByIdUseCase(repository);
    const submitUserAssignmentUseCase = new SubmitUserAssignmentUseCase(repository);
    const getUserAssignmentStatusUseCase = new GetUserAssignmentStatusUseCase(repository);
    const getUserAssignmentFeedbackUseCase = new GetUserAssignmentFeedbackUseCase(repository);

    return new UserAssignmentController(
      getUserAssignmentsUseCase,
      getUserAssignmentByIdUseCase,
      submitUserAssignmentUseCase,
      getUserAssignmentStatusUseCase,
      getUserAssignmentFeedbackUseCase
    );
  }
} 