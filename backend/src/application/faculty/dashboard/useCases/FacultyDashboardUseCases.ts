import {
  GetFacultyDashboardStatsRequestDTO,
  GetFacultyDashboardDataRequestDTO,
  GetFacultyWeeklyAttendanceRequestDTO,
  GetFacultyCoursePerformanceRequestDTO,
  GetFacultySessionDistributionRequestDTO,
  GetFacultyRecentActivitiesRequestDTO,
  GetFacultySystemStatusRequestDTO,
} from "../../../../domain/faculty/dashboard/dtos/FacultyDashboardRequestDTOs";
import {
  GetFacultyDashboardStatsResponseDTO,
  GetFacultyDashboardDataResponseDTO,
  GetFacultyWeeklyAttendanceResponseDTO,
  GetFacultyCoursePerformanceResponseDTO,
  GetFacultySessionDistributionResponseDTO,
  GetFacultyRecentActivitiesResponseDTO,
  GetFacultySystemStatusResponseDTO,
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

export interface IGetFacultySystemStatusUseCase {
  execute(params: GetFacultySystemStatusRequestDTO): Promise<ResponseDTO<GetFacultySystemStatusResponseDTO>>;
}

export class GetFacultyDashboardStatsUseCase implements IGetFacultyDashboardStatsUseCase {
  constructor(private facultyDashboardRepository: IFacultyDashboardRepository) {}

  async execute(params: GetFacultyDashboardStatsRequestDTO): Promise<ResponseDTO<GetFacultyDashboardStatsResponseDTO>> {
    try {
      const result = await this.facultyDashboardRepository.getDashboardStats(params);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message || 'Failed to fetch dashboard stats' }, success: false };
    }
  }
}

export class GetFacultyDashboardDataUseCase implements IGetFacultyDashboardDataUseCase {
  constructor(private facultyDashboardRepository: IFacultyDashboardRepository) {}

  async execute(params: GetFacultyDashboardDataRequestDTO): Promise<ResponseDTO<GetFacultyDashboardDataResponseDTO>> {
    try {
      const result = await this.facultyDashboardRepository.getDashboardData(params);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message || 'Failed to fetch dashboard data' }, success: false };
    }
  }
}

export class GetFacultyWeeklyAttendanceUseCase implements IGetFacultyWeeklyAttendanceUseCase {
  constructor(private facultyDashboardRepository: IFacultyDashboardRepository) {}

  async execute(params: GetFacultyWeeklyAttendanceRequestDTO): Promise<ResponseDTO<GetFacultyWeeklyAttendanceResponseDTO>> {
    try {
      const result = await this.facultyDashboardRepository.getWeeklyAttendance(params);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message || 'Failed to fetch weekly attendance' }, success: false };
    }
  }
}

export class GetFacultyCoursePerformanceUseCase implements IGetFacultyCoursePerformanceUseCase {
  constructor(private facultyDashboardRepository: IFacultyDashboardRepository) {}

  async execute(params: GetFacultyCoursePerformanceRequestDTO): Promise<ResponseDTO<GetFacultyCoursePerformanceResponseDTO>> {
    try {
      const result = await this.facultyDashboardRepository.getCoursePerformance(params);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message || 'Failed to fetch course performance' }, success: false };
    }
  }
}

export class GetFacultySessionDistributionUseCase implements IGetFacultySessionDistributionUseCase {
  constructor(private facultyDashboardRepository: IFacultyDashboardRepository) {}

  async execute(params: GetFacultySessionDistributionRequestDTO): Promise<ResponseDTO<GetFacultySessionDistributionResponseDTO>> {
    try {
      const result = await this.facultyDashboardRepository.getSessionDistribution(params);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message || 'Failed to fetch session distribution' }, success: false };
    }
  }
}

export class GetFacultyRecentActivitiesUseCase implements IGetFacultyRecentActivitiesUseCase {
  constructor(private facultyDashboardRepository: IFacultyDashboardRepository) {}

  async execute(params: GetFacultyRecentActivitiesRequestDTO): Promise<ResponseDTO<GetFacultyRecentActivitiesResponseDTO>> {
    try {
      const result = await this.facultyDashboardRepository.getRecentActivities(params);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message || 'Failed to fetch recent activities' }, success: false };
    }
  }
}

export class GetFacultySystemStatusUseCase implements IGetFacultySystemStatusUseCase {
  constructor(private facultyDashboardRepository: IFacultyDashboardRepository) {}

  async execute(params: GetFacultySystemStatusRequestDTO): Promise<ResponseDTO<GetFacultySystemStatusResponseDTO>> {
    try {
      const result = await this.facultyDashboardRepository.getSystemStatus(params);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message || 'Failed to fetch system status' }, success: false };
    }
  }
} 