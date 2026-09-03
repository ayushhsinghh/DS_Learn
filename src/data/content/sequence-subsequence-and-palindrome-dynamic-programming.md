## 1. Introduction to the Pattern
This family covers problems where we select, compare, transform, or partition ordered sequences.
The input may be:
```plain text
One array
One string
Two arrays
Two strings
One substring interval
```
The three major families are:
```plain text
Single-sequence DP
→ Select an ordered subsequence from one sequence

Two-sequence DP
→ Compare or transform two sequences

Palindrome DP
→ Solve symmetric subsequences or substring intervals
```
Typical problems include:
- Longest Increasing Subsequence
- Longest Common Subsequence
- Longest Common Substring
- Shortest Common Supersequence
- Edit Distance
- Distinct Subsequences
- Interleaving String
- Longest Palindromic Subsequence
- Longest Palindromic Substring
- Counting palindromic substrings
---
## Core Differences
### Subsequence
Characters or elements may be skipped:
```plain text
Input:       "abcde"
Subsequence: "ace"
```
Relative order must remain unchanged.
### Substring or subarray
Elements must be contiguous:
```plain text
Input:     "abcde"
Substring: "bcd"
```
### Increasing subsequence
One sequence is selected under an ordering condition:
```plain text
previous < current
```
### Common subsequence
Two sequences are compared while allowing skips in both.
### Palindrome
The sequence reads identically in both directions:
```plain text
"racecar"
"aba"
"bb"
```
---
## 2. How to Identify It
Look for these signals:
- The problem asks for a subsequence.
- Elements may be skipped without changing relative order.
- Two strings or arrays must be compared.
- The question asks for a common sequence.
- You must insert, delete, or replace characters.
- The answer depends on matching current characters.
- The state naturally contains two indices.
- The problem asks for a palindrome.
- The answer depends on an interval `[left, right]`.
- The two boundary characters determine the next state.
- The question asks for the longest, shortest, count, or feasibility.
#### Pattern-identification guide
```plain text
One sequence + ordering relationship
→ Single-sequence/LIS DP

Two sequences + matching or transformation
→ Two-sequence/LCS DP

One sequence + symmetry
→ Palindrome DP

Characters must remain contiguous
→ Substring DP

Characters may be skipped
→ Subsequence DP
```
#### Recognition question
> Am I preserving relative order while selecting, comparing, or matching sequence elements?
If yes, this DP family is likely relevant.
---
## 3. State Definition and Recursive Function Contract
Different forms use different state shapes.
### Single-sequence state
```plain text
solve(index, previousIndex)
```
Contract:
> Returns the best valid subsequence obtainable from `index` onward given the previously selected element.
Bottom-up alternative:
```plain text
dp[i]
= best valid subsequence ending exactly at i
```
### Two-sequence state
```plain text
solve(i, j)
```
Contract:
> Returns the required answer for the suffix of the first sequence beginning at `i` and the suffix of the second sequence beginning at `j`.
Prefix tabulation:
```plain text
dp[i][j]
= answer using the first i elements of sequence 1
  and first j elements of sequence 2
```
### Palindrome interval state
```plain text
solve(left, right)
```
Contract:
> Returns the required palindrome answer for the substring from `left` through `right`.
#### State-selection question
> What information about the unprocessed sequences can change the future answer?
That information belongs in the state.
---
## 4. Brute-Force Recursive Decision
### Single-sequence decision
For each element:
```plain text
Take it if compatible
or
Skip it
```
```java
int lis(
        int[] nums,
        int index,
        int previous
) {
    if (index == nums.length) {
        return 0;
    }

    int skip =
        lis(nums, index + 1, previous);

    int take = 0;

    if (previous == -1
            || nums[previous] < nums[index]) {
        take =
            1 + lis(nums, index + 1, index);
    }

    return Math.max(take, skip);
}
```
### Two-sequence decision
If characters match:
```plain text
Use both characters
→ Move both indices
```
If they differ:
```plain text
Skip from the first sequence
or
Skip from the second sequence
```
```java
int lcs(
        String first,
        String second,
        int i,
        int j
) {
    if (i == first.length()
            || j == second.length()) {
        return 0;
    }

    if (first.charAt(i)
            == second.charAt(j)) {
        return 1 + lcs(
            first,
            second,
            i + 1,
            j + 1
        );
    }

    return Math.max(
        lcs(first, second, i + 1, j),
        lcs(first, second, i, j + 1)
    );
}
```
### Palindrome decision
If boundary characters match:
```plain text
Use both boundaries
→ Solve the inner interval
```
Otherwise:
```plain text
Skip left boundary
or
Skip right boundary
```
```java
int longestPalindrome(
        String text,
        int left,
        int right
) {
    if (left > right) {
        return 0;
    }

    if (left == right) {
        return 1;
    }

    if (text.charAt(left)
            == text.charAt(right)) {
        return 2 + longestPalindrome(
            text,
            left + 1,
            right - 1
        );
    }

    return Math.max(
        longestPalindrome(
            text,
            left + 1,
            right
        ),
        longestPalindrome(
            text,
            left,
            right - 1
        )
    );
}
```
---
## 5. Base Cases
### Single sequence
No elements remain:
```java
if (index == nums.length) {
    return 0;
}
```
### Two sequences
If either sequence is exhausted, no more matching elements are possible:
```java
if (i == first.length()
        || j == second.length()) {
    return 0;
}
```
### Palindrome interval
Empty interval:
```java
if (left > right) {
    return 0;
}
```
One character:
```java
if (left == right) {
    return 1;
}
```
Every single character is a palindrome of length one.
### Prefix-based two-sequence DP
An empty sequence has LCS length zero with every other sequence:
```java
dp[0][j] = 0;
dp[i][0] = 0;
```
### Longest common substring
When either prefix is empty:
```plain text
matching suffix length = 0
```
### Counting transformations
The base cases depend on what remains.
For Distinct Subsequences:
```plain text
Target exhausted → one successful construction
Source exhausted first → zero constructions
```
---
## 6. Recurrence Relation
### LIS
```plain text
take =
1 + solve(index + 1, index)

skip =
solve(index + 1, previous)

answer = max(take, skip)
```
Bottom-up:
```plain text
dp[i]
= 1 + max(dp[j])

where:
j < i
and nums[j] < nums[i]
```
### LCS
When characters match:
```plain text
dp[i][j]
= 1 + dp[i - 1][j - 1]
```
When characters differ:
```plain text
dp[i][j]
= max(
    dp[i - 1][j],
    dp[i][j - 1]
)
```
### Longest common substring
When characters match:
```plain text
dp[i][j]
= 1 + dp[i - 1][j - 1]
```
When characters differ:
```plain text
dp[i][j] = 0
```
### Longest palindromic subsequence
When boundaries match:
```plain text
dp[left][right]
= 2 + dp[left + 1][right - 1]
```
When they differ:
```plain text
dp[left][right]
= max(
    dp[left + 1][right],
    dp[left][right - 1]
)
```
#### Central distinction
```plain text
Subsequence mismatch
→ Skip something and preserve earlier answers

Substring mismatch
→ Current contiguous match becomes zero
```
---
## 7. Memoization Template
### Two-sequence memoization
```java
int lcs(
        String first,
        String second,
        int i,
        int j,
        int[][] memo
) {
    if (i == first.length()
            || j == second.length()) {
        return 0;
    }

    if (memo[i][j] != -1) {
        return memo[i][j];
    }

    if (first.charAt(i)
            == second.charAt(j)) {
        memo[i][j] =
            1 + lcs(
                first,
                second,
                i + 1,
                j + 1,
                memo
            );
    } else {
        memo[i][j] = Math.max(
            lcs(
                first,
                second,
                i + 1,
                j,
                memo
            ),
            lcs(
                first,
                second,
                i,
                j + 1,
                memo
            )
        );
    }

    return memo[i][j];
}
```
Initialization:
```java
int[][] memo =
    new int[first.length()][second.length()];

for (int[] row : memo) {
    Arrays.fill(row, -1);
}
```
### Palindrome interval memoization
```java
int longestPalindrome(
        String text,
        int left,
        int right,
        int[][] memo
) {
    if (left > right) {
        return 0;
    }

    if (left == right) {
        return 1;
    }

    if (memo[left][right] != -1) {
        return memo[left][right];
    }

    if (text.charAt(left)
            == text.charAt(right)) {
        memo[left][right] =
            2 + longestPalindrome(
                text,
                left + 1,
                right - 1,
                memo
            );
    } else {
        memo[left][right] = Math.max(
            longestPalindrome(
                text,
                left + 1,
                right,
                memo
            ),
            longestPalindrome(
                text,
                left,
                right - 1,
                memo
            )
        );
    }

    return memo[left][right];
}
```
---
## 8. Tabulation Template
### Two-sequence tabulation
```java
int[][] buildLcsTable(
        String first,
        String second
) {
    int firstLength = first.length();
    int secondLength = second.length();

    int[][] dp =
        new int[firstLength + 1][secondLength + 1];

    for (int i = 1; i <= firstLength; i++) {
        for (int j = 1; j <= secondLength; j++) {
            if (first.charAt(i - 1)
                    == second.charAt(j - 1)) {
                dp[i][j] =
                    1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.max(
                    dp[i - 1][j],
                    dp[i][j - 1]
                );
            }
        }
    }

    return dp;
}
```
### Interval tabulation
```java
int longestPalindromeSubsequence(
        String text
) {
    int n = text.length();
    int[][] dp = new int[n][n];

    for (int index = 0; index < n; index++) {
        dp[index][index] = 1;
    }

    for (int length = 2; length <= n; length++) {
        for (int left = 0;
                left + length - 1 < n;
                left++) {
            int right = left + length - 1;

            if (text.charAt(left)
                    == text.charAt(right)) {
                dp[left][right] =
                    length == 2
                        ? 2
                        : 2 + dp[left + 1][right - 1];
            } else {
                dp[left][right] = Math.max(
                    dp[left + 1][right],
                    dp[left][right - 1]
                );
            }
        }
    }

    return dp[0][n - 1];
}
```
---
## 9. Correct Iteration Order
### LIS
```plain text
dp[current] depends on earlier indices
```
Therefore:
```java
for (int current = 0; current < n; current++) {
    for (int previous = 0;
            previous < current;
            previous++) {
        // Transition.
    }
}
```
### Prefix-based two-sequence DP
```plain text
dp[i][j] depends on:
dp[i - 1][j]
dp[i][j - 1]
dp[i - 1][j - 1]
```
Therefore:
```plain text
Top to bottom
Left to right
```
### Interval DP
```plain text
dp[left][right] depends on smaller intervals
```
Process intervals by increasing length:
```java
for (int length = 1; length <= n; length++) {
    for (int left = 0;
            left + length - 1 < n;
            left++) {
        int right = left + length - 1;
    }
}
```
Alternative interval order:
```java
for (int left = n - 1; left >= 0; left--) {
    for (int right = left; right < n; right++) {
        // Smaller inner intervals are ready.
    }
}
```
#### Core rule
> Every prefix, predecessor, or inner interval used by a state must already be calculated.
---
## 10. Space Optimization
### LIS
The `O(n²)` DP uses:
```plain text
O(n) space
```
For length only, binary-search LIS uses:
```plain text
O(n log n) time
O(n) space
```
It generally cannot be reduced to `O(1)` because several earlier endings may affect future states.
### Two-sequence DP
Each row depends only on:
```plain text
Previous row
Current row
```
```java
int lcs(String first, String second) {
    if (second.length() > first.length()) {
        return lcs(second, first);
    }

    int[] previous =
        new int[second.length() + 1];

    for (int i = 1; i <= first.length(); i++) {
        int[] current =
            new int[second.length() + 1];

        for (int j = 1;
                j <= second.length();
                j++) {
            if (first.charAt(i - 1)
                    == second.charAt(j - 1)) {
                current[j] =
                    1 + previous[j - 1];
            } else {
                current[j] = Math.max(
                    previous[j],
                    current[j - 1]
                );
            }
        }

        previous = current;
    }

    return previous[second.length()];
}
```
Space:
```plain text
O(min(m, n))
```
### When not to optimize
Keep the full table when:
- You need to print the LCS.
- You need to reconstruct a supersequence.
- You need to trace selected decisions.
- The table is used by a later calculation.
---
## 11. Common Problem Forms
### Common Form 1: Longest Increasing Subsequence
Select the longest strictly increasing subsequence from one array.
#### How it works
1. Let every element be the ending of a subsequence.
2. Examine every earlier element.
3. Extend compatible subsequences.
4. Store the best length ending at the current index.
5. Return the maximum ending length.
**Memory flow:** `Try earlier endings → Extend compatible sequence`
```java
int lengthOfLIS(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];

    Arrays.fill(dp, 1);

    int answer = 0;

    for (int current = 0; current < n; current++) {
        for (int previous = 0;
                previous < current;
                previous++) {
            if (nums[previous] < nums[current]) {
                dp[current] = Math.max(
                    dp[current],
                    1 + dp[previous]
                );
            }
        }

        answer = Math.max(answer, dp[current]);
    }

    return answer;
}
```
Practice:
- LC 300 — Longest Increasing Subsequence
- LC 673 — Number of LIS
- Maximum Sum Increasing Subsequence
- Longest Bitonic Subsequence
---
### Common Form 2: Reconstruct or Count LIS
Track additional information with the LIS length.
#### How it works
For reconstruction:
```plain text
parent[i] = predecessor selected before i
```
For counting:
```plain text
length[i] = best length ending at i
count[i]  = number of best sequences ending at i
```
**Memory flow:** `Improve length → Replace metadata; tie → combine counts`
```java
int findNumberOfLIS(int[] nums) {
    int n = nums.length;

    int[] length = new int[n];
    int[] count = new int[n];

    Arrays.fill(length, 1);
    Arrays.fill(count, 1);

    int longest = 1;

    for (int current = 0; current < n; current++) {
        for (int previous = 0;
                previous < current;
                previous++) {
            if (nums[previous] < nums[current]) {
                if (length[previous] + 1
                        > length[current]) {
                    length[current] =
                        length[previous] + 1;

                    count[current] =
                        count[previous];
                } else if (length[previous] + 1
                        == length[current]) {
                    count[current] +=
                        count[previous];
                }
            }
        }

        longest = Math.max(
            longest,
            length[current]
        );
    }

    int answer = 0;

    for (int index = 0; index < n; index++) {
        if (length[index] == longest) {
            answer += count[index];
        }
    }

    return answer;
}
```
Practice:
- LC 673 — Number of Longest Increasing Subsequences
- Print Longest Increasing Subsequence
---
### Common Form 3: Custom Predecessor Chains
Replace the increasing comparison with another compatibility rule.
Examples:
```plain text
Divisibility
String predecessor
Pair compatibility
Object nesting
```
#### How it works
1. Order states so valid predecessors are processed first.
2. Define the compatibility relationship.
3. Try extending every compatible predecessor.
4. Track parents when the actual chain is required.
**Memory flow:** `Order candidates → Apply custom compatibility → Extend chain`
Largest Divisible Subset:
```java
List<Integer> largestDivisibleSubset(
        int[] nums
) {
    Arrays.sort(nums);

    int n = nums.length;
    int[] dp = new int[n];
    int[] parent = new int[n];

    Arrays.fill(dp, 1);

    int bestEnding = 0;

    for (int current = 0; current < n; current++) {
        parent[current] = current;

        for (int previous = 0;
                previous < current;
                previous++) {
            if (nums[current] % nums[previous] == 0
                    && dp[previous] + 1
                        > dp[current]) {
                dp[current] =
                    dp[previous] + 1;

                parent[current] = previous;
            }
        }

        if (dp[current] > dp[bestEnding]) {
            bestEnding = current;
        }
    }

    List<Integer> answer = new ArrayList<>();

    while (parent[bestEnding] != bestEnding) {
        answer.add(nums[bestEnding]);
        bestEnding = parent[bestEnding];
    }

    answer.add(nums[bestEnding]);
    Collections.reverse(answer);

    return answer;
}
```
Practice:
- LC 368 — Largest Divisible Subset
- LC 1048 — Longest String Chain
- LC 354 — Russian Doll Envelopes
- LC 646 — Maximum Length of Pair Chain
---
### Common Form 4: Longest Common Subsequence
Find the longest subsequence appearing in both sequences.
#### How it works
1. Compare the current characters.
2. If they match, use both and move both indices.
3. If they differ, skip from either sequence.
4. Keep the longer result.
**Memory flow:** `Match both → Otherwise try skipping from either side`
```java
int longestCommonSubsequence(
        String first,
        String second
) {
    int[][] dp =
        buildLcsTable(first, second);

    return dp[first.length()][second.length()];
}
```
Practice:
- LC 1143 — Longest Common Subsequence
- LC 1035 — Uncrossed Lines
- LC 583 — Delete Operation for Two Strings
---
### Common Form 5: Print Longest Common Subsequence
Use the completed LCS table to reconstruct one valid LCS.
#### How it works
1. Start at `dp[m][n]`.
2. If the characters match, add that character and move diagonally.
3. Otherwise, move toward the neighboring cell with the larger LCS value.
4. Reverse the collected characters.
**Memory flow:** `Trace optimal table decisions backward → Reverse result`
```java
String printLcs(
        String first,
        String second
) {
    int[][] dp =
        buildLcsTable(first, second);

    int i = first.length();
    int j = second.length();

    StringBuilder answer =
        new StringBuilder();

    while (i > 0 && j > 0) {
        if (first.charAt(i - 1)
                == second.charAt(j - 1)) {
            answer.append(
                first.charAt(i - 1)
            );

            i--;
            j--;
        } else if (dp[i - 1][j]
                >= dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    return answer.reverse().toString();
}
```
Practice:
- Print Longest Common Subsequence
- LC 1092 — Shortest Common Supersequence
---
### Common Form 6: Longest Common Substring
Find the longest contiguous segment appearing in both strings.
#### How it works
1. Let `dp[i][j]` represent the common suffix ending at both current characters.
2. If characters match, extend the diagonal suffix.
3. If they differ, reset the state to zero.
4. Track the largest value anywhere in the table.
**Memory flow:** `Matching characters extend contiguous suffix → Mismatch resets it`
```java
int longestCommonSubstring(
        String first,
        String second
) {
    int m = first.length();
    int n = second.length();

    int[][] dp = new int[m + 1][n + 1];
    int answer = 0;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (first.charAt(i - 1)
                    == second.charAt(j - 1)) {
                dp[i][j] =
                    1 + dp[i - 1][j - 1];

                answer = Math.max(
                    answer,
                    dp[i][j]
                );
            } else {
                dp[i][j] = 0;
            }
        }
    }

    return answer;
}
```
Practice:
- Longest Common Substring
- LC 718 — Maximum Length of Repeated Subarray
---
### Common Form 7: Shortest Common Supersequence
A supersequence contains both input strings as subsequences.
Shortest length:
```plain text
m + n - LCS length
```
Why?
The common characters should be included only once.
#### How it works
1. Build the LCS table.
2. Trace backward through both strings.
3. When characters match, add one copy.
4. Otherwise, add the character from the direction selected by the LCS table.
5. Append any remaining characters.
6. Reverse the result.
**Memory flow:** `Merge both strings around their common subsequence`
```java
String shortestCommonSupersequence(
        String first,
        String second
) {
    int[][] dp =
        buildLcsTable(first, second);

    int i = first.length();
    int j = second.length();

    StringBuilder answer =
        new StringBuilder();

    while (i > 0 && j > 0) {
        if (first.charAt(i - 1)
                == second.charAt(j - 1)) {
            answer.append(
                first.charAt(i - 1)
            );

            i--;
            j--;
        } else if (dp[i - 1][j]
                >= dp[i][j - 1]) {
            answer.append(
                first.charAt(i - 1)
            );

            i--;
        } else {
            answer.append(
                second.charAt(j - 1)
            );

            j--;
        }
    }

    while (i > 0) {
        answer.append(first.charAt(i - 1));
        i--;
    }

    while (j > 0) {
        answer.append(second.charAt(j - 1));
        j--;
    }

    return answer.reverse().toString();
}
```
Practice:
- LC 1092 — Shortest Common Supersequence
- Print Shortest Common Supersequence
---
### Common Form 8: Insertions and Deletions Between Strings
Use LCS as the part already shared by both strings.
To convert `first` into `second`:
```plain text
Deletions
= first.length - LCS

Insertions
= second.length - LCS
```
#### How it works
1. Find the LCS length.
2. Delete characters from the first string that are outside the LCS.
3. Insert characters from the second string that are outside the LCS.
4. Add the two operation counts when total operations are required.
**Memory flow:** `Preserve common core → Delete extras → Insert missing characters`
```java
int minimumInsertionsAndDeletions(
        String first,
        String second
) {
    int common =
        longestCommonSubsequence(
            first,
            second
        );

    int deletions =
        first.length() - common;

    int insertions =
        second.length() - common;

    return deletions + insertions;
}
```
Practice:
- LC 583 — Delete Operation for Two Strings
- Minimum Insertions and Deletions to Convert Strings
---
### Common Form 9: Edit Distance
Allowed operations:
```plain text
Insert
Delete
Replace
```
State:
```plain text
dp[i][j]
= minimum operations to convert
  first i characters into first j characters
```
#### How it works
1. If characters match, move diagonally without an operation.
2. Otherwise, try insertion, deletion, and replacement.
3. Add one for the current operation.
4. Keep the minimum.
**Memory flow:** `Match for free → Otherwise try three editing operations`
```java
int minDistance(
        String first,
        String second
) {
    int m = first.length();
    int n = second.length();

    int[][] dp = new int[m + 1][n + 1];

    for (int i = 0; i <= m; i++) {
        dp[i][0] = i;
    }

    for (int j = 0; j <= n; j++) {
        dp[0][j] = j;
    }

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (first.charAt(i - 1)
                    == second.charAt(j - 1)) {
                dp[i][j] =
                    dp[i - 1][j - 1];
            } else {
                int delete =
                    dp[i - 1][j];

                int insert =
                    dp[i][j - 1];

                int replace =
                    dp[i - 1][j - 1];

                dp[i][j] =
                    1 + Math.min(
                        replace,
                        Math.min(delete, insert)
                    );
            }
        }
    }

    return dp[m][n];
}
```
Practice:
- LC 72 — Edit Distance
- One Edit Distance
- String Transformation Problems
---
### Common Form 10: Count Distinct Subsequences
Count how many subsequences of a source equal a target.
State:
```plain text
dp[i][j]
= number of ways the first i source characters
  can form the first j target characters
```
#### How it works
If the current characters match:
```plain text
Use source character
+
Skip source character
```
If they differ:
```plain text
Skip source character
```
**Memory flow:** `Matching source character can be used or ignored`
```java
int numDistinct(
        String source,
        String target
) {
    int m = source.length();
    int n = target.length();

    long[][] dp = new long[m + 1][n + 1];

    for (int i = 0; i <= m; i++) {
        dp[i][0] = 1;
    }

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            dp[i][j] =
                dp[i - 1][j];

            if (source.charAt(i - 1)
                    == target.charAt(j - 1)) {
                dp[i][j] +=
                    dp[i - 1][j - 1];
            }
        }
    }

    return (int) dp[m][n];
}
```
Practice:
- LC 115 — Distinct Subsequences
- Count Subsequences Equal to Target
---
### Common Form 11: Interleaving Two Sequences
Determine whether a third string can be formed by interleaving two strings while preserving the order of each.
#### How it works
1. Let `i` and `j` be the consumed lengths of the first two strings.
2. The third-string index is `i + j`.
3. Try consuming from the first string if its next character matches.
4. Try consuming from the second string if its next character matches.
5. The state is valid if either transition works.
**Memory flow:** `Next character may come from first or second sequence`
```java
boolean isInterleave(
        String first,
        String second,
        String target
) {
    if (first.length() + second.length()
            != target.length()) {
        return false;
    }

    int m = first.length();
    int n = second.length();

    boolean[][] dp =
        new boolean[m + 1][n + 1];

    dp[0][0] = true;

    for (int i = 0; i <= m; i++) {
        for (int j = 0; j <= n; j++) {
            if (i > 0
                    && first.charAt(i - 1)
                        == target.charAt(i + j - 1)) {
                dp[i][j] |=
                    dp[i - 1][j];
            }

            if (j > 0
                    && second.charAt(j - 1)
                        == target.charAt(i + j - 1)) {
                dp[i][j] |=
                    dp[i][j - 1];
            }
        }
    }

    return dp[m][n];
}
```
Practice:
- LC 97 — Interleaving String
---
### Common Form 12: Longest Palindromic Subsequence
Find the longest subsequence that is also a palindrome.
Two approaches are available:
```plain text
Interval DP
or
LCS(text, reverse(text))
```
#### How it works
1. Compare the left and right characters.
2. If they match, include both and solve the inner interval.
3. Otherwise, skip either boundary.
4. Keep the longer result.
**Memory flow:** `Match symmetric boundaries → Otherwise remove one boundary`
```java
int longestPalindromeSubseq(String text) {
    String reversed =
        new StringBuilder(text)
            .reverse()
            .toString();

    return longestCommonSubsequence(
        text,
        reversed
    );
}
```
Practice:
- LC 516 — Longest Palindromic Subsequence
- LC 1312 — Minimum Insertion Steps to Make a String Palindrome
---
### Common Form 13: Longest Palindromic Substring
Unlike a subsequence, the selected palindrome must be contiguous.
State:
```plain text
palindrome[left][right]
= whether text[left...right] is a palindrome
```
#### How it works
A substring is a palindrome when:
```plain text
Boundary characters match
and
The inner substring is a palindrome
```
Length-one and length-two intervals require direct handling.
**Memory flow:** `Validate inner interval → Extend using equal boundaries`
```java
String longestPalindrome(String text) {
    int n = text.length();

    boolean[][] palindrome =
        new boolean[n][n];

    int bestStart = 0;
    int bestLength = 1;

    for (int right = 0; right < n; right++) {
        for (int left = 0;
                left <= right;
                left++) {
            if (text.charAt(left)
                    == text.charAt(right)
                    && (right - left <= 2
                        || palindrome[
                            left + 1
                        ][
                            right - 1
                        ])) {
                palindrome[left][right] = true;

                int length = right - left + 1;

                if (length > bestLength) {
                    bestLength = length;
                    bestStart = left;
                }
            }
        }
    }

    return text.substring(
        bestStart,
        bestStart + bestLength
    );
}
```
Practice:
- LC 5 — Longest Palindromic Substring
- LC 647 — Palindromic Substrings
---
### Common Form 14: Count Palindromic Substrings
Count every palindromic interval.
Different positions count as different substrings even if their text is equal.
#### How it works
1. Determine whether every interval is palindromic.
2. When an interval is valid, increase the count.
3. Equal boundaries extend an already-valid inner interval.
4. Single characters always count.
**Memory flow:** `Validate each interval → Count every valid palindrome`
```java
int countSubstrings(String text) {
    int n = text.length();

    boolean[][] palindrome =
        new boolean[n][n];

    int count = 0;

    for (int right = 0; right < n; right++) {
        for (int left = 0;
                left <= right;
                left++) {
            if (text.charAt(left)
                    == text.charAt(right)
                    && (right - left <= 2
                        || palindrome[
                            left + 1
                        ][
                            right - 1
                        ])) {
                palindrome[left][right] = true;
                count++;
            }
        }
    }

    return count;
}
```
Practice:
- LC 647 — Palindromic Substrings
- Count Palindromic Substrings
---
### Common Form 15: Minimum Insertions or Deletions for a Palindrome
The longest palindromic subsequence is the part that can remain unchanged.
Therefore:
```plain text
Minimum insertions
= string length - LPS length
```
The same formula gives the minimum deletions needed to produce a palindrome.
#### How it works
1. Find the Longest Palindromic Subsequence.
2. Preserve those characters.
3. Insert or delete every character outside that subsequence.
4. Subtract the LPS length from the total length.
**Memory flow:** `Preserve longest palindromic core → Modify remaining characters`
```java
int minInsertions(String text) {
    int longestPalindrome =
        longestPalindromeSubseq(text);

    return text.length()
        - longestPalindrome;
}
```
Practice:
- LC 1312 — Minimum Insertion Steps to Make a String Palindrome
- Minimum Deletions to Make a String Palindrome
---
### Common Form 16: Palindrome Partitioning Cost
Divide a string into palindromic pieces while minimizing cuts or changes.
This combines:
```plain text
Palindrome preprocessing
+
Partition DP
```
#### How it works
1. Precompute which substrings are palindromes or how many changes each substring needs.
2. Define `dp[end]` as the minimum partition cost for a prefix.
3. Try every possible beginning of the final partition.
4. Combine the current partition cost with the best earlier prefix.
**Memory flow:** `Precompute valid intervals → Try each final cut → Minimize total cost`
Minimum cuts:
```java
int minCut(String text) {
    int n = text.length();

    boolean[][] palindrome =
        new boolean[n][n];

    for (int right = 0; right < n; right++) {
        for (int left = 0;
                left <= right;
                left++) {
            palindrome[left][right] =
                text.charAt(left)
                    == text.charAt(right)
                && (right - left <= 2
                    || palindrome[
                        left + 1
                    ][
                        right - 1
                    ]);
        }
    }

    int[] cuts = new int[n];

    for (int end = 0; end < n; end++) {
        cuts[end] = end;

        for (int start = 0;
                start <= end;
                start++) {
            if (palindrome[start][end]) {
                cuts[end] =
                    start == 0
                        ? 0
                        : Math.min(
                            cuts[end],
                            1 + cuts[start - 1]
                        );
            }
        }
    }

    return cuts[n - 1];
}
```
Practice:
- LC 132 — Palindrome Partitioning II
- LC 1278 — Palindrome Partitioning III
---
## 12. Answer Reconstruction
### Reconstruct LCS
Start from:
```plain text
dp[m][n]
```
Then:
```plain text
Characters match
→ Include character
→ Move diagonally

Characters differ
→ Move toward the larger neighboring value
```
### Reconstruct SCS
Trace the LCS table, but include unmatched characters rather than discarding them.
### Reconstruct LIS
Store:
```plain text
parent[current] = selected predecessor
```
Then follow parent pointers from the best ending index.
### Reconstruct edit operations
From `dp[m][n]`:
```plain text
Same characters → move diagonally

dp[i][j] came from dp[i - 1][j]
→ delete

dp[i][j] came from dp[i][j - 1]
→ insert

dp[i][j] came from dp[i - 1][j - 1]
→ replace
```
#### Reconstruction rule
> Start at the final DP state and repeatedly determine which transition produced its value.
Full DP storage is usually required for reconstruction.
---
## 13. Quick Interview Checklist
1. Is the input one sequence or two?
2. Is the result a subsequence or substring?
3. Must selected elements be contiguous?
4. Must relative order be preserved?
5. What relationship makes one element a valid predecessor?
6. Is the comparison strict or non-strict?
7. What does `solve(i, j)` return?
8. What does `dp[i][j]` represent?
9. Are indices prefix lengths or actual positions?
10. What happens when characters match?
11. What choices exist when characters differ?
12. Does a mismatch reset the answer or allow skipping?
13. Is the problem maximizing length, minimizing operations, counting, or checking feasibility?
14. What are the empty-sequence base cases?
15. Does interval DP depend on a smaller inner interval?
16. Should intervals be processed by increasing length?
17. Is LPS reducible to LCS with the reversed string?
18. Do I need only the result length or the actual sequence?
19. Can the DP table be reduced to two rows?
20. Would space optimization prevent reconstruction?
21. Can sorting destroy required original order?
22. Could the answer count require `long`?
23. Is this actually partition DP with palindrome preprocessing?
---
## 14. Common Mistakes
- Confusing subsequences with substrings.
- Resetting an LCS mismatch to zero.
- Failing to reset a longest-common-substring mismatch to zero.
- Rearranging elements when only skipping is allowed.
- Sorting the input for ordinary LCS or LIS.
- Treating equal values as increasing in a strictly increasing problem.
- Forgetting that `dp[i][j]` often represents prefix lengths.
- Accessing character `i` instead of `i - 1` in prefix DP.
- Returning only `dp[n - 1]` for ending-at-index LIS.
- Initializing LIS states to zero instead of one.
- Using a boolean memo without representing the uncomputed state.
- Forgetting empty-string base rows and columns.
- Incorrectly calculating Edit Distance insertion and deletion transitions.
- Returning zero when the source is exhausted before the Distinct Subsequences target.
- Counting a source character only when matching instead of also allowing it to be skipped.
- Forgetting the total-length check for Interleaving String.
- Treating Longest Palindromic Subsequence as contiguous.
- Treating Longest Palindromic Substring as an LCS result.
- Reading an inner palindrome interval before it has been calculated.
- Space-optimizing when the sequence must be reconstructed.
- Assuming the basic LIS `tails` array is an actual LIS.
- Using `int` when sequence counts may overflow.
---
## 15. Complexity Analysis
Let:
```plain text
n = length of one sequence
m = length of the other sequence
```
### LIS recursion
```plain text
Time:  O(2ⁿ)
Stack: O(n)
```
### LIS memoization
```plain text
States: O(n²)
Time:   O(n²)
Space:  O(n²)
```
### LIS ending-at-index tabulation
```plain text
Time:  O(n²)
Space: O(n)
```
### Binary-search LIS
```plain text
Time:  O(n log n)
Space: O(n)
```
### Two-sequence recursion
A loose upper bound is exponential:
```plain text
O(2^(n + m))
```
### Two-sequence memoization or tabulation
```plain text
States: O(nm)
Time:   O(nm)
Space:  O(nm)
```
Space-optimized:
```plain text
Space: O(min(n, m))
```
### Palindrome interval DP
Possible intervals:
```plain text
O(n²)
```
If each interval performs constant work:
```plain text
Time:  O(n²)
Space: O(n²)
```
### Palindrome partitioning
Palindrome preprocessing:
```plain text
O(n²)
```
Partition transitions:
```plain text
O(n²)
```
Total:
```plain text
Time:  O(n²)
Space: O(n²)
```
---
## 16. Practice Progression
### Single-sequence foundation
1. LC 300 — Longest Increasing Subsequence
2. Print Longest Increasing Subsequence
3. LC 673 — Number of LIS
4. LC 368 — Largest Divisible Subset
5. LC 1048 — Longest String Chain
6. LC 354 — Russian Doll Envelopes
### Two-sequence foundation
1. LC 1143 — Longest Common Subsequence
2. Print Longest Common Subsequence
3. LC 1035 — Uncrossed Lines
4. Longest Common Substring
5. LC 718 — Maximum Length of Repeated Subarray
### Sequence construction and transformation
1. LC 1092 — Shortest Common Supersequence
2. LC 583 — Delete Operation for Two Strings
3. LC 72 — Edit Distance
4. LC 115 — Distinct Subsequences
5. LC 97 — Interleaving String
### Palindrome foundation
1. LC 516 — Longest Palindromic Subsequence
2. LC 5 — Longest Palindromic Substring
3. LC 647 — Palindromic Substrings
4. LC 1312 — Minimum Insertion Steps to Make a String Palindrome
### Advanced palindrome forms
1. LC 132 — Palindrome Partitioning II
2. LC 1278 — Palindrome Partitioning III
---
## 17. Final Reusable Mental Model
```plain text
One sequence with compatibility
→ Let each element extend valid predecessors

Two sequences with matching
→ Match both or skip from one side

Common substring
→ Extend diagonal match or reset to zero

Palindrome subsequence
→ Match boundaries or skip one boundary

Palindrome substring
→ Equal boundaries plus valid inner interval

Transformation problem
→ Define the operation that produced each neighboring state
```
The most important sequence-DP question is:
> “Am I allowed to skip elements, must they remain contiguous, and what should happen when the current elements do not match?”
