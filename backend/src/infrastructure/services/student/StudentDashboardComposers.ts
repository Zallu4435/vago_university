import { StudentDashboardController } from '../../../presentation/http/student-dashboard/StudentDashboardController';
import {
  GetAnnouncementsUseCase,
  GetDeadlinesUseCase,
  GetClassesUseCase,
  GetCalendarDaysUseCase,
  GetNewEventsUseCase,
  GetUserInfoForDashboardUseCase
} from '../../../application/student/useCases/StudentDashboardUseCases';
import { StudentDashboardRepository } from '../../repositories/student/StudentDashboardRepositoryImpl';

export function getStudentDashboardComposer() {
  const dashboardRepository = new StudentDashboardRepository();

  const getAnnouncementsUseCase = new GetAnnouncementsUseCase(dashboardRepository);
  const getDeadlinesUseCase = new GetDeadlinesUseCase(dashboardRepository);
  const getClassesUseCase = new GetClassesUseCase(dashboardRepository);
  const getCalendarDaysUseCase = new GetCalendarDaysUseCase(dashboardRepository);
  const getNewEventsUseCase = new GetNewEventsUseCase(dashboardRepository);
  const getUserInfoForDashboardUseCase = new GetUserInfoForDashboardUseCase(dashboardRepository);

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