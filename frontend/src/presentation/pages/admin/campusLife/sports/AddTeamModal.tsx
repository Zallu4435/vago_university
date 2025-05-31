import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IoCloseOutline as X, IoAdd, IoTrash, IoSparklesOutline as Sparkles } from 'react-icons/io5';

// Zod validation schema
const teamSchema = z.object({
  title: z.string().min(2, 'Team name must be at least 2 characters'),
  type: z.string().min(1, 'Sport type is required'),
  category: z.string().min(1, 'Team category is required'),
  organizer: z.string().min(2, 'Organizer name is required'),
  organizerType: z.enum(['department', 'club', 'student', 'administration', 'external'], {
    errorMap: () => ({ message: 'Organizer type is required' }),
  }),
  icon: z.string().default('⚽'),
  color: z.string().default('#8B5CF6'),
  division: z.string().min(1, 'Division is required'),
  headCoach: z.string().min(2, 'Head coach name is required'),
  homeGames: z.number().min(0, 'Home games must be 0 or greater'),
  record: z.string().regex(/^\d+-\d+-\d+$/, 'Record must be in format: W-L-T'),
  upcomingGames: z.array(
    z.object({
      date: z.string().min(10, 'Date is required'),
      description: z.string().min(5, 'Description must be at least 5 characters'),
    })
  ).min(1, 'At least one upcoming game is required'),
  participants: z.number().min(0, 'Participants must be 0 or greater').default(0),
  status: z.enum(['active', 'inactive']).default('active'),
});

type TeamFormData = z.infer<typeof teamSchema>;

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamFormData) => void;
  initialData?: Partial<TeamFormData>;
  isEditing?: boolean;
  sportTypes: string[];
  coaches: string[];
  divisions: string[];
  teamCategories: string[];
}

const AddTeamModal: React.FC<AddTeamModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  sportTypes,
  coaches,
  divisions,
  teamCategories,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      title: '',
      type: '',
      category: '',
      organizer: '',
      organizerType: 'department',
      icon: '⚽',
      color: '#8B5CF6',
      division: '',
      headCoach: '',
      homeGames: 0,
      record: '0-0-0',
      upcomingGames: [{ date: '', description: '' }],
      participants: 0,
      status: 'active',
      ...initialData,
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'upcomingGames',
  });

  const watchedIcon = watch('icon');
  const watchedColor = watch('color');

  const organizerTypeOptions = [
    { value: 'department', label: 'Department', emoji: '🏛️' },
    { value: 'club', label: 'Club', emoji: '🎉' },
    { value: 'student', label: 'Student', emoji: '🎓' },
    { value: 'administration', label: 'Administration', emoji: '📋' },
    { value: 'external', label: 'External', emoji: '🌍' },
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

  const handleFormSubmit = (data: TeamFormData) => {
    const teamData = {
      title: data.title,
      type: data.type,
      category: data.category,
      organizer: data.organizer,
      organizerType: data.organizerType,
      icon: data.icon,
      color: data.color,
      division: data.division,
      headCoach: data.headCoach,
      homeGames: data.homeGames,
      record: data.record,
      upcomingGames: data.upcomingGames,
      participants: data.participants || 0,
      status: data.status || 'active',
    };
    onSubmit(teamData);
    reset();
    onClose();
  };

  React.useEffect(() => {
    if (isOpen && initialData) {
      reset({ ...initialData });
    } else if (isOpen && !isEditing) {
      reset({
        title: '',
        type: '',
        category: '',
        organizer: '',
        organizerType: 'department',
        icon: '⚽',
        color: '#8B5CF6',
        division: '',
        headCoach: '',
        homeGames: 0,
        record: '0-0-0',
        upcomingGames: [{ date: '', description: '' }],
        participants: 0,
        status: 'active',
      });
    }
  }, [isOpen, initialData, isEditing, reset]);

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

      {/* Main Modal Container */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-5xl max-h-[90vh] rounded-2xl border border-purple-600/30 shadow-2xl overflow-hidden relative">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border border-purple-600/30"
                style={{ backgroundColor: `${watchedColor}20`, borderColor: watchedColor }}
              >
                {watchedIcon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">
                  {isEditing ? 'Edit Team' : 'Create New Team'}
                </h2>
                <p className="text-sm text-purple-300">
                  {isEditing ? 'Update your team details' : 'Fill in the details to create your team'}
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

        {/* Content Section */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Left Column - Basic Info, Team Details, Upcoming Games */}
            <div className="xl:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-900/60 flex items-center">
                  <Sparkles size={20} className="text-purple-300" />
                  <h3 className="ml-3 text-lg font-semibold text-purple-100">Basic Information</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Team Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Team Name *
                    </label>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.title ? 'border-red-500' : 'border-purple-600/30'
                          }`}
                          placeholder="Enter team name"
                        />
                      )}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                    )}
                  </div>
                  {/* Sport Type */}
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Sport Type *
                    </label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.type ? 'border-red-500' : 'border-purple-600/30'
                          }`}
                        >
                          <option value="">Select Sport</option>
                          {sportTypes.filter(sport => sport !== 'All Sports').map(sport => (
                            <option key={sport} value={sport}>{sport}</option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-400">{errors.type.message}</p>
                    )}
                  </div>
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Team Category *
                    </label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.category ? 'border-red-500' : 'border-purple-600/30'
                          }`}
                        >
                          <option value="">Select Category</option>
                          {teamCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
                    )}
                  </div>
                  {/* Organizer */}
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
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.organizer ? 'border-red-500' : 'border-purple-600/30'
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
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.organizerType ? 'border-red-500' : 'border-purple-600/30'
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
                </div>
              </div>

              {/* Team Details */}
              <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-900/60 flex items-center">
                  <Sparkles size={20} className="text-purple-300" />
                  <h3 className="ml-3 text-lg font-semibold text-purple-100">Team Details</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Division */}
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Division *
                    </label>
                    <Controller
                      name="division"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.division ? 'border-red-500' : 'border-purple-600/30'
                          }`}
                        >
                          <option value="">Select Division</option>
                          {divisions.map(division => (
                            <option key={division} value={division}>{division}</option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.division && (
                      <p className="mt-1 text-sm text-red-400">{errors.division.message}</p>
                    )}
                  </div>
                  {/* Head Coach */}
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Head Coach *
                    </label>
                    <Controller
                      name="headCoach"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.headCoach ? 'border-red-500' : 'border-purple-600/30'
                          }`}
                        >
                          <option value="">Select Coach</option>
                          {coaches.filter(coach => coach !== 'All Coaches').map(coach => (
                            <option key={coach} value={coach}>{coach}</option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.headCoach && (
                      <p className="mt-1 text-sm text-red-400">{errors.headCoach.message}</p>
                    )}
                  </div>
                  {/* Home Games */}
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Home Games *
                    </label>
                    <Controller
                      name="homeGames"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.homeGames ? 'border-red-500' : 'border-purple-600/30'
                          }`}
                        />
                      )}
                    />
                    {errors.homeGames && (
                      <p className="mt-1 text-sm text-red-400">{errors.homeGames.message}</p>
                    )}
                  </div>
                  {/* Record */}
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Record (W-L-T) *
                    </label>
                    <Controller
                      name="record"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="0-0-0"
                          className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.record ? 'border-red-500' : 'border-purple-600/30'
                          }`}
                        />
                      )}
                    />
                    {errors.record && (
                      <p className="mt-1 text-sm text-red-400">{errors.record.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Upcoming Games */}
              <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-900/60 flex items-center justify-between">
                  <div className="flex items-center">
                    <Sparkles size={20} className="text-purple-300" />
                    <h3 className="ml-3 text-lg font-semibold text-purple-100">Upcoming Games</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => append({ date: '', description: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600/30 text-blue-100 rounded-lg hover:bg-blue-600/50 transition-colors"
                  >
                    <IoAdd size={16} />
                    Add Game
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900/60 p-4 rounded-lg border border-purple-600/30">
                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-2">
                          Game Date *
                        </label>
                        <Controller
                          name={`upcomingGames.${index}.date`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="datetime-local"
                              className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                errors.upcomingGames?.[index]?.date ? 'border-red-500' : 'border-purple-600/30'
                              }`}
                            />
                          )}
                        />
                        {errors.upcomingGames?.[index]?.date && (
                          <p className="mt-1 text-sm text-red-400">{errors.upcomingGames[index]?.date?.message}</p>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-purple-300">
                            Game Description *
                          </label>
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                            >
                              <IoTrash size={16} />
                            </button>
                          )}
                        </div>
                        <Controller
                          name={`upcomingGames.${index}.description`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="vs Team Name - Location"
                              className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                errors.upcomingGames?.[index]?.description ? 'border-red-500' : 'border-purple-600/30'
                              }`}
                            />
                          )}
                        />
                        {errors.upcomingGames?.[index]?.description && (
                          <p className="mt-1 text-sm text-red-400">{errors.upcomingGames[index]?.description?.message}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Customization */}
            <div className="space-y-6">
              <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-900/60 flex items-center">
                  <Sparkles size={20} className="text-purple-300" />
                  <h3 className="ml-3 text-lg font-semibold text-purple-100">Customization</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Icon Selection */}
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Team Icon
                    </label>
                    <div className="grid grid-cols-6 gap-2 p-4 bg-gray-900/60 rounded-lg border border-purple-600/30 max-h-40 overflow-y-auto">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setValue('icon', icon)}
                          className={`w-10 h-10 text-xl rounded-lg transition-colors ${
                            watchedIcon === icon
                              ? 'bg-purple-600/30 border-purple-600/50'
                              : 'bg-gray-900/60 border-gray-700/50 hover:bg-gray-800/60'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Color Selection */}
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Team Color
                    </label>
                    <div className="grid grid-cols-5 gap-2 p-4 bg-gray-900/60 rounded-lg border border-purple-600/30">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setValue('color', color)}
                          className={`w-10 h-10 rounded-lg transition-all ${
                            watchedColor === color
                              ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900'
                              : 'hover:ring-1 hover:ring-purple-500/50'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Preview */}
                  <div className="p-4 bg-gray-900/60 rounded-lg border border-purple-600/30">
                    <div className="text-sm font-medium text-purple-300 mb-2">Preview</div>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${watchedColor}20`, border: `1px solid ${watchedColor}` }}
                      >
                        {watchedIcon}
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {watch('title') || 'Team Name'}
                        </div>
                        <div className="text-purple-300 text-sm">
                          {watch('category') || 'Category'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-purple-600/30 bg-gray-900/80 p-6">
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
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
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  isEditing ? 'Update Team' : 'Create Team'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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

export default AddTeamModal;