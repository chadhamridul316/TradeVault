import React, { useState, useEffect } from 'react';
import { useChallenge } from '../context/ChallengeContext';
import { JournalCalendar } from '../components/journal/JournalCalendar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import journalService from '../services/journalService';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const JournalPage = () => {
  const { currentChallenge } = useChallenge();
  const [journalData, setJournalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJournal = async () => {
      if (!currentChallenge?._id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await journalService.getJournal(currentChallenge._id);
        setJournalData(data || {});
      } catch (err) {
        console.error('Failed to load journal data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadJournal();
  }, [currentChallenge?._id]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" text="Loading Trading Journal..." />
      </div>
    );
  }

  if (!currentChallenge) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <Card padding="p-8">
          <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 font-mono">No Active Challenge</h2>
          <p className="text-sm text-slate-500 mb-6">
            Choose a challenge account to log simulated trades and review your calendar journal.
          </p>
          <Link to="/challenges">
            <Button variant="aurora" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Choose Your Challenge
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <JournalCalendar journalData={journalData} />
    </div>
  );
};

export default JournalPage;

