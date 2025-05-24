import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IoCloseOutline as X, IoAdd, IoTrash } from 'react-icons/io5';

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
                  {isEditing ? 'Edit Team' : 'Create New Team'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {isEditing ? 'Update your team details' : 'Fill in the details to create your team'}
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
                  {/* Team Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Name *
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
                          placeholder="Enter team name"
                        />
                      )}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Sport Type and Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sport Type *
                    </label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.type ? 'border-red-500' : 'border-gray-600'
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Category *
                    </label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.category ? 'border-red-500' : 'border-gray-600'
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

                  {/* Organizer and Organizer Type */}
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
                </div>
              </div>

              {/* Team Details Section */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Team Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Division *
                    </label>
                    <Controller
                      name="division"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.division ? 'border-red-500' : 'border-gray-600'
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Head Coach *
                    </label>
                    <Controller
                      name="headCoach"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.headCoach ? 'border-red-500' : 'border-gray-600'
                          }`}
                        >
                          <option value="">Select Coach</option>
* {coaches.filter(coach => coach !== 'All Coaches').map(coach => (
                            <option key={coach} value={coach}>{coach}</option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.headCoach && (
                      <p className="mt-1 text-sm text-red-400">{errors.headCoach.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.homeGames ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                      )}
                    />
                    {errors.homeGames && (
                      <p className="mt-1 text-sm text-red-400">{errors.homeGames.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.record ? 'border-red-500' : 'border-gray-600'
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

              {/* Upcoming Games Section */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Upcoming Games
                </h3>

                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    onClick={() => append({ date: '', description: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
                  >
                    <IoAdd size={16} />
                    Add Game
                  </button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Game Date *
                        </label>
                        <Controller
                          name={`upcomingGames.${index}.date`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="datetime-local"
                              className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                                errors.upcomingGames?.[index]?.date ? 'border-red-500' : 'border-gray-600'
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
                          <label className="block text-sm font-medium text-gray-300">
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
                              className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                                errors.upcomingGames?.[index]?.description ? 'border-red-500' : 'border-gray-600'
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
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Customization
                </h3>

                {/* Icon Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Team Icon
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
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Team Color
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
                          {watch('title') || 'Team Name'}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {watch('category') || 'Category'}
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
              onClick={handleSubmit(handleFormSubmit)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
  );
};

export default AddTeamModal;