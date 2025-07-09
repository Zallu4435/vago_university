import { IUserDiplomaRepository } from "../../../application/diploma/repositories/IUserDiplomaRepository";
import {
  GetUserDiplomasRequestDTO,
  GetUserDiplomaByIdRequestDTO,
  GetUserDiplomaChapterRequestDTO,
  UpdateVideoProgressRequestDTO,
  MarkChapterCompleteRequestDTO,
  ToggleBookmarkRequestDTO
} from "../../../domain/diploma/dtos/UserDiplomaRequestDTOs";
import { Diploma as DiplomaModel } from "../../../infrastructure/database/mongoose/models/diploma.model";
import { UserProgress } from "../../../infrastructure/database/mongoose/models/userProgress.model";
import { Video } from "../../../infrastructure/database/mongoose/models/video.model";

export class UserDiplomaRepository implements IUserDiplomaRepository {
  async getUserDiplomas(params: GetUserDiplomasRequestDTO) {
    const { userId, page, limit, category, status, dateRange } = params;
    const skip = (page - 1) * limit;

    const query: any = { status: true };
    if (category !== 'all') query.category = category;
    if (status !== 'all') query.status = status === 'published';
    if (dateRange !== 'all') {
      const date = new Date();
      switch (dateRange) {
        case 'week':
          date.setDate(date.getDate() - 7);
          break;
        case 'month':
          date.setMonth(date.getMonth() - 1);
          break;
        case 'year':
          date.setFullYear(date.getFullYear() - 1);
          break;
      }
      query.createdAt = { $gte: date };
    }

    const [diplomas, total] = await Promise.all([
      DiplomaModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      DiplomaModel.countDocuments(query)
    ]);

    return { diplomas, total, page, limit };
  }

  async getUserDiplomaById(params: GetUserDiplomaByIdRequestDTO) {
    return DiplomaModel.findOne({
      _id: params.id,
      status: true
    });
  }

  async getUserDiplomaChapter(params: GetUserDiplomaChapterRequestDTO) {
    const diploma = await DiplomaModel.findOne({
      _id: params.courseId,
      status: true
    });
    if (!diploma) return null;
    return Video.findOne({ _id: params.chapterId }).lean();
  }

  async updateVideoProgress(params: UpdateVideoProgressRequestDTO) {
    const { userId, courseId, chapterId, progress } = params;
    return UserProgress.findOneAndUpdate(
      { userId, courseId, chapterId },
      { progress },
      { upsert: true, new: true }
    );
  }

  async markChapterComplete(params: MarkChapterCompleteRequestDTO) {
    const { userId, courseId, chapterId } = params;
    return UserProgress.findOneAndUpdate(
      { userId, courseId, chapterId },
      { isCompleted: true },
      { upsert: true, new: true }
    );
  }

  async toggleBookmark(params: ToggleBookmarkRequestDTO) {
    const { userId, courseId, chapterId } = params;
    const userProgress = await UserProgress.findOne({ userId, courseId, chapterId });
    if (!userProgress) {
      return UserProgress.create({
        userId,
        courseId,
        chapterId,
        isBookmarked: true
      });
    }
    userProgress.isBookmarked = !userProgress.isBookmarked;
    await userProgress.save();
    return userProgress;
  }

  async getCompletedChapters(userId: string, courseId: string) {
    const completedChapters = await UserProgress.find({
      userId,
      courseId,
      isCompleted: true
    }).select('chapterId');
    return completedChapters;
  }

  async getBookmarkedChapters(userId: string, courseId: string) {
    const bookmarkedChapters = await UserProgress.find({
      userId,
      courseId,
      isBookmarked: true
    }).select('chapterId');
    return bookmarkedChapters;
  }
} 