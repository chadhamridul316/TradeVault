import React from 'react';
import { Card } from '../common/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

export const WinLossChart = ({ winningTrades = 0, losingTrades = 0, winRate = 0, className = '' }) => {
  const totalTrades = winningTrades + losingTrades;

  const data = [
    { name: 'Winning Trades', value: winningTrades, color: '#059669' },
    { name: 'Losing Trades', value: losingTrades, color: '#e11d48' },
  ];

  return (
    <Card padding="p-6" className={`relative shadow-md ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-mono">
              Win / Loss Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Outcome ratio of all closed trading positions
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-56 sm:h-64 flex items-center justify-center">
        {totalTrades === 0 ? (
          <div className="text-xs text-slate-400">No trade data available yet.</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="transparent"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} trades`, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    borderColor: '#cbd5e1',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#0f172a',
                    fontFamily: 'monospace',
                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Stat */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
                {winRate.toFixed(1)}%
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">
                Win Rate
              </span>
            </div>
          </>
        )}
      </div>

      {/* Legend Bottom */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-sm" />
          <span className="text-slate-500">Wins:</span>
          <span className="font-bold text-slate-900">{winningTrades}</span>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-sm" />
          <span className="text-slate-500">Losses:</span>
          <span className="font-bold text-slate-900">{losingTrades}</span>
        </div>
      </div>
    </Card>
  );
};

export default WinLossChart;

