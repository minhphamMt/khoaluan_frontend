import { useEffect, useState } from 'react';
import songApi from '../api/songApi.js';
import playlistApi from '../api/playlistApi.js';
import usePlayerStore from '../store/playerStore.js';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { playSong } = usePlayerStore();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await songApi.searchSpotify(query);
        setResults(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  const handleAddToPlaylist = async (songId) => {
    const playlistId = prompt('Enter playlist ID to add this song:');
    if (!playlistId) return;
    try {
      await playlistApi.addSong(playlistId, songId);
      alert('Song added to playlist');
    } catch (error) {
      alert('Failed to add song');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-4 border border-border">
        <input
          type="text"
          placeholder="Search songs or artists"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-border text-white px-4 py-3 rounded outline-none"
        />
      </div>

      {loading && <p className="text-gray-400">Searching...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((song) => (
          <div key={song.id} className="bg-card rounded-lg p-4 border border-border flex gap-4">
            <img
              src={song.imageUrl || song.image || 'https://placehold.co/80'}
              alt={song.title}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{song.title || song.name}</h3>
              <p className="text-sm text-gray-400">{song.artist || song.artists?.join(', ')}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => playSong(song, results)}
                  className="px-3 py-1 rounded bg-green-500 text-black text-sm font-semibold"
                >
                  Play
                </button>
                <button
                  onClick={() => handleAddToPlaylist(song.id)}
                  className="px-3 py-1 rounded border border-border text-sm hover:bg-border"
                >
                  Add to playlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;