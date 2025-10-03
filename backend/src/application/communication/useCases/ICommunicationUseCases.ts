import {
  GetInboxMessagesRequestDTO,
  GetSentMessagesRequestDTO,
  SendMessageRequestDTO,
  MarkMessageAsReadRequestDTO,
  DeleteMessageRequestDTO,
  GetMessageDetailsRequestDTO,
  GetAllAdminsRequestDTO,
  FetchUsersRequestDTO,
} from "../../../domain/communication/dtos/CommunicationRequestDTOs";
import {
  GetInboxMessagesResponseDTO,
  GetSentMessagesResponseDTO,
  SendMessageResponseDTO,
  MarkMessageAsReadResponseDTO,
  DeleteMessageResponseDTO,
  GetMessageDetailsResponseDTO,
  AdminSentMessageResponseDTO,
  GetAllAdminsResponseDTO,
  FetchUsersResponseDTO,
  ResponseDTO
} from "../../../domain/communication/dtos/CommunicationResponseDTOs";

export interface IGetInboxMessagesUseCase {
  execute(params: GetInboxMessagesRequestDTO): Promise<ResponseDTO<GetInboxMessagesResponseDTO>>;
}

export interface IGetSentMessagesUseCase {
  execute(params: GetSentMessagesRequestDTO): Promise<ResponseDTO<GetSentMessagesResponseDTO>>;
}

export interface ISendMessageUseCase {
  execute(params: SendMessageRequestDTO): Promise<ResponseDTO<SendMessageResponseDTO>>;
}

export interface IMarkMessageAsReadUseCase {
  execute(params: MarkMessageAsReadRequestDTO): Promise<ResponseDTO<MarkMessageAsReadResponseDTO>>;
}

export interface IDeleteMessageUseCase {
  execute(params: DeleteMessageRequestDTO): Promise<ResponseDTO<DeleteMessageResponseDTO>>;
}

export interface IGetMessageDetailsUseCase {
  execute(params: GetMessageDetailsRequestDTO): Promise<ResponseDTO<GetMessageDetailsResponseDTO>>;
}

export interface IGetAllAdminsUseCase {
  execute(params: GetAllAdminsRequestDTO): Promise<ResponseDTO<GetAllAdminsResponseDTO>>;
}

export interface IFetchUsersUseCase {
  execute(params: FetchUsersRequestDTO): Promise<ResponseDTO<FetchUsersResponseDTO>>;
}
