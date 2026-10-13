
# CineScope — Movie & TV Discovery

Discover what to watch next.

## About

CineScope is a responsive movie and television discovery application.
It allows users to explore popular titles, search for movies and
shows, view title details, and maintain a personal watchlist.

## Features

- Browse trending movies and TV shows.
- Search for movies and television shows.
- Explore additional TV-show information through TVmaze.
- View posters, ratings, release dates, genres, and descriptions.
- Save titles to a personal watchlist.
- Remove saved titles from the watchlist.
- Responsive design for mobile and desktop.
- Server-side proxy for TMDB API requests.

## Technologies

- HTML
- CSS
- JavaScript ES modules
- Node.js
- Express
- TMDB API
- TVmaze API
- Browser localStorage

## Run locally

1. Install Node.js.
2. Create a `.env` file in the project root.
3. Add your TMDB API key to `.env`.
4. Run `npm install`.
5. Run `npm run dev`.
6. Visit http://localhost:3000.

## Security

Never commit your `.env` file or expose your API credentials.
Use `.env.example` as a template.

## Data providers

- TMDB: https://developer.themoviedb.org/
- TVmaze: https://www.tvmaze.com/api

This product uses the TMDB API but is not endorsed or certified by TMDB.

## Author

Paul Clement WDD330
