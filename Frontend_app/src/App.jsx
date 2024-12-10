import "./css/App.css";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";
import NavBar from "./components/Navbar";
import Register from "./Register";

function App() {
  const location = useLocation();

  // Define the routes where NavBar should be displayed
  const showNavBar = location.pathname === "/home" || location.pathname === "/favorites";

  return (
    <MovieProvider>
      {showNavBar && <NavBar />}
      <main className="main-content">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/" element={<Register />} />
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;
