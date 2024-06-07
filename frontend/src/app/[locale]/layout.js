'use client';

import Header from '@/components/layouts/Header';
import { useAuth } from '@/hooks/use-auth';
import { GUEST_ROUTES, AGENT_ROUTES, USER_ROUTES } from '@/utils/constants';
import React, { useEffect, useState } from 'react';

const PublicLayout = ({ children, params }) => {
  const [routes, setRoutes] = useState(GUEST_ROUTES);
  const { session, prepareSession, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!session) {
      prepareSession();
    }
  }, [prepareSession, session]);

  useEffect(() => {
    prepareRoutes();
  }, [session]);

  const prepareRoutes = () => {
    let role = session?.user?.role;
    if (role === 'guest') {
      setRoutes(GUEST_ROUTES);
    } else if (role === 'user') {
      setRoutes(USER_ROUTES);
    } else if (role === 'agent') {
      setRoutes(AGENT_ROUTES);
    }
  };

  return (
    <div className="w-3/4 m-auto flex flex-col min-h-screen">
      <Header routes={routes} />
      <main className="flex-grow min-h-full min-w-full">{children}</main>
    </div>
  );
};

export default PublicLayout;
