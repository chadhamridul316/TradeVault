import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subvalue,
  icon: Icon,
  trend, // 'up', 'down', 'neutral'
  trendValue,
  accent = 'cyan', // cyan, emerald, purple, blue, amber, rose
  className = '',
}) => {
  const accentConfigs = {
    cyan: {
      iconBg: 'bg-blue-50 border-blue-200 text-blue-600',
      glow: 'group-hover:border-blue-400/40',
      textAccent: 'text-blue-600',
    },
    emerald: {
      iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      glow: 'group-hover:border-emerald-400/40',
      textAccent: 'text-emerald-600',
    },
    purple: {
      iconBg: 'bg-indigo-50 border-indigo-200 text-indigo-600',
      glow: 'group-hover:border-indigo-400/40',
      textAccent: 'text-indigo-600',
    },
    blue: {
      iconBg: 'bg-blue-50 border-blue-200 text-blue-600',
      glow: 'group-hover:border-blue-400/40',
      textAccent: 'text-blue-600',
    },
    amber: {
      iconBg: 'bg-amber-50 border-amber-200 text-amber-600',
      glow: 'group-hover:border-amber-400/40',
      textAccent: 'text-amber-600',
    },
    rose: {
      iconBg: 'bg-rose-50 border-rose-200 text-rose-600',
      glow: 'group-hover:border-rose-400/40',
      textAccent: 'text-rose-600',
    },
  };

  const currentAccent = accentConfigs[accent] || accentConfigs.cyan;

  return (
    <Card
      hover
      padding="p-5"
      className={`group transition-all duration-300 relative overflow-hidden ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 truncate font-sans">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 truncate">
              {value}
            </h3>
          </div>

          {(subvalue || trendValue) && (
            <div className="flex items-center gap-2 mt-2 text-xs">
              {trend && (
                <span
                  className={`flex items-center gap-1 font-semibold ${
                    trend === 'up'
                      ? 'text-emerald-600'
                      : trend === 'down'
                      ? 'text-rose-600'
                      : 'text-slate-500'
                  }`}
                >
                  {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                  {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                  {trendValue}
                </span>
              )}
              {subvalue && <span className="text-slate-500 font-medium truncate">{subvalue}</span>}
            </div>
          )}
        </div>

        {Icon && (
          <div
            className={`p-3 rounded-xl border flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${currentAccent.iconBg}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;

