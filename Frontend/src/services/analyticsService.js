import api from './api';

export const analyticsService = {
  // Get calculated analytics for a challenge
  getAnalytics: async (challengeId) => {
    const response = await api.get(`/analytics/${challengeId}`);
    return response.data; // { totalTrades, totalLots, winRate, averageRR, balance, equity }
  },
};

export default analyticsService;
