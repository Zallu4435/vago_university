import { IAssignmentRepository } from '../../../application/assignments/repositories/IAssignmentRepository';
import { AssignmentRepository } from '../../repositories/assignments/AssignmentRepository';
import {
  IGetAssignmentsUseCase,
  IGetAssignmentByIdUseCase,
  ICreateAssignmentUseCase,
  IUpdateAssignmentUseCase,
  IDeleteAssignmentUseCase,
  IGetSubmissionsUseCase,
  IGetSubmissionByIdUseCase,
  IReviewSubmissionUseCase,
  IDownloadSubmissionUseCase,
  IGetAnalyticsUseCase,
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
import { AssignmentController } from '../../../presentation/http/assignments/AssignmentController';
import { IAssignmentController } from '../../../presentation/http/IHttp';

export function getAssignmentComposer(): IAssignmentController {
  const repository: IAssignmentRepository = new AssignmentRepository();
  
  const getAssignmentsUseCase: IGetAssignmentsUseCase = new GetAssignmentsUseCase(repository);
  const getAssignmentByIdUseCase: IGetAssignmentByIdUseCase = new GetAssignmentByIdUseCase(repository);
  const createAssignmentUseCase: ICreateAssignmentUseCase = new CreateAssignmentUseCase(repository);
  const updateAssignmentUseCase: IUpdateAssignmentUseCase = new UpdateAssignmentUseCase(repository);
  const deleteAssignmentUseCase: IDeleteAssignmentUseCase = new DeleteAssignmentUseCase(repository);
  const getSubmissionsUseCase: IGetSubmissionsUseCase = new GetSubmissionsUseCase(repository);
  const getSubmissionByIdUseCase: IGetSubmissionByIdUseCase = new GetSubmissionByIdUseCase(repository);
  const reviewSubmissionUseCase: IReviewSubmissionUseCase = new ReviewSubmissionUseCase(repository);
  const downloadSubmissionUseCase: IDownloadSubmissionUseCase = new DownloadSubmissionUseCase(repository);
  const getAnalyticsUseCase: IGetAnalyticsUseCase = new GetAnalyticsUseCase(repository);

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