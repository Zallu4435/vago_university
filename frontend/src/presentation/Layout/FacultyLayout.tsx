import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../pages/faculty/Sidebar';
import Header from '../pages/faculty/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/authSlice';

export default function FacultyLayout() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const department = 'Computer Science';
  const currentDate = 'Thursday, May 16, 2025';

  return (
    <div className="flex min-h-screen bg-gray-50 box-border">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        facultyName={fullName}
        department={department}
      />
      <div className="ml-72 w-[calc(100%-18rem)] min-h-screen bg-gray-50 box-border">
        <Header currentDate={currentDate} facultyName={fullName} onLogout={handleLogout} />
        <main className="px-8 pt-6 pb-12 mt-20">
          <Outlet context={{ activeTab, setActiveTab }} />
        </main>
      </div>
    </div>
  );
}