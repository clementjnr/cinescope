
import {
  getMovieDetails,
  getTVDetails
} from "../api/tmdb.js";

import { getShowDetails } from "../api/tvmaze.js";

import {
  escapeHTML,
  stripHTML,
  getPoster,
  getTitle,
  formatDate,
  getRating
} from "../utils/helpers.js";

import {
  addToWatchlist,
  isSaved
} from "../utils/storage.js";

export async function initDetails() {
  const status = document.getElementById("details-status");
  const container = document.getElementById("details-content");
  const params = new URLSearchParams(window.location.search);

  const id = params.get("id");
  const source = params.get("source") || "tmdb";
  const type = params.get("type") || "movie";

  if (!id || !/^\d+$/.test(id)) {
    status.textContent = "A valid title ID was not provided.";
    return;
  }

  try {
    let item;

    if (source === "tvmaze") {
      item = await getShowDetails(id);
      item = {
        ...item,
        source: "tvmaze",
        media_type: "tvmaze"
      };
    } else if (type === "tv") {
      item = {
        ...(await getTVDetails(id)),
        source: "tmdb",
        media_type: "tv"
      };
    } else {
      item = {
        ...(await getMovieDetails(id)),
        source: "tmdb",
        media_type: "movie"
      };
    }

    const title = getTitle(item);
    const poster = getPoster(item);
    const overview = stripHTML(
      item.overview || item.summary || "No description is available."
    );

    const genres = (item.genres || [])
      .map((genre) => `<span class="pill">${escapeHTML(genre.name || genre)}</span>`)
      .join("");

    const date =
      item.release_date || item.first_air_date || item.premiered;

    const saved = isSaved(item);

    container.innerHTML = `
      <article class="details-layout">
        <div>
          ${poster
            ? `<img class="details-poster" src="${escapeHTML(poster)}" alt="Poster for ${escapeHTML(title)}">`
            : `<div class="poster-placeholder">Poster unavailable</div>`}
        </div>
        <div class="details-copy">
          <p class="eyebrow">${escapeHTML(item.media_type.toUpperCase())}</p>
          <h1>${escapeHTML(title)}</h1>
          <div class="details-facts">
            <span class="pill">Rating: ${escapeHTML(getRating(item))}</span>
            <span class="pill">${escapeHTML(formatDate(date))}</span>
            ${genres}
          </div>
          <h2>Overview</h2>
          <p>${escapeHTML(overview)}</p>
          <button type="button" id="details-save" ${saved ? "disabled" : ""}>
            ${saved ? "Saved to watchlist" : "Add to watchlist"}
          </button>
        </div>
      </article>
    `;

    const saveButton = document.getElementById("details-save");

    saveButton.addEventListener("click", () => {
      if (addToWatchlist(item)) {
        saveButton.textContent = "Saved to watchlist";
        saveButton.disabled = true;
      }
    });

    status.textContent = "Title details loaded.";
    document.title = `${title} | CineScope`;
  } catch (error) {
    status.textContent = error.message || "Unable to load title details.";
  }
}
