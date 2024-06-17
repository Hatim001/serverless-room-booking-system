import { handleError, handleSuccess } from '@/lib/response';
import { removeSession } from '@/lib/session';

export const DELETE = async (request) => {
  try {
    removeSession();
    // call an api to delete the session
    return handleSuccess({ message: 'Logged out successfully' });
  } catch (error) {
    return handleError({ message: error?.response?.data?.message });
  }
};
