import { Course } from '../../domain/entities/Course';
import { ICourseRepository } from '../../domain/repositories/ICourseRepository';
import { CourseModel } from '../database/mongoose/models/course.model';

export class CourseRepository implements ICourseRepository {
  async findById(id: string): Promise<Course | null> {
    const course = await CourseModel.findById(id);
    if (!course) return null;

    return Course.create({
      title: course.title,
      code: course.code,
      description: course.description,
      credits: course.credits,
      capacity: course.capacity,
      facultyId: course.facultyId,
      semester: course.semester,
      academicYear: course.academicYear,
      status: course.status as 'ACTIVE' | 'INACTIVE',
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }, course._id.toString());
  }

  async findAll(): Promise<Course[]> {
    const courses = await CourseModel.find();
    return courses.map(course => Course.create({
      title: course.title,
      code: course.code,
      description: course.description,
      credits: course.credits,
      capacity: course.capacity,
      facultyId: course.facultyId,
      semester: course.semester,
      academicYear: course.academicYear,
      status: course.status as 'ACTIVE' | 'INACTIVE',
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }, course._id.toString()));
  }

  async save(course: Course): Promise<void> {
    await CourseModel.create({
      _id: course.id,
      title: course.title,
      code: course.code,
      description: course.description,
      credits: course.credits,
      capacity: course.capacity,
      facultyId: course.facultyId,
      semester: course.semester,
      academicYear: course.academicYear,
      status: course.status,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    });
  }

  async update(course: Course): Promise<void> {
    await CourseModel.findByIdAndUpdate(course.id, {
      title: course.title,
      code: course.code,
      description: course.description,
      credits: course.credits,
      capacity: course.capacity,
      facultyId: course.facultyId,
      semester: course.semester,
      academicYear: course.academicYear,
      status: course.status,
      updatedAt: course.updatedAt
    });
  }

  async delete(id: string): Promise<void> {
    await CourseModel.findByIdAndDelete(id);
  }

  async findByFacultyId(facultyId: string): Promise<Course[]> {
    const courses = await CourseModel.find({ facultyId });
    return courses.map(course => Course.create({
      title: course.title,
      code: course.code,
      description: course.description,
      credits: course.credits,
      capacity: course.capacity,
      facultyId: course.facultyId,
      semester: course.semester,
      academicYear: course.academicYear,
      status: course.status as 'ACTIVE' | 'INACTIVE',
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }, course._id.toString()));
  }

  async findBySemesterAndYear(semester: string, academicYear: string): Promise<Course[]> {
    const courses = await CourseModel.find({ semester, academicYear });
    return courses.map(course => Course.create({
      title: course.title,
      code: course.code,
      description: course.description,
      credits: course.credits,
      capacity: course.capacity,
      facultyId: course.facultyId,
      semester: course.semester,
      academicYear: course.academicYear,
      status: course.status as 'ACTIVE' | 'INACTIVE',
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }, course._id.toString()));
  }
} 