import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/user/Header';
import Footer from '../components/user/Footer';
import { logout } from '../../appStore/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../appStore/store';
import { usePreferences } from '../../application/context/PreferencesContext';
import { socketRef } from '../pages/canvas/chat/ChatComponent';
import { authService } from '../../application/services/auth.service';

const UserLayout = () => {
  const location = useLocation();
  const isCanvas = location.pathname.includes('/canvas');
  const defaultTab = isCanvas ? 'Dashboard' : '';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { styles } = usePreferences();
  const isSettingsPage = location.pathname === '/settings';
  const isHelpPage = location.pathname === '/help';

  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const profilePicture = user?.profilePicture;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    console.log('logout ijsijijsijijijsqwouhuodniqsndninin');
    try {
      await authService.logout(); // Call backend API here
    } catch (err: any) {
      // Ignore 401 errors, log others
      if (!err.message?.includes('401')) {
        console.error('Logout API error:', err);
      }
    }
    dispatch(logout()); // Just update Redux state
    navigate('/login');
  };

  // Update activeTab when URL changes
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/canvas')) {
      setActiveTab('Dashboard');
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
            profilePicture={profilePicture}
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