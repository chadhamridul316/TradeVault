import React, { useState } from 'react';
import { Card } from '../common/Card';
import { TradeRow } from './TradeRow';
import { ConfirmModal } from '../common/ConfirmModal';
import { EmptyState } from '../common/EmptyState';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { useToast } from '../../context/ToastContext';
import { useChallenge } from '../../context/ChallengeContext';
import tradeService from '../../services/tradeService';
import { History, ArrowLeftRight, Download } from 'lucide-react';

export const TradeTable = ({
  trades = [],
  isLoading = false,
  onTradeDeleted,
}) => {
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const { updateLocalChallenge } = useChallenge();
  const toast = useToast();

  const handleDeleteClick = (trade) => {
    setSelectedTrade(trade);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTrade) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await tradeService.deleteTrade(selectedTrade._id);
      
      // Update local challenge data if returned
      if (response.challenge) {
        updateLocalChallenge(response.challenge);
      }

      toast.success('Trade deleted successfully and balance recalculated', 'Trade Removed');
      setSelectedTrade(null);

      if (onTradeDeleted) {
        onTradeDeleted(selectedTrade._id, response);
      }
    } catch (err) {
      console.error('Failed to delete trade:', err);
      const errMsg =
        err.response?.data?.error || err.message || 'Failed to delete trade';
      setDeleteError(errMsg);
      toast.error(errMsg, 'Deletion Blocked');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card padding="p-0" className="overflow-hidden shadow-md">
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-mono">
                Trade History ({trades.length})
              </h3>
              <p className="text-xs text-slate-500">
                Complete record of all executed simulated trades
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider font-mono">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Pair</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Entry</th>
                  <th className="py-3 px-4">Exit</th>
                  <th className="py-3 px-4">SL</th>
                  <th className="py-3 px-4">TP</th>
                  <th className="py-3 px-4">Lots</th>
                  <th className="py-3 px-4">P&L</th>
                  <th className="py-3 px-4">Step</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <LoadingSkeleton variant="table-row" count={4} />
              </tbody>
            </table>
          </div>
        ) : trades.length === 0 ? (
          /* Empty State */
          <div className="p-8">
            <EmptyState
              icon={ArrowLeftRight}
              title="No trades yet."
              description="Place your first trade to start building your journal and challenge history."
            />
          </div>
        ) : (
          /* Trades Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider font-mono">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Pair</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Entry</th>
                  <th className="py-3 px-4">Exit</th>
                  <th className="py-3 px-4">SL</th>
                  <th className="py-3 px-4">TP</th>
                  <th className="py-3 px-4">Lots</th>
                  <th className="py-3 px-4">P&L</th>
                  <th className="py-3 px-4">Step</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-transparent">
                {trades.map((trade) => (
                  <TradeRow
                    key={trade._id}
                    trade={trade}
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!selectedTrade}
        onClose={() => {
          setSelectedTrade(null);
          setDeleteError(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        error={deleteError}
        title="Delete Trade Execution"
        description={
          selectedTrade
            ? `Are you sure you want to delete this ${selectedTrade.pair} (${selectedTrade.tradeType}) trade? This will recalculate the account balance, win rate, and drawdown.`
            : 'Are you sure you want to delete this trade?'
        }
        confirmText="Delete Trade"
      />
    </>
  );
};

export default TradeTable;

