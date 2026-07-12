/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ContributionGraph Component
 * Visualizes daily coding activity using a color-coded grid,
 * mirroring the GitHub contributions heatmap.
 */

import React from 'react';
import { 
  Calendar, 
  Flame, 
  Zap, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Activity, 
  TrendingUp,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ContributionGraph({ 
  currentUser, 
  submissions, 
  onRefreshUserData,
  isLoading
}) {
  const [hoveredDay, setHoveredDay] = React.useState(null);
  const [tooltipPosition, setTooltipPosition] = React.useState(null);
  const [isSeeding, setIsSeeding] = React.useState(false);
  const [seedSuccess, setSeedSuccess] = React.useState(false);

  // Parse and match local date string
  const getLocalDateStr = (date) => {
    return date.toLocaleDateString('sv-SE'); // YYYY-MM-DD
  };

  // Generate grid days for the last 53 weeks (371 days) ending on the current week's Saturday
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const daysToSaturday = 6 - currentDayOfWeek;
  const lastSaturday = new Date(today);
  lastSaturday.setDate(today.getDate() + daysToSaturday);

  const totalDays = 53 * 7; // 53 weeks of 7 days
  const daysList = [];

  // Index submissions by date for efficient lookup
  const submissionsByDate = {};
  submissions.forEach(sub => {
    if (!sub.createdAt) return;
    const subDate = new Date(sub.createdAt);
    const dateStr = getLocalDateStr(subDate);
    if (!submissionsByDate[dateStr]) {
      submissionsByDate[dateStr] = [];
    }
    submissionsByDate[dateStr].push(sub);
  });

  // Keep track of statistics
  let totalSubmissionsInPeriod = 0;
  let activeDaysCount = 0;
  let maxSpike = 0;
  let acceptedInPeriod = 0;

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(lastSaturday);
    d.setDate(lastSaturday.getDate() - i);
    const dateStr = getLocalDateStr(d);
    
    const daySubs = submissionsByDate[dateStr] || [];
    const count = daySubs.length;
    const accepted = daySubs.filter(s => s.status === 'Accepted').length;
    const failed = count - accepted;

    totalSubmissionsInPeriod += count;
    if (count > 0) activeDaysCount++;
    if (count > maxSpike) maxSpike = count;
    acceptedInPeriod += accepted;

    // Define level
    let level = 0;
    if (count === 1) level = 1;
    else if (count === 2) level = 2;
    else if (count === 3 || count === 4) level = 3;
    else if (count >= 5) level = 4;

    daysList.push({
      dateStr,
      date: d,
      level,
      submissionsCount: count,
      acceptedCount: accepted,
      failedCount: failed,
      submissionsList: daySubs
    });
  }

  // Chunk days into 53 columns representing weeks
  const columns = [];
  for (let i = 0; i < daysList.length; i += 7) {
    columns.push(daysList.slice(i, i + 7));
  }

  // Success rate
  const successRate = totalSubmissionsInPeriod > 0 
    ? Math.round((acceptedInPeriod / totalSubmissionsInPeriod) * 100) 
    : 0;

  const handleMouseEnter = (day, event) => {
    setHoveredDay(day);
    const rect = event.currentTarget.getBoundingClientRect();
    const container = event.currentTarget.closest('.heatmap-container');
    if (container) {
      const containerRect = container.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 8,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
    setTooltipPosition(null);
  };

  // Handler for seeding mock developer submissions
  const handleSeedActivity = async () => {
    if (isSeeding) return;
    setIsSeeding(true);
    setSeedSuccess(false);

    try {
      const res = await fetch('/api/submissions/seed-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      const data = await res.json();
      if (data.success || data.count) {
        setSeedSuccess(true);
        if (onRefreshUserData) {
          onRefreshUserData();
        }
      }
    } catch (error) {
      console.error('Failed to seed activity:', error);
    } finally {
      setIsSeeding(false);
      setTimeout(() => setSeedSuccess(false), 3000);
    }
  };

  // Human friendly formatting for tooltips
  const formatDateForTooltip = (date) => {
    return date.toLocaleDateString('default', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#27272a] bg-gradient-to-b from-[#18181b]/60 to-[#09090b]/40 p-5 sm:p-6 backdrop-blur-md space-y-6 relative overflow-hidden" id="contribution-graph-card">
        <div className="absolute top-[-20%] left-[-10%] w-80 h-80 rounded-full bg-violet-600/5 blur-[80px]" />
        
        {/* Title block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
            <div className="flex items-center space-x-2">
              <div className="h-6 w-48 bg-zinc-700/80 rounded animate-pulse" />
              <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>

          {/* Action Controls */}
          <div className="h-8 w-44 bg-zinc-800 rounded-xl animate-pulse" />
        </div>

        {/* Stats Summary Ribbons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-[#27272a] bg-[#09090b]/50 p-3 flex flex-col justify-between h-[66px] animate-pulse">
              <div className="h-2.5 w-20 bg-zinc-800 rounded" />
              <div className="h-5 w-16 bg-zinc-700 rounded mt-1" />
            </div>
          ))}
        </div>

        {/* Main Heatmap Widget wrapper */}
        <div className="heatmap-container relative rounded-xl border border-[#27272a] bg-[#09090b]/60 p-4 pt-5">
          <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            <div className="min-w-[800px] select-none relative flex flex-col">
              
              {/* Month labels header */}
              <div className="flex pl-7 mb-1.5">
                <div className="flex gap-[3.5px] text-[9px] text-slate-500 font-mono relative h-4 w-full">
                  {columns.map((column, colIdx) => {
                    const firstDayOfCol = column[0].date;
                    const monthName = firstDayOfCol.toLocaleString('default', { month: 'short' });
                    const prevCol = colIdx > 0 ? columns[colIdx - 1] : null;
                    const isNewMonth = !prevCol || firstDayOfCol.getMonth() !== prevCol[0].date.getMonth();
                    
                    return (
                      <div key={colIdx} className="w-[12px] sm:w-[13px] relative flex-shrink-0">
                        {isNewMonth && (
                          <span className="absolute left-0 bottom-0 whitespace-nowrap text-[8px] sm:text-[9px] font-bold text-zinc-700/80 animate-pulse">
                            {monthName}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Layout combining Week labels and Columns */}
              <div className="flex items-start">
                
                {/* Row labels for Day of Week */}
                <div className="flex flex-col justify-between text-[9px] text-[#71717a]/50 font-mono h-[105px] pr-2.5 pt-[2px] w-7 select-none leading-none animate-pulse">
                  <span></span>
                  <span>Mon</span>
                  <span></span>
                  <span>Wed</span>
                  <span></span>
                  <span>Fri</span>
                  <span></span>
                </div>

                {/* Grid content */}
                <div className="flex gap-[3.5px]">
                  {Array.from({ length: 53 }).map((_, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-[3.5px]">
                      {Array.from({ length: 7 }).map((_, rowIdx) => {
                        const shimmerOpa = (colIdx + rowIdx) % 5 === 0 
                          ? 'bg-zinc-800' 
                          : (colIdx + rowIdx) % 3 === 0 
                            ? 'bg-zinc-800/40' 
                            : 'bg-zinc-800/70';
                        return (
                          <div
                            key={rowIdx}
                            className={`w-[12px] h-[12px] sm:w-[13px] sm:h-[13px] rounded-[2.5px] border border-[#27272a]/30 animate-pulse ${shimmerOpa}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Legend panel and captions */}
          <div className="flex items-center justify-between text-[9px] text-zinc-600 font-bold uppercase tracking-wider border-t border-[#27272a] pt-3.5 mt-3 select-none animate-pulse">
            <span className="flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
              <div className="h-2 w-48 bg-zinc-800 rounded" />
            </span>
            <div className="flex items-center space-x-1.5">
              <span>Less</span>
              <div className="flex gap-[3px]">
                <div className="h-2.5 w-2.5 rounded-[1.5px] bg-zinc-900 border border-zinc-800/40" />
                <div className="h-2.5 w-2.5 rounded-[1.5px] bg-zinc-800/60 border border-zinc-800/30" />
                <div className="h-2.5 w-2.5 rounded-[1.5px] bg-zinc-800 border border-zinc-800/40" />
                <div className="h-2.5 w-2.5 rounded-[1.5px] bg-zinc-700/60 border border-zinc-700/30" />
                <div className="h-2.5 w-2.5 rounded-[1.5px] bg-zinc-700 border border-zinc-700/40" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#27272a] bg-gradient-to-b from-[#18181b]/60 to-[#09090b]/40 p-5 sm:p-6 backdrop-blur-md space-y-6 relative overflow-hidden" id="contribution-graph-card">
      <div className="absolute top-[-20%] left-[-10%] w-80 h-80 rounded-full bg-violet-600/5 blur-[80px]" />
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold text-violet-400">
            <Activity className="h-3 w-3" />
            <span>ANNUAL CONSISTENCY INDEX</span>
          </div>
          <h3 className="font-sans font-extrabold text-lg text-white tracking-tight flex items-center space-x-2">
            <span>Contributions Heatmap</span>
            <span className="text-[10px] font-mono font-bold text-[#71717a] border border-[#27272a] px-2 py-0.5 rounded bg-[#09090b] uppercase">
              365-Day Year Grid
            </span>
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSeedActivity}
            disabled={isSeeding}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 select-none ${
              seedSuccess 
                ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20 hover:scale-102 active:scale-98'
            }`}
          >
            {isSeeding ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                <span>Simulating...</span>
              </>
            ) : seedSuccess ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Grid Populated!</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>Populate Past Coding Activity</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Summary Ribbons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#27272a] bg-[#09090b]/50 p-3 flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Submissions</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-white">{totalSubmissionsInPeriod}</span>
            <span className="text-[10px] text-slate-400">runs</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#27272a] bg-[#09090b]/50 p-3 flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Success Rate</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-400">{successRate}%</span>
            <span className="text-[10px] text-slate-400">accepted</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#27272a] bg-[#09090b]/50 p-3 flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Days</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-violet-400">{activeDaysCount}</span>
            <span className="text-[10px] text-slate-400">/ 365 days</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#27272a] bg-[#09090b]/50 p-3 flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Max Daily Spike</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-indigo-400">{maxSpike}</span>
            <span className="text-[10px] text-slate-400">solutions</span>
          </div>
        </div>
      </div>

      {/* Main Heatmap Widget wrapper */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="heatmap-container relative rounded-xl border border-[#27272a] bg-[#09090b]/60 p-4 pt-5"
      >
        
        {/* Scroll helper */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <div className="min-w-[800px] select-none relative flex flex-col">
            
            {/* Month labels header */}
            <div className="flex pl-7 mb-1.5">
              <div className="flex gap-[3.5px] text-[9px] text-slate-500 font-mono relative h-4 w-full">
                {columns.map((column, colIdx) => {
                  const firstDayOfCol = column[0].date;
                  const monthName = firstDayOfCol.toLocaleString('default', { month: 'short' });
                  const prevCol = colIdx > 0 ? columns[colIdx - 1] : null;
                  const isNewMonth = !prevCol || firstDayOfCol.getMonth() !== prevCol[0].date.getMonth();
                  
                  return (
                    <div key={colIdx} className="w-[12px] sm:w-[13px] relative flex-shrink-0">
                      {isNewMonth && (
                        <span className="absolute left-0 bottom-0 whitespace-nowrap text-[8px] sm:text-[9px] font-bold text-slate-400">
                          {monthName}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layout combining Week labels and Columns */}
            <div className="flex items-start">
              
              {/* Row labels for Day of Week */}
              <div className="flex flex-col justify-between text-[9px] text-[#71717a] font-mono h-[105px] pr-2.5 pt-[2px] w-7 select-none leading-none">
                <span></span>
                <span>Mon</span>
                <span></span>
                <span>Wed</span>
                <span></span>
                <span>Fri</span>
                <span></span>
              </div>

              {/* Grid content */}
              <div className="flex gap-[3.5px]">
                {columns.map((column, colIdx) => (
                  <motion.div 
                    key={colIdx} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: colIdx * 0.01 }}
                    className="flex flex-col gap-[3.5px]"
                  >
                    {column.map((day, rowIdx) => {
                      // Custom shades mapping from slate-900 style to violet-600
                      const bgColors = [
                        'bg-slate-900 border-slate-800 hover:border-slate-700', // Level 0 (slate-900)
                        'bg-violet-950/40 border-violet-900/30 text-violet-400 hover:bg-violet-900/40', // Level 1 (dim violet)
                        'bg-violet-800/40 border-violet-700/30 text-violet-300 hover:bg-violet-700/50', // Level 2 (medium violet)
                        'bg-violet-700/60 border-violet-600/40 text-violet-200 hover:bg-violet-600/80', // Level 3 (high-medium violet)
                        'bg-violet-600 border-violet-500 text-white shadow-[0_0_8px_rgba(139,92,246,0.3)] hover:bg-violet-500' // Level 4 (intense violet-600)
                      ];

                      return (
                        <motion.div
                          key={rowIdx}
                          whileHover={{ scale: 1.25, zIndex: 10 }}
                          onMouseEnter={(e) => handleMouseEnter(day, e)}
                          onMouseLeave={handleMouseLeave}
                          className={`w-[12px] h-[12px] sm:w-[13px] sm:h-[13px] rounded-[2.5px] border transition-colors duration-150 cursor-pointer ${bgColors[day.level]}`}
                        />
                      );
                    })}
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Legend panel and captions */}
        <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider border-t border-[#27272a] pt-3.5 mt-3 select-none">
          <span className="flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span>Hover over cells to inspect daily evaluations</span>
          </span>
          <div className="flex items-center space-x-1.5">
            <span>Less</span>
            <div className="flex gap-[3px]">
              <div className="h-2.5 w-2.5 rounded-[1.5px] bg-slate-900 border border-slate-800" />
              <div className="h-2.5 w-2.5 rounded-[1.5px] bg-violet-950/40 border border-violet-900/20" />
              <div className="h-2.5 w-2.5 rounded-[1.5px] bg-violet-800/30 border border-violet-800/30" />
              <div className="h-2.5 w-2.5 rounded-[1.5px] bg-violet-700/60 border border-violet-600/30" />
              <div className="h-2.5 w-2.5 rounded-[1.5px] bg-violet-600 border border-violet-500" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Custom Rich Floating Tooltip */}
        {hoveredDay && tooltipPosition && (
          <div 
            className="absolute z-50 bg-[#09090b] border border-[#27272a] rounded-xl p-3 text-[10px] pointer-events-none transition-all duration-100 shadow-[0_0_25px_rgba(0,0,0,0.8)] border-violet-500/10 flex flex-col space-y-1.5"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {/* Tooltip Header */}
            <div className="font-sans font-extrabold text-white border-b border-[#27272a] pb-1">
              {formatDateForTooltip(hoveredDay.date)}
            </div>

            {/* Tooltip Content Body */}
            {hoveredDay.submissionsCount === 0 ? (
              <div className="text-slate-500 font-medium">
                No submissions logged on this day
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <span className="font-mono text-violet-400 font-extrabold">{hoveredDay.submissionsCount}</span>
                  <span className="text-slate-400">submission(s) recorded</span>
                </div>
                
                <div className="flex items-center space-x-3 text-[9px] pt-0.5">
                  <div className="flex items-center space-x-1 text-emerald-400">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    <span>Accepted: {hoveredDay.acceptedCount}</span>
                  </div>
                  {hoveredDay.failedCount > 0 && (
                    <div className="flex items-center space-x-1 text-rose-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      <span>Errors/WA: {hoveredDay.failedCount}</span>
                    </div>
                  )}
                </div>

                {/* Listing actual problems attempted */}
                {hoveredDay.submissionsList && hoveredDay.submissionsList.length > 0 && (
                  <div className="border-t border-white/5 pt-1.5 mt-1 max-w-[200px]">
                    <span className="text-[8px] text-slate-500 uppercase font-extrabold block mb-0.5">Attempted Tasks:</span>
                    <div className="flex flex-col gap-0.5 max-h-[60px] overflow-y-auto">
                      {Array.from(new Set(hoveredDay.submissionsList.map((s) => s.problemTitle))).map((title) => (
                        <div key={title} className="text-slate-300 font-medium truncate flex items-center space-x-1">
                          <span className="text-[10px] text-violet-400">•</span>
                          <span className="truncate">{title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Triangular pointer decoration */}
            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#09090b] border-r border-b border-[#27272a] rotate-45" />
          </div>
        )}

      </motion.div>
    </div>
  );
}
