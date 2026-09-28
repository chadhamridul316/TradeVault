import React from 'react';
import { formatCurrency, formatDateTime, formatNumber } from '../../utils/formatters';
import { Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const TradeRow = ({ trade, onDeleteClick }) => {
  const isProfit = trade.result > 0;
  const isLoss = trade.result < 0;
  const isBuy = trade.tradeType === 'BUY';

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-xs font-mono group">
      {/* Date */}
      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-sans">
        {formatDateTime(trade.tradeDate || trade.createdAt)}
      </td>

      {/* Pair */}
      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
        {trade.pair}
      </td>

      {/* Type */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
          {isBuy ? <ArrowUpRight className="w-3 h-3 text-slate-500" /> : <ArrowDownRight className="w-3 h-3 text-slate-500" />}
          {trade.tradeType}
        </span>
      </td>

      {/* Entry */}
      <td className="py-3.5 px-4 text-slate-700 font-medium">
        {formatNumber(trade.entryPrice, trade.entryPrice < 10 ? 4 : 2)}
      </td>

      {/* Exit */}
      <td className="py-3.5 px-4 text-slate-700 font-medium">
        {formatNumber(trade.exitPrice, trade.exitPrice < 10 ? 4 : 2)}
      </td>

      {/* SL */}
      <td className="py-3.5 px-4 text-slate-700 font-medium">
        {formatNumber(trade.stopLoss, trade.stopLoss < 10 ? 4 : 2)}
      </td>

      {/* TP */}
      <td className="py-3.5 px-4 text-slate-700 font-medium">
        {formatNumber(trade.takeProfit, trade.takeProfit < 10 ? 4 : 2)}
      </td>

      {/* Lot Size */}
      <td className="py-3.5 px-4 text-slate-600">
        {trade.lotSize}
      </td>

      {/* P&L */}
      <td className="py-3.5 px-4 font-bold text-sm whitespace-nowrap">
        <span
          className={`px-2 py-0.5 rounded-md border ${
            isProfit
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : isLoss
              ? 'text-rose-700 bg-rose-50 border-rose-200'
              : 'text-slate-700 bg-slate-100 border-slate-200'
          }`}
        >
          {isProfit ? '+' : ''}
          {formatCurrency(trade.result)}
        </span>
      </td>

      {/* Step */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] text-blue-700 font-bold">
          Step {trade.step || 1}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <button
          onClick={() => onDeleteClick(trade)}
          title="Delete Trade"
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-80 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export default TradeRow;
