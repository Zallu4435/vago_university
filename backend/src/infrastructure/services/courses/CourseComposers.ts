import { ICoursesRepository } from "../../../application/courses/repositories/ICoursesRepository";
import { GetCoursesUseCase, GetCourseByIdUseCase, CreateCourseUseCase, UpdateCourseUseCase, DeleteCourseUseCase } from "../../../application/courses/useCases/CourseUseCases";
import { CourseController } from "../../../presentation/http/courses/CourseController";
import { CoursesRepository } from "../../repositories/courses/CourseRepository";
import { ICourseController } from "../../../presentation/http/IHttp";

export function getCoursesComposer(): ICourseController {
  const repository: ICoursesRepository = new CoursesRepository();
  const getCoursesUseCase = new GetCoursesUseCase(repository);
  const getCourseByIdUseCase = new GetCourseByIdUseCase(repository);
  const createCourseUseCase = new CreateCourseUseCase(repository);
  const updateCourseUseCase = new UpdateCourseUseCase(repository);
  const deleteCourseUseCase = new DeleteCourseUseCase(repository);
  
  return new CourseController(
    getCoursesUseCase,
    getCourseByIdUseCase,
    createCourseUseCase,
    updateCourseUseCase,
    deleteCourseUseCase
  );
} 