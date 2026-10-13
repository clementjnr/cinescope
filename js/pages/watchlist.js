
import { getWatchlist, removeFromWatchlist } from "../utils/storage.js";
import { renderCards } from "../components/movieCard.js";
import { escapeHTML } from "../utils/helpers.js";

export function initWatchlist() {
  const container = document.getElementById("watchlist-results");
  const status = document.getElementById("watchlist-status");

  function displayWatchlist() {
    const items = getWatchlist();

    container.replaceChildren();

    if (!items.length) {
      status.textContent = "Your watchlist is empty. Search for a title to add one.";
      return;
    }

    status.textContent = `${items.length} saved title${items.length === 1 ? "" : "s"}.`;

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "movie-card";

      renderCards;
      const title = escapeHTML(item.title || item.name || "Untitled");
      const type = escapeHTML(item.media_type || "movie");
      const source = escapeHTML(item.source || "tmdb");

      const imageUrl = item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : item.image?.medium || "";

      card.innerHTML = `
        <div class="card-body">
          ${imageUrl
            ? `<img src="${escapeHTML(imageUrl)}" alt="Poster for ${title}" loading="lazy">`
            : `<div class="poster-placeholder">Poster unavailable</div>`}
          <h3>${title}</h3>
          <p class="card-meta">${type.toUpperCase()}</p>
          <a href="/details.html?source=${source}&type=${type}&id=${encodeURIComponent(item.id)}">View details</a>
        </div>
        <div class="card-actions">
          <button type="button" class="remove-button">Remove</button>
        </div>
      `;

      card.querySelector(".remove-button").addEventListener("click", () => {
        removeFromWatchlist(item.id, item.source || "tmdb", item.media_type || "movie");
        displayWatchlist();
      });

      container.appendChild(card);
    });
  }

  displayWatchlist();
}
