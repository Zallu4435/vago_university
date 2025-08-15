import {
  GetFacultyDashboardStatsRequestDTO,
  GetFacultyDashboardDataRequestDTO,
  GetFacultyWeeklyAttendanceRequestDTO,
  GetFacultyCoursePerformanceRequestDTO,
  GetFacultySessionDistributionRequestDTO,
  GetFacultyRecentActivitiesRequestDTO,
} from "../../../../domain/faculty/dashboard/dtos/FacultyDashboardRequestDTOs";
import {
  GetFacultyDashboardStatsResponseDTO,
  GetFacultyDashboardDataResponseDTO,
  GetFacultyWeeklyAttendanceResponseDTO,
  GetFacultyCoursePerformanceResponseDTO,
  GetFacultySessionDistributionResponseDTO,
  GetFacultyRecentActivitiesResponseDTO,
} from "../../../../domain/faculty/dashboard/dtos/FacultyDashboardResponseDTOs";
import { IFacultyDashboardRepository } from "../repositories/IFacultyDashboardRepository";

interface ResponseDTO<T> {
  data: T | { error: string };
  success: boolean;
}

export interface IGetFacultyDashboardStatsUseCase {
  execute(params: GetFacultyDashboardStatsRequestDTO): Promise<ResponseDTO<GetFacultyDashboardStatsResponseDTO>>;
}

export interface IGetFacultyDashboardDataUseCase {
  execute(params: GetFacultyDashboardDataRequestDTO): Promise<ResponseDTO<GetFacultyDashboardDataResponseDTO>>;
}

export interface IGetFacultyWeeklyAttendanceUseCase {
  execute(params: GetFacultyWeeklyAttendanceRequestDTO): Promise<ResponseDTO<GetFacultyWeeklyAttendanceResponseDTO>>;
}

export interface IGetFacultyCoursePerformanceUseCase {
  execute(params: GetFacultyCoursePerformanceRequestDTO): Promise<ResponseDTO<GetFacultyCoursePerformanceResponseDTO>>;
}

export interface IGetFacultySessionDistributionUseCase {
  execute(params: GetFacultySessionDistributionRequestDTO): Promise<ResponseDTO<GetFacultySessionDistributionResponseDTO>>;
}

export interface IGetFacultyRecentActivitiesUseCase {
  execute(params: GetFacultyRecentActivitiesRequestDTO): Promise<ResponseDTO<GetFacultyRecentActivitiesResponseDTO>>;
}



export class GetFacultyDashboardStatsUseCase implements IGetFacultyDashboardStatsUseCase {
  constructor(private facultyDashboardRepository: IFacultyDashboardRepository) {}

  async execute(params: GetFacultyDashboardStatsRequestDTO): Promise<ResponseDTO<GetFacultyDashboardStatsResponseDTO>> {
    const result = await this.facultyDashboardRepository.getDashboardStats(params);
    return { data: result, success: true };
  }
}

export class GetFacultyDashboardDataUseCase implements IGetFacultyDashboardDataUseCase {
  constructor(private facultyDashboardRepository: IFacultyDashboardRepository) {}

  async execute(params: GetFacultyDashboardDataRequestDTO): Promise<ResponseDTO<GetFacultyDashboardDataResponseDTO>> {
    const result = await this.facultyDashboardRepository.getDashboardData(params);
    return { data: result, success: true };
  }
}

export class GetFacultyWeeklyAttendanceUseCase implements IGetFacultyWeeklyAttendanceUseCase {
  constructor(private facultyDashboardRepository: IFacultyDashboardRepository) {}

  async execute(params: GetFacultyWeeklyAttendanceRequestDTO): Promise<ResponseDTO<GetFacultyWeeklyAttendanceResponseDTO>> {    
    const result = await this.facultyDashboardRepository.getWeeklyAttendance(params);
    return { data: result, success: true };
  }
}

export class GetFacultyCoursePerformanceUseCase implements IGetFacultyCoursePerformanceUseCase {
  constructor(private facultyDashboardRepository: IFacultyDashboardRepository) {}

  async execute(params: GetFacultyCoursePerformanceRequestDTO): Promise<ResponseDTO<GetFacultyCoursePerformanceResponseDTO>> {
    const result = await this.facultyDashboardRepository.getAssignmentPerformance(params);
    return { data: result, success: true };
  }
}

export class GetFacultySessionDistributionUseCase implements IGetFacultySessionDistributionUseCase {
  constructor(private facultyDashboardRepository: IFacultyDashboardRepository) {}

  async execute(params: GetFacultySessionDistributionRequestDTO): Promise<ResponseDTO<GetFacultySessionDistributionResponseDTO>> {
    const result = await this.facultyDashboardRepository.getSessionDistribution(params);
    return { data: result, success: true };
  }
}

export class GetFacultyRecentActivitiesUseCase implements IGetFacultyRecentActivitiesUseCase {
  constructor(private facultyDashboardRepository: IFacultyDashboardRepository) {}

  async execute(params: GetFacultyRecentActivitiesRequestDTO): Promise<ResponseDTO<GetFacultyRecentActivitiesResponseDTO>> {
    const result = await this.facultyDashboardRepository.getRecentActivities(params);
    return { data: result, success: true };
  }
}

 