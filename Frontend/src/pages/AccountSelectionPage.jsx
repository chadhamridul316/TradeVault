import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChallenge } from '../context/ChallengeContext';
import { useToast } from '../context/ToastContext';
import { ChallengeCard } from '../components/challenge/ChallengeCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { ACCOUNT_TIERS } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

export const AccountSelectionPage = () => {
  const { userChallenges, createChallenge, selectChallenge } = useChallenge();
  const [selectedSize, setSelectedSize] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();

  // Find active or unstarted challenge
  const ongoingChallenge = userChallenges.find(
    (c) => c.status === 'Active' || c.status === 'Not-Started'
  );

  const handleSelectTier = async (size) => {
    setSelectedSize(size);
    setErrorMsg(null);
    setIsCreating(true);

    try {
      const created = await createChallenge(size);
      toast.success(
        `Created ${formatCurrency(size, 0)} challenge. Review rules to get started.`,
        'Challenge Created'
      );
      navigate(`/challenges/${created._id}/rules`);
    } catch (err) {
      console.error('Challenge creation error:', err);
      const msg =
        err.message || 'Please complete your ongoing challenge before creating a new one.';
      setErrorMsg(msg);
      toast.error(msg, 'Cannot Create Challenge');
    } finally {
      setIsCreating(false);
    }
  };

  const handleResumeChallenge = async (challenge) => {
    await selectChallenge(challenge);
    if (challenge.status === 'Not-Started') {
      navigate(`/challenges/${challenge._id}/rules`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Ongoing Challenge Alert Banner (if user already has one active) */}
      {ongoingChallenge && (
        <Card
          padding="p-6"
          className="border-blue-200/80 bg-[#fbfcfd] shadow-md"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
                    Ongoing Simulated Challenge
                  </span>
                  <StatusBadge status={ongoingChallenge.status} size="sm" />
                </div>
                <h3 className="text-xl font-bold font-mono text-slate-900">
                  {formatCurrency(ongoingChallenge.accountSize, 0)} Account (Step {ongoingChallenge.currentStep || 1})
                </h3>
                <p className="text-xs text-slate-500">
                  Balance: {formatCurrency(ongoingChallenge.balance || ongoingChallenge.accountSize)}
                </p>
              </div>
            </div>

            <Button
              variant="aurora"
              size="md"
              onClick={() => handleResumeChallenge(ongoingChallenge)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {ongoingChallenge.status === 'Not-Started' ? 'Review & Start' : 'Enter Terminal'}
            </Button>
          </div>
        </Card>
      )}

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Simulated Capital Allocation Tiers
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-slate-900">
          Choose Your <span className="text-aurora">Challenge</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          Prove your edge, follow strict risk management rules, and scale your simulated trading account.
          Select your desired capital tier below.
        </p>
      </div>

      {errorMsg && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Five Account Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {ACCOUNT_TIERS.map((tier) => (
          <ChallengeCard
            key={tier.size}
            tier={tier}
            selected={selectedSize === tier.size}
            isLoading={isCreating && selectedSize === tier.size}
            onSelect={handleSelectTier}
          />
        ))}
      </div>

      {/* Challenge History Section if user has previous challenges */}
      {userChallenges.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-mono text-slate-900">Your Challenge History</h3>
              <p className="text-xs text-slate-500">All registered challenge accounts under your trader ID</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userChallenges.map((c) => (
              <Card key={c._id} padding="p-4" hover className="cursor-pointer shadow-sm" onClick={() => handleResumeChallenge(c)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold font-mono text-base text-slate-900">
                    {formatCurrency(c.accountSize, 0)}
                  </span>
                  <StatusBadge status={c.status} size="sm" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Balance: {formatCurrency(c.balance || c.accountSize)}</span>
                  <span>Step {c.currentStep || 1}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSelectionPage;

