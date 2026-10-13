
import {
  escapeHTML,
  getTitle,
  getYear,
  getPoster,
  getDetailsURL,
  getRating
} from "../utils/helpers.js";

import {
  addToWatchlist,
  isSaved
} from "../utils/storage.js";

export function renderMovieCard(item) {
  const title = getTitle(item);
  const poster = getPoster(item);
  const type = item.media_type || "movie";
  const url = getDetailsURL(item);
  const saved = isSaved(item);

  const card = document.createElement("article");
  card.className = "movie-card";

  const image = poster
    ? `<img src="${escapeHTML(poster)}" alt="Poster for ${escapeHTML(title)}" loading="lazy">`
    : `<div class="poster-placeholder">Poster unavailable</div>`;

  card.innerHTML = `
    <a href="${url}" aria-label="View details for ${escapeHTML(title)}">
      ${image}
      <div class="card-body">
        <h3>${escapeHTML(title)}</h3>
        <div class="card-meta">
          ${escapeHTML(getYear(item))} · ${escapeHTML(type.toUpperCase())}
        </div>
        <div class="card-meta">Rating: ${escapeHTML(getRating(item))}</div>
      </div>
    </a>
    <div class="card-actions">
      <button type="button" class="save-button">
        ${saved ? "Saved to watchlist" : "+ Add to watchlist"}
      </button>
    </div>
  `;

  const button = card.querySelector(".save-button");

  button.disabled = saved;

  button.addEventListener("click", () => {
    if (addToWatchlist(item)) {
      button.textContent = "Saved to watchlist";
      button.disabled = true;
      button.setAttribute("aria-label", `${title} saved to watchlist`);
    }
  });

  return card;
}

export function renderCards(container, items) {
  container.replaceChildren();

  items.forEach((item) => {
    container.appendChild(renderMovieCard(item));
  });
}
