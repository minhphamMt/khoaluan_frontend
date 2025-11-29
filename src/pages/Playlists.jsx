import { useEffect, useState } from 'react';
import playlistApi from '../api/playlistApi.js';
import PlaylistCard from '../components/PlaylistCard.jsx';
import usePlayerStore from '../store/playerStore.js';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const { playPlaylist } = usePlayerStore();

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const data = await playlistApi.getMine();
      setPlaylists(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await playlistApi.create({ name });
      setName('');
      fetchPlaylists();
    } catch (error) {
      alert('Failed to create playlist');
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-card p-4 rounded-lg border border-border flex flex-col gap-3 max-w-md">
        <h2 className="text-xl font-semibold">Create Playlist</h2>
        <form className="flex gap-2" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-border text-white outline-none"
          />
          <button type="submit" className="px-4 py-2 bg-green-500 text-black rounded font-semibold">
            Create
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Playlists</h2>
        {loading && <p className="text-gray-400">Loading...</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onPlay={(pl) => playPlaylist(pl.songs || [], 0, { playlistId: pl.id })}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Playlists;