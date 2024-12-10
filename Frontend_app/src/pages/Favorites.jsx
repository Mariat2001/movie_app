import "../css/Favorites.css";
import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function fetchFavorites() {
      const token = localStorage.getItem("token"); // Get the token from localStorage
  
      try {
        const response = await fetch("http://localhost:8082/favorites", {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the header
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setFavorites(data || []); // Ensure it sets an empty array if the response is empty
        } else {
          console.error(`Failed to fetch favorites: ${response.status}`);
          setFavorites([]); // Fallback to an empty array on error
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]); // Fallback to an empty array on error
      }
    }
  
    fetchFavorites();
  }, []);
  

  const removeFromFavorites = async (movie) => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
  
    try {
      const response = await fetch("http://localhost:8082/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send the token in the header
        },
        body: JSON.stringify({ movieId: movie.id }), // Only send movieId
      });
  
      if (response.ok) {
        // Update the state to remove the movie from the list
        setFavorites((prevFavorites) =>
          prevFavorites.filter((favMovie) => favMovie.id !== movie.id)
        );
      } else {
        console.error(`Failed to remove from favorites: ${response.status}`);
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };
  

  return (
    <div className="favorites">
      {favorites.length > 0 ? (
        <>
          <h2>Your Favorites</h2>
          <div className="movies-grid">
            {favorites.map((movie) => (
              <MovieCard
                movie={movie}
                key={movie.id}
                setFavorites={setFavorites}
                favorite={true} // Movie is known to be a favorite
                onRemove={removeFromFavorites} // Pass the remove function
              />
            ))}
          </div>
        </>
      ) : (
        <div className="favorites-empty">
          <h2>No Favorite Movies Yet</h2>
          <p>Start adding movies to your favorites and they will appear here!</p>
        </div>
      )}
    </div>
  );
}

export default Favorites;
