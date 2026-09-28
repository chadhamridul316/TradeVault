import React, { useEffect } from 'react';
import { Button } from '../common/Button';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';
import {
  Calendar as CalendarIcon,
  X,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

export const DayDetailsModal = ({ isOpen, onClose, dateStr, dayData }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !dayData) return null;

  const totalTrades = dayData.totalTrades || 0;
  const totalProfit = dayData.totalProfit || 0;
  const trades = dayData.trades || [];
  const isProfit = totalProfit > 0;
  const isLoss = totalProfit < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="glass-card bg-[#fbfcfd] rounded-2xl max-w-xl w-full relative z-10 border border-slate-200/90 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-mono">
                {formatDate(dateStr, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <p className="text-xs text-slate-500">Daily Journal & Position Breakdown</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Day Summary Stats Banner */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 grid grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block mb-1 font-sans">Trades Placed</span>
            <span className="text-base font-bold text-slate-900">{totalTrades}</span>
          </div>

          <div className="text-right">
            <span className="text-slate-500 block mb-1 font-sans">Day Net P&L</span>
            <span
              className={`text-base font-bold flex items-center justify-end gap-1 ${
                isProfit ? 'text-emerald-700' : isLoss ? 'text-rose-700' : 'text-slate-700'
              }`}
            >
              {isProfit && <TrendingUp className="w-4 h-4 text-emerald-600" />}
              {isLoss && <TrendingDown className="w-4 h-4 text-rose-600" />}
              {isProfit ? '+' : ''}
              {formatCurrency(totalProfit)}
            </span>
          </div>
        </div>

        {/* Trade List Container */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100">
          {trades.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No trades recorded on this date.</p>
          ) : (
            trades.map((t, idx) => {
              const tradeWin = t.result > 0;
              const tradeBuy = t.tradeType === 'BUY';

              return (
                <div key={t._id || idx} className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-mono text-slate-900">{t.pair}</span>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {tradeBuy ? <ArrowUpRight className="w-3 h-3 text-slate-500" /> : <ArrowDownRight className="w-3 h-3 text-slate-500" />}
                        {t.tradeType}
                      </span>
                    </div>

                    <span
                      className={`font-bold font-mono text-sm px-2 py-0.5 rounded-md border ${
                        tradeWin
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : t.result < 0
                          ? 'text-rose-700 bg-rose-50 border-rose-200'
                          : 'text-slate-700 bg-slate-100 border-slate-200'
                      }`}
                    >
                      {tradeWin ? '+' : ''}
                      {formatCurrency(t.result)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="block text-slate-400 text-[10px]">Entry:</span>
                      <span className="text-slate-800 font-medium">{formatNumber(t.entryPrice, 2)}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px]">Exit:</span>
                      <span className="text-slate-800 font-medium">{formatNumber(t.exitPrice, 2)}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px]">SL / TP:</span>
                      <span className="text-slate-800 font-medium">{formatNumber(t.stopLoss, 2)}</span>
                      <span className="text-slate-400"> / </span>
                      <span className="text-slate-800 font-medium">{formatNumber(t.takeProfit, 2)}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px]">Lots & Step:</span>
                      <span className="text-slate-800 font-medium">{t.lotSize}L (S{t.step || 1})</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex justify-end">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DayDetailsModal;
