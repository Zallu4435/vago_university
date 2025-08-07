import { IUserDiplomaRepository } from "../../../application/diploma/repositories/IUserDiplomaRepository";
import { Diploma as DiplomaModel } from "../../../infrastructure/database/mongoose/models/diploma.model";
import { UserProgress } from "../../../infrastructure/database/mongoose/models/userProgress.model";
import { Video } from "../../../infrastructure/database/mongoose/models/video.model";
import { VideoStatus } from "../../../domain/video/enums/VideoStatus";

export class UserDiplomaRepository implements IUserDiplomaRepository {
  async getUserDiplomas(page: number, limit: number, category: string, status: string, dateRange: string) {
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

    const [diplomaDocs, total] = await Promise.all([
      DiplomaModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      DiplomaModel.countDocuments(query)
    ]);

    // Fetch videos for each diploma
    const courses = await Promise.all(diplomaDocs.map(async (doc) => {
      const videos = await Video.find({ 
        diplomaId: doc._id, 
        status: VideoStatus.Published 
      }).sort({ module: 1 }).lean();
      
      const chapters = videos.map(video => ({
        _id: video._id.toString(),
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl || '',
        duration: parseInt(video.duration) || 0,
        order: video.module || 0,
        isPublished: video.status === VideoStatus.Published,
        createdAt: video.uploadedAt || new Date(),
        updatedAt: video.uploadedAt || new Date()
      }));

      return {
        _id: doc._id.toString(),
        title: doc.title,
        description: doc.description,
        category: doc.category,
        status: doc.status ? 'published' : 'draft' as 'published' | 'draft' | 'archived',
        instructor: 'Faculty Instructor', // Default value
        department: doc.category || 'General',
        chapters,
        createdAt: doc.createdAt || new Date(),
        updatedAt: doc.updatedAt || new Date()
      };
    }));

    return { 
      courses, 
      total, 
      page, 
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getUserDiplomaById(id: string) {
    const diploma = await DiplomaModel.findOne({
      _id: id,
      status: true
    }).lean();
    
    if (!diploma) return null;
    
    // Fetch videos for this diploma
    const videos = await Video.find({ 
      diplomaId: diploma._id, 
      status: VideoStatus.Published 
    }).sort({ module: 1 }).lean();
    
    const chapters = videos.map(video => ({
      _id: video._id.toString(),
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl || '',
      duration: parseInt(video.duration) || 0,
      order: video.module || 0,
      isPublished: video.status === VideoStatus.Published,
      createdAt: video.uploadedAt || new Date(),
      updatedAt: video.uploadedAt || new Date()
    }));
    
    // Transform to match DiplomaCourse interface
    return {
      _id: diploma._id.toString(),
      title: diploma.title,
      description: diploma.description,
      category: diploma.category,
      status: diploma.status ? 'published' : 'draft' as 'published' | 'draft' | 'archived',
      instructor: 'Faculty Instructor', // Default value
      department: diploma.category || 'General',
      chapters,
      createdAt: diploma.createdAt || new Date(),
      updatedAt: diploma.updatedAt || new Date()
    };
  }

  async getUserDiplomaChapter(courseId: string, chapterId: string) {
    const diploma = await DiplomaModel.findOne({
      _id: courseId,
      status: true
    });
    if (!diploma) return null;
    
    const chapter = await Video.findOne({ _id: chapterId }).lean();
    if (!chapter) return null;
    
    // Transform to match Chapter interface
    return {
      _id: chapter._id.toString(),
      title: chapter.title,
      description: chapter.description,
      videoUrl: chapter.videoUrl || '',
      duration: parseInt(chapter.duration) || 0,
      order: chapter.module || 0,
      isPublished: chapter.status === VideoStatus.Published,
      createdAt: chapter.uploadedAt || new Date(),
      updatedAt: chapter.uploadedAt || new Date()
    };
  }

  async updateVideoProgress(userId: string, courseId: string, chapterId: string, progress: number) {
    const userProgress = await UserProgress.findOneAndUpdate(
      { userId, courseId, chapterId },
      { progress },
      { upsert: true, new: true }
    );
    
    return {
      message: 'Progress updated successfully',
      progress: userProgress.progress
    };
  }

  async markChapterComplete(userId: string, courseId: string, chapterId: string) {
    const userProgress = await UserProgress.findOneAndUpdate(
      { userId, courseId, chapterId },
      { isCompleted: true },
      { upsert: true, new: true }
    );
    
    return {
      message: 'Chapter marked as complete',
      completed: true
    };
  }

  async toggleBookmark(userId: string, courseId: string, chapterId: string) {
    const userProgress = await UserProgress.findOne({ userId, courseId, chapterId });
    let isBookmarked = false;
    
    if (!userProgress) {
      await UserProgress.create({
        userId,
        courseId,
        chapterId,
        isBookmarked: true
      });
      isBookmarked = true;
    } else {
      userProgress.isBookmarked = !userProgress.isBookmarked;
      await userProgress.save();
      isBookmarked = userProgress.isBookmarked;
    }
    
    return {
      message: isBookmarked ? 'Chapter bookmarked' : 'Chapter unbookmarked',
      bookmarked: isBookmarked
    };
  }

  async getCompletedChapters(userId: string, courseId: string) {
    const completedChapters = await UserProgress.find({
      userId,
      courseId,
      isCompleted: true
    }).select('chapterId');
    
    return completedChapters.map(chapter => chapter.chapterId.toString());
  }

  async getBookmarkedChapters(userId: string, courseId: string) {
    const bookmarkedChapters = await UserProgress.find({
      userId,
      courseId,
      isBookmarked: true
    }).select('chapterId');
    
    return bookmarkedChapters.map(chapter => chapter.chapterId.toString());
  }
} 