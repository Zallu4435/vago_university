import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IoCloseOutline as X, IoAdd } from 'react-icons/io5';
import { FiUpload, FiVideo, FiBookOpen, FiClock, FiInfo, FiCheck } from 'react-icons/fi';

interface Video {
  id: string;
  title: string;
  duration: string;
  uploadedAt: string;
  module: number;
  status: string;
  courseId: string;
  description: string;
}

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo: Video | null;
  courses: { id: string; name: string; videoCount: number }[];
  onSave: (videoData: Partial<Video>) => void;
}

// Zod validation schema
const videoSchema = z.object({
  title: z.string().min(2, 'Video title must be at least 2 characters'),
  courseId: z.string().min(1, 'Course is required'),
  videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  module: z.number().min(1, 'Module must be at least 1'),
  order: z.number().min(1, 'Order must be at least 1').optional(),
  description: z.string().optional(),
  status: z.enum(['Draft', 'Published']).default('Draft'),
});

type VideoFormData = z.infer<typeof videoSchema>;

const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  onClose,
  selectedVideo,
  courses,
  onSave,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: selectedVideo?.title || '',
      courseId: selectedVideo?.courseId || '',
      videoUrl: '',
      module: selectedVideo?.module || 1,
      order: 1,
      description: selectedVideo?.description || '',
      status: selectedVideo?.status as 'Draft' | 'Published' || 'Draft',
    },
    mode: 'onChange',
  });

  const handleFormSubmit = (data: VideoFormData) => {
    const videoData: Partial<Video> = {
      title: data.title,
      courseId: data.courseId,
      module: data.module,
      status: data.status,
      description: data.description || '',
      ...(data.videoUrl && { videoUrl: data.videoUrl }),
      ...(data.order && { order: data.order }),
    };
    onSave(videoData);
    reset();
    onClose();
  };

  // Reset form when modal opens for editing or adding new
  useEffect(() => {
    if (isOpen && selectedVideo) {
      reset({
        title: selectedVideo.title,
        courseId: selectedVideo.courseId,
        videoUrl: '',
        module: selectedVideo.module,
        order: 1,
        description: selectedVideo.description,
        status: selectedVideo.status as 'Draft' | 'Published',
      });
    } else if (isOpen && !selectedVideo) {
      reset({
        title: '',
        courseId: '',
        videoUrl: '',
        module: 1,
        order: 1,
        description: '',
        status: 'Draft',
      });
    }
  }, [isOpen, selectedVideo, reset]);

  // Prevent backend scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  // Particle effect
  const ghostParticles = Array(30)
    .fill(0)
    .map((_, i) => ({
      size: Math.random() * 10 + 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animDuration: Math.random() * 10 + 15,
      animDelay: Math.random() * 5,
    }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Background particles */}
      {ghostParticles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-500/20 blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            animation: `floatParticle ${particle.animDuration}s infinite ease-in-out`,
            animationDelay: `${particle.animDelay}s`,
          }}
        />
      ))}

      {/* Main Container */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-5xl max-h-[90vh] rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden relative">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-600/30 flex items-center justify-center text-2xl shadow-lg border border-purple-500/30">
                <FiVideo />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">
                  {selectedVideo ? 'Edit Video' : 'Add New Video'}
                </h2>
                <p className="text-purple-300 text-sm">
                  {selectedVideo ? 'Update video details' : 'Fill in the video information'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <X size={24} className="text-purple-300" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 gap-8">
            {/* Basic Information Section */}
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Video Title *
                  </label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                          errors.title ? 'border-red-500' : 'border-purple-500/30'
                        }`}
                        placeholder="Enter video title"
                      />
                    )}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                  )}
                </div>
                {/* Course */}
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Course *
                  </label>
                  <Controller
                    name="courseId"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                          errors.courseId ? 'border-red-500' : 'border-purple-500/30'
                        }`}
                      >
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.courseId && (
                    <p className="mt-1 text-sm text-red-400">{errors.courseId.message}</p>
                  )}
                </div>
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Status *
                  </label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                          errors.status ? 'border-red-500' : 'border-purple-500/30'
                        }`}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    )}
                  />
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-400">{errors.status.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Video Upload Section */}
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Video Upload
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Upload Video
                  </label>
                  <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors bg-gray-900/30">
                    <FiUpload className="mx-auto h-12 w-12 text-purple-400" />
                    <div className="mt-4">
                      <button className="text-purple-400 hover:text-purple-300 font-medium">
                        Click to upload
                      </button>
                      <span className="text-purple-300"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-purple-300 mt-2">MP4, AVI, MOV up to 500MB</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Or paste video URL
                  </label>
                  <Controller
                    name="videoUrl"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="url"
                        className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                          errors.videoUrl ? 'border-red-500' : 'border-purple-500/30'
                        }`}
                        placeholder="https://example.com/video.mp4"
                      />
                    )}
                  />
                  {errors.videoUrl && (
                    <p className="mt-1 text-sm text-red-400">{errors.videoUrl.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Module */}
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Module/Section *
                  </label>
                  <div className="relative">
                    <FiBookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                    <Controller
                      name="module"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className={`w-full pl-10 pr-3 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.module ? 'border-red-500' : 'border-purple-500/30'
                          }`}
                          placeholder="1"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      )}
                    />
                  </div>
                  {errors.module && (
                    <p className="mt-1 text-sm text-red-400">{errors.module.message}</p>
                  )}
                </div>
                {/* Order Position */}
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Order Position
                  </label>
                  <div className="relative">
                    <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                    <Controller
                      name="order"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className={`w-full pl-10 pr-3 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.order ? 'border-red-500' : 'border-purple-500/30'
                          }`}
                          placeholder="1"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      )}
                    />
                  </div>
                  {errors.order && (
                    <p className="mt-1 text-sm text-red-400">{errors.order.message}</p>
                  )}
                </div>
                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <FiInfo className="absolute left-3 top-3 text-purple-400" />
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={3}
                          className={`w-full pl-10 pr-3 py-2 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.description ? 'border-red-500' : 'border-purple-500/30'
                          }`}
                          placeholder="Brief description of the video content"
                        />
                      )}
                    />
                  </div>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-purple-500/30 bg-gray-900/80 p-6">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-gray-500/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit(handleFormSubmit)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {selectedVideo ? 'Updating...' : 'Saving...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FiCheck className="h-4 w-4" />
                    <span>{selectedVideo ? 'Update Video' : 'Save Video'}</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scroll {
          overflow: hidden;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
          75% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(128, 90, 213, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default AddVideoModal;