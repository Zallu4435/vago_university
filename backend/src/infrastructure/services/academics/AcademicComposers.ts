import { IAcademicRepository } from "../../../application/academics/repositories/IAcademicRepository";
import {
  GetStudentInfoUseCase,
  GetGradeInfoUseCase,
  GetCoursesUseCase,
  GetAcademicHistoryUseCase,
  GetProgramInfoUseCase,
  GetProgressInfoUseCase,
  GetRequirementsInfoUseCase,
  RegisterCourseUseCase,
  DropCourseUseCase,
  RequestTranscriptUseCase,
  ScheduleMeetingUseCase,
} from "../../../application/academics/useCases/AcademicUseCases";
import { AcademicRepository } from "../../repositories/academics/AcademicRepository";
import { IAcademicController } from "../../../presentation/http/IHttp";
import { AcademicController } from "../../../presentation/http/academics/AcademicController";

export function getAcademicComposer(): IAcademicController {
  const repository: IAcademicRepository = new AcademicRepository();
  
  const getStudentInfoUseCase: GetStudentInfoUseCase = new GetStudentInfoUseCase(repository);
  const getGradeInfoUseCase: GetGradeInfoUseCase = new GetGradeInfoUseCase(repository);
  const getCoursesUseCase: GetCoursesUseCase = new GetCoursesUseCase(repository);
  const getAcademicHistoryUseCase: GetAcademicHistoryUseCase = new GetAcademicHistoryUseCase(repository);
  const getProgramInfoUseCase: GetProgramInfoUseCase = new GetProgramInfoUseCase(repository);
  const getProgressInfoUseCase: GetProgressInfoUseCase = new GetProgressInfoUseCase(repository);
  const getRequirementsInfoUseCase: GetRequirementsInfoUseCase = new GetRequirementsInfoUseCase(repository);
  const registerCourseUseCase: RegisterCourseUseCase = new RegisterCourseUseCase(repository);
  const dropCourseUseCase: DropCourseUseCase = new DropCourseUseCase(repository);
  const requestTranscriptUseCase: RequestTranscriptUseCase = new RequestTranscriptUseCase(repository);
  const scheduleMeetingUseCase: ScheduleMeetingUseCase = new ScheduleMeetingUseCase(repository);

  return new AcademicController(
    getStudentInfoUseCase,
    getGradeInfoUseCase,
    getCoursesUseCase,
    getAcademicHistoryUseCase,
    getProgramInfoUseCase,
    getProgressInfoUseCase,
    getRequirementsInfoUseCase,
    registerCourseUseCase,
    dropCourseUseCase,
    requestTranscriptUseCase,
    scheduleMeetingUseCase
  );
}