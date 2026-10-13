
export function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

export function stripHTML(value = "") {
  const element = document.createElement("div");
  element.innerHTML = value;
  return element.textContent || "";
}

export function formatDate(value) {
  if (!value) return "Release date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function getTitle(item) {
  return item.title || item.name || "Untitled";
}

export function getYear(item) {
  const date = item.release_date || item.first_air_date || item.premiered;
  return date ? date.slice(0, 4) : "Year unknown";
}

export function getPoster(item) {
  if (item.poster_path) {
    return `https://image.tmdb.org/t/p/w500${item.poster_path}`;
  }

  return item.image?.medium || item.image?.original || "";
}

export function getDetailsURL(item) {
  const source = item.source || "tmdb";
  const type = item.media_type || "movie";

  return `/details.html?source=${encodeURIComponent(source)}&type=${encodeURIComponent(type)}&id=${encodeURIComponent(item.id)}`;
}

export function getRating(item) {
  const rating = item.vote_average ?? item.rating?.average;

  return typeof rating === "number"
    ? rating.toFixed(1)
    : "Not rated";
}
