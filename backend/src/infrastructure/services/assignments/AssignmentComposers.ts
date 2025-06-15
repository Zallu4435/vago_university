import { AssignmentController } from '../../../presentation/http/assignments/AssignmentController';
import { AssignmentRepository } from '../../repositories/assignments/AssignmentRepository';
import {
  GetAssignmentsUseCase,
  GetAssignmentByIdUseCase,
  CreateAssignmentUseCase,
  UpdateAssignmentUseCase,
  DeleteAssignmentUseCase,
  GetSubmissionsUseCase,
  GetSubmissionByIdUseCase,
  ReviewSubmissionUseCase,
  DownloadSubmissionUseCase,
  GetAnalyticsUseCase
} from '../../../application/assignments/useCases/AssignmentUseCases';

export class AssignmentComposers {
  static composeAssignmentController(): AssignmentController {
    const repository = new AssignmentRepository();
    
    const getAssignmentsUseCase = new GetAssignmentsUseCase(repository);
    const getAssignmentByIdUseCase = new GetAssignmentByIdUseCase(repository);
    const createAssignmentUseCase = new CreateAssignmentUseCase(repository);
    const updateAssignmentUseCase = new UpdateAssignmentUseCase(repository);
    const deleteAssignmentUseCase = new DeleteAssignmentUseCase(repository);
    const getSubmissionsUseCase = new GetSubmissionsUseCase(repository);
    const getSubmissionByIdUseCase = new GetSubmissionByIdUseCase(repository);
    const reviewSubmissionUseCase = new ReviewSubmissionUseCase(repository);
    const downloadSubmissionUseCase = new DownloadSubmissionUseCase(repository);
    const getAnalyticsUseCase = new GetAnalyticsUseCase(repository);

    return new AssignmentController(
      getAssignmentsUseCase,
      getAssignmentByIdUseCase,
      createAssignmentUseCase,
      updateAssignmentUseCase,
      deleteAssignmentUseCase,
      getSubmissionsUseCase,
      getSubmissionByIdUseCase,
      reviewSubmissionUseCase,
      downloadSubmissionUseCase,
      getAnalyticsUseCase
    );
  }
} 