import { ICommunicationRepository } from "../../../application/communication/repositories/ICommunicationRepository";
import {
  GetInboxMessagesUseCase,
  GetSentMessagesUseCase,
  SendMessageUseCase,
  MarkMessageAsReadUseCase,
  DeleteMessageUseCase,
  GetMessageDetailsUseCase,
  GetAllAdminsUseCase,
  FetchUsersUseCase,
  IGetInboxMessagesUseCase,
  IGetSentMessagesUseCase,
  ISendMessageUseCase,
  IMarkMessageAsReadUseCase,
  IDeleteMessageUseCase,
  IGetMessageDetailsUseCase,
  IGetAllAdminsUseCase,
  IFetchUsersUseCase,
} from "../../../application/communication/useCases/CommunicationUseCases";
import { CommunicationRepository } from "../../repositories/communication/CommunicationRepository";
import { CommunicationController } from "../../../presentation/http/communication/CommunicationController";
import { ICommunicationController } from "../../../presentation/http/IHttp";

export function getCommunicationComposer(): ICommunicationController {
  const repository: ICommunicationRepository = new CommunicationRepository();

  const getInboxMessagesUseCase: IGetInboxMessagesUseCase = new GetInboxMessagesUseCase(repository);
  const getSentMessagesUseCase: IGetSentMessagesUseCase = new GetSentMessagesUseCase(repository);
  const sendMessageUseCase: ISendMessageUseCase = new SendMessageUseCase(repository);
  const markMessageAsReadUseCase: IMarkMessageAsReadUseCase = new MarkMessageAsReadUseCase(repository);
  const deleteMessageUseCase: IDeleteMessageUseCase = new DeleteMessageUseCase(repository);
  const getMessageDetailsUseCase: IGetMessageDetailsUseCase = new GetMessageDetailsUseCase(repository);
  const getAllAdminsUseCase: IGetAllAdminsUseCase = new GetAllAdminsUseCase(repository);
  const fetchUsersUseCase: IFetchUsersUseCase = new FetchUsersUseCase(repository);

  return new CommunicationController(
    getInboxMessagesUseCase,
    getSentMessagesUseCase,
    sendMessageUseCase,
    markMessageAsReadUseCase,
    deleteMessageUseCase,
    getMessageDetailsUseCase,
    getAllAdminsUseCase,
    fetchUsersUseCase
  );
}