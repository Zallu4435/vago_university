// IStudentDashboardRepository.ts
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

export interface IStudentDashboardRepository {
  getStudentDashboardData(params: GetStudentDashboardDataRequestDTO): Promise<GetStudentDashboardDataResponseDTO>;
  getAnnouncements(params: GetAnnouncementsRequestDTO): Promise<GetAnnouncementsResponseDTO>;
  getDeadlines(params: GetDeadlinesRequestDTO): Promise<GetDeadlinesResponseDTO>;
  getClasses(params: GetClassesRequestDTO): Promise<GetClassesResponseDTO>;
  getOnlineTopics(params: GetOnlineTopicsRequestDTO): Promise<GetOnlineTopicsResponseDTO>;
  getCalendarDays(params: GetCalendarDaysRequestDTO): Promise<GetCalendarDaysResponseDTO>;
  getSpecialDates(params: GetSpecialDatesRequestDTO): Promise<GetSpecialDatesResponseDTO>;
} 