/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  User as UserIcon, 
  MapPin, 
  GraduationCap, 
  Github, 
  Linkedin, 
  Flame, 
  Award, 
  Trophy, 
  Calendar,
  Sparkles,
  Save,
  Edit2,
  BookOpen,
  Lock,
  CheckCircle2,
  History
} from 'lucide-react';
import ContributionGraph from './ContributionGraph.jsx';

export default function Profile({ currentUser, submissions, onUpdateProfile, onRefreshUserData, setActiveTab, initialEditMode, setProfileEditMode }) {
  // Edit mode states
  const [isEditing, setIsEditing] = React.useState(initialEditMode || false);
  const [username, setUsername] = React.useState(currentUser.username || '');
  const [email, setEmail] = React.useState(currentUser.email || '');
  const [bio, setBio] = React.useState(currentUser.bio || '');
  const [college, setCollege] = React.useState(currentUser.college || '');
  const [github, setGithub] = React.useState(currentUser.github || '');
  const [linkedin, setLinkedin] = React.useState(currentUser.linkedin || '');
  const [location, setLocation] = React.useState(currentUser.location || '');
  const [loading, setLoading] = React.useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdateProfile({ username, email, bio, college, github, linkedin, location });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (initialEditMode) {
      setIsEditing(true);
      // Consume the prop so it doesn't get stuck
      if (setProfileEditMode) setProfileEditMode(false);
    }
  }, [initialEditMode, setProfileEditMode]);

  // Badges lists to guarantee all gamification targets look fantastic
  const badgeConfig = [
    { id: 'badge_first', title: 'First Blood', desc: 'Successfully solved your first algorithm challenge!', icon: Flame, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
    { id: 'badge_streak_5', title: 'Unstoppable', desc: 'Solved problems 5 days in a row', icon: Sparkles, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { id: 'badge_hard', title: 'Apex Coder', desc: 'Conquered an enterprise-level hard algorithm problem!', icon: Trophy, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' }
  ];

  // Dynamic language metrics computation
  const getLangStats = (subs) => {
    const solved = subs.filter(s => s.status === 'Accepted').length;
    const total = subs.length;
    const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
    return { solved, pct: `${pct}%` };
  };

  const list = submissions || [];
  const jsStats = getLangStats(list.filter(s => s.language.toLowerCase().includes('javascript') || s.language.toLowerCase().includes('ts') || s.language.toLowerCase().includes('js')));
  const pyStats = getLangStats(list.filter(s => s.language.toLowerCase().includes('python') || s.language.toLowerCase().includes('py')));
  const cppStats = getLangStats(list.filter(s => s.language.toLowerCase().includes('cpp') || s.language.toLowerCase().includes('c++') || s.language.toLowerCase().includes('c')));
  const javaStats = getLangStats(list.filter(s => s.language.toLowerCase().includes('java') && !s.language.toLowerCase().includes('script')));

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Basic Info */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md">
        <div className="absolute top-[-30%] right-[-10%] w-60 h-60 rounded-full bg-amber-500/10 blur-[50px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-sans font-black text-xl text-white">
              {currentUser.username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-sans font-extrabold text-xl text-white tracking-tight flex items-center space-x-2">
                <span>{currentUser.username}</span>
                <span className="rounded-md bg-amber-500/10 border border-amber-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-400">
                  LEVEL {currentUser.level}
                </span>
              </h2>
              <p className="text-slate-400 text-xs mt-1 max-w-sm">
                {currentUser.bio || 'Enterprise engineer at CodeForge workspace. Set up your personal bio details below.'}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] text-slate-500 font-medium">
                {currentUser.location && (
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{currentUser.location}</span>
                  </span>
                )}
                {currentUser.college && (
                  <span className="flex items-center space-x-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>{currentUser.college}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {new Date(currentUser.joinedAt).toLocaleDateString()}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-1.5 rounded-lg border border-white/5 bg-slate-950 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Edit2 className="h-3 w-3" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Embed Contribution Graph inside Profile view to match actual activity */}
      <ContributionGraph 
        currentUser={currentUser}
        submissions={submissions}
        onRefreshUserData={onRefreshUserData}
      />

      {/* Main Grid: Info Edit & Badge Grid */}
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Column: Editor / portfolio info links */}
        <div className="md:col-span-4 rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-md">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">
                Customize Profile
              </h3>

              <div className="space-y-1">
                <label className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="code_ninja"
                  className="w-full rounded-lg border border-white/5 bg-slate-950 px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400/50"
                />
              </div>
              
              <div className="space-y-1">
                <label className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-lg border border-white/5 bg-slate-950 px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">Bio Statement</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your engineering stack..."
                  rows={3}
                  className="w-full rounded-lg border border-white/5 bg-slate-950 p-2.5 text-xs text-slate-300 focus:outline-hidden focus:border-amber-400/50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">College / Institution</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="Stanford, MIT..."
                  className="w-full rounded-lg border border-white/5 bg-slate-950 px-2.5 py-2 text-xs text-slate-300 focus:outline-hidden focus:border-amber-400/50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">GitHub Username</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="octocat"
                  className="w-full rounded-lg border border-white/5 bg-slate-950 px-2.5 py-2 text-xs text-slate-300 focus:outline-hidden focus:border-amber-400/50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full rounded-lg border border-white/5 bg-slate-950 px-2.5 py-2 text-xs text-slate-300 focus:outline-hidden focus:border-amber-400/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center space-x-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 text-xs font-bold text-slate-950 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">
                Developer Links
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center space-x-2">
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {currentUser.github ? `@${currentUser.github}` : 'Not linked'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center space-x-2">
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {currentUser.linkedin ? 'Linked' : 'Not linked'}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-3.5">
                <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
                  Contest Metrics
                </h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-slate-950 p-3 border border-white/5">
                    <span className="block font-mono text-base font-bold text-white">#{currentUser.rank}</span>
                    <span className="block text-[8px] text-slate-500 font-bold uppercase">Global Rank</span>
                  </div>
                  <div className="rounded-xl bg-slate-950 p-3 border border-white/5">
                    <span className="block font-mono text-base font-bold text-amber-500">{currentUser.xp}</span>
                    <span className="block text-[8px] text-slate-500 font-bold uppercase">Total XP</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Achievements & unlocked badges details */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Badger list */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
            <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">
              Milestone Badge Achievements
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {badgeConfig.map(badge => {
                const Icon = badge.icon;
                const isUnlocked = currentUser.badges.some(b => b.id === badge.id);

                return (
                  <div 
                    key={badge.id}
                    className={`rounded-xl border p-4 flex items-start space-x-3.5 relative overflow-hidden transition-all duration-300 ${
                      isUnlocked 
                        ? badge.color + ' hover:scale-[1.01]' 
                        : 'bg-slate-950/20 border-white/5 opacity-40'
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-slate-950 ${
                      isUnlocked ? 'text-inherit' : 'text-slate-600'
                    }`}>
                      {isUnlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-sans font-bold text-xs text-white">
                        {badge.title}
                      </h4>
                      <p className="text-slate-400 text-[10px] leading-relaxed">
                        {badge.desc}
                      </p>
                      {isUnlocked && (
                        <span className="block font-mono text-[8px] text-slate-500 uppercase font-bold mt-1.5">
                          Unlocked ✔
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solution metrics by Category */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
            <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">
              Language Solves Distribution
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'JavaScript / TS', solved: jsStats.solved, pct: jsStats.pct },
                { name: 'Python 3', solved: pyStats.solved, pct: pyStats.pct },
                { name: 'C++', solved: cppStats.solved, pct: cppStats.pct },
                { name: 'Java', solved: javaStats.solved, pct: javaStats.pct }
              ].map(lang => (
                <div key={lang.name} className="rounded-xl bg-slate-950 p-3.5 border border-white/5 text-center space-y-1">
                  <span className="block font-mono text-xs font-bold text-slate-300">{lang.name}</span>
                  <span className="block font-sans font-extrabold text-sm text-amber-500">{lang.solved} Solves</span>
                  <span className="block font-mono text-[9px] text-slate-500">{lang.pct} Accuracy</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Submissions Feed */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
            <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">
              Recent Submissions Activity
            </h3>

            {list.length > 0 ? (
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {list.slice(0, 5).map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/40 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="space-y-1 min-w-0">
                      <div className="text-xs font-bold text-slate-100 truncate">{sub.problemTitle}</div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                        <span className="uppercase font-mono bg-white/5 px-1.5 py-0.5 rounded text-[8px] text-slate-300">
                          {sub.language}
                        </span>
                        <span>•</span>
                        <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold ${
                        sub.status === 'Accepted'
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                      }`}>
                        {sub.status === 'Accepted' ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Accepted</span>
                          </>
                        ) : (
                          <span>{sub.status}</span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
                {setActiveTab && (
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className="w-full text-center py-2.5 mt-2 rounded-xl bg-slate-950 hover:bg-zinc-900 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-violet-400 cursor-pointer transition-all"
                  >
                    View All Submissions History →
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-3 py-10 rounded-xl border border-dashed border-[#27272a] bg-zinc-950/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/50 border border-white/5 text-slate-500">
                  <History className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-sans font-bold text-xs text-white">No Recent Submissions</h4>
                  <p className="text-slate-500 text-[10px] max-w-[200px] leading-relaxed">
                    Algorithm runs and completed challenges will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
