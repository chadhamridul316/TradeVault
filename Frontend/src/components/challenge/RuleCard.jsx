import React from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

export const RuleCard = ({
  icon: Icon,
  title,
  limitValue,
  currentValue,
  progress,
  progressColor = 'blue',
  description,
  status = 'safe', // 'safe', 'warning', 'breached', 'completed'
  className = '',
}) => {
  const statusClasses = {
    safe: 'text-slate-800 border-slate-200/80 bg-[#fbfcfd]/95 shadow-card',
    warning: 'text-amber-900 border-amber-300 bg-amber-50/50 shadow-card',
    breached: 'text-rose-900 border-rose-300 bg-rose-50/50 shadow-card',
    completed: 'text-emerald-900 border-emerald-300 bg-emerald-50/50 shadow-card',
  };

  return (
    <Card padding="p-5" className={`border ${statusClasses[status] || statusClasses.safe} ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-600">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-slate-900">{title}</h4>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-sm font-bold text-slate-900">{limitValue}</div>
          {currentValue !== undefined && (
            <div className="text-[11px] text-slate-500">Current: {currentValue}</div>
          )}
        </div>
      </div>

      {progress !== undefined && (
        <ProgressBar
          value={progress}
          max={100}
          color={progressColor}
          showPercentage={false}
          height="h-2"
        />
      )}
    </Card>
  );
};

export default RuleCard;
