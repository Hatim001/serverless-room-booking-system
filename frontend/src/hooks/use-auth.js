'use client';

import { isEmpty } from '@/utils/Helpers';
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  const prepareSession = () => {
    console.log('session api called');
    let defaultSession = {
      user: {
        role: 'guest',
      },
    };
    return setSession(defaultSession);
  };

  const isAuthenticated = () => {
    return !isEmpty(session);
  };

  return (
    <AuthContext.Provider
      value={{ session, setSession, prepareSession, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
