// StudentDashboardUseCases.ts
import {
  GetStudentDashboardDataRequestDTO,
  GetAnnouncementsRequestDTO,
  GetDeadlinesRequestDTO,
  GetClassesRequestDTO,
  GetOnlineTopicsRequestDTO,
  GetCalendarDaysRequestDTO,
  GetSpecialDatesRequestDTO,
} from "../../../domain/student/dtos/StudentDashboardRequestDTOs";

import {
  GetStudentDashboardDataResponseDTO,
  GetAnnouncementsResponseDTO,
  GetDeadlinesResponseDTO,
  GetClassesResponseDTO,
  GetOnlineTopicsResponseDTO,
  GetCalendarDaysResponseDTO,
  GetSpecialDatesResponseDTO,
} from "../../../domain/student/dtos/StudentDashboardResponseDTOs";

import { IStudentDashboardRepository } from "../repositories/IStudentDashboardRepository";

interface ResponseDTO<T> {
  data: T | { error: string };
  success: boolean;
}

export interface IGetStudentDashboardDataUseCase {
  execute(params: GetStudentDashboardDataRequestDTO): Promise<ResponseDTO<GetStudentDashboardDataResponseDTO>>;
}

export interface IGetAnnouncementsUseCase {
  execute(params: GetAnnouncementsRequestDTO): Promise<ResponseDTO<GetAnnouncementsResponseDTO>>;
}

export interface IGetDeadlinesUseCase {
  execute(params: GetDeadlinesRequestDTO): Promise<ResponseDTO<GetDeadlinesResponseDTO>>;
}

export interface IGetClassesUseCase {
  execute(params: GetClassesRequestDTO): Promise<ResponseDTO<GetClassesResponseDTO>>;
}

export interface IGetOnlineTopicsUseCase {
  execute(params: GetOnlineTopicsRequestDTO): Promise<ResponseDTO<GetOnlineTopicsResponseDTO>>;
}

export interface IGetCalendarDaysUseCase {
  execute(params: GetCalendarDaysRequestDTO): Promise<ResponseDTO<GetCalendarDaysResponseDTO>>;
}

export interface IGetSpecialDatesUseCase {
  execute(params: GetSpecialDatesRequestDTO): Promise<ResponseDTO<GetSpecialDatesResponseDTO>>;
}

export class GetStudentDashboardDataUseCase implements IGetStudentDashboardDataUseCase {
  constructor(private studentDashboardRepository: IStudentDashboardRepository) {}

  async execute(params: GetStudentDashboardDataRequestDTO): Promise<ResponseDTO<GetStudentDashboardDataResponseDTO>> {
    try {
      const response = await this.studentDashboardRepository.getStudentDashboardData(params);
      return { data: response, success: true };
    } catch (error) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetAnnouncementsUseCase implements IGetAnnouncementsUseCase {
  constructor(private studentDashboardRepository: IStudentDashboardRepository) {}

  async execute(params: GetAnnouncementsRequestDTO): Promise<ResponseDTO<GetAnnouncementsResponseDTO>> {
    try {
      const response = await this.studentDashboardRepository.getAnnouncements(params);
      return { data: response, success: true };
    } catch (error) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetDeadlinesUseCase implements IGetDeadlinesUseCase {
  constructor(private studentDashboardRepository: IStudentDashboardRepository) {}

  async execute(params: GetDeadlinesRequestDTO): Promise<ResponseDTO<GetDeadlinesResponseDTO>> {
    try {
      const response = await this.studentDashboardRepository.getDeadlines(params);
      return { data: response, success: true };
    } catch (error) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetClassesUseCase implements IGetClassesUseCase {
  constructor(private studentDashboardRepository: IStudentDashboardRepository) {}

  async execute(params: GetClassesRequestDTO): Promise<ResponseDTO<GetClassesResponseDTO>> {
    try {
      const response = await this.studentDashboardRepository.getClasses(params);
      return { data: response, success: true };
    } catch (error) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetOnlineTopicsUseCase implements IGetOnlineTopicsUseCase {
  constructor(private studentDashboardRepository: IStudentDashboardRepository) {}

  async execute(params: GetOnlineTopicsRequestDTO): Promise<ResponseDTO<GetOnlineTopicsResponseDTO>> {
    try {
      const response = await this.studentDashboardRepository.getOnlineTopics(params);
      return { data: response, success: true };
    } catch (error) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetCalendarDaysUseCase implements IGetCalendarDaysUseCase {
  constructor(private studentDashboardRepository: IStudentDashboardRepository) {}

  async execute(params: GetCalendarDaysRequestDTO): Promise<ResponseDTO<GetCalendarDaysResponseDTO>> {
    try {
      const response = await this.studentDashboardRepository.getCalendarDays(params);
      return { data: response, success: true };
    } catch (error) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetSpecialDatesUseCase implements IGetSpecialDatesUseCase {
  constructor(private studentDashboardRepository: IStudentDashboardRepository) {}

  async execute(params: GetSpecialDatesRequestDTO): Promise<ResponseDTO<GetSpecialDatesResponseDTO>> {
    try {
      const response = await this.studentDashboardRepository.getSpecialDates(params);
      return { data: response, success: true };
    } catch (error) {
      return { data: { error: error.message }, success: false };
    }
  }
} 