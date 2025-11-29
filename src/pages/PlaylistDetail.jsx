import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import playlistApi from '../api/playlistApi.js';
import recommendApi from '../api/recommendApi.js';
import SongCard from '../components/SongCard.jsx';
import usePlayerStore from '../store/playerStore.js';

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [songId, setSongId] = useState('');
  const [loading, setLoading] = useState(true);
  const [shuffling, setShuffling] = useState(false);
  const { playPlaylist, playSong } = usePlayerStore();

  const fetchPlaylist = async () => {
    setLoading(true);
    try {
      const data = await playlistApi.getById(id);
      setPlaylist(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!songId.trim()) return;
    try {
      await playlistApi.addSong(id, songId.trim());
      setSongId('');
      fetchPlaylist();
    } catch (error) {
      alert('Failed to add song');
    }
  };

  const handleRemove = async (removeId) => {
    try {
      await playlistApi.removeSong(id, removeId);
      fetchPlaylist();
    } catch (error) {
      alert('Failed to remove song');
    }
  };

  const handleSmartShuffle = async () => {
    setShuffling(true);
    try {
      const data = await recommendApi.smartShuffle(id);
      if (Array.isArray(data)) {
        setPlaylist((prev) => ({ ...prev, songs: data }));
        playPlaylist(data, 0, { playlistId: id });
      }
    } catch (error) {
      alert('Smart shuffle failed');
    } finally {
      setShuffling(false);
    }
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!playlist) return <p className="text-gray-400">Playlist not found.</p>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 bg-card p-5 rounded-lg border border-border">
        <div>
          <p className="uppercase text-sm text-gray-400">Playlist</p>
          <h1 className="text-3xl font-bold">{playlist.name}</h1>
          <p className="text-gray-400">{playlist.songs?.length || 0} songs</p>
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => playPlaylist(playlist.songs || [], 0, { playlistId: id })}
              className="px-4 py-2 bg-green-500 text-black rounded-full font-semibold"
            >
              Play
            </button>
            <button
              onClick={handleSmartShuffle}
              disabled={shuffling}
              className="px-4 py-2 border border-border rounded-full disabled:opacity-50"
            >
              Smart Shuffle
            </button>
          </div>
        </div>
        <div className="w-28 h-28 rounded bg-border flex items-center justify-center text-3xl font-bold text-gray-500">
          {playlist.name?.[0] || 'P'}
        </div>
      </div>

      <form onSubmit={handleAdd} className="bg-card p-4 rounded-lg border border-border flex gap-3 max-w-lg">
        <input
          type="text"
          placeholder="Song ID to add"
          value={songId}
          onChange={(e) => setSongId(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-border text-white outline-none"
        />
        <button type="submit" className="px-4 py-2 bg-green-500 text-black rounded font-semibold">
          Add
        </button>
      </form>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Songs</h2>
        {playlist.songs?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playlist.songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={(s) => playSong(s, playlist.songs, { playlistId: id })}
                actionSlot={
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(song.id);
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No songs yet.</p>
        )}
      </section>
    </div>
  );
};

export default PlaylistDetail;