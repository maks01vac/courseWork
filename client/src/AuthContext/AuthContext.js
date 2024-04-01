import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    userId: null
  });

  const login = (userData, userId) => {
    setAuthState({
      isAuthenticated: true,
      user: userData,
      userId: userId
    });
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      userId: null
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);