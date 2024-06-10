'use client';

import { createContext, useContext, useState } from 'react';

const LoginFormContext = createContext();

export const LoginFormProvider = ({ children }) => {
  const [mfaType, setMfaType] = useState('credentials');
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  return (
    <LoginFormContext.Provider
      value={{ user, setUser, mfaType, setMfaType }}
    >
      {children}
    </LoginFormContext.Provider>
  );
};

export const useLoginForm = () => {
  return useContext(LoginFormContext);
};
