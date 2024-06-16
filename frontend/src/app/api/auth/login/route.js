import { axios } from '@/lib/axios';
import { createSession } from '@/lib/session';

export const POST = async (request) => {
  try {
    const payload = await request.json();
    const { email, password, role } = payload;
    const res = await axios.post('/auth/login', payload);
    const data = res?.data;
    let defaultSession = {
      user: {},
      role: 'guest',
    };
    let redirectUrl;
    let session = data?.session;
    if (data?.redirect_to_verification) {
      session = defaultSession;
      redirectUrl = `/${role}/register/verify?email=` + email``;
    } else if (!data?.isMFAConfigured) {
      redirectUrl = `/${role}/register/mfa-setup?email=${email}`;
    } else {
      redirectUrl = `/${role}/login/mfa-verify`;
    }

    createSession(session);
    return new Response(
      JSON.stringify({
        message: data?.message,
        redirectUrl,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: err?.response?.data?.message || 'Internal Server Error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
};
