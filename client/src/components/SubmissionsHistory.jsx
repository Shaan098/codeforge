/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Search, 
  Filter, 
  Clock, 
  Cpu, 
  Copy, 
  Check, 
  ExternalLink, 
  Code2, 
  AlertTriangle,
  Database,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function SubmissionsHistory({ submissions, onSelectProblem }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [langFilter, setLangFilter] = React.useState('All');
  const [expandedId, setExpandedId] = React.useState(null);
  const [copiedId, setCopiedId] = React.useState(null);

  // Filter and process submissions
  const filteredSubmissions = React.useMemo(() => {
    let result = [...submissions];

    // Search by problem title or code snippet
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        s => s.problemTitle.toLowerCase().includes(term) || s.code.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (statusFilter !== 'All') {
      result = result.filter(s => s.status === statusFilter);
    }

    // Filter by language
    if (langFilter !== 'All') {
      result = result.filter(s => s.language.toLowerCase() === langFilter.toLowerCase());
    }

    // Sort by latest first
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [submissions, searchTerm, statusFilter, langFilter]);

  // Extract unique languages
  const uniqueLanguages = React.useMemo(() => {
    const langs = new Set();
    submissions.forEach(s => {
      if (s.language) langs.add(s.language);
    });
    return Array.from(langs);
  }, [submissions]);

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Accepted':
        return {
          badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
          text: 'text-emerald-400',
          bg: 'bg-emerald-950/10'
        };
      case 'Wrong Answer':
        return {
          badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
          text: 'text-rose-400',
          bg: 'bg-rose-950/10'
        };
      case 'Time Limit Exceeded':
        return {
          badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
          text: 'text-amber-400',
          bg: 'bg-amber-950/10'
        };
      case 'Compilation Error':
        return {
          badge: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
          text: 'text-orange-400',
          bg: 'bg-orange-950/10'
        };
      default:
        return {
          badge: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
          text: 'text-zinc-400',
          bg: 'bg-zinc-950/10'
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header section with Stats Cards */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md">
        <div className="absolute top-[-30%] right-[-10%] w-60 h-60 rounded-full bg-violet-600/10 blur-[50px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="font-sans font-extrabold text-xl text-white tracking-tight flex items-center gap-2">
              <History className="h-5 w-5 text-violet-400" />
              <span>Submission History</span>
            </h2>
            <p className="text-slate-400 text-xs">
              Review and filter your past compile cycles, algorithm runs, and final test score statistics.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="rounded-xl bg-slate-950/50 border border-white/5 px-4 py-2.5 text-center min-w-[80px]">
              <span className="block font-mono text-lg font-bold text-white">{submissions.length}</span>
              <span className="block text-[8px] text-slate-500 font-bold uppercase">Total runs</span>
            </div>
            <div className="rounded-xl bg-slate-950/50 border border-white/5 px-4 py-2.5 text-center min-w-[80px]">
              <span className="block font-mono text-lg font-bold text-emerald-400">
                {submissions.filter(s => s.status === 'Accepted').length}
              </span>
              <span className="block text-[8px] text-slate-500 font-bold uppercase">Accepted</span>
            </div>
            <div className="rounded-xl bg-slate-950/50 border border-white/5 px-4 py-2.5 text-center min-w-[80px]">
              <span className="block font-mono text-lg font-bold text-violet-400">
                {submissions.length > 0 
                  ? Math.round((submissions.filter(s => s.status === 'Accepted').length / submissions.length) * 100) 
                  : 0}%
              </span>
              <span className="block text-[8px] text-slate-500 font-bold uppercase">Success Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Filter Toolbar */}
      <div className="grid gap-4 md:grid-cols-12 rounded-2xl border border-white/5 bg-slate-900/40 p-4 backdrop-blur-md">
        
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by problem title, code, keywords..."
            className="w-full rounded-xl border border-white/5 bg-slate-950/80 pl-10 pr-4 py-2.5 text-xs text-slate-300 placeholder-slate-600 focus:border-violet-500/50 focus:outline-hidden"
          />
        </div>

        {/* Filter Status */}
        <div className="md:col-span-3 flex items-center space-x-2 bg-slate-950/80 rounded-xl border border-white/5 px-3 py-1">
          <Filter className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-slate-300 py-1.5 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Accepted">Accepted</option>
            <option value="Wrong Answer">Wrong Answer</option>
            <option value="Time Limit Exceeded">Time Limit Exceeded</option>
            <option value="Compilation Error">Compilation Error</option>
            <option value="Runtime Error">Runtime Error</option>
          </select>
        </div>

        {/* Filter Language */}
        <div className="md:col-span-3 flex items-center space-x-2 bg-slate-950/80 rounded-xl border border-white/5 px-3 py-1">
          <Code2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-slate-300 py-1.5 focus:outline-hidden capitalize"
          >
            <option value="All">All Languages</option>
            {uniqueLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 rounded-2xl border border-white/5 bg-slate-900/20 p-6">
          <div className="h-14 w-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-slate-500">
            <History className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-sans font-bold text-sm text-zinc-300">No Submissions Found</h4>
            <p className="text-zinc-500 text-xs max-w-sm">
              We couldn't find any submissions matching your filter criteria. Submit a solution or adjust filters to begin.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSubmissions.map(sub => {
            const isExpanded = expandedId === sub.id;
            const isCopied = copiedId === sub.id;
            const style = getStatusStyle(sub.status);

            const formattedMemory = typeof sub.memoryUsage === 'number'
              ? sub.memoryUsage < 1000 
                ? `${sub.memoryUsage.toFixed(1)} KB` 
                : `${(sub.memoryUsage / 1024).toFixed(1)} MB`
              : sub.memoryUsage;

            return (
              <div 
                key={sub.id}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isExpanded 
                    ? 'border-violet-500/40 bg-slate-900/60 shadow-lg shadow-violet-500/5' 
                    : 'border-white/5 bg-slate-900/20 hover:bg-slate-900/40 hover:border-zinc-800'
                }`}
              >
                {/* Header card / summary row */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                  className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Status Badge */}
                    <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-sans font-extrabold uppercase tracking-wider ${style.badge}`}>
                      {sub.status === 'Accepted' ? (
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                      ) : (
                        <XCircle className="h-3 w-3 shrink-0" />
                      )}
                      <span>{sub.status}</span>
                    </span>

                    {/* Problem Name & Language */}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-sans font-bold text-xs text-slate-200 truncate hover:text-white transition-colors flex items-center gap-2">
                        <span>{sub.problemTitle}</span>
                        <span className="font-mono text-[9px] bg-white/5 border border-white/5 rounded px-1.5 py-0.2 text-slate-400 capitalize">
                          {sub.language}
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3 text-slate-600" />
                        <span>Submitted {new Date(sub.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right hand side execution metrics */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="h-3.5 w-3.5 text-slate-600" />
                        <span>{sub.executionTime} ms</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Database className="h-3.5 w-3.5 text-slate-600" />
                        <span>{formattedMemory}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded content view */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/5 bg-slate-950/40 pt-4 space-y-4">
                    
                    {/* Performance details banner */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-white/5">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold block">Status</span>
                        <span className={`text-xs font-bold ${style.text}`}>{sub.status}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold block">Test Cases Passed</span>
                        <span className="text-xs font-bold text-slate-200">
                          {sub.testCasesPassed} / {sub.totalTestCases || 10} Passed
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold block">Execution Speed</span>
                        <span className="text-xs font-bold text-slate-200">{sub.executionTime} ms</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold block">Memory Overhead</span>
                        <span className="text-xs font-bold text-slate-200">{formattedMemory}</span>
                      </div>
                    </div>

                    {/* Error logs */}
                    {sub.error && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                          Diagnostic Output Logs
                        </span>
                        <pre className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-3.5 font-mono text-[11px] text-rose-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                          {sub.error}
                        </pre>
                      </div>
                    )}

                    {/* Code Container with Copy & Jump to problem buttons */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5 text-slate-500" />
                          Submitted Algorithm Snapshot
                        </span>

                        <div className="flex items-center space-x-2">
                          {/* Copy code button */}
                          <button
                            onClick={() => handleCopyCode(sub.id, sub.code)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 text-[10px] text-slate-300 font-bold cursor-pointer transition-all"
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>

                          {/* Navigation button */}
                          <button
                            onClick={() => onSelectProblem(sub.problemSlug)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-[10px] text-white font-bold cursor-pointer transition-all shadow-md shadow-violet-600/10"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Solve Again</span>
                          </button>
                        </div>
                      </div>

                      {/* Actual Code syntax container */}
                      <div className="relative rounded-xl border border-white/5 bg-slate-950 overflow-hidden">
                        <div className="absolute right-3 top-3 text-[8px] font-mono text-slate-600 uppercase font-bold tracking-wider pointer-events-none">
                          {sub.language} snapshot
                        </div>
                        <pre className="p-4 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-text">
                          <code>{sub.code}</code>
                        </pre>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
