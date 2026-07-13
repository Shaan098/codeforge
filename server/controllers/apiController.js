import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/env.js';
import { getDb, toSafeUser } from '../services/store.js';
import { signToken } from '../middleware/auth.js';
import { runCodeInSandbox } from '../services/codeRunner.js';
import { generateAIDebugSession } from '../utils/gemini.js';

export function health(_req, res) {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: config.nodeEnv });
}

export async function register(req, res, next) {
  try {
    const data = getDb();
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, and password are required.' });
    }

    const exists = data.users.find((user) => user.email === email || user.username === username);
    if (exists) return res.status(409).json({ error: 'Username or email already taken.' });

    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: await bcrypt.hash(password, 12),
      xp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastSolvedDate: null,
      bio: '',
      college: '',
      github: '',
      linkedin: '',
      location: '',
      rank: data.users.length + 1,
      badges: [],
      bookmarks: [],
      joinedAt: new Date().toISOString(),
    };

    data.users.push(newUser);
    const token = signToken({ id: newUser.id, username: newUser.username });
    res.status(201).json({ token, user: toSafeUser(newUser) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const data = getDb();
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'email and password required.' });

    const user = data.users.find((item) => item.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const valid = user.password
      ? await bcrypt.compare(password, user.password)
      : password === config.defaultUserPassword;

    if (!valid) return res.status(401).json({ error: 'Invalid credentials.' });

    const token = signToken({ id: user.id, username: user.username });
    res.json({ token, user: toSafeUser(user) });
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  const user = getDb().users.find((item) => item.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: toSafeUser(user) });
}

export function listProblems(_req, res) {
  const problems = getDb().problems.map((problem) => {
    const { testCases, hiddenTestCases, codeTemplates, ...publicProblem } = problem;
    return { ...publicProblem, testCaseCount: testCases.length + (hiddenTestCases ? hiddenTestCases.length : 0) };
  });

  res.json({ problems });
}

export function getProblem(req, res) {
  const problem = getDb().problems.find((item) => item.id === req.params.id || item.slug === req.params.id);
  if (!problem) return res.status(404).json({ error: 'Problem not found.' });
  
  // SECURITY: Never expose hidden test cases
  const { hiddenTestCases, ...safeProblem } = problem;
  res.json({ problem: safeProblem });
}

export async function runCode(req, res, next) {
  try {
    const data = getDb();
    const { code, language, problemId } = req.body;

    if (!code || !language) return res.status(400).json({ error: 'code and language required.' });

    const problem = data.problems.find((item) => item.id === problemId);
    const testCase = problem?.testCases?.[0] || { input: '', expected: '' };
    const start = Date.now();
    const sandbox = await runCodeInSandbox(code, language, testCase.input);
    const executionTime = Date.now() - start;
    const actual = sandbox.stdout.trim();
    const expected = testCase.expected.trim();
    const passed = actual === expected;

    res.json({
      result: {
        status: sandbox.exitCode !== 0 ? 'Runtime Error' : passed ? 'Accepted' : 'Wrong Answer',
        stdout: sandbox.stdout,
        stderr: sandbox.exitCode !== 0
          ? sandbox.stderr
          : !passed
            ? `Test Case 1 Failed\nInput: ${testCase.input}\nExpected: ${expected}\nActual: ${actual}`
            : '',
        executionTime,
        memoryUsage: Math.round(20 + Math.random() * 20),
        testCasesPassed: passed ? 1 : 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function submitCode(req, res, next) {
  try {
    const data = getDb();
    const { code, language, problemId } = req.body;

    if (!code || !language || !problemId) {
      return res.status(400).json({ error: 'code, language, and problemId required.' });
    }

    const problem = data.problems.find((item) => item.id === problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found.' });

    let passed = 0;
    let lastError = '';
    const start = Date.now();
    
    // Combine visible and hidden test cases for submission
    const allTestCases = [...(problem.testCases || []), ...(problem.hiddenTestCases || [])];

    for (const testCase of allTestCases) {
      const result = await runCodeInSandbox(code, language, testCase.input, 5000);
      const actual = result.stdout.trim();

      if (result.exitCode !== 0) {
        lastError = result.stderr;
        break;
      }

      if (actual === testCase.expected.trim()) {
        passed += 1;
      } else {
        lastError = `Test Case ${passed + 1} Failed\nInput: ${testCase.input}\nExpected: ${testCase.expected}\nActual: ${actual}`;
        break;
      }
    }

    const status = lastError ? (lastError.includes('Failed') ? 'Wrong Answer' : 'Runtime Error') : 'Accepted';
    const submission = {
      id: uuidv4(),
      userId: req.user.id,
      username: req.user.username,
      problemId,
      problemTitle: problem.title,
      problemSlug: problem.slug,
      language,
      code,
      status,
      executionTime: Math.round((Date.now() - start) / allTestCases.length),
      memoryUsage: Math.round((20 + Math.random() * 30) * 1024) / 1024,
      testCasesPassed: passed,
      totalTestCases: allTestCases.length,
      error: lastError || undefined,
      createdAt: new Date().toISOString(),
    };

    data.submissions.push(submission);

    if (status === 'Accepted') {
      awardFirstSolveXp(data, req.user.id, problemId, problem);
    }

    res.json({ result: submission });
  } catch (error) {
    next(error);
  }
}

function awardFirstSolveXp(data, userId, problemId, problem) {
  const user = data.users.find((item) => item.id === userId);
  if (!user) return;

  const acceptedCount = data.submissions.filter(
    (item) => item.userId === userId && item.problemId === problemId && item.status === 'Accepted'
  ).length;

  if (acceptedCount !== 1) return;

  const xpGain = problem.difficulty === 'Easy' ? 50 : problem.difficulty === 'Medium' ? 100 : 200;
  user.xp = (user.xp || 0) + xpGain;
  user.level = Math.floor(user.xp / 200) + 1;

  const today = new Date().toISOString().split('T')[0];
  if (user.lastSolvedDate !== today) {
    user.currentStreak = (user.currentStreak || 0) + 1;
    user.longestStreak = Math.max(user.currentStreak, user.longestStreak || 0);
    user.lastSolvedDate = today;
  }
}

export async function aiDebug(req, res, next) {
  try {
    const data = getDb();
    const { code, language, problemId, expectedOutput, actualOutput, executionStatus } = req.body;

    if (!code || !language || !problemId) {
      return res.status(400).json({ error: 'code, language, and problemId required.' });
    }

    const problem = data.problems.find((item) => item.id === problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found.' });

    const analysis = await generateAIDebugSession({
      problem,
      code,
      language,
      expectedOutput,
      actualOutput,
      executionStatus,
      provider: 'mistral',
    });

    res.json({ analysis });
  } catch (error) {
    next(error);
  }
}

export function listMySubmissions(req, res) {
  const submissions = getDb().submissions.filter((item) => item.userId === req.user.id);
  res.json({ submissions });
}

export function listAllSubmissions(_req, res) {
  res.json({ submissions: getDb().submissions });
}

export function seedActivity(req, res) {
  const data = getDb();
  const userId = req.user?.id || req.body.userId;
  const user = data.users.find((item) => item.id === userId);

  if (!user) return res.status(404).json({ error: 'User not found.' });

  const acceptedProblems = data.problems.slice(0, 3);
  const generated = acceptedProblems.map((problem, index) => ({
    id: uuidv4(),
    userId: user.id,
    username: user.username,
    problemId: problem.id,
    problemTitle: problem.title,
    problemSlug: problem.slug,
    language: index % 2 === 0 ? 'javascript' : 'python',
    code: '// Seeded activity submission',
    status: 'Accepted',
    executionTime: 30 + index * 8,
    memoryUsage: 20 + index,
    testCasesPassed: problem.testCases.length,
    totalTestCases: problem.testCases.length,
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  }));

  data.submissions.push(...generated);
  res.status(201).json({ count: generated.length, submissions: data.submissions.filter((item) => item.userId === user.id) });
}

export function listDiscussions(req, res) {
  const { problemId } = req.query;
  let discussions = getDb().discussions;

  if (problemId) {
    discussions = discussions.filter((item) => item.problemId === problemId);
  }

  res.json({
    discussions: [...discussions].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)),
  });
}

export function createDiscussion(req, res) {
  const data = getDb();
  const { problemId, title, content } = req.body;

  if (!title || !content) return res.status(400).json({ error: 'title and content required.' });

  const discussion = {
    id: uuidv4(),
    problemId: problemId || null,
    userId: req.user.id,
    username: req.user.username,
    title,
    content,
    votes: 0,
    upvotedBy: [],
    replies: [],
    createdAt: new Date().toISOString(),
  };

  data.discussions.push(discussion);
  res.status(201).json({ discussion });
}

export function voteDiscussion(req, res) {
  const discussion = getDb().discussions.find((item) => item.id === req.params.id);
  if (!discussion) return res.status(404).json({ error: 'Discussion not found.' });

  const index = discussion.upvotedBy.indexOf(req.user.id);
  if (index === -1) {
    discussion.upvotedBy.push(req.user.id);
    discussion.votes += 1;
  } else {
    discussion.upvotedBy.splice(index, 1);
    discussion.votes -= 1;
  }

  res.json({ votes: discussion.votes, upvotedBy: discussion.upvotedBy });
}

export function addDiscussionReply(req, res) {
  const discussion = getDb().discussions.find((item) => item.id === req.params.id);
  if (!discussion) return res.status(404).json({ error: 'Discussion not found.' });
  if (!req.body.content) return res.status(400).json({ error: 'content required.' });

  discussion.replies.push({
    id: uuidv4(),
    userId: req.user.id,
    username: req.user.username,
    content: req.body.content,
    createdAt: new Date().toISOString(),
  });

  res.json({ replies: discussion.replies });
}

export function getLeaderboard(_req, res) {
  const data = getDb();
  const leaderboard = [...data.users]
    .map((user) => ({
      ...toSafeUser(user),
      solvedCount: data.submissions.filter((item) => item.userId === user.id && item.status === 'Accepted').length,
    }))
    .sort((a, b) => b.xp - a.xp || b.currentStreak - a.currentStreak)
    .map((user, index) => ({ ...user, rank: index + 1 }));

  res.json({ leaderboard });
}

export function getProfile(req, res) {
  const data = getDb();
  const user = data.users.find((item) => item.username === req.params.username);

  if (!user) return res.status(404).json({ error: 'User not found.' });

  res.json({
    user: toSafeUser(user),
    submissions: data.submissions.filter((item) => item.userId === user.id),
  });
}

export function updateProfile(req, res) {
  const data = getDb();
  const user = data.users.find((item) => item.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  if (req.body.email && req.body.email !== user.email) {
    const exists = data.users.find((item) => item.email === req.body.email);
    if (exists) return res.status(409).json({ error: 'Email is already in use.' });
    user.email = req.body.email;
  }

  if (req.body.username && req.body.username !== user.username) {
    const exists = data.users.find((item) => item.username === req.body.username);
    if (exists) return res.status(409).json({ error: 'Username is already taken.' });
    
    // Update username across relational data
    data.submissions.forEach((s) => { if (s.userId === user.id) s.username = req.body.username; });
    data.discussions.forEach((d) => {
      if (d.userId === user.id) d.username = req.body.username;
      d.replies.forEach((r) => { if (r.userId === user.id) r.username = req.body.username; });
    });
    
    user.username = req.body.username;
  }

  for (const key of ['bio', 'college', 'github', 'linkedin', 'location']) {
    if (req.body[key] !== undefined) user[key] = req.body[key];
  }

  const token = signToken({ id: user.id, username: user.username });
  res.json({ token, user: toSafeUser(user) });
}

export function toggleBookmark(req, res) {
  const user = getDb().users.find((item) => item.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const problemId = req.params.problemId;
  const index = (user.bookmarks || []).indexOf(problemId);
  if (index === -1) user.bookmarks.push(problemId);
  else user.bookmarks.splice(index, 1);

  res.json({ bookmarks: user.bookmarks });
}

export function listContests(_req, res) {
  res.json({ contests: getDb().contests });
}

export function joinContest(req, res) {
  const contest = getDb().contests.find((item) => item.id === req.params.id);
  if (!contest) return res.status(404).json({ error: 'Contest not found.' });

  const alreadyIn = contest.participants.find((item) => item.userId === req.user.id);
  if (!alreadyIn) {
    contest.participants.push({ userId: req.user.id, username: req.user.username, score: 0, timeSpent: 0 });
  }

  res.json({ contest });
}

export function adminListProblems(_req, res) {
  res.json({ problems: getDb().problems });
}

export function adminCreateProblem(req, res) {
  const data = getDb();
  const problem = {
    id: uuidv4(),
    slug: req.body.slug || String(req.body.title || 'problem').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    ...req.body,
    acceptanceRate: req.body.acceptanceRate || 0,
    createdAt: new Date().toISOString(),
  };

  data.problems.push(problem);
  res.status(201).json({ problem });
}

export function adminUpdateProblem(req, res) {
  const data = getDb();
  const index = data.problems.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Problem not found.' });

  data.problems[index] = { ...data.problems[index], ...req.body };
  res.json({ problem: data.problems[index] });
}

export function adminDeleteProblem(req, res) {
  const data = getDb();
  const index = data.problems.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Problem not found.' });

  data.problems.splice(index, 1);
  res.json({ success: true });
}

export function adminListUsers(_req, res) {
  res.json({ users: getDb().users.map(toSafeUser) });
}

export function adminStats(_req, res) {
  const data = getDb();
  res.json({
    totalUsers: data.users.length,
    totalProblems: data.problems.length,
    totalSubmissions: data.submissions.length,
    acceptedSubmissions: data.submissions.filter((item) => item.status === 'Accepted').length,
  });
}
