
import {
  searchMovies,
  searchTV,
  searchAll
} from "../api/tmdb.js";

import { renderCards } from "../components/movieCard.js";

export function initSearch() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-query");
  const typeSelect = document.getElementById("search-type");
  const status = document.getElementById("search-status");
  const container = document.getElementById("search-results");

  const params = new URLSearchParams(window.location.search);
  input.value = params.get("query") || "";

  const requestedType = params.get("type");

  if (["movie", "tv"].includes(requestedType)) {
    typeSelect.value = requestedType;
  }

  async function runSearch(query, type) {
    status.textContent = "Searching...";
    container.replaceChildren();

    try {
      let items;

      if (type === "movie") {
        const data = await searchMovies(query);
        items = (data.results || []).map((item) => ({
          ...item,
          source: "tmdb",
          media_type: "movie"
        }));
      } else if (type === "tv") {
        const data = await searchTV(query);
        items = (data.results || []).map((item) => ({
          ...item,
          source: "tmdb",
          media_type: "tv"
        }));
      } else {
        items = await searchAll(query);
        items = items.map((item) => ({
          ...item,
          source: "tmdb"
        }));
      }

      renderCards(container, items);

      status.textContent = items.length
        ? `${items.length} results found.`
        : "No results found. Try another title.";
    } catch (error) {
      status.textContent = error.message;
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = input.value.trim();

    if (!query) {
      status.textContent = "Enter a title to search.";
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("query", query);
    url.searchParams.set("type", typeSelect.value);
    window.history.replaceState({}, "", url);

    runSearch(query, typeSelect.value);
  });

  if (input.value.trim()) {
    runSearch(input.value.trim(), typeSelect.value);
  }
}
