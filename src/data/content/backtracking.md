Backtracking is a recursive technique for exploring multiple possible decisions.
At every step:
```plain text
Choose one option
→ Explore what happens
→ Undo the choice
→ Try another option
```
It is commonly used to generate:
- Subsets
- Combinations
- Permutations
- Valid paths
- String partitions
- Constraint-based arrangements
---
## Core Mental Model
> Backtracking builds one candidate answer at a time and abandons it when it cannot lead to a valid result.
```plain text
Make a choice
→ Update current state
→ Recursively explore
→ Restore previous state
```
The restoration step is what makes it backtracking.
```java
current.add(choice);

backtrack(...);

current.remove(current.size() - 1);
```
---
## Recursion versus Backtracking
Ordinary recursion solves smaller versions of a problem.
Backtracking additionally manages mutable decision state:
```plain text
Recursion:
Solve smaller problem

Backtracking:
Choose → Explore → Undo → Try another choice
```
Every backtracking solution uses recursion, but not every recursive solution uses backtracking.
---
## Decision Tree Mental Model
For:
```plain text
nums = [1, 2]
```
Each element can be included or excluded:
```plain text
             []
        /          \
     take 1        skip 1
      [1]             []
     /   \           /   \
take 2  skip 2  take 2  skip 2
 [1,2]    [1]      [2]      []
```
Each root-to-leaf route represents one sequence of decisions.
Backtracking performs DFS over this implicit decision tree.
> You normally do not build this tree explicitly. Recursive calls represent its branches.
---
## Anatomy of Backtracking
Most backtracking solutions contain:
1. Current state
2. Available choices
3. Base case
4. Choose operation
5. Recursive exploration
6. Undo operation
```java
void backtrack(State state) {
    if (isComplete(state)) {
        saveAnswer(state);
        return;
    }

    for (Choice choice : choices(state)) {
        if (!isValid(choice, state)) {
            continue;
        }

        makeChoice(state, choice);
        backtrack(state);
        undoChoice(state, choice);
    }
}
```
Memory flow:
```plain text
Check completion
→ Try each choice
→ Validate
→ Choose
→ Explore
→ Undo
```
---
## How to Identify Backtracking Problems
Look for these signals:
- Return all possible solutions.
- Generate every valid arrangement.
- Find every subset, combination, or permutation.
- Construct a sequence under some conditions.
- Search every possible path in a grid.
- Divide a string or array in all valid ways.
- Choose some candidates while respecting constraints.
- The answer requires trying a decision and later reversing it.
- The input constraints are relatively small.
- The problem naturally forms a decision tree.
Common question wording:
```plain text
Return all...
Generate all...
Find every...
List all possible...
Can you construct...
Count all possible...
```
### Most important recognition question
> Do I need to explore several choices from the current state and then return to try the remaining choices?
If yes, backtracking is likely appropriate.
---
## The Backtracking State
Before coding, identify what changes along one recursive path.
Common state components:
```plain text
Current index
Current path
Remaining target
Used elements
Visited cells
Selected values
Current sum
Current position
```
Also define the recursive contract:
> `backtrack(state)` explores all valid answers that can be created from the current state.
---
## Common Forms
## Common Form 1: Include or Exclude
Each item has two decisions:
```plain text
Include the item
Exclude the item
```
This is the natural pattern for subsets and subsequences.
### How it works
1. At index `i`, include the current element.
2. Recursively process the next index.
3. Remove the current element.
4. Recursively process the next index without it.
5. Save the path when every index has been considered.
**Memory flow:** `Take → Explore → Undo → Skip → Explore`
```java
void subsets(
        int[] nums,
        int index,
        List<Integer> current,
        List<List<Integer>> answer
) {
    if (index == nums.length) {
        answer.add(new ArrayList<>(current));
        return;
    }

    // Include nums[index].
    current.add(nums[index]);

    subsets(
        nums,
        index + 1,
        current,
        answer
    );

    // Undo the inclusion.
    current.remove(current.size() - 1);

    // Exclude nums[index].
    subsets(
        nums,
        index + 1,
        current,
        answer
    );
}
```
### Decision-tree size
For `n` elements, each element has two choices:
```plain text
2 × 2 × 2 ... n times = 2ⁿ subsets
```
Practice:
- LC 78 — Subsets
- LC 90 — Subsets II
- LC 494 — Target Sum
- LC 491 — Non-decreasing Subsequences
---
## Common Form 2: For-Loop Selection
Instead of explicitly writing take and skip calls, use a loop to select the next candidate.
This pattern is common when order does not matter and choices after the current selection should begin from a later index.
### How it works
1. Save the current selection if it represents a valid answer.
2. Loop through the remaining candidates.
3. Choose one candidate.
4. Recurse from the next allowed index.
5. Undo the choice.
6. Continue the loop to try another candidate.
**Memory flow:** `Choose next candidate from remaining range → Explore → Undo`
```java
void combinations(
        int[] nums,
        int start,
        List<Integer> current,
        List<List<Integer>> answer
) {
    answer.add(new ArrayList<>(current));

    for (int i = start; i < nums.length; i++) {
        current.add(nums[i]);

        combinations(
            nums,
            i + 1,
            current,
            answer
        );

        current.remove(current.size() - 1);
    }
}
```
### Meaning of `start`
`start` ensures that previously considered elements are not selected again.
For:
```plain text
[1, 2, 3]
```
After selecting `2`, future choices start after `2`.
This prevents generating different orders of the same combination:
```plain text
[1, 2]
[2, 1]
```
Practice:
- LC 77 — Combinations
- LC 78 — Subsets
- LC 216 — Combination Sum III
- LC 131 — Palindrome Partitioning
---
## Common Form 3: Permutations
In permutation problems, order matters.
```plain text
[1, 2] and [2, 1]
```
are different answers.
Every recursive level chooses one unused element for the next position.
### How it works
1. Loop through every element.
2. Skip elements already used in the current permutation.
3. Mark one element as used.
4. Add it to the current permutation.
5. Recursively fill the next position.
6. Remove it and mark it unused.
**Memory flow:** `Choose unused element → Fill next position → Restore availability`
```java
void permutations(
        int[] nums,
        boolean[] used,
        List<Integer> current,
        List<List<Integer>> answer
) {
    if (current.size() == nums.length) {
        answer.add(new ArrayList<>(current));
        return;
    }

    for (int i = 0; i < nums.length; i++) {
        if (used[i]) {
            continue;
        }

        used[i] = true;
        current.add(nums[i]);

        permutations(nums, used, current, answer);

        current.remove(current.size() - 1);
        used[i] = false;
    }
}
```
### Why does the loop begin from `0`?
Every unused element can occupy the current position.
In combination problems, the loop usually begins at `start` because order does not matter.
```plain text
Combination → select from remaining suffix
Permutation → select any unused element
```
Practice:
- LC 46 — Permutations
- LC 47 — Permutations II
- LC 60 — Permutation Sequence
- LC 784 — Letter Case Permutation
---
## Common Form 4: Reusable Choices
Some problems allow the same candidate to be chosen multiple times.
Example:
```plain text
Candidates = [2, 3, 6, 7]
Target = 7

Possible answer = [2, 2, 3]
```
After selecting `2`, recursion may start again from the same index.
### How it works
1. Track the remaining target.
2. Loop through candidates beginning at `start`.
3. Choose a candidate only if it does not exceed the remaining target.
4. Recurse using the same index when reuse is allowed.
5. Undo the choice.
6. Try the next candidate.
**Memory flow:** `Choose candidate → Reduce target → Reuse or advance → Undo`
```java
void combinationSum(
        int[] candidates,
        int start,
        int remaining,
        List<Integer> current,
        List<List<Integer>> answer
) {
    if (remaining == 0) {
        answer.add(new ArrayList<>(current));
        return;
    }

    for (int i = start; i < candidates.length; i++) {
        if (candidates[i] > remaining) {
            continue;
        }

        current.add(candidates[i]);

        combinationSum(
            candidates,
            i,
            remaining - candidates[i],
            current,
            answer
        );

        current.remove(current.size() - 1);
    }
}
```
### Index decision
```plain text
Pass i     → current candidate can be reused
Pass i + 1 → current candidate can be used only once
```
Practice:
- LC 39 — Combination Sum
- LC 40 — Combination Sum II
- LC 216 — Combination Sum III
- LC 377 — Combination Sum IV
---
## Common Form 5: Handling Duplicate Answers
When the input contains duplicate values, different indices may generate identical answers.
Example:
```plain text
nums = [1, 2, 2]
```
Without duplicate handling, `[1, 2]` may be generated twice.
### How it works
1. Sort the candidates.
2. At one recursive level, use only the first occurrence of an equal value.
3. Skip later equal values at that same level.
4. Allow equal values at deeper levels when the problem permits them.
**Memory flow:** `Sort → Skip equal sibling choices → Allow valid deeper choices`
```java
Arrays.sort(nums);
```
```java
for (int i = start; i < nums.length; i++) {
    if (i > start && nums[i] == nums[i - 1]) {
        continue;
    }

    current.add(nums[i]);

    backtrack(
        nums,
        i + 1,
        current,
        answer
    );

    current.remove(current.size() - 1);
}
```
### Why `i > start`?
It skips duplicates only among choices at the same decision level.
```plain text
i > start
```
does not prevent using two equal values from different levels when allowed.
### Incorrect duplicate check
```java
if (i > 0 && nums[i] == nums[i - 1]) {
    continue;
}
```
This may skip equal values across every level and remove valid answers.
Practice:
- LC 40 — Combination Sum II
- LC 47 — Permutations II
- LC 90 — Subsets II
- LC 491 — Non-decreasing Subsequences
---
## Common Form 6: String Partitioning
Partitioning problems choose the next substring rather than the next individual element.
Example:
```plain text
"aab"
```
Possible palindrome partition:
```plain text
["a", "a", "b"]
["aa", "b"]
```
### How it works
1. Start at the first unprocessed character.
2. Try every possible ending position.
3. Extract the substring between `start` and `end`.
4. Continue only if that substring is valid.
5. Add it to the current partition.
6. Recurse from `end + 1`.
7. Remove the substring and try a different cut.
**Memory flow:** `Choose next cut → Validate piece → Explore suffix → Undo cut`
```java
void partition(
        String s,
        int start,
        List<String> current,
        List<List<String>> answer
) {
    if (start == s.length()) {
        answer.add(new ArrayList<>(current));
        return;
    }

    for (int end = start; end < s.length(); end++) {
        if (!isPalindrome(s, start, end)) {
            continue;
        }

        current.add(s.substring(start, end + 1));

        partition(
            s,
            end + 1,
            current,
            answer
        );

        current.remove(current.size() - 1);
    }
}
```
### Meaning of the recursive state
> `partition(start)` explores every valid partition of the suffix beginning at `start`.
Practice:
- LC 131 — Palindrome Partitioning
- LC 93 — Restore IP Addresses
- LC 140 — Word Break II
- LC 1849 — Splitting a String Into Descending Consecutive Values
---
## Common Form 7: Grid Backtracking
Grid backtracking explores possible paths through neighboring cells.
Common directions:
```plain text
up
down
left
right
```
A cell may usually be used only once in the current path.
### How it works
1. Reject invalid positions.
2. Reject cells that do not match the requirement.
3. Mark the current cell as visited.
4. Explore every permitted neighbor.
5. Restore the cell before returning.
6. Return whether a valid path was found.
**Memory flow:** `Validate cell → Mark → Explore neighbors → Unmark`
```java
boolean search(
        char[][] board,
        String word,
        int row,
        int col,
        int index
) {
    if (index == word.length()) {
        return true;
    }

    if (row < 0 || row >= board.length
            || col < 0 || col >= board[0].length
            || board[row][col] != word.charAt(index)) {
        return false;
    }

    char original = board[row][col];
    board[row][col] = '#';

    boolean found =
        search(board, word, row + 1, col, index + 1)
        || search(board, word, row - 1, col, index + 1)
        || search(board, word, row, col + 1, index + 1)
        || search(board, word, row, col - 1, index + 1);

    board[row][col] = original;

    return found;
}
```
### Why restore the cell?
The cell is unavailable only for the current path. Another path starting elsewhere may validly use it.
Practice:
- LC 79 — Word Search
- LC 212 — Word Search II
- LC 1219 — Path with Maximum Gold
- LC 980 — Unique Paths III
- LC 489 — Robot Room Cleaner
---
## Common Form 8: Constraint Placement
These problems place items while ensuring that no constraints are violated.
Examples:
- Place queens on a board
- Fill a Sudoku board
- Assign colors to graph nodes
- Construct a valid arrangement
### How it works
1. Select the next position that must be filled.
2. Try every possible choice for that position.
3. Skip choices violating existing constraints.
4. Place a valid choice.
5. Recursively fill the next position.
6. If it fails, remove the placement.
7. Continue trying other choices.
**Memory flow:** `Select position → Test choices → Place → Explore → Remove`
### N-Queens structure
```java
void placeQueens(
        int row,
        char[][] board,
        Set<Integer> columns,
        Set<Integer> diagonals,
        Set<Integer> antiDiagonals,
        List<List<String>> answer
) {
    if (row == board.length) {
        saveBoard(board, answer);
        return;
    }

    for (int col = 0; col < board.length; col++) {
        int diagonal = row - col;
        int antiDiagonal = row + col;

        if (columns.contains(col)
                || diagonals.contains(diagonal)
                || antiDiagonals.contains(antiDiagonal)) {
            continue;
        }

        board[row][col] = 'Q';
        columns.add(col);
        diagonals.add(diagonal);
        antiDiagonals.add(antiDiagonal);

        placeQueens(
            row + 1,
            board,
            columns,
            diagonals,
            antiDiagonals,
            answer
        );

        board[row][col] = '.';
        columns.remove(col);
        diagonals.remove(diagonal);
        antiDiagonals.remove(antiDiagonal);
    }
}
```
Practice:
- LC 51 — N-Queens
- LC 52 — N-Queens II
- LC 37 — Sudoku Solver
- LC 698 — Partition to K Equal Sum Subsets
- M-Coloring Problem
---
## Common Form 9: Backtracking with Pruning
Pruning stops exploring a branch when it is already impossible or cannot improve the answer.
Without pruning:
```plain text
Explore every branch
```
With pruning:
```plain text
Reject useless branches early
```
### How it works
1. Check whether the current branch can still become valid.
2. If not, return immediately.
3. If optimizing an answer, estimate the best result this branch could achieve.
4. Stop if it cannot beat the current best.
5. Otherwise, continue exploring choices.
**Memory flow:** `Check possibility → Abandon impossible branch → Explore useful branches`
Common pruning conditions:
```java
if (remaining < 0) {
    return;
}
```
```java
if (current.size() > limit) {
    return;
}
```
```java
if (remainingCandidates < requiredChoices) {
    return;
}
```
### Sorted-input pruning
When positive candidates are sorted:
```java
if (candidates[i] > remaining) {
    break;
}
```
Why `break` instead of `continue`?
Every later candidate is at least as large, so none can fit.
### Combination-size pruning
If `need` more elements must be selected:
```java
for (int i = start;
        i <= nums.length - need;
        i++) {
    // Choose nums[i].
}
```
This avoids starting branches without enough remaining elements.
Practice:
- LC 39 — Combination Sum
- LC 51 — N-Queens
- LC 37 — Sudoku Solver
- LC 698 — Partition to K Equal Sum Subsets
- LC 473 — Matchsticks to Square
---
## Choosing the Correct Form
```plain text
Each item is included or excluded
→ Include/exclude recursion

Choose elements without order
→ For-loop selection with start index

Arrange every element in different orders
→ Permutation with used state

Same value can be selected repeatedly
→ Recurse using the same index

Input contains duplicate values
→ Sort and skip duplicate sibling choices

Choose substrings or cut positions
→ String partitioning

Explore paths through cells
→ Grid backtracking

Place values under restrictions
→ Constraint placement

Many branches become impossible early
→ Add pruning
```
---
## Understanding the Start Index
The `start` parameter controls which candidates are available next.
## Pass `i + 1`
The current element cannot be selected again:
```java
backtrack(i + 1);
```
Used for:
- Subsets
- Combinations
- Combination Sum II
## Pass `i`
The current element may be reused:
```java
backtrack(i);
```
Used for:
- Combination Sum
## Start loop from `0`
Any unused element may be selected:
```java
for (int i = 0; i < nums.length; i++)
```
Used for:
- Permutations
This is one of the most important backtracking decisions.
---
## When to Save an Answer
## Save at every recursive state
Every partial selection is valid:
```java
answer.add(new ArrayList<>(current));
```
Used for generating subsets with a loop.
## Save only at a completed state
The answer must have a required length:
```java
if (current.size() == k) {
    answer.add(new ArrayList<>(current));
    return;
}
```
## Save when a target is reached
```java
if (remaining == 0) {
    answer.add(new ArrayList<>(current));
    return;
}
```
## Save when the input is exhausted
```java
if (index == nums.length) {
    answer.add(new ArrayList<>(current));
    return;
}
```
The base case depends on what qualifies as a complete answer.
---
## Mutable State versus Value State
Some state is passed by value:
```java
remaining - nums[i]
index + 1
```
These changes do not require manual restoration.
Some state is mutable:
```java
List<Integer> current
boolean[] used
char[][] board
Set<Integer> columns
```
Mutable state must usually be restored after recursion.
```java
makeChoice();
backtrack();
undoChoice();
```
---
## Returning Boolean versus Collecting All Answers
## Return boolean
Use when only one valid solution is needed:
```java
if (backtrack(...)) {
    return true;
}
```
Examples:
- Word Search
- Sudoku Solver
- Determine whether an arrangement exists
Short-circuit as soon as a solution is found.
## Collect answers
Use when every valid solution is required:
```java
backtrack(...);
```
Do not stop after finding the first result.
Examples:
- Subsets
- Permutations
- Combination Sum
- Palindrome Partitioning
---
## Backtracking versus Dynamic Programming
Use backtracking when you must:
```plain text
construct actual solutions
generate all possibilities
maintain a changing arrangement
undo decisions
```
Use dynamic programming when:
```plain text
the same state repeats
you need a count, minimum, maximum, or boolean result
actual decision sequences are not all required
```
Some problems combine both:
```plain text
Backtracking generates answers
Memoization avoids solving repeated states
```
---
## Quick Interview Checklist
1. What does one recursive call represent?
2. What state completely describes the current decision?
3. What qualifies as a complete answer?
4. What choices are available at this state?
5. Does order matter?
6. Can an element be reused?
7. Should recursion receive `i` or `i + 1`?
8. Do I need a `start` index or a `used` array?
9. What state changes before recursion?
10. What must be undone afterward?
11. Am I copying mutable state before saving it?
12. Are duplicate values present?
13. Should duplicate choices be skipped at the same level?
14. Can invalid branches be rejected early?
15. Can sorting enable stronger pruning?
16. Do I need all answers or only one?
17. Can I short-circuit after finding a solution?
18. Are identical recursive states repeated?
19. What is the maximum recursion depth?
20. Is the exponential complexity expected from the output size?
---
## Common Mistakes
- Forgetting to undo a choice.
- Undoing the choice before the recursive call.
- Saving the same mutable list reference.
- Using a `start` index when permutations require any unused element.
- Using a `used` array when combinations require only later elements.
- Passing `i + 1` when reuse is allowed.
- Passing `i` when reuse is forbidden.
- Using the wrong base case.
- Saving incomplete states as valid answers.
- Continuing recursion after a complete answer when it should return.
- Stopping after the first solution when all solutions are required.
- Failing to restore a modified grid cell.
- Marking grid cells globally visited instead of visited only for the current path.
- Skipping duplicate values across all recursion levels.
- Forgetting to sort before adjacent duplicate skipping.
- Using `continue` when sorted candidates permit `break`.
- Rechecking expensive constraints when sets could provide constant-time checks.
- Ignoring repeated states that may require memoization.
- Claiming polynomial time for an inherently exponential search.
---
## Complexity Analysis
Backtracking complexity depends on:
```plain text
Number of decision-tree states
× Work performed at each state
```
## Subsets
There are `2ⁿ` subsets.
Copying each answer may take `O(n)`:
```plain text
Time:  O(n × 2ⁿ)
Stack: O(n)
Output: O(n × 2ⁿ)
```
## Permutations
There are `n!` permutations.
Copying each permutation takes `O(n)`:
```plain text
Time:  O(n × n!)
Stack: O(n)
Output: O(n × n!)
```
## Combinations
Selecting `k` elements from `n`:
```plain text
Number of answers: C(n, k)
```
Approximate output cost:
```plain text
O(k × C(n, k))
```
## Grid search
If every step can explore up to four directions for a word of length `L`:
```plain text
Time: O(rows × cols × 4ᴸ)
```
A tighter estimate often uses approximately three choices after the first move because the previous cell cannot be immediately reused.
```plain text
Stack: O(L)
```
## Constraint problems
N-Queens explores permutations of column placements:
```plain text
Worst-case search: approximately O(n!)
Stack: O(n)
```
Pruning significantly reduces practical work but does not necessarily change the theoretical worst case.
---
## Final Reusable Model
```plain text
Define the current state
→ Identify available choices
→ Reject invalid choices
→ Make one choice
→ Explore recursively
→ Undo the choice
→ Try the next choice
```
The central backtracking template is:
```java
for (Choice choice : choices) {
    if (!isValid(choice)) {
        continue;
    }

    makeChoice(choice);
    backtrack();
    undoChoice(choice);
}
```
The most important interview question is:
> “After this recursive call returns, what state must I restore before trying the next choice?”
