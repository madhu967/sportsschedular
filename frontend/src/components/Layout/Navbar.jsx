import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Navbar() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    setAuth(null);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      {/* Left side - Home Link */}
      <div>
        <Link to="/" className="text-xl font-semibold hover:text-yellow-400 transition-colors">
          Home
        </Link>
      </div>

      {/* Right side - Navigation Links */}
      <div className="flex items-center space-x-6">
        {!auth && (
          <>
            <Link
              to="/login"
              className="hover:text-yellow-400 transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:text-yellow-400 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </>
        )}

        {auth && auth.role === 'admin' && (
          <>
            <Link
              to="/admin/sports"
              className="hover:text-yellow-400 transition-colors font-medium"
            >
              Manage Sports
            </Link>
            <Link
              to="/admin/reports"
              className="hover:text-yellow-400 transition-colors font-medium"
            >
              Reports
            </Link>
            <button
              onClick={logout}
              className="bg-yellow-400 text-blue-800 font-semibold px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
              title="Logout"
            >
              Logout ({auth.name})
            </button>
          </>
        )}

        {auth && auth.role === 'player' && (
          <>
            <Link
              to="/player/create-session"
              className="hover:text-yellow-400 transition-colors font-medium"
            >
              Create Session
            </Link>
            <Link
              to="/player/sessions"
              className="hover:text-yellow-400 transition-colors font-medium"
            >
              Browse Sessions
            </Link>
            <Link
              to="/player/my-sessions"
              className="hover:text-yellow-400 transition-colors font-medium"
            >
              My Sessions
            </Link>
            <button
              onClick={logout}
              className="bg-yellow-400 text-blue-800 font-semibold px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
              title="Logout"
            >
              Logout ({auth.name})
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
