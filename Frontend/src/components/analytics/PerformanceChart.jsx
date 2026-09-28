import React from 'react';
import { Card } from '../common/Card';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card bg-[#fbfcfd] p-3 rounded-xl border border-slate-200/90 text-xs font-mono shadow-xl">
        <div className="text-slate-500 mb-1 font-sans font-medium">{data.date || label}</div>
        <div className="flex items-center gap-2 text-blue-700 font-bold">
          <span>Balance:</span>
          <span>{formatCurrency(data.balance)}</span>
        </div>
        {data.tradePnl !== undefined && (
          <div
            className={`flex items-center gap-2 text-[11px] font-semibold mt-0.5 ${
              data.tradePnl >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            <span>Trade P&L:</span>
            <span>
              {data.tradePnl >= 0 ? '+' : ''}
              {formatCurrency(data.tradePnl)}
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const PerformanceChart = ({
  trades = [],
  startingBalance = 10000,
  currentBalance = 10000,
  className = '',
}) => {
  // Build time-series balance data points
  // Sort trades chronologically
  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.tradeDate || a.createdAt) - new Date(b.tradeDate || b.createdAt)
  );

  let runningBalance = startingBalance;
  const chartData = [
    {
      tradeIndex: 0,
      name: 'Start',
      date: 'Account Start',
      balance: startingBalance,
      tradePnl: 0,
    },
    ...sortedTrades.map((t, idx) => {
      runningBalance += t.result;
      return {
        tradeIndex: idx + 1,
        name: `Trade #${idx + 1}`,
        date: formatDate(t.tradeDate || t.createdAt),
        pair: t.pair,
        balance: Number(runningBalance.toFixed(2)),
        tradePnl: t.result,
      };
    }),
  ];

  // Min and Max calculation for Y-Axis padding
  const balances = chartData.map((d) => d.balance);
  const minBal = Math.min(...balances, startingBalance * 0.9);
  const maxBal = Math.max(...balances, startingBalance * 1.1);
  const yDomain = [Math.floor(minBal * 0.98), Math.ceil(maxBal * 1.02)];

  const isNetPositive = currentBalance >= startingBalance;

  return (
    <Card padding="p-6" className={`relative shadow-md ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-mono">
              Balance Progression Curve
            </h3>
            <p className="text-xs text-slate-500">
              Account balance trajectory across completed trades
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500 font-sans">Current Balance</div>
          <div className="text-lg font-bold font-mono text-slate-900">
            {formatCurrency(currentBalance)}
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradientGlow" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isNetPositive ? '#2563eb' : '#e11d48'}
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor={isNetPositive ? '#3b82f6' : '#ef4444'}
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.06)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(15, 23, 42, 0.12)' }}
            />
            <YAxis
              domain={yDomain}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(15, 23, 42, 0.12)' }}
              tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke={isNetPositive ? '#1e3a8a' : '#e11d48'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#balanceGradientGlow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PerformanceChart;

