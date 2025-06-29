import { IUserDiplomaRepository } from "../../../application/diploma/repositories/IUserDiplomaRepository";
import {
  GetUserDiplomasRequestDTO,
  GetUserDiplomaByIdRequestDTO,
  GetUserDiplomaChapterRequestDTO,
  UpdateVideoProgressRequestDTO,
  MarkChapterCompleteRequestDTO,
  ToggleBookmarkRequestDTO
} from "../../../domain/diploma/dtos/UserDiplomaRequestDTOs";
import {
  GetUserDiplomasResponseDTO,
  GetUserDiplomaByIdResponseDTO,
  GetUserDiplomaChapterResponseDTO,
  UpdateVideoProgressResponseDTO,
  MarkChapterCompleteResponseDTO,
  ToggleBookmarkResponseDTO
} from "../../../domain/diploma/dtos/UserDiplomaResponseDTOs";
import { DiplomaCourse } from "../../../domain/diploma/entities/DiplomaCourse";
import { Diploma as DiplomaModel, IDiploma } from "../../../infrastructure/database/mongoose/models/diploma.model";
import { UserProgress } from "../../../infrastructure/database/mongoose/models/userProgress.model";
import mongoose from "mongoose";
import { Video } from "../../../infrastructure/database/mongoose/models/video.model";

export class UserDiplomaRepository implements IUserDiplomaRepository {
  async getUserDiplomas(params: GetUserDiplomasRequestDTO): Promise<GetUserDiplomasResponseDTO> {
    try {
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


      const courses: DiplomaCourse[] = await Promise.all(diplomas.map(async diploma => {
        let completedVideoCount = 0;
        if (diploma.videoIds && diploma.videoIds.length > 0 && userId) {
          completedVideoCount = await UserProgress.countDocuments({
            userId,
            courseId: diploma._id,
            chapterId: { $in: diploma.videoIds },
            isCompleted: true
          });
        }

        // Fetch videos to create chapters
        let chapters = [];
        if (diploma.videoIds && diploma.videoIds.length > 0) {
          const videos = await Video.find({ _id: { $in: diploma.videoIds } }).lean();
          chapters = videos.map(video => ({
            _id: video._id.toString(),
            title: video.title,
            description: video.description || '',
            videoUrl: video.videoUrl,
            duration: Number(video.duration) || 0,
            order: video.module || 0,
            isPublished: video.status === 'Published',
            createdAt: video.createdAt,
            updatedAt: video.updatedAt
          }));
        }

        return {
          _id: diploma._id.toString(),
          title: diploma.title,
          description: diploma.description,
          category: diploma.category,
          status: diploma.status ? 'published' : 'draft',
          instructor: '',
          department: '',
          chapters,
          createdAt: diploma.createdAt,
          updatedAt: diploma.updatedAt,
          videoCount: Array.isArray(diploma.videoIds) ? diploma.videoIds.length : 0,
          completedVideoCount
        };
      }));

      return {
        courses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error: any) {
      console.error('UserDiplomaRepository.getUserDiplomas - Error:', error);
      throw error;
    }
  }

  async getUserDiplomaById(params: GetUserDiplomaByIdRequestDTO): Promise<GetUserDiplomaByIdResponseDTO | null> {
    try {
      const diploma = await DiplomaModel.findOne({
        _id: params.id,
        status: true
      });


      if (!diploma) {
        return null;
      }

      let videos = [];
      if (diploma.videoIds && diploma.videoIds.length > 0) {
        videos = await Video.find({ _id: { $in: diploma.videoIds } }).lean();
      }

      return {
        _id: diploma._id.toString(),
        title: diploma.title,
        description: diploma.description,
        category: diploma.category,
        status: diploma.status ? 'published' : 'draft',
        instructor: '',
        department: '',
        chapters: videos.map(video => ({
          _id: video._id.toString(),
          title: video.title,
          description: video.description || '',
          videoUrl: video.videoUrl,
          duration: Number(video.duration) || 0,
          order: video.module || 0,
          isPublished: video.status === 'Published',
          createdAt: video.createdAt,
          updatedAt: video.updatedAt
        })),
        videos: videos,
        createdAt: diploma.createdAt,
        updatedAt: diploma.updatedAt
      };
    } catch (error: any) {
      console.error('UserDiplomaRepository.getUserDiplomaById - Error:', error);
      throw error;
    }
  }

  async getUserDiplomaChapter(params: GetUserDiplomaChapterRequestDTO): Promise<GetUserDiplomaChapterResponseDTO | null> {
    try {
      const diploma = await DiplomaModel.findOne({
        _id: params.courseId,
        status: true
      });


      if (!diploma) {
        return null;
      }

      const video = await Video.findOne({ _id: params.chapterId }).lean();
      if (!video) {
        return null;
      }

      return {
        _id: video._id.toString(),
        title: video.title,
        description: video.description || '',
        videoUrl: video.videoUrl,
        duration: Number(video.duration) || 0,
        order: video.module || 0,
        isPublished: video.status === 'Published',
        createdAt: video.createdAt,
        updatedAt: video.updatedAt
      };
    } catch (error: any) {
      console.error('UserDiplomaRepository.getUserDiplomaChapter - Error:', error);
      throw error;
    }
  }

  async updateVideoProgress(params: UpdateVideoProgressRequestDTO): Promise<UpdateVideoProgressResponseDTO> {
    try {
      const { courseId, chapterId, progress } = params;

      const userProgress = await UserProgress.findOneAndUpdate(
        { courseId, chapterId },
        { progress },
        { upsert: true, new: true }
      );

      return {
        message: 'Progress updated successfully',
        progress: userProgress.progress
      };
    } catch (error: any) {
      console.error('UserDiplomaRepository.updateVideoProgress - Error:', error);
      throw error;
    }
  }

  async markChapterComplete(params: MarkChapterCompleteRequestDTO): Promise<MarkChapterCompleteResponseDTO> {
    try {
      const { courseId, chapterId } = params;

      const userProgress = await UserProgress.findOneAndUpdate(
        { courseId, chapterId },
        { isCompleted: true },
        { upsert: true, new: true }
      );

      return {
        message: 'Chapter marked as complete',
        completed: true
      };
    } catch (error: any) {
      console.error('UserDiplomaRepository.markChapterComplete - Error:', error);
      throw error;
    }
  }

  async toggleBookmark(params: ToggleBookmarkRequestDTO): Promise<ToggleBookmarkResponseDTO> {
    try {
      const { courseId, chapterId } = params;

      const userProgress = await UserProgress.findOne({ courseId, chapterId });

      if (!userProgress) {
        const newProgress = await UserProgress.create({
          courseId,
          chapterId,
          isBookmarked: true
        });
        return {
          message: 'Chapter bookmarked',
          bookmarked: true
        };
      }

      userProgress.isBookmarked = !userProgress.isBookmarked;
      await userProgress.save();

      return {
        message: userProgress.isBookmarked ? 'Chapter bookmarked' : 'Chapter unbookmarked',
        bookmarked: userProgress.isBookmarked
      };
    } catch (error: any) {
      console.error('UserDiplomaRepository.toggleBookmark - Error:', error);
      throw error;
    }
  }

  async getCompletedChapters(userId: string, courseId: string): Promise<string[]> {
    try {
      const completedChapters = await UserProgress.find({
        userId,
        courseId,
        isCompleted: true
      }).select('chapterId');

      return completedChapters.map(chapter => chapter.chapterId.toString());
    } catch (error: any) {
      console.error('UserDiplomaRepository.getCompletedChapters - Error:', error);
      throw error;
    }
  }

  async getBookmarkedChapters(userId: string, courseId: string): Promise<string[]> {
    try {
      const bookmarkedChapters = await UserProgress.find({
        userId,
        courseId,
        isBookmarked: true
      }).select('chapterId');

      return bookmarkedChapters.map(chapter => chapter.chapterId.toString());
    } catch (error: any) {
      console.error('UserDiplomaRepository.getBookmarkedChapters - Error:', error);
      throw error;
    }
  }
} 