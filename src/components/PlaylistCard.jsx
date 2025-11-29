import { useNavigate } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

const PlaylistCard = ({ playlist, onPlay }) => {
  const navigate = useNavigate();
  const handlePlay = (e) => {
    e.stopPropagation();
    onPlay?.(playlist);
  };

  return (
    <div
      className="bg-card rounded-lg p-4 hover:bg-border cursor-pointer flex flex-col gap-3"
      onClick={() => navigate(`/playlist/${playlist.id}`)}
    >
      <div className="relative w-full h-36 bg-border rounded flex items-center justify-center text-4xl font-bold text-gray-500">
        {playlist.name?.[0] || 'P'}
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 shadow-lg hover:scale-105"
        >
          <FaPlay />
        </button>
      </div>
      <div>
        <h3 className="font-semibold">{playlist.name}</h3>
        <p className="text-sm text-gray-400">{playlist.songs?.length || 0} songs</p>
      </div>
    </div>
  );
};

export default PlaylistCard;