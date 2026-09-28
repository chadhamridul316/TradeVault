import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useChallenge } from '../context/ChallengeContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { RuleCard } from '../components/challenge/RuleCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatCurrency, formatPercent, formatPnL } from '../utils/formatters';
import {
  Target,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  Clock,
  Play,
  Shield,
  ArrowRight,
  Info,
} from 'lucide-react';
import tradeService from '../services/tradeService';
import challengeService from '../services/challengeService';

export const ChallengeRulesPage = () => {
  const { id } = useParams();
  const { currentChallenge, selectChallenge, startActiveChallenge } = useChallenge();
  const [challengeData, setChallengeData] = useState(null);
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadChallenge = async () => {
      setIsLoading(true);
      try {
        const targetId = id || currentChallenge?._id;
        if (targetId) {
          const [dataRes, tradesRes] = await Promise.allSettled([
            challengeService.getChallengeById(targetId),
            tradeService.getTradesByChallenge(targetId),
          ]);
          if (dataRes.status === 'fulfilled') {
            setChallengeData(dataRes.value);
            selectChallenge(dataRes.value);
          }
          if (tradesRes.status === 'fulfilled') {
            setTrades(tradesRes.value || []);
          }
        } else if (currentChallenge) {
          setChallengeData(currentChallenge);
          if (currentChallenge._id) {
            try {
              const tradesData = await tradeService.getTradesByChallenge(currentChallenge._id);
              setTrades(tradesData || []);
            } catch (e) {
              console.error('Failed to load challenge trades:', e);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load challenge details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadChallenge();
  }, [id, currentChallenge?._id]);

  const targetChallenge = challengeData || currentChallenge;

  const handleStartChallenge = async () => {
    if (!targetChallenge?._id) return;
    setIsStarting(true);
    setStartError(null);
    try {
      const started = await startActiveChallenge(targetChallenge._id);
      setChallengeData(started);
      toast.success(
        'Challenge started successfully! Welcome to the trading terminal.',
        'Challenge Active'
      );
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to start challenge:', err);
      const msg = err.message || 'Failed to start challenge';
      setStartError(msg);
      toast.error(msg, 'Error Starting Challenge');
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" text="Loading Challenge Parameters..." />
      </div>
    );
  }

  if (!targetChallenge) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <Card padding="p-8">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 font-mono">No Challenge Selected</h2>
          <p className="text-sm text-slate-500 mb-6">
            Please choose a simulated trading challenge account to view rules and start trading.
          </p>
          <Link to="/challenges">
            <Button variant="primary" size="lg">
              Choose a Challenge Account
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const accountSize = targetChallenge.accountSize || 25000;
  const currentStep = targetChallenge.currentStep || 1;
  const currentStepTrades = trades.filter((t) => (t.step || 1) === currentStep);
  const status = targetChallenge.status || 'Not-Started';
  const calculatedStepBalance = currentStepTrades.reduce((sum, t) => sum + (t.result || 0), accountSize);
  const balance = targetChallenge.balance ?? calculatedStepBalance;
  const profit = balance - accountSize;

  // Rules from backend or defaults
  const profitTargetPercent = currentStep === 1 ? targetChallenge.profitTarget || 8 : 6;
  const targetProfitAmount = (accountSize * profitTargetPercent) / 100;
  const requiredBalance = accountSize + targetProfitAmount;

  const dailyDrawdownPercent = targetChallenge.dailyDrawdown || 5;
  const maxDrawdownPercent = targetChallenge.maxDrawdown || 10;
  const minTradingDays = targetChallenge.minimumTradingDays || 3;
  const inactivityLimit = targetChallenge.inactivityLimit || 15;

  // Progress calculations
  const profitProgress = targetProfitAmount > 0 ? Math.min(100, Math.max(0, (profit / targetProfitAmount) * 100)) : 0;
  const maxDrawdownLoss = (accountSize * maxDrawdownPercent) / 100;
  const maxDrawdownFloor = accountSize - maxDrawdownLoss;
  const currentDrawdown = accountSize > 0 ? ((accountSize - balance) / accountSize) * 100 : 0;

  // Trading days calculation
  const tradesTradingDays = currentStepTrades.length > 0
    ? new Set(currentStepTrades.map((t) => new Date(t.tradeDate || t.createdAt).toISOString().split('T')[0])).size
    : 0;
  const currentTradingDays = Math.max(targetChallenge.tradingDays || 0, tradesTradingDays);

  const isNotStarted = status === 'Not-Started';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <Card
        padding="p-6 sm:p-8"
        className="border-slate-200/90 shadow-card bg-[#fbfcfd]/95"
      >
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
                Challenge Evaluation Overview
              </span>
              <StatusBadge status={status} size="sm" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-slate-900">
              {formatCurrency(accountSize, 0)} Challenge Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Current Evaluation Phase: <span className="text-blue-600 font-bold font-mono">Step {currentStep}</span>
            </p>
          </div>

          {/* Start Challenge CTA (Shown only when Not-Started) */}
          {isNotStarted && (
            <div className="flex flex-col sm:items-end gap-2">
              <Button
                variant="primary"
                size="lg"
                isLoading={isStarting}
                onClick={handleStartChallenge}
                leftIcon={<Play className="w-5 h-5 fill-current" />}
              >
                START CHALLENGE
              </Button>
              <span className="text-[11px] text-slate-500">
                Activates account rules & enables order execution
              </span>
            </div>
          )}

          {/* Challenge Active Indicator if started */}
          {!isNotStarted && (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-50/80 border border-emerald-300 text-emerald-800">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  {status === 'Active' ? 'Challenge Active' : status}
                </span>
                <span className="block text-[10px] text-emerald-700 font-medium">
                  {status === 'Active' ? 'Evaluation in progress' : 'Phase completed'}
                </span>
              </div>
            </div>
          )}
        </div>

        {startError && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {startError}
          </div>
        )}

        {/* Financial Objectives Target Math Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-medium block mb-1">Starting Balance</span>
            <span className="text-base sm:text-lg font-bold text-slate-900">{formatCurrency(accountSize)}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-medium block mb-1">Profit Target</span>
            <span className="text-base sm:text-lg font-bold text-emerald-600">
              +{profitTargetPercent}% (+{formatCurrency(targetProfitAmount, 0)})
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-medium block mb-1">Required Balance</span>
            <span className="text-base sm:text-lg font-bold text-blue-600">{formatCurrency(requiredBalance)}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-medium block mb-1">Current Balance</span>
            <span
              className={`text-base sm:text-lg font-bold ${
                profit > 0 ? 'text-emerald-600' : profit < 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {formatCurrency(balance)}
            </span>
          </div>
        </div>

        {/* Progress Toward Passing (If active or started) */}
        {!isNotStarted && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-700 font-bold flex items-center gap-1.5">
                <Target className="w-4 h-4 text-blue-600" />
                Step {currentStep} Objective Progress
              </span>
              <span className="text-slate-600 font-semibold">
                {formatPnL(profit)} / +{formatCurrency(targetProfitAmount, 0)} ({formatPercent(profitProgress, 1)})
              </span>
            </div>
            <ProgressBar value={profitProgress} max={100} color="gradient" height="h-3" showPercentage={false} />
          </div>
        )}

        <div className="mt-4 text-xs text-slate-500 italic flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          Reach the required profit target while respecting all challenge rules.
        </div>
      </Card>

      {/* Rules Grid */}
      <div>
        <h3 className="text-lg font-bold font-mono text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Standard Evaluation Rules & Risk Limits
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rule 1: Profit Target */}
          <RuleCard
            icon={Target}
            title="Profit Target"
            description={`Achieve a +${profitTargetPercent}% gain on starting capital`}
            limitValue={`+${profitTargetPercent}% (${formatCurrency(targetProfitAmount, 0)})`}
            currentValue={!isNotStarted ? `${formatPnL(profit)} (${profitProgress.toFixed(0)}%)` : undefined}
            progress={!isNotStarted ? profitProgress : undefined}
            progressColor="emerald"
            status={profitProgress >= 100 ? 'completed' : 'safe'}
          />

          {/* Rule 2: Daily Drawdown */}
          <RuleCard
            icon={AlertTriangle}
            title="Daily Drawdown Limit"
            description={`Do not lose more than ${dailyDrawdownPercent}% from daily starting balance`}
            limitValue={`-${dailyDrawdownPercent}% (${formatCurrency((accountSize * dailyDrawdownPercent) / 100, 0)})`}
            currentValue={!isNotStarted ? `${formatCurrency(targetChallenge.dailyStartingBalance || balance)} base` : undefined}
            progress={0}
            progressColor="amber"
            status="safe"
          />

          {/* Rule 3: Maximum Drawdown */}
          <RuleCard
            icon={ShieldAlert}
            title="Maximum Overall Drawdown"
            description={`Account balance must never drop below ${formatCurrency(maxDrawdownFloor)} (-${maxDrawdownPercent}%)`}
            limitValue={`-${maxDrawdownPercent}% (${formatCurrency(maxDrawdownLoss, 0)})`}
            currentValue={!isNotStarted ? `${formatCurrency(balance)} (${currentDrawdown > 0 ? `-${currentDrawdown.toFixed(1)}%` : '0%'})` : undefined}
            progress={Math.max(0, currentDrawdown * 10)}
            progressColor="rose"
            status={currentDrawdown >= maxDrawdownPercent ? 'breached' : 'safe'}
          />

          {/* Rule 4: Minimum Trading Days */}
          <RuleCard
            icon={Calendar}
            title="Minimum Trading Days"
            description={`Execute positions on at least ${minTradingDays} separate calendar days`}
            limitValue={`${minTradingDays} Days`}
            currentValue={!isNotStarted ? `${currentTradingDays} / ${minTradingDays} days` : undefined}
            progress={Math.min(100, (currentTradingDays / minTradingDays) * 100)}
            progressColor="blue"
            status={currentTradingDays >= minTradingDays ? 'completed' : 'safe'}
          />

          {/* Rule 5: Inactivity Limit */}
          <RuleCard
            icon={Clock}
            title="Inactivity Timeout"
            description={`Do not exceed ${inactivityLimit} consecutive days without placing a trade`}
            limitValue={`${inactivityLimit} Days max`}
            currentValue="Active"
            status="safe"
            className="md:col-span-2"
          />
        </div>
      </div>

      {/* Bottom Action Section if active */}
      {!isNotStarted && (
        <div className="flex items-center justify-between p-6 rounded-2xl glass-card border border-slate-200/90 shadow-sm bg-[#fbfcfd]/95">
          <div>
            <h4 className="font-bold text-slate-900 text-sm font-mono">Ready to Trade?</h4>
            <p className="text-xs text-slate-500">Head over to the terminal to place orders and review executions.</p>
          </div>
          <Link to="/trades">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Trade Terminal
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ChallengeRulesPage;
