import { useEffect, useState } from 'react';
import recommendApi from '../api/recommendApi.js';
import SongCard from '../components/SongCard.jsx';
import usePlayerStore from '../store/playerStore.js';

const quickPlaylists = [
  { name: 'Focus Flow', description: 'Deep focus electronic picks' },
  { name: 'Chill Hits', description: 'Relax and unwind' },
  { name: 'Workout', description: 'Push harder with these tracks' },
  { name: 'Indie Mix', description: 'Fresh indie discoveries' }
];

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [homeRecs, setHomeRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong, playPlaylist, recentlyPlayed } = usePlayerStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [trend, home] = await Promise.all([recommendApi.trending(), recommendApi.home()]);
        setTrending(trend || []);
        setHomeRecs(home || []);
      } catch (err) {
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Home Picks</h2>
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(homeRecs || []).map((song) => (
            <SongCard key={song.id} song={song} onPlay={(s) => playSong(s, homeRecs)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(trending || []).map((song) => (
            <SongCard key={song.id} song={song} onPlay={(s) => playSong(s, trending)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recently Played</h2>
        {recentlyPlayed?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentlyPlayed.map((song) => (
              <SongCard key={song.id} song={song} onPlay={(s) => playSong(s, recentlyPlayed)} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Start listening to build your history.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Quick Playlists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quickPlaylists.map((item, idx) => (
            <div key={idx} className="bg-card rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-1">{item.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{item.description}</p>
              <button
                onClick={() => playPlaylist(trending.length ? trending : homeRecs)}
                className="px-3 py-2 bg-green-500 text-black rounded text-sm font-semibold"
              >
                Play
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;