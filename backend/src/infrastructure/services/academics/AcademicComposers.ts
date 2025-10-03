import { IAcademicRepository } from "../../../application/academics/repositories/IAcademicRepository";
import {
  IGetStudentInfoUseCase,
  IGetGradeInfoUseCase,
  IGetCoursesUseCase,
  IGetAcademicHistoryUseCase,
  IGetProgramInfoUseCase,
  IGetProgressInfoUseCase,
  IGetRequirementsInfoUseCase,
  IRegisterCourseUseCase,
  IDropCourseUseCase,
  IRequestTranscriptUseCase
} from "../../../application/academics/useCases/IAcademicUseCases";
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
  RequestTranscriptUseCase
} from "../../../application/academics/useCases/AcademicUseCases";
import { AcademicRepository } from "../../repositories/academics/AcademicRepository";
import { IAcademicController } from "../../../presentation/http/IHttp";
import { AcademicController } from "../../../presentation/http/academics/AcademicController";

export function getAcademicComposer(): IAcademicController {
  const repository: IAcademicRepository = new AcademicRepository();
  
  const getStudentInfoUseCase: IGetStudentInfoUseCase = new GetStudentInfoUseCase(repository);
  const getGradeInfoUseCase: IGetGradeInfoUseCase = new GetGradeInfoUseCase(repository);
  const getCoursesUseCase: IGetCoursesUseCase = new GetCoursesUseCase(repository);
  const getAcademicHistoryUseCase: IGetAcademicHistoryUseCase = new GetAcademicHistoryUseCase(repository);
  const getProgramInfoUseCase: IGetProgramInfoUseCase = new GetProgramInfoUseCase(repository);
  const getProgressInfoUseCase: IGetProgressInfoUseCase = new GetProgressInfoUseCase(repository);
  const getRequirementsInfoUseCase: IGetRequirementsInfoUseCase = new GetRequirementsInfoUseCase(repository);
  const registerCourseUseCase: IRegisterCourseUseCase = new RegisterCourseUseCase(repository);
  const dropCourseUseCase: IDropCourseUseCase = new DropCourseUseCase(repository);
  const requestTranscriptUseCase: IRequestTranscriptUseCase = new RequestTranscriptUseCase(repository);

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
  );
}