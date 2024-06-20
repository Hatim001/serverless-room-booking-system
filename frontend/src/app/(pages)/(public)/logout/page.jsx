'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { redirect } from 'next/navigation';

const Index = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logoutUser();
  }, []);

  const logoutUser = async () => {
    await logout();
    redirect('/');
  };

  return <div>Logging out....</div>;
};

export default Index;
