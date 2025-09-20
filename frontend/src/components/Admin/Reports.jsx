import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function Reports() {
    
  const { auth } = useContext(AuthContext);
  const [period, setPeriod] = useState('daily');
  const [sessionsCount, setSessionsCount] = useState(0);
  const [popularityData, setPopularityData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth) return;

    axios
      .get(`${API_BASE_URL}/reports/sessions?period=${period}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then(res => {
        setSessionsCount(res.data.sessionsPlayed);
      })
      .catch(() => setError('Failed to fetch sessions report'));

    axios
      .get(`${API_BASE_URL}/reports/sports/popularity`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then(res => {
        setPopularityData(res.data);
      })
      .catch(() => setError('Failed to fetch sports popularity'));
  }, [auth, period]);

  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-50 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin Reports</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <label className="block mb-6">
        <span className="text-gray-700 font-medium">Select Period:</span>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="mt-1 block w-48 rounded border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </label>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Number of Sessions Played</h3>
        <p className="text-gray-600">
          For <strong className="text-blue-600">{period}</strong> period: <strong>{sessionsCount}</strong> sessions played
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Sports Popularity Ranking</h3>
        <table className="w-full border border-gray-300 rounded overflow-hidden text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Sport</th>
              <th className="px-4 py-2">Sessions Played</th>
            </tr>
          </thead>
          <tbody>
            {popularityData.length > 0 ? (
              popularityData.map((item, index) => (
                <tr
                  key={item.sport}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.sport}</td>
                  <td className="px-4 py-2">{item.sessions}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
