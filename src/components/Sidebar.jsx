import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaMusic, FaHeart, FaListUl } from 'react-icons/fa';
import useAuthStore from '../store/authStore.js';

const navItems = [
  { to: '/home', label: 'Home', icon: <FaHome /> },
  { to: '/search', label: 'Search', icon: <FaSearch /> },
  { to: '/playlists', label: 'Your Library', icon: <FaMusic /> },
  { to: '/recommend', label: 'Recommended', icon: <FaListUl /> },
  { to: '/playlists?liked=true', label: 'Liked Songs', icon: <FaHeart /> }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col p-4 gap-6">
      <div className="text-2xl font-bold">MuseStream</div>
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-border ${
                isActive ? 'bg-border text-white' : 'text-gray-300'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="text-sm text-gray-400">
        Logged in as <span className="text-white font-semibold">{user?.name || user?.email}</span>
        <button
          onClick={() => navigate('/playlists')}
          className="block w-full mt-2 text-left text-xs text-green-400 hover:underline"
        >
          Manage playlists
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;