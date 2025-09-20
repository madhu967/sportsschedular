import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

import SportsManagement from './components/Admin/SportsManagement';
import Reports from './components/Admin/Reports';

import CreateSession from './components/Player/CreateSession';
import SessionList from './components/Player/SessionList';
import MySessions from './components/Player/MySessions';

function RequireAuth({ children, role }) {
  const { auth } = useContext(AuthContext);

  if (!auth) return <Navigate to="/login" replace />;
  if (role && auth.role !== role) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen bg-gray-100 p-6">
        <Routes>
          <Route
            path="/"
            element={
              <div className="text-center mt-20 text-3xl font-semibold text-gray-800">
                Welcome to Sports Scheduler
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin routes */}
          <Route
            path="/admin/sports"
            element={
              <RequireAuth role="admin">
                <SportsManagement />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <RequireAuth role="admin">
                <Reports />
              </RequireAuth>
            }
          />

          {/* Player routes */}
          <Route
            path="/player/create-session"
            element={
              <RequireAuth role="player">
                <CreateSession />
              </RequireAuth>
            }
          />
          <Route
            path="/player/sessions"
            element={
              <RequireAuth role="player">
                <SessionList />
              </RequireAuth>
            }
          />
          <Route
            path="/player/my-sessions"
            element={
              <RequireAuth role="player">
                <MySessions />
              </RequireAuth>
            }
          />

          {/* Fallback route */}
          <Route
            path="*"
            element={
              <div className="text-center mt-20 text-2xl font-semibold text-red-600">
                Page Not Found
              </div>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}
