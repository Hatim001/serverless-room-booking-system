'use client';

import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import { useAuth } from '@/hooks/use-auth';
import { GUEST_ROUTES, AGENT_ROUTES, USER_ROUTES } from '@/utils/constants';
import React, { useEffect, useState } from 'react';
import ChatBot from '@/components/VirtualBot/ChatBot';

const PublicLayout = ({ children, params }) => {
  const [routes, setRoutes] = useState(GUEST_ROUTES);
  const { session, prepareSession } = useAuth();

  console.log(
    'NEXT_PUBLIC_GCP_PROJECT_ID',
    process.env.NEXT_PUBLIC_GCP_PROJECT_ID,
  );
  console.log(
    'NEXT_PUBLIC_GOOGLE_DIALOGFLOW_AGENT_ID',
    process.env.NEXT_PUBLIC_GOOGLE_DIALOGFLOW_AGENT_ID,
  );
  console.log(
    'NEXT_PUBLIC_GOOGLE_SERVICE_EMAIL',
    process.env.NEXT_PUBLIC_GOOGLE_SERVICE_EMAIL,
  );
  console.log(
    'NEXT_PUBLIC_GOOGLE_SERVICE_PRIVATE_KEY',
    process.env.NEXT_PUBLIC_GOOGLE_SERVICE_PRIVATE_KEY,
  );
  console.log(
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  );
  console.log(
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  );
  console.log(
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  );
  console.log(
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  );
  console.log(
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDERID',
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDERID,
  );
  console.log(
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  );
  console.log('JWT_SECRET_KEY', process.env.JWT_SECRET_KEY);
  console.log('NEXT_PUBLIC_BACKEND_URL', process.env.NEXT_PUBLIC_BACKEND_URL);

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
    <div className="lg:w-3/4 m-auto flex flex-col justify-between h-screen">
      <div className="">
        <Header routes={routes} />
      </div>
      <main className="flex-grow overflow-auto py-2 no-scrollbar">
        {children}
      </main>
      <ChatBot session={session} />
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;
