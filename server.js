
import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Serve CSS and JavaScript from the existing folders.
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use(
  "/images",
  express.static(path.join(__dirname, "public", "images"))
);

const pages = {
  "/": "index.html",
  "/details.html": "details.html",
  "/search.html": "search.html",
  "/watchlist.html": "watchlist.html"
};

for (const [route, file] of Object.entries(pages)) {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, file));
  });
}

// TMDB requests go through the server so the API key
// does not have to appear in browser JavaScript.
app.get("/api/tmdb/*", async (req, res) => {
  try {
    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({
        message: "TMDB API key is missing from the .env file."
      });
    }

    const endpoint = req.params[0];

    // Only allow known, read-only TMDB endpoints.
    const allowed = [
      "trending/movie/week",
      "trending/tv/week",
      "movie/popular",
      "tv/popular",
      "search/movie",
      "search/tv",
      "movie",
      "tv",
      "genre/movie/list",
      "genre/tv/list"
    ];

    const permitted = allowed.some(
      (item) =>
        endpoint === item ||
        (["movie", "tv"].includes(item) &&
          new RegExp(`^${item}/\\d+$`).test(endpoint))
    );

    if (!permitted) {
      return res.status(400).json({
        message: "This TMDB endpoint is not permitted."
      });
    }

    const url = new URL(
      `https://api.themoviedb.org/3/${endpoint}`
    );

    for (const [key, value] of Object.entries(req.query)) {
      url.searchParams.set(key, String(value));
    }

    url.searchParams.set("api_key", process.env.TMDB_API_KEY);

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        message: "TMDB could not complete the request."
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("TMDB error:", error.message);
    res.status(500).json({
      message: "Unable to retrieve movie and TV data."
    });
  }
});

// TVmaze public API: no API key is required.
app.get("/api/tvmaze/*", async (req, res) => {
  try {
    const endpoint = req.params[0];

    const allowed =
      endpoint === "search/shows" ||
      /^shows\/\d+$/.test(endpoint);

    if (!allowed) {
      return res.status(400).json({
        message: "This TVmaze endpoint is not permitted."
      });
    }

    const url = new URL(`https://api.tvmaze.com/${endpoint}`);

    for (const [key, value] of Object.entries(req.query)) {
      url.searchParams.set(key, String(value));
    }

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        message: "TVmaze could not complete the request."
      });
    }

    res.json(await response.json());
  } catch (error) {
    console.error("TVmaze error:", error.message);
    res.status(500).json({
      message: "Unable to retrieve TV-show data."
    });
  }
});

app.use((req, res) => {
  res.status(404).send("404 — Page not found.");
});

app.listen(PORT, () => {
  console.log(`CineScope is running at http://localhost:${PORT}`);
});
