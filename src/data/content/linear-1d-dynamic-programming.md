## 1. Introduction to the Pattern
Linear 1D DP is used when a problem progresses through a one-dimensional sequence:
```plain text
Array
String
Numbered positions
Days
Steps
```
The answer at one position depends on answers calculated for earlier or later positions.

Typical states:
```plain text
dp[i] = answer for the prefix ending at position i
```
or:
```plain text
dp[i] = answer for the suffix starting at position i
```
Common objectives include:
- Count the number of ways
- Find the minimum cost
- Find the maximum value
- Determine whether a valid solution exists
- Select elements under adjacency restrictions

Examples:
```plain text
Ways to reach stair i
Minimum cost to reach day i
Maximum money from houses 0 through i
Ways to decode the first i characters
```
#### Core mental model
> Solve the sequence one position at a time and reuse answers calculated for nearby positions.

---
## 2. How to Identify It
Look for these signals:
- The input is an array, string, or sequence of positions.
- Decisions move in one direction.
- The problem asks for a count, minimum, maximum, or feasibility.
- The current answer depends on a small number of nearby states.
- One index describes most or all of the changing state.
- Brute-force recursion repeatedly reaches the same index.
- Choices resemble:
	- Take or skip
	- Move one or two steps
	- Use one character or two characters
	- Pay now or move forward
	- Select the current element or preserve the previous answer
Common wording:
```plain text
number of ways
minimum cost
maximum amount
cannot select adjacent elements
reach the final position
decode the sequence
best answer up to index i
```
#### Recognition question
> Can the answer at position `i` be calculated using answers from earlier or later positions?

If yes, consider Linear 1D DP.
---
## 3. State Definition and Recursive Function Contract
Before writing recursion or a DP array, define exactly what one state means.

Complete this sentence:
> `solve(i)` returns .

Examples:
```plain text
solve(i)
= number of ways to reach the destination starting from i

solve(i)
= minimum cost required to reach the destination from i

solve(i)
= maximum value obtainable from positions i through n - 1

solve(i)
= number of ways to decode the suffix starting at i
```
The equivalent tabulation state may use a prefix:
```plain text
dp[i] = answer for the first i positions
```
or a suffix:
```plain text
dp[i]
= answer starting from position i
```
### Prefix state
```plain text
dp[i] = answer using positions 0 through i
```
Usually calculated:
```plain text
left to right
```
### Suffix state
```plain text
dp[i] = answer using positions i through n - 1
```
Usually calculated:
```plain text
right to left
```
#### State-validation question
> If two recursive calls have the same index, are they solving exactly the same remaining problem?

If yes, one index is sufficient.
If the answer also depends on another condition, such as whether something is currently held or how many operations remain, additional state is required.
---
## 4. Brute-Force Recursive Decision
First express every valid choice recursively.
Do not start with a DP array.
Example: House Robber.
At house `i`, there are two choices:
```plain text
Take house i
→ Earn nums[i]
→ Skip adjacent house i + 1
→ Continue from i + 2

Skip house i
→ Continue from i + 1
```
```java
int solve(int[] nums, int index) {
    if (index >= nums.length) {
        return 0;
    }

    int take =
        nums[index]
        + solve(nums, index + 2);

    int skip =
        solve(nums, index + 1);

    return Math.max(take, skip);
}
```
Recursive contract:
> `solve(index)` returns the maximum amount obtainable from houses `index` through the end.

Decision tree:
```plain text
               solve(0)
              /        \
         take 0        skip 0
          /               \
     solve(2)            solve(1)
     /     \             /      \
solve(4) solve(3)   solve(3)  solve(2)
```
States such as `solve(2)` and `solve(3)` repeat.
That repeated work creates the need for DP.
---
## 5. Base Cases
Base cases represent the smallest states that can be answered directly.
The correct value depends on how the parent combines the result.
### Maximum-value problem
No elements remain:
```java
if (index >= nums.length) {
    return 0;
}
```
There is no additional value to collect.
### Counting problem
Successfully complete the sequence:
```java
if (remaining == 0) {
    return 1;
}
```
Move beyond a valid sequence:
```java
if (remaining < 0) {
    return 0;
}
```
Here:
```plain text
1 → one completed way
0 → no valid way
```
### Minimum-cost problem
Destination reached:
```java
if (index >= destination) {
    return 0;
}
```
Invalid state:
```java
return infinity;
```
Returning `0` for an impossible minimum-cost state would incorrectly make that path appear optimal.
### Boolean problem
```plain text
Valid completion → true
Invalid state    → false
```
#### Neutral-value rule
```plain text
Counting choices     → valid completion returns 1
Adding contributions → no contribution returns 0
Taking minimum       → impossible state returns infinity
Taking maximum       → impossible state may return negative infinity
Checking existence   → invalid state returns false
```
---
## 6. Recurrence Relation
The recurrence is derived from the recursive choices.
It is not a formula to memorize separately.
### General form
```plain text
dp[state]
= combine(
    result of choice 1,
    result of choice 2,
    ...
)
```
The combination depends on the question:
```plain text
Count all valid possibilities → sum
Find cheapest possibility     → minimum
Find most valuable possibility → maximum
Check whether one works       → logical OR
Require every option to work  → logical AND
```
### Count ways
If position `i` can be reached from `i - 1` and `i - 2`:
```plain text
dp[i] = dp[i - 1] + dp[i - 2]
```
### Minimum cost
```plain text
dp[i] = cost[i] + min(
    dp[i - 1],
    dp[i - 2]
)
```
### Maximum non-adjacent value
```plain text
dp[i] = max(
    dp[i - 1],
    nums[i] + dp[i - 2]
)
```
Interpretation:
```plain text
dp[i - 1]
→ Skip current element

nums[i] + dp[i - 2]
→ Take current element
→ Combine it with the last non-adjacent state
```
#### Recurrence derivation method
For every state:
1. List every legal choice.
2. Write the next state produced by each choice.
3. Add the current choice’s contribution.
4. Combine the choice results according to the objective.
---
## 7. Memoization Template
Memoization stores the answer returned by each recursive state.
```java
int solve(
        int[] nums,
        int index,
        int[] memo
) {
    if (index >= nums.length) {
        return 0;
    }

    if (memo[index] != -1) {
        return memo[index];
    }

    int take =
        nums[index]
        + solve(nums, index + 2, memo);

    int skip =
        solve(nums, index + 1, memo);

    memo[index] = Math.max(take, skip);

    return memo[index];
}
```
Invocation:
```java
int[] memo = new int[nums.length];
Arrays.fill(memo, -1);

return solve(nums, 0, memo);
```
#### Memoization flow
```plain text
Call solve(i)
→ Check base case
→ Return cached answer if present
→ Calculate every choice
→ Combine choices
→ Store memo[i]
→ Return memo[i]
```
#### Important ordering
Check an out-of-range base case before accessing the memo:
```java
if (index >= nums.length) {
    return 0;
}

if (memo[index] != -1) {
    return memo[index];
}
```
#### Choosing an uncomputed marker
Using `-1` is safe only if `-1` cannot be a valid answer.

Alternatives include:
```java
Integer[] memo;
```
where:
```plain text
null → uncomputed
```
or a separate:
```java
boolean[] computed;
```
---
## 8. Tabulation Template
Tabulation calculates the same recurrence iteratively.

House Robber prefix definition:
> `dp[i]` is the maximum money obtainable from houses `0` through `i`.

```java
int rob(int[] nums) {
    int n = nums.length;

    if (n == 1) {
        return nums[0];
    }

    int[] dp = new int[n];

    dp[0] = nums[0];

    dp[1] = Math.max(
        nums[0],
        nums[1]
    );

    for (int index = 2; index < n; index++) {
        int take =
            nums[index] + dp[index - 2];

        int skip =
            dp[index - 1];

        dp[index] = Math.max(take, skip);
    }

    return dp[n - 1];
}
```
### Memoization-to-tabulation conversion
```plain text
Recursive parameter
→ DP index

Recursive contract
→ DP state definition

Recursive base cases
→ Initial DP values

Recursive calls
→ Previously calculated DP states

Recursive return expression
→ DP recurrence

Initial recursive call
→ Final DP cell returned
```
#### Important requirement
The meaning of the recursive state and tabulation state can differ.

For example:
```plain text
Memoization:
solve(i) = answer from i through the end

Tabulation:
dp[i] = answer from 0 through i
```
That is valid, but the base cases and recurrence must match the selected definition.
---
## 9. Correct Iteration Order
The state dependencies determine the iteration direction.
### Depends on earlier states
If:
```plain text
dp[i] depends on dp[i - 1] and dp[i - 2]
```
iterate:
```plain text
left to right
```
```java
for (int i = 2; i < n; i++) {
    // Calculate dp[i].
}
```
### Depends on later states
If:
```plain text
dp[i] depends on dp[i + 1] and dp[i + 2]
```
iterate:
```plain text
right to left
```
```java
for (int i = n - 1; i >= 0; i--) {
    // Calculate dp[i].
}
```
#### Dependency rule
> Before calculating `dp[i]`, every state used by its recurrence must already be available.

Do not choose iteration order based only on habit.

Draw the dependency:
```plain text
dp[i - 2] ─┐
            ├→ dp[i]
dp[i - 1] ─┘
```
The arrows show that smaller indices must be calculated first.
---
## 10. Space Optimization
If every state depends on only a fixed number of previous states, the entire array is unnecessary.

House Robber uses:
```plain text
dp[i - 1]
dp[i - 2]
```
Store only those values:
```java
int rob(int[] nums) {
    int previousTwo = 0;
    int previousOne = 0;

    for (int value : nums) {
        int take =
            value + previousTwo;

        int skip =
            previousOne;

        int current =
            Math.max(take, skip);

        previousTwo = previousOne;
        previousOne = current;
    }

    return previousOne;
}
```
### Variable meanings
Before processing the current element:
```plain text
previousOne
= answer through the previous position

previousTwo
= answer through two positions earlier
```
After calculating the current state:
```java
previousTwo = previousOne;
previousOne = current;
```
#### Update-order warning
Incorrect variable movement can overwrite a dependency before it is used.
Calculate `current` first, then shift previous values.
### When not to space-optimize
Keep the complete DP array when:
- You need to reconstruct the selected decisions.
- A later state needs many earlier states.
- Intermediate answers are required.
- The array makes the solution meaningfully clearer.
- You have not yet validated the basic recurrence.

Correctness comes before space optimization.
---
## 11. Common Problem Forms
### Common Form 1: Count Ways to Reach a Position
The current position can be reached from a fixed set of previous positions.

Example:
```plain text
Reach stair i from:
i - 1
i - 2
```
#### How it works
1. Define `dp[i]` as the number of ways to reach position `i`.
2. Identify every position that can move directly to `i`.
3. Add the number of ways of reaching those positions.
4. Initialize the starting position with one empty way.

**Memory flow:** `Collect all valid previous ways → Sum them`
```java
int climbStairs(int n) {
    if (n <= 1) {
        return 1;
    }

    int previousTwo = 1;
    int previousOne = 1;

    for (int stair = 2; stair <= n; stair++) {
        int current =
            previousOne + previousTwo;

        previousTwo = previousOne;
        previousOne = current;
    }

    return previousOne;
}
```
Practice:
- LC 70 — Climbing Stairs
- LC 509 — Fibonacci Number
- LC 1137 — N-th Tribonacci Number
- LC 377 — Combination Sum IV
---
### Common Form 2: Minimum Cost to Reach the End
Each position has a cost, and several previous positions may lead to it.
#### How it works
1. Define the minimum cost required to reach each position.
2. Identify every valid previous position.
3. Choose the cheapest previous state.
4. Add the cost required for the current transition or position.
5. Return the destination state.

**Memory flow:** `Choose cheapest predecessor → Add current cost`
```java
int minCostClimbingStairs(int[] cost) {
    int previousTwo = 0;
    int previousOne = 0;

    for (int stair = 2;
            stair <= cost.length;
            stair++) {
        int fromOneStep =
            previousOne + cost[stair - 1];

        int fromTwoSteps =
            previousTwo + cost[stair - 2];

        int current = Math.min(
            fromOneStep,
            fromTwoSteps
        );

        previousTwo = previousOne;
        previousOne = current;
    }

    return previousOne;
}
```
Practice:
- LC 746 — Min Cost Climbing Stairs
- LC 983 — Minimum Cost For Tickets
- LC 2369 — Check if There Is a Valid Partition
---
### Common Form 3: Take or Skip with Adjacency Restrictions
Selecting the current item prevents selecting an adjacent or nearby item.

Typical recurrence:
```plain text
take = value[i] + dp[i - 2]
skip = dp[i - 1]

dp[i] = max(take, skip)
```
#### How it works
1. Calculate the result from skipping the current item.
2. Calculate the result from selecting it.
3. If selected, combine it with the most recent compatible state.
4. Keep the better result.

**Memory flow:** `Take with compatible state → Compare with skipping`
```java
int take =
    nums[index] + previousTwo;

int skip =
    previousOne;

int current =
    Math.max(take, skip);
```
Practice:
- LC 198 — House Robber
- LC 740 — Delete and Earn
- LC 2140 — Solving Questions With Brainpower
- Maximum Sum of Non-Adjacent Elements
---
### Common Form 4: Circular Linear DP
The first and last positions are adjacent.
They cannot both be selected.

Break the circular problem into two linear ranges:
```plain text
Case 1:
Use positions 0 through n - 2

Case 2:
Use positions 1 through n - 1
```
#### How it works
1. Exclude the final element and solve the remaining line.
2. Exclude the first element and solve the remaining line.
3. Return the better result.
4. Handle a single-element input separately.

**Memory flow:** `Break circular conflict → Solve two lines → Choose better answer`
```java
int rob(int[] nums) {
    if (nums.length == 1) {
        return nums[0];
    }

    int excludeLast =
        robRange(nums, 0, nums.length - 2);

    int excludeFirst =
        robRange(nums, 1, nums.length - 1);

    return Math.max(
        excludeLast,
        excludeFirst
    );
}
```
Practice:
- LC 213 — House Robber II
- Circular Maximum Non-Adjacent Sum
---
### Common Form 5: Decode or Parse a Prefix
One or more characters may form the final valid token of a prefix.

For Decode Ways:
```plain text
Use one digit
Use two digits
```
#### How it works
1. Define `dp[length]` as the number of ways to decode the first `length` characters.
2. If the last one-character token is valid, add `dp[length - 1]`.
3. If the last two-character token is valid, add `dp[length - 2]`.
4. Invalid token choices contribute nothing.

**Memory flow:** `Check valid ending lengths → Add ways before each ending`
```java
int numDecodings(String s) {
    int n = s.length();

    int[] dp = new int[n + 1];

    dp[0] = 1;
    dp[1] =
        s.charAt(0) == '0' ? 0 : 1;

    for (int length = 2;
            length <= n;
            length++) {
        char last =
            s.charAt(length - 1);

        if (last != '0') {
            dp[length] += dp[length - 1];
        }

        int twoDigit =
            (s.charAt(length - 2) - '0') * 10
            + (s.charAt(length - 1) - '0');

        if (twoDigit >= 10
                && twoDigit <= 26) {
            dp[length] += dp[length - 2];
        }
    }

    return dp[n];
}
```
Practice:
- LC 91 — Decode Ways
- LC 639 — Decode Ways II
- LC 1416 — Restore The Array
---
### Common Form 6: Variable-Length Jumps
The current state can transition to several possible future positions.
The dependency is not limited to `i - 1` and `i - 2`.
#### How it works
1. Define what solving or reaching position `i` means.
2. Examine every position that can transition to it.
3. Evaluate the candidate answer from each transition.
4. Combine those candidates.
5. Store the current answer.

**Memory flow:** `Try valid transitions → Combine candidate states`

Generic template:
```java
for (int current = 0;
        current < n;
        current++) {
    for (int previous = 0;
            previous < current;
            previous++) {
        if (canTransition(previous, current)) {
            dp[current] = combine(
                dp[current],
                dp[previous] + contribution
            );
        }
    }
}
```
Practice:
- LC 139 — Word Break
- LC 2140 — Solving Questions With Brainpower
- LC 983 — Minimum Cost For Tickets
- LC 2369 — Check if There Is a Valid Partition

Some jump problems also have greedy solutions, so always check whether DP is necessary.
---
### Common Form 7: Transform Values into Linear Positions
Sometimes the input order is not the important structure.
Instead, values themselves form neighboring positions.

For Delete and Earn:
```plain text
points[value]
= value × frequency[value]
```
Selecting value `x` prevents selecting:
```plain text
x - 1
x + 1
```
This becomes House Robber over the value axis.
#### How it works
1. Aggregate the total contribution of each value.
2. Treat every possible value as a linear position.
3. Recognize that adjacent values conflict.
4. Apply maximum non-adjacent-sum DP.

**Memory flow:** `Aggregate values → Convert value conflicts into adjacency → Apply take/skip`
```java
int[] points = new int[maxValue + 1];

for (int value : nums) {
    points[value] += value;
}
```
Then solve:
```plain text
Take points[value]
or
Skip points[value]
```
Practice:
- LC 740 — Delete and Earn
- Weighted Non-Adjacent Selection
---
### Common Form 8: Maintain Multiple Results per Position
Sometimes one scalar answer does not preserve enough information for future transitions.

Maximum Product Subarray requires both:
```plain text
maximum product ending here
minimum product ending here
```
A negative value can turn the previous minimum into the new maximum.
#### How it works
1. Identify every extreme value future states may need.
2. Carry both maximum and minimum results.
3. Update both using the current value.
4. Maintain the best global answer.

**Memory flow:** `Preserve multiple extremes → Current value may swap their roles`
```java
int maxProduct(int[] nums) {
    int currentMaximum = nums[0];
    int currentMinimum = nums[0];
    int answer = nums[0];

    for (int index = 1;
            index < nums.length;
            index++) {
        int value = nums[index];

        if (value < 0) {
            int temporary = currentMaximum;
            currentMaximum = currentMinimum;
            currentMinimum = temporary;
        }

        currentMaximum = Math.max(
            value,
            currentMaximum * value
        );

        currentMinimum = Math.min(
            value,
            currentMinimum * value
        );

        answer = Math.max(
            answer,
            currentMaximum
        );
    }

    return answer;
}
```
Practice:
- LC 152 — Maximum Product Subarray
- LC 918 — Maximum Sum Circular Subarray
- LC 1014 — Best Sightseeing Pair
---
## 12. Answer Reconstruction
Space-optimized DP usually preserves only the optimal value.
If the problem asks which elements were selected, keep the complete DP array or a separate choice array.

For House Robber:
```plain text
If dp[i] == dp[i - 1]
→ position i can be skipped

Otherwise
→ position i was selected
→ continue from i - 2
```
```java
List<Integer> selectedIndices =
    new ArrayList<>();

int index = nums.length - 1;

while (index >= 0) {
    if (index == 0) {
        if (dp[0] > 0) {
            selectedIndices.add(0);
        }

        break;
    }

    if (dp[index] == dp[index - 1]) {
        index--;
    } else {
        selectedIndices.add(index);
        index -= 2;
    }
}

Collections.reverse(selectedIndices);
```
#### Reconstruction principle
> Compare the current DP value against the transitions that could have produced it.

If several choices produce the same optimal value, multiple valid reconstructions may exist.
---
## 13. Quick Interview Checklist
1. What does `solve(i)` return?
2. What does `dp[i]` represent?
3. Is the state based on a prefix or suffix?
4. What decisions are available at position `i`?
5. Which next state follows each decision?
6. Are the same indices solved repeatedly?
7. What are the smallest directly solvable states?
8. What should an invalid state return?
9. Am I counting, minimizing, maximizing, or checking feasibility?
10. How do I combine the recursive choices?
11. Does `dp[i]` depend on earlier or later states?
12. What iteration order satisfies those dependencies?
13. Does selecting an element block adjacent positions?
14. Is the input circular?
15. Can the circular conflict be split into two linear ranges?
16. Does one scalar value contain enough information?
17. Can I reduce the DP array to rolling variables?
18. Do I need the complete array for reconstruction?
19. Could the result overflow `int`?
20. Does a simpler greedy solution exist?
---
## 14. Common Mistakes
- Creating a DP array before defining the recursive choices.
- Writing `dp[i]` without defining its meaning.
- Omitting the recursive function contract.
- Mixing prefix and suffix state definitions.
- Guessing the recurrence instead of deriving it from choices.
- Using base cases that do not match the state definition.
- Returning `0` for an impossible minimum-cost state.
- Accessing `dp[i - 2]` without handling the first positions.
- Accessing memo before checking an out-of-range base case.
- Using `-1` as uncomputed when `-1` is a valid result.
- Filling tabulation states before their dependencies.
- Updating rolling variables in the wrong order.
- Space-optimizing before confirming the recurrence.
- Removing the DP array when reconstruction is required.
- Forgetting that the first and last positions conflict in a circular problem.
- Treating `"0"` as a valid one-digit decoding.
- Accepting two-digit decodings outside `10` through `26`.
- Storing only a maximum when later transitions also need a minimum.
- Using DP when a simpler greedy invariant solves the problem.
- Ignoring recursive call-stack space in memoization.
---
## 15. Complexity Analysis
Use:
```plain text
Total time
= number of unique states
× work performed per state
```
### Brute-force recursion
If each state creates two branches:
```plain text
Time:  O(2ⁿ)
Stack: O(n)
```
### Memoization
One index produces `O(n)` unique states.

If each state performs constant work:
```plain text
Time:  O(n)
Memo:  O(n)
Stack: O(n)
```
Total auxiliary space:
```plain text
O(n)
```
### Tabulation
```plain text
Time:  O(n)
Space: O(n)
```
### Space-optimized tabulation
When only a fixed number of nearby states is required:
```plain text
Time:  O(n)
Space: O(1)
```
### Variable-length transitions
If every state scans all earlier positions:
```plain text
Number of states: O(n)
Work per state:   O(n)

Time:  O(n²)
Space: O(n)
```
---
## 16. Practice Progression
### Foundation
1. LC 509 — Fibonacci Number
2. LC 70 — Climbing Stairs
3. LC 1137 — N-th Tribonacci Number
### Minimum-cost transitions
1. LC 746 — Min Cost Climbing Stairs
2. LC 983 — Minimum Cost For Tickets
### Take or skip
1. LC 198 — House Robber
2. LC 213 — House Robber II
3. LC 740 — Delete and Earn
4. LC 2140 — Solving Questions With Brainpower
### Parsing and counting
1. LC 91 — Decode Ways
2. LC 639 — Decode Ways II
3. LC 1416 — Restore The Array
### Multiple values per state
1. LC 152 — Maximum Product Subarray
2. LC 918 — Maximum Sum Circular Subarray
3. LC 1014 — Best Sightseeing Pair
### Transition variations
1. LC 139 — Word Break
2. LC 2369 — Check if There Is a Valid Partition
3. LC 377 — Combination Sum IV
---
## 17. Final Reusable Mental Model
```plain text
Define what solve(i) returns
→ List every decision at i
→ Write the base cases
→ Combine recursive answers
→ Identify repeated i states
→ Store them in memo[i]
→ Convert the recurrence into dp[i]
→ Fill states in dependency order
→ Keep only necessary previous states
```
For every Linear 1D DP problem, ask:
> “What exactly does the answer at position `i` mean, and which solved positions can produce it?”
