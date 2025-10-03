import { EnquiryController } from "../../../presentation/http/enquiry/EnquiryController";
import { EnquiryRepository } from "../../repositories/enquiry/EnquiryRepository";
import {
  ICreateEnquiryUseCase,
  IGetEnquiriesUseCase,
  IGetEnquiryByIdUseCase,
  IUpdateEnquiryStatusUseCase,
  IDeleteEnquiryUseCase,
  ISendEnquiryReplyUseCase,
} from "../../../application/enquiry/useCases/IEnquiryUseCases";
import {
  CreateEnquiryUseCase,
  GetEnquiriesUseCase,
  GetEnquiryByIdUseCase,
  UpdateEnquiryStatusUseCase,
  DeleteEnquiryUseCase,
  SendEnquiryReplyUseCase,
} from "../../../application/enquiry/useCases/EnquiryUseCases";
import { emailService } from "../../services/email.service";
import { IEnquiryController } from "../../../presentation/http/IHttp";

export function getEnquiryComposer(): IEnquiryController {
  const enquiryRepository = new EnquiryRepository();
  
  const createEnquiryUseCase: ICreateEnquiryUseCase = new CreateEnquiryUseCase(enquiryRepository);
  const getEnquiriesUseCase: IGetEnquiriesUseCase = new GetEnquiriesUseCase(enquiryRepository);
  const getEnquiryByIdUseCase: IGetEnquiryByIdUseCase = new GetEnquiryByIdUseCase(enquiryRepository);
  const updateEnquiryStatusUseCase: IUpdateEnquiryStatusUseCase = new UpdateEnquiryStatusUseCase(enquiryRepository);
  const deleteEnquiryUseCase: IDeleteEnquiryUseCase = new DeleteEnquiryUseCase(enquiryRepository);
  const sendEnquiryReplyUseCase: ISendEnquiryReplyUseCase = new SendEnquiryReplyUseCase(enquiryRepository, emailService);

  return new EnquiryController(
    createEnquiryUseCase,
    getEnquiriesUseCase,
    getEnquiryByIdUseCase,
    updateEnquiryStatusUseCase,
    deleteEnquiryUseCase,
    sendEnquiryReplyUseCase
  );
} 