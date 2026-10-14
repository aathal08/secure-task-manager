import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">SecureTask</Link>
      <div className="nav-links">
        {user ? <>
          <span className="nav-user">{user.name}</span>
          <button onClick={handleLogout} className="btn-link">Log out</button>
        </> : <>
          <Link to="/login">Log in</Link>
          <Link to="/register">Sign up</Link>
        </>}
      </div>
    </nav>
  );
}