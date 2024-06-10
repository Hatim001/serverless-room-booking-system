'use client';

import { useLoginForm } from '@/hooks/use-login-form';
import React, { Fragment, useState } from 'react';
import Credentials from './components/Credentials';
import SecurityQuestion from './components/SecurityQuestion';
import CaesarCipher from './components/CaesarCipher';

const Register = () => {
  const { mfaType, user } = useLoginForm();

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
