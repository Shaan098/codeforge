/**
 * client/src/hooks/useProblems.js
 * Custom hook to manage problems state — fetching, searching, filtering.
 */

import { useState, useEffect, useCallback } from 'react';
import { problemService } from '../services';
import toast from '../utils/toast';

export function useProblems() {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProblems = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await problemService.getAll(params);
      setProblems(res.data.problems || []);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to fetch problems';
      setError(msg);
      console.error('useProblems fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const addProblem = useCallback(async (newProb) => {
    try {
      const res = await problemService.create(newProb);
      await fetchProblems(); // Refresh full list
      toast.success('Problem created successfully!');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to create problem';
      toast.error(msg);
      throw err;
    }
  }, [fetchProblems]);

  const removeProblem = useCallback(async (problemId) => {
    try {
      const res = await problemService.delete(problemId);
      await fetchProblems(); // Refresh
      toast.success('Problem deleted.');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to delete problem';
      toast.error(msg);
      throw err;
    }
  }, [fetchProblems]);

  return {
    problems,
    isLoading,
    error,
    refetch: fetchProblems,
    addProblem,
    removeProblem,
    setProblems,
  };
}
