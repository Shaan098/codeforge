/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Trophy, 
  Search, 
  Flame, 
  Award, 
  ChevronDown, 
  TrendingUp, 
  Users, 
  School, 
  Clock,
  Sparkles
} from 'lucide-react';

export default function Leaderboard({ currentUser }) {
  const [boardType, setBoardType] = React.useState('global');
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    setLoading(true);
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setUsers(data.leaderboard || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [boardType]);

  // Filter users based on search query
  const filteredUsers = React.useMemo(() => {
    let list = [...users];

    // Filter by board type simulation (to guarantee high-fidelity UX)
    if (boardType === 'friends') {
      // Simulate close friends
      list = list.filter((u, i) => i % 2 === 0 || u.email === currentUser.email);
    } else if (boardType === 'college') {
      // Simulate same college
      list = list.filter((u, i) => i % 3 === 0 || u.email === currentUser.email);
    }

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      list = list.filter(u => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    // Add back the user ranks
    return list.map((user, idx) => ({ ...user, rank: idx + 1 }));
  }, [users, search, boardType, currentUser.email]);

  // Podium top 3
  const podium = React.useMemo(() => {
    return filteredUsers.slice(0, 3);
  }, [filteredUsers]);

  const remainingUsers = React.useMemo(() => {
    return filteredUsers.slice(3);
  }, [filteredUsers]);

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-violet-400" />
          <h2 className="font-sans font-extrabold text-xl text-white tracking-tight">
            Competitive Leaderboards
          </h2>
        </div>
        <p className="text-slate-400 text-xs">
          Rankings are updated continuously. Complete challenges, build streaks, and achieve milestone badges to claim the podium!
        </p>
      </div>

      {/* Leaderboard Category Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#27272a] pb-2">
        <div className="flex space-x-1.5">
          {[
            { id: 'global', label: 'Global Ranking', icon: Trophy },
            { id: 'friends', label: 'Friends League', icon: Users },
            { id: 'college', label: 'College / Uni', icon: School },
            { id: 'monthly', label: 'Weekly Active', icon: Clock }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setBoardType(tab.id); setSearch(''); }}
                className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  boardType === tab.id 
                    ? 'text-violet-400 bg-white/5' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Competitor Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search coder rank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#27272a] bg-[#0c0c0e] pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-violet-500/50 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Podium Banners for Top 3 */}
      {podium.length > 0 && !search && (
        <div className="grid grid-cols-3 gap-4 items-end max-w-2xl mx-auto pt-6 pb-2">
          
          {/* #2 Silver */}
          {podium[1] && (
            <div className="rounded-2xl border border-slate-700/30 bg-slate-900/40 p-4 text-center space-y-2 flex flex-col items-center shadow-lg relative">
              <div className="absolute top-[-15px] h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center border-4 border-slate-950 font-mono text-xs font-bold text-slate-950">
                2
              </div>
              <div className="h-11 w-11 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600">
                <span className="font-bold text-xs text-white">{podium[1].username.substring(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <span className="block font-sans font-bold text-xs text-white truncate max-w-[80px]">
                  {podium[1].username}
                </span>
                <span className="block font-mono text-[10px] text-slate-400">
                  {podium[1].xp} XP
                </span>
              </div>
            </div>
          )}

          {/* #1 Gold */}
          {podium[0] && (
            <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-[#09090b] p-5 text-center space-y-3 flex flex-col items-center shadow-2xl relative min-h-[145px]">
              <div className="absolute top-[-20px] h-10 w-10 rounded-full bg-violet-500 flex items-center justify-center border-4 border-slate-950 font-mono text-sm font-black text-slate-950 shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                1
              </div>
              <div className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center border-2 border-violet-400 shadow-md">
                <span className="font-extrabold text-sm text-white">{podium[0].username.substring(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <span className="block font-sans font-extrabold text-xs text-violet-400 truncate max-w-[100px] flex items-center justify-center space-x-1">
                  <span>{podium[0].username}</span>
                  <Sparkles className="h-3 w-3 text-violet-400 fill-violet-400" />
                </span>
                <span className="block font-mono text-[10px] font-bold text-slate-300 mt-0.5">
                  {podium[0].xp} XP
                </span>
              </div>
            </div>
          )}

          {/* #3 Bronze */}
          {podium[2] && (
            <div className="rounded-2xl border border-orange-700/20 bg-slate-900/40 p-4 text-center space-y-2 flex flex-col items-center shadow-lg relative">
              <div className="absolute top-[-15px] h-8 w-8 rounded-full bg-orange-700 flex items-center justify-center border-4 border-slate-950 font-mono text-xs font-bold text-white">
                3
              </div>
              <div className="h-11 w-11 rounded-full bg-slate-800 flex items-center justify-center border border-orange-600/30">
                <span className="font-bold text-xs text-white">{podium[2].username.substring(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <span className="block font-sans font-bold text-xs text-white truncate max-w-[80px]">
                  {podium[2].username}
                </span>
                <span className="block font-mono text-[10px] text-slate-400">
                  {podium[2].xp} XP
                </span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Main Ranking Table */}
      <div className="rounded-2xl border border-[#27272a] bg-[#18181b]/40 backdrop-blur-md overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs">
            Loading real-time competitive logs...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-[#27272a] bg-[#0c0c0e]">
                  <th className="py-4 pl-5 w-16 font-bold uppercase tracking-wider text-center">Rank</th>
                  <th className="py-4 font-bold uppercase tracking-wider">Coder</th>
                  <th className="py-4 font-bold uppercase tracking-wider text-center">Level</th>
                  <th className="py-4 font-bold uppercase tracking-wider">Active Streak</th>
                  <th className="py-4 font-bold uppercase tracking-wider">Total Solver XP</th>
                  <th className="py-4 pr-5 w-24 text-right font-bold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]">
                {filteredUsers.map((user) => {
                  const isSelf = user.email === currentUser.email;
                  
                  return (
                    <tr 
                      key={user.id}
                      className={`transition-colors ${
                        isSelf ? 'bg-violet-500/5 hover:bg-violet-500/10' : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-4 text-center font-mono text-xs font-bold text-slate-300">
                        {user.rank === 1 ? (
                          <span className="text-violet-400">👑 1</span>
                        ) : user.rank === 2 ? (
                          <span className="text-slate-400">🥈 2</span>
                        ) : user.rank === 3 ? (
                          <span className="text-orange-400">🥉 3</span>
                        ) : (
                          user.rank
                        )}
                      </td>

                      {/* Username */}
                      <td className="py-4 font-sans font-bold text-white flex items-center space-x-3">
                        <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center border border-[#27272a] font-bold text-[10px] text-violet-400">
                          {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="block">{user.username}</span>
                          {isSelf && (
                            <span className="block font-mono text-[8px] text-violet-400 font-bold uppercase">
                              You (Active Session)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Level */}
                      <td className="py-4 text-center font-mono text-slate-300 font-bold">
                        {user.level}
                      </td>

                      {/* Streak */}
                      <td className="py-4">
                        <div className="flex items-center space-x-1.5 text-violet-400">
                          <Flame className="h-3.5 w-3.5 fill-violet-400" />
                          <span className="font-mono font-bold">{user.currentStreak} Days</span>
                        </div>
                      </td>

                      {/* Total XP */}
                      <td className="py-4 font-mono text-slate-300 font-bold">
                        {user.xp} XP
                      </td>

                      {/* Status Checkbox Solved */}
                      <td className="py-4 pr-5 text-right font-mono text-[10px] text-slate-500 font-bold">
                        ACTIVE
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
