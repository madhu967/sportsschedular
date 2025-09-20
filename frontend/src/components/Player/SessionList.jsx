import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SessionList() {
  const { auth } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch sessions
  useEffect(() => {
    if (!auth) return;
    axios
      .get(`${API_BASE_URL}/sessions`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then(res =>
        setSessions(
          res.data
            .filter(s => s.status === 'active')
            .sort((a, b) => new Date(a.date) - new Date(b.date))
        )
      )
      .catch(() => setError('Failed to load sessions'));
  }, [auth]);

  // Join session
  const joinSession = async sessionId => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await axios.post(
        `${API_BASE_URL}/sessions/${sessionId}/join`,
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setSessions(prev =>
        prev.map(s => (s._id === sessionId ? res.data : s))
      );
      setSuccessMsg('Joined session successfully');
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to join session'
      );
    }
  };

  // Cancel session (creator only)
  const cancelSession = async sessionId => {
    const reason = prompt('Enter reason for cancelling:');
    if (!reason) return;
    try {
      const res = await axios.put(
        `${API_BASE_URL}/sessions/${sessionId}/cancel`,
        { reason },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setSessions(prev =>
        prev.map(s => (s._id === sessionId ? res.data : s))
      );
      setSuccessMsg('Session cancelled successfully');
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to cancel session'
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Available Sport Sessions
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

      {sessions.length === 0 ? (
        <p className="text-gray-600">No active sessions available</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full border border-gray-300 rounded table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2">Sport</th>
                <th className="px-4 py-2">Teams</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Venue</th>
                <th className="px-4 py-2">Players Joined</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => {
                const isPast = new Date(session.date) < new Date();
                const alreadyJoined = session.players.some(
                  p => p._id === auth?.userId
                );
                const isCreator = session.createdBy === auth?.userId;

                return (
                  <tr
                    key={session._id}
                    className="bg-white even:bg-gray-100"
                  >
                    <td className="border px-4 py-2">{session.sport.name}</td>
                    <td className="border px-4 py-2">
                      {session.teamNames.join(' vs ')}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(session.date).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(session.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="border px-4 py-2">{session.venue}</td>
                    <td className="border px-4 py-2">
                      {session.players.length}
                    </td>
                    <td className="border px-4 py-2">
                      {isCreator ? (
                        <button
                          onClick={() => cancelSession(session._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      ) : isPast ? (
                        <span className="text-gray-500">Expired</span>
                      ) : alreadyJoined ? (
                        <span className="text-green-700 font-medium">
                          Joined
                        </span>
                      ) : (
                        <button
                          onClick={() => joinSession(session._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors cursor-pointer"
                        >
                          Join
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
