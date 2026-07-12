/**
 * server/utils/gemini.js → migrated to Mistral AI
 * AI debugging session using Mistral AI.
 *
 * Updated:
 * - Removed Google Gemini and Anthropic Claude integrations
 * - Using Mistral AI API exclusively
 * - Simplified to single AI provider
 */

import { Mistral } from '@mistralai/mistralai';

// Read API key at function call time (not at import time) to allow dotenv to run first
const getMistralKey = () => process.env.MISTRAL_API_KEY || process.env.MINSTRAL_API_KEY || '';

// ─── Lazy Singleton ───────────────────────────────────────────────────────────

let _mistralClient = null;

function getMistralClient() {
  if (!_mistralClient) {
    const apiKey = getMistralKey();
    if (!apiKey) {
      console.warn('MISTRAL_API_KEY is not set. AI Debugger will use offline fallback.');
    }
    _mistralClient = new Mistral({
      apiKey: apiKey || 'placeholder',
    });
  }
  return _mistralClient;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MISTRAL_MODEL = 'mistral-large-latest';

// ─── System Instruction ───────────────────────────────────────────────────────

function buildSystemInstruction() {
  return `You are "ForgeAI", an elite Staff Software Engineer and DSA Coach at CodeForge Enterprise.
Your goal is to guide the user to fix their code, like a senior engineer would in a code review.
NEVER write a fully corrected copy-pasteable solution. Instead:

1. **Problem Summary** — Briefly confirm your understanding of the problem.
2. **Complexity Analysis** — Compare the user's approach vs the optimal approach (Time & Space).
3. **Bug Identification** — Identify Logic / Runtime / Compilation errors clearly without revealing the full fix.
4. **Dry Run** — Walk through a failing test case step by step.
5. **Optimization Tips** — Suggest a better algorithm conceptually (e.g., "Consider a sliding window approach...").
6. **Learning Resources** — Provide 1-2 targeted hints or links to concepts.
7. **Code Quality Score** — Rate 0–100 based on code clarity, correctness, and algorithm selection.

Format using professional Markdown: clear sections, bullet points, and \`monospace\` for variables.
Begin with a styled header card identifying the engine: **ForgeAI — AI Debug Assistant**.`;
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildPrompt(input) {
  const { problem, code, language, expectedOutput, actualOutput, executionStatus } = input;

  return `Please analyze this programming submission and provide debugging guidance.

## Problem
**Title:** ${problem.title}
**Difficulty:** ${problem.difficulty}

**Description:**
${problem.description}

**Constraints:**
${(problem.constraints || []).join('\n')}

## User Submission
**Language:** ${language}
\`\`\`${language}
${code}
\`\`\`

## Test Results
- **Status:** ${executionStatus || 'Executed'}
- **Expected Output:** ${expectedOutput || 'Not provided'}
- **Actual Output:** ${actualOutput || 'Not provided'}`;
}

// ─── Offline Fallback ─────────────────────────────────────────────────────────

function offlineFallback(problem, language, executionStatus, reason) {
  return `## ⚠️ ForgeAI — AI Debug Assistant Offline

${reason}

---

### Static Code Analysis (Offline Mode)

| Field | Value |
|-------|-------|
| Problem | ${problem.title} |
| Difficulty | ${problem.difficulty} |
| Language | ${language} |
| Status | ${executionStatus || 'Unknown'} |

**Suggestions:**
- Check your loop bounds and edge cases (empty arrays, null inputs).
- Verify your return type matches the expected output.
- Test your logic on the example test cases manually before submitting.
- Consider if a hash map or two-pointer approach could simplify the solution.`;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Generate an AI debugging analysis for a user's code submission.
 *
 * @param {object} input
 * @param {object} input.problem - Problem document (public JSON)
 * @param {string} input.code - User's code
 * @param {string} input.language - Programming language
 * @param {string} [input.expectedOutput]
 * @param {string} [input.actualOutput]
 * @param {string} [input.executionStatus]
 * @param {string} [input.provider] - Ignored, kept for backward compatibility
 * @returns {Promise<string>} Markdown analysis
 */
export async function generateAIDebugSession(input) {
  const { problem, code, language, expectedOutput, actualOutput, executionStatus } = input;

  const systemInstruction = buildSystemInstruction();
  const prompt = buildPrompt(input);

  // Check API key availability
  if (!getMistralKey()) {
    return offlineFallback(
      problem,
      language,
      executionStatus,
      '**MISTRAL_API_KEY** is not set. Add it to your `.env` file.'
    );
  }

  try {
    const client = getMistralClient();
    
    const response = await client.chat.complete({
      model: MISTRAL_MODEL,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      maxTokens: 2048,
    });

    const content = response.choices?.[0]?.message?.content;
    return content || 'ForgeAI returned an empty response. Please try again.';
  } catch (err) {
    console.error('Mistral API error:', err.message);
    return offlineFallback(
      problem,
      language,
      executionStatus,
      `An error occurred: ${err.message}`
    );
  }
}
