import React from 'react';
import { useChallenge } from '../../context/ChallengeContext';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatPnL, formatPercent } from '../../utils/formatters';
import { Wallet, ShieldCheck, Target, TrendingUp, Layers } from 'lucide-react';

export const AccountStatusBar = () => {
  const { currentChallenge } = useChallenge();

  // Do NOT show status bar if there is no challenge or if status is Not-Started
  if (!currentChallenge || currentChallenge.status === 'Not-Started') {
    return null;
  }

  const accountSize = currentChallenge.accountSize || 0;
  const balance = currentChallenge.balance ?? accountSize;
  const equity = currentChallenge.equity ?? balance;
  const profit = balance - accountSize;
  const profitPercent = accountSize > 0 ? (profit / accountSize) * 100 : 0;
  const currentStep = currentChallenge.currentStep || 1;
  const targetPercent = currentStep === 1 ? currentChallenge.profitTarget || 8 : 6;
  const targetAmount = (accountSize * targetPercent) / 100;
  const progressPercent = targetAmount > 0 ? Math.min(100, Math.max(0, (profit / targetAmount) * 100)) : 0;

  return (
    <div className="w-full bg-[#fbfcfd]/95 backdrop-blur-xl border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Account Name & Step */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 font-mono tracking-tight">
                  {formatCurrency(accountSize, 0)} Challenge
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                  Step {currentStep}
                </span>
              </div>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

          {/* Status Badge */}
          <StatusBadge status={currentChallenge.status} size="sm" />
        </div>

        {/* Center/Right: Key Account Metrics */}
        <div className="flex items-center flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm">
          {/* Balance */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs flex items-center gap-1 font-medium">
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              Balance:
            </span>
            <span className="font-bold text-slate-900 font-mono text-sm">
              {formatCurrency(balance)}
            </span>
          </div>

          {/* Equity */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-medium">Equity:</span>
            <span className="font-bold text-slate-800 font-mono text-sm">
              {formatCurrency(equity)}
            </span>
          </div>

          {/* Net Profit */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-medium">Net P&L:</span>
            <span
              className={`font-bold font-mono text-sm ${
                profit > 0 ? 'text-emerald-600' : profit < 0 ? 'text-rose-600' : 'text-slate-700'
              }`}
            >
              {formatPnL(profit)} ({formatPercent(profitPercent, 2)})
            </span>
          </div>

          {/* Mini Target Progress Bar */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 gap-2">
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-blue-600" />
                  Target: {formatCurrency(targetAmount, 0)}
                </span>
                <span className="font-mono text-slate-700 font-medium">{formatPercent(progressPercent, 0)}</span>
              </div>
              <div className="w-24 sm:w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountStatusBar;
