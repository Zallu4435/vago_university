import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../appStore/authSlice';
import { RootState } from '../../appStore/store';
import Sidebar from '../components/admin/Sidebar';
import AdminHeader from '../components/admin/Header';
import { useState } from 'react';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      {/* Main layout content wrapper */}
      <div className="flex flex-col flex-1">
        {/* Fixed header */}
        <div
          className={`fixed top-0 z-50 transition-all duration-300 ease-in-out ${
            collapsed ? 'left-20' : 'left-72'
          } right-0`}
        >
          <AdminHeader
            adminName={fullName}
            adminRole="System Administrator"
            notificationCount={5}
            onLogout={handleLogout}
            collapsed={collapsed}
          />
        </div>

        {/* Scrollable main content */}
        <main
          className={`flex-1 mt-[72px] transition-all duration-300 ease-in-out`}
        >
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;