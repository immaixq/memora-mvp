import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { setAuthToken } from '@/lib/api';
import { useGamification } from '@/hooks/useGamification';
import Header from './Header';
import AchievementNotification from './AchievementNotification';

const Layout = () => {
  const { user, getIdToken } = useAuth();
  const { updateStreak } = useGamification();

  useEffect(() => {
    const updateAuthToken = async () => {
      if (user) {
        const token = await getIdToken();
        setAuthToken(token);
      } else {
        setAuthToken(null);
      }
    };

    updateAuthToken();
  }, [user, getIdToken]);

  useEffect(() => {
    // Update streak when user visits the app
    if (user) {
      updateStreak();
    }
  }, [user, updateStreak]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Outlet />
      </main>
      <AchievementNotification />
    </div>
  );
};

export default Layout;