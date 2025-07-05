import { IFacultyDashboardRepository } from "../../../application/faculty/dashboard/repositories/IFacultyDashboardRepository";
import {
  GetFacultyDashboardStatsUseCase,
  GetFacultyDashboardDataUseCase,
  GetFacultyWeeklyAttendanceUseCase,
  GetFacultyCoursePerformanceUseCase,
  GetFacultySessionDistributionUseCase,
  GetFacultyRecentActivitiesUseCase,
  GetFacultySystemStatusUseCase,
} from "../../../application/faculty/dashboard/useCases/FacultyDashboardUseCases";
import { FacultyDashboardRepository } from "../../repositories/faculty/FacultyDashboardRepository";
import { FacultyDashboardController } from "../../../presentation/http/controllers/facultyDashboard.controller";
import { IFacultyDashboardController } from "../../../presentation/http/IHttp";

export function getFacultyDashboardComposer(): IFacultyDashboardController {
  const facultyDashboardRepository: IFacultyDashboardRepository = new FacultyDashboardRepository();

  const getFacultyDashboardStatsUseCase = new GetFacultyDashboardStatsUseCase(facultyDashboardRepository);
  const getFacultyDashboardDataUseCase = new GetFacultyDashboardDataUseCase(facultyDashboardRepository);
  const getFacultyWeeklyAttendanceUseCase = new GetFacultyWeeklyAttendanceUseCase(facultyDashboardRepository);
  const getFacultyCoursePerformanceUseCase = new GetFacultyCoursePerformanceUseCase(facultyDashboardRepository);
  const getFacultySessionDistributionUseCase = new GetFacultySessionDistributionUseCase(facultyDashboardRepository);
  const getFacultyRecentActivitiesUseCase = new GetFacultyRecentActivitiesUseCase(facultyDashboardRepository);
  const getFacultySystemStatusUseCase = new GetFacultySystemStatusUseCase(facultyDashboardRepository);

  return new FacultyDashboardController(
    getFacultyDashboardStatsUseCase,
    getFacultyDashboardDataUseCase,
    getFacultyWeeklyAttendanceUseCase,
    getFacultyCoursePerformanceUseCase,
    getFacultySessionDistributionUseCase,
    getFacultyRecentActivitiesUseCase,
    getFacultySystemStatusUseCase
  );
} 