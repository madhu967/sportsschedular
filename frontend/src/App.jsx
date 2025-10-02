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

// Simple Hero Section component
function HeroSection() {
  return (
    <div className="relative bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg mt-10 p-10 flex flex-col md:flex-row items-center justify-between">
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome to Sports Scheduler
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Schedule and manage your sports sessions effortlessly. Admins can track reports and players can create sessions easily.
        </p>
        <div className="space-x-4">
          <a
            href="/signup"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="px-6 py-3 border border-white rounded-md hover:bg-white hover:text-gray-900 font-semibold"
          >
            Login
          </a>
        </div>
      </div>
      
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen bg-gray-100 p-6">
        <Routes>
          <Route
            path="/"
            element={<HeroSection />}
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
