import "../css/MovieCard.css";
import { useState, useEffect } from "react";

function MovieCard({ movie, setFavorites, favorite: isFavoriteFromProps, onRemove }) {
  const [favorite, setFavorite] = useState(isFavoriteFromProps || false);

  // Sync local `favorite` state with `isFavoriteFromProps`
  useEffect(() => {
    setFavorite(isFavoriteFromProps);
  }, [isFavoriteFromProps]);

  const addToFavorites = async () => {
    const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage
  
    try {
      const body = {
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        status: true,
      };
      const response = await fetch("http://localhost:8082/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        setFavorite(true); // Update local state immediately
      } else {
        console.error(`Failed to add to favorites: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };
  

  const onFavoriteClick = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage
  
    if (favorite) {
      // Attempt to remove favorite
      try {
        const body = {
          movieId: movie.id,
        };
        const response = await fetch("http://localhost:8082/favoritesHome", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(body),
        });
  
        if (response.ok) {
          // Update local state immediately
          setFavorite(false);
          // Call the onRemove prop to trigger any parent component updates
          onRemove(movie);
        } else {
          console.error(`Failed to remove from favorites: ${response.status}`);
        }
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    } else {
      addToFavorites();
    }
  };
  

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-overlay">
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={onFavoriteClick}
          >
            ♥
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split("-")[0]}</p>
      </div>
    </div>
  );
}

export default MovieCard;