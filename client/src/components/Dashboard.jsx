/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  Clock, 
  ChevronRight,
  Code2,
  Trophy,
  Award
} from 'lucide-react';
import ContributionGraph from './ContributionGraph.jsx';

export default function Dashboard({ 
  currentUser, 
  problems, 
  submissions, 
  onSelectProblem, 
  setActiveTab, 
  onRefreshUserData,
  isLoading
}) {
  const [hoveredBar, setHoveredBar] = React.useState(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        
        {/* Welcome Banner Skeleton */}
        <div className="relative overflow-hidden rounded-2xl border border-[#27272a] bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-md">
          <div className="absolute top-[-40%] right-[-10%] w-72 h-72 rounded-full bg-violet-600/5 blur-[60px]" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
              <div className="h-8 w-64 bg-zinc-700/80 rounded animate-pulse" />
              <div className="h-10 w-80 sm:w-[450px] bg-zinc-800 rounded animate-pulse" />
            </div>

            {/* Quick stats panel skeleton */}
            <div className="flex items-center space-x-6 bg-white/5 rounded-xl border border-[#27272a] p-4 backdrop-blur-md animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-zinc-800" />
                <div>
                  <div className="h-5 w-8 bg-zinc-700 rounded mb-1" />
                  <div className="h-2.5 w-16 bg-zinc-800 rounded" />
                </div>
              </div>
              
              <div className="h-8 w-[1px] bg-white/5" />

              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-zinc-800" />
                <div>
                  <div className="h-5 w-8 bg-zinc-700 rounded mb-1" />
                  <div className="h-2.5 w-16 bg-zinc-800 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Submissions Heatmap ContributionGraph Skeleton */}
        <ContributionGraph 
          currentUser={currentUser} 
          submissions={submissions} 
          onRefreshUserData={onRefreshUserData} 
          isLoading={true}
        />

        {/* Bento Grid Analytics Skeleton */}
        <div className="grid md:grid-cols-12 gap-6">
          
          {/* Solved Progress Circle & Topic Stats (recharts) Skeleton */}
          <div className="md:col-span-7 rounded-2xl border border-[#27272a] bg-[#18181b]/40 p-5 backdrop-blur-md flex flex-col space-y-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-4 w-44 bg-zinc-800 rounded" />
              <div className="h-3.5 w-32 bg-zinc-800 rounded" />
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Visual Stats Bar chart skeleton */}
              <div className="col-span-8 h-44 flex flex-col justify-between pt-2 pb-1 relative">
                <div className="flex h-32 items-end justify-between px-2 pt-2 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const heights = ['h-16', 'h-24', 'h-12', 'h-28', 'h-8'];
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div className={`w-full max-w-[24px] rounded-t-md bg-zinc-800/80 ${heights[i-1]}`} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between border-t border-[#27272a] pt-1.5 pb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-2 w-8 bg-zinc-800 rounded" />
                  ))}
                </div>
              </div>

              {/* Circular summary cards skeleton */}
              <div className="col-span-4 space-y-3.5">
                <div className="rounded-lg bg-white/5 p-3 border border-[#27272a] h-[58px] flex flex-col justify-center items-center">
                  <div className="h-4 w-10 bg-zinc-700 rounded mb-1" />
                  <div className="h-2 w-16 bg-zinc-800 rounded" />
                </div>
                <div className="rounded-lg bg-white/5 p-3 border border-[#27272a] h-[58px] flex flex-col justify-center items-center">
                  <div className="h-4 w-10 bg-zinc-700 rounded mb-1" />
                  <div className="h-2 w-16 bg-zinc-800 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Achievements & Milestones Skeleton */}
          <div className="md:col-span-5 rounded-2xl border border-[#27272a] bg-[#18181b]/40 p-5 backdrop-blur-md flex flex-col justify-between space-y-4 animate-pulse">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="h-4 w-36 bg-zinc-800 rounded" />
              <div className="h-5 w-16 bg-zinc-800 rounded" />
            </div>

            {/* Active Streak Counter skeleton */}
            <div className="flex items-center justify-between bg-zinc-950/40 rounded-xl p-3 border border-[#27272a] h-[54px]">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded bg-zinc-800" />
                <div>
                  <div className="h-2 w-16 bg-zinc-800 rounded mb-1.5" />
                  <div className="h-3.5 w-24 bg-zinc-700 rounded" />
                </div>
              </div>
              <div>
                <div className="h-2 w-12 bg-zinc-800 rounded mb-1.5" />
                <div className="h-3 w-8 bg-zinc-700 rounded" />
              </div>
            </div>

            {/* Badge Showcase skeleton */}
            <div className="space-y-2">
              <div className="h-3 w-28 bg-zinc-800 rounded mb-2" />
              <div className="grid grid-cols-2 gap-2 h-[110px]">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-2 bg-white/5 border border-[#27272a] rounded-lg p-2 h-[42px]">
                    <div className="h-6 w-6 rounded bg-zinc-800 shrink-0" />
                    <div className="space-y-1 w-full min-w-0">
                      <div className="h-2 w-16 bg-zinc-700 rounded" />
                      <div className="h-1.5 w-12 bg-zinc-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Recommended & Daily Challenge Section Skeleton */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Daily challenge card skeleton */}
          <div className="lg:col-span-5 rounded-2xl border border-violet-500/5 bg-gradient-to-b from-zinc-900 to-violet-950/5 p-6 flex flex-col justify-between space-y-6 relative overflow-hidden animate-pulse h-[230px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 bg-zinc-800 rounded" />
                <div className="h-4 w-12 bg-zinc-800 rounded" />
              </div>
              
              <div className="h-5 w-32 bg-zinc-700 rounded" />
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-zinc-800 rounded" />
                <div className="h-3 w-[90%] bg-zinc-800 rounded" />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="h-4 w-12 bg-zinc-800 rounded" />
              <div className="h-4 w-16 bg-zinc-800 rounded" />
              <div className="h-4 w-10 bg-zinc-800 rounded" />
            </div>

            <div className="h-9 w-full bg-zinc-800 rounded-xl" />
          </div>

          {/* Recommended Problems skeleton */}
          <div className="lg:col-span-7 rounded-2xl border border-[#27272a] bg-[#18181b]/40 p-5 backdrop-blur-md flex flex-col justify-between space-y-4 animate-pulse h-[230px]">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="h-4 w-40 bg-zinc-800 rounded" />
              <div className="h-3.5 w-12 bg-zinc-800 rounded" />
            </div>

            <div className="divide-y divide-[#27272a] space-y-3.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between pt-3.5 first:pt-0">
                  <div className="space-y-1.5">
                    <div className="h-3 w-36 bg-zinc-700 rounded" />
                    <div className="h-2 w-24 bg-zinc-800 rounded" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-4.5 w-12 bg-zinc-800 rounded" />
                    <div className="h-4 w-4 bg-zinc-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Recent Activity List Skeleton */}
        <div className="rounded-2xl border border-[#27272a] bg-[#18181b]/40 p-5 backdrop-blur-md animate-pulse">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3 mb-4">
            <div className="h-4 w-44 bg-zinc-800 rounded" />
            <div className="h-3 w-28 bg-zinc-800 rounded" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-zinc-900 last:border-0 pb-3 last:pb-0">
                <div className="h-3.5 w-40 bg-zinc-700 rounded" />
                <div className="h-4.5 w-14 bg-zinc-800 rounded" />
                <div className="h-3 w-16 bg-zinc-800 rounded" />
                <div className="h-3 w-12 bg-zinc-800 rounded" />
                <div className="h-3 w-20 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // Find a recommended problem that hasn't been solved or is Medium/Hard
  const solvedProblemIds = submissions.filter(s => s.status === 'Accepted').map(s => s.problemId);
  const recommendedProblems = problems.filter(p => !solvedProblemIds.includes(p.id)).slice(0, 3);
  
  // If all are solved, show Hard/Medium problems
  const fallbackProblems = recommendedProblems.length > 0 
    ? recommendedProblems 
    : problems.filter(p => p.difficulty !== 'Easy').slice(0, 3);

  // Stats
  const solvedCount = new Set(submissions.filter(s => s.status === 'Accepted').map(s => s.problemId)).size;
  const totalSubCount = submissions.length;
  const acceptedSubCount = submissions.filter(s => s.status === 'Accepted').length;
  const acceptanceRate = totalSubCount > 0 ? Math.round((acceptedSubCount / totalSubCount) * 100) : 0;

  // Recharts Chart Data: Problem distribution by Category tags
  const tagData = [
    { name: 'Array', solved: submissions.filter(s => s.status === 'Accepted' && problems.find(p => p.id === s.problemId)?.tags.includes('Array')).length, total: problems.filter(p => p.tags.includes('Array')).length },
    { name: 'String', solved: submissions.filter(s => s.status === 'Accepted' && problems.find(p => p.id === s.problemId)?.tags.includes('String')).length, total: problems.filter(p => p.tags.includes('String')).length },
    { name: 'Hash Table', solved: submissions.filter(s => s.status === 'Accepted' && problems.find(p => p.id === s.problemId)?.tags.includes('Hash Table')).length, total: problems.filter(p => p.tags.includes('Hash Table')).length },
    { name: 'DP', solved: submissions.filter(s => s.status === 'Accepted' && problems.find(p => p.id === s.problemId)?.tags.includes('Dynamic Programming')).length, total: problems.filter(p => p.tags.includes('Dynamic Programming')).length },
    { name: 'Stack', solved: submissions.filter(s => s.status === 'Accepted' && problems.find(p => p.id === s.problemId)?.tags.includes('Stack')).length, total: problems.filter(p => p.tags.includes('Stack')).length },
  ];

  // Colors for the Recharts Bar chart (violet glass theme)
  const COLORS = ['#8b5cf6', '#7c3aed', '#6d28d9', '#4f46e5', '#3b82f6'];

  // Heatmap: Simulate 7 columns representing weeks, 7 rows representing days
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const heatmapGrid = Array.from({ length: 28 }, (_, i) => {
    // Generate static activity levels for visual beauty
    const dateIdx = 27 - i;
    const isToday = dateIdx === 0;
    // Higher activity levels on recent days for realism
    let activity = 0;
    if (isToday && solvedCount > 0) activity = 3;
    else if (dateIdx % 5 === 0) activity = 2;
    else if (dateIdx % 3 === 0) activity = 1;
    else if (dateIdx % 7 === 0) activity = 4;
    return { level: activity, idx: dateIdx };
  });

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#27272a] bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-md">
        <div className="absolute top-[-40%] right-[-10%] w-72 h-72 rounded-full bg-violet-600/10 blur-[60px]" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-400">
              <Sparkles className="h-3 w-3" />
              <span>CODER PROFILE LIVE</span>
            </div>
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Welcome Back, {currentUser.username}!
            </h2>
            <p className="max-w-md text-slate-400 text-xs sm:text-sm">
              Your streak is blazing! Tackle today's Dynamic Programming challenge or optimize your previous submissions to unlock the **Apex Coder** badge.
            </p>
          </div>

          {/* Quick stats panel */}
          <div className="flex items-center space-x-6 bg-white/5 rounded-xl border border-[#27272a] p-4 backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/15 text-violet-400">
                <Flame className="h-5.5 w-5.5 fill-violet-400" />
              </div>
              <div>
                <span className="block font-mono text-xl font-bold text-violet-400">
                  {currentUser.currentStreak}
                </span>
                <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Current Streak
                </span>
              </div>
            </div>
            
            <div className="h-8 w-[1px] bg-white/5" />

            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/15 text-indigo-400">
                <Trophy className="h-5.5 w-5.5" />
              </div>
              <div>
                <span className="block font-mono text-xl font-bold text-indigo-400">
                  {currentUser.longestStreak}
                </span>
                <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Longest Streak
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Submissions Heatmap ContributionGraph */}
      <ContributionGraph 
        currentUser={currentUser} 
        submissions={submissions} 
        onRefreshUserData={onRefreshUserData} 
        isLoading={isLoading}
      />

      {/* Bento Grid Analytics */}
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Solved Progress Circle & Topic Stats (recharts) */}
        <div className="md:col-span-7 rounded-2xl border border-[#27272a] bg-[#18181b]/40 p-5 backdrop-blur-md flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
              Topic Progress & Solved Analytics
            </h3>
            <span className="text-[10px] font-mono text-[#a1a1aa]">
              {solvedCount} / {problems.length} Problems Solved
            </span>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Visual Stats Bar chart (Custom High-End Grid Bar chart for flawless React 19 execution) */}
            <div className="col-span-8 h-44 flex flex-col justify-between relative select-none">
              
              {/* Custom interactive tooltip state */}
              {hoveredBar !== null && (
                <div 
                  className="absolute z-30 bg-[#09090b] border border-[#27272a] rounded-lg p-2.5 text-[10px] pointer-events-none transition-all duration-150 shadow-2xl space-y-1"
                  style={{
                    left: `${Math.max(10, Math.min(90, (hoveredBar / (tagData.length - 1)) * 100))}%`,
                    transform: 'translate(-50%, -45px)',
                    top: '20px'
                  }}
                >
                  <div className="font-bold text-white font-sans">{tagData[hoveredBar].name}</div>
                  <div className="font-mono text-violet-400 font-bold flex items-center space-x-1">
                    <span>Solved: {tagData[hoveredBar].solved} / {tagData[hoveredBar].total}</span>
                    <span className="text-slate-500">•</span>
                    <span>{tagData[hoveredBar].total > 0 ? Math.round((tagData[hoveredBar].solved / tagData[hoveredBar].total) * 100) : 0}%</span>
                  </div>
                </div>
              )}

              {/* Horizontal grid lines overlay */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-2">
                <div className="border-b border-white/5 w-full h-[1px]" />
                <div className="border-b border-white/5 w-full h-[1px]" />
                <div className="border-b border-white/5 w-full h-[1px]" />
                <div className="border-b border-white/5 w-full h-[1px]" />
              </div>

              {/* Chart Bars Section */}
              <div className="relative z-10 flex h-32 items-end justify-between px-2 pt-2">
                {tagData.map((entry, idx) => {
                  const maxTotal = Math.max(...tagData.map(t => t.total), 1);
                  const percentage = entry.total > 0 ? (entry.solved / maxTotal) * 100 : 0;
                  const heightPercentage = Math.max(8, percentage); // Ensure a small elegant indicator even if 0
                  
                  return (
                    <div 
                      key={entry.name}
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="flex flex-col items-center flex-1 group cursor-pointer h-full justify-end relative px-1"
                    >
                      {/* Bar fill */}
                      <div 
                        className="w-full max-w-[24px] rounded-t-md transition-all duration-500 ease-out relative"
                        style={{ 
                          height: `${heightPercentage}%`,
                          backgroundColor: COLORS[idx % COLORS.length],
                          boxShadow: hoveredBar === idx ? `0 0 15px ${COLORS[idx % COLORS.length]}80` : 'none'
                        }}
                      >
                        {/* Shimmer overlay effect on hover */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-t-md transition-opacity duration-300" />
                        
                        {/* Value label on top of bar */}
                        {entry.solved > 0 && (
                          <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold text-slate-300">
                            {entry.solved}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X Axis labels */}
              <div className="flex justify-between border-t border-[#27272a] pt-1.5 pb-1 relative z-10">
                {tagData.map((entry, idx) => (
                  <div 
                    key={entry.name}
                    className={`text-[9px] text-center flex-1 font-sans font-medium transition-colors ${
                      hoveredBar === idx ? 'text-violet-400 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {entry.name}
                  </div>
                ))}
              </div>

            </div>

            {/* Circular summary cards */}
            <div className="col-span-4 space-y-3.5">
              <div className="rounded-lg bg-white/5 p-3 border border-[#27272a] text-center">
                <span className="block font-mono text-lg font-bold text-white">
                  {acceptanceRate}%
                </span>
                <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                  Acceptance Rate
                </span>
              </div>
              <div className="rounded-lg bg-white/5 p-3 border border-[#27272a] text-center">
                <span className="block font-mono text-lg font-bold text-violet-400">
                  {currentUser.xp}
                </span>
                <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                  Total XP Earned
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements & Milestones */}
        <div className="md:col-span-5 rounded-2xl border border-[#27272a] bg-[#18181b]/40 p-5 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Award className="h-4 w-4 text-amber-400" />
              <span>Streak & Milestones</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md font-bold">
              Level {currentUser.level}
            </span>
          </div>

          {/* Active Streak Counter */}
          <div className="flex items-center justify-between bg-zinc-950/40 rounded-xl p-3 border border-[#27272a]">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Flame className="h-5.5 w-5.5 fill-amber-400" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Current Streak</span>
                <span className="block font-mono text-xs font-bold text-white">
                  {currentUser.currentStreak} Days Consistent
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Best Streak</span>
              <span className="block font-mono text-xs font-bold text-amber-300">
                {currentUser.longestStreak} Days
              </span>
            </div>
          </div>

          {/* Badge Showcase */}
          <div className="space-y-2">
            <div className="text-[10px] text-[#71717a] font-bold uppercase tracking-wider">
              Unlocked Badges ({currentUser.badges?.length || 0})
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[110px] overflow-y-auto pr-1">
              {currentUser.badges && currentUser.badges.length > 0 ? (
                currentUser.badges.map((badge, idx) => {
                  return (
                    <div 
                      key={badge.id || idx}
                      className="flex items-center space-x-2 bg-white/5 border border-[#27272a] rounded-lg p-2 transition-all hover:bg-white/10"
                      title={badge.description}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-400">
                        <Award className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] font-bold text-slate-200 truncate">{badge.title}</div>
                        <div className="text-[8px] text-slate-400 truncate">{badge.description}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center text-slate-500 text-[10px] py-4">
                  No badges unlocked yet. Solve challenges to earn!
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Recommended & Daily Challenge Section */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Daily challenge card */}
        <div className="lg:col-span-5 rounded-2xl border border-violet-500/10 bg-gradient-to-b from-zinc-900 to-violet-950/10 p-6 flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-36 h-36 rounded-full bg-violet-500/5 blur-[40px]" />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold tracking-widest text-violet-400 uppercase">
                ⚡ Daily Challenge
              </span>
              <span className="font-sans font-bold text-[10px] text-violet-400 rounded-md bg-violet-500/10 border border-violet-500/20 px-2 py-0.5">
                +150 XP
              </span>
            </div>
            
            <h4 className="font-sans font-extrabold text-base text-white hover:text-violet-400 transition-colors cursor-pointer" onClick={() => onSelectProblem('two-sum')}>
              Two Sum
            </h4>
            
            <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
              Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. Use a hash map lookup for a linear-time optimization.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[9px] text-slate-400">Array</span>
            <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[9px] text-slate-400">Hash Table</span>
            <span className="rounded-md bg-green-500/10 border border-green-500/20 px-2 py-0.5 font-sans font-bold text-[9px] text-green-400">Easy</span>
          </div>

          <button
            onClick={() => onSelectProblem('two-sum')}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-violet-600 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-violet-500 transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            id="dashboard-solve-daily"
          >
            <span>Solve Daily Challenge</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Recommended Problems */}
        <div className="lg:col-span-7 rounded-2xl border border-[#27272a] bg-[#18181b]/40 p-5 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
              <BookOpen className="h-4 w-4 text-violet-400" />
              <span>Recommended Algorithms</span>
            </h3>
            <button 
              onClick={() => setActiveTab('problems')}
              className="font-sans text-[10px] text-violet-400 hover:text-violet-300 font-bold uppercase tracking-wider flex items-center cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#27272a]">
            {fallbackProblems.map((prob) => {
              const diffColors = {
                Easy: 'text-green-400 bg-green-500/5 border-green-500/10',
                Medium: 'text-yellow-400 bg-yellow-500/5 border-yellow-500/10',
                Hard: 'text-red-400 bg-red-500/5 border-red-500/10',
              };
              return (
                <div 
                  key={prob.id} 
                  onClick={() => onSelectProblem(prob.slug)}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 hover:bg-white/5 rounded-lg px-2.5 transition-all cursor-pointer group"
                >
                  <div className="space-y-1">
                    <span className="block font-sans font-bold text-xs text-white group-hover:text-violet-400 transition-colors">
                      {prob.title}
                    </span>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                      <span>Acc: {prob.acceptanceRate}%</span>
                      <span>•</span>
                      <span>{prob.tags.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`rounded-md border px-2 py-0.5 font-sans font-bold text-[9px] uppercase ${diffColors[prob.difficulty]}`}>
                      {prob.difficulty}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Activity List */}
      <div className="rounded-2xl border border-[#27272a] bg-[#18181b]/40 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-3 mb-4">
          <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="h-4 w-4 text-violet-400" />
            <span>Recent Code Submissions</span>
          </h3>
          <span className="text-[10px] font-mono text-[#71717a]">
            Showing last {Math.min(5, submissions.length)} runs
          </span>
        </div>

        {submissions.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No compilation runs logged in this sandbox. Solve your first problem to populate logs!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-[#27272a]">
                  <th className="pb-3.5 font-bold uppercase tracking-wider">Problem</th>
                  <th className="pb-3.5 font-bold uppercase tracking-wider">Status</th>
                  <th className="pb-3.5 font-bold uppercase tracking-wider">Language</th>
                  <th className="pb-3.5 font-bold uppercase tracking-wider">Execution Time</th>
                  <th className="pb-3.5 font-bold uppercase tracking-wider text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]">
                {submissions.slice(0, 5).map((sub) => {
                  const statusColors = {
                    Accepted: 'text-green-400 bg-green-500/10 border-green-500/20',
                    'Wrong Answer': 'text-red-400 bg-red-500/10 border-red-500/20',
                    'Compilation Error': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
                    'Runtime Error': 'text-red-400 bg-red-500/10 border-red-500/20',
                    'Time Limit Exceeded': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
                  };
                  return (
                    <tr 
                      key={sub.id} 
                      onClick={() => onSelectProblem(sub.problemSlug)}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 font-semibold text-white group-hover:text-violet-400 transition-colors">
                        {sub.problemTitle}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-[9px] font-bold ${statusColors[sub.status] || 'text-slate-400'}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[#a1a1aa] uppercase text-[10px]">
                        {sub.language}
                      </td>
                      <td className="py-3 font-mono text-[#a1a1aa]">
                        {sub.executionTime} ms
                      </td>
                      <td className="py-3 text-[#71717a] text-right font-mono text-[10px]">
                        {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
