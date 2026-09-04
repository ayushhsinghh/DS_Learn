## 1. Introduction to the Pattern

Interval DP is used when each state represents the answer for a continuous interval of the input.

Typical state:

```plain text
dp[left][right]
= answer for the interval from left to right

```

Unlike Linear DP, where a state usually represents a prefix or one position, Interval DP represents an entire range.

Examples:

```plain text
dp[2][5]
= best answer using elements from index 2 through index 5

```

Typical objectives include:

- Minimum cost to process an interval
- Maximum score obtainable from an interval
- Number of ways to evaluate an interval
- Best place to divide an interval
- Whether an interval satisfies some condition
- Optimal order for removing, cutting, or merging elements

#### Core mental model

> Solve smaller intervals first, then combine them to solve larger intervals.

The central decision is usually:

```plain text
Which position should be chosen as the first, last, or splitting operation inside this interval?

```

---

## 2. How to Identify It

Look for these signals:

- The problem operates on a continuous subarray or substring.
- An operation divides a range into smaller independent ranges.
- You must choose the best position inside a range.
- The order of cutting, removing, bursting, or merging changes the answer.
- The final operation makes the remaining subproblems independent.
- The answer for `[left, right]` depends on smaller intervals.
- Brute-force recursion repeatedly solves the same ranges.

Common wording:

```plain text
minimum cost to cut
maximum coins after bursting
optimal parenthesization
merge adjacent groups
remove elements in any order
choose a partition point
triangulate a polygon
predict the winner
minimum score for a range

```

#### Recognition questions

Ask:

> Does choosing position `k` divide the current interval into a left interval and a right interval?

Or:

> Would choosing the first or last operation make the remaining parts independent?

If yes, consider Interval DP.

#### Important distinction

The input being an array does not automatically mean Interval DP.

Use Interval DP when the state needs two boundaries:

```plain text
(left, right)

```

If one index sufficiently represents the remaining problem, Linear DP may be enough.

---

## 3. State Definition and Recursive Function Contract

Before writing a recurrence, complete this sentence:

> `solve(left, right)` returns .

Examples:

```plain text
solve(left, right)
= minimum cost required to completely process
  the interval from left through right

```

```plain text
solve(left, right)
= maximum coins obtainable by removing
  every element from left through right

```

```plain text
solve(left, right)
= minimum multiplication cost for matrices
  left through right

```

There are two common interval conventions.

### Convention A: Inclusive element interval

```plain text
[left, right]

```

Both boundaries are actual elements in the current problem.

Example:

```plain text
solve(left, right)
= answer using array[left...right]

```

The empty interval occurs when:

```plain text
left > right

```

A single-element interval occurs when:

```plain text
left == right

```

### Convention B: Boundary interval

```plain text
(left, right)

```

`left` and `right` are fixed boundaries, and the elements strictly between them still need to be processed.

Example:

```plain text
solve(left, right)
= cost of making every cut between cuts[left] and cuts[right]

```

The interval is complete when there is nothing between the boundaries:

```plain text
right - left == 1

```

This convention is especially useful for:

- Minimum Cost to Cut a Stick
- Burst Balloons
- Polygon triangulation

---

## 4. Brute-Force Recursive Decision

Consider Minimum Cost to Cut a Stick.

Suppose:

```plain text
solve(left, right)

```

represents the minimum cost required to perform every cut between:

```plain text
cuts[left] and cuts[right]

```

For every possible first cut `cut` inside the interval:

```plain text
Current cut cost
= cuts[right] - cuts[left]

```

After making that cut, two independent intervals remain:

```plain text
(left, cut)
(cut, right)

```

Therefore:

```plain text
answer =
minimum over every possible cut

```

#### Brute-force code

```java
private int solve(int[] cuts, int left, int right) {
    if (right - left == 1) {
        return 0;
    }

    int answer = Integer.MAX_VALUE;

    for (int cut = left + 1; cut < right; cut++) {
        int currentCost = cuts[right] - cuts[left];

        int leftCost = solve(cuts, left, cut);
        int rightCost = solve(cuts, cut, right);

        answer = Math.min(
            answer,
            currentCost + leftCost + rightCost
        );
    }

    return answer;
}

```

#### Why is the current interval cost added?

The current operation cuts a stick of length:

```plain text
cuts[right] - cuts[left]

```

The two recursive calls calculate only the future costs of processing the resulting pieces.

#### Why does recursion become expensive?

The same interval is solved repeatedly.

For example:

```plain text
solve(0, 3)

```

may be reached through several different cutting orders.
The number of unique states is only quadratic, but brute force explores many different decision orders.

---

## 5. Base Cases

The base case depends on how the interval is defined.

### Empty inclusive interval

```java
if (left > right) {
    return 0;
}

```

Used when `[left, right]` contains the remaining elements.

### Single element

```java
if (left == right) {
    return baseValue;
}

```

Examples:

```plain text
One matrix requires zero multiplications.
One element may already be completely processed.

```

### No decision between boundaries

For boundary-style intervals:

```java
if (right - left == 1) {
    return 0;
}

```

There is no cut, balloon, or polygon vertex between the two boundaries.

### Interval too small

Some problems require at least three elements:

```java
if (right - left < 2) {
    return 0;
}

```

For example, fewer than three vertices cannot create a triangle.

### Invalid result values

For minimization:

```java
int answer = Integer.MAX_VALUE;

```

For maximization:

```java
int answer = Integer.MIN_VALUE;

```

But never add directly to an invalid infinity value without checking for overflow.

---

## 6. Recurrence Relation

The most common Interval DP recurrence is:

```plain text
dp[left][right]
=
best over every decision k inside the interval

```

General form:

```plain text
dp[left][right]
=
min/max over k {
    dp[left][k]
    + dp[k][right]
    + cost(left, k, right)
}

```

For inclusive intervals, it may instead be:

```plain text
dp[left][right]
=
min/max over k {
    dp[left][k - 1]
    + dp[k + 1][right]
    + contribution(left, k, right)
}

```

The exact boundaries depend on whether `k`:

- Remains part of one subproblem
- Is removed completely
- Acts only as a partition
- Is chosen as the first operation
- Is chosen as the last operation

### The most important Interval DP question

> Should `k` be treated as the first operation, the last operation, or only a dividing point?

This decision determines the recurrence.

---

## 7. Memoization Template

### Inclusive-interval template

```java
private int solve(
    int[] nums,
    int left,
    int right,
    int[][] memo
) {
    if (left > right) {
        return 0;
    }

    if (memo[left][right] != -1) {
        return memo[left][right];
    }

    int answer = Integer.MAX_VALUE;

    for (int k = left; k <= right; k++) {
        int leftAnswer =
            solve(nums, left, k - 1, memo);

        int rightAnswer =
            solve(nums, k + 1, right, memo);

        int candidate =
            leftAnswer
            + rightAnswer
            + cost(nums, left, k, right);

        answer = Math.min(answer, candidate);
    }

    return memo[left][right] = answer;
}

```

### Boundary-interval template

```java
private int solve(
    int[] positions,
    int left,
    int right,
    int[][] memo
) {
    if (right - left == 1) {
        return 0;
    }

    if (memo[left][right] != -1) {
        return memo[left][right];
    }

    int answer = Integer.MAX_VALUE;

    for (int k = left + 1; k < right; k++) {
        int candidate =
            solve(positions, left, k, memo)
            + solve(positions, k, right, memo)
            + cost(positions, left, k, right);

        answer = Math.min(answer, candidate);
    }

    return memo[left][right] = answer;
}

```

#### Number of states

Possible values of:

```plain text
(left, right)

```

produce:

```plain text
O(n²) states

```

If every state tries `O(n)` partition points:

```plain text
Time: O(n³)

```

---

## 8. Tabulation Template

Interval DP is generally filled by increasing interval length.

### Inclusive-interval template

```java
int[][] dp = new int[n][n];

for (int length = 1; length <= n; length++) {
    for (int left = 0;
         left + length - 1 < n;
         left++) {

        int right = left + length - 1;

        for (int k = left; k <= right; k++) {
            // Combine smaller intervals.
        }
    }
}

```

### Split-point template

```java
int[][] dp = new int[n][n];

for (int length = 2; length <= n; length++) {
    for (int left = 0;
         left + length - 1 < n;
         left++) {

        int right = left + length - 1;

        dp[left][right] = Integer.MAX_VALUE;

        for (int k = left; k < right; k++) {
            dp[left][right] = Math.min(
                dp[left][right],
                dp[left][k]
                    + dp[k + 1][right]
                    + cost(left, k, right)
            );
        }
    }
}

```

### Boundary-gap template

```java
int[][] dp = new int[n][n];

for (int gap = 2; gap < n; gap++) {
    for (int left = 0;
         left + gap < n;
         left++) {

        int right = left + gap;

        for (int k = left + 1; k < right; k++) {
            // Use dp[left][k] and dp[k][right].
        }
    }
}

```

A gap of `1` means there is nothing between the boundaries, so its answer is already zero.

---

## 9. Correct Iteration Order

Interval DP usually depends on smaller intervals.

Therefore:

> Process shorter intervals before longer intervals.

### Length-based order

```java
for (int length = 1; length <= n; length++) {
    for (int left = 0;
         left + length - 1 < n;
         left++) {

        int right = left + length - 1;
    }
}

```

### Gap-based order

```java
for (int gap = 1; gap < n; gap++) {
    for (int left = 0; left + gap < n; left++) {
        int right = left + gap;
    }
}

```

Here:

```plain text
gap = right - left

```

### Alternative order

The following also ensures smaller intervals are ready:

```java
for (int left = n - 1; left >= 0; left--) {
    for (int right = left; right < n; right++) {
    }
}

```

This works when dependencies resemble:

```plain text
dp[left + 1][right]
dp[left][right - 1]
dp[left + 1][right - 1]

```

#### Interview rule

Write the recurrence first, then inspect its dependencies.

If the recurrence uses:

```plain text
dp[left][k]
dp[k][right]

```

the interval `(left, right)` must be processed after both smaller intervals.

---

## 10. Space Optimization

Interval DP generally requires:

```plain text
O(n²) space

```

Unlike common 1D DP problems, it is usually difficult to reduce this to `O(n)` because one state may depend on many different smaller intervals.

For example:

```plain text
dp[left][right]

```

may need:

```plain text
dp[left][k]
dp[k][right]

```

for every possible `k`.
These values belong to many rows and columns of the table.

#### When optimization may be possible

Space optimization may work if the recurrence uses only:

```plain text
dp[left + 1][right]
dp[left][right - 1]
dp[left + 1][right - 1]

```

Even then, optimization can make the solution harder to understand and may prevent answer reconstruction.

#### Interview recommendation

> First implement the clear `O(n²)` table. Optimize only when constraints require it and the dependency pattern clearly allows it.

---

## 11. Common Problem Forms

### Common Form 1: Matrix Chain Multiplication

You are given a sequence of matrices and must determine the multiplication order with minimum cost.

#### How it works

Try every matrix position as the final division between the left chain and right chain. Solve both smaller chains and add the cost of multiplying their results.
Suppose matrix `i` has dimensions:

```plain text
dimensions[i - 1] × dimensions[i]

```

#### State

```plain text
dp[left][right]
= minimum cost to multiply matrices left through right

```

#### Transition

```plain text
dp[left][right]
=
min over split k {
    dp[left][k]
    + dp[k + 1][right]
    + dimensions[left - 1]
      × dimensions[k]
      × dimensions[right]
}

```

#### Code

```java
public int matrixMultiplication(int[] dimensions) {
    int matrices = dimensions.length - 1;
    int[][] dp = new int[matrices + 1][matrices + 1];

    for (int length = 2; length <= matrices; length++) {
        for (int left = 1;
             left + length - 1 <= matrices;
             left++) {

            int right = left + length - 1;
            dp[left][right] = Integer.MAX_VALUE;

            for (int split = left;
                 split < right;
                 split++) {

                int cost =
                    dp[left][split]
                    + dp[split + 1][right]
                    + dimensions[left - 1]
                      * dimensions[split]
                      * dimensions[right];

                dp[left][right] =
                    Math.min(dp[left][right], cost);
            }
        }
    }

    return dp[1][matrices];
}

```

Practice:

- Matrix Chain Multiplication — GeeksForGeeks
- LC 1039 — Minimum Score Triangulation of Polygon

---

### Common Form 2: Choose the Last Element to Remove

This appears when removing an element changes its neighbors.

#### How it works

Choosing the first element is difficult because future neighbors are unknown. Instead, assume `k` is the last element removed from the current interval. At that moment, the interval’s external boundaries are guaranteed to be its neighbors.
This is the key idea behind Burst Balloons.

#### State

```plain text
dp[left][right]
= maximum coins obtained by bursting
  every balloon strictly between left and right

```

#### Transition

If `k` is the last balloon burst:

```plain text
dp[left][right]
=
max over k {
    dp[left][k]
    + dp[k][right]
    + nums[left] × nums[k] × nums[right]
}

```

#### Code

```java
public int maxCoins(int[] nums) {
    int n = nums.length;

    int[] balloons = new int[n + 2];
    balloons[0] = 1;
    balloons[n + 1] = 1;

    for (int i = 0; i < n; i++) {
        balloons[i + 1] = nums[i];
    }

    int[][] dp = new int[n + 2][n + 2];

    for (int gap = 2; gap < n + 2; gap++) {
        for (int left = 0;
             left + gap < n + 2;
             left++) {

            int right = left + gap;

            for (int last = left + 1;
                 last < right;
                 last++) {

                int coins =
                    dp[left][last]
                    + dp[last][right]
                    + balloons[left]
                      * balloons[last]
                      * balloons[right];

                dp[left][right] =
                    Math.max(dp[left][right], coins);
            }
        }
    }

    return dp[0][n + 1];
}

```

Practice:

- LC 312 — Burst Balloons

---

### Common Form 3: Minimum Cost to Cut an Interval

You must perform cuts, and every cut costs the length of the current piece.

#### How it works

Add the outer boundaries, sort every cut position, and try every internal cut as the first cut for the current interval. The first cut divides it into two independent pieces.

#### State

```plain text
dp[left][right]
= minimum cost to perform every cut
  between cuts[left] and cuts[right]

```

#### Transition

```plain text
dp[left][right]
=
cuts[right] - cuts[left]
+
min over cut {
    dp[left][cut] + dp[cut][right]
}

```

#### Code

```java
public int minCost(int length, int[] cuts) {
    int count = cuts.length;

    int[] positions = new int[count + 2];
    positions[0] = 0;
    positions[count + 1] = length;

    for (int i = 0; i < count; i++) {
        positions[i + 1] = cuts[i];
    }

    Arrays.sort(positions);

    int[][] dp = new int[count + 2][count + 2];

    for (int gap = 2; gap < count + 2; gap++) {
        for (int left = 0;
             left + gap < count + 2;
             left++) {

            int right = left + gap;
            dp[left][right] = Integer.MAX_VALUE;

            for (int cut = left + 1;
                 cut < right;
                 cut++) {

                int cost =
                    positions[right] - positions[left]
                    + dp[left][cut]
                    + dp[cut][right];

                dp[left][right] =
                    Math.min(dp[left][right], cost);
            }
        }
    }

    return dp[0][count + 1];
}

```

Practice:

- LC 1547 — Minimum Cost to Cut a Stick

---

### Common Form 4: Polygon Triangulation

A polygon must be divided into triangles while minimizing the total score.

#### How it works

Choose a third vertex `k` to create a triangle with the interval boundaries `left` and `right`. That triangle divides the polygon interval into two smaller polygon intervals.

#### State

```plain text
dp[left][right]
= minimum triangulation score
  for vertices left through right

```

#### Transition

```plain text
dp[left][right]
=
min over k {
    dp[left][k]
    + dp[k][right]
    + values[left] × values[k] × values[right]
}

```

#### Code

```java
public int minScoreTriangulation(int[] values) {
    int n = values.length;
    int[][] dp = new int[n][n];

    for (int gap = 2; gap < n; gap++) {
        for (int left = 0;
             left + gap < n;
             left++) {

            int right = left + gap;
            dp[left][right] = Integer.MAX_VALUE;

            for (int middle = left + 1;
                 middle < right;
                 middle++) {

                int score =
                    dp[left][middle]
                    + dp[middle][right]
                    + values[left]
                      * values[middle]
                      * values[right];

                dp[left][right] =
                    Math.min(dp[left][right], score);
            }
        }
    }

    return dp[0][n - 1];
}

```

Practice:

- LC 1039 — Minimum Score Triangulation of Polygon

---

### Common Form 5: Matching or Skipping Interval Boundaries

The answer depends on whether the two ends of an interval match.

#### How it works

Compare the boundary elements. Matching boundaries may allow both boundaries to participate in the answer. Otherwise, discard one boundary and choose the better remaining interval.

#### State

```plain text
dp[left][right]
= best palindrome answer for substring left through right

```

#### Transition for longest palindromic subsequence

```plain text
If characters match:
dp[left][right]
= 2 + dp[left + 1][right - 1]

Otherwise:
dp[left][right]
= max(
    dp[left + 1][right],
    dp[left][right - 1]
)

```

#### Code

```java
public int longestPalindromeSubseq(String text) {
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

            if (text.charAt(left) == text.charAt(right)) {
                dp[left][right] =
                    length == 2
                        ? 2
                        : 2 + dp[left + 1][right - 1];
            } else {
                dp[left][right] =
                    Math.max(
                        dp[left + 1][right],
                        dp[left][right - 1]
                    );
            }
        }
    }

    return dp[0][n - 1];
}

```

Practice:

- LC 516 — Longest Palindromic Subsequence
- LC 1312 — Minimum Insertion Steps to Make a String Palindrome
- LC 5 — Longest Palindromic Substring

---

### Common Form 6: Optimal Game Strategy

Two players take turns selecting elements, and both play optimally.

#### How it works

Define the state from the current player’s perspective. Store the maximum score advantage the current player can obtain over the opponent.
This avoids separately tracking both players’ scores.

#### State

```plain text
dp[left][right]
= maximum score difference:
  current player’s score - opponent’s score

```

#### Transition

If the current player takes the left value:

```plain text
nums[left] - dp[left + 1][right]

```

The subtraction happens because the recursive state represents the opponent’s future advantage.

If the current player takes the right value:

```plain text
nums[right] - dp[left][right - 1]

```

#### Code

```java
public boolean predictTheWinner(int[] nums) {
    int n = nums.length;
    int[][] dp = new int[n][n];

    for (int index = 0; index < n; index++) {
        dp[index][index] = nums[index];
    }

    for (int length = 2; length <= n; length++) {
        for (int left = 0;
             left + length - 1 < n;
             left++) {

            int right = left + length - 1;

            int takeLeft =
                nums[left] - dp[left + 1][right];

            int takeRight =
                nums[right] - dp[left][right - 1];

            dp[left][right] =
                Math.max(takeLeft, takeRight);
        }
    }

    return dp[0][n - 1] >= 0;
}

```

Practice:

- LC 486 — Predict the Winner
- LC 877 — Stone Game
- LC 1690 — Stone Game VII
- LC 1140 — Stone Game II

---

### Common Form 7: Expression Parenthesization

Different divisions of an expression produce different results.

#### How it works

Try every operator as the final operator evaluated. The operator divides the expression into independent left and right expressions. Combine every result from both sides.

#### State

```plain text
solve(left, right)
= every result obtainable from the expression interval

```

#### Code

```java
private Map<String, List<Integer>> memo = new HashMap<>();

public List<Integer> diffWaysToCompute(String expression) {
    if (memo.containsKey(expression)) {
        return memo.get(expression);
    }

    List<Integer> results = new ArrayList<>();

    for (int index = 0;
         index < expression.length();
         index++) {

        char operator = expression.charAt(index);

        if (operator != '+'
                && operator != '-'
                && operator != '*') {
            continue;
        }

        List<Integer> leftResults =
            diffWaysToCompute(
                expression.substring(0, index)
            );

        List<Integer> rightResults =
            diffWaysToCompute(
                expression.substring(index + 1)
            );

        for (int left : leftResults) {
            for (int right : rightResults) {
                if (operator == '+') {
                    results.add(left + right);
                } else if (operator == '-') {
                    results.add(left - right);
                } else {
                    results.add(left * right);
                }
            }
        }
    }

    if (results.isEmpty()) {
        results.add(Integer.parseInt(expression));
    }

    memo.put(expression, results);
    return results;
}

```

For more efficient memoization, parse the expression into tokens and memoize using:

```plain text
(left, right)

```

Practice:

- LC 241 — Different Ways to Add Parentheses
- Boolean Parenthesization — GeeksForGeeks

---

### Common Form 8: Merge Adjacent Intervals

Adjacent groups must be repeatedly merged, and each merge has a cost.

#### How it works

Try every valid position where the interval’s final merge can be divided. Prefix sums provide the total value of an interval in constant time.
Some problems require an additional state representing how many groups the interval should become.

#### Basic state

```plain text
dp[left][right]
= minimum cost to merge the interval into one group

```

#### Basic transition

```plain text
dp[left][right]
=
min over split {
    dp[left][split]
    + dp[split + 1][right]
}
+ intervalSum(left, right)

```

#### Code for merging without additional restrictions

```java
public int minimumMergeCost(int[] nums) {
    int n = nums.length;

    int[] prefix = new int[n + 1];

    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }

    int[][] dp = new int[n][n];

    for (int length = 2; length <= n; length++) {
        for (int left = 0;
             left + length - 1 < n;
             left++) {

            int right = left + length - 1;
            dp[left][right] = Integer.MAX_VALUE;

            int intervalSum =
                prefix[right + 1] - prefix[left];

            for (int split = left;
                 split < right;
                 split++) {

                int cost =
                    dp[left][split]
                    + dp[split + 1][right]
                    + intervalSum;

                dp[left][right] =
                    Math.min(dp[left][right], cost);
            }
        }
    }

    return dp[0][n - 1];
}

```

For LC 1000, the state must account for the number of piles:

```plain text
dp[left][right][piles]

```

Practice:

- LC 1000 — Minimum Cost to Merge Stones
- Merge Slimes — AtCoder DP Contest
- Remove Boxes — LC 546

---

### Common Form 9: Compress Equal Boundaries

Repeated equal values can sometimes be processed together.

#### How it works

Normally, process the final element separately. If an earlier matching element exists, delay processing the final element and combine it with that earlier occurrence. This may reduce the total number of operations.

#### State

```plain text
dp[left][right]
= minimum operations required for interval left through right

```

#### Strange Printer transition

Default:

```plain text
dp[left][right]
= 1 + dp[left][right - 1]

```

If:

```plain text
text[k] == text[right]

```

then the final character can share a printing operation:

```plain text
dp[left][right]
=
min(
    dp[left][right],
    dp[left][k] + dp[k + 1][right - 1]
)

```

#### Code

```java
public int strangePrinter(String text) {
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

            dp[left][right] =
                1 + dp[left][right - 1];

            for (int k = left; k < right; k++) {
                if (text.charAt(k)
                        == text.charAt(right)) {

                    int middle =
                        k + 1 <= right - 1
                            ? dp[k + 1][right - 1]
                            : 0;

                    dp[left][right] =
                        Math.min(
                            dp[left][right],
                            dp[left][k] + middle
                        );
                }
            }
        }
    }

    return dp[0][n - 1];
}

```

Practice:

- LC 664 — Strange Printer
- LC 546 — Remove Boxes

---

## 12. Answer Reconstruction

If the problem asks for the optimal decisions, store the choice that produced every state.

```java
int[][] choice = new int[n][n];

```

While calculating:

```java
if (candidate < dp[left][right]) {
    dp[left][right] = candidate;
    choice[left][right] = split;
}

```

Then recursively reconstruct the decisions:

```java
private void reconstruct(
    int left,
    int right,
    int[][] choice,
    List<Integer> decisions
) {
    if (left >= right) {
        return;
    }

    int split = choice[left][right];
    decisions.add(split);

    reconstruct(left, split, choice, decisions);
    reconstruct(split + 1, right, choice, decisions);
}

```

The precise recursive ranges depend on the recurrence.

For a boundary interval such as Minimum Cost to Cut a Stick:

```java
reconstruct(left, cut);
reconstruct(cut, right);

```

For Matrix Chain Multiplication:

```java
reconstruct(left, split);
reconstruct(split + 1, right);

```

#### Parenthesization reconstruction

```java
private String buildOrder(
    int left,
    int right,
    int[][] choice
) {
    if (left == right) {
        return "A" + left;
    }

    int split = choice[left][right];

    return "("
        + buildOrder(left, split, choice)
        + " × "
        + buildOrder(split + 1, right, choice)
        + ")";
}

```

---

## 13. Quick Interview Checklist

Before coding, ask:

1. What exactly does `dp[left][right]` represent?
2. Are the interval boundaries included or excluded?
3. What is the smallest valid interval?
4. What should an empty interval return?
5. Does the decision choose the first operation, last operation, or split point?
6. After selecting `k`, what are the exact left and right subintervals?
7. Does `k` belong to either resulting interval?
8. Does the operation add a cost or produce a reward?
9. Should the candidates be summed, minimized, maximized, or collected?
10. Can prefix sums calculate interval costs efficiently?
11. Must smaller intervals be processed first?
12. Is the answer stored in `dp[0][n - 1]`?
13. Do artificial boundaries simplify the recurrence?
14. Is an extra dimension required?
15. Could integer multiplication overflow?
16. Do I need to reconstruct the chosen partitions?

---

## 14. Common Mistakes

- Using Interval DP without defining the state precisely.
- Confusing `[left, right]` with `(left, right)`.
- Using incorrect boundaries after selecting `k`.
- Including `k` in both subproblems.
- Excluding `k` when it should remain a boundary.
- Choosing the first operation when choosing the last is simpler.
- Filling larger intervals before smaller intervals.
- Starting the interval-length loop at the wrong value.
- Forgetting artificial boundary values.
- Forgetting to sort cut positions.
- Recalculating interval sums instead of using prefix sums.
- Adding to `Integer.MAX_VALUE` and causing overflow.
- Initializing minimization states with zero.
- Returning the wrong table cell.
- Forgetting that an answer may be the best among several final intervals.
- Assuming every Interval DP problem is `O(n²)`.
- Forgetting the inner loop over partition points.
- Using substring creation as a memoization key when indices would be cheaper.
- Missing an additional state such as remaining piles.
- Attempting space optimization even though many smaller intervals are required.
- Mixing “first selected” and “last selected” interpretations in one recurrence.

---

## 15. Complexity Analysis

Let:

```plain text
n = number of elements or interval boundaries

```

### Number of interval states

There are approximately:

```plain text
n × n

```

possible `(left, right)` pairs:

```plain text
Space: O(n²)

```

### Constant transition per state

If every state uses only its boundaries:

```plain text
Time: O(n²)

```

Example:

```plain text
Longest Palindromic Subsequence

```

### Trying every split point

If every interval tries every `k`:

```plain text
States:              O(n²)
Transitions/state:   O(n)
Time:                 O(n³)
Space:                O(n²)

```

Examples:

- Matrix Chain Multiplication
- Burst Balloons
- Minimum Cost to Cut a Stick
- Polygon Triangulation

### Additional state

If the state is:

```plain text
dp[left][right][groups]

```

the number of states may become:

```plain text
O(n³)

```

The transition cost may increase it further.

### Memoization stack space

Recursive depth is commonly:

```plain text
O(n)

```

Therefore total auxiliary space may be:

```plain text
O(n²) memo + O(n) recursion stack

```

---

## 16. Practice Progression

### Interval foundations

1. LC 516 — Longest Palindromic Subsequence
2. LC 486 — Predict the Winner
3. LC 877 — Stone Game
4. Matrix Chain Multiplication

### Partition-at-every-position

1. LC 1039 — Minimum Score Triangulation of Polygon
2. LC 1547 — Minimum Cost to Cut a Stick
3. LC 312 — Burst Balloons

### Expression and merging problems

1. LC 241 — Different Ways to Add Parentheses
2. Boolean Parenthesization
3. Merge Slimes — AtCoder DP Contest
4. LC 1000 — Minimum Cost to Merge Stones

### Advanced Interval DP

1. LC 664 — Strange Printer
2. LC 546 — Remove Boxes
3. LC 1690 — Stone Game VII
4. LC 730 — Count Different Palindromic Subsequences
5. LC 375 — Guess Number Higher or Lower II

---

## 17. Final Reusable Mental Model

```plain text
1. Let dp[left][right] represent the answer for one interval.
2. Decide whether the boundaries are inclusive or external.
3. Try every meaningful decision k inside the interval.
4. Determine whether k is first, last, or only a split point.
5. Divide the interval into the exact smaller subintervals.
6. Combine their answers with the current operation’s contribution.
7. Process shorter intervals before longer intervals.
8. Store the chosen k when reconstruction is required.

```

The shortest memory rule is:

> For every interval, try every place where its optimal solution could make its final meaningful decision.

