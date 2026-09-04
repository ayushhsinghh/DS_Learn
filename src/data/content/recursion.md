Recursion is a technique where a function solves a problem by asking itself to solve a **smaller version of the same problem**.

Every recursive solution needs:
1. A clearly defined problem or state
2. A base case
3. Progress toward that base case
4. A way to use the smaller problem’s answer
## Core Mental Model
> Do one small piece of work, trust recursion to solve the smaller problem, and combine the result.

```plain text
Solve current problem
→ Reduce it to a smaller problem
→ Trust recursion
→ Combine the smaller answer
```
The biggest mental shift is:
> Do not mentally execute every recursive call while writing the solution.

Instead, define exactly what the function promises to return.
## The Recursive Function Contract
Before writing code, complete this sentence:
> `solve(state)` returns .

Examples:
```plain text
factorial(n)
returns the factorial of n

maxDepth(root)
returns the maximum depth of the tree rooted at root

reverse(head)
returns the head of the reversed list starting at head

countWays(index, target)
returns the number of ways to create target using elements
from index onward
```
Once the contract is clear, trust that the recursive call fulfills it for a smaller input.
## Anatomy of Recursion
A recursive function usually contains three parts.
### 1. Base Case
The smallest problem that can be answered directly:
```java
if (n == 0) {
    return 1;
}
```
### 2. Recursive Call
Solve a smaller version of the same problem:
```java
factorial(n - 1)
```
### 3. Combine the Result
Use the smaller answer to solve the current problem:
```java
return n * factorial(n - 1);
```
Complete example:
```java
int factorial(int n) {
    if (n == 0) {
        return 1;
    }

    return n * factorial(n - 1);
}
```
## Memory Flow
```plain text
Base case
→ Smaller input
→ Recursive answer
→ Current answer
```
## How the Call Stack Works
Consider:
```java
factorial(3)
```
Calls go downward:
```plain text
factorial(3)
needs factorial(2)

factorial(2)
needs factorial(1)

factorial(1)
needs factorial(0)

factorial(0)
returns 1
```
Then the calls return upward:
```plain text
factorial(1) = 1 × 1 = 1
factorial(2) = 2 × 1 = 2
factorial(3) = 3 × 2 = 6
```
There are two different phases:
```plain text
Going down   → recursive calls are created
Coming back  → suspended work is completed
```
Every unfinished call stays on the call stack.
## Work Before and After the Recursive Call
This is one of the most important recursion concepts.
### Work before recursion
```java
System.out.println(n);
print(n - 1);
```
For `print(3)`:
```plain text
3 2 1
```
This behaves like preorder processing.
### Work after recursion
```java
print(n - 1);
System.out.println(n);
```
For `print(3)`:
```plain text
1 2 3
```
This behaves like postorder processing.
### Work on both sides
```java
System.out.println("enter " + n);
solve(n - 1);
System.out.println("exit " + n);
```
Output:
```plain text
enter 3
enter 2
enter 1
exit 1
exit 2
exit 3
```
Mental model:
```plain text
Before recursive call → work while going down
After recursive call  → work while coming back
```
## How to Identify Recursive Problems
Look for these signals:
- The input naturally becomes smaller: `n → n - 1`, `index → index + 1`, `head → head.next`, or `root → root.left/root.right`.
- The same operation must be applied to nested structures.
- The input is a tree, linked list, nested expression, or divide-and-conquer range.
- The problem asks for all combinations, subsets, paths, or valid arrangements.
- A solution requires making a choice and exploring resulting states.
- An iterative implementation would require an explicit stack.
### Most important recognition question
> Can I express the current answer using the answer to a smaller version of the same problem?

If yes, recursion may be natural.
## The Five Questions to Ask Before Coding
For every recursive problem, answer:
1. What does my function return?
2. What parameters completely describe one state?
3. What is the smallest state I can solve directly?
4. How does every recursive call move toward that state?
5. How do I combine the recursive answers?

If any one of these is unclear, the recursion will probably be difficult to implement correctly.
## Common Form 1: Linear Recursion
Use this when each state creates only one smaller recursive call.

Examples:
- Factorial
- Sum of an array
- Reverse a linked list
- Traverse a linked list
- Process characters by index

The call structure looks like:
```plain text
solve(0)
  → solve(1)
      → solve(2)
          → solve(3)
```
### How it works
1. Solve one part of the current state.
2. Move to one smaller state.
3. Stop at the base case.
4. Use the returning value if the current state depends on it.

**Memory flow:** `Handle current → Recurse once → Return`
### Array sum
Contract:
> `sum(nums, index)` returns the sum from `index` through the end.

```java
int sum(int[] nums, int index) {
    if (index == nums.length) {
        return 0;
    }

    int smallerAnswer = sum(nums, index + 1);

    return nums[index] + smallerAnswer;
}
```
Practice:
- LC 206 — Reverse Linked List
- LC 344 — Reverse String
- LC 509 — Fibonacci Number
- LC 104 — Maximum Depth of Binary Tree
- Sum of Array Recursively
## Common Form 2: Recursion with an Accumulator
Use this when partial information can be carried forward as a parameter.
An accumulator stores the work completed so far.

Examples:
```plain text
running sum
current answer
constructed string
number of selected elements
```
### How it works
1. Carry the partial result in a parameter.
2. Update it before making the recursive call.
3. Pass it into the smaller state.
4. Return it when the base case is reached.

**Memory flow:** `Update answer so far → Pass forward → Return at base`
```java
int sum(
        int[] nums,
        int index,
        int runningSum
) {
    if (index == nums.length) {
        return runningSum;
    }

    return sum(
        nums,
        index + 1,
        runningSum + nums[index]
    );
}
```
### Return-value recursion versus accumulator
Return-value style:
```java
return nums[index] + sum(nums, index + 1);
```
Accumulator style:
```java
return sum(
    nums,
    index + 1,
    runningSum + nums[index]
);
```
Use whichever produces the clearest function contract.

Practice:
- LC 129 — Sum Root to Leaf Numbers
- LC 112 — Path Sum
- LC 257 — Binary Tree Paths
- Digit Sum and Number Reversal
## Common Form 3: Multiple Recursive Choices
Use this when every state has several possible decisions.

Examples:
```plain text
take or skip
move left or right
include or exclude
choose one candidate
```
The call structure becomes a recursion tree:
```plain text
         solve(index)
         /          \
      take          skip
       /              \
solve(index+1)    solve(index+1)
```
### How it works
1. Define the choices available at the current state.
2. Make one recursive call for each valid choice.
3. Each call solves the remaining smaller problem.
4. Combine their results using sum, maximum, minimum, OR, or AND.
5. Stop when the decision space is exhausted.

**Memory flow:** `List choices → Recurse for each → Combine answers`
### Take-or-skip template
```java
int solve(int[] nums, int index) {
    if (index == nums.length) {
        return 0;
    }

    int take =
        nums[index] + solve(nums, index + 1);

    int skip =
        solve(nums, index + 1);

    return Math.max(take, skip);
}
```
The combination depends on the question:
```plain text
Count all possibilities → add results
Find best possibility   → min or max
Check if one works      → OR
Require all to work     → AND
```
Practice:
- LC 198 — House Robber
- LC 494 — Target Sum
- LC 416 — Partition Equal Subset Sum
- LC subsequence-generation problems

This form often leads to dynamic programming when the same states repeat.
## Common Form 4: Tree Recursion
Trees are naturally recursive because each subtree is itself a smaller tree.
```plain text
Tree
→ Left subtree
→ Right subtree
```
The most important decision is what information each child should return to its parent.
### How it works
1. Define what `solve(node)` returns for the subtree rooted at `node`.
2. Return the neutral answer for `null`.
3. Recursively solve the left subtree.
4. Recursively solve the right subtree.
5. Combine those answers with the current node.

**Memory flow:** `Ask left → Ask right → Combine at current node`
### Maximum depth
Contract:
> `maxDepth(node)` returns the maximum depth of the subtree rooted at `node`.

```java
int maxDepth(TreeNode node) {
    if (node == null) {
        return 0;
    }

    int leftDepth = maxDepth(node.left);
    int rightDepth = maxDepth(node.right);

    return 1 + Math.max(leftDepth, rightDepth);
}
```
### Tree recursion mental model
Do not think:
> How do I calculate the depth of the entire tree?

Think:
> If the left and right children give me their depths, how does the current node calculate its answer?

Practice:
- LC 104 — Maximum Depth of Binary Tree
- LC 110 — Balanced Binary Tree
- LC 543 — Diameter of Binary Tree
- LC 124 — Binary Tree Maximum Path Sum
- LC 236 — Lowest Common Ancestor
- LC 112 — Path Sum
## Common Form 5: Divide and Conquer
Use this when a problem can be divided into independent smaller ranges.

The common structure is:
```plain text
Divide
→ Solve left
→ Solve right
→ Combine
```
Unlike simple multiple-choice recursion, divide-and-conquer calls usually solve distinct portions of the input.
### How it works
1. Stop when the current range is small enough to solve directly.
2. Divide the range into smaller parts.
3. Recursively solve each part.
4. Combine their results.
5. Return the combined answer.

**Memory flow:** `Divide → Solve parts → Combine`
### Merge-sort structure
```java
void mergeSort(int[] nums, int left, int right) {
    if (left >= right) {
        return;
    }

    int middle = left + (right - left) / 2;

    mergeSort(nums, left, middle);
    mergeSort(nums, middle + 1, right);

    merge(nums, left, middle, right);
}
```
### Important observation
The recursive calls do not perform the merge.

They only guarantee:
```plain text
Left half is sorted
Right half is sorted
```
The current function combines those results.

Practice:
- LC 912 — Sort an Array
- LC 108 — Convert Sorted Array to BST
- LC 23 — Merge k Sorted Lists
- LC 215 — Kth Largest Element using Quickselect
- LC 148 — Sort List
## Common Form 6: Linked-List Recursion
A linked list naturally becomes smaller through:
```java
head.next
```
The returning phase is especially useful because it processes nodes in reverse order.
### How it works
1. Define the answer for the list beginning at `head`.
2. Recursively solve the list beginning at `head.next`.
3. Use the returned smaller-list answer.
4. Reconnect the current node.
5. Return the new head or required result.

**Memory flow:** `Solve remaining list → Reconnect current while returning`
### Reverse linked list
Contract:
> `reverse(head)` returns the new head of the reversed list beginning at `head`.

```java
ListNode reverse(ListNode head) {
    if (head == null || head.next == null) {
        return head;
    }

    ListNode newHead = reverse(head.next);

    head.next.next = head;
    head.next = null;

    return newHead;
}
```
### Why set `head.next = null`?
Without it, the old forward connection remains and creates a cycle.

Practice:
- LC 206 — Reverse Linked List
- LC 24 — Swap Nodes in Pairs
- LC 25 — Reverse Nodes in k-Group
- LC 21 — Merge Two Sorted Lists
- LC 234 — Palindrome Linked List
## Common Form 7: Backtracking Recursion
Backtracking is recursion with reversible choices.

It is used to generate:
- Subsets
- Permutations
- Combinations
- Paths
- Valid arrangements

This should eventually have its own dedicated topic, but its recursive foundation belongs here.
### How it works
1. Choose one available option.
2. Add it to the current state.
3. Recursively explore that decision.
4. Undo the choice.
5. Try the next option.

**Memory flow:** `Choose → Explore → Undo`
```java
void backtrack(
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
    backtrack(nums, index + 1, current, answer);

    // Undo the choice.
    current.remove(current.size() - 1);

    // Exclude nums[index].
    backtrack(nums, index + 1, current, answer);
}
```
### Why copy `current`?
```java
answer.add(new ArrayList<>(current));
```
`current` continues changing during backtracking. Saving the same list reference would cause stored answers to change later.

Practice:
- LC 78 — Subsets
- LC 46 — Permutations
- LC 39 — Combination Sum
- LC 17 — Letter Combinations of a Phone Number
- LC 131 — Palindrome Partitioning
## Common Form 8: Recursion Using the Call Stack as Storage
Use this when explicit stack operations are restricted and recursive calls temporarily hold removed elements.

Examples:
- Sort a stack
- Reverse a stack
- Insert at the bottom
### How it works
1. Remove one element.
2. Recursively solve the smaller stack.
3. The removed element remains stored in the current call frame.
4. During unwinding, insert it into the correct position.
5. Rebuild the complete stack.

**Memory flow:** `Remove → Store in call frame → Solve smaller → Reinsert`
```java
void sort(Deque<Integer> stack) {
    if (stack.isEmpty()) {
        return;
    }

    int top = stack.pop();

    sort(stack);
    insertSorted(stack, top);
}

void insertSorted(
        Deque<Integer> stack,
        int value
) {
    if (stack.isEmpty()
            || stack.peek() <= value) {
        stack.push(value);
        return;
    }

    int top = stack.pop();

    insertSorted(stack, value);

    stack.push(top);
}
```
Practice:
- Sort a Stack Using Recursion
- Reverse a Stack Using Recursion
- Delete the Middle Element of a Stack
## How to Trace Recursion Properly
Do not trace recursion only in your head. Create a table.

For:
```java
sum([2, 4, 6], index)
```
<table fit-page-width="true" header-row="true">
<tr>
<td>Call</td>
<td>Waiting work</td>
</tr>
<tr>
<td>`sum(0)`</td>
<td>`2 + sum(1)`</td>
</tr>
<tr>
<td>`sum(1)`</td>
<td>`4 + sum(2)`</td>
</tr>
<tr>
<td>`sum(2)`</td>
<td>`6 + sum(3)`</td>
</tr>
<tr>
<td>`sum(3)`</td>
<td>returns `0`</td>
</tr>
</table>

Then unwind:
```plain text
sum(3) = 0
sum(2) = 6 + 0  = 6
sum(1) = 4 + 6  = 10
sum(0) = 2 + 10 = 12
```
Always trace both:
1. Calls going downward
2. Values returning upward
## Choosing Recursive Parameters
The parameters should describe everything that can change between recursive states.

Common parameters:
```plain text
index
remaining target
current node
left and right boundaries
current path
visited state
previous selected index
```
Ask:
> If two calls have the same parameters, are they solving the same problem?

If yes, those parameters correctly define the state.
This question also helps identify repeated states for dynamic programming.
## Choosing a Base Case
A base case should answer the smallest valid state directly.
### Index exhausted
```java
if (index == nums.length) {
    return ...;
}
```
### Empty tree
```java
if (root == null) {
    return ...;
}
```
### End of linked list
```java
if (head == null) {
    return ...;
}
```
### Target reached
```java
if (remaining == 0) {
    return ...;
}
```
### Invalid state
```java
if (remaining < 0) {
    return impossibleValue;
}
```
Do not combine valid and invalid states into the same return value unless they genuinely mean the same thing.
## Choosing the Correct Return Value
The base-case return value must be neutral for the parent’s operation.
```plain text
Parent adds child answers       → return 0 for no contribution
Parent multiplies answers       → return 1 for neutral multiplication
Parent finds minimum            → invalid may return infinity
Parent finds maximum            → invalid may return negative infinity
Parent checks if one path works → invalid returns false
```
Example for minimum coins:
```java
if (amount == 0) {
    return 0;
}

if (amount < 0) {
    return Integer.MAX_VALUE;
}
```
Returning `0` for an impossible state would incorrectly make that path look valid.
## Recognizing Repeated Recursive States
Consider Fibonacci:
```plain text
fib(5)
├── fib(4)
│   ├── fib(3)
│   └── fib(2)
└── fib(3)
```
`fib(3)` is solved more than once.
This indicates overlapping subproblems.

The progression becomes:
```plain text
Recursion
→ Identify repeated states
→ Add memoization
→ Dynamic programming
```
Memoization template:
```java
int solve(int state, int[] memo) {
    if (baseCase(state)) {
        return baseAnswer;
    }

    if (memo[state] != uncomputed) {
        return memo[state];
    }

    int answer = solve(smallerState, memo);

    memo[state] = answer;
    return answer;
}
```
## Quick Interview Checklist
1. What does the recursive function return?
2. What parameters completely describe one state?
3. What is the smallest directly solvable state?
4. Does every recursive call move toward the base case?
5. What work happens before recursion?
6. What work happens after recursion?
7. How are multiple recursive answers combined?
8. What should an invalid state return?
9. Is the base-case value neutral for the parent operation?
10. Are the same recursive states being solved repeatedly?
11. Is this actually backtracking?
12. Must a choice be undone after returning?
13. Can recursion depth exceed the available call stack?
14. Would iteration with an explicit stack be safer?
15. What are the time and stack-space complexities?
## Technique Decision Rule
```plain text
One smaller state              → linear recursion
Carry partial answer forward   → accumulator
Several choices per state      → recursive decision tree
Left and right subtrees        → tree recursion
Independent input ranges       → divide and conquer
Process list during unwinding  → linked-list recursion
Generate all possibilities     → backtracking
Use calls as temporary storage → call-stack recursion
Repeated identical states      → memoization / DP
```
## Common Mistakes
- Writing recursion before defining the function contract.
- Missing the base case.
- Having a base case that is never reached.
- Making a recursive call with the same state.
- Returning the wrong neutral value.
- Treating an invalid state as a valid zero result.
- Forgetting to return the recursive answer.
- Combining answers incorrectly: using addition instead of maximum, or AND instead of OR.
- Changing shared state without undoing it.
- Adding the same mutable list reference to every answer.
- Trying to mentally execute the complete recursion tree while coding.
- Ignoring repeated states that cause exponential time.
- Claiming `O(1)` space because no explicit data structure was created.
- Forgetting that recursive calls consume stack space.
- Using recursion for extremely deep input without considering stack overflow.
## Complexity Analysis
Recursion’s complexity depends on:
```plain text
Number of recursive calls
× Work performed in each call
```
### Linear recursion
One call creates one smaller call:
```plain text
T(n) = T(n - 1) + O(1)

Time:  O(n)
Stack: O(n)
```
### Binary recursive choices
Every call creates two calls:
```plain text
T(n) = 2T(n - 1) + O(1)

Time:  O(2ⁿ)
Stack: O(n)
```
The recursion tree contains exponentially many calls, but its maximum depth is only `n`.
### Divide and conquer
Two calls on half-sized inputs:
```plain text
T(n) = 2T(n / 2) + O(n)

Time: O(n log n)
```
Merge sort follows this recurrence.
### Tree recursion
If every tree node is visited once:
```plain text
Time:  O(n)
Stack: O(height)
```
Balanced tree:
```plain text
Stack: O(log n)
```
Skewed tree:
```plain text
Stack: O(n)
```
### Recursive stack sorting
Elements may be repeatedly removed and reinserted:
```plain text
Time:  O(n²)
Stack: O(n)
```
## Final Reusable Model
> A recursive function should make one clear promise, solve a smaller version of that promise, and use the returned answer without reopening the smaller problem.

```plain text
Define the contract
→ Write the base case
→ Make the state smaller
→ Trust the recursive answer
→ Combine or undo
```
Before coding, say aloud:
> “I will assume the recursive call correctly solves the smaller problem. Given its answer, what must the current call do?”
