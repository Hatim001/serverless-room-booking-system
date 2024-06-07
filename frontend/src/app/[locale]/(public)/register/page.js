'use client';

import { useRegisterForm } from '@/hooks/use-register-form';
import React, { Fragment, useState } from 'react';
import Credentials from './components/Credentials';
import SecurityQuestion from './components/SecurityQuestion';
import CaesarCipher from './components/CaesarCipher';

const Register = () => {
  const { mfaType, user } = useRegisterForm();
  console.log('mfaType', mfaType);

  const renderForm = () => {
    switch (mfaType) {
      case 'credentials':
        return <Credentials />;

      case 'securityQuestion':
        return <SecurityQuestion />;

      case 'caesarCipher':
        return <CaesarCipher />;

      default:
        break;
    }
  };

  return <Fragment>{renderForm()}</Fragment>;
};

export default Register;
