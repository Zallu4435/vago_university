import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IoCloseOutline as X } from 'react-icons/io5';
import { FiUpload, FiVideo, FiBookOpen, FiClock, FiInfo, FiCheck } from 'react-icons/fi';
import { z as zod } from 'zod';

interface Video {
  _id: string;
  title: string;
  duration: string;
  uploadedAt: string;
  module: number;
  status: "Published" | "Draft";
  diplomaId: string;
  description: string;
  videoFile?: File;
  videoUrl: string;
}

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo: Video | null;
  onSave: (videoData: FormData | Partial<Video>) => void;
  categories: string[];
}

const videoSchema = z.object({
  title: z.string().min(2, 'Video title must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  module: z.string()
    .min(1, 'Module is required')
    .refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 1, 'Module must be a valid number at least 1'),
  order: z.string()
    .optional()
    .refine((val) => !val || (!isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 1), 'Order must be a valid number at least 1'),
  description: z.string().optional(),
  status: z.enum(['Draft', 'Published']),
});

type VideoFormInputs = z.infer<typeof videoSchema>;

const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  onClose,
  selectedVideo,
  onSave,
  categories,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<VideoFormInputs>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: '',
      category: '',
      module: '1',
      order: '1',
      description: '',
      status: 'Draft',
    },
    mode: 'onChange',
  });

  // Watch the current form values
  const currentCategory = watch('category');

  // Reset form when selectedVideo changes (for editing)
  useEffect(() => {
    console.log('AddVideoModal: selectedVideo changed', selectedVideo);
    console.log('AddVideoModal: selectedVideo.videoUrl =', selectedVideo?.videoUrl);
    
    if (selectedVideo) {
      const formData = {
        title: selectedVideo.title,
        category: selectedVideo.diplomaId,
        module: selectedVideo.module.toString(),
        order: '1',
        description: selectedVideo.description || '',
        status: selectedVideo.status as "Published" | "Draft",
      };
      
      console.log('AddVideoModal: Resetting form with data', formData);
      reset(formData);
    } else {
      // Reset to default values for new video
      const defaultData = {
        title: '',
        category: '',
        module: '1',
        order: '1',
        description: '',
        status: 'Draft' as const,
      };
      
      console.log('AddVideoModal: Resetting form with default data', defaultData);
      reset(defaultData);
    }
    // Clear selected file when modal opens/closes
    setSelectedFile(null);
  }, [selectedVideo, reset]);

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

  const handleFormSubmit = async (data: VideoFormInputs) => {
    // For new videos, require a file
    if (!selectedVideo && !selectedFile) {
      alert('Please select a video file');
      return;
    }

    if (!data.category) {
      alert('Please select a category');
      return;
    }

    // Convert string values to numbers for backend
    const moduleNumber = parseInt(data.module, 10);
    const orderNumber = parseInt(data.order || '1', 10);

    // Create FormData object
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('module', moduleNumber.toString());
    formData.append('status', data.status);
    formData.append('description', data.description || '');
    formData.append('duration', '0:00');
    
    // Only append video file if a new one is selected
    if (selectedFile) {
      formData.append('videoFile', selectedFile);
    }

    // For updates, if no new file is selected, we need to handle it differently
    if (selectedVideo && !selectedFile) {
      console.log('Update without new file - keeping existing video');
      console.log('selectedVideo object:', selectedVideo);
      console.log('selectedVideo.videoUrl:', selectedVideo.videoUrl);
      
      // Create a plain object for update without file
      const updateData = {
        id: selectedVideo._id,
        title: data.title,
        category: data.category,
        module: moduleNumber, // Convert to number
        status: data.status,
        description: data.description || '',
        duration: '0:00',
        videoUrl: selectedVideo.videoUrl, // Pass existing video URL
        // No videoFile property - backend will keep existing
      };
      
      console.log('📤 Sending update data without new file:', updateData);
      console.log('📤 videoUrl being sent:', updateData.videoUrl);
      
      try {
        console.log('🚀 Uploading video (no new file)...');
        await onSave(updateData);
        console.log('✅ Video upload (no new file) complete!');
        onClose();
      } catch (error) {
        console.error('Error updating video:', error);
        alert(error instanceof Error ? error.message : 'Failed to update video');
      }
      return;
    }

    // For updates with new file, include the video ID
    if (selectedVideo && selectedFile) {
      formData.append('id', selectedVideo._id);
    }

    try {
      console.log('🚀 Uploading video...');
      await onSave(formData);
      console.log('✅ Video upload complete!');
      onClose();
    } catch (error) {
      console.error('Error saving video:', error);
      alert(error instanceof Error ? error.message : 'Failed to save video');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-gray-900/95 border border-purple-500/30 rounded-xl shadow-2xl w-full max-w-4xl relative overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {selectedVideo ? 'Edit Video' : 'Add New Video'}
            </h2>
            {selectedVideo && (
              <p className="text-sm text-purple-300 mt-1">
                Editing: {selectedVideo.title} • Category: {selectedVideo.diplomaId}
              </p>
            )}
          </div>
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
                      Category *
                    </label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <select
                            {...field}
                            className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                              errors.category ? 'border-red-500' : 'border-purple-500/30'
                            }`}
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                          {selectedVideo && currentCategory && (
                            <p className="text-xs text-blue-400 mt-1">
                              Current category: {currentCategory}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
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
                  {/* Show current video info when editing */}
                  {selectedVideo && (
                    <div className="bg-gray-900/60 border border-purple-500/30 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                        <FiVideo className="h-4 w-4" />
                        Current Video Information
                      </h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p><span className="text-purple-400">Title:</span> {selectedVideo.title}</p>
                        <p><span className="text-purple-400">Duration:</span> {selectedVideo.duration}</p>
                        <p><span className="text-purple-400">Uploaded:</span> {new Date(selectedVideo.uploadedAt).toLocaleDateString()}</p>
                        <p><span className="text-purple-400">Category:</span> {selectedVideo.diplomaId}</p>
                        <p><span className="text-purple-400">Module:</span> {selectedVideo.module}</p>
                        <p><span className="text-purple-400">Status:</span> {selectedVideo.status}</p>
                      </div>
                      <p className="text-xs text-blue-400 mt-2">
                        Upload a new file below to replace the current video, or keep the existing one
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      {selectedVideo ? 'Upload New Video (Optional)' : 'Upload Video'}
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
                        <div className="flex flex-col items-center">
                          <FiUpload className="h-8 w-8 text-purple-400 mb-2" />
                          <p className="text-purple-300 text-sm">
                            {selectedFile ? selectedFile.name : (selectedVideo ? 'Click to upload new video file' : 'Click to upload video file')}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            MP4, AVI, or MOV (max 500MB)
                          </p>
                          {selectedVideo && !selectedFile && (
                            <p className="text-blue-400 text-xs mt-1">
                              Current video will be kept if no new file is selected
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Module Number *
                    </label>
                    <Controller
                      name="module"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="1"
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.module ? 'border-red-500' : 'border-purple-500/30'
                          }`}
                          placeholder="Enter module number"
                        />
                      )}
                    />
                    {errors.module && (
                      <p className="mt-1 text-sm text-red-400">{errors.module.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Order
                    </label>
                    <Controller
                      name="order"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="1"
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.order ? 'border-red-500' : 'border-purple-500/30'
                          }`}
                          placeholder="Enter order"
                        />
                      )}
                    />
                    {errors.order && (
                      <p className="mt-1 text-sm text-red-400">{errors.order.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Description
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={4}
                        className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                          errors.description ? 'border-red-500' : 'border-purple-500/30'
                        }`}
                        placeholder="Enter video description"
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="h-4 w-4" />
                    <span>{selectedVideo ? 'Update Video' : 'Add Video'}</span>
                  </>
                )}
              </button>
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