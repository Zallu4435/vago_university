import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IoCloseOutline as X, IoAdd, IoTrash } from 'react-icons/io5';

// Zod validation schema
const clubSchema = z.object({
  name: z.string().min(2, 'Club name must be at least 2 characters'),
  type: z.string().min(1, 'Club type is required'),
  members: z.string().regex(/^\d+$/, 'Members must be a number').optional().or(z.literal('')),
  icon: z.string().default('🎓'),
  color: z.string().default('#8B5CF6'),
  status: z.enum(['active', 'inactive']).default('active').optional(),
  role: z.string().min(1, 'Role is required'),
  nextMeeting: z.string().optional(),
  about: z.string().optional(),
  createdBy: z.string().min(2, 'Creator name is required'),
  upcomingEvents: z.array(
    z.object({
      date: z.string().min(10, 'Date is required'),
      description: z.string().min(5, 'Description must be at least 5 characters'),
    })
  ).optional(),
});

type ClubFormData = z.infer<typeof clubSchema>;

interface AddClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClubFormData) => void;
  initialData?: Partial<ClubFormData>;
  isEditing?: boolean;
  clubTypes: string[];
  roles: string[];
  icons: string[];
  colors: string[];
}

const AddClubModal: React.FC<AddClubModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  clubTypes,
  roles,
  icons,
  colors,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<ClubFormData>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      name: '',
      type: '',
      members: '',
      icon: '🎓',
      color: '#8B5CF6',
      status: 'active',
      role: '',
      nextMeeting: '',
      about: '',
      createdBy: '',
      upcomingEvents: [],
      ...initialData,
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'upcomingEvents',
  });

  const watchedIcon = watch('icon');
  const watchedColor = watch('color');

  const handleFormSubmit = (data: ClubFormData) => {
    const clubData = {
      name: data.name,
      type: data.type,
      members: data.members || '',
      icon: data.icon,
      color: data.color,
      status: data.status || 'active',
      role: data.role,
      nextMeeting: data.nextMeeting || '',
      about: data.about || '',
      createdBy: data.createdBy,
      upcomingEvents: data.upcomingEvents || [],
    };
    onSubmit(clubData);
    reset();
    onClose();
  };

  React.useEffect(() => {
    if (isOpen && initialData) {
      reset({ ...initialData, upcomingEvents: initialData.upcomingEvents || [] });
    } else if (isOpen && !isEditing) {
      reset({
        name: '',
        type: '',
        members: '',
        icon: '🎓',
        color: '#8B5CF6',
        status: 'active',
        role: '',
        nextMeeting: '',
        about: '',
        createdBy: '',
        upcomingEvents: [],
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
                  {isEditing ? 'Edit Club' : 'Create New Club'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {isEditing ? 'Update your club details' : 'Fill in the details to create your club'}
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
            {/* Left Column - Basic Info and Club Details */}
            <div className="xl:col-span-2 space-y-6">
              {/* Basic Information Section */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Club Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Club Name *
                    </label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.name ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="Enter club name"
                        />
                      )}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>
                  {/* Club Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Club Type *
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
                          <option value="">Select Type</option>
                          {clubTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-400">{errors.type.message}</p>
                    )}
                  </div>
                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Role *
                    </label>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.role ? 'border-red-500' : 'border-gray-600'
                          }`}
                        >
                          <option value="">Select Role</option>
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>
                    )}
                  </div>
                  {/* Created By */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Created By *
                    </label>
                    <Controller
                      name="createdBy"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.createdBy ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="Enter creator name"
                        />
                      )}
                    />
                    {errors.createdBy && (
                      <p className="mt-1 text-sm text-red-400">{errors.createdBy.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Club Details Section */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Club Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Members */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Members
                    </label>
                    <Controller
                      name="members"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.members ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="e.g., 12"
                        />
                      )}
                    />
                    {errors.members && (
                      <p className="mt-1 text-sm text-red-400">{errors.members.message}</p>
                    )}
                  </div>
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.status ? 'border-red-500' : 'border-gray-600'
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      )}
                    />
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-400">{errors.status.message}</p>
                    )}
                  </div>
                  {/* Next Meeting */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Next Meeting
                    </label>
                    <Controller
                      name="nextMeeting"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="datetime-local"
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.nextMeeting ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                      )}
                    />
                    {errors.nextMeeting && (
                      <p className="mt-1 text-sm text-red-400">{errors.nextMeeting.message}</p>
                    )}
                  </div>
                  {/* About */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      About
                    </label>
                    <Controller
                      name="about"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={4}
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            errors.about ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="Enter club description"
                        />
                      )}
                    />
                    {errors.about && (
                      <p className="mt-1 text-sm text-red-400">{errors.about.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Upcoming Events Section */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Upcoming Events
                </h3>
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    onClick={() => append({ date: '', description: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
                  >
                    <IoAdd size={16} />
                    Add Event
                  </button>
                </div>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Event Date *
                        </label>
                        <Controller
                          name={`upcomingEvents.${index}.date`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="datetime-local"
                              className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                                errors.upcomingEvents?.[index]?.date ? 'border-red-500' : 'border-gray-600'
                              }`}
                            />
                          )}
                        />
                        {errors.upcomingEvents?.[index]?.date && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.upcomingEvents[index]?.date?.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Event Description *
                          </label>
                          {fields.length > 0 && (
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
                          name={`upcomingEvents.${index}.description`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="Event description"
                              className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                                errors.upcomingEvents?.[index]?.description ? 'border-red-500' : 'border-gray-600'
                              }`}
                            />
                          )}
                        />
                        {errors.upcomingEvents?.[index]?.description && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.upcomingEvents[index]?.description?.message}
                          </p>
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
                    Club Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2 p-4 bg-gray-700/30 rounded-xl border border-gray-600 max-h-40 overflow-y-auto">
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setValue('icon', icon)}
                        className={`w-10 h-10 text-xl rounded-lg transition-all duration-200 hover:scale-110 ${
                          watchedIcon === icon ? 'bg-purple-600 shadow-lg' : 'bg-gray-600 hover:bg-gray-500'
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
                    Club Color
                  </label>
                  <div className="grid grid-cols-5 gap-2 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setValue('color', color)}
                        className={`w-12 h-12 rounded-lg transition-all duration-200 hover:scale-110 ${
                          watchedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''
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
                        <div className="text-white font-medium">{watch('name') || 'Club Name'}</div>
                        <div className="text-gray-400 text-sm">{watch('type') || 'Type'}</div>
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
                isEditing ? 'Update Club' : 'Create Club'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClubModal;