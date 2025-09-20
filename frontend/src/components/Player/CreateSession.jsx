import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreateSession() {
  const { auth } = useContext(AuthContext);
  const [sports, setSports] = useState([]);
  const [sportId, setSportId] = useState('');
  const [teamNames, setTeamNames] = useState(['', '']); // example 2 teams
  const [additionalPlayers, setAdditionalPlayers] = useState(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/sports`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then(res => {
        setSports(res.data);
        if (res.data.length > 0) setSportId(res.data[0]._id);
      })
      .catch(() => setError('Failed to load sports'));
  }, [auth]);

  const handleTeamNameChange = (index, value) => {
    const newTeams = [...teamNames];
    newTeams[index] = value;
    setTeamNames(newTeams);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!sportId || !date || !time || !venue || teamNames.some(t => !t)) {
      setError('Please fill all required fields');
      return;
    }
    try {
      const sessionDate = new Date(`${date}T${time}`);
      await axios.post(
        `${API_BASE_URL}/sessions`,
        {
          sport: sportId,
          teamNames,
          additionalPlayersRequired: additionalPlayers,
          date: sessionDate,
          venue,
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setSuccessMsg('Session created successfully');
      setTeamNames(['', '']);
      setAdditionalPlayers(0);
      setDate('');
      setTime('');
      setVenue('');
    } catch {
      setError('Failed to create session');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-50 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Sport Session</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Sport:</label>
          <select
            value={sportId}
            onChange={e => setSportId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sports.map(s => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {teamNames.map((team, idx) => (
          <div key={idx}>
            <label className="block mb-1 font-medium text-gray-700">Team {idx + 1} Name:</label>
            <input
              type="text"
              value={team}
              onChange={e => handleTeamNameChange(idx, e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium text-gray-700">Additional players required:</label>
          <input
            type="number"
            min="0"
            value={additionalPlayers}
            onChange={e => setAdditionalPlayers(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Date:</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Time:</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Venue:</label>
          <input
            type="text"
            value={venue}
            onChange={e => setVenue(e.target.value)}
            placeholder="Venue"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
        >
          Create Session
        </button>
      </form>
    </div>
  );
}
