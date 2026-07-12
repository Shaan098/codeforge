/**
 * Initial database seed data (migrated from src/server/db.ts)
 */
export function getInitialData() {
  const defaultProblems = [
    {
      id: 'p1',
      title: 'Two Sum',
      slug: 'two-sum',
      difficulty: 'Easy',
      description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

You can return the answer in any order.

### Example 1:
**Input:** nums = [2,7,11,15], target = 9  
**Output:** [0,1]  
**Explanation:** Because nums[0] + nums[1] == 9, we return [0, 1].

### Example 2:
**Input:** nums = [3,2,4], target = 6  
**Output:** [1,2]

### Example 3:
**Input:** nums = [3,3], target = 6  
**Output:** [0,1]`,
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
        { input: 'nums = [3,3], target = 6', output: '[0,1]' }
      ],
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.'
      ],
      hints: [
        'A really brute force way would be to search for all possible pairs. That would be O(N^2) time.',
        'Can we use a hash map to reduce the time complexity of looking up complements to O(1)?',
        'For each element, check if target - element is already in the map.'
      ],
      tags: ['Array', 'Hash Table'],
      companies: ['Google', 'Meta', 'Amazon', 'Apple', 'Stripe'],
      acceptanceRate: 49.6,
      testCases: [
        { input: '[2, 7, 11, 15]\n9', expected: '[0,1]' },
        { input: '[3, 2, 4]\n6', expected: '[1,2]' },
        { input: '[3, 3]\n6', expected: '[0,1]' },
        { input: '[1, 5, 8, 12, 14]\n20', expected: '[2,3]' }
      ],
      hiddenTestCases: [
        { input: '[0, 4, 3, 0]\n0', expected: '[0,3]' },
        { input: '[-1, -2, -3, -4, -5]\n-8', expected: '[2,4]' },
        { input: '[1, 2]\n3', expected: '[0,1]' },
        { input: '[100, 200, 300, 400, 500]\n600', expected: '[1,3]' },
        { input: '[1000000, 999999]\n1999999', expected: '[0,1]' },
        { input: '[5, 25, 75, 50]\n100', expected: '[1,2]' }
      ],
      codeTemplates: {
        javascript: `function twoSum(nums, target) {
    // Write your code here
    
}`,
        python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your code here
    pass`,
        cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
        java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[0];
    }
}`
      }
    },
    {
      id: 'p2',
      title: 'Valid Parentheses',
      slug: 'valid-parentheses',
      difficulty: 'Easy',
      description: `Given a string \`s\` containing just the characters \`'\('\`, \`'\)'\`, \`'\{'\`, \`'\}'\`, \`'\['\` and \`'\]'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Example 1:
**Input:** s = "()"  
**Output:** true

### Example 2:
**Input:** s = "()[]{}"  
**Output:** true

### Example 3:
**Input:** s = "(]"  
**Output:** false`,
      examples: [
        { input: 's = "()"', output: 'true' },
        { input: 's = "()[]{}"', output: 'true' },
        { input: 's = "(]"', output: 'false' }
      ],
      constraints: [
        '1 <= s.length <= 10^4',
        's consists of parentheses only: "()[]{}"'
      ],
      hints: [
        'Use a Stack data structure.',
        'Whenever you see an opening bracket, push it onto the stack.',
        'Whenever you see a closing bracket, pop from the stack and verify it matches the current closing bracket.'
      ],
      tags: ['String', 'Stack'],
      companies: ['Microsoft', 'Amazon', 'Netflix', 'Bloomberg'],
      acceptanceRate: 40.8,
      testCases: [
        { input: '"()"', expected: 'true' },
        { input: '"()[]{}"', expected: 'true' },
        { input: '"(]"', expected: 'false' },
        { input: '"([{}])"', expected: 'true' },
        { input: '"(["', expected: 'false' }
      ],
      hiddenTestCases: [
        { input: '""', expected: 'true' },
        { input: '")"', expected: 'false' },
        { input: '"(((())))"', expected: 'true' },
        { input: '"({[)]}"', expected: 'false' },
        { input: '"{[()]}{}[]()"', expected: 'true' },
        { input: '"((("', expected: 'false' },
        { input: '"}{"', expected: 'false' }
      ],
      codeTemplates: {
        javascript: `function isValid(s) {
    // Write your code here
    
}`,
        python: `def isValid(s: str) -> bool:
    # Write your code here
    pass`,
        cpp: `#include <string>
#include <stack>

class Solution {
public:
    bool isValid(std::string s) {
        // Write your code here
        
    }
};`,
        java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}`
      }
    },
    {
      id: 'p3',
      title: 'Longest Substring Without Repeating Characters',
      slug: 'longest-substring-without-repeating-characters',
      difficulty: 'Medium',
      description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.

A **substring** is a contiguous non-empty sequence of characters within a string.

### Example 1:
**Input:** s = "abcabcbb"  
**Output:** 3  
**Explanation:** The answer is "abc", with the length of 3.

### Example 2:
**Input:** s = "bbbbb"  
**Output:** 1  
**Explanation:** The answer is "b", with the length of 1.

### Example 3:
**Input:** s = "pwwkew"  
**Output:** 3  
**Explanation:** The answer is "wke", with the length of 3. Note that the answer must be a substring, "pwke" is a subsequence and not a substring.`,
      examples: [
        { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
        { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
        { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' }
      ],
      constraints: [
        '0 <= s.length <= 5 * 10^4',
        's consists of English letters, digits, symbols and spaces.'
      ],
      hints: [
        'A sliding window approach can maintain the current unique substring.',
        'Use a map or hash set to track characters currently inside your window.',
        'When a duplicate is found, shrink the window from the left.'
      ],
      tags: ['Hash Table', 'String', 'Sliding Window'],
      companies: ['Amazon', 'Google', 'Bloomberg', 'Uber', 'Lyft'],
      acceptanceRate: 34.2,
      testCases: [
        { input: '"abcabcbb"', expected: '3' },
        { input: '"bbbbb"', expected: '1' },
        { input: '"pwwkew"', expected: '3' },
        { input: '""', expected: '0' },
        { input: '"au"', expected: '2' }
      ],
      hiddenTestCases: [
        { input: '" "', expected: '1' },
        { input: '"dvdf"', expected: '3' },
        { input: '"anviaj"', expected: '5' },
        { input: '"abcdefghijklmnopqrstuvwxyz"', expected: '26' },
        { input: '"aab"', expected: '2' },
        { input: '"tmmzuxt"', expected: '5' }
      ],
      codeTemplates: {
        javascript: `function lengthOfLongestSubstring(s) {
    // Write your code here
    
}`,
        python: `def lengthOfLongestSubstring(s: str) -> int:
    # Write your code here
    pass`,
        cpp: `#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        // Write your code here
        
    }
};`
      }
    },
    {
      id: 'p4',
      title: 'Search in Rotated Sorted Array',
      slug: 'search-in-rotated-sorted-array',
      difficulty: 'Medium',
      description: `There is an integer array \`nums\` sorted in ascending order (with **distinct** values).

Prior to being passed to your function, \`nums\` is **possibly rotated** at an unknown pivot index \`k\` (\`1 <= k < nums.length\`) such that the resulting array is \`[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]\` (**0-indexed**). For example, \`[0,1,2,4,5,6,7]\` might be rotated at pivot index \`3\` and become \`[4,5,6,7,0,1,2]\`.

Given the array \`nums\` **after** the possible rotation and an integer \`target\`, return *the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`*.

You must write an algorithm with \`O(log n)\` runtime complexity.

### Example 1:
**Input:** nums = [4,5,6,7,0,1,2], target = 0  
**Output:** 4

### Example 2:
**Input:** nums = [4,5,6,7,0,1,2], target = 3  
**Output:** -1

### Example 3:
**Input:** nums = [1], target = 0  
**Output:** -1`,
      examples: [
        { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
        { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' },
        { input: 'nums = [1], target = 0', output: '-1' }
      ],
      constraints: [
        '1 <= nums.length <= 5000',
        '-10^4 <= nums[i] <= 10^4',
        'All values of nums are unique.',
        'nums is an ascending array that is possibly rotated.',
        '-10^4 <= target <= 10^4'
      ],
      hints: [
        'A binary search can still work on a rotated array.',
        'In any division of a rotated sorted array, at least one half is always sorted.',
        'Check if target lies within the boundaries of the sorted half.'
      ],
      tags: ['Array', 'Binary Search'],
      companies: ['LinkedIn', 'Facebook', 'Microsoft', 'Oracle'],
      acceptanceRate: 39.1,
      testCases: [
        { input: '[4, 5, 6, 7, 0, 1, 2]\n0', expected: '4' },
        { input: '[4, 5, 6, 7, 0, 1, 2]\n3', expected: '-1' },
        { input: '[1]\n0', expected: '-1' },
        { input: '[5, 1, 3]\n3', expected: '2' }
      ],
      hiddenTestCases: [
        { input: '[1]\n1', expected: '0' },
        { input: '[2, 1]\n1', expected: '1' },
        { input: '[3, 4, 5, 1, 2]\n4', expected: '1' },
        { input: '[1, 2, 3, 4, 5, 6]\n6', expected: '5' },
        { input: '[6, 7, 1, 2, 3, 4, 5]\n7', expected: '1' },
        { input: '[11, 13, 15, 17]\n12', expected: '-1' }
      ],
      codeTemplates: {
        javascript: `function search(nums, target) {
    // Write your code here
    
}`,
        python: `def search(nums: list[int], target: int) -> int:
    # Write your code here
    pass`
      }
    },
    {
      id: 'p5',
      title: 'Edit Distance',
      slug: 'edit-distance',
      difficulty: 'Hard',
      description: `Given two strings \`word1\` and \`word2\`, return *the minimum number of operations required to convert \`word1\` to \`word2\`*.

You have the following three operations permitted on a word:
1. Insert a character
2. Delete a character
3. Replace a character

### Example 1:
**Input:** word1 = "horse", word2 = "ros"  
**Output:** 3  
**Explanation:**   
horse -> rorse (replace 'h' with 'r')  
rorse -> rose (remove 'r')  
rose -> ros (remove 'e')

### Example 2:
**Input:** word1 = "intention", word2 = "execution"  
**Output:** 5  
**Explanation:**   
intention -> inention (remove 't')  
inention -> enention (replace 'i' with 'e')  
enention -> exention (replace 'n' with 'x')  
exention -> exection (replace 'n' with 'c')  
exection -> execution (insert 'u')`,
      examples: [
        { input: 'word1 = "horse", word2 = "ros"', output: '3' },
        { input: 'word1 = "intention", word2 = "execution"', output: '5' }
      ],
      constraints: [
        '0 <= word1.length, word2.length <= 500',
        'word1 and word2 consist of lowercase English letters.'
      ],
      hints: [
        'This is a classic dynamic programming problem.',
        'Define dp[i][j] as the minimum operations to convert word1[0...i-1] to word2[0...j-1].',
        'If word1[i-1] == word2[j-1], dp[i][j] = dp[i-1][j-1]. Otherwise, look at insert, delete, replace operations.'
      ],
      tags: ['String', 'Dynamic Programming'],
      companies: ['Google', 'Goldman Sachs', 'Amazon', 'Vercel'],
      acceptanceRate: 53.9,
      testCases: [
        { input: '"horse"\n"ros"', expected: '3' },
        { input: '"intention"\n"execution"', expected: '5' },
        { input: '""\n"a"', expected: '1' }
      ],
      hiddenTestCases: [
        { input: '""\n""', expected: '0' },
        { input: '"a"\n"a"', expected: '0' },
        { input: '"abc"\n"abc"', expected: '0' },
        { input: '"abc"\n""', expected: '3' },
        { input: '"kitten"\n"sitting"', expected: '3' },
        { input: '"sunday"\n"saturday"', expected: '3' },
        { input: '"plasma"\n"altruism"', expected: '6' }
      ],
      codeTemplates: {
        javascript: `function minDistance(word1, word2) {
    // Write your code here
    
}`,
        python: `def minDistance(word1: str, word2: str) -> int:
    # Write your code here
    pass`
      }
    }
  ];

  const defaultUsers = [
    {
      id: 'u1',
      username: 'CodeCraftMaster',
      email: 'shaansaurav633@gmail.com', // Match the user's active login context
      xp: 2450,
      level: 12,
      currentStreak: 5,
      longestStreak: 12,
      lastSolvedDate: new Date().toISOString().split('T')[0],
      bio: 'Staff Engineer & Passionate Competitive Coder. Solving DSA & building AI engines.',
      college: 'Stanford University',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      location: 'San Francisco, CA',
      rank: 42,
      badges: [
        { id: 'b1', title: '5-Day Streak', description: 'Solved problems 5 days in a row', unlockedAt: '2026-07-02T10:00:00Z', icon: 'Flame' },
        { id: 'b2', title: 'DP Guru', description: 'Completed a Hard DP Problem', unlockedAt: '2026-06-28T15:00:00Z', icon: 'Cpu' }
      ],
      bookmarks: ['p1', 'p3'],
      joinedAt: '2026-01-15T08:00:00Z'
    },
    {
      id: 'tourist',
      username: 'tourist',
      email: 'tourist@codeforge.org',
      xp: 15430,
      level: 45,
      currentStreak: 21,
      longestStreak: 154,
      bio: 'Legendary Grandmaster. Number 1 on Codeforces.',
      college: 'ITMO University',
      location: 'Gomel, Belarus',
      rank: 1,
      badges: [{ id: 'legend', title: 'Grandmaster', description: 'Ultimate ranking winner', unlockedAt: '2026-01-01T00:00:00Z', icon: 'Trophy' }],
      bookmarks: [],
      joinedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'benq',
      username: 'BenQ',
      email: 'benq@codeforge.org',
      xp: 11200,
      level: 38,
      currentStreak: 14,
      longestStreak: 92,
      bio: 'Competitive coding enthusiast, IOI & ICPC Gold Medalist.',
      college: 'MIT',
      location: 'Boston, MA',
      rank: 2,
      badges: [{ id: 'b_icpc', title: 'ICPC Champion', description: 'Completed regional podium', unlockedAt: '2026-03-01T00:00:00Z', icon: 'Award' }],
      bookmarks: [],
      joinedAt: '2026-02-12T00:00:00Z'
    },
    {
      id: 'neal_wu',
      username: 'neal_wu',
      email: 'neal@codeforge.org',
      xp: 9800,
      level: 32,
      currentStreak: 8,
      longestStreak: 77,
      bio: 'Ex-Google. Competitive programming enthusiast.',
      college: 'Harvard University',
      location: 'New York, NY',
      rank: 3,
      badges: [],
      bookmarks: [],
      joinedAt: '2026-03-15T00:00:00Z'
    }
  ];

  const defaultSubmissions = [
    {
      id: 's_sub1',
      userId: 'u1',
      username: 'CodeCraftMaster',
      problemId: 'p1',
      problemTitle: 'Two Sum',
      problemSlug: 'two-sum',
      language: 'javascript',
      code: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
      status: 'Accepted',
      executionTime: 45,
      memoryUsage: 38.4,
      testCasesPassed: 4,
      totalTestCases: 4,
      createdAt: '2026-07-03T20:15:00-07:00'
    },
    {
      id: 's_sub2',
      userId: 'u1',
      username: 'CodeCraftMaster',
      problemId: 'p2',
      problemTitle: 'Valid Parentheses',
      problemSlug: 'valid-parentheses',
      language: 'python',
      code: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack`,
      status: 'Accepted',
      executionTime: 28,
      memoryUsage: 14.1,
      testCasesPassed: 5,
      totalTestCases: 5,
      createdAt: '2026-07-04T02:30:00-07:00'
    },
    {
      id: 's_sub3',
      userId: 'tourist',
      username: 'tourist',
      problemId: 'p5',
      problemTitle: 'Edit Distance',
      problemSlug: 'edit-distance',
      language: 'cpp',
      code: `#include <vector>
#include <string>
#include <algorithm>

class Solution {
public:
    int minDistance(std::string word1, std::string word2) {
        int m = word1.length(), n = word2.length();
        std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1));
        for(int i=0; i<=m; i++) dp[i][0] = i;
        for(int j=0; j<=n; j++) dp[0][j] = j;
        for(int i=1; i<=m; i++) {
            for(int j=1; j<=n; j++) {
                if(word1[i-1] == word2[j-1]) dp[i][j] = dp[i-1][j-1];
                else dp[i][j] = 1 + std::min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
            }
        }
        return dp[m][n];
    }
};`,
      status: 'Accepted',
      executionTime: 8,
      memoryUsage: 8.2,
      testCasesPassed: 3,
      totalTestCases: 3,
      createdAt: '2026-07-03T12:00:00Z'
    }
  ];

  const defaultDiscussions = [
    {
      id: 'd1',
      problemId: 'p1',
      userId: 'tourist',
      username: 'tourist',
      title: 'Linear Time Complexity using Hash Map (C++/Python/Java)',
      content: `Here is the optimal O(N) solution using a single-pass hash map lookup. We store elements in the hash map as we iterate. For each element, we check if its complement (target - num) is already present.

\`\`\`cpp
std::vector<int> twoSum(std::vector<int>& nums, int target) {
    std::unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}
\`\`\`

**Complexity Analysis:**
- **Time Complexity:** O(N) — We only traverse the array containing N elements once. Each lookup in the table costs O(1) time.
- **Space Complexity:** O(N) — The extra space required depends on the number of items stored in the hash table, which stores at most N elements.`,
      votes: 124,
      upvotedBy: ['u1', 'benq'],
      replies: [
        {
          id: 'r1',
          userId: 'benq',
          username: 'BenQ',
          content: 'Excellent explanation tourist! Clean and straightforward. The O(N) single-pass is the absolute industry standard.',
          createdAt: '2026-07-02T14:00:00Z'
        },
        {
          id: 'r2',
          userId: 'u1',
          username: 'CodeCraftMaster',
          content: 'Thanks for this! Truly elegant. Helped me understand why two-pass hash map is redundant.',
          createdAt: '2026-07-03T09:30:00Z'
        }
      ],
      createdAt: '2026-07-01T11:00:00Z',
      isPinned: true
    },
    {
      id: 'd2',
      userId: 'benq',
      username: 'BenQ',
      title: 'Welcome to CodeForge General Forum! Introduce yourself here',
      content: `Welcome elite developers to CodeForge! 🚀

This is the general forum for announcements, platform feedback, and community chat. Let us know:
1. What languages do you code in?
2. What are your competitive programming or professional goals?
3. What is your favorite data structure/algorithm?

Keep coding, keep forging!`,
      votes: 89,
      upvotedBy: ['u1', 'tourist'],
      replies: [
        {
          id: 'r3',
          userId: 'u1',
          username: 'CodeCraftMaster',
          content: 'Hi everyone! I code primarily in JavaScript, Python, and C++. My favorite algorithm is QuickSelect, and my goal is to crack competitive coding leaderboards.',
          createdAt: '2026-07-03T22:00:00Z'
        }
      ],
      createdAt: '2026-06-30T00:00:00Z',
      isPinned: true
    }
  ];

  const defaultContests = [
    {
      id: 'c1',
      title: 'Weekly Bi-weekly CodeForge Cup #12',
      description: 'Test your algorithmic metal in our official bi-weekly contest. 4 challenges, 90 minutes. High rewards and rating boosts!',
      durationMinutes: 90,
      startTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // Tomorrow
      status: 'Upcoming',
      problems: ['p1', 'p2', 'p3', 'p4'],
      participants: [
        { userId: 'u1', username: 'CodeCraftMaster', score: 0, timeSpent: 0 },
        { userId: 'tourist', username: 'tourist', score: 0, timeSpent: 0 }
      ]
    },
    {
      id: 'c2',
      title: 'Algorithmic Blitz: Dynamic Programming Sprint',
      description: 'Solve complex recurrence problems. Rated for all tiers.',
      durationMinutes: 120,
      startTime: new Date(Date.now() - 3600 * 1000).toISOString(), // Started 1 hour ago
      status: 'Running',
      problems: ['p5'],
      participants: [
        { userId: 'tourist', username: 'tourist', score: 100, timeSpent: 12 },
        { userId: 'benq', username: 'BenQ', score: 100, timeSpent: 22 }
      ]
    },
    {
      id: 'c3',
      title: 'Inaugural CodeForge Beta Challenge',
      description: 'Our first ever beta testing contest. Thank you for participating!',
      durationMinutes: 60,
      startTime: '2026-06-15T18:00:00Z',
      status: 'Past',
      problems: ['p1', 'p2'],
      participants: [
        { userId: 'tourist', username: 'tourist', score: 200, timeSpent: 15 },
        { userId: 'benq', username: 'BenQ', score: 200, timeSpent: 18 },
        { userId: 'u1', username: 'CodeCraftMaster', score: 200, timeSpent: 35 }
      ]
    }
  ];

  return {
    users: defaultUsers,
    problems: defaultProblems,
    submissions: defaultSubmissions,
    discussions: defaultDiscussions,
    contests: defaultContests
  };
}
