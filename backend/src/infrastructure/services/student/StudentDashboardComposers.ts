import { StudentDashboardController } from '../../../presentation/http/student-dashboard/StudentDashboardController';
import {
  GetStudentDashboardDataUseCase,
  GetAnnouncementsUseCase,
  GetDeadlinesUseCase,
  GetClassesUseCase,
  GetOnlineTopicsUseCase,
  GetCalendarDaysUseCase,
  GetSpecialDatesUseCase
} from '../../../application/student/useCases/StudentDashboardUseCases';
import { StudentDashboardRepository } from '../../repositories/student/StudentDashboardRepositoryImpl';

export function getStudentDashboardComposer() {
  // Create repository
  const dashboardRepository = new StudentDashboardRepository();

  // Create use cases
  const getDashboardDataUseCase = new GetStudentDashboardDataUseCase(dashboardRepository);
  const getAnnouncementsUseCase = new GetAnnouncementsUseCase(dashboardRepository);
  const getDeadlinesUseCase = new GetDeadlinesUseCase(dashboardRepository);
  const getClassesUseCase = new GetClassesUseCase(dashboardRepository);
  const getOnlineTopicsUseCase = new GetOnlineTopicsUseCase(dashboardRepository);
  const getCalendarDaysUseCase = new GetCalendarDaysUseCase(dashboardRepository);
  const getSpecialDatesUseCase = new GetSpecialDatesUseCase(dashboardRepository);

  // Create controller
  const studentDashboardController = new StudentDashboardController(
    getDashboardDataUseCase,
    getAnnouncementsUseCase,
    getDeadlinesUseCase,
    getClassesUseCase,
    getOnlineTopicsUseCase,
    getCalendarDaysUseCase,
    getSpecialDatesUseCase
  );

  return {
    studentDashboardController,
  };
} 