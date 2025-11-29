import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaVolumeUp } from 'react-icons/fa';
import usePlayerStore from '../store/playerStore.js';
import recommendApi from '../api/recommendApi.js';
import { formatDuration } from '../utils/format.js';

const Player = () => {
  const audioRef = useRef(null);
  const {
    currentSong,
    isPlaying,
    next,
    prev,
    togglePlay,
    playPlaylist,
    context
  } = usePlayerStore();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    audioRef.current.src = currentSong.audioUrl || currentSong.previewUrl;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentSong]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(audio.currentTime);
    setDuration(audio.duration || 0);
  };

  const handleSeek = (e) => {
    const value = Number(e.target.value);
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setProgress(value);
  };

  const handleSmartShuffle = async () => {
    if (!context?.playlistId) return;
    setShuffling(true);
    try {
      const data = await recommendApi.smartShuffle(context.playlistId);
      if (Array.isArray(data)) {
        playPlaylist(data, 0, context);
      }
    } catch (error) {
      console.error('Smart shuffle failed', error);
    } finally {
      setShuffling(false);
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 flex items-center gap-6">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={next}
        onLoadedMetadata={handleTimeUpdate}
      />
      <div className="flex items-center gap-3 min-w-[200px]">
        <img
          src={currentSong.imageUrl || currentSong.image || 'https://placehold.co/60'}
          alt={currentSong.title}
          className="w-14 h-14 object-cover rounded"
        />
        <div>
          <p className="font-semibold text-sm">{currentSong.title || currentSong.name}</p>
          <p className="text-xs text-gray-400">{currentSong.artist || currentSong.artists?.join(', ')}</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <button onClick={prev} className="hover:text-green-400">
            <FaStepBackward />
          </button>
          <button
            onClick={togglePlay}
            className="bg-white text-black rounded-full p-3 hover:scale-105"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={next} className="hover:text-green-400">
            <FaStepForward />
          </button>
          <button
            onClick={handleSmartShuffle}
            disabled={shuffling || !context?.playlistId}
            className={`hover:text-green-400 ${shuffling ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Smart shuffle playlist"
          >
            <FaRandom />
          </button>
        </div>
        <div className="flex items-center gap-3 w-full max-w-xl">
          <span className="text-xs text-gray-400 w-10 text-right">{formatDuration(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
            className="w-full accent-green-500"
          />
          <span className="text-xs text-gray-400 w-10">{formatDuration(duration)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 w-40">
        <FaVolumeUp />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full accent-green-500"
        />
      </div>
    </div>
  );
};

export default Player;