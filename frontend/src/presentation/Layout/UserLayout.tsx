import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from '../pages/user/Header';
import Footer from '../pages/user/Footer';
import { logout } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { usePreferences } from '../context/PreferencesContext';

const UserLayout = () => {
  const location = useLocation();
  const isCanvas = location.pathname.includes('/canvas');
  const defaultTab = isCanvas ? 'Canvas Dashboard' : 'Dashboard';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { styles } = usePreferences();
  const isSettingsPage = location.pathname === '/settings';
  const isHelpPage = location.pathname === '/help';

  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Update activeTab when URL changes
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/canvas')) {
      setActiveTab('Canvas Dashboard');
    } else if (path.includes('/dashboard')) {
      setActiveTab('Dashboard');
    }
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex flex-col ${styles.background} ${styles.textPrimary}`}>
      <div className="relative z-10 flex flex-col min-h-screen">
        {!isSettingsPage && !isHelpPage && (
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            onLogout={handleLogout}
            userName={fullName}
          />
        )}
        <main className={`flex-grow px-4 ${isSettingsPage || isHelpPage ? 'py-12' : 'py-8'} ${styles.textPrimary}`}>
          <Outlet context={[activeTab, setActiveTab]} />
        </main>
        {!isSettingsPage && !isHelpPage && <Footer />}
      </div>
    </div>
  );
};

export default UserLayout;