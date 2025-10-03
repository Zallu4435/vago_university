import {
    GetAnnouncementsRequestDTO,
    GetDeadlinesRequestDTO,
    GetClassesRequestDTO,
    GetCalendarDaysRequestDTO,
    GetUserInfoRequestDTO,
} from "../../../domain/student/dtos/StudentDashboardRequestDTOs";
import {
    GetDeadlinesResponseDTO,
    GetClassesResponseDTO,
    GetCalendarDaysResponseDTO,
    NewEventDTO as BaseNewEventDTO,
    GetUserInfoResponseDTO,
    ResponseDTO
} from "../../../domain/student/dtos/StudentDashboardResponseDTOs";

export type NewEventDTO = BaseNewEventDTO & { description: string };

export interface IGetAnnouncementsUseCase {
    execute(params: GetAnnouncementsRequestDTO): Promise<ResponseDTO<{ title: string; date: Date }[]>>;
}

export interface IGetDeadlinesUseCase {
    execute(params: GetDeadlinesRequestDTO): Promise<GetDeadlinesResponseDTO>;
}

export interface IGetClassesUseCase {
    execute(params: GetClassesRequestDTO): Promise<GetClassesResponseDTO>;
}

export interface IGetCalendarDaysUseCase {
    execute(params: GetCalendarDaysRequestDTO): Promise<GetCalendarDaysResponseDTO>;
}

export interface IGetNewEventsUseCase {
    execute(studentId: string): Promise<ResponseDTO<NewEventDTO[]>>;
}

export interface IGetUserInfoForDashboardUseCase {
    execute(params: GetUserInfoRequestDTO): Promise<ResponseDTO<GetUserInfoResponseDTO>>;
}