const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// checks whether exists
async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

// GET /movies/:movieId
function read(req, res) {
  const { movie: data } = res.locals;
  res.json({ data });
}

// GET /movies/:movieId/theaters
async function readTheatersPlayingMovie(req, res) {
  const movieId = res.locals.movie.movie_id;
  const data = await service.readTheatersPlayingMovie(movieId);
  res.json({ data });
}

// GET /movies/:movieId/reviews
async function readMovieReviews(req, res) {
  const movieId = res.locals.movie.movie_id;
  const data = await service.readMovieReviews(movieId);
  res.json({ data });
}

// GET /movies and /movies?is_showing=true
async function list(req, res) {
  const { is_showing } = req.query;
  if (is_showing) {
    const data = await service.listMoviesShowing();
    return res.json({ data });
  }
  const data = await service.list();
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  readTheatersPlayingMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readTheatersPlayingMovie),
  ],
  readMovieReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readMovieReviews),
  ],
};
