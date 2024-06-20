'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

const Index = () => {
  const { logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    logoutUser();
  }, []);

  const logoutUser = async () => {
    await logout();
    router.push('/');
  };

  return <div>Logging out....</div>;
};

export default Index;
