
import { initNavigation } from "./components/navigation.js";
import { initHome } from "./pages/home.js";
import { initSearch } from "./pages/search.js";
import { initDetails } from "./pages/details.js";
import { initWatchlist } from "./pages/watchlist.js";
import { showPageError } from "./app.js";

initNavigation();

const page = document.body.dataset.page;

const pages = {
  home: initHome,
  search: initSearch,
  details: initDetails,
  watchlist: initWatchlist
};

try {
  if (pages[page]) {
    await pages[page]();
  } else {
    showPageError("This page could not be loaded.");
  }
} catch (error) {
  console.error("CineScope page error:", error);
  showPageError("Something went wrong while loading this page.");
}
