
import {
  getTrendingMovies,
  getTrendingTV
} from "../api/tmdb.js";

import { searchShows } from "../api/tvmaze.js";
import { renderCards } from "../components/movieCard.js";
import { escapeHTML } from "../utils/helpers.js";

function showError(status, error) {
  status.textContent = error.message || "Something went wrong.";
}

async function loadSection(fetchData, containerId, statusId, type) {
  const container = document.getElementById(containerId);
  const status = document.getElementById(statusId);

  try {
    const data = await fetchData();
    const items = (data.results || []).map((item) => ({
      ...item,
      media_type: type,
      source: "tmdb"
    }));

    renderCards(container, items);
    status.textContent = items.length
      ? `${items.length} titles loaded.`
      : "No titles found.";
  } catch (error) {
    showError(status, error);
  }
}

export function initHome() {
  loadSection(
    getTrendingMovies,
    "movie-results",
    "movie-status",
    "movie"
  );

  loadSection(
    getTrendingTV,
    "tv-results",
    "tv-status",
    "tv"
  );

  const heroForm = document.getElementById("hero-search");

  heroForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = document.getElementById("hero-query").value.trim();

    if (query) {
      window.location.href =
        `/search.html?query=${encodeURIComponent(query)}`;
    }
  });

  const tvForm = document.getElementById("tvmaze-search");

  tvForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = document.getElementById("tvmaze-query").value.trim();
    const status = document.getElementById("tvmaze-status");
    const container = document.getElementById("tvmaze-results");

    if (!query) return;

    status.textContent = "Searching TVmaze...";
    container.replaceChildren();

    try {
      const results = await searchShows(query);

      const items = results.map(({ show }) => ({
        ...show,
        source: "tvmaze",
        media_type: "tvmaze"
      }));

      renderCards(container, items);

      status.textContent = items.length
        ? `${items.length} TVmaze results found.`
        : "No shows found.";
    } catch (error) {
      status.textContent = error.message;
    }
  });
}
