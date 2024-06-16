import { getSession } from '@/lib/session';
import { cookies } from 'next/headers';

export const GET = async (req) => {
  const session = await getSession();

  return Response.json(session, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
