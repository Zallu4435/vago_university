import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../appStore/store';
import { logout } from '../../appStore/authSlice';
import Sidebar from '../pages/faculty/Sidebar';
import Header from '../pages/faculty/Header';

export default function FacultyLayout() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [collapsed, setCollapsed] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const department = 'Computer Science';
  const currentDate = 'Thursday, May 16, 2025';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSidebarCollapse = (isCollapsed: boolean) => {
    setCollapsed(isCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        facultyName={fullName}
        department={department}
        onCollapse={handleSidebarCollapse}
      />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? 'ml-20' : 'ml-72'} overflow-hidden`}>
        <div className="sticky top-0 z-50">
          <Header currentDate={currentDate} facultyName={fullName} onLogout={handleLogout} />
        </div>
        <main className="h-[calc(100vh-70px)] overflow-auto mt-20">
          <Outlet context={{ activeTab, setActiveTab }} />
        </main>
      </div>
    </div>
  );
}