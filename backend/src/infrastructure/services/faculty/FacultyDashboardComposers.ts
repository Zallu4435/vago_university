import { IFacultyDashboardRepository } from "../../../application/faculty/dashboard/repositories/IFacultyDashboardRepository";
import {
  GetFacultyDashboardStatsUseCase,
  GetFacultyDashboardDataUseCase,
  GetFacultyWeeklyAttendanceUseCase,
  GetFacultyCoursePerformanceUseCase,
  GetFacultySessionDistributionUseCase,
  GetFacultyRecentActivitiesUseCase,
} from "../../../application/faculty/dashboard/useCases/FacultyDashboardUseCases";
import { FacultyDashboardRepository } from "../../repositories/faculty/FacultyDashboardRepository";
import { FacultyDashboardController } from "../../../presentation/http/faculty-dashboard/facultyDashboard.controller";
import { IFacultyDashboardController } from "../../../presentation/http/IHttp";
import { IGetFacultyCoursePerformanceUseCase, IGetFacultyDashboardDataUseCase, IGetFacultyDashboardStatsUseCase, IGetFacultyRecentActivitiesUseCase, IGetFacultySessionDistributionUseCase, IGetFacultyWeeklyAttendanceUseCase } from "../../../application/faculty/dashboard/useCases/FacultyDashboardUseCases";

export function getFacultyDashboardComposer(): IFacultyDashboardController {
  const facultyDashboardRepository: IFacultyDashboardRepository = new FacultyDashboardRepository();

  const getFacultyDashboardStatsUseCase: IGetFacultyDashboardStatsUseCase = new GetFacultyDashboardStatsUseCase(facultyDashboardRepository);
  const getFacultyDashboardDataUseCase: IGetFacultyDashboardDataUseCase = new GetFacultyDashboardDataUseCase(facultyDashboardRepository);
  const getFacultyWeeklyAttendanceUseCase: IGetFacultyWeeklyAttendanceUseCase = new GetFacultyWeeklyAttendanceUseCase(facultyDashboardRepository);
  const getFacultyCoursePerformanceUseCase: IGetFacultyCoursePerformanceUseCase = new GetFacultyCoursePerformanceUseCase(facultyDashboardRepository);
  const getFacultySessionDistributionUseCase: IGetFacultySessionDistributionUseCase = new GetFacultySessionDistributionUseCase(facultyDashboardRepository);
  const getFacultyRecentActivitiesUseCase: IGetFacultyRecentActivitiesUseCase = new GetFacultyRecentActivitiesUseCase(facultyDashboardRepository);

  return new FacultyDashboardController(
    getFacultyDashboardStatsUseCase,
    getFacultyDashboardDataUseCase,
    getFacultyWeeklyAttendanceUseCase,
    getFacultyCoursePerformanceUseCase,
    getFacultySessionDistributionUseCase,
    getFacultyRecentActivitiesUseCase
  );
} 