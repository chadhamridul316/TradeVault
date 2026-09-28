import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { Target, AlertTriangle, ShieldAlert, Calendar, Clock, Sparkles } from 'lucide-react';

export const ChallengeCard = ({
  tier,
  onSelect,
  isLoading = false,
  selected = false,
}) => {
  const {
    size,
    title,
    badge,
    description,
    profitTarget,
    dailyDrawdown,
    maxDrawdown,
    minTradingDays,
    inactivityLimit,
    recommended,
  } = tier;

  return (
    <Card
      hover
      glow={recommended || selected}
      glowColor={recommended ? 'cyan' : 'blue'}
      className={`relative flex flex-col justify-between transition-all duration-300 ${
        recommended
          ? 'border-blue-500/40 ring-2 ring-blue-500/20 shadow-lg'
          : 'border-slate-200/90 shadow-card'
      }`}
    >
      {/* Recommended Tag */}
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-navy-900 to-blue-700 text-white text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
          <Sparkles className="w-3 h-3 text-cyan-300" />
          Most Popular
        </div>
      )}

      <div>
        {/* Tier Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
            {badge}
          </span>
          <span className="text-xs text-slate-500 font-medium">{title}</span>
        </div>

        {/* Account Size */}
        <div className="mb-4">
          <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900">
            {formatCurrency(size, 0)}
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
        </div>

        <div className="h-[1px] bg-slate-100 my-4" />

        {/* Rules Breakdown */}
        <div className="space-y-3 mb-6 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" />
              Profit Target
            </span>
            <span className="font-bold text-slate-800 font-mono">
              {profitTarget}% ({formatCurrency((size * profitTarget) / 100, 0)})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Daily Drawdown
            </span>
            <span className="font-bold text-slate-800 font-mono">
              {dailyDrawdown}% ({formatCurrency((size * dailyDrawdown) / 100, 0)})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Max Drawdown
            </span>
            <span className="font-bold text-slate-800 font-mono">
              {maxDrawdown}% ({formatCurrency((size * maxDrawdown) / 100, 0)})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Min Trading Days
            </span>
            <span className="font-bold text-slate-800 font-mono">{minTradingDays} Days</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Inactivity Limit
            </span>
            <span className="font-bold text-slate-800 font-mono">{inactivityLimit} Days</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button
        variant={recommended ? 'primary' : 'outline'}
        size="lg"
        isLoading={isLoading}
        onClick={() => onSelect(size)}
        className="w-full"
      >
        Select {formatCurrency(size, 0)} Challenge
      </Button>
    </Card>
  );
};

export default ChallengeCard;
