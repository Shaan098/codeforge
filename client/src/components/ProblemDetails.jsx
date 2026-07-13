/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Play, 
  Send, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Terminal, 
  Flame, 
  RotateCcw, 
  Settings,
  ChevronDown,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  Share2,
  Lock,
  Cpu,
  RefreshCw,
  Award,
  CheckCircle,
  History,
  Clock,
  Code2,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';
import canvasConfetti from 'canvas-confetti';
import { request } from '../services/index.js';

export default function ProblemDetails({
  problem,
  currentUser,
  submissions,
  onCodeRun,
  onCodeSubmit,
  onAIDebug,
  onBack,
  bookmarks,
  onToggleBookmark
}) {
  // Tabs
  const [leftTab, setLeftTab] = React.useState('desc');
  
  // Editor State
  const [selectedLang, setSelectedLang] = React.useState('javascript');
  const [code, setCode] = React.useState('');
  const [editorTheme, setEditorTheme] = React.useState('vs-dark');
  const [fontSize, setFontSize] = React.useState(14);
  const [isSaving, setIsSaving] = React.useState(false);

  // Rate Limiting timers
  const [runCooldown, setRunCooldown] = React.useState(0);
  const [submitCooldown, setSubmitCooldown] = React.useState(0);

  // Execution outputs
  const [consoleOpen, setConsoleOpen] = React.useState(true);
  const [activeConsoleTab, setActiveConsoleTab] = React.useState('testcase');
  const [isRunning, setIsRunning] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [lastRunResult, setLastRunResult] = React.useState(null);
  const [lastActionWasSubmit, setLastActionWasSubmit] = React.useState(false);

  // Discussions Forum state
  const [discussions, setDiscussions] = React.useState([]);
  const [newDiscTitle, setNewDiscTitle] = React.useState('');
  const [newDiscContent, setNewDiscContent] = React.useState('');
  const [isCreatingThread, setIsCreatingThread] = React.useState(false);
  const [selectedThread, setSelectedThread] = React.useState(null);
  const [replyText, setReplyText] = React.useState('');

  // AI Debugger
  const [isAIAnalyzing, setIsAIAnalyzing] = React.useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = React.useState('');
  const [showAIPanel, setShowAIPanel] = React.useState(false);

  // Submission History log state
  const [expandedSubmissionId, setExpandedSubmissionId] = React.useState(null);
  const [copiedSubmissionId, setCopiedSubmissionId] = React.useState(null);

  // Load language template initially or from local storage
  React.useEffect(() => {
    const saved = localStorage.getItem(`codeforge_code_${problem.slug}_${selectedLang}`);
    if (saved) {
      setCode(saved);
    } else {
      setCode(problem.codeTemplates[selectedLang] || problem.codeTemplates['javascript'] || '');
    }
  }, [problem, selectedLang]);

  // Auto-Save simulation
  React.useEffect(() => {
    if (!code) return;
    setIsSaving(true);
    const delayDebounce = setTimeout(() => {
      localStorage.setItem(`codeforge_code_${problem.slug}_${selectedLang}`, code);
      setIsSaving(false);
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [code, problem.slug, selectedLang]);

  // Load discussions
  React.useEffect(() => {
    request(`/discussions?problemId=${problem.id}`)
      .then(res => setDiscussions(res.data.discussions || []))
      .catch(err => console.error(err));
  }, [problem.id]);

  // Rate Limiting countdown tickers
  React.useEffect(() => {
    if (runCooldown > 0) {
      const t = setTimeout(() => setRunCooldown(runCooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [runCooldown]);

  React.useEffect(() => {
    if (submitCooldown > 0) {
      const t = setTimeout(() => setSubmitCooldown(submitCooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [submitCooldown]);

  // Reset current template code
  const handleResetCode = () => {
    if (window.confirm('Reset code back to default template? Your current edits will be lost.')) {
      const defaultTemplate = problem.codeTemplates[selectedLang] || '';
      setCode(defaultTemplate);
      localStorage.setItem(`codeforge_code_${problem.slug}_${selectedLang}`, defaultTemplate);
    }
  };

  // Run code handler
  const handleRunCode = async () => {
    if (runCooldown > 0 || isRunning) return;
    setLastActionWasSubmit(false);
    setIsRunning(true);
    setConsoleOpen(true);
    setActiveConsoleTab('result');
    setLastRunResult({ status: 'Pending', stdout: 'Running code in container sandbox...', stderr: '' });

    try {
      const data = await onCodeRun(code, selectedLang);
      if (data.error) {
        setLastRunResult({ status: 'Compilation Error', stdout: '', stderr: data.error });
      } else {
        setLastRunResult(data.result);
        setRunCooldown(10); // Start 10s rate limit countdown
      }
    } catch (err) {
      setLastRunResult({ status: 'Compilation Error', stdout: '', stderr: err.message || 'Sandbox timeout.' });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code handler
  const handleSubmitCode = async () => {
    if (submitCooldown > 0 || isSubmitting) return;
    setLastActionWasSubmit(true);
    setIsSubmitting(true);
    setConsoleOpen(true);
    setActiveConsoleTab('result');
    setLastRunResult({ status: 'Pending', stdout: 'Running all hidden test suites...', stderr: '' });

    try {
      const data = await onCodeSubmit(code, selectedLang);
      if (data.error) {
        setLastRunResult({ status: 'Compilation Error', stdout: '', stderr: data.error });
      } else {
        setLastRunResult(data.result);
        setSubmitCooldown(10); // rate limit

        if (data.result.status === 'Accepted') {
          // Trigger magnificent confetti celebration!
          canvasConfetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#f97316', '#ff4500', '#ffffff']
          });
        }
        // Switch to Submissions history log instantly so the user can see their submission status and details
        setLeftTab('submissions');
      }
    } catch (err) {
      setLastRunResult({ status: 'Compilation Error', stdout: '', stderr: err.message || 'Submission execution failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ForgeAI debugger trigger
  const handleAIDebug = async () => {
    setIsAIAnalyzing(true);
    setShowAIPanel(true);
    setAiAnalysisResult('ForgeAI is loading your code syntax tree, logic flows, and comparing execution logs with compiler test-cases...');

    const expected = lastRunResult?.stderr?.includes('Expected:') 
      ? lastRunResult.stderr.split('Expected:')[1]?.split('Actual:')[0]?.trim()
      : undefined;

    const actual = lastRunResult?.stderr?.includes('Actual:')
      ? lastRunResult.stderr.split('Actual:')[1]?.trim()
      : lastRunResult?.stdout;

    const status = lastRunResult?.status || 'No Execution Completed';

    try {
      const analysis = await onAIDebug(code, selectedLang, expected, actual, status, 'mistral');
      setAiAnalysisResult(analysis);
    } catch (err) {
      setAiAnalysisResult(`### ❌ Connection Error\nCould not compile analysis feedback: ${err.message}`);
    } finally {
      setIsAIAnalyzing(false);
    }
  };

  // Discussion Actions
  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newDiscTitle || !newDiscContent) return;

    try {
      const { data } = await request('/discussions', {
        method: 'POST',
        body: JSON.stringify({
          problemId: problem.id,
          userId: currentUser.id,
          title: newDiscTitle,
          content: newDiscContent
        })
      });
      setDiscussions([data.discussion, ...discussions]);
      setNewDiscTitle('');
      setNewDiscContent('');
      setIsCreatingThread(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVoteThread = async (discId) => {
    try {
      const { data } = await request(`/discussions/${discId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ userId: currentUser.id })
      });
      setDiscussions(discussions.map(d => d.id === discId ? { ...d, votes: data.votes, upvotedBy: data.upvotedBy } : d));
      if (selectedThread?.id === discId) {
        setSelectedThread({ ...selectedThread, votes: data.votes, upvotedBy: data.upvotedBy });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!selectedThread || !replyText) return;

    try {
      const { data } = await request(`/discussions/${selectedThread.id}/replies`, {
        method: 'POST',
        body: JSON.stringify({
          userId: currentUser.id,
          content: replyText
        })
      });
      const updatedThread = { ...selectedThread, replies: data.replies };
      setSelectedThread(updatedThread);
      setDiscussions(discussions.map(d => d.id === selectedThread.id ? updatedThread : d));
      setReplyText('');
    } catch (err) {
      console.error(err);
    }
  };

  const isBookmarked = bookmarks.includes(problem.id);

  // Editor Line Numbers count wrapper
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(15, lineCount) }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      
      {/* Back Header panel */}
      <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 font-sans text-xs text-slate-400 hover:text-white cursor-pointer transition-colors"
        >
          <span>← Back to Problems</span>
        </button>

        <div className="flex items-center space-x-3">
          {/* Bookmark Toggle */}
          <button 
            onClick={() => onToggleBookmark(problem.id)}
            className="rounded-lg border border-[#27272a] bg-[#0c0c0e]/50 p-2 text-slate-400 hover:text-violet-400 cursor-pointer"
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'text-violet-400 fill-violet-400' : ''}`} />
          </button>
          
          <button className="rounded-lg border border-[#27272a] bg-[#0c0c0e]/50 p-2 text-slate-400 hover:text-white cursor-pointer">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: DESCRIPTION / DISCUSSIONS */}
        <div className="lg:col-span-6 rounded-2xl border border-[#27272a] bg-[#18181b]/30 overflow-hidden shadow-xl flex flex-col min-h-[580px]">
          
          {/* Tab Navigation header */}
          <div className="flex border-b border-[#27272a] bg-[#0c0c0e]/40 px-4">
            {[
              { id: 'desc', label: 'Description', icon: BookOpen },
              { id: 'hints', label: 'Hints', icon: HelpCircle },
              { id: 'editorial', label: 'Editorial', icon: Award },
              { id: 'discuss', label: 'Discussions', icon: MessageSquare },
              { id: 'submissions', label: 'Submissions', icon: History }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setLeftTab(tab.id); setSelectedThread(null); }}
                  className={`flex items-center space-x-1.5 py-3 px-3.5 text-xs font-semibold select-none border-b-2 cursor-pointer transition-colors ${
                    leftTab === tab.id 
                      ? 'border-violet-400 text-violet-400' 
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Box */}
          <div className="p-5 flex-1 overflow-y-auto">
            
            {/* 1. DESCRIPTION TAB */}
            {leftTab === 'desc' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-sans font-extrabold text-lg text-white">
                    {problem.title}
                  </h3>
                  <div className="flex items-center space-x-3 mt-2.5">
                    <span className={`rounded-md px-2 py-0.5 text-[9px] font-sans font-extrabold uppercase tracking-wide border ${
                      problem.difficulty === 'Easy' 
                        ? 'text-green-400 bg-green-500/5 border-green-500/10' 
                        : problem.difficulty === 'Medium'
                        ? 'text-yellow-400 bg-yellow-500/5 border-yellow-500/10'
                        : 'text-red-400 bg-red-500/5 border-red-500/10'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Acceptance: **{problem.acceptanceRate}%**
                    </span>
                  </div>
                </div>

                {/* Main description Markdown rendering body */}
                <div className="prose prose-invert text-xs text-slate-300 leading-relaxed space-y-4">
                  {problem.description.split('\n\n').map((paragraph, i) => {
                    if (paragraph.startsWith('###') || paragraph.startsWith('**Input:**')) {
                      return <div key={i} className="font-sans font-bold text-slate-100 mt-4" dangerouslySetInnerHTML={{ __html: paragraph.replace(/###\s*(.*)/g, '<h4 class="text-white font-sans text-sm font-extrabold">$1</h4>') }} />;
                    }
                    return <p key={i} dangerouslySetInnerHTML={{ __html: paragraph.replace(/`([^`]+)`/g, '<code class="bg-white/5 border border-[#27272a] px-1.5 py-0.5 rounded font-mono text-[11px] text-violet-400">$1</code>') }} />;
                  })}
                </div>

                {/* Constraints section */}
                <div className="border-t border-[#27272a] pt-5 space-y-2.5">
                  <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
                    Constraints
                  </h4>
                  <ul className="list-disc pl-5 text-slate-400 text-xs space-y-1 font-mono text-[11px]">
                    {problem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Companies block */}
                <div className="border-t border-[#27272a] pt-5 space-y-2.5">
                  <h4 className="font-sans font-bold text-xs text-slate-500 uppercase tracking-widest">
                    Companies Asked In
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {problem.companies.map(c => (
                      <span key={c} className="rounded bg-[#0c0c0e] border border-[#27272a] px-2.5 py-1 text-[10px] text-violet-400 font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. HINTS TAB */}
            {leftTab === 'hints' && (
              <div className="space-y-4">
                <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider mb-2">
                  Conceptual DSA Hints
                </h3>
                {problem.hints.map((hint, i) => (
                  <div key={i} className="rounded-xl border border-[#27272a] bg-[#0c0c0e]/40 p-4 space-y-1.5">
                    <span className="font-mono text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                      Hint #{i + 1}
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {hint}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 3. EDITORIAL TAB */}
            {leftTab === 'editorial' && (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <div className="rounded-xl bg-violet-500/5 border border-violet-500/10 p-4">
                  <h4 className="font-sans font-extrabold text-xs text-violet-400 flex items-center space-x-1.5 mb-1.5">
                    <Sparkles className="h-4 w-4" />
                    <span>Official Editorial Solution Outline</span>
                  </h4>
                  <p>
                    For **{problem.title}**, the optimal approach is to store the historical states using data structures such as Hash Maps, dynamic arrays, or DP tables. This reduces brute-force O(N²) quadratic calculations to O(N) linear operations.
                  </p>
                </div>
                
                <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider mt-5">
                  Solution Walkthrough:
                </h4>
                <p>
                  1. Initialize a dynamic hash map to cache computed complements.<br />
                  2. As we iterate through the list, compute the complement of the target.<br />
                  3. If the complement exists, return indices immediately.<br />
                  4. Else, map current index elements.
                </p>
              </div>
            )}

            {/* 4. DISCUSSIONS TAB (FORUMS) */}
            {leftTab === 'discuss' && (
              <div className="space-y-4">
                {selectedThread ? (
                  // Deep Thread view
                  <div className="space-y-4">
                    <button 
                      onClick={() => setSelectedThread(null)}
                      className="text-[10px] font-bold uppercase text-slate-500 hover:text-white transition-colors cursor-pointer"
                    >
                      ← Back to threads
                    </button>

                    <div className="rounded-xl border border-[#27272a] bg-[#0c0c0e]/40 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-violet-400 font-bold">
                          Thread by @{selectedThread.username}
                        </span>
                        <button 
                          onClick={() => handleVoteThread(selectedThread.id)}
                          className="flex items-center space-x-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-[10px] hover:text-violet-400 cursor-pointer"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>{selectedThread.votes}</span>
                        </button>
                      </div>

                      <h4 className="font-sans font-bold text-sm text-white">
                        {selectedThread.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedThread.content}
                      </p>
                    </div>

                    {/* Replies listing */}
                    <div className="space-y-2.5">
                      <h5 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Replies ({selectedThread.replies.length})
                      </h5>
                      {selectedThread.replies.map(rep => (
                        <div key={rep.id} className="rounded-xl border border-[#27272a] bg-[#18181b]/20 p-3 text-xs leading-relaxed">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                            <span className="font-bold text-slate-400">@{rep.username}</span>
                            <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-300 whitespace-pre-wrap">{rep.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Write a reply */}
                    <form onSubmit={handleAddReply} className="space-y-3 pt-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your contribution or question in this thread..."
                        rows={3}
                        className="w-full rounded-xl border border-[#27272a] bg-[#0c0c0e] p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-violet-500/50 focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-white/5 border border-[#27272a] px-4 py-2 text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
                      >
                        Reply Thread
                      </button>
                    </form>
                  </div>
                ) : isCreatingThread ? (
                  // Create Thread view
                  <form onSubmit={handleCreateThread} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
                        Create New Thread
                      </h4>
                      <button 
                        type="button"
                        onClick={() => setIsCreatingThread(false)}
                        className="text-[10px] font-bold text-slate-500 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Thread Title (e.g., Highly Optimized O(N) Hash Table Solution)"
                        value={newDiscTitle}
                        onChange={(e) => setNewDiscTitle(e.target.value)}
                        required
                        className="w-full rounded-xl border border-[#27272a] bg-[#0c0c0e] px-3 py-2.5 text-xs text-slate-200 focus:border-violet-500/50 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-2">
                      <textarea
                        placeholder="Write your code snippets or questions in depth..."
                        value={newDiscContent}
                        onChange={(e) => setNewDiscContent(e.target.value)}
                        required
                        rows={6}
                        className="w-full rounded-xl border border-[#27272a] bg-[#0c0c0e] p-3 text-xs text-slate-200 focus:border-violet-500/50 focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white cursor-pointer"
                    >
                      Post Thread
                    </button>
                  </form>
                ) : (
                  // Threads list
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5">
                      <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">
                        Active Discussions ({discussions.length})
                      </span>
                      <button
                        onClick={() => setIsCreatingThread(true)}
                        className="rounded-lg bg-violet-500/5 border border-violet-500/10 px-3 py-1.5 text-[10px] font-bold text-violet-400 hover:bg-violet-500/10 cursor-pointer"
                      >
                        + Create Thread
                      </button>
                    </div>

                    {discussions.length === 0 ? (
                      <div className="py-8 text-center text-slate-600 text-xs">
                        No threads posted for this challenge yet. Start the conversation!
                      </div>
                    ) : (
                      <div className="divide-y divide-[#27272a]">
                        {discussions.map(disc => (
                          <div 
                            key={disc.id}
                            onClick={() => setSelectedThread(disc)}
                            className="py-3 cursor-pointer hover:bg-white/5 rounded-lg px-2 flex justify-between items-center group"
                          >
                            <div className="space-y-1">
                              <span className="block font-sans font-bold text-xs text-white group-hover:text-violet-400 transition-colors">
                                {disc.title}
                              </span>
                              <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                                <span>@{disc.username}</span>
                                <span>•</span>
                                <span>{disc.replies.length} replies</span>
                              </div>
                            </div>

                            <button 
                              onClick={(e) => { e.stopPropagation(); handleVoteThread(disc.id); }}
                              className="flex flex-col items-center justify-center h-9 w-9 rounded-lg bg-white/5 hover:bg-violet-500/10 hover:text-violet-400 text-slate-400 transition-colors cursor-pointer"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span className="font-mono text-[9px] font-bold mt-0.5">{disc.votes}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* 5. SUBMISSIONS TAB (HISTORY LOG) */}
            {leftTab === 'submissions' && (() => {
              const problemSubmissions = (submissions || []).filter(s => s.problemId === problem.id)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

              return (
                <div className="space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5">
                    <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      My Submission Log ({problemSubmissions.length})
                    </span>
                    {problemSubmissions.length > 0 && (
                      <span className="text-[10px] text-violet-400 font-bold font-mono">
                        {problemSubmissions.filter(s => s.status === 'Accepted').length} Accepted
                      </span>
                    )}
                  </div>

                  {problemSubmissions.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 rounded-xl border border-[#27272a]/40 bg-[#09090b]/20 p-6">
                      <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-slate-600 animate-pulse">
                        <History className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-sans font-bold text-sm text-zinc-300">
                          No Submissions Found
                        </h4>
                        <p className="text-zinc-500 text-xs max-w-sm">
                          You haven't submitted any solutions for this problem yet. Write your code in the editor and click "Submit" to begin your run!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {problemSubmissions.map(sub => {
                        const isExpanded = expandedSubmissionId === sub.id;
                        const isCopied = copiedSubmissionId === sub.id;

                        // Precise custom color styling for each possible submission status
                        let statusColorClasses = '';
                        switch (sub.status) {
                          case 'Accepted':
                            statusColorClasses = 'bg-green-500/10 text-green-400 border border-green-500/20';
                            break;
                          case 'Wrong Answer':
                            statusColorClasses = 'bg-red-500/10 text-red-400 border border-red-500/20';
                            break;
                          case 'Time Limit Exceeded':
                            statusColorClasses = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                            break;
                          case 'Runtime Error':
                            statusColorClasses = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
                            break;
                          default:
                            statusColorClasses = 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
                            break;
                        }

                        // Human readable memory string
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
                                ? 'border-violet-500/40 bg-[#121215] shadow-lg shadow-violet-500/5' 
                                : 'border-[#27272a] bg-[#1c1c20]/40 hover:bg-[#1c1c20]/60 hover:border-zinc-700'
                            }`}
                          >
                            {/* Clickable Header for expanding/collapsing */}
                            <div 
                              onClick={() => setExpandedSubmissionId(isExpanded ? null : sub.id)}
                              className="p-3.5 sm:p-4 cursor-pointer flex items-center justify-between gap-3 select-none"
                            >
                              <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                                <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-sans font-extrabold uppercase tracking-wider ${statusColorClasses}`}>
                                  {sub.status === 'Accepted' && <CheckCircle className="h-3 w-3 shrink-0" />}
                                  {sub.status !== 'Accepted' && <Terminal className="h-3 w-3 shrink-0" />}
                                  <span>{sub.status}</span>
                                </span>

                                <span className="font-mono text-[9px] bg-[#0c0c0e]/60 border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-400 font-bold uppercase tracking-wide shrink-0">
                                  {sub.language}
                                </span>

                                <span className="text-[10px] text-zinc-500 font-medium shrink-0 flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5 text-zinc-600" />
                                  {new Date(sub.createdAt).toLocaleDateString(undefined, { 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>

                              <div className="flex items-center space-x-4 shrink-0">
                                <div className="hidden sm:flex items-center space-x-3 text-[10px] font-medium text-zinc-400 font-mono">
                                  <span className="flex items-center space-x-1 border-r border-[#27272a] pr-2.5">
                                    <span className="text-zinc-600 text-[9px] uppercase font-bold tracking-wider mr-1">Time</span>
                                    <span className="text-zinc-200 font-semibold">{sub.executionTime} ms</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <span className="text-zinc-600 text-[9px] uppercase font-bold tracking-wider mr-1">Mem</span>
                                    <span className="text-zinc-200 font-semibold">{formattedMemory}</span>
                                  </span>
                                </div>

                                <ChevronDown 
                                  className={`h-4 w-4 text-zinc-500 transition-transform duration-300 ${
                                    isExpanded ? 'transform rotate-180 text-violet-400' : ''
                                  }`} 
                                />
                              </div>
                            </div>

                            {/* Expanded Details section */}
                            {isExpanded && (
                              <div className="px-4 pb-4 border-t border-[#27272a]/40 bg-[#09090b]/40 pt-3.5 space-y-4">
                                
                                {/* Mobile metrics panel fallback */}
                                <div className="sm:hidden grid grid-cols-2 gap-2 p-2.5 bg-zinc-950/50 rounded-lg border border-[#27272a]/60 text-[11px] font-mono">
                                  <div>
                                    <span className="text-zinc-500 text-[9px] uppercase font-bold block">Runtime</span>
                                    <span className="text-zinc-200 font-bold">{sub.executionTime} ms</span>
                                  </div>
                                  <div>
                                    <span className="text-zinc-500 text-[9px] uppercase font-bold block">Memory</span>
                                    <span className="text-zinc-200 font-bold">{formattedMemory}</span>
                                  </div>
                                </div>

                                {/* Testcase passing metrics banner */}
                                <div className="flex items-center justify-between text-xs bg-zinc-950/30 p-2.5 rounded-lg border border-[#27272a]/40">
                                  <span className="text-zinc-400">Test Cases Passed:</span>
                                  <span className="font-mono font-bold text-zinc-200">
                                    {sub.testCasesPassed} / {sub.totalTestCases || problem.testCases.length} Passed
                                  </span>
                                </div>

                                {/* Detailed compiler logs on failure */}
                                {sub.error && (
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Compiler Output / Details:</span>
                                    <pre className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-3 font-mono text-[11px] text-rose-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                                      {sub.error}
                                    </pre>
                                  </div>
                                )}

                                {/* Code preview box with controls */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-1">
                                      <Code2 className="h-3.5 w-3.5 text-zinc-500" />
                                      Submitted Code
                                    </span>

                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(sub.code).then(() => {
                                            setCopiedSubmissionId(sub.id);
                                            setTimeout(() => setCopiedSubmissionId(null), 2000);
                                          });
                                        }}
                                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#1c1c20] hover:bg-zinc-800 border border-[#27272a] text-[10px] text-zinc-300 font-bold cursor-pointer transition-colors"
                                      >
                                        {isCopied ? (
                                          <>
                                            <Check className="h-3 w-3 text-green-400" />
                                            <span className="text-green-400">Copied!</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="h-3 w-3" />
                                            <span>Copy Code</span>
                                          </>
                                        )}
                                      </button>

                                      <button
                                        onClick={() => {
                                          setCode(sub.code);
                                          setSelectedLang(sub.language);
                                        }}
                                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-violet-600/20 hover:bg-violet-600/35 border border-violet-500/30 text-[10px] text-violet-300 font-bold cursor-pointer transition-colors"
                                      >
                                        <RotateCcw className="h-3 w-3" />
                                        <span>Load Into Editor</span>
                                      </button>
                                    </div>
                                  </div>

                                  <div className="relative group/code">
                                    <pre className="bg-[#050507] border border-[#27272a]/80 rounded-xl p-4 max-h-72 overflow-y-auto font-mono text-[11px] text-zinc-300 whitespace-pre-wrap leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                                      {sub.code}
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
            })()}

          </div>
        </div>

        {/* RIGHT PANEL: EDITOR & CONSOLE */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          
          {/* Custom Monaco-like editor container */}
          <div className="rounded-2xl border border-[#27272a] bg-[#18181b]/60 p-4 shadow-xl flex flex-col relative overflow-hidden">
            
            {/* Editor config header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272a] pb-3.5 mb-3">
              
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="rounded-lg border border-[#27272a] bg-[#0c0c0e] px-3 py-1.5 text-xs text-violet-400 font-bold tracking-wide cursor-pointer focus:outline-hidden"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python 3</option>
                  <option value="cpp">C++ (Compiler Sim)</option>
                  <option value="java">Java (Compiler Sim)</option>
                </select>
              </div>

              {/* Preferences: Font Scale, Themes, Reset templates */}
              <div className="flex items-center space-x-2.5">
                
                {/* Auto-saving Status */}
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                  {isSaving ? 'Saving...' : 'Saved'}
                </span>

                <button 
                  onClick={handleResetCode}
                  title="Reset code template"
                  className="rounded-lg p-1.5 text-slate-500 hover:text-white hover:bg-[#27272a]/40 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                
                <button 
                  onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'synthwave' : 'vs-dark')}
                  title="Switch theme"
                  className="rounded-lg p-1.5 text-slate-500 hover:text-white hover:bg-[#27272a]/40 cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>

            </div>

            {/* Visual Editor Workspace */}
            <div className={`flex rounded-xl overflow-hidden border border-[#27272a] min-h-[340px] font-mono ${
              editorTheme === 'synthwave' ? 'bg-purple-950/20 text-pink-400' : 'bg-slate-950 text-slate-200'
            }`}>
              
              {/* Gutter Line counts */}
              <div className="py-3 w-9 select-none border-r border-[#27272a] bg-slate-950/60 text-right pr-2.5 text-slate-600 font-mono text-[11px] leading-relaxed">
                {lineNumbers.map(n => (
                  <div key={n}>{n}</div>
                ))}
              </div>

              {/* Editable code context */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ fontSize: `${fontSize}px` }}
                className="w-full bg-transparent p-3 focus:outline-hidden font-mono leading-relaxed resize-y overflow-y-auto"
                id="problem-editor-textarea"
                rows={16}
                spellCheck={false}
              />

            </div>

            {/* Executor Trigger Buttons panel */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              
              {/* AI Debug */}
              <button
                onClick={handleAIDebug}
                disabled={isAIAnalyzing}
                className="flex items-center space-x-1.5 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2.5 text-xs font-extrabold text-violet-300 hover:bg-violet-500/20 cursor-pointer disabled:opacity-50"
                id="problem-ai-debug"
              >
                <Sparkles className="h-4 w-4 text-violet-400 fill-violet-400/20" />
                <span>AI Debug</span>
              </button>

              <div className="flex items-center space-x-3.5">
                
                {/* Run code */}
                <button
                  onClick={handleRunCode}
                  disabled={runCooldown > 0 || isRunning || isSubmitting}
                  className="flex items-center space-x-1.5 rounded-xl border border-[#27272a] bg-[#0c0c0e] hover:bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-200 cursor-pointer disabled:opacity-40"
                  id="problem-run-code"
                >
                  <Play className="h-3.5 w-3.5 fill-slate-300" />
                  <span>{runCooldown > 0 ? `Run (${runCooldown}s)` : 'Run'}</span>
                </button>

                {/* Submit Code */}
                <button
                  onClick={handleSubmitCode}
                  disabled={submitCooldown > 0 || isSubmitting || isRunning}
                  className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 px-5 py-2.5 text-xs font-extrabold text-white cursor-pointer disabled:opacity-40 shadow-md"
                  id="problem-submit-code"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitCooldown > 0 ? `Submitting...` : 'Submit'}</span>
                </button>

              </div>

            </div>

          </div>

          {/* TERMINAL CONSOLE LOGS */}
          {consoleOpen && (
            <div className="rounded-2xl border border-[#27272a] bg-[#18181b]/60 p-4 shadow-xl flex flex-col space-y-3">
              
              <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5">
                <div className="flex space-x-3">
                  {[
                    { id: 'testcase', label: 'Sandbox Case 1' },
                    { id: 'result', label: 'Console Output' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveConsoleTab(tab.id)}
                      className={`font-mono text-[10px] font-bold uppercase select-none tracking-widest cursor-pointer ${
                        activeConsoleTab === tab.id 
                          ? 'text-violet-400' 
                          : 'text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <span className="font-mono text-[9px] text-slate-600">
                  Container Log Output
                </span>
              </div>

              {/* Console logs body rendering */}
              <div className="bg-slate-950 rounded-xl p-3.5 min-h-[110px] font-mono text-xs text-slate-300">
                {activeConsoleTab === 'testcase' ? (
                  <div className="space-y-2">
                    <div>
                      <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest">Input</span>
                      <pre className="text-slate-300 text-xs mt-1 bg-white/5 p-2 rounded">{problem.testCases[0].input}</pre>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest">Expected Output</span>
                      <pre className="text-green-400 text-xs mt-1 bg-white/5 p-2 rounded">{problem.testCases[0].expected}</pre>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 leading-relaxed">
                    {lastRunResult ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest">Result Status</span>
                          <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold ${
                            lastRunResult.status === 'Accepted' ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
                          }`}>
                            {lastRunResult.status}
                          </span>
                        </div>
                        {lastRunResult.status === 'Accepted' ? (
                          <div className="space-y-2 text-xs">
                            <p className="text-green-400 font-bold flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4" />
                              <span>{lastActionWasSubmit ? 'All Test Cases Passed!' : 'Sandbox Dry-Run Succeeded!'}</span>
                            </p>
                            <p className="text-slate-400 text-[11px] leading-relaxed">
                              {lastActionWasSubmit 
                                ? 'Your solution has been submitted and registered successfully.' 
                                : 'Dry-run evaluation passed Case 1. Note that this dry-run does NOT submit your code.'}
                            </p>
                            <div className="flex space-x-6 text-[10px] text-slate-500 font-mono pt-1">
                              <span>EXECUTION TIME: <strong className="text-slate-300">{lastRunResult.executionTime} ms</strong></span>
                              <span>MEMORY CONSUMED: <strong className="text-slate-300">{(lastRunResult.memoryUsage / 1024).toFixed(2)} MB</strong></span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {lastRunResult.status === 'Pending' ? (
                              <p className="text-violet-400 flex items-center space-x-1.5 animate-pulse">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>{lastRunResult.stdout}</span>
                              </p>
                            ) : (
                              <div className="space-y-3">
                                {/* Metrics Summary */}
                                <div className="flex flex-wrap items-center gap-4 bg-red-950/20 border border-red-500/10 rounded-xl p-3 text-xs">
                                  <div className="flex items-center space-x-2 text-red-400 font-bold">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 text-xs">✕</span>
                                    <span>{lastRunResult.status}</span>
                                  </div>
                                  <div className="text-slate-400 border-l border-zinc-800 pl-4 font-mono">
                                    {lastActionWasSubmit ? (
                                      <span>Test Cases Passed: <strong className="text-red-400">{lastRunResult.testCasesPassed || 0} / {problem.testCases.length}</strong></span>
                                    ) : (
                                      <span>Dry-Run Case: <strong className="text-red-400">Failed</strong> (Not submitted)</span>
                                    )}
                                  </div>
                                  {lastRunResult.executionTime > 0 && (
                                    <div className="text-slate-500 border-l border-zinc-800 pl-4 font-mono text-[11px] flex gap-4">
                                      <span>Time: <strong className="text-slate-300">{lastRunResult.executionTime} ms</strong></span>
                                      <span>Memory: <strong className="text-slate-300">{(lastRunResult.memoryUsage / 1024).toFixed(2)} MB</strong></span>
                                    </div>
                                  )}
                                </div>

                                {(() => {
                                  const parsed = lastRunResult.stderr ? (() => {
                                    const stderr = lastRunResult.stderr;
                                    const matchCase = stderr.match(/Test Case (\d+) Failed/i);
                                    const matchInput = stderr.match(/Input:\s*([\s\S]*?)\nExpected:/i);
                                    const matchExpected = stderr.match(/Expected:\s*([\s\S]*?)\nActual:/i);
                                    const matchActual = stderr.match(/Actual:\s*([\s\S]*)$/i);
                                    
                                    if (matchCase || matchInput || matchExpected || matchActual) {
                                      return {
                                        caseNum: matchCase ? matchCase[1] : '?',
                                        input: matchInput ? matchInput[1].trim() : '',
                                        expected: matchExpected ? matchExpected[1].trim() : '',
                                        actual: matchActual ? matchActual[1].trim() : ''
                                      };
                                    }
                                    return null;
                                  })() : null;

                                  if (parsed) {
                                    return (
                                      <div className="space-y-2 text-xs bg-[#09090b]/80 border border-[#27272a] rounded-xl p-4">
                                        <div className="flex items-center justify-between border-b border-[#27272a] pb-1.5 mb-2">
                                          <span className="font-bold text-red-400 uppercase tracking-wider font-mono text-[10px]">
                                            Failed Test Case #{parsed.caseNum} Details
                                          </span>
                                        </div>
                                        <div className="space-y-3 font-sans">
                                          <div>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Input:</span>
                                            <pre className="mt-1 bg-white/5 border border-[#27272a] p-2 rounded text-zinc-300 font-mono text-[11px] overflow-x-auto">{parsed.input}</pre>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                              <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider font-mono">Expected Output:</span>
                                              <pre className="mt-1 bg-green-500/5 border border-green-500/10 p-2 rounded text-green-300 font-mono text-[11px] overflow-x-auto">{parsed.expected}</pre>
                                            </div>
                                            <div>
                                              <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider font-mono">Your Actual Output:</span>
                                              <pre className="mt-1 bg-red-500/5 border border-red-500/10 p-2 rounded text-red-300 font-mono text-[11px] overflow-x-auto">{parsed.actual}</pre>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <pre className="text-red-400 bg-red-500/5 border border-red-500/10 p-2.5 rounded text-[11px] whitespace-pre-wrap leading-relaxed overflow-x-auto font-mono">
                                      {lastRunResult.stderr || lastRunResult.error || 'Check console variables or code syntax.'}
                                    </pre>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-slate-600 py-4 text-center">
                        Sandbox logs are empty. Click **Run** or **Submit** above to instantiate compiling.
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* FLOATING AI DEBUGGER PANEL */}
      {showAIPanel && (
        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-[#09090b] to-violet-950/20 p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-[-30%] right-[-10%] w-60 h-60 rounded-full bg-violet-500/5 blur-[50px]" />
          
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3 mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
                  ForgeAI Co-Pilot Feedback
                </h4>
                <span className="block text-[9px] text-slate-500 font-mono">
                  AI Debug Assistant
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowAIPanel(false)}
              className="text-[10px] font-mono text-slate-500 hover:text-white cursor-pointer"
            >
              Close Co-Pilot
            </button>
          </div>

          {/* Analyze Button */}
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={handleAIDebug}
              disabled={isAIAnalyzing}
              className="px-3 py-1.5 bg-violet-500 hover:bg-violet-400 text-white rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-50 text-[10px] flex items-center space-x-1"
            >
              <RefreshCw className={`h-2.5 w-2.5 ${isAIAnalyzing ? 'animate-spin' : ''}`} />
              <span>Analyze</span>
            </button>
          </div>

          <div className="prose prose-invert prose-sm text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto bg-slate-950 p-4 rounded-xl border border-[#27272a]">
            {isAIAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <RefreshCw className="h-6 w-6 text-violet-400 animate-spin" />
                <p className="text-xs text-violet-300 font-mono text-center animate-pulse">
                  Analyzing syntax logs, dry-running edge cases, evaluating time/space complexity...
                </p>
              </div>
            ) : (
              aiAnalysisResult.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('###') || paragraph.startsWith('##')) {
                  return <h4 key={i} className="text-violet-300 font-sans text-xs font-extrabold border-b border-[#27272a] pb-1 mt-4">{paragraph.replace(/[#]+/g, '')}</h4>;
                }
                if (paragraph.startsWith('---') || paragraph.startsWith('***')) {
                  return <hr key={i} className="border-[#27272a] my-4" />;
                }
                return <p key={i} className="leading-relaxed text-[11px]" dangerouslySetInnerHTML={{ __html: paragraph.replace(/`([^`]+)`/g, '<code class="bg-white/5 border border-[#27272a] px-1.5 py-0.5 rounded font-mono text-violet-400 text-[11.5px]">$1</code>') }} />;
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
}
