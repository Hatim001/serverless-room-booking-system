import Header from '@/components/layouts/Header';
import { redirect } from 'next/navigation';
import React from 'react';

const PublicLayout = ({ children }) => {
  const routes = [
    {
      label: 'Rooms',
      path: '/rooms',
    },
    {
      label: 'Login',
      path: '/login',
    },
    {
      label: 'Register',
      path: '/register',
    },
  ];

  return (
    <main className="w-3/4 mx-auto">
      <Header routes={routes} />
      {children}
    </main>
  );
};

export default PublicLayout;
