import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async e => {
    e.preventDefault();
    setErr('');
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      setAuth({ token: res.data.token, role: res.data.role, name: res.data.name });
      navigate('/');
    } catch {
      setErr('Login failed. Check your email and password.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-gray-50 p-8 rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>
      {err && <p className="text-red-600 mb-4">{err}</p>}
      <form onSubmit={submit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}
