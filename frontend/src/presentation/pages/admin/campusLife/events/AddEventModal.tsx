import React, { useEffect } from 'react';
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
  timeframe: z.string().optional(),
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
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border border-purple-500/30"
                style={{ backgroundColor: `${watchedColor}20`, borderColor: watchedColor }}
              >
                {watchedIcon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">
                  {isEditing ? 'Edit Event' : 'Create New Event'}
                </h2>
                <p className="text-purple-300 text-sm">
                  {isEditing ? 'Update your event details' : 'Fill in the details to create your event'}
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Event Title *
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
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Date *
                    </label>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.date ? 'border-red-500' : 'border-purple-500/30'
                          }`}
                        />
                      )}
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Time *
                    </label>
                    <Controller
                      name="time"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="time"
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.time ? 'border-red-500' : 'border-purple-500/30'
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
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Location *
                    </label>
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.location ? 'border-red-500' : 'border-purple-500/30'
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
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Organizer *
                    </label>
                    <Controller
                      name="organizer"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.organizer ? 'border-red-500' : 'border-purple-500/30'
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
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Organizer Type *
                    </label>
                    <Controller
                      name="organizerType"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.organizerType ? 'border-red-500' : 'border-purple-500/30'
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
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Event Type *
                    </label>
                    <Controller
                      name="eventType"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.eventType ? 'border-red-500' : 'border-purple-500/30'
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
                    <label className="block text-sm font-medium text-purple-300 mb-2">
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
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.maxParticipants ? 'border-red-500' : 'border-purple-500/30'
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
                    <label className="block text-sm font-medium text-purple-300 mb-2">
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
                              className={`p-3 rounded-lg border transition-all duration-200 text-center ${
                                field.value === option.value
                                  ? 'bg-purple-600/30 border-purple-500/50 text-purple-100'
                                  : 'bg-gray-900/60 border-purple-500/30 text-purple-300 hover:bg-purple-900/20'
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
                        <label className="flex items-center gap-3 p-4 bg-gray-900/60 rounded-lg border border-purple-500/30 cursor-pointer hover:bg-purple-900/20 transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-5 h-5 text-purple-600 bg-gray-900 border-purple-500/50 rounded focus:ring-purple-500 focus:ring-2"
                          />
                          <div>
                            <div className="text-purple-100 font-medium">Registration Required</div>
                            <div className="text-purple-300 text-sm">Participants must register to attend</div>
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
                        <label className="flex items-center gap-3 p-4 bg-gray-900/60 rounded-lg border border-purple-500/30 cursor-pointer hover:bg-purple-900/20 transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-5 h-5 text-purple-600 bg-gray-900 border-purple-500/50 rounded focus:ring-purple-500 focus:ring-2"
                          />
                          <div>
                            <div className="text-purple-100 font-medium">Full-time Event</div>
                            <div className="text-purple-300 text-sm">This event runs for the entire day</div>
                          </div>
                        </label>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Event Details
                </h3>
                
                <div className="space-y-4">
                  <div>
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
                          className="w-full px-4 py-3 bg-gray-900/60 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                          placeholder="Describe your event..."
                        />
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Additional Information
                      </label>
                      <Controller
                        name="additionalInfo"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-900/60 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Any additional details..."
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Requirements
                      </label>
                      <Controller
                        name="requirements"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-900/60 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
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
              <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Customization
                </h3>

                {/* Icon Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-purple-300 mb-3">
                    Event Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2 p-4 bg-gray-900/60 rounded-lg border border-purple-500/30 max-h-40 overflow-y-auto custom-scrollbar">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setValue('icon', icon)}
                        className={`w-10 h-10 text-xl rounded-lg transition-all duration-200 hover:scale-110 ${
                          watchedIcon === icon
                            ? 'bg-purple-600/30 border-purple-500/50 shadow-lg'
                            : 'bg-gray-900/60 border-purple-500/30 hover:bg-purple-900/20'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-3">
                    Event Color
                  </label>
                  <div className="grid grid-cols-5 gap-2 p-4 bg-gray-900/60 rounded-lg border border-purple-500/30">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setValue('color', color)}
                        className={`w-12 h-12 rounded-lg transition-all duration-200 hover:scale-110 ${
                          watchedColor === color
                            ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900'
                            : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-6 p-4 bg-gray-900/60 rounded-lg border border-purple-500/30">
                  <div className="text-sm font-medium text-purple-300 mb-2">Preview</div>
                  <div 
                    className="p-4 rounded-lg border-l-4 bg-gray-900/60"
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
                        <div className="text-purple-100 font-medium">
                          {watch('title') || 'Event Title'}
                        </div>
                        <div className="text-purple-300 text-sm">
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
                onClick={handleSubmit(onFormSubmit)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/50 flex items-center justify-center"
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

export default AddEventModal;