import express from "express";

import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";

const router = express.Router();

// GET - Ver la lista de películas
router.get("/:userId", authenticate, (req, res) => {
  const userId = Number(req.params.userId);
  const watchlist = getWatchlist(userId);

  if (watchlist === null) {
    return res.status(404).json({
      error: "User not found.",
    });
  }

  res.status(200).json(watchlist);
});

// POST - Agregar una película
router.post(
  "/:userId/movies",
  authenticate,
  authorizeModification,
  (req, res) => {
    const userId = Number(req.params.userId);
    const { title, genre } = req.body;

    if (!title || !genre) {
      return res.status(400).json({
        error: "Title and genre are required.",
      });
    }

    const movie = addMovie(userId, {
      title,
      genre,
    });

    if (movie === null) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    res.status(201).json(movie);
  },
);

// PUT - Actualizar una película
router.put(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);

    const movie = updateMovie(userId, movieId, req.body);

    if (movie === null) {
      return res.status(404).json({
        error: "Movie not found.",
      });
    }

    res.status(200).json(movie);
  },
);

// DELETE - Eliminar una película
router.delete(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);

    const deleted = deleteMovie(userId, movieId);

    if (deleted === null) {
      return res.status(404).json({
        error: "Movie not found.",
      });
    }

    res.status(200).json({
      message: "Movie deleted successfully.",
    });
  },
);

export default router;