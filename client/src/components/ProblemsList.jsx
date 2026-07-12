/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Search, 
  Bookmark, 
  CheckCircle, 
  Circle, 
  HelpCircle, 
  ChevronDown, 
  Building2, 
  Tag, 
  Filter,
  ArrowUpDown,
  BookMarked
} from 'lucide-react';

export default function ProblemsList({
  problems,
  submissions,
  bookmarks,
  onSelectProblem,
  onToggleBookmark
}) {
  // Filters state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('All');
  const [selectedTag, setSelectedTag] = React.useState('All');
  const [selectedCompany, setSelectedCompany] = React.useState('All');
  const [selectedStatus, setSelectedStatus] = React.useState('All');

  // Sorting state
  const [sortField, setSortField] = React.useState('title');
  const [sortOrder, setSortOrder] = React.useState('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  // Set of unique tags & companies
  const allTags = React.useMemo(() => {
    const set = new Set();
    problems.forEach(p => p.tags.forEach(t => set.add(t)));
    return ['All', ...Array.from(set)];
  }, [problems]);

  const allCompanies = React.useMemo(() => {
    const set = new Set();
    problems.forEach(p => p.companies.forEach(c => set.add(c)));
    return ['All', ...Array.from(set)];
  }, [problems]);

  // Set of solved problem IDs
  const solvedProblemIds = React.useMemo(() => {
    return new Set(submissions.filter(s => s.status === 'Accepted').map(s => s.problemId));
  }, [submissions]);

  // Filter & Sort Logic
  const filteredProblems = React.useMemo(() => {
    let list = [...problems];

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Difficulty
    if (selectedDifficulty !== 'All') {
      list = list.filter(p => p.difficulty === selectedDifficulty);
    }

    // Tag
    if (selectedTag !== 'All') {
      list = list.filter(p => p.tags.includes(selectedTag));
    }

    // Company
    if (selectedCompany !== 'All') {
      list = list.filter(p => p.companies.includes(selectedCompany));
    }

    // Status
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Solved') {
        list = list.filter(p => solvedProblemIds.has(p.id));
      } else if (selectedStatus === 'Unsolved') {
        list = list.filter(p => !solvedProblemIds.has(p.id));
      } else if (selectedStatus === 'Bookmarked') {
        list = list.filter(p => bookmarks.includes(p.id));
      }
    }

    // Sorting
    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Custom ordering for Difficulty Easy < Medium < Hard
      if (sortField === 'difficulty') {
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        valA = difficultyOrder[a.difficulty];
        valB = difficultyOrder[b.difficulty];
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [problems, searchQuery, selectedDifficulty, selectedTag, selectedCompany, selectedStatus, sortField, sortOrder, solvedProblemIds, bookmarks]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage) || 1;
  const paginatedProblems = React.useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProblems.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProblems, currentPage]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('All');
    setSelectedTag('All');
    setSelectedCompany('All');
    setSelectedStatus('All');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Filters panel */}
      <div className="rounded-2xl border border-[#27272a] bg-[#18181b]/40 p-5 backdrop-blur-md space-y-4">
        <div className="grid md:grid-cols-12 gap-4 items-center">
          
          {/* Search Bar */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search problem title or description..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-xl border border-[#27272a] bg-[#0c0c0e] pl-10 pr-4 py-2.5 text-xs font-medium text-slate-100 placeholder-slate-500 focus:border-violet-500/50 focus:outline-hidden transition-all"
            />
          </div>

          {/* Difficulty Dropdown Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => { setSelectedDifficulty(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-xl border border-[#27272a] bg-[#0c0c0e] px-3.5 py-2.5 text-xs text-slate-300 font-medium cursor-pointer focus:border-violet-500/50 focus:outline-hidden transition-all"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Tag Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedTag}
              onChange={(e) => { setSelectedTag(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-xl border border-[#27272a] bg-[#0c0c0e] px-3.5 py-2.5 text-xs text-slate-300 font-medium cursor-pointer focus:border-violet-500/50 focus:outline-hidden transition-all"
            >
              <option value="All">All Topics</option>
              {allTags.filter(t => t !== 'All').map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Company Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedCompany}
              onChange={(e) => { setSelectedCompany(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-xl border border-[#27272a] bg-[#0c0c0e] px-3.5 py-2.5 text-xs text-slate-300 font-medium cursor-pointer focus:border-violet-500/50 focus:outline-hidden transition-all"
            >
              <option value="All">All Companies</option>
              {allCompanies.filter(c => c !== 'All').map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-xl border border-[#27272a] bg-[#0c0c0e] px-3.5 py-2.5 text-xs text-slate-300 font-medium cursor-pointer focus:border-violet-500/50 focus:outline-hidden transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="Unsolved">Unsolved</option>
              <option value="Bookmarked">Bookmarked</option>
            </select>
          </div>

        </div>

        {/* Clear Filter button if active */}
        {(searchQuery || selectedDifficulty !== 'All' || selectedTag !== 'All' || selectedCompany !== 'All' || selectedStatus !== 'All') && (
          <div className="flex items-center justify-between border-t border-[#27272a] pt-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {filteredProblems.length} Results Found
            </span>
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 font-sans text-[10px] text-violet-400 hover:text-violet-300 font-bold uppercase tracking-wider cursor-pointer"
            >
              <Filter className="h-3 w-3" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Problems List Table */}
      <div className="rounded-2xl border border-[#27272a] bg-[#18181b]/40 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-[#27272a] bg-[#0c0c0e]">
                <th className="py-4 pl-5 w-12 font-bold uppercase tracking-wider">Status</th>
                <th 
                  onClick={() => toggleSort('title')}
                  className="py-4 font-bold uppercase tracking-wider cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Title</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('difficulty')}
                  className="py-4 font-bold uppercase tracking-wider cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Difficulty</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('acceptanceRate')}
                  className="py-4 font-bold uppercase tracking-wider cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Acceptance</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="py-4 font-bold uppercase tracking-wider">Topic Tags</th>
                <th className="py-4 font-bold uppercase tracking-wider">Target Companies</th>
                <th className="py-4 pr-5 w-16 text-right font-bold uppercase tracking-wider">Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {paginatedProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No coding challenges match your custom search parameters.
                  </td>
                </tr>
              ) : (
                paginatedProblems.map((prob) => {
                  const isSolved = solvedProblemIds.has(prob.id);
                  const isBookmarked = bookmarks.includes(prob.id);

                  const diffColors = {
                    Easy: 'text-green-400 bg-green-500/5 border-green-500/10',
                    Medium: 'text-yellow-400 bg-yellow-500/5 border-yellow-500/10',
                    Hard: 'text-red-400 bg-red-500/5 border-red-500/10',
                  };

                  return (
                    <tr 
                      key={prob.id}
                      className="hover:bg-white/5 transition-all duration-150 cursor-pointer group"
                    >
                      {/* Checkbox State */}
                      <td className="py-4.5 pl-5" onClick={() => onSelectProblem(prob.slug)}>
                        {isSolved ? (
                          <CheckCircle className="h-4.5 w-4.5 text-green-500" />
                        ) : (
                          <Circle className="h-4.5 w-4.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        )}
                      </td>

                      {/* Title & Slug */}
                      <td className="py-4.5 font-bold text-white group-hover:text-violet-400 transition-colors" onClick={() => onSelectProblem(prob.slug)}>
                        {prob.title}
                      </td>

                      {/* Difficulty */}
                      <td className="py-4.5" onClick={() => onSelectProblem(prob.slug)}>
                        <span className={`rounded-md border px-2 py-0.5 font-sans font-bold text-[9px] uppercase tracking-wide ${diffColors[prob.difficulty]}`}>
                          {prob.difficulty}
                        </span>
                      </td>

                      {/* Acceptance Rate */}
                      <td className="py-4.5 font-mono text-slate-400" onClick={() => onSelectProblem(prob.slug)}>
                        {prob.acceptanceRate}%
                      </td>

                      {/* Topic Tags */}
                      <td className="py-4.5" onClick={() => onSelectProblem(prob.slug)}>
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {prob.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="flex items-center space-x-1 rounded bg-[#18181b] border border-[#27272a] px-1.5 py-0.5 text-[9px] text-slate-400">
                              <Tag className="h-2.5 w-2.5" />
                              <span>{tag}</span>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Companies */}
                      <td className="py-4.5" onClick={() => onSelectProblem(prob.slug)}>
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {prob.companies.slice(0, 2).map(c => (
                            <span key={c} className="flex items-center space-x-1 rounded bg-[#0c0c0e] border border-[#27272a] px-1.5 py-0.5 text-[9px] text-violet-400 font-medium">
                              <Building2 className="h-2.5 w-2.5" />
                              <span>{c}</span>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Bookmarks */}
                      <td className="py-4.5 pr-5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(prob.id);
                          }}
                          className="rounded-lg p-1.5 text-slate-500 hover:text-violet-400 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          {isBookmarked ? (
                            <Bookmark className="h-4.5 w-4.5 text-violet-400 fill-violet-400" />
                          ) : (
                            <Bookmark className="h-4.5 w-4.5" />
                          )}
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#27272a] bg-[#0c0c0e]/80 px-5 py-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Page {currentPage} of {totalPages}
            </span>
            
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="rounded-lg border border-[#27272a] bg-[#0c0c0e] px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="rounded-lg border border-[#27272a] bg-[#0c0c0e] px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
