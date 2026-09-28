import React, { useState, useEffect } from 'react';
import { useChallenge } from '../context/ChallengeContext';
import { TradeForm } from '../components/trades/TradeForm';
import { TradeTable } from '../components/trades/TradeTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import tradeService from '../services/tradeService';
import { Shield, Play, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const TradesPage = () => {
  const { currentChallenge, refreshChallenge } = useChallenge();
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrades = async () => {
    if (!currentChallenge?._id) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await tradeService.getTradesByChallenge(currentChallenge._id);
      // Sort newest first
      const sorted = (data || []).sort(
        (a, b) => new Date(b.tradeDate || b.createdAt) - new Date(a.tradeDate || a.createdAt)
      );
      setTrades(sorted);
    } catch (err) {
      console.error('Failed to fetch trades:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [currentChallenge?._id]);

  const handleTradeCreated = async (result) => {
    // Add trade to list and refresh challenge
    if (result.trade) {
      setTrades((prev) => [result.trade, ...prev]);
    } else {
      fetchTrades();
    }
    refreshChallenge();
  };

  const handleTradeDeleted = async (deletedTradeId) => {
    setTrades((prev) => prev.filter((t) => t._id !== deletedTradeId));
    refreshChallenge();
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" text="Loading Trade Terminal..." />
      </div>
    );
  }

  if (!currentChallenge) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <Card padding="p-8">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 font-mono">No Active Challenge</h2>
          <p className="text-sm text-slate-500 mb-6">
            Please choose and start a challenge account before accessing the trade execution terminal.
          </p>
          <Link to="/challenges">
            <Button variant="aurora" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Choose Your Challenge
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (currentChallenge.status === 'Not-Started') {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <Card padding="p-8" glow glowColor="cyan">
          <Play className="w-12 h-12 text-blue-600 mx-auto mb-3 fill-current" />
          <h2 className="text-xl font-bold text-slate-900 font-mono">
            {formatCurrency(currentChallenge.accountSize, 0)} Challenge Not Started
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            You must start your challenge on the Rules page before you can place simulated trades.
          </p>
          <Link to={`/challenges/${currentChallenge._id}/rules`}>
            <Button variant="primary" size="lg" leftIcon={<Play className="w-4 h-4 fill-current" />}>
              Start Challenge
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Trade Execution Form */}
      <TradeForm onTradeCreated={handleTradeCreated} />

      {/* Trade History Table */}
      <TradeTable
        trades={trades}
        isLoading={false}
        onTradeDeleted={handleTradeDeleted}
      />
    </div>
  );
};

export default TradesPage;

