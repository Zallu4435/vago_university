import { StudentDashboardController } from '../../../presentation/http/student-dashboard/StudentDashboardController';
import {
  GetAnnouncementsUseCase,
  GetDeadlinesUseCase,
  GetClassesUseCase,
  GetCalendarDaysUseCase,
  GetNewEventsUseCase,
  GetUserInfoForDashboardUseCase,
  IGetAnnouncementsUseCase,
  IGetDeadlinesUseCase,
  IGetCalendarDaysUseCase,
  IGetClassesUseCase,
  IGetNewEventsUseCase,
  IGetUserInfoForDashboardUseCase
} from '../../../application/student/useCases/StudentDashboardUseCases';
import { StudentDashboardRepository } from '../../repositories/student/StudentDashboardRepositoryImpl';

export function getStudentDashboardComposer() {
  const dashboardRepository = new StudentDashboardRepository();

  const getAnnouncementsUseCase: IGetAnnouncementsUseCase = new GetAnnouncementsUseCase(dashboardRepository);
  const getDeadlinesUseCase: IGetDeadlinesUseCase = new GetDeadlinesUseCase(dashboardRepository);
  const getClassesUseCase: IGetClassesUseCase = new GetClassesUseCase(dashboardRepository);
  const getCalendarDaysUseCase: IGetCalendarDaysUseCase = new GetCalendarDaysUseCase(dashboardRepository);
  const getNewEventsUseCase: IGetNewEventsUseCase = new GetNewEventsUseCase(dashboardRepository);
  const getUserInfoForDashboardUseCase: IGetUserInfoForDashboardUseCase = new GetUserInfoForDashboardUseCase(dashboardRepository);

  const studentDashboardController = new StudentDashboardController(
    getAnnouncementsUseCase,
    getDeadlinesUseCase,
    getClassesUseCase,
    getCalendarDaysUseCase,
    getNewEventsUseCase,
    getUserInfoForDashboardUseCase
  );

  return {
    studentDashboardController,
    getUserInfoForDashboardUseCase,
  };
} 