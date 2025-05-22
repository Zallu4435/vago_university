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

  // Fallback UI when no profile data is available
  if (!profile && !isLoading && !error) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl h-full overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-8 border-b border-white/10">
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-cyan-300">Set up your personal information</p>
          </div>
          <div className="p-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-xl">
              <div className="flex items-center mb-8">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-1 shadow-xl flex items-center justify-center">
                    <FaUserAlt className="w-12 h-12 text-white" />
                  </div>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  >
                    <FaCamera className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-white mb-1">Create Your Profile</h2>
                  <p className="text-gray-300 text-sm">No profile data found</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <FaUser className="w-5 h-5 mr-3 text-cyan-400" />
                Create Your Profile
              </h3>
              <p className="text-gray-300 mb-6">Please enter your details below.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2 relative">
                  <label className="text-cyan-300 text-sm font-medium flex items-center">
                    <FaIdCard className="w-4 h-4 mr-2" />
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-cyan-300 text-sm font-medium flex items-center">
                    <FaIdCard className="w-4 h-4 mr-2" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter last name"
                  />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-cyan-300 text-sm font-medium flex items-center">
                    <FaPhone className="w-4 h-4 mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-cyan-300 text-sm font-medium flex items-center">
                    <FaEnvelope className="w-4 h-4 mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSaveChanges}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-8 py-4 rounded-xl flex items-center font-medium transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform"
                >
                  <FiSave className="w-5 h-5 mr-3" />
                  Save Profile
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
    );
  }

  if (isLoading) return <div className="flex-1 p-6 text-white text-center">Loading...</div>;
  if (error) return <div className="flex-1 p-6 text-red-400 text-center">Error: {error.message}</div>;

  return (
    <div className="flex-1 p-6">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl h-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-8 border-b border-white/10">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-cyan-300">Manage your personal information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="p-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-1 shadow-xl flex items-center justify-center">
                    {profile?.profilePicture ? (
                      <img
                        src={profile.profilePicture}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUserAlt className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  >
                    <FaCamera className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-cyan-300 mb-1">Student ID: UNI-2024-001</p>
                  <p className="text-gray-300 text-sm">{formData.email}</p>
                </div>
              </div>
              <button
                onClick={handleEditToggle}
                className={`${
                  isEditing
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
                } text-white px-6 py-3 rounded-xl flex items-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
              >
                {isEditing ? <FiX className="w-4 h-4 mr-2" /> : <FiEdit className="w-4 h-4 mr-2" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <FaUser className="w-5 h-5 mr-3 text-cyan-400" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2 relative">
                <label className="text-cyan-300 text-sm font-medium flex items-center">
                  <FaIdCard className="w-4 h-4 mr-2" />
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    !isEditing ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-cyan-300 text-sm font-medium flex items-center">
                  <FaIdCard className="w-4 h-4 mr-2" />
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    !isEditing ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-cyan-300 text-sm font-medium flex items-center">
                  <FaPhone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    !isEditing ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-cyan-300 text-sm font-medium flex items-center">
                  <FaEnvelope className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly={true}
                  className="w-full cursor-not-allowed px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-cyan-300 text-sm font-medium flex items-center">
                  <FaShieldAlt className="w-4 h-4 mr-2" />
                  Password Security
                </h4>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-6 py-2 rounded-xl flex items-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <FaShieldAlt className="w-4 h-4 mr-2" />
                  Change Password
                </button>
              </div>
              <p className="text-gray-400 text-sm">Last changed: 30 days ago</p>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSaveChanges}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-8 py-4 rounded-xl flex items-center font-medium transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform"
                >
                  <FiSave className="w-5 h-5 mr-3" />
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