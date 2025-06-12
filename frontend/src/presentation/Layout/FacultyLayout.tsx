import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/authSlice';
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
    <div className="flex min-h-screen bg-gray-50 box-border">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        facultyName={fullName}
        department={department}
        onCollapse={handleSidebarCollapse}
      />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? 'ml-20' : 'ml-72'}`}>
        <div className="sticky top-0 z-50">
          <Header currentDate={currentDate} facultyName={fullName} onLogout={handleLogout} />
        </div>
        <main className="mt-[70px]">
          <Outlet context={{ activeTab, setActiveTab }} />
        </main>
      </div>
    </div>
  );
}