'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { POST } from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import Credentials from './Credentials';

const RegisterContainer = ({ role }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [disableForm, setDisableForm] = useState(false);

  const registerUser = (values) => {
    setDisableForm(true);
    const payload = {
      email: values.email,
      password: values.password,
      role: role,
    };
    POST('/auth/register', payload)
      ?.then((res) => {
        toast({
          title: 'Success',
          description: res?.data?.message,
        });
        if (res?.data?.redirect_to_verification) {
          router.push(`/${role}/register/verify?email=` + values.email);
        } else {
          router.push(`/`);
        }
      })
      ?.catch((err) => {
        toast({
          title: 'Error',
          description: err?.response?.data?.message,
          variant: 'destructive',
        });
      })
      ?.finally(() => {
        setDisableForm(false);
      });
  };

  return (
    <Credentials
      role={role}
      disableForm={disableForm}
      onSubmit={registerUser}
    />
  );
};

export default RegisterContainer;
