import { ICommunicationRepository } from "../../../application/communication/repositories/ICommunicationRepository";
import {
  GetInboxMessagesUseCase,
  GetSentMessagesUseCase,
  SendMessageUseCase,
  MarkMessageAsReadUseCase,
  DeleteMessageUseCase,
  GetMessageDetailsUseCase,
  GetAllAdminsUseCase,
  GetUserGroupsUseCase,
  FetchUsersUseCase,
} from "../../../application/communication/useCases/CommunicationUseCases";
import { CommunicationRepository } from "../../repositories/communication/CommunicationRepository";
import { CommunicationController } from "../../../presentation/http/communication/CommunicationController";
import { ICommunicationController } from "../../../presentation/http/IHttp";

export function getCommunicationComposer(): ICommunicationController {
  const repository: ICommunicationRepository = new CommunicationRepository();

  const getInboxMessagesUseCase = new GetInboxMessagesUseCase(repository);
  const getSentMessagesUseCase = new GetSentMessagesUseCase(repository);
  const sendMessageUseCase = new SendMessageUseCase(repository);
  const markMessageAsReadUseCase = new MarkMessageAsReadUseCase(repository);
  const deleteMessageUseCase = new DeleteMessageUseCase(repository);
  const getMessageDetailsUseCase = new GetMessageDetailsUseCase(repository);
  const getAllAdminsUseCase = new GetAllAdminsUseCase(repository);
  const getUserGroupsUseCase = new GetUserGroupsUseCase();
  const fetchUsersUseCase = new FetchUsersUseCase(repository);

  return new CommunicationController(
    getInboxMessagesUseCase,
    getSentMessagesUseCase,
    sendMessageUseCase,
    markMessageAsReadUseCase,
    deleteMessageUseCase,
    getMessageDetailsUseCase,
    getAllAdminsUseCase,
    getUserGroupsUseCase,
    fetchUsersUseCase
  );
}