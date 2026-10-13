async function request(endpoint, params = {}) {
  const query = new URLSearchParams(params);
  const suffix = query.toString() ? `?${query}` : "";
  const response = await fetch(`/api/tvmaze/${endpoint}${suffix}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "TVmaze request failed.");
  }

  return response.json();
}

export const searchShows = (query) =>
  request("search/shows", { q: query });

export const getShowDetails = (id) =>
  request(`shows/${encodeURIComponent(id)}`);
