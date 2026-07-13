import React from 'react';
import AdminPanel from './components/AdminPanel.jsx';
import Contests from './components/Contests.jsx';
import Dashboard from './components/Dashboard.jsx';
import LandingPage from './components/LandingPage.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Navbar from './components/Navbar.jsx';
import ProblemDetails from './components/ProblemDetails.jsx';
import ProblemsList from './components/ProblemsList.jsx';
import Profile from './components/Profile.jsx';
import SubmissionsHistory from './components/SubmissionsHistory.jsx';
import { useProblems } from './hooks/useProblems.js';
import { useSubmissions } from './hooks/useSubmissions.js';
import { authService, problemService, profileService, submissionService } from './services/index.js';
import toast from './utils/toast.js';
import ErrorBoundary from './utils/ErrorBoundary.jsx';
import AuthModal from './components/AuthModal.jsx';

const fallbackUser = {
  id: 'u1',
  username: 'CodeCraftMaster',
  email: 'shaansaurav633@gmail.com',
  xp: 2450,
  level: 12,
  currentStreak: 5,
  longestStreak: 12,
  badges: [],
  bookmarks: ['p1', 'p3'],
  joinedAt: new Date().toISOString(),
  rank: 1,
};

export default function App() {
  const [activeTab, setActiveTab] = React.useState('landing');
  const [currentUser, setCurrentUser] = React.useState(null);
  const [authModalState, setAuthModalState] = React.useState('hidden'); // 'hidden' | 'login' | 'register'
  const [profileEditMode, setProfileEditMode] = React.useState(false);
  const [selectedProblem, setSelectedProblem] = React.useState(null);
  const { problems, isLoading, addProblem, removeProblem, refetch } = useProblems();
  const { submissions, fetchSubmissions, setSubmissions } = useSubmissions();

  const refreshUserData = React.useCallback(async () => {
    try {
      const me = await authService.me();
      setCurrentUser(me.data.user);
      await fetchSubmissions(me.data.user.id);
    } catch {
      if (currentUser?.id) {
        await fetchSubmissions(currentUser.id);
      }
    }
  }, [currentUser?.id, fetchSubmissions]);

  React.useEffect(() => {
    async function bootstrapSession() {
      if (localStorage.getItem('codeforge_token')) {
        try {
          const me = await authService.me();
          setCurrentUser(me.data.user);
        } catch {
          localStorage.removeItem('codeforge_token');
          setCurrentUser(null);
        }
      }
    }

    bootstrapSession();
  }, []);

  React.useEffect(() => {
    if (currentUser) {
      fetchSubmissions(currentUser.id);
    }
  }, [currentUser?.id, fetchSubmissions]);

  const handleSelectProblem = async (problemOrId) => {
    const id = typeof problemOrId === 'string' ? problemOrId : problemOrId?.id;
    const problem = problemOrId?.codeTemplates
      ? problemOrId
      : problems.find((item) => item.id === id || item.slug === id);

    if (problem?.codeTemplates) {
      setSelectedProblem(problem);
      setActiveTab('problem-details');
      return;
    }

    try {
      const { data } = await problemService.getById(id);
      setSelectedProblem(data.problem);
      setActiveTab('problem-details');
    } catch {
      toast.error('Could not open problem.');
    }
  };

  const handleToggleBookmark = async (problemId) => {
    try {
      const res = await profileService.toggleBookmark(problemId);
      setCurrentUser((user) => ({ ...user, bookmarks: res.data.bookmarks }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRunCode = (code, language) => submissionService.run({
    code,
    language,
    problemId: selectedProblem.id,
  }).then((res) => res.data);

  const handleSubmitCode = (code, language) => submissionService.submit({
    code,
    language,
    problemId: selectedProblem.id,
  }).then(async (res) => {
    await refreshUserData();
    return res.data;
  });

  const handleAIDebug = (code, language, expectedOutput, actualOutput, executionStatus) =>
    submissionService.aiDebug({
      code,
      language,
      problemId: selectedProblem.id,
      expectedOutput,
      actualOutput,
      executionStatus,
    }).then((res) => res.data.analysis);

  const handleUpdateProfile = async (payload) => {
    const res = await profileService.update(payload);
    if (res.data.token) {
      localStorage.setItem('codeforge_token', res.data.token);
    }
    setCurrentUser(res.data.user);
    toast.success('Profile updated.');
  };

  const handleLogout = () => {
    localStorage.removeItem('codeforge_token');
    setCurrentUser(null);
    setSubmissions([]);
    setActiveTab('landing');
  };

  const renderContent = () => {
    if (activeTab === 'landing' || !currentUser) {
      return (
        <LandingPage 
          onGetStarted={() => currentUser ? setActiveTab('dashboard') : setAuthModalState('register')} 
        />
      );
    }

    if (activeTab === 'problem-details' && selectedProblem) {
      return (
        <ProblemDetails
          problem={selectedProblem}
          currentUser={currentUser}
          submissions={submissions}
          onCodeRun={handleRunCode}
          onCodeSubmit={handleSubmitCode}
          onAIDebug={handleAIDebug}
          onBack={() => setActiveTab('problems')}
          bookmarks={currentUser.bookmarks || []}
          onToggleBookmark={handleToggleBookmark}
        />
      );
    }

    const views = {
      dashboard: (
        <Dashboard
          currentUser={currentUser}
          problems={problems}
          submissions={submissions}
          onSelectProblem={handleSelectProblem}
          setActiveTab={setActiveTab}
          onRefreshUserData={refreshUserData}
          isLoading={isLoading}
        />
      ),
      problems: (
        <ProblemsList
          problems={problems}
          submissions={submissions}
          bookmarks={currentUser.bookmarks || []}
          onSelectProblem={handleSelectProblem}
          onToggleBookmark={handleToggleBookmark}
        />
      ),
      contests: <Contests onSelectProblem={handleSelectProblem} />,
      submissions: <SubmissionsHistory submissions={submissions} onSelectProblem={handleSelectProblem} />,
      leaderboard: <Leaderboard currentUser={currentUser} />,
      discussions: <ProblemsList problems={problems} submissions={submissions} bookmarks={currentUser.bookmarks || []} onSelectProblem={handleSelectProblem} onToggleBookmark={handleToggleBookmark} />,
      profile: (
        <Profile
          currentUser={currentUser}
          submissions={submissions}
          onUpdateProfile={handleUpdateProfile}
          onRefreshUserData={refreshUserData}
          setActiveTab={setActiveTab}
          initialEditMode={profileEditMode}
          setProfileEditMode={setProfileEditMode}
        />
      ),
      admin: <AdminPanel problems={problems} onAddProblem={async (problem) => { await addProblem(problem); await refetch(); }} onDeleteProblem={removeProblem} />,
    };

    return views[activeTab] || views.dashboard;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] overflow-x-hidden">
        <AuthModal
          isOpen={authModalState !== 'hidden'}
          mode={authModalState}
          setMode={setAuthModalState}
          onClose={() => setAuthModalState('hidden')}
          onSuccess={(data) => {
            localStorage.setItem('codeforge_token', data.token);
            setCurrentUser(data.user);
            setAuthModalState('hidden');
            setActiveTab('dashboard');
          }}
        />
        
        {currentUser && activeTab !== 'landing' && (
          <Navbar
            currentUser={currentUser}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogoutClick={handleLogout}
            onEditProfileClick={() => {
              setProfileEditMode(true);
              setActiveTab('profile');
            }}
          />
        )}
        {(!currentUser && activeTab !== 'landing') && (
          <div className="border-b border-white/5 bg-[#0c0c0e] py-3 px-6 flex justify-between items-center">
            <div className="font-sans font-black text-xl text-white tracking-tight">CodeForge</div>
            <div className="flex space-x-3">
              <button onClick={() => setAuthModalState('login')} className="text-sm font-semibold text-slate-300 hover:text-white cursor-pointer">Login</button>
              <button onClick={() => setAuthModalState('register')} className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-violet-500 cursor-pointer">Sign Up</button>
            </div>
          </div>
        )}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {renderContent()}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
