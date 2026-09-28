import React from 'react';
import { Card } from '../common/Card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { BarChart2 } from 'lucide-react';

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isWin = data.pnl >= 0;
    return (
      <div className="glass-card bg-[#fbfcfd] p-3 rounded-xl border border-slate-200/90 text-xs font-mono shadow-xl">
        <div className="text-slate-700 font-sans font-medium mb-1">
          {data.pair} ({data.type})
        </div>
        <div
          className={`font-bold text-sm ${
            isWin ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {isWin ? '+' : ''}
          {formatCurrency(data.pnl)}
        </div>
        <div className="text-[10px] text-slate-500 mt-1">
          Lot: {data.lotSize} | Step {data.step}
        </div>
      </div>
    );
  }
  return null;
};

export const PnLDistributionChart = ({ trades = [], className = '' }) => {
  const chartData = trades.map((t, idx) => ({
    name: `#${idx + 1}`,
    pnl: t.result,
    pair: t.pair,
    type: t.tradeType,
    lotSize: t.lotSize,
    step: t.step,
  }));

  return (
    <Card padding="p-6" className={`relative shadow-md ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-mono">
              P&L by Trade
            </h3>
            <p className="text-xs text-slate-500">
              Profit and loss distribution per individual executed position
            </p>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No trade data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(15, 23, 42, 0.12)' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(15, 23, 42, 0.12)' }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <ReferenceLine y={0} stroke="rgba(15, 23, 42, 0.2)" strokeWidth={1} />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? '#059669' : '#e11d48'}
                    fillOpacity={0.9}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default PnLDistributionChart;

