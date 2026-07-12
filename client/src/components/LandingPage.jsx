/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Terminal, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  Code2, 
  Activity, 
  Flame, 
  CheckCircle,
  HelpCircle,
  Clock,
  Shield,
  Layers,
  Award
} from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  const [activeFaq, setActiveFaq] = React.useState(null);

  const stats = [
    { value: '500K+', label: 'Submissions Judged' },
    { value: '15,000+', label: 'Elite Engineers' },
    { value: '0.04s', label: 'Median Exec Time' },
    { value: '99.99%', label: 'Sandbox Uptime' },
  ];

  const features = [
    {
      icon: Cpu,
      title: 'Ultra-low Latency Executor',
      description: 'Our advanced multi-threaded sandbox compiles and tests submissions in isolated micro-containers in under 40 milliseconds.',
    },
    {
      icon: Sparkles,
      title: 'ForgeAI Intelligent Debugger',
      description: 'Stuck on an edge case? Speak with ForgeAI, a fully integrated DSA Coach that guides your debugging rather than spoiling answers.',
    },
    {
      icon: Layers,
      title: 'LeetCode-Grade Layouts',
      description: 'Write, debug, trace, and bookmark in our customizable split-panel workspace featuring an integrated countdown controller.',
    },
    {
      icon: Flame,
      title: 'Gamified Consistency Engine',
      description: 'Build your daily streaks, level up your developer profile, and conquer high-tier badges to stand out to global recruiters.',
    },
    {
      icon: Shield,
      title: 'Anti-Cheat Protection',
      description: 'Deep static checks and plagiarism filters enforce academic honesty and authentic competition during live contests.',
    },
    {
      icon: Activity,
      title: 'Multi-Dimensional Analytics',
      description: 'Track memory thresholds, execute time graphs, language distribution scores, and progress heatmaps in real-time.',
    }
  ];

  const companies = [
    'Google', 'Meta', 'Netflix', 'Microsoft', 'Stripe', 'Amazon', 'Vercel', 'Bloomberg'
  ];

  const faqs = [
    {
      q: 'How does CodeForge execute submissions securely?',
      a: 'CodeForge utilizes server-side sandboxed runtimes with strict CPU, filesystem, and network virtualization. JavaScript and Python code executes directly in sandboxed Node and Python virtual runtimes with 1.5-second process timeouts to guarantee absolute isolation.'
    },
    {
      q: 'What is ForgeAI, and how does it help me learn?',
      a: 'ForgeAI is an elite-tier AI debugger. Instead of directly printing the solution code, it analyzes your syntax and semantics to identify logic bugs, dry-run edge cases, suggest algorithmic optimizations, and score your code quality like a real FAANG interviewer.'
    },
    {
      q: 'Can I host private coding contests or test cases?',
      a: 'Absolutely! Our premium Admin Dashboard allows developers and administrators to perform CRUD actions on complex coding challenges, define hidden test cases in standard JSON format, and launch live or virtual competitive contests.'
    },
    {
      q: 'Is CodeForge mobile friendly?',
      a: 'Yes, CodeForge is built from the ground up to be responsive. The dashboard, profile, leaderboard, and discussion forums adjust flawlessly to touch, while the LeetCode-grade compiler layout provides a fully responsive coding interface.'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090b] text-[#e4e4e7]">
      
      {/* Background Glow Mesh */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[60%] h-[50%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[50%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:pt-28 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs text-violet-400">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span className="font-sans font-medium tracking-wide">
                ForgeAI Debugger v2.5 Now Live
              </span>
            </div>

            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight text-white">
              Forge Your Code.<br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Conquer Algorithms.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto lg:mx-0 text-slate-400 text-sm sm:text-base leading-relaxed">
              CodeForge is an enterprise-grade competitive coding platform engineered for high-performance sandboxing, real-time metrics, and conversational AI coaching. Learn smarter, compete faster, and level up your DSA game.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-4">
              <button
                onClick={onGetStarted}
                className="group flex w-full sm:w-auto items-center justify-center space-x-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-500 transition-all duration-200 cursor-pointer"
                id="landing-cta-primary"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onGetStarted}
                className="flex w-full sm:w-auto items-center justify-center space-x-2 rounded-xl border border-[#27272a] bg-[#18181b] px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-[#27272a] hover:text-white transition-all cursor-pointer"
              >
                <span>Explore Challenges</span>
              </button>
            </div>

          </div>

          {/* Right Column: 3D Floating Coding Window Mockup */}
          <div className="lg:col-span-5 relative z-10 flex justify-center">
            <div className="w-full max-w-md rounded-2xl border border-[#27272a] bg-[#0c0c0e] p-4 shadow-2xl backdrop-blur-md hover:border-violet-500/20 transition-all duration-500 hover:scale-[1.01]">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                <div className="flex items-center space-x-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="rounded-md bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-slate-400">
                  twoSum.py — Editor
                </div>
                <div className="h-3 w-3 opacity-0" />
              </div>

              {/* Coding Screen */}
              <div className="space-y-2 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
                <p className="text-slate-500"># Return indices of two numbers adding to target</p>
                <p><span className="text-pink-500">def</span> <span className="text-blue-400">twoSum</span>(nums, target):</p>
                <p className="pl-4"><span className="text-purple-400">seen</span> = &#123;&#125;</p>
                <p className="pl-4"><span className="text-pink-500">for</span> i, num <span className="text-pink-500">in</span> <span className="text-blue-400">enumerate</span>(nums):</p>
                <p className="pl-8">complement = target - num</p>
                <p className="pl-8"><span className="text-pink-500">if</span> complement <span className="text-pink-500">in</span> seen:</p>
                <p className="pl-12"><span className="text-pink-500">return</span> [seen[complement], i]</p>
                <p className="pl-8">seen[num] = i</p>
                <p className="pl-4"><span className="text-pink-500">return</span> []</p>
              </div>

              {/* Status footer mock */}
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500">
                  <span>Ln 5, Col 12</span>
                  <span>•</span>
                  <span>UTF-8</span>
                  <span>•</span>
                  <span className="text-violet-400 font-bold">Python 3</span>
                </div>
                <div className="rounded-md bg-green-500/10 border border-green-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-green-400 animate-pulse">
                  ✔ SUCCESS: 4/4 Test Cases Passed
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Statistics Block */}
      <section className="relative border-y border-[#27272a] bg-[#0c0c0e] z-10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((st, i) => (
              <div key={i} className="space-y-1">
                <div className="font-sans font-extrabold text-3xl sm:text-4xl text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  {st.value}
                </div>
                <div className="font-sans text-xs text-[#a1a1aa] font-medium">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client hiring showcase */}
      <section className="relative z-10 py-10 opacity-70">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-6">
            Elite Engineers Placed At Global Leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {companies.map((c, i) => (
              <span key={i} className="font-sans font-black text-sm tracking-tight text-slate-400 hover:text-white transition-all cursor-default">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Engineered For the Elite.
          </h2>
          <p className="max-w-2xl mx-auto text-[#a1a1aa] text-sm">
            Everything you need to master problem-solving, track algorithmic performance, and ace tech assessments in one seamless application.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((ft, i) => {
            const Icon = ft.icon;
            return (
              <div 
                key={i} 
                className="group rounded-xl border border-[#27272a] bg-[#18181b]/50 p-6 backdrop-blur-md hover:border-violet-500/20 hover:bg-[#18181b] transition-all duration-300 shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/5 border border-violet-500/15 text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-sans font-bold text-sm text-white group-hover:text-violet-400 transition-colors">
                  {ft.title}
                </h3>
                <p className="mt-2 text-[#a1a1aa] text-xs leading-relaxed">
                  {ft.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <div 
              key={idx} 
              className="rounded-xl border border-[#27272a] bg-[#18181b]/40 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-sans font-bold text-xs text-white hover:bg-white/5 cursor-pointer transition-all"
              >
                <span className="flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4 text-violet-400" />
                  <span>{f.q}</span>
                </span>
                <span className="text-[#a1a1aa]">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-4 text-xs text-[#a1a1aa] leading-relaxed border-t border-[#27272a] pt-3 bg-[#0c0c0e]/80">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="relative z-10 border-t border-[#27272a] bg-[#0c0c0e]/90 py-12 text-center text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-4">
          <div className="flex justify-center items-center space-x-2">
            <Terminal className="h-4 w-4 text-violet-400" />
            <span className="font-sans font-bold text-xs text-white tracking-tight">CodeForge Enterprise Ltd.</span>
          </div>
          <p className="text-[10px] leading-relaxed max-w-md mx-auto">
            CodeForge is a high-performance evaluation workspace designed for modern software craftsmanship. Build your portfolio, share algorithms, and practice DSA with elite AI feedback.
          </p>
          <div className="text-[9px] text-slate-600">
            © 2026 CodeForge. Manufactured with pristine engineering. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
