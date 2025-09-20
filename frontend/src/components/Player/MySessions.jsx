import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MySessions() {
  const { auth } = useContext(AuthContext);
  const [createdSessions, setCreatedSessions] = useState([]);
  const [joinedSessions, setJoinedSessions] = useState([]);
  const [error, setError] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSessions = async () => {
    try {
      const createdRes = await axios.get(`${API_BASE_URL}/sessions?mine=true`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const joinedRes = await axios.get(`${API_BASE_URL}/sessions?joined=true`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setCreatedSessions(createdRes.data);
      setJoinedSessions(joinedRes.data);
    } catch {
      setError('Failed to load sessions');
    }
  };

  useEffect(() => {
    if (!auth) return;
    fetchSessions();
  }, [auth]);

  const cancelSession = async () => {
    if (!selectedSessionId) return;
    if (!cancelReason.trim()) {
      setError('Please provide a cancellation reason');
      return;
    }
    setError('');
    setSuccessMsg('');
    try {
      await axios.put(
        `${API_BASE_URL}/sessions/${selectedSessionId}/cancel`, // ✅ FIXED
        { reason: cancelReason },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setSuccessMsg('Session cancelled successfully');
      setCancelReason('');
      setSelectedSessionId(null); // ✅ Auto-close modal
      fetchSessions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to cancel session'
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">My Sessions</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

      {/* Created Sessions */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Sessions I Created</h3>
        {createdSessions.length === 0 ? (
          <p className="text-gray-600">No created sessions</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full border border-gray-300 rounded table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2">Sport</th>
                  <th className="px-4 py-2">Teams</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Venue</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Cancel</th>
                </tr>
              </thead>
              <tbody>
                {createdSessions.map(session => (
                  <tr
                    key={session._id}
                    className={session.status === 'cancelled' ? 'line-through bg-gray-100' : 'bg-white'}
                  >
                    <td className="border px-4 py-2">{session.sport.name}</td>
                    <td className="border px-4 py-2">{session.teamNames.join(' vs ')}</td>
                    <td className="border px-4 py-2">{new Date(session.date).toLocaleString()}</td>
                    <td className="border px-4 py-2">{session.venue}</td>
                    <td className="border px-4 py-2 capitalize">{session.status}</td>
                    <td className="border px-4 py-2">
                      {session.status !== 'cancelled' ? (
                        <button
                          onClick={() => setSelectedSessionId(session._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      ) : (
                        <small>Reason: {session.cancelReason}</small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Cancel Modal */}
      {selectedSessionId && (
        <section className="mb-10 p-4 bg-gray-50 rounded shadow">
          <h4 className="text-lg font-semibold mb-2">Cancel Session Reason</h4>
          <textarea
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
            placeholder="Enter reason for cancellation"
            rows={3}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-4">
            <button
              onClick={cancelSession}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors mr-3 cursor-pointer"
            >
              Confirm Cancel
            </button>
            <button
              onClick={() => setSelectedSessionId(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </section>
      )}

      {/* Joined Sessions */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Sessions I Joined</h3>
        {joinedSessions.length === 0 ? (
          <p className="text-gray-600">No joined sessions</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full border border-gray-300 rounded table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2">Sport</th>
                  <th className="px-4 py-2">Teams</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Venue</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {joinedSessions.map(session => (
                  <tr
                    key={session._id}
                    className={session.status === 'cancelled' ? 'line-through bg-gray-100' : 'bg-white'}
                  >
                    <td className="border px-4 py-2">{session.sport.name}</td>
                    <td className="border px-4 py-2">{session.teamNames.join(' vs ')}</td>
                    <td className="border px-4 py-2">{new Date(session.date).toLocaleString()}</td>
                    <td className="border px-4 py-2">{session.venue}</td>
                    <td className="border px-4 py-2 capitalize">{session.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
