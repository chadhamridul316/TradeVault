import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/user/login', { email, password });
    return response.data; // { email, token }
  },

  signup: async (email, password) => {
    const response = await api.post('/user/signup', { email, password });
    return response.data; // { email, token }
  },
};

export default authService;
