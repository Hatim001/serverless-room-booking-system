'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

const Index = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, []);
  return <div>Logging out....</div>;
};

export default Index;
