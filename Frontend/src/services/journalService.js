import api from './api';

export const journalService = {
  // Get journal data for a challenge
  getJournal: async (challengeId) => {
    const response = await api.get(`/journal/${challengeId}`);
    return response.data; // { 'YYYY-MM-DD': { totalTrades, totalProfit, trades: [] } }
  },
};

export default journalService;
