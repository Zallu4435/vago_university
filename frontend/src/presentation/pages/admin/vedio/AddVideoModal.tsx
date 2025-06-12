import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IoCloseOutline as X } from 'react-icons/io5';
import { FiUpload, FiVideo, FiBookOpen, FiClock, FiInfo, FiCheck } from 'react-icons/fi';

interface Video {
  _id: string;
  title: string;
  duration: string;
  uploadedAt: string;
  module: number;
  status: string;
  diplomaId: string;
  description: string;
}

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo: Video | null;
  diplomas: { _id: string; title: string; videoCount: number }[];
  onSave: (videoData: Partial<Video>) => void;
}

const videoSchema = z.object({
  title: z.string().min(2, 'Video title must be at least 2 characters'),
  diplomaId: z.string().min(1, 'Diploma is required'),
  module: z.number().min(1, 'Module must be at least 1'),
  order: z.number().min(1, 'Order must be at least 1').optional(),
  description: z.string().optional(),
  status: z.enum(['Draft', 'Published']),
});

type VideoFormData = z.infer<typeof videoSchema>;

const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  onClose,
  selectedVideo,
  diplomas,
  onSave,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: selectedVideo?.title || '',
      diplomaId: selectedVideo?.diplomaId || '',
      module: selectedVideo?.module || 1,
      order: 1,
      description: selectedVideo?.description || '',
      status: (selectedVideo?.status as 'Draft' | 'Published') || 'Draft',
    },
    mode: 'onChange',
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/avi', 'video/quicktime'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid video file (MP4, AVI, or MOV)');
        return;
      }

      // Validate file size (500MB limit)
      const maxSize = 500 * 1024 * 1024; // 500MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 500MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleFormSubmit = async (data: VideoFormData) => {
    if (!selectedFile) {
      alert('Please select a video file');
      return;
    }

    const videoData: Partial<Video> = {
      title: data.title,
      diplomaId: data.diplomaId,
      module: data.module,
      status: data.status,
      description: data.description || '',
      duration: '0:00', // This will be updated after video processing
    };

    onSave(videoData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-gray-900/95 border border-purple-500/30 rounded-xl shadow-2xl w-full max-w-4xl relative overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
          <h2 className="text-xl font-semibold text-white">
            {selectedVideo ? 'Edit Video' : 'Add New Video'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Diploma *
                    </label>
                    <Controller
                      name="diplomaId"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.diplomaId ? 'border-red-500' : 'border-purple-500/30'
                          }`}
                        >
                          <option value="">Select a diploma</option>
                          {diplomas.map((diploma) => (
                            <option key={diploma._id} value={diploma._id}>
                              {diploma.title}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.diplomaId && (
                      <p className="mt-1 text-sm text-red-400">{errors.diplomaId.message}</p>
                    )}
                  </div>

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

              <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Upload Video
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Upload Video
                    </label>
                    <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors bg-gray-900/30">
                      <input
                        type="file"
                        accept="video/mp4,video/avi,video/quicktime"
                        onChange={handleFileChange}
                        className="hidden"
                        id="video-upload"
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <FiUpload className="mx-auto h-12 w-12 text-purple-400" />
                        <div className="mt-4">
                          <button type="button" className="text-purple-400 hover:text-purple-300 font-medium">
                            Click to upload
                          </button>
                          <span className="text-purple-300"> or drag and drop</span>
                        </div>
                        <p className="text-xs text-purple-300 mt-2">MP4, AVI, MOV up to 500MB</p>
                      </label>
                    </div>
                    {selectedFile && (
                      <div className="mt-4">
                        <p className="text-sm text-purple-300">Selected file: {selectedFile.name}</p>
                        {uploadProgress > 0 && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-purple-300 mt-1">{uploadProgress}% uploaded</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Module/Section *
                    </label>
                    <Controller
                      name="module"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <FiBookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                          <input
                            {...field}
                            type="number"
                            className={`w-full pl-10 pr-3 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                              errors.module ? 'border-red-500' : 'border-purple-500/30'
                            }`}
                            placeholder="Enter module number"
                          />
                        </div>
                      )}
                    />
                    {errors.module && (
                      <p className="mt-1 text-sm text-red-400">{errors.module.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Order Position
                    </label>
                    <Controller
                      name="order"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                          <input
                            {...field}
                            type="number"
                            className={`w-full pl-10 pr-3 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                              errors.order ? 'border-red-500' : 'border-purple-500/30'
                            }`}
                            placeholder="Enter order position"
                          />
                        </div>
                      )}
                    />
                    {errors.order && (
                      <p className="mt-1 text-sm text-red-400">{errors.order.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Description
                    </label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <FiInfo className="absolute left-3 top-3 text-purple-400" />
                          <textarea
                            {...field}
                            rows={3}
                            className={`w-full pl-10 pr-3 py-2 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                              errors.description ? 'border-red-500' : 'border-purple-500/30'
                            }`}
                            placeholder="Enter video description"
                          />
                        </div>
                      )}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

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
          </form>
        </div>
      </div>

      <style>
        {`
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
        `}
      </style>
    </div>
  );
};

export default AddVideoModal;