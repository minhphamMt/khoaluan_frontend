import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import songApi from '../api/songApi.js';
import recommendApi from '../api/recommendApi.js';
import SongCard from '../components/SongCard.jsx';
import usePlayerStore from '../store/playerStore.js';

const SongDetail = () => {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayerStore();

  useEffect(() => {
    const fetchSong = async () => {
      setLoading(true);
      try {
        const [songData, recData] = await Promise.all([
          songApi.getSong(songId),
          recommendApi.contentBased(songId)
        ]);
        setSong(songData);
        setRecs(recData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [songId]);

  const handlePlay = async () => {
    if (!song) return;
    try {
      await songApi.listen(song.id);
    } catch (error) {
      console.error(error);
    }
    playSong(song, [song, ...recs]);
  };

  const handleLike = async () => {
    if (!song) return;
    try {
      await songApi.like(song.id);
      alert('Liked!');
    } catch (error) {
      alert('Failed to like song');
    }
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!song) return <p className="text-gray-400">Song not found.</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 bg-card p-6 rounded-lg border border-border">
        <img
          src={song.imageUrl || song.image || 'https://placehold.co/240'}
          alt={song.title}
          className="w-56 h-56 object-cover rounded"
        />
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <p className="uppercase text-sm text-gray-400">Song</p>
            <h1 className="text-3xl font-bold">{song.title || song.name}</h1>
            <p className="text-lg text-gray-300">{song.artist || song.artists?.join(', ')}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handlePlay} className="px-4 py-2 bg-green-500 text-black rounded-full font-semibold">
              Play
            </button>
            <button onClick={handleLike} className="px-4 py-2 border border-border rounded-full">
              Like
            </button>
          </div>
          {(song.audioUrl || song.previewUrl) && (
            <audio controls src={song.audioUrl || song.previewUrl} className="w-full" />
          )}
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Similar Recommendations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recs.map((item) => (
            <SongCard key={item.id} song={item} onPlay={(s) => playSong(s, recs)} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SongDetail;