
async function request(endpoint, params = {}) {
  const query = new URLSearchParams(params);
  const suffix = query.toString() ? `?${query}` : "";
  const response = await fetch(`/api/tmdb/${endpoint}${suffix}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "TMDB request failed.");
  }

  return response.json();
}

export const getPopularMovies = () =>
  request("movie/popular");

export const getPopularTV = () =>
  request("tv/popular");

export const getTrendingMovies = () =>
  request("trending/movie/week");

export const getTrendingTV = () =>
  request("trending/tv/week");

export const searchMovies = (query) =>
  request("search/movie", { query });

export const searchTV = (query) =>
  request("search/tv", { query });

export async function searchAll(query) {
  const [movies, shows] = await Promise.all([
    searchMovies(query),
    searchTV(query)
  ]);

  return [
    ...movies.results.map((item) => ({ ...item, media_type: "movie" })),
    ...shows.results.map((item) => ({ ...item, media_type: "tv" }))
  ].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
}

export const getMovieDetails = (id) =>
  request(`movie/${encodeURIComponent(id)}`);

export const getTVDetails = (id) =>
  request(`tv/${encodeURIComponent(id)}`);

export const getMovieGenres = () =>
  request("genre/movie/list");

export const getTVGenres = () =>
  request("genre/tv/list");
