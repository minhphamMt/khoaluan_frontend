import { useNavigate } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

const SongCard = ({ song, onPlay, actionSlot }) => {
  const navigate = useNavigate();
  const handlePlay = (e) => {
    e.stopPropagation();
    onPlay?.(song);
  };

  return (
    <div
      className="bg-card rounded-lg p-3 hover:bg-border transition cursor-pointer flex flex-col gap-3"
      onClick={() => navigate(`/song/${song.id}`)}
    >
      <div className="relative">
        <img
          src={song.image || song.coverUrl || 'https://placehold.co/300x300?text=Music'}
          alt={song.title}
          className="w-full h-40 object-cover rounded"
        />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 shadow-lg hover:scale-105"
        >
          <FaPlay />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold truncate">{song.title || song.name}</h3>
        <p className="text-sm text-gray-400 truncate">{song.artist || song.artists?.join(', ')}</p>
      </div>
      {actionSlot && <div>{actionSlot}</div>}
    </div>
  );
};

export default SongCard;