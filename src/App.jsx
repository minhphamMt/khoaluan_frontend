import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import SongDetail from './pages/SongDetail.jsx';
import PlaylistDetail from './pages/PlaylistDetail.jsx';
import Playlists from './pages/Playlists.jsx';
import Recommendation from './pages/Recommendation.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import Player from './components/Player.jsx';
import useAuthStore from './store/authStore.js';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto pb-24 px-6">{/* space for player */}
          <Outlet />
        </main>
        <Player />
      </div>
    </div>
  );
};

const ProtectedRoute = () => {
  const { token, user, loadUser } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      loadUser();
    }
  }, [token, user, loadUser]);

  if (!token) return <Navigate to="/login" replace />;
  return <Layout />;
};

function App() {
  const { token } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/home" replace /> : <Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/song/:songId" element={<SongDetail />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
        <Route path="/recommend" element={<Recommendation />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;