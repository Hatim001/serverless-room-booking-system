'use client';

import { useRegisterForm } from '@/hooks/use-register-form';
import React, { useState } from 'react';
import Credentials from '../../components/register/Credentials';
import { POST } from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { redirect, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const Register = () => {
  const { toast } = useToast();
  const { updateSession } = useAuth();
  const router = useRouter();
  const { mfaType, user } = useRegisterForm();
  const [disableForm, setDisableForm] = useState(false);

  const registerUser = (values) => {
    setDisableForm(true);
    const payload = {
      email: values.email,
      password: values.password,
      role: 'user',
    };
    router.push('/user/register/verify?email=' + values.email);
    // POST('/auth/register/credentials', payload)
    //   ?.then((res) => {
    //     toast({
    //       title: 'Success',
    //       description: res?.data?.message,
    //     });
    //     redirect('/user/register/verify');
    //   })
    //   ?.catch((err) => {
    //     toast({
    //       title: 'Error',
    //       description: err?.response?.data?.message,
    //       variant: 'destructive',
    //     });
    //   })
    //   ?.finally(() => {
    //     setDisableForm(false);
    //   });
  };

  return (
    <Credentials
      role={'user'}
      disableForm={disableForm}
      onSubmit={registerUser}
    />
  );
};

export default Register;
