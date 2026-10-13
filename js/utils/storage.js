
const STORAGE_KEY = "cinescope-watchlist";

export function getWatchlist() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function saveWatchlist(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function isSaved(item) {
  return getWatchlist().some(
    (saved) =>
      saved.id === item.id &&
      saved.source === (item.source || "tmdb") &&
      saved.media_type === (item.media_type || "movie")
  );
}

export function addToWatchlist(item) {
  const items = getWatchlist();

  if (isSaved(item)) return false;

  items.push({
    id: item.id,
    title: item.title || item.name || "Untitled",
    name: item.name || "",
    media_type: item.media_type || "movie",
    source: item.source || "tmdb",
    poster_path: item.poster_path || "",
    image: item.image || null,
    release_date: item.release_date || "",
    first_air_date: item.first_air_date || "",
    premiered: item.premiered || "",
    vote_average: item.vote_average ?? null,
    rating: item.rating || null,
    overview: item.overview || item.summary || ""
  });

  saveWatchlist(items);
  return true;
}

export function removeFromWatchlist(id, source, type) {
  const items = getWatchlist().filter(
    (item) =>
      !(
        String(item.id) === String(id) &&
        item.source === source &&
        item.media_type === type
      )
  );

  saveWatchlist(items);
  return items;
}
