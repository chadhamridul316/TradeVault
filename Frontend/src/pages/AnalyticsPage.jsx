import React, { useState, useEffect } from 'react';
import { useChallenge } from '../context/ChallengeContext';
import { StatCard } from '../components/common/StatCard';
import { PerformanceChart } from '../components/analytics/PerformanceChart';
import { PnLDistributionChart } from '../components/analytics/PnLDistributionChart';
import { WinLossChart } from '../components/analytics/WinLossChart';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import tradeService from '../services/tradeService';
import analyticsService from '../services/analyticsService';
import {
  formatCurrency,
  formatPercent,
  formatPnL,
  formatNumber,
} from '../utils/formatters';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Percent,
  Layers,
  Scale,
  Zap,
  Target,
  Trophy,
  AlertTriangle,
  Award,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const AnalyticsPage = () => {
  const { currentChallenge } = useChallenge();
  const [trades, setTrades] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
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
        console.error('Failed to load analytics data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [currentChallenge?._id]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" text="Calculating Performance Metrics..." />
      </div>
    );
  }

  if (!currentChallenge) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <Card padding="p-8">
          <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 font-mono">No Active Challenge</h2>
          <p className="text-sm text-slate-500 mb-6">
            Choose and start a challenge account to generate comprehensive performance analytics.
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

  const currentStep = currentChallenge.currentStep || 1;
  const currentStepTrades = trades.filter((t) => (t.step || 1) === currentStep);

  const accountSize = currentChallenge.accountSize || 10000;
  const balance = analytics?.balance ?? currentChallenge.balance ?? accountSize;
  const equity = analytics?.equity ?? currentChallenge.equity ?? balance;
  const profit = balance - accountSize;
  const winRate = analytics?.winRate ?? currentChallenge.winRate ?? 0;
  const totalTrades = analytics?.totalTrades ?? currentChallenge.totalTrades ?? currentStepTrades.length;
  const averageRR = analytics?.averageRR ?? currentChallenge.averageRR ?? 0;
  const totalLots = analytics?.totalLots ?? currentChallenge.totalLots ?? 0;

  // Granular metrics from current step trades
  const winningTradesList = currentStepTrades.filter((t) => t.result > 0);
  const losingTradesList = currentStepTrades.filter((t) => t.result < 0);
  const winningCount = winningTradesList.length;
  const losingCount = losingTradesList.length;

  const bestTrade = currentStepTrades.length > 0 ? Math.max(...currentStepTrades.map((t) => t.result)) : 0;
  const worstTrade = currentStepTrades.length > 0 ? Math.min(...currentStepTrades.map((t) => t.result)) : 0;

  const totalWinAmount = winningTradesList.reduce((sum, t) => sum + t.result, 0);
  const totalLossAmount = Math.abs(losingTradesList.reduce((sum, t) => sum + t.result, 0));
  const avgWin = winningCount > 0 ? totalWinAmount / winningCount : 0;
  const avgLoss = losingCount > 0 ? totalLossAmount / losingCount : 0;
  const profitFactor = totalLossAmount > 0 ? (totalWinAmount / totalLossAmount).toFixed(2) : totalWinAmount > 0 ? '∞' : '0.00';

  // Target objective
  const targetPercent = currentStep === 1 ? currentChallenge.profitTarget || 8 : 6;
  const targetAmount = (accountSize * targetPercent) / 100;
  const targetProgress = targetAmount > 0 ? Math.min(100, Math.max(0, (profit / targetAmount) * 100)) : 0;
  const remainingProfit = Math.max(0, targetAmount - profit);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 7 Core Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Profit */}
        <StatCard
          title="Total Net Profit"
          value={formatPnL(profit)}
          trend={profit > 0 ? 'up' : profit < 0 ? 'down' : 'neutral'}
          trendValue={formatPercent((profit / accountSize) * 100, 2)}
          icon={TrendingUp}
          accent={profit >= 0 ? 'emerald' : 'rose'}
        />

        {/* Balance */}
        <StatCard
          title="Current Balance"
          value={formatCurrency(balance)}
          subvalue={`Starting: ${formatCurrency(accountSize, 0)}`}
          icon={Wallet}
          accent="cyan"
        />

        {/* Equity */}
        <StatCard
          title="Simulated Equity"
          value={formatCurrency(equity)}
          subvalue="Mark-to-Market"
          icon={ShieldCheck}
          accent="blue"
        />

        {/* Win Rate */}
        <StatCard
          title="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          subvalue={`${winningCount} W / ${losingCount} L`}
          icon={Percent}
          accent="purple"
        />

        {/* Total Trades */}
        <StatCard
          title="Total Trades"
          value={totalTrades}
          subvalue="Closed Positions"
          icon={Layers}
          accent="cyan"
        />

        {/* Average RR */}
        <StatCard
          title="Average Risk:Reward"
          value={`1 : ${averageRR.toFixed(2)}`}
          subvalue="Historical Trade Average"
          icon={Scale}
          accent="emerald"
        />

        {/* Total Lots */}
        <StatCard
          title="Total Volume"
          value={`${totalLots.toFixed(2)} Lots`}
          subvalue="Cumulative Exposure"
          icon={Zap}
          accent="amber"
          className="col-span-2 sm:col-span-2 lg:col-span-2"
        />
      </div>

      {/* Challenge Progress Section */}
      <Card padding="p-6" className="shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-mono">
                Challenge Target Evaluation — Step {currentStep}
              </h3>
              <p className="text-xs text-slate-500">
                Rule progression and required profit target headroom
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 block text-[11px]">Profit Target</span>
              <span className="font-bold text-slate-900">+{formatCurrency(targetAmount, 0)} (+{targetPercent}%)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Current Profit</span>
              <span className={`font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatPnL(profit)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Remaining</span>
              <span className="font-bold text-slate-800">{formatCurrency(remainingProfit, 0)}</span>
            </div>
          </div>
        </div>

        <ProgressBar
          value={targetProgress}
          max={100}
          color="gradient"
          height="h-3"
          label="Progress toward passing"
          valueLabel={`${formatPercent(targetProgress, 1)}`}
        />
      </Card>

      {/* Deep Performance Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Best Trade */}
        <Card padding="p-4" className="border-emerald-200 bg-emerald-50/50 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono text-emerald-700 font-semibold">
            <Trophy className="w-4 h-4 text-emerald-600" />
            Best Trade
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700">
            +{formatCurrency(bestTrade)}
          </div>
        </Card>

        {/* Worst Trade */}
        <Card padding="p-4" className="border-rose-200 bg-rose-50/50 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono text-rose-700 font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Worst Trade
          </div>
          <div className="text-xl font-bold font-mono text-rose-700">
            {formatCurrency(worstTrade)}
          </div>
        </Card>

        {/* Profit Factor */}
        <Card padding="p-4" className="border-blue-200 bg-blue-50/50 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono text-blue-700 font-semibold">
            <Award className="w-4 h-4 text-blue-600" />
            Profit Factor
          </div>
          <div className="text-xl font-bold font-mono text-blue-700">
            {profitFactor}
          </div>
        </Card>

        {/* Avg Win / Loss Ratio */}
        <Card padding="p-4" className="border-slate-200 bg-slate-50/70 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono text-slate-700 font-semibold">
            <Scale className="w-4 h-4 text-indigo-600" />
            Avg Win / Avg Loss
          </div>
          <div className="text-xs font-bold font-mono text-slate-800">
            <span className="text-emerald-600">+{formatCurrency(avgWin, 0)}</span> / <span className="text-rose-600">-{formatCurrency(avgLoss, 0)}</span>
          </div>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Progression Curve (2 columns) */}
        <div className="lg:col-span-2">
          <PerformanceChart
            trades={currentStepTrades}
            startingBalance={accountSize}
            currentBalance={balance}
          />
        </div>

        {/* Win/Loss Distribution Donut (1 column) */}
        <div className="lg:col-span-1">
          <WinLossChart
            winningTrades={winningCount}
            losingTrades={losingCount}
            winRate={winRate}
          />
        </div>
      </div>

      {/* PnL by Trade Distribution Bar Chart */}
      <PnLDistributionChart trades={currentStepTrades} />
    </div>
  );
};

export default AnalyticsPage;
