'use client';

import { useLoginForm } from '@/hooks/use-login-form';
import React, { Fragment } from 'react';
import Credentials from '../../components/login/Credentials';
import SecurityQuestion from '../../components/login/SecurityQuestion';
import CaesarCipher from '../../components/login/CaesarCipher';

const Login = () => {
  const { mfaType, user } = useLoginForm();

  const renderForm = () => {
    switch (mfaType) {
      case 'credentials':
        return <Credentials role={'agent'} />;

      case 'securityQuestion':
        return <SecurityQuestion role={'agent'} />;

      case 'caesarCipher':
        return <CaesarCipher role={'agent'} />;

      default:
        break;
    }
  };

  return <Fragment>{renderForm()}</Fragment>;
};

export default Login;
