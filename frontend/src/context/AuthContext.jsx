import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    return token ? { token, role, name } : null;
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem('token', auth.token);
      localStorage.setItem('role', auth.role);
      localStorage.setItem('name', auth.name);
      axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
    } else {
      localStorage.clear();
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [auth]);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};
