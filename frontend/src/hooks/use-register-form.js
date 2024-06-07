'use client';

import { createContext, useContext, useState } from 'react';

const RegisterFormContext = createContext();

export const RegisterFormProvider = ({ children }) => {
  const [mfaType, setMfaType] = useState('credentials');
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  return (
    <RegisterFormContext.Provider
      value={{ user, setUser, mfaType, setMfaType }}
    >
      {children}
    </RegisterFormContext.Provider>
  );
};

export const useRegisterForm = () => {
  return useContext(RegisterFormContext);
};
