import api from './api';

export const challengeService = {
  // Create a new challenge
  createChallenge: async (accountSize) => {
    const response = await api.post('/challenges', { accountSize: Number(accountSize) });
    return response.data;
  },

  // Get challenge by ID
  getChallengeById: async (id) => {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
  },

  // Start a challenge
  startChallenge: async (id) => {
    const response = await api.patch(`/challenges/${id}/start`);
    return response.data;
  },

  // Get all challenges for the logged-in user
  getUserChallenges: async () => {
    const response = await api.get('/challenges');
    return response.data;
  },
};

export default challengeService;
