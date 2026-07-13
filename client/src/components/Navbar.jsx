/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Trophy, 
  Terminal, 
  LayoutDashboard, 
  Code2, 
  Users, 
  User as UserIcon, 
  Flame, 
  Database,
  Award,
  Menu,
  X,
  History
} from 'lucide-react';

export default function Navbar({ currentUser, activeTab, setActiveTab, onLogoutClick, onEditProfileClick }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'problems', label: 'Problems', icon: Code2 },
    { id: 'contests', label: 'Contests', icon: Trophy },
    { id: 'submissions', label: 'Submissions', icon: History },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award },
    { id: 'discussions', label: 'Discussions', icon: Users },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('landing')} 
          className="flex cursor-pointer items-center space-x-2.5 hover:opacity-90 transition-all duration-200"
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_0_20px_rgba(124,58,237,0.3)] border border-violet-500/20">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-sans font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              CodeForge
            </span>
            <span className="block font-mono text-[9px] font-semibold uppercase tracking-widest text-violet-400">
              Enterprise Judge
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'text-violet-400 bg-white/5 shadow-inner' 
                    : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
                }`}
                id={`nav-tab-${item.id}`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Statistics Controls */}
        <div className="hidden md:flex items-center space-x-4">
          
          {/* Active Streak Indicator */}
          <div 
            className="flex items-center space-x-1.5 rounded-full border border-violet-500/15 bg-violet-500/5 px-3 py-1 shadow-[0_0_15px_rgba(139,92,246,0.05)] animate-pulse"
            title="Daily Active Streak"
            id="nav-streak-counter"
          >
            <Flame className="h-4 w-4 text-violet-400 fill-violet-400" />
            <span className="font-mono text-xs font-bold text-violet-400">
              {currentUser.currentStreak}D STREAK
            </span>
          </div>

          {/* Level & XP Gauge */}
          <div className="flex flex-col items-end">
            <span className="font-mono text-[10px] font-bold text-[#a1a1aa]">
              LVL {currentUser.level}
            </span>
            <div className="flex items-center space-x-1">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/5 border border-[#27272a]">
                <div 
                  className="h-full bg-gradient-to-r from-violet-400 to-indigo-500" 
                  style={{ width: `${(currentUser.xp % 1000) / 10}%` }} 
                />
              </div>
              <span className="font-mono text-[9px] text-[#71717a] font-medium">
                {currentUser.xp % 1000}/1000
              </span>
            </div>
          </div>

          {/* Profile Circle Menu */}
          <div className="relative group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#27272a] bg-[#18181b] cursor-pointer overflow-hidden shadow-md group-hover:border-violet-400/40 transition-all duration-300">
              <span className="font-sans font-bold text-xs text-white">
                {currentUser.username.substring(0, 2).toUpperCase()}
              </span>
            </div>
            {/* Popover menu on Hover */}
            <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-xl border border-[#27272a] bg-[#0c0c0e] p-1 shadow-2xl backdrop-blur-xl scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
              <div className="px-3 py-2 text-xs font-semibold text-[#71717a] border-b border-[#27272a]">
                {currentUser.email}
              </div>
              <button 
                onClick={() => setActiveTab('profile')}
                className="w-full text-left px-3 py-2 text-xs text-[#a1a1aa] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                My Profile
              </button>
              <button 
                onClick={onEditProfileClick}
                className="w-full text-left px-3 py-2 text-xs text-[#a1a1aa] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                Edit Profile
              </button>
              <button 
                onClick={onLogoutClick}
                className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex md:hidden items-center space-x-3">
          {/* Active Streak */}
          <div className="flex items-center space-x-1 rounded-full bg-violet-500/5 px-2.5 py-0.5 border border-violet-500/10">
            <Flame className="h-3.5 w-3.5 text-violet-400 fill-violet-400" />
            <span className="font-mono text-[10px] font-bold text-violet-400">
              {currentUser.currentStreak}D
            </span>
          </div>

          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="rounded-lg border border-[#27272a] p-2 text-[#a1a1aa] hover:text-white hover:bg-white/5 cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#27272a] bg-[#09090b] px-4 py-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  isActive 
                    ? 'text-violet-400 bg-white/5' 
                    : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="border-t border-[#27272a] pt-3 flex items-center justify-between px-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#e4e4e7]">{currentUser.username}</span>
              <span className="text-[10px] text-[#71717a]">{currentUser.email}</span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  onEditProfileClick();
                  setMobileOpen(false);
                }}
                className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 cursor-pointer"
              >
                Edit
              </button>
              <button 
                onClick={onLogoutClick}
                className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
