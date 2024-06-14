'use client';

import { useRegisterForm } from '@/hooks/use-register-form';
import React, { Fragment, useState } from 'react';
import Credentials from '../../components/register/Credentials';
import SecurityQuestion from '../../components/register/SecurityQuestion';
import CaesarCipher from '../../components/register/CaesarCipher';

const Register = () => {
  const { mfaType, user } = useRegisterForm();

  const renderForm = () => {
    switch (mfaType) {
      case 'credentials':
        return <Credentials role={'user'} />;

      case 'securityQuestion':
        return <SecurityQuestion role={'user'} />;

      case 'caesarCipher':
        return <CaesarCipher role={'user'} />;

      default:
        break;
    }
  };

  return <Fragment>{renderForm()}</Fragment>;
};

export default Register;
