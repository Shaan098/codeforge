/**
 * client/src/hooks/useSubmissions.js
 * Custom hook to manage submissions state for the current user.
 */

import { useState, useCallback } from 'react';
import { submissionService } from '../services';
import toast from '../utils/toast';

export function useSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubmissions = useCallback(async (userId) => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await submissionService.getByUser(userId);
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to fetch submissions';
      setError(msg);
      console.error('useSubmissions fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const seedActivity = useCallback(async () => {
    try {
      toast.info('Seeding activity data...');
      const res = await submissionService.seedActivity();
      setSubmissions(res.data.submissions || []);
      toast.success(`Seeded ${res.data.count} activities!`);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to seed activity';
      toast.error(msg);
      throw err;
    }
  }, []);

  return {
    submissions,
    isLoading,
    error,
    fetchSubmissions,
    seedActivity,
    setSubmissions,
  };
}
