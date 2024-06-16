'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Credentials from './Credentials';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

const LoginContainer = ({ role }) => {
  const { toast } = useToast();
  const router = useRouter();
  const { refreshSession } = useAuth();
  const [disableForm, setDisableForm] = useState(false);

  const loginUser = async (values) => {
    setDisableForm(true);
    const payload = {
      email: values.email,
      password: values.password,
      role: role,
    };
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Success',
          description: data.message,
        });
        refreshSession();
        router.push(data.redirectUrl);
      } else {
        toast({
          title: 'Error',
          description: data.message,
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setDisableForm(false);
    }
  };

  return (
    <Credentials role={role} disableForm={disableForm} onSubmit={loginUser} />
  );
};

export default LoginContainer;
