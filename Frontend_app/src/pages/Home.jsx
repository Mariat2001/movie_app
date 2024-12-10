import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css";

function Home() {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const loadPopularMovies = async () => {
    try {
      const popularMovies = await getPopularMovies();
      const moviesWithFavorites = await addFavoriteStatus(popularMovies);
      setMovies(moviesWithFavorites);
    } catch (err) {
      console.log(err);
      setError("Failed to load movies...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPopularMovies();
  }, []);

  const fetchFavoriteStatus = async (movieId) => {
    const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage
  
    try {
      const response = await fetch(`http://localhost:8082/favorites/${movieId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.status; // true or false
      } else {
        console.error(`Failed to fetch favorite status: ${response.status}`);
        return false;
      }
    } catch (err) {
      console.error("Error fetching favorite status:", err);
      return false;
    }
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    try {
      const searchResults = await searchMovies(searchQuery);
      const moviesWithFavorites = await addFavoriteStatus(searchResults);
      setMovies(moviesWithFavorites);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to search movies...");
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (movie) => {
    const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage
  
    try {
      const response = await fetch("http://localhost:8082/favoritesHome", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({ movieId: movie.id }), // Only send movieId
      });
  
      if (response.ok) {
        // Reload movies after removing a favorite
        await loadPopularMovies();
      } else {
        console.error(`Failed to remove from favorites: ${response.status}`);
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };
  
  

  const addFavoriteStatus = async (movies) => {
    const updatedMovies = await Promise.all(
      movies.map(async (movie) => {
        const isFavorite = await fetchFavoriteStatus(movie.id);
        return { ...movie, isFavorite };
      })
    );
    return updatedMovies;
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard
              movie={movie}
              key={movie.id}
              setFavorites={setFavorites}
              favorite={movie.isFavorite} // Dynamic favorite status
              onRemove={removeFromFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
