// IStudentDashboardRepository.ts
import {
  GetAnnouncementsRequestDTO,
  GetDeadlinesRequestDTO,
  GetClassesRequestDTO,
  GetCalendarDaysRequestDTO,
  GetUserInfoRequestDTO,
} from "../../../domain/student/dtos/StudentDashboardRequestDTOs";

import {
  GetAnnouncementsResponseDTO,
  GetDeadlinesResponseDTO,
  GetClassesResponseDTO,
  GetCalendarDaysResponseDTO,
  NewEventDTO,
  GetUserInfoResponseDTO,
} from "../../../domain/student/dtos/StudentDashboardResponseDTOs";

export interface IStudentDashboardRepository {
  getAnnouncements(params: GetAnnouncementsRequestDTO): Promise<GetAnnouncementsResponseDTO>;
  getDeadlines(params: GetDeadlinesRequestDTO): Promise<GetDeadlinesResponseDTO>;
  getClasses(params: GetClassesRequestDTO): Promise<GetClassesResponseDTO>;
  getCalendarDays(params: GetCalendarDaysRequestDTO): Promise<GetCalendarDaysResponseDTO>;
  getNewEvents(studentId: string): Promise<NewEventDTO[]>;
  getUserInfo(params: GetUserInfoRequestDTO): Promise<GetUserInfoResponseDTO>;
} 