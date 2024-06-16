import { isEmpty } from '@/utils/Helpers';
import { cookies } from 'next/headers';
import { JWT_COOKIE_NAME, JWT_SECRET_KEY } from '@/config';
import { jwtVerify, SignJWT } from 'jose';

const key = new TextEncoder().encode(JWT_SECRET_KEY);

const getSession = async () => {
  const session = cookies().get(JWT_COOKIE_NAME);
  if (isEmpty(session?.value)) {
    return {
      user: {},
      role: 'guest',
    };
  } else {
    return await decryptSession(session?.value);
  }
};

const encryptSession = async (session) => {
  return await new SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(key);
};

const decryptSession = async (token) => {
  const { session } = await jwtVerify(token, key, {
    algorithms: ['HS256'],
  });
  return session;
};

const createSession = async (session) => {
  const token = await encryptSession(session);
  cookies().set({
    name: JWT_COOKIE_NAME,
    value: token,
    httpOnly: true,
    // secure: true,
    sameSite: 'strict',
  });
};

export { getSession, createSession };
