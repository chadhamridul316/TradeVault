import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { DayDetailsModal } from './DayDetailsModal';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Percent,
  Layers,
} from 'lucide-react';

export const JournalCalendar = ({ journalData = {} }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calendar logic
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon, etc.
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Helper to format date string as YYYY-MM-DD for key lookup
  const getDateKey = (day) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Calculate monthly stats from journalData for current viewed month
  let monthlyTotalTrades = 0;
  let monthlyTotalProfit = 0;
  let winningDays = 0;
  let losingDays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const key = getDateKey(day);
    const dayRecord = journalData[key];
    if (dayRecord && dayRecord.totalTrades > 0) {
      monthlyTotalTrades += dayRecord.totalTrades;
      monthlyTotalProfit += dayRecord.totalProfit;
      if (dayRecord.totalProfit > 0) {
        winningDays++;
      } else if (dayRecord.totalProfit < 0) {
        losingDays++;
      }
    }
  }

  const activeTradingDays = winningDays + losingDays;
  const dayWinRate = activeTradingDays > 0 ? (winningDays / activeTradingDays) * 100 : 0;

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Top Controls & Month Selector */}
      <Card padding="p-6" className="shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-slate-900">
                {monthName} {year}
              </h2>
              <p className="text-xs text-slate-500">Monthly Trade Journal & Consistency Tracker</p>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={prevMonth} leftIcon={<ChevronLeft className="w-4 h-4" />}>
              Prev Month
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Current
            </Button>
            <Button variant="secondary" size="sm" onClick={nextMonth} rightIcon={<ChevronRight className="w-4 h-4" />}>
              Next Month
            </Button>
          </div>
        </div>

        {/* Monthly Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono shadow-sm">
            <span className="text-[11px] text-slate-500 block mb-1 font-sans">Total Trades</span>
            <span className="text-base sm:text-lg font-bold text-slate-900">{monthlyTotalTrades}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono shadow-sm">
            <span className="text-[11px] text-slate-500 block mb-1 font-sans">Monthly P&L</span>
            <span
              className={`text-base sm:text-lg font-bold ${
                monthlyTotalProfit > 0
                  ? 'text-emerald-700'
                  : monthlyTotalProfit < 0
                  ? 'text-rose-700'
                  : 'text-slate-700'
              }`}
            >
              {monthlyTotalProfit > 0 ? '+' : ''}
              {formatCurrency(monthlyTotalProfit)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono shadow-sm">
            <span className="text-[11px] text-slate-500 block mb-1 font-sans">Winning Days</span>
            <span className="text-base sm:text-lg font-bold text-emerald-700">{winningDays}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono shadow-sm">
            <span className="text-[11px] text-slate-500 block mb-1 font-sans">Losing Days</span>
            <span className="text-base sm:text-lg font-bold text-rose-700">{losingDays}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono col-span-2 sm:col-span-1 shadow-sm">
            <span className="text-[11px] text-slate-500 block mb-1 font-sans">Day Win Rate</span>
            <span className="text-base sm:text-lg font-bold text-blue-700">{dayWinRate.toFixed(0)}%</span>
          </div>
        </div>
      </Card>

      {/* Calendar Grid Card */}
      <Card padding="p-4 sm:p-6" className="shadow-md">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
          {weekDays.map((wd) => (
            <div
              key={wd}
              className="text-center py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
          {/* Empty prefix cells */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-[85px] sm:min-h-[105px] rounded-xl bg-slate-100/50 border border-transparent opacity-40"
            />
          ))}

          {/* Active Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateKey = getDateKey(dayNum);
            const record = journalData[dateKey];
            const hasTrades = record && record.totalTrades > 0;
            const isWin = hasTrades && record.totalProfit > 0;
            const isLoss = hasTrades && record.totalProfit < 0;

            const isToday =
              new Date().toDateString() === new Date(year, month, dayNum).toDateString();

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => hasTrades && setSelectedDay({ dateStr: dateKey, dayData: record })}
                className={`min-h-[85px] sm:min-h-[105px] p-2 sm:p-2.5 rounded-xl border flex flex-col justify-between transition-all duration-200 ${
                  hasTrades
                    ? isWin
                      ? 'bg-emerald-50/70 hover:bg-emerald-100/70 border-emerald-200 hover:border-emerald-300 shadow-sm cursor-pointer'
                      : isLoss
                      ? 'bg-rose-50/70 hover:bg-rose-100/70 border-rose-200 hover:border-rose-300 shadow-sm cursor-pointer'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 cursor-pointer'
                    : 'bg-slate-50/40 border-slate-100 text-slate-400'
                } ${isToday ? 'ring-2 ring-blue-600' : ''}`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isToday ? 'text-blue-700' : hasTrades ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {hasTrades && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-700 font-bold shadow-xs">
                      {record.totalTrades}T
                    </span>
                  )}
                </div>

                {/* Day P&L Body */}
                <div className="mt-1">
                  {hasTrades ? (
                    <div
                      className={`text-xs sm:text-sm font-bold font-mono truncate ${
                        isWin ? 'text-emerald-700' : isLoss ? 'text-rose-700' : 'text-slate-700'
                      }`}
                    >
                      {isWin ? '+' : ''}
                      {formatCurrency(record.totalProfit, 0)}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-300 block">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Day Details Modal */}
      {selectedDay && (
        <DayDetailsModal
          isOpen={!!selectedDay}
          onClose={() => setSelectedDay(null)}
          dateStr={selectedDay.dateStr}
          dayData={selectedDay.dayData}
        />
      )}
    </div>
  );
};

export default JournalCalendar;

