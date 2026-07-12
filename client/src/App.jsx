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
import { authService, profileService, submissionService } from './services/index.js';
import toast from './utils/toast.js';
import ErrorBoundary from './utils/ErrorBoundary.jsx';

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
  const [currentUser, setCurrentUser] = React.useState(fallbackUser);
  const [selectedProblem, setSelectedProblem] = React.useState(null);
  const { problems, isLoading, addProblem, removeProblem, refetch } = useProblems();
  const { submissions, fetchSubmissions, setSubmissions } = useSubmissions();

  const refreshUserData = React.useCallback(async () => {
    try {
      const me = await authService.me();
      setCurrentUser(me.data.user);
      await fetchSubmissions(me.data.user.id);
    } catch {
      await fetchSubmissions(currentUser.id);
    }
  }, [currentUser.id, fetchSubmissions]);

  React.useEffect(() => {
    async function bootstrapSession() {
      try {
        if (!localStorage.getItem('codeforge_token')) {
          const login = await authService.login('shaansaurav633@gmail.com', 'codeforge123');
          localStorage.setItem('codeforge_token', login.data.token);
          setCurrentUser(login.data.user);
        } else {
          const me = await authService.me();
          setCurrentUser(me.data.user);
        }
      } catch {
        setCurrentUser(fallbackUser);
      }
    }

    bootstrapSession();
  }, []);

  React.useEffect(() => {
    fetchSubmissions(currentUser.id);
  }, [currentUser.id, fetchSubmissions]);

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
      const response = await fetch(`/api/problems/${id}`);
      const data = await response.json();
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
    setCurrentUser(res.data.user);
    toast.success('Profile updated.');
  };

  const handleLogout = () => {
    localStorage.removeItem('codeforge_token');
    setCurrentUser(fallbackUser);
    setSubmissions([]);
    setActiveTab('landing');
  };

  const renderContent = () => {
    if (activeTab === 'landing') {
      return <LandingPage onGetStarted={() => setActiveTab('dashboard')} />;
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
        />
      ),
      admin: <AdminPanel problems={problems} onAddProblem={async (problem) => { await addProblem(problem); await refetch(); }} onDeleteProblem={removeProblem} />,
    };

    return views[activeTab] || views.dashboard;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5]">
        {activeTab !== 'landing' && (
          <Navbar
            currentUser={currentUser}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogoutClick={handleLogout}
          />
        )}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {renderContent()}
        </main>
      </div>
    </ErrorBoundary>
  );
}
