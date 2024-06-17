'use client';

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  const prepareSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      return setSession(data?.session);
    } catch (err) {
      return setSession({
        user: {},
        role: 'guest',
      });
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'DELETE',
    });
    await prepareSession();
  };

  const refreshSession = () => {
    prepareSession();
  };

  const isAuthenticatedUser = () => {
    return session?.role === 'user';
  };

  const isAuthenticatedAgent = () => {
    return session?.role === 'agent';
  };

  return (
    <AuthContext.Provider
      value={{
        logout,
        session,
        setSession,
        prepareSession,
        refreshSession,
        isAuthenticatedUser,
        isAuthenticatedAgent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
