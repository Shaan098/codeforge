/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Database, 
  Plus, 
  Trash2, 
  Users, 
  Activity, 
  Cpu, 
  CheckCircle, 
  XCircle, 
  Save, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export default function AdminPanel({ problems, onAddProblem, onDeleteProblem }) {
  const [adminTab, setAdminTab] = React.useState('problems');

  // Form State
  const [title, setTitle] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('Easy');
  const [description, setDescription] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [companies, setCompanies] = React.useState('');
  const [testCaseInput, setTestCaseInput] = React.useState('');
  const [testCaseExpected, setTestCaseExpected] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Users State (simulated)
  const [bannedUsers, setBannedUsers] = React.useState([]);
  const adminUsers = [
    { id: '1', username: 'shaan_admin', email: 'shaansaurav633@gmail.com', role: 'Staff Administrator', status: 'Active' },
    { id: '2', username: 'brian_core', email: 'brian.dev@gmail.com', role: 'Judge Architect', status: 'Active' },
    { id: '3', username: 'malicious_user', email: 'spam.bot@gmail.com', role: 'Competitor', status: 'Active' },
  ];

  const handleAddProblemSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !testCaseInput || !testCaseExpected) {
      alert('Please fill out all required fields, including at least 1 test case.');
      return;
    }

    setLoading(true);

    const testCases = [
      {
        input: testCaseInput,
        expected: testCaseExpected
      }
    ];

    const tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean);
    const companiesArr = companies.split(',').map(c => c.trim()).filter(Boolean);

    try {
      await onAddProblem({
        title,
        difficulty,
        description,
        tags: tagsArr,
        companies: companiesArr,
        testCases,
        codeTemplates: {
          javascript: `function ${title.charAt(0).toLowerCase() + title.slice(1).replace(/\s+/g, '')}(arg) {\n    // Write your code here\n}`,
          python: `def ${title.charAt(0).toLowerCase() + title.slice(1).replace(/\s+/g, '')}(arg):\n    # Write your code here\n    pass`
        }
      });

      // Reset
      setTitle('');
      setDescription('');
      setTags('');
      setCompanies('');
      setTestCaseInput('');
      setTestCaseExpected('');
      alert('Prisitne Algorithm Problem successfully compiled and added to global lists!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBanUser = (email) => {
    if (bannedUsers.includes(email)) {
      setBannedUsers(bannedUsers.filter(e => e !== email));
      alert(`User account ${email} has been unbanned successfully.`);
    } else {
      setBannedUsers([...bannedUsers, email]);
      alert(`User account ${email} has been banned for platform security violations.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-amber-500" />
          <h2 className="font-sans font-extrabold text-xl text-white tracking-tight">
            Admin Console & Forge Controls
          </h2>
        </div>
        <p className="text-slate-400 text-xs">
          Manage system-level algorithms, configure container endpoints, audit users, and monitor telemetry.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1.5 border-b border-white/5 pb-2">
        {[
          { id: 'problems', label: 'Problem CRUD Matrix', icon: Plus },
          { id: 'users', label: 'User Governance', icon: Users },
          { id: 'metrics', label: 'System Telemetry', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                adminTab === tab.id 
                  ? 'text-amber-400 bg-white/5' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contents */}
      {adminTab === 'problems' && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Create Problem Form */}
          <div className="lg:col-span-7 rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
            <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Draft New Algorithm Challenge</span>
            </h3>

            <form onSubmit={handleAddProblemSubmit} className="space-y-4 text-xs">
              
              <div className="grid sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 space-y-1">
                  <label className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">Problem Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Reverse Integer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-slate-950 px-2.5 py-2 text-xs text-slate-300 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-slate-950 px-2.5 py-2 text-xs text-slate-300 cursor-pointer focus:outline-hidden"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">Problem Description (Supports Markdown and code highlights)</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the algorithm challenge..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-slate-950 p-2.5 text-xs text-slate-300 focus:outline-hidden"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">Topic Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Array, Hash Table..."
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-slate-950 px-2.5 py-2 text-xs text-slate-300 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">Target Companies (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Google, Microsoft..."
                    value={companies}
                    onChange={(e) => setCompanies(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-slate-950 px-2.5 py-2 text-xs text-slate-300 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Genuinely editable test case definitions */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <h4 className="font-sans font-bold text-xs text-amber-400">Sandbox Test Cases Configuration</h4>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">TestCase 1 Input</label>
                    <textarea
                      required
                      placeholder="[2,7,11,15]\n9"
                      value={testCaseInput}
                      onChange={(e) => setTestCaseInput(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-white/5 bg-slate-950 p-2.5 text-xs font-mono text-slate-300 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">TestCase 1 Expected Output</label>
                    <textarea
                      required
                      placeholder="[0,1]"
                      value={testCaseExpected}
                      onChange={(e) => setTestCaseExpected(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-white/5 bg-slate-950 p-2.5 text-xs font-mono text-slate-300 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center space-x-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 text-xs font-bold text-slate-950 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Publish New Challenge</span>
              </button>

            </form>
          </div>

          {/* Delete problem matrix */}
          <div className="lg:col-span-5 rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
            <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">
              Problems Lifecycle Matrix
            </h3>

            <div className="divide-y divide-white/5 max-h-[360px] overflow-y-auto">
              {problems.map(prob => (
                <div key={prob.id} className="flex items-center justify-between py-3">
                  <div>
                    <span className="block font-sans font-bold text-xs text-white">
                      {prob.title}
                    </span>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      {prob.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to permanently delete "${prob.title}" algorithm?`)) {
                        onDeleteProblem(prob.id);
                      }
                    }}
                    className="rounded-lg p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Governance tab */}
      {adminTab === 'users' && (
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
          <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">
            User Governance & Security Auditing
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-white/5 bg-slate-950/40">
                  <th className="py-3 pl-4 font-bold uppercase tracking-wider">Username</th>
                  <th className="py-3 font-bold uppercase tracking-wider">Email Address</th>
                  <th className="py-3 font-bold uppercase tracking-wider">System Role</th>
                  <th className="py-3 font-bold uppercase tracking-wider">Platform Security</th>
                  <th className="py-3 pr-4 text-right font-bold uppercase tracking-wider">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {adminUsers.map(user => {
                  const isBanned = bannedUsers.includes(user.email);
                  return (
                    <tr key={user.id} className="hover:bg-white/5">
                      <td className="py-3.5 pl-4 font-bold text-white">@{user.username}</td>
                      <td className="py-3.5 text-slate-400">{user.email}</td>
                      <td className="py-3.5 font-mono text-[10px] text-slate-500 uppercase">{user.role}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[9px] font-bold ${
                          isBanned ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10'
                        }`}>
                          {isBanned ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                          <span>{isBanned ? 'BANNED' : 'SECURE'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-right">
                        <button
                          onClick={() => handleToggleBanUser(user.email)}
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer ${
                            isBanned 
                              ? 'text-green-400 hover:bg-green-500/10' 
                              : 'text-red-400 hover:bg-red-500/10'
                          }`}
                        >
                          {isBanned ? 'Revoke Ban' : 'Restrict'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Metrics tab */}
      {adminTab === 'metrics' && (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          {[
            { label: 'Sandbox Isolation Ratio', value: '100%', sub: 'Docker micro-virtualized', color: 'border-green-500/10 bg-green-500/5 text-green-400', icon: Cpu },
            { label: 'Median Exec Speed', value: '0.04s', sub: 'Compiled dynamically', color: 'border-amber-500/10 bg-amber-500/5 text-amber-500', icon: Activity },
            { label: 'Compiler Load Threshold', value: '0.12%', sub: 'High throughput overhead', color: 'border-blue-500/10 bg-blue-500/5 text-blue-400', icon: Cpu },
            { label: 'Failed Checkups', value: '0', sub: 'Zero platform lockouts', color: 'border-green-500/10 bg-green-500/5 text-green-400', icon: AlertTriangle }
          ].map((met, i) => {
            const Icon = met.icon;
            return (
              <div key={i} className={`rounded-xl border p-4 text-center space-y-1 backdrop-blur-md ${met.color}`}>
                <div className="flex justify-center mb-1">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="block font-sans font-black text-2xl tracking-tight">{met.value}</span>
                <span className="block font-sans font-bold text-[10px] text-white uppercase">{met.label}</span>
                <span className="block font-mono text-[9px] text-slate-500">{met.sub}</span>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}
