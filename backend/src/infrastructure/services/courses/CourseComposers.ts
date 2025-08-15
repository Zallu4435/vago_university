import { ICoursesRepository } from "../../../application/courses/repositories/ICoursesRepository";
import { GetCoursesUseCase, GetCourseByIdUseCase, CreateCourseUseCase, UpdateCourseUseCase, DeleteCourseUseCase, IGetCourseByIdUseCase, IGetCoursesUseCase, ICreateCourseUseCase, IUpdateCourseUseCase, IDeleteCourseUseCase } from "../../../application/courses/useCases/CourseUseCases";
import { CourseController } from "../../../presentation/http/courses/CourseController";
import { CoursesRepository } from "../../repositories/courses/CourseRepository";
import { ICourseController } from "../../../presentation/http/IHttp";

export function getCoursesComposer(): ICourseController {
  const repository: ICoursesRepository = new CoursesRepository();
  const getCoursesUseCase: IGetCoursesUseCase = new GetCoursesUseCase(repository);
  const getCourseByIdUseCase: IGetCourseByIdUseCase = new GetCourseByIdUseCase(repository);
  const createCourseUseCase: ICreateCourseUseCase = new CreateCourseUseCase(repository);
  const updateCourseUseCase: IUpdateCourseUseCase = new UpdateCourseUseCase(repository);
  const deleteCourseUseCase: IDeleteCourseUseCase = new DeleteCourseUseCase(repository);
  
  return new CourseController(
    getCoursesUseCase,
    getCourseByIdUseCase,
    createCourseUseCase,
    updateCourseUseCase,
    deleteCourseUseCase
  );
} 