import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../appStore/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../appStore/authSlice';
import FacultySidebar from './FacultySidebar';
import ProfileSettings from '../../user/Settings/ProfileSettings';
import FacultyPreferenceSettings from './FacultyPreferenceSettings';
import FacultyNotificationSettings from './FacultyNotificationSettings';

export default function FacultySettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleBackToDashboard = () => {
    navigate('/faculty');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'preferences':
        return <FacultyPreferenceSettings />;
      case 'notifications':
        return <FacultyNotificationSettings />;
      case 'financial':
        return (
          <div className="flex-1 p-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-slate-50"></div>
              <div className="text-center relative z-10">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {/* Financial Icon */}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">Financial Info</h2>
                <p className="text-slate-600 text-lg mb-6">View salary and payment details</p>
                <div className="px-6 py-2 bg-yellow-100 rounded-full text-yellow-700 text-sm font-medium inline-block">Coming Soon</div>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="flex-1 p-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-slate-50"></div>
              <div className="text-center relative z-10">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {/* Security Icon */}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">Security</h2>
                <p className="text-slate-600 text-lg mb-6">Manage your account security</p>
                <div className="px-6 py-2 bg-red-100 rounded-full text-red-700 text-sm font-medium inline-block">Coming Soon</div>
              </div>
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="flex-1 p-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-slate-50"></div>
              <div className="text-center relative z-10">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {/* Support Icon */}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">Support</h2>
                <p className="text-slate-600 text-lg mb-6">Get help and contact support</p>
                <div className="px-6 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium inline-block">Coming Soon</div>
              </div>
            </div>
          </div>
        );
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-full mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Back Button and Title */}
            <div className="flex items-center space-x-6">
              <button
                onClick={handleBackToDashboard}
                className="group flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-lg text-slate-700 hover:text-slate-900 transition-all duration-200 shadow-sm hover:shadow border border-slate-200 hover:border-slate-300"
              >
                <span className="font-medium text-sm">Faculty Dashboard</span>
              </button>
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  {/* Faculty Icon */}
                </div>
                <h1 className="text-xl font-bold text-slate-800">Faculty Settings</h1>
              </div>
            </div>
            {/* Right Section - User Info */}
            <div className="flex items-center">
              <div className="px-3 py-1.5 bg-purple-50 rounded-lg text-sm text-purple-700 font-medium border border-purple-200">
                {user?.firstName || 'Faculty'}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content with top padding for fixed header */}
      <div className="pt-16 flex w-full min-h-screen">
        <FacultySidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          user={user}
        />
        {renderContent()}
      </div>
    </div>
  );
}
