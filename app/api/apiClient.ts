import axios from 'axios';
import ApiRoutes from './apiRoutes';

export const API = axios.create({
  baseURL: ApiRoutes.BASE_URL,
});

export const userService = {
  authenticate: async (email: string, password: string) => {
    try {
      const response = await API.post(ApiRoutes.LOGIN, { email, password });

      const { data, success, message, token } = response.data;
      if (success)
        return { ...data, token: token } as {
          id: string;
          email: string;
          name: string;
          role: string;
          token: string;
        };

      console.error('Authentication failed:', message);
      return null;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('NextAuth login error:', errorMsg);
      return null;
    }
  },
};
