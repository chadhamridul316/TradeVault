import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  valueLabel,
  color = 'cyan', // cyan, emerald, amber, rose, gradient
  showPercentage = true,
  height = 'h-2.5',
  className = '',
}) => {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  const colorVariants = {
    cyan: 'bg-gradient-to-r from-blue-600 to-sky-500 shadow-sm',
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-500 shadow-sm',
    amber: 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-sm',
    rose: 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-sm',
    gradient: 'bg-gradient-to-r from-[#0b1736] via-[#1e3a8a] to-emerald-500 shadow-sm',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || valueLabel || showPercentage) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          {label && <span className="font-medium text-slate-600">{label}</span>}
          <div className="flex items-center gap-2 font-mono">
            {valueLabel && <span className="text-slate-500">{valueLabel}</span>}
            {showPercentage && (
              <span className="font-bold text-slate-900">{percentage.toFixed(0)}%</span>
            )}
          </div>
        </div>
      )}

      <div className={`w-full ${height} bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            colorVariants[color] || colorVariants.gradient
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

