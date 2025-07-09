import { EnquiryController } from "../../../presentation/http/enquiry/EnquiryController";
import { EnquiryRepository } from "../../repositories/enquiry/EnquiryRepository";
import {
  CreateEnquiryUseCase,
  GetEnquiriesUseCase,
  GetEnquiryByIdUseCase,
  UpdateEnquiryStatusUseCase,
  DeleteEnquiryUseCase,
  SendEnquiryReplyUseCase,
} from "../../../application/enquiry/useCases/EnquiryUseCases";
import { emailService } from "../../services/email.service";

export function getEnquiryComposer(): EnquiryController {
  const enquiryRepository = new EnquiryRepository();
  
  const createEnquiryUseCase = new CreateEnquiryUseCase(enquiryRepository);
  const getEnquiriesUseCase = new GetEnquiriesUseCase(enquiryRepository);
  const getEnquiryByIdUseCase = new GetEnquiryByIdUseCase(enquiryRepository);
  const updateEnquiryStatusUseCase = new UpdateEnquiryStatusUseCase(enquiryRepository);
  const deleteEnquiryUseCase = new DeleteEnquiryUseCase(enquiryRepository);
  const sendEnquiryReplyUseCase = new SendEnquiryReplyUseCase(enquiryRepository, emailService);

  return new EnquiryController(
    createEnquiryUseCase,
    getEnquiriesUseCase,
    getEnquiryByIdUseCase,
    updateEnquiryStatusUseCase,
    deleteEnquiryUseCase,
    sendEnquiryReplyUseCase
  );
} 