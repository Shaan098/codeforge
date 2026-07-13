/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Lock,
  Play,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { request } from '../services/index.js';

export default function Contests({ onSelectProblem }) {
  const [contests, setContests] = React.useState([]);
  const [problems, setProblems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [registeredContests, setRegisteredContests] = React.useState([]);
  const [activeVirtual, setActiveVirtual] = React.useState(null);

  // Load contests and problems
  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      request('/contests').then(res => res.data),
      request('/problems').then(res => res.data)
    ])
      .then(([contestsData, problemsData]) => {
        setContests(contestsData.contests || []);
        setProblems(problemsData.problems || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleRegister = (contestId) => {
    if (registeredContests.includes(contestId)) return;
    setRegisteredContests([...registeredContests, contestId]);
    alert('Registration confirmed successfully! We have added this contest timer to your dashboard.');
  };

  const navigateToContestProblem = (contest) => {
    if (contest.problems && contest.problems.length > 0) {
      const firstProblemId = contest.problems[0];
      const foundProblem = problems.find(p => p.id === firstProblemId);
      if (foundProblem) {
        onSelectProblem(foundProblem.slug);
        return;
      }
    }
    // Fallback
    onSelectProblem('two-sum');
  };

  const handleStartVirtual = (contest) => {
    setActiveVirtual(contest.id);
    alert('Virtual Contest Mode engaged! You have 2 hours to solve the assigned algorithm set.');
    navigateToContestProblem(contest);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Contest Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/10 bg-linear-to-r from-slate-900 to-amber-950/20 p-6 sm:p-8 shadow-md">
        <div className="absolute top-[-30%] right-[-10%] w-72 h-72 rounded-full bg-amber-500/10 blur-[60px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
              <Sparkles className="h-3 w-3" />
              <span>WEEKLY TOURNAMENTS</span>
            </div>
            <h2 className="font-sans font-extrabold text-2xl text-white tracking-tight">
              CodeForge Cup #18
            </h2>
            <p className="max-w-md text-slate-400 text-xs sm:text-sm">
              Participate in our premium live tournaments alongside 5,000+ engineers globally. Top 3 scorers unlock exclusive physical swag, developer profile plaques, and recruiter referrals.
            </p>
          </div>

          <div className="flex flex-col items-end space-y-2 bg-slate-950/40 p-4 rounded-xl border border-white/5 backdrop-blur-md">
            <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-widest">Starts In</span>
            <span className="font-mono text-xl font-bold text-amber-400">22h : 45m : 12s</span>
            <button 
              onClick={() => handleRegister('cup-18')}
              className="rounded-lg bg-amber-500 hover:bg-amber-400 px-4 py-1.5 text-xs font-bold text-slate-950 cursor-pointer shadow-md"
            >
              {registeredContests.includes('cup-18') ? 'Registered ✔' : 'Register Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Contests Lists splits */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Running & Upcoming Contests */}
        <div className="space-y-4">
          <h3 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
            Active & Registration Pools
          </h3>

          {loading ? (
            <div className="py-6 text-center text-slate-500 font-mono text-xs">
              Resolving tournament blocks...
            </div>
          ) : (
            contests.filter(c => c.status !== 'Past').map(contest => {
              const isRegistered = registeredContests.includes(contest.id);
              const isActive = contest.status === 'Running' || contest.status === 'Active';
              return (
                <div 
                  key={contest.id}
                  className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-4 shadow-md backdrop-blur-md hover:border-amber-500/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-amber-500">
                      {contest.title}
                    </span>
                    <span className={`rounded-md border px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                      isActive 
                        ? 'text-green-400 bg-green-500/5 border-green-500/10 animate-pulse' 
                        : 'text-yellow-400 bg-yellow-500/5 border-yellow-500/10'
                    }`}>
                      {isActive ? 'Active' : contest.status}
                    </span>
                  </div>

                  <p className="text-slate-400 text-xs">
                    {contest.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-500 border-t border-white/5 pt-3.5">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{contest.durationMinutes} Mins</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Users className="h-3.5 w-3.5" />
                      <span>{contest.participants?.length || 0} Registered</span>
                    </span>
                  </div>

                  {isActive ? (
                    <button 
                      onClick={() => navigateToContestProblem(contest)}
                      className="flex w-full items-center justify-center space-x-1.5 rounded-lg bg-green-500 hover:bg-green-400 py-2 text-xs font-bold text-slate-950 cursor-pointer transition-colors"
                    >
                      <Play className="h-3.5 w-3.5 fill-slate-950" />
                      <span>Join Live Arena</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleRegister(contest.id)}
                      className={`flex w-full items-center justify-center space-x-1.5 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                        isRegistered 
                          ? 'bg-white/5 border border-white/5 text-slate-400' 
                          : 'bg-white/5 border border-white/5 hover:bg-white/10 text-white'
                      }`}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>{isRegistered ? 'Registered ✔' : 'Register Tournament'}</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Past Virtual arenas */}
        <div className="space-y-4">
          <h3 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
            Past Arenas (Virtual Practice)
          </h3>

          {contests.filter(c => c.status === 'Past').map(contest => {
            const isPracticing = activeVirtual === contest.id;
            return (
              <div 
                key={contest.id}
                className="rounded-xl border border-white/5 bg-slate-900/20 p-5 space-y-4 hover:border-amber-500/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-xs text-white">
                    {contest.title}
                  </span>
                  <span className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[9px] font-mono text-slate-400">
                    VIRTUAL ENABLED
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-white/5 pt-3">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Duration: {contest.durationMinutes} Mins</span>
                  </span>
                  <span>{contest.participants?.length || 0} Solved Set</span>
                </div>

                {isPracticing ? (
                  <button 
                    onClick={() => navigateToContestProblem(contest)}
                    className="flex w-full items-center justify-center space-x-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 py-2 text-xs font-bold cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-slate-950" />
                    <span>Resume Virtual Contest</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => handleStartVirtual(contest)}
                    className="flex w-full items-center justify-center space-x-1.5 rounded-lg border border-white/5 bg-slate-950 hover:bg-white/5 py-2 text-xs font-bold text-slate-300 cursor-pointer"
                  >
                    <span>Start Virtual Arena</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
