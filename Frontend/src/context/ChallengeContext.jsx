import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import challengeService from '../services/challengeService';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

export const ChallengeContext = createContext(null);

export const ChallengeProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userChallenges, setUserChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all challenges for the logged-in user
  const fetchUserChallenges = useCallback(async () => {
    if (!isAuthenticated) {
      setUserChallenges([]);
      setCurrentChallenge(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await challengeService.getUserChallenges();
      setUserChallenges(data);

      // Check if there is an active challenge stored in localStorage
      const storedChallengeId = localStorage.getItem('tradevault_active_challenge_id');
      
      if (storedChallengeId) {
        const found = data.find((c) => c._id === storedChallengeId);
        if (found) {
          setCurrentChallenge(found);
        } else if (data.length > 0) {
          // Default to latest
          setCurrentChallenge(data[0]);
          localStorage.setItem('tradevault_active_challenge_id', data[0]._id);
        }
      } else if (data.length > 0) {
        // Find latest active or not-started challenge
        const activeOrRecent = data.find(c => c.status === 'Active' || c.status === 'Not-Started') || data[0];
        setCurrentChallenge(activeOrRecent);
        localStorage.setItem('tradevault_active_challenge_id', activeOrRecent._id);
      }
    } catch (err) {
      console.error('Failed to fetch user challenges:', err);
      setError(err.response?.data?.error || 'Failed to load challenges');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load challenges when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserChallenges();
    } else {
      setCurrentChallenge(null);
      setUserChallenges([]);
    }
  }, [isAuthenticated, fetchUserChallenges]);

  // Select a specific challenge
  const selectChallenge = useCallback(async (challengeOrId) => {
    if (typeof challengeOrId === 'string') {
      try {
        setIsLoading(true);
        const data = await challengeService.getChallengeById(challengeOrId);
        setCurrentChallenge(data);
        localStorage.setItem('tradevault_active_challenge_id', data._id);
        return data;
      } catch (err) {
        console.error('Failed to select challenge:', err);
        setError(err.response?.data?.error || 'Failed to select challenge');
        throw err;
      } finally {
        setIsLoading(false);
      }
    } else if (challengeOrId && challengeOrId._id) {
      setCurrentChallenge(challengeOrId);
      localStorage.setItem('tradevault_active_challenge_id', challengeOrId._id);
      return challengeOrId;
    }
  }, []);

  // Refresh current challenge from backend
  const refreshChallenge = useCallback(async () => {
    if (!currentChallenge?._id) return null;
    try {
      const updated = await challengeService.getChallengeById(currentChallenge._id);
      setCurrentChallenge(updated);
      
      // Update list
      setUserChallenges((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );

      // Trigger celebration if passed
      if (updated.status === 'Passed' && currentChallenge.status !== 'Passed') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#a855f7', '#38bdf8']
        });
      }

      return updated;
    } catch (err) {
      console.error('Failed to refresh challenge:', err);
      return null;
    }
  }, [currentChallenge]);

  // Create a new challenge
  const createChallenge = async (accountSize) => {
    setIsLoading(true);
    setError(null);
    try {
      const newChallenge = await challengeService.createChallenge(accountSize);
      setCurrentChallenge(newChallenge);
      setUserChallenges((prev) => [newChallenge, ...prev]);
      localStorage.setItem('tradevault_active_challenge_id', newChallenge._id);
      return newChallenge;
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to create challenge';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Start the active challenge
  const startActiveChallenge = async (challengeId) => {
    const idToStart = challengeId || currentChallenge?._id;
    if (!idToStart) throw new Error('No challenge ID specified');

    setIsLoading(true);
    setError(null);
    try {
      const started = await challengeService.startChallenge(idToStart);
      setCurrentChallenge(started);
      setUserChallenges((prev) =>
        prev.map((c) => (c._id === started._id ? started : c))
      );
      localStorage.setItem('tradevault_active_challenge_id', started._id);
      return started;
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to start challenge';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Direct updater for optimistic or post-trade responses
  const updateLocalChallenge = useCallback((challengeData) => {
    if (!challengeData) return;
    setCurrentChallenge(challengeData);
    setUserChallenges((prev) =>
      prev.map((c) => (c._id === challengeData._id ? challengeData : c))
    );
  }, []);

  const value = {
    currentChallenge,
    userChallenges,
    isLoading,
    error,
    selectChallenge,
    fetchUserChallenges,
    refreshChallenge,
    createChallenge,
    startActiveChallenge,
    updateLocalChallenge,
  };

  return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>;
};

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
};
