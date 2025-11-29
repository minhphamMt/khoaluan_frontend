import { create } from "zustand";

const getRecentFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("recentlyPlayed")) || [];
  } catch (error) {
    return [];
  }
};

const persistRecent = (song) => {
  if (!song) return;
  const current = getRecentFromStorage().filter((item) => item.id !== song.id);
  const updated = [song, ...current].slice(0, 20);
  localStorage.setItem("recentlyPlayed", JSON.stringify(updated));
  return updated;
};

const usePlayerStore = create((set, get) => ({
  currentSong: null,
  playQueue: [],
  currentIndex: 0,
  isPlaying: false,
  recentlyPlayed: getRecentFromStorage(),
  context: null,
  playSong: (song, queue = [song], context = null) => {
    const index = queue.findIndex((s) => s.id === song.id);
    const currentIndex = index >= 0 ? index : 0;
    const recentlyPlayed = persistRecent(song);
    set({
      currentSong: song,
      playQueue: queue,
      currentIndex,
      isPlaying: true,
      context,
      recentlyPlayed,
    });
  },
  playPlaylist: (songs = [], startIndex = 0, context = null) => {
    if (!songs.length) return;
    const song = songs[startIndex] || songs[0];
    const recentlyPlayed = persistRecent(song);
    set({
      playQueue: songs,
      currentIndex: startIndex,
      currentSong: song,
      isPlaying: true,
      context,
      recentlyPlayed,
    });
  },
  next: () => {
    const { currentIndex, playQueue } = get();
    if (!playQueue.length) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < playQueue.length) {
      const song = playQueue[nextIndex];
      const recentlyPlayed = persistRecent(song);
      set({
        currentIndex: nextIndex,
        currentSong: song,
        isPlaying: true,
        recentlyPlayed,
      });
    }
  },
  prev: () => {
    const { currentIndex, playQueue } = get();
    if (!playQueue.length) return;
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const song = playQueue[prevIndex];
      const recentlyPlayed = persistRecent(song);
      set({
        currentIndex: prevIndex,
        currentSong: song,
        isPlaying: true,
        recentlyPlayed,
      });
    }
  },
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));

export default usePlayerStore;
