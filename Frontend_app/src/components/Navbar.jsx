import { Link,useNavigate } from "react-router-dom";
import "../css/Navbar.css"

function NavBar() {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/"); // Redirect to login after logout
    };
    return <nav className="navbar">
        <div className="navbar-brand">
            <Link >Movie App</Link>
        </div>
        <div className="navbar-links">
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/favorites" className="nav-link">Favorites</Link>
            <button style={{marginTop:'5px'}} className="nav-link logout-button" onClick={handleLogout}>
              Logout
            </button>
        </div>
    </nav>
}

export default NavBar