import {
  IGetInboxMessagesUseCase,
  IGetSentMessagesUseCase,
  ISendMessageUseCase,
  IMarkMessageAsReadUseCase,
  IDeleteMessageUseCase,
  IGetMessageDetailsUseCase,
  IGetAllAdminsUseCase,
  IGetUserGroupsUseCase,
  IFetchUsersUseCase,
} from "../../../application/communication/useCases/CommunicationUseCases";
import {
  GetInboxMessagesRequestDTO,
  GetSentMessagesRequestDTO,
  SendMessageRequestDTO,
  MarkMessageAsReadRequestDTO,
  DeleteMessageRequestDTO,
  GetMessageDetailsRequestDTO,
  GetAllAdminsRequestDTO,
  GetUserGroupsRequestDTO,
  FetchUsersRequestDTO,
} from "../../../domain/communication/dtos/CommunicationRequestDTOs";
import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, ICommunicationController } from "../IHttp";

export class CommunicationController implements ICommunicationController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getInboxMessagesUseCase: IGetInboxMessagesUseCase,
    private getSentMessagesUseCase: IGetSentMessagesUseCase,
    private sendMessageUseCase: ISendMessageUseCase,
    private markMessageAsReadUseCase: IMarkMessageAsReadUseCase,
    private deleteMessageUseCase: IDeleteMessageUseCase,
    private getMessageDetailsUseCase: IGetMessageDetailsUseCase,
    private getAllAdminsUseCase: IGetAllAdminsUseCase,
    private getUserGroupsUseCase: IGetUserGroupsUseCase,
    private fetchUsersUseCase: IFetchUsersUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getInboxMessages(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { page = "1", limit = "10", search = "", status = "all" } = httpRequest.query || {};
      const { id: userId } = httpRequest.user || {};
      if (!userId) {
        return this.httpErrors.error_401();
      }
      const getInboxMessagesRequestDTO: GetInboxMessagesRequestDTO = {
        userId,
        page: Number(page),
        limit: Number(limit),
        search: String(search),
        status: status as "read" | "unread" | undefined,
      };

      const response = await this.getInboxMessagesUseCase.execute(getInboxMessagesRequestDTO);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      if ('error' in response.data) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getSentMessages(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { page = "1", limit = "10", search = "", status = "all" } = httpRequest.query || {};
      const { id: userId } = httpRequest.user || {};
      if (!userId) {
        return this.httpErrors.error_401();
      }

      const getSentMessagesRequestDTO: GetSentMessagesRequestDTO = {
        userId,
        page: Number(page),
        limit: Number(limit),
        search: String(search),
        status: status as "read" | "unread" | "delivered" | "opened" | undefined,
      };

      const response = await this.getSentMessagesUseCase.execute(getSentMessagesRequestDTO);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      if ('error' in response.data) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async sendMessage(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { subject, message, to, attachments } = httpRequest.body || {};
      const { id: userId, collection: role } = httpRequest.user || {};
      if (!userId || !role) {
        return this.httpErrors.error_401();
      }

      const sendMessageRequestDTO: SendMessageRequestDTO = {
        senderId: userId,
        senderRole: role,
        subject,
        content: message,
        to,
        attachments,
      };

      const response = await this.sendMessageUseCase.execute(sendMessageRequestDTO);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      if ('error' in response.data) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_201(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async markMessageAsRead(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { messageId } = httpRequest.params || {};
      const { id: userId } = httpRequest.user || {};
      if (!messageId || !userId) {
        return this.httpErrors.error_400();
      }

      const markMessageAsReadRequestDTO: MarkMessageAsReadRequestDTO = {
        messageId,
        userId,
      };

      const response = await this.markMessageAsReadUseCase.execute(markMessageAsReadRequestDTO);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      if ('error' in response.data) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async deleteMessage(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('=== deleteMessage Controller DEBUG ===');
      console.log('Request params:', httpRequest.params);
      console.log('Request user:', httpRequest.user);
      console.log('Request body:', httpRequest.body);
      console.log('=====================================');

      const { messageId } = httpRequest.params || {};
      const { id: userId } = httpRequest.user || {};

      console.log('Extracted messageId:', messageId);
      console.log('Extracted userId:', userId);

      if (!messageId || !userId) {
        console.log('Missing messageId or userId');
        return this.httpErrors.error_400();
      }

      const deleteMessageRequestDTO: DeleteMessageRequestDTO = {
        messageId,
        userId,
      };

      console.log('DeleteMessageRequestDTO:', deleteMessageRequestDTO);

      const response = await this.deleteMessageUseCase.execute(deleteMessageRequestDTO);
      console.log('Use case response:', response);

      if (!response.success) {
        console.log('Response not successful');
        return this.httpErrors.error_400();
      }
      if ('error' in response.data) {
        console.log('Error in response data:', response.data.error);
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      console.error('deleteMessage Controller error:', error);
      return this.httpErrors.error_500();
    }
  }

  async getMessageDetails(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { messageId } = httpRequest.params || {};
      const { id: userId } = httpRequest.user || {};
      if (!messageId || !userId) {
        return this.httpErrors.error_400();
      }

      const getMessageDetailsRequestDTO: GetMessageDetailsRequestDTO = {
        messageId,
        userId,
      };

      const response = await this.getMessageDetailsUseCase.execute(getMessageDetailsRequestDTO);
      if (!response.success) {
        if ('error' in response.data && response.data.error === "Message not found") {
          return this.httpErrors.error_404();
        }
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getAllAdmins(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('=== GetAllAdmins Route Start ===');
      const { search = "" } = httpRequest.query || {};
      console.log('GetAllAdmins - Request Query:', { search });

      const getAllAdminsRequestDTO: GetAllAdminsRequestDTO = {
        search: String(search),
      };
      console.log('GetAllAdmins - Request DTO:', getAllAdminsRequestDTO);

      console.log('GetAllAdmins - Calling use case...');
      const response = await this.getAllAdminsUseCase.execute(getAllAdminsRequestDTO);
      console.log('GetAllAdmins - Use Case Response:', JSON.stringify(response, null, 2));

      if (!response.success) {
        console.log('GetAllAdmins - Error: Response not successful');
        return this.httpErrors.error_400();
      }
      if ('error' in response.data) {
        console.log('GetAllAdmins - Error in response data:', response.data.error);
        return this.httpErrors.error_400();
      }

      console.log('GetAllAdmins - Success Response:', JSON.stringify(response.data, null, 2));
      console.log('=== GetAllAdmins Route End ===');
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      console.error('GetAllAdmins - Unexpected error:', error);
      return this.httpErrors.error_500();
    }
  }

  async getUserGroups(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { search = "" } = httpRequest.query || {};
      const getUserGroupsRequestDTO: GetUserGroupsRequestDTO = {
        search: String(search),
      };

      const response = await this.getUserGroupsUseCase.execute(getUserGroupsRequestDTO);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      if ('error' in response.data) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async fetchUsers(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { type, search = "" } = httpRequest.query || {};
      const { id: userId } = httpRequest.user || {};
      if (!userId) {
        return this.httpErrors.error_401();
      }

      console.log('=== Backend fetchUsers DEBUG ===');
      console.log('Frontend type received:', type);
      console.log('Search:', search);
      console.log('================================');

      // Map frontend types to backend types
      let backendType: "all" | "students" | "faculty" | "staff";
      switch (type) {
        case 'individual_students':
        case 'all_students':
          backendType = 'students';
          break;
        case 'individual_faculty':
        case 'all_faculty':
          backendType = 'faculty';
          break;
        case 'all_users':
          backendType = 'all';
          break;
        default:
          backendType = 'all';
      }

      console.log('Mapped to backend type:', backendType);

      const fetchUsersRequestDTO: FetchUsersRequestDTO = {
        type: backendType,
        search: String(search),
        requesterId: userId,
      };

      const response = await this.fetchUsersUseCase.execute(fetchUsersRequestDTO);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      if ('error' in response.data) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getAdminInboxMessages(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { page = "1", limit = "10", search = "", status = "all" } = httpRequest.query || {};
      const { id: userId, collection: role } = httpRequest.user || {};
      if (!userId || role !== 'admin') {
        return this.httpErrors.error_403();
      }

      const getInboxMessagesRequestDTO: GetInboxMessagesRequestDTO = {
        userId,
        page: Number(page),
        limit: Number(limit),
        search: String(search),
        status: status as "read" | "unread" | undefined,
      };

      const response = await this.getInboxMessagesUseCase.execute(getInboxMessagesRequestDTO);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      if ('error' in response.data) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getAdminSentMessages(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { page = "1", limit = "10", search = "", status = "all" } = httpRequest.query || {};
      const { id: userId, collection: role } = httpRequest.user || {};
      if (!userId || role !== 'admin') {
        return this.httpErrors.error_403();
      }

      const getSentMessagesRequestDTO: GetSentMessagesRequestDTO = {
        userId,
        page: Number(page),
        limit: Number(limit),
        search: String(search),
        status: status as "read" | "unread" | "delivered" | "opened" | undefined,
      };

      const response = await this.getSentMessagesUseCase.execute(getSentMessagesRequestDTO);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      if ('error' in response.data) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async sendAdminMessage(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { subject, message, to } = httpRequest.body || {};
      const { id: userId, collection: role } = httpRequest.user || {};
      if (!userId || role !== 'admin') {
        return this.httpErrors.error_403();
      }

      // Parse the to parameter if it's a string
      const recipients = typeof to === 'string' ? JSON.parse(to) : to;

      // Get attachments from files
      const attachments = httpRequest.files || [];

      const sendMessageRequestDTO: SendMessageRequestDTO = {
        senderId: userId,
        senderRole: role,
        subject: subject || '',
        content: message || '',
        to: recipients,
        attachments,
      };

      const response = await this.sendMessageUseCase.execute(sendMessageRequestDTO);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      if ('error' in response.data) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_201(response.data);
    } catch (error: any) {
      console.error('Error in sendAdminMessage:', error);
      return this.httpErrors.error_500();
    }
  }

  async deleteAdminMessage(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { messageId } = httpRequest.params || {};
      const { id: userId, collection: role } = httpRequest.user || {};
      if (!userId || role !== 'admin') {
        return this.httpErrors.error_403();
      }

      const deleteMessageRequestDTO: DeleteMessageRequestDTO = {
        messageId,
        userId,
      };

      const response = await this.deleteMessageUseCase.execute(deleteMessageRequestDTO);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      if ('error' in response.data) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }
}