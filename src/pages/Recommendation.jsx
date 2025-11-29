import { useEffect, useState } from 'react';
import recommendApi from '../api/recommendApi.js';
import SongCard from '../components/SongCard.jsx';
import usePlayerStore from '../store/playerStore.js';

const Recommendation = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { playSong } = usePlayerStore();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const data = await recommendApi.userBased();
        setSongs(data || []);
        setMessage('Tailored to your taste');
      } catch (error) {
        const [trend, home] = await Promise.all([
          recommendApi.trending(),
          recommendApi.home()
        ]);
        setSongs([...(trend || []), ...(home || [])]);
        setMessage('Showing trending & personalized fallback');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">For You</h1>
          <p className="text-gray-400 text-sm">{message}</p>
        </div>
      </div>
      {loading && <p className="text-gray-400">Loading recommendations...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} onPlay={(s) => playSong(s, songs)} />
        ))}
      </div>
    </div>
  );
};

export default Recommendation;