'use client';

import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import { useAuth } from '@/hooks/use-auth';
import { GUEST_ROUTES, AGENT_ROUTES, USER_ROUTES } from '@/utils/constants';
import React, { useEffect, useState } from 'react';

const PublicLayout = ({ children, params }) => {
  const [routes, setRoutes] = useState(GUEST_ROUTES);
  const { session, prepareSession } = useAuth();

  useEffect(() => {
    prepareSession();
  }, []);

  useEffect(() => {
    prepareRoutes();
  }, [session]);

  const prepareRoutes = () => {
    let role = session?.role;
    if (role === 'guest') {
      setRoutes(GUEST_ROUTES);
    } else if (role === 'user') {
      setRoutes(USER_ROUTES);
    } else if (role === 'agent') {
      setRoutes(AGENT_ROUTES);
    }
  };

  return (
    <div className="lg:w-3/4 m-auto flex flex-col min-h-screen sm:w-full sm:px-5">
      <Header routes={routes} />
      <main className="flex-grow min-h-full min-w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
