import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import useAuthStore from '../store/authStore.js';

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pageTitle = () => {
    const pathname = location.pathname;
    if (pathname.includes('/search')) return 'Search';
    if (pathname.includes('/playlist')) return 'Playlist';
    if (pathname.includes('/song')) return 'Song';
    if (pathname.includes('/recommend')) return 'Recommendations';
    return 'Home';
  };

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold">{pageTitle()}</h1>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <FaUserCircle className="text-3xl text-white" />
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-full bg-white text-black text-sm font-semibold hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;