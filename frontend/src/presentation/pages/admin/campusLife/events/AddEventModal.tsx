import React from 'react';
import { IoCloseOutline as X } from 'react-icons/io5';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod validation schema
const eventSchema = z.object({
  title: z.string().min(1, 'Event title is required').min(3, 'Title must be at least 3 characters'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required').min(3, 'Location must be at least 3 characters'),
  organizer: z.string().min(1, 'Organizer is required').min(2, 'Organizer name must be at least 2 characters'),
  organizerType: z.enum(['department', 'club', 'student', 'administration', 'external'], {
    errorMap: () => ({ message: 'Organizer type is required' }),
  }),
  eventType: z.enum(['workshop', 'seminar', 'fest', 'competition', 'exhibition', 'conference', 'hackathon', 'cultural', 'sports', 'academic'], {
    errorMap: () => ({ message: 'Event type is required' }),
  }),
  timeframe: z.string().min(1, 'Timeframe is required'),
  icon: z.string().default('📅'),
  color: z.string().default('#8B5CF6'),
  description: z.string().optional(),
  fullTime: z.boolean().default(false),
  additionalInfo: z.string().optional(),
  requirements: z.string().optional(),
  maxParticipants: z.number().min(0, 'Max participants must be a non-negative number').default(0),
  registrationRequired: z.boolean().default(false),
});

type EventFormData = z.infer<typeof eventSchema>;

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
  isEditing?: boolean;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      date: '',
      time: '',
      location: '',
      organizer: '',
      organizerType: 'department',
      eventType: 'workshop',
      timeframe: '',
      icon: '📅',
      color: '#8B5CF6',
      description: '',
      fullTime: false,
      additionalInfo: '',
      requirements: '',
      maxParticipants: 0,
      registrationRequired: false,
      ...initialData,
    },
  });

  const watchedIcon = watch('icon');
  const watchedColor = watch('color');

  React.useEffect(() => {
    if (isOpen && initialData) {
      reset({ ...initialData });
    } else if (isOpen && !isEditing) {
      reset({
        title: '',
        date: '',
        time: '',
        location: '',
        organizer: '',
        organizerType: 'department',
        eventType: 'workshop',
        timeframe: '',
        icon: '📅',
        color: '#8B5CF6',
        description: '',
        fullTime: false,
        additionalInfo: '',
        requirements: '',
        maxParticipants: 0,
        registrationRequired: false,
      });
    }
  }, [isOpen, initialData, isEditing, reset]);

  const timeframeOptions = [
    { value: 'morning', label: 'Morning (6AM-12PM)', emoji: '🌅' },
    { value: 'afternoon', label: 'Afternoon (12PM-6PM)', emoji: '☀️' },
    { value: 'evening', label: 'Evening (6PM-10PM)', emoji: '🌆' },
    { value: 'night', label: 'Night (10PM-6AM)', emoji: '🌙' },
    { value: 'allday', label: 'All Day', emoji: '🌍' },
  ];

  const organizerTypeOptions = [
    { value: 'department', label: 'Department', emoji: '🏛️' },
    { value: 'club', label: 'Club', emoji: '🎉' },
    { value: 'student', label: 'Student', emoji: '🎓' },
    { value: 'administration', label: 'Administration', emoji: '📋' },
    { value: 'external', label: 'External', emoji: '🌍' },
  ];

  const eventTypeOptions = [
    { value: 'workshop', label: 'Workshop', emoji: '🔧' },
    { value: 'seminar', label: 'Seminar', emoji: '📢' },
    { value: 'fest', label: 'Fest', emoji: '🎊' },
    { value: 'competition', label: 'Competition', emoji: '🏆' },
    { value: 'exhibition', label: 'Exhibition', emoji: '🖼️' },
    { value: 'conference', label: 'Conference', emoji: '💼' },
    { value: 'hackathon', label: 'Hackathon', emoji: '💻' },
    { value: 'cultural', label: 'Cultural', emoji: '🎭' },
    { value: 'sports', label: 'Sports', emoji: '⚽' },
    { value: 'academic', label: 'Academic', emoji: '📚' },
  ];

  const iconOptions = [
    '📅', '🎉', '🏆', '🎭', '🎵', '🏃', '🍽️', '🎨', '📚', '💼',
    '🔬', '🎯', '⚽', '🎪', '🎬', '🏛️', '🌟', '🎊', '🎓', '💡',
    '🚀', '🎮', '🏋️', '🎤', '📸', '🎸', '🏆', '🎺', '🎻', '🎲'
  ];

  const colorOptions = [
    '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444',
    '#EC4899', '#6366F1', '#84CC16', '#F97316', '#8B5A2B',
    '#DC2626', '#7C3AED', '#059669', '#DB2777', '#9333EA'
  ];

  const onFormSubmit = (data: EventFormData) => {
    // Transform the data to match backend expectations
    const eventData = {
      title: data.title,
      timeframe: data.timeframe,
      location: data.location,
      organizer: data.organizer,
      organizerType: data.organizerType,
      eventType: data.eventType,
      date: data.date,
      time: data.time,
      icon: data.icon,
      color: data.color,
      description: data.description,
      fullTime: data.fullTime,
      additionalInfo: data.additionalInfo,
      requirements: data.requirements,
      maxParticipants: data.maxParticipants,
      registrationRequired: data.registrationRequired,
      participants: data.participants || 0,
      status: data.status || 'upcoming',
    };

    onSubmit(eventData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-purple-500/20 max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg border border-gray-600"
                style={{ backgroundColor: `${watchedColor}20`, borderColor: watchedColor }}
              >
                {watchedIcon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isEditing ? 'Edit Event' : 'Create New Event'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {isEditing ? 'Update your event details' : 'Fill in the details to create your event'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column - Basic Info */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Title *
                    </label>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.title ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="Enter your event title"
                        />
                      )}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Date and Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date *
                    </label>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.date ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                      )}
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time *
                    </label>
                    <Controller
                      name="time"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="time"
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.time ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                      )}
                    />
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-400">{errors.time.message}</p>
                    )}
                  </div>

                  {/* Location and Organizer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location *
                    </label>
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.location ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="Event location"
                        />
                      )}
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-400">{errors.location.message}</p>
                    )}
                  </div>

            <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Organizer *
                    </label>
                    <Controller
                      name="organizer"
                      control={control}
                      render={({ field }) => (
              <input
                          {...field}
                type="text"
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.organizer ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="Organizer name"
                        />
                      )}
                    />
                    {errors.organizer && (
                      <p className="mt-1 text-sm text-red-400">{errors.organizer.message}</p>
                    )}
            </div>

                  {/* Organizer Type */}
            <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Organizer Type *
                    </label>
                    <Controller
                      name="organizerType"
                      control={control}
                      render={({ field }) => (
              <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.organizerType ? 'border-red-500' : 'border-gray-600'
                          }`}
                        >
                          {organizerTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.emoji} {option.label}
                  </option>
                ))}
              </select>
                      )}
                    />
                    {errors.organizerType && (
                      <p className="mt-1 text-sm text-red-400">{errors.organizerType.message}</p>
                    )}
            </div>

                  {/* Event Type */}
            <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Type *
                    </label>
                    <Controller
                      name="eventType"
                      control={control}
                      render={({ field }) => (
              <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.eventType ? 'border-red-500' : 'border-gray-600'
                          }`}
                        >
                          {eventTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.emoji} {option.label}
                  </option>
                ))}
              </select>
                      )}
                    />
                    {errors.eventType && (
                      <p className="mt-1 text-sm text-red-400">{errors.eventType.message}</p>
                    )}
            </div>

                  {/* Max Participants */}
            <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Participants *
                    </label>
                    <Controller
                      name="maxParticipants"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="0"
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.maxParticipants ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="Max participants"
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                      )}
                    />
                    {errors.maxParticipants && (
                      <p className="mt-1 text-sm text-red-400">{errors.maxParticipants.message}</p>
                    )}
                  </div>

                  {/* Timeframe */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Timeframe *
                    </label>
                    <Controller
                      name="timeframe"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {timeframeOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => field.onChange(option.value)}
                              className={`p-3 rounded-xl border transition-all duration-200 text-center ${
                                field.value === option.value
                                  ? 'bg-purple-600 border-purple-500 text-white'
                                  : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                              }`}
                            >
                              <div className="text-lg">{option.emoji}</div>
                              <div className="text-xs font-medium">{option.label.split(' ')[0]}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    />
                    {errors.timeframe && (
                      <p className="mt-1 text-sm text-red-400">{errors.timeframe.message}</p>
                    )}
                  </div>

                  {/* Registration Required Toggle */}
                  <div className="md:col-span-2">
                    <Controller
                      name="registrationRequired"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600 cursor-pointer hover:bg-gray-700/50 transition-all duration-200">
              <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                          />
                          <div>
                            <div className="text-white font-medium">Registration Required</div>
                            <div className="text-gray-400 text-sm">Participants must register to attend</div>
                          </div>
                        </label>
                      )}
              />
            </div>

                  {/* Full Time Toggle */}
                  <div className="md:col-span-2">
                    <Controller
                      name="fullTime"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600 cursor-pointer hover:bg-gray-700/50 transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                          />
            <div>
                            <div className="text-white font-medium">Full-time Event</div>
                            <div className="text-gray-400 text-sm">This event runs for the entire day</div>
                          </div>
                        </label>
                      )}
              />
            </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Event Details
                </h3>
                
                <div className="space-y-4">
            <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                          placeholder="Describe your event..."
                        />
                      )}
              />
            </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Additional Information
                      </label>
                      <Controller
                        name="additionalInfo"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Any additional details..."
                          />
                        )}
              />
            </div>

            <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Requirements
                      </label>
                      <Controller
                        name="requirements"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Event requirements..."
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Customization */}
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Customization
                </h3>

                {/* Icon Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Event Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2 p-4 bg-gray-700/30 rounded-xl border border-gray-600 max-h-40 overflow-y-auto">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setValue('icon', icon)}
                        className={`w-10 h-10 text-xl rounded-lg transition-all duration-200 hover:scale-110 ${
                          watchedIcon === icon
                            ? 'bg-purple-600 shadow-lg'
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
            <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Event Color
                  </label>
                  <div className="grid grid-cols-5 gap-2 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setValue('color', color)}
                        className={`w-12 h-12 rounded-lg transition-all duration-200 hover:scale-110 ${
                          watchedColor === color
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800'
                            : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
                  <div className="text-sm font-medium text-gray-300 mb-2">Preview</div>
                  <div 
                    className="p-4 rounded-lg border-l-4 bg-gray-600/30"
                    style={{ borderLeftColor: watchedColor }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${watchedColor}20`, color: watchedColor }}
                      >
                        {watchedIcon}
            </div>
            <div>
                        <div className="text-white font-medium">
                          {watch('title') || 'Event Title'}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {watch('location') || 'Location'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit(onFormSubmit)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEditing ? 'Update Event' : 'Create Event'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;