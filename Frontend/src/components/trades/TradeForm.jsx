import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useChallenge } from '../../context/ChallengeContext';
import { useToast } from '../../context/ToastContext';
import tradeService from '../../services/tradeService';
import { SUPPORTED_PAIRS } from '../../utils/constants';
import {
  AlertOctagon,
  ShieldCheck,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const TradeForm = ({ onTradeCreated }) => {
  const { currentChallenge, updateLocalChallenge } = useChallenge();
  const toast = useToast();

  const [pair, setPair] = useState('XAUUSD');
  const [tradeType, setTradeType] = useState('BUY');
  const [entryPrice, setEntryPrice] = useState('2650.00');
  const [exitPrice, setExitPrice] = useState('2665.00');
  const [stopLoss, setStopLoss] = useState('2640.00');
  const [takeProfit, setTakeProfit] = useState('2670.00');
  const [lotSize, setLotSize] = useState('1.00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Status checks
  const isChallengeActive = currentChallenge?.status === 'Active';
  const isNotStarted = currentChallenge?.status === 'Not-Started';
  const isFailed = currentChallenge?.status === 'Failed';
  const isPassed = currentChallenge?.status === 'Passed';
  const isInactive = currentChallenge?.status === 'Inactive';

  const isFormDisabled = !isChallengeActive || isSubmitting;

  const handlePairChange = (e) => {
    const selectedPair = e.target.value;
    setPair(selectedPair);
    const spec = SUPPORTED_PAIRS.find((p) => p.value === selectedPair);
    if (spec && spec.defaultPrice) {
      const price = spec.defaultPrice;
      setEntryPrice(price.toString());
      setExitPrice((tradeType === 'BUY' ? price * 1.005 : price * 0.995).toFixed(spec.pipSize < 0.01 ? 4 : 2));
      setStopLoss((tradeType === 'BUY' ? price * 0.99 : price * 1.01).toFixed(spec.pipSize < 0.01 ? 4 : 2));
      setTakeProfit((tradeType === 'BUY' ? price * 1.015 : price * 0.985).toFixed(spec.pipSize < 0.01 ? 4 : 2));
    }
  };

  const handleTypeChange = (type) => {
    setTradeType(type);
    const entry = parseFloat(entryPrice) || 0;
    if (entry > 0) {
      const spec = SUPPORTED_PAIRS.find((p) => p.value === pair);
      const decimals = spec && spec.pipSize < 0.01 ? 4 : 2;
      setExitPrice((type === 'BUY' ? entry * 1.005 : entry * 0.995).toFixed(decimals));
      setStopLoss((type === 'BUY' ? entry * 0.99 : entry * 1.01).toFixed(decimals));
      setTakeProfit((type === 'BUY' ? entry * 1.015 : entry * 0.985).toFixed(decimals));
    }
  };

  // Quick RR calculation preview
  const entry = parseFloat(entryPrice) || 0;
  const sl = parseFloat(stopLoss) || 0;
  const tp = parseFloat(takeProfit) || 0;
  const risk = Math.abs(entry - sl);
  const reward = Math.abs(tp - entry);
  const estimatedRR = risk > 0 ? (reward / risk).toFixed(2) : '1.00';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!currentChallenge?._id) {
      setFormError('Please select and start a challenge first.');
      return;
    }

    if (!isChallengeActive) {
      setFormError(`Cannot place trade. Challenge status is ${currentChallenge?.status}.`);
      return;
    }

    const entryNum = parseFloat(entryPrice);
    const exitNum = parseFloat(exitPrice);
    const slNum = parseFloat(stopLoss);
    const tpNum = parseFloat(takeProfit);
    const lotNum = parseFloat(lotSize);

    if (isNaN(entryNum) || entryNum <= 0) {
      setFormError('Valid Entry Price is required.');
      return;
    }
    if (isNaN(exitNum) || exitNum <= 0) {
      setFormError('Valid Exit Price is required.');
      return;
    }
    if (isNaN(slNum) || slNum <= 0) {
      setFormError('Valid Stop Loss is required.');
      return;
    }
    if (isNaN(tpNum) || tpNum <= 0) {
      setFormError('Valid Take Profit is required.');
      return;
    }
    if (isNaN(lotNum) || lotNum <= 0) {
      setFormError('Lot size must be greater than 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        challenge_id: currentChallenge._id,
        pair,
        tradeType,
        entryPrice: entryNum,
        exitPrice: exitNum,
        stopLoss: slNum,
        takeProfit: tpNum,
        lotSize: lotNum,
      };

      const result = await tradeService.createTrade(payload);
      
      // Update local challenge data with returned updated challenge document
      if (result.challenge) {
        updateLocalChallenge(result.challenge);
      }

      toast.success(
        `Trade placed on ${pair} (${tradeType}) with P&L: ${result.trade?.result >= 0 ? '+' : ''}$${result.trade?.result?.toFixed(2)}`,
        'Trade Executed'
      );

      if (onTradeCreated) {
        onTradeCreated(result);
      }
    } catch (err) {
      console.error('Trade creation failed:', err);
      const errMsg = err.response?.data?.error || err.message || 'Failed to place trade';
      setFormError(errMsg);
      toast.error(errMsg, 'Execution Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card padding="p-6" className="relative shadow-md">
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-mono tracking-tight">
              Trade Execution
            </h3>
            <p className="text-xs text-slate-500">
              Submit simulated market or closed position orders
            </p>
          </div>
        </div>

        {/* Live RR Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
          <span className="text-slate-500">Est. R:R</span>
          <span className="font-bold text-blue-700">1 : {estimatedRR}</span>
        </div>
      </div>

      {/* Status Warning Banners */}
      {isNotStarted && (
        <div className="mb-6 p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-sm flex items-center gap-3">
          <AlertOctagon className="w-5 h-5 text-slate-500 flex-shrink-0" />
          <div>
            <span className="font-bold block">Challenge Not Started</span>
            Navigate to the Rules page and click <strong>"Start Challenge"</strong> before placing trades.
          </div>
        </div>
      )}

      {isFailed && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
          <AlertOctagon className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">Challenge Failed</span>
            A drawdown rule was breached. Trade execution is permanently disabled for this account.
          </div>
        </div>
      )}

      {isPassed && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">Challenge Passed!</span>
            Congratulations! You have completed all challenge objectives. Trade placement is closed.
          </div>
        </div>
      )}

      {isInactive && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm flex items-center gap-3">
          <AlertOctagon className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">Challenge Inactive</span>
            No trading activity was detected within the allowed period. Account is locked.
          </div>
        </div>
      )}

      {formError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {formError}
        </div>
      )}

      {/* Execution Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Trade Type Selection (BUY / SELL Toggle) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
            Order Side
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isFormDisabled}
              onClick={() => handleTypeChange('BUY')}
              className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 border ${
                tradeType === 'BUY'
                  ? 'bg-navy-950 text-white border-navy-950 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ArrowUpRight className="w-4 h-4" />
              BUY / LONG
            </button>

            <button
              type="button"
              disabled={isFormDisabled}
              onClick={() => handleTypeChange('SELL')}
              className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 border ${
                tradeType === 'SELL'
                  ? 'bg-navy-950 text-white border-navy-950 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ArrowDownRight className="w-4 h-4" />
              SELL / SHORT
            </button>
          </div>
        </div>

        {/* Pair & Lot Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
              Trading Pair
            </label>
            <select
              value={pair}
              disabled={isFormDisabled}
              onChange={handlePairChange}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm font-mono cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {SUPPORTED_PAIRS.map((p) => (
                <option key={p.value} value={p.value} className="bg-white text-slate-900">
                  {p.label} — {p.category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
              Lot Size
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="100"
              value={lotSize}
              disabled={isFormDisabled}
              onChange={(e) => setLotSize(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm font-mono disabled:opacity-50 shadow-sm text-slate-900"
              placeholder="1.00"
            />
          </div>
        </div>

        {/* Entry & Exit Prices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
              Entry Price
            </label>
            <input
              type="number"
              step="any"
              value={entryPrice}
              disabled={isFormDisabled}
              onChange={(e) => setEntryPrice(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm font-mono disabled:opacity-50 shadow-sm text-slate-900"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
              Exit Price (Closed)
            </label>
            <input
              type="number"
              step="any"
              value={exitPrice}
              disabled={isFormDisabled}
              onChange={(e) => setExitPrice(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm font-mono disabled:opacity-50 shadow-sm text-slate-900"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Stop Loss & Take Profit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
              Stop Loss (SL)
            </label>
            <input
              type="number"
              step="any"
              value={stopLoss}
              disabled={isFormDisabled}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 font-medium disabled:opacity-50 shadow-sm"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
              Take Profit (TP)
            </label>
            <input
              type="number"
              step="any"
              value={takeProfit}
              disabled={isFormDisabled}
              onChange={(e) => setTakeProfit(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 font-medium disabled:opacity-50 shadow-sm"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={isFormDisabled}
            className="w-full shadow-md"
          >
            {tradeType === 'BUY' ? 'Execute BUY Order' : 'Execute SELL Order'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TradeForm;
