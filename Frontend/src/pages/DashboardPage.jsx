import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useChallenge } from '../context/ChallengeContext';
import { StatCard } from '../components/common/StatCard';
import { PerformanceChart } from '../components/analytics/PerformanceChart';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { TradeTable } from '../components/trades/TradeTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatCurrency, formatPercent, formatPnL } from '../utils/formatters';
import tradeService from '../services/tradeService';
import analyticsService from '../services/analyticsService';
import {
  Wallet,
  Coins,
  TrendingUp,
  Percent,
  Layers,
  Scale,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  Play,
  ArrowUpRight,
} from 'lucide-react';

export const DashboardPage = () => {
  const { currentChallenge, refreshChallenge } = useChallenge();
  const [trades, setTrades] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentChallenge?._id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [tradesData, analyticsData] = await Promise.allSettled([
          tradeService.getTradesByChallenge(currentChallenge._id),
          analyticsService.getAnalytics(currentChallenge._id),
        ]);

        if (tradesData.status === 'fulfilled') {
          setTrades(tradesData.value || []);
        }
        if (analyticsData.status === 'fulfilled') {
          setAnalytics(analyticsData.value);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [currentChallenge?._id]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" text="Loading Trading Dashboard..." />
      </div>
    );
  }

  // If no challenge created yet
  if (!currentChallenge) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <Card padding="p-8">
          <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 font-mono">Welcome to TradeVault</h2>
          <p className="text-sm text-slate-500 mb-6">
            Get started by selecting your simulated funded-account challenge tier.
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

  // If challenge is not started
  if (currentChallenge.status === 'Not-Started') {
    return (
      <div className="py-12 max-w-2xl mx-auto text-center space-y-6">
        <Card padding="p-8" glow glowColor="cyan">
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 w-fit mx-auto mb-4">
            <Play className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-mono">
            {formatCurrency(currentChallenge.accountSize, 0)} Challenge Ready
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 mb-6">
            Your simulated challenge account has been created. Review evaluation rules and click Start Challenge to activate your terminal.
          </p>
          <div className="flex justify-center gap-4">
            <Link to={`/challenges/${currentChallenge._id}/rules`}>
              <Button variant="primary" size="lg" leftIcon={<Play className="w-4 h-4 fill-current" />}>
                Review Rules & Start Challenge
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const currentStep = currentChallenge.currentStep || 1;
  const currentStepTrades = trades.filter((t) => (t.step || 1) === currentStep);

  const accountSize = currentChallenge.accountSize || 10000;
  const calculatedStepBalance = currentStepTrades.reduce((sum, t) => sum + (t.result || 0), accountSize);
  const balance = analytics?.balance ?? currentChallenge.balance ?? calculatedStepBalance;
  const equity = analytics?.equity ?? currentChallenge.equity ?? balance;
  const profit = balance - accountSize;
  const profitPercent = accountSize > 0 ? (profit / accountSize) * 100 : 0;
  const winRate = analytics?.winRate ?? currentChallenge.winRate ?? 0;
  const totalTrades = analytics?.totalTrades ?? currentChallenge.totalTrades ?? currentStepTrades.length;
  const averageRR = analytics?.averageRR ?? currentChallenge.averageRR ?? 0;
  const totalLots = analytics?.totalLots ?? currentChallenge.totalLots ?? 0;

  const targetPercent = currentStep === 1 ? currentChallenge.profitTarget || 8 : 6;
  const targetAmount = (accountSize * targetPercent) / 100;
  const targetProgress = targetAmount > 0 ? Math.min(100, Math.max(0, (profit / targetAmount) * 100)) : 0;
  const remainingProfit = Math.max(0, targetAmount - profit);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Objective Progress Card Banner */}
      <Card padding="p-6" className="border-emerald-200/80 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 uppercase font-mono tracking-wide">
                  Step {currentStep} Objective
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  (Target: +{targetPercent}%)
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
                {profit >= targetAmount ? 'Target Achieved!' : `Reach +${formatCurrency(targetAmount, 0)} Profit`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right font-mono text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 block text-[11px]">Current Profit</span>
              <span className={`font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatPnL(profit)}
              </span>
            </div>
            <div className="h-6 w-[1px] bg-slate-200" />
            <div>
              <span className="text-slate-500 block text-[11px]">Remaining</span>
              <span className="font-bold text-slate-800">
                {formatCurrency(remainingProfit, 0)}
              </span>
            </div>
            <Link to="/trades">
              <Button variant="aurora" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                Trade
              </Button>
            </Link>
          </div>
        </div>

        <ProgressBar
          value={targetProgress}
          max={100}
          color="gradient"
          height="h-3"
          label={`Target: ${formatCurrency(targetAmount, 0)}`}
          valueLabel={`${formatPercent(targetProgress, 1)} Completed`}
        />
      </Card>

      {/* 7 Core Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance */}
        <StatCard
          title="Account Balance"
          value={formatCurrency(balance)}
          subvalue={`Base: ${formatCurrency(accountSize, 0)}`}
          icon={Wallet}
          accent="cyan"
        />

        {/* Equity */}
        <StatCard
          title="Simulated Equity"
          value={formatCurrency(equity)}
          subvalue="Realtime Equity"
          icon={Coins}
          accent="blue"
        />

        {/* Net Profit */}
        <StatCard
          title="Total Net Profit"
          value={formatPnL(profit)}
          trend={profit > 0 ? 'up' : profit < 0 ? 'down' : 'neutral'}
          trendValue={formatPercent(profitPercent, 2)}
          icon={TrendingUp}
          accent={profit >= 0 ? 'emerald' : 'rose'}
        />

        {/* Win Rate */}
        <StatCard
          title="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          subvalue={`${currentStepTrades.filter((t) => t.result > 0).length} wins / ${currentStepTrades.length} trades`}
          icon={Percent}
          accent="purple"
        />

        {/* Total Trades */}
        <StatCard
          title="Total Trades"
          value={totalTrades}
          subvalue="Executed Orders"
          icon={Layers}
          accent="cyan"
        />

        {/* Average RR */}
        <StatCard
          title="Average Risk:Reward"
          value={`1 : ${averageRR.toFixed(2)}`}
          subvalue="Reward to Risk Ratio"
          icon={Scale}
          accent="emerald"
        />

        {/* Total Lots */}
        <StatCard
          title="Total Lot Volume"
          value={`${totalLots.toFixed(2)} L`}
          subvalue="Volume Traded"
          icon={Zap}
          accent="amber"
          className="col-span-2 sm:col-span-2 lg:col-span-2"
        />
      </div>

      {/* Performance Graph Curve */}
      <PerformanceChart
        trades={currentStepTrades}
        startingBalance={accountSize}
        currentBalance={balance}
      />

      {/* Recent Trades Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-mono text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Recent Executions
          </h3>
          <Link to="/trades">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Trades ({trades.length})
            </Button>
          </Link>
        </div>

        <TradeTable
          trades={trades.slice(0, 5)}
          isLoading={false}
          onTradeDeleted={() => {
            refreshChallenge();
          }}
        />
      </div>
    </div>
  );
};

export default DashboardPage;

