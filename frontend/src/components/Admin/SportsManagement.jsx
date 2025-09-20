import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SportsManagement() {
  const { auth } = useContext(AuthContext);
  const [sports, setSports] = useState([]);
  const [newSport, setNewSport] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/sports`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      })
      .then(res => {
        setSports(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load sports');
        setLoading(false);
      });
  }, [auth]);

  const addSport = async () => {
    if (!newSport.trim()) {
      setError('Please enter a sport name');
      return;
    }
    setError('');
    try {
      const res = await axios.post(
        `${API_BASE_URL}/sports`,
        { name: newSport },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setSports([...sports, res.data]);
      setNewSport('');
    } catch {
      setError('Error adding sport');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Sports</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          value={newSport}
          onChange={e => setNewSport(e.target.value)}
          placeholder="New sport"
          className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addSport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Sport
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading sports...</p>
      ) : sports.length === 0 ? (
        <p className="text-gray-500">No sports available</p>
      ) : (
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {sports.map(sport => (
            <li key={sport._id}>{sport.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
