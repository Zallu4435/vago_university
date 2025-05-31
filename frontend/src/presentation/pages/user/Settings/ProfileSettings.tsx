import { useEffect, useState } from 'react';
import { useProfileManagement } from '../../../../application/hooks/useProfileManagement';
import { FaCamera, FaUser, FaShieldAlt, FaPhone, FaEnvelope, FaIdCard, FaUserAlt } from 'react-icons/fa';
import { FiX, FiEdit, FiSave } from 'react-icons/fi';
import { ProfilePictureModal } from './ProfilePictureModal';
import { PasswordChangeModal } from './PasswordChangeModal';
import { ProfileData, PasswordChangeData } from '../../../../domain/types/profile';

export default function ProfileSettings() {
  const {
    profile,
    isLoading,
    error,
    isEditing,
    setIsEditing,
    updateProfile,
    changePassword,
    updateProfilePicture,
  } = useProfileManagement();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    profilePicture: '',
  });

  // Initialize formData when profile data loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        email: profile.email,
        profilePicture: profile.profilePicture || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing && profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        email: profile.email,
        profilePicture: profile.profilePicture || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    await updateProfile(formData);
  };

  const handlePasswordChange = async (passwords: PasswordChangeData) => {
    await changePassword(passwords);
    setShowPasswordModal(false);
  };

  const handleProfilePictureUpdate = async (file: File) => {
    await updateProfilePicture(file);
    setShowProfileModal(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-slate-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Loading Profile</h2>
            <p className="text-slate-600">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiX className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Profile</h2>
            <p className="text-red-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback UI when no profile data is available
  if (!profile && !isLoading && !error) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-50 to-slate-50 p-6 border-b border-slate-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center shadow-sm">
                <FaUser className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Create Profile</h1>
                <p className="text-slate-600">Set up your personal information</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              {/* Profile Header */}
              <div className="flex items-center mb-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-xl bg-sky-100 border-2 border-sky-200 flex items-center justify-center shadow-sm">
                    <FaUserAlt className="w-8 h-8 text-sky-600" />
                  </div>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                  >
                    <FaCamera className="w-5 h-5 text-white" />
                  </button>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    <FiEdit className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-slate-800 mb-1">Welcome!</h2>
                  <p className="text-slate-600 text-sm">Complete your profile to get started</p>
                </div>
              </div>

              {/* Form Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-sky-500 rounded-lg flex items-center justify-center mr-3">
                    <FaUser className="w-3 h-3 text-white" />
                  </div>
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-700 text-sm font-medium flex items-center">
                      <FaIdCard className="w-4 h-4 mr-2 text-slate-500" />
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-700 text-sm font-medium flex items-center">
                      <FaIdCard className="w-4 h-4 mr-2 text-slate-500" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-700 text-sm font-medium flex items-center">
                      <FaPhone className="w-4 h-4 mr-2 text-slate-500" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-700 text-sm font-medium flex items-center">
                      <FaEnvelope className="w-4 h-4 mr-2 text-slate-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveChanges}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg flex items-center font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <FiSave className="w-4 h-4 mr-2" />
                    Create Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ProfilePictureModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            currentImage={formData.profilePicture}
            onImageUpdate={handleProfilePictureUpdate}
          />
        </div>
      </div>
    );
  }

  // Main profile view
  return (
    <div className="flex-1 p-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-50 to-slate-50 p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center shadow-sm">
                <FaUser className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Profile Settings</h1>
                <p className="text-slate-600">Manage your personal information and preferences</p>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-green-100 rounded-lg text-green-700 text-sm font-medium border border-green-200">
              Online
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-xl bg-sky-100 border-2 border-sky-200 shadow-sm overflow-hidden">
                    {profile?.profilePicture ? (
                      <img
                        src={profile.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUserAlt className="w-8 h-8 text-sky-600" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                  >
                    <FaCamera className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-slate-800 mb-1">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-sky-600 mb-1 font-medium text-sm">Student ID: UNI-2024-001</p>
                  <p className="text-slate-600 text-sm">{formData.email}</p>
                </div>
              </div>
              <button
                onClick={handleEditToggle}
                className={`${
                  isEditing
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-sky-500 hover:bg-sky-600 text-white'
                } px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium`}
              >
                {isEditing ? (
                  <FiX className="w-4 h-4 mr-2" />
                ) : (
                  <FiEdit className="w-4 h-4 mr-2" />
                )}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <div className="w-6 h-6 bg-sky-500 rounded-lg flex items-center justify-center mr-3">
                <FaUser className="w-3 h-3 text-white" />
              </div>
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium flex items-center">
                  <FaIdCard className="w-4 h-4 mr-2 text-slate-500" />
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                    !isEditing ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium flex items-center">
                  <FaIdCard className="w-4 h-4 mr-2 text-slate-500" />
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                    !isEditing ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium flex items-center">
                  <FaPhone className="w-4 h-4 mr-2 text-slate-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                    !isEditing ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium flex items-center">
                  <FaEnvelope className="w-4 h-4 mr-2 text-slate-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly={true}
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-all duration-200 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <FaShieldAlt className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-medium">Password Security</h4>
                    <p className="text-slate-500 text-sm">Last changed: 30 days ago</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                >
                  <FaShieldAlt className="w-4 h-4 mr-2" />
                  Change Password
                </button>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end pt-6 border-t border-slate-200">
                <button
                  onClick={handleSaveChanges}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiSave className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfilePictureModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentImage={profile?.profilePicture}
        onImageUpdate={handleProfilePictureUpdate}
      />

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onPasswordChange={handlePasswordChange}
      />
    </div>
  );
}