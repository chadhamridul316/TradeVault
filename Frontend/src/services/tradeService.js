import api from './api';

export const tradeService = {
  // Create a trade for an active challenge
  createTrade: async (tradeData) => {
    // tradeData: { challenge_id, pair, tradeType, entryPrice, exitPrice, stopLoss, takeProfit, lotSize }
    const response = await api.post('/trades', tradeData);
    return response.data; // { trade, analytics, challenge }
  },

  // Get all trades for a specific challenge
  getTradesByChallenge: async (challengeId) => {
    const response = await api.get(`/trades/${challengeId}`);
    return response.data; // Array of trade documents
  },

  // Get a single trade by ID
  getSingleTrade: async (id) => {
    const response = await api.get(`/trades/${id}`);
    return response.data;
  },

  // Delete a trade by ID
  deleteTrade: async (id) => {
    const response = await api.delete(`/trades/${id}`);
    return response.data; // { message, trade, challenge }
  },
};

export default tradeService;
