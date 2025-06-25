import { GetEventRequestsRequestDTO, ApproveEventRequestRequestDTO, RejectEventRequestRequestDTO, GetEventRequestDetailsRequestDTO } from "../../../domain/events/dtos/EventRequestRequestDTOs";
import { GetEventRequestsResponseDTO, GetEventRequestDetailsResponseDTO } from "../../../domain/events/dtos/EventRequestResponseDTOs";
import { IEventsRepository } from "../repositories/IEventsRepository";
import { EventErrorType } from "../../../domain/events/enums/EventErrorType";
import mongoose from "mongoose";

interface ResponseDTO<T> {
  data: T | { error: string };
  success: boolean;
}

export interface IGetEventRequestsUseCase {
  execute(params: GetEventRequestsRequestDTO): Promise<{
    success: boolean;
    data: GetEventRequestsResponseDTO | { error: string };
  }>;
}

export interface IApproveEventRequestUseCase {
  execute(params: ApproveEventRequestRequestDTO): Promise<ResponseDTO<{ message: string }>>;
}

export interface IRejectEventRequestUseCase {
  execute(params: RejectEventRequestRequestDTO): Promise<ResponseDTO<{ message: string }>>;
}

export interface IGetEventRequestDetailsUseCase {
  execute(params: GetEventRequestDetailsRequestDTO): Promise<ResponseDTO<GetEventRequestDetailsResponseDTO>>;
}

export class GetEventRequestsUseCase implements IGetEventRequestsUseCase {
  constructor(private eventsRepository: IEventsRepository) { }

  async execute(params: GetEventRequestsRequestDTO): Promise<{
    success: boolean;
    data: GetEventRequestsResponseDTO | { error: string };
  }> {
    try {
      const { page, limit, startDate, endDate } = params;

      if (page < 1 || limit < 1) {
        return {
          success: false,
          data: { error: "Invalid pagination parameters" },
        };
      }

      let formattedStartDate: Date | undefined;
      let formattedEndDate: Date | undefined;

      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          return {
            success: false,
            data: { error: "Invalid start date format" },
          };
        }
        formattedStartDate = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
          return {
            success: false,
            data: { error: "Invalid end date format" },
          };
        }
        formattedEndDate = end;
      }

      if (formattedStartDate && formattedEndDate && formattedStartDate > formattedEndDate) {
        return {
          success: false,
          data: { error: "Start date cannot be after end date" },
        };
      }

      const response = await this.eventsRepository.getEventRequests({
        ...params,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Error in GetEventRequestsUseCase:", error);
      return {
        success: false,
        data: { error: "Internal server error" },
      };
    }
  }
}

export class ApproveEventRequestUseCase implements IApproveEventRequestUseCase {
  constructor(private eventsRepository: IEventsRepository) { }

  async execute(params: ApproveEventRequestRequestDTO): Promise<ResponseDTO<{ message: string }>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { data: { error: EventErrorType.InvalidEventId }, success: false };
      }
      await this.eventsRepository.approveEventRequest(params);
      return { data: { message: "Event request approved successfully" }, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class RejectEventRequestUseCase implements IRejectEventRequestUseCase {
  constructor(private eventsRepository: IEventsRepository) { }

  async execute(params: RejectEventRequestRequestDTO): Promise<ResponseDTO<{ message: string }>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { data: { error: EventErrorType.InvalidEventId }, success: false };
      }
      await this.eventsRepository.rejectEventRequest(params);
      return { data: { message: "Event request rejected successfully" }, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetEventRequestDetailsUseCase implements IGetEventRequestDetailsUseCase {
  constructor(private eventsRepository: IEventsRepository) { }

  async execute(params: GetEventRequestDetailsRequestDTO): Promise<ResponseDTO<GetEventRequestDetailsResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { data: { error: EventErrorType.InvalidEventId }, success: false };
      }
      const result = await this.eventsRepository.getEventRequestDetails(params);
      if (!result) {
        return { data: { error: EventErrorType.EventRequestNotFound }, success: false };
      }
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}