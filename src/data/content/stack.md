A stack stores elements in **Last In, First Out** order:
```plain text
Last element added
→ First element removed
```
Imagine a stack of plates:
```plain text
push(1)
push(2)
push(3)

Top
 ↓
[3]  ← removed first
[2]
[1]
```
The most recently opened, started, or encountered item is often the first one that must be completed.
## Core Mental Model
> A stack remembers unfinished work in reverse order.
```plain text
Encounter unfinished work → Push
Finish the latest work    → Pop
Need the current work     → Peek
```
## How to Identify Stack Problems
Look for these signals:
- The most recent item must be processed first.
- The problem contains nested brackets, nested expressions, matching opening and closing symbols, undo operations, or directory navigation.
- You need the next or previous greater element, smaller element, warmer day, or boundary.
- Earlier elements must wait until a future element resolves them.
- Recursive behavior must be implemented iteratively.
- You need to preserve temporary states while processing input.
- The question involves evaluating or decoding an expression.
### Most important recognition question
> When I encounter a new element, does it resolve the most recent unresolved element first?
If yes, a stack is likely useful.
## Basic Stack Operations in Java
Use the `Deque` interface with `ArrayDeque`:
```java
Deque<Integer> stack = new ArrayDeque<>();
```
Operations:
```java
stack.push(value);  // Add to top
stack.pop();        // Remove and return top
stack.peek();       // Read top
stack.isEmpty();    // Check whether empty
stack.size();       // Number of elements
```
Prefer `ArrayDeque` over the old `Stack` class.
```java
Stack<Integer> stack = new Stack<>(); // Usually avoid
```
## Intuition Example
Validate:
```plain text
({[]})
```
Processing:
```plain text
( → push
{ → push
[ → push

] → matches latest [
} → matches latest {
) → matches latest (
```
The newest opening bracket must be closed first, which is exactly LIFO order.
## Common Form 1: Matching and Nested Structures
Use this when opening symbols must be matched with closing symbols in reverse order.
Examples:
- Parentheses
- Nested tags
- Nested expressions
- Bracket validation
### How it works
1. Push every opening symbol.
2. When a closing symbol appears, inspect the stack’s top.
3. The top must contain the matching opening symbol.
4. Pop the matched opening symbol.
5. At the end, the stack must be empty.
**Memory flow:** `Opening → Push | Closing → Match and pop`
```java
Deque<Character> stack = new ArrayDeque<>();

for (char character : s.toCharArray()) {
    if (character == '('
            || character == '{'
            || character == '[') {
        stack.push(character);
        continue;
    }

    if (stack.isEmpty()) {
        return false;
    }

    char opening = stack.pop();

    if (character == ')' && opening != '('
            || character == '}' && opening != '{'
            || character == ']' && opening != '[') {
        return false;
    }
}

return stack.isEmpty();
```
### Why check whether the stack is empty?
A closing bracket may appear without an available opening bracket:
```plain text
"]"
```
### Why check the stack again at the end?
Opening brackets may remain unmatched:
```plain text
"[["
```
Practice:
- LC 20 — Valid Parentheses
- LC 921 — Minimum Add to Make Parentheses Valid
- LC 1249 — Minimum Remove to Make Valid Parentheses
- LC 1021 — Remove Outermost Parentheses
- LC 1541 — Minimum Insertions to Balance a Parentheses String
## Common Form 2: Monotonic Stack
A monotonic stack keeps its values in increasing or decreasing order.
It is used when a new element resolves previous elements that were waiting for something larger or smaller.
Example:
```plain text
temperatures = [73, 74, 75, 71, 69, 72]
```
When `72` arrives, it resolves:
```plain text
69 → next warmer is 72
71 → next warmer is 72
```
It does not resolve `75`.
### How it works
1. Store unresolved indices in the stack.
2. Compare the current value with the value at the top index.
3. While the current value resolves the top, pop it.
4. Calculate the answer for the popped index.
5. Push the current index because it may need a future answer.
**Memory flow:** `Current resolves previous → Pop and answer → Push current`
### Next greater element template
```java
int[] answer = new int[nums.length];
Arrays.fill(answer, -1);

Deque<Integer> stack = new ArrayDeque<>();

for (int current = 0; current < nums.length; current++) {
    while (!stack.isEmpty()
            && nums[current] > nums[stack.peek()]) {

        int previous = stack.pop();
        answer[previous] = nums[current];
    }

    stack.push(current);
}
```
The stack stores indices because the answer may require the value, position, or distance.
### Stack meaning
For next greater element, the stack contains indices whose next greater value has not yet been found.
Practice:
- LC 496 — Next Greater Element I
- LC 503 — Next Greater Element II
- LC 739 — Daily Temperatures
- LC 901 — Online Stock Span
- LC 1019 — Next Greater Node in Linked List
## Common Form 3: Previous/Next Smaller Boundaries
Use this when every element expands until a smaller or greater value blocks it.
The classic problem is Largest Rectangle in Histogram.
For each bar, find:
```plain text
First smaller bar on the left
First smaller bar on the right
```
The bar can extend between those boundaries.
```plain text
width = rightSmaller - leftSmaller - 1
area  = height × width
```
### How it works
1. Maintain indices of bars in increasing-height order.
2. When a smaller bar arrives, it becomes the right boundary for taller bars.
3. Pop each taller bar.
4. After popping, the new stack top is its left boundary.
5. Calculate the rectangle using the popped height.
**Memory flow:** `Smaller arrives → Pop taller → Calculate boundary area`
### One-pass histogram template
```java
Deque<Integer> stack = new ArrayDeque<>();
int maximumArea = 0;

for (int i = 0; i <= heights.length; i++) {
    int currentHeight =
        i == heights.length ? 0 : heights[i];

    while (!stack.isEmpty()
            && currentHeight < heights[stack.peek()]) {

        int height = heights[stack.pop()];

        int leftBoundary =
            stack.isEmpty() ? -1 : stack.peek();

        int width = i - leftBoundary - 1;

        maximumArea = Math.max(
            maximumArea,
            height * width
        );
    }

    stack.push(i);
}
```
### Why add a virtual zero-height bar?
```java
i == heights.length ? 0 : heights[i]
```
It forces every remaining bar out of the stack so its area is calculated.
Practice:
- LC 84 — Largest Rectangle in Histogram
- LC 85 — Maximal Rectangle
- LC 42 — Trapping Rain Water
- LC 907 — Sum of Subarray Minimums
- LC 2104 — Sum of Subarray Ranges
## Common Form 4: Circular Monotonic Stack
Use this when the search for a next greater or smaller element wraps from the end of the array back to the beginning.
Instead of creating a second array, simulate two passes:
```java
for (int i = 0; i < 2 * n; i++) {
    int index = i % n;
}
```
### How it works
1. Traverse the array twice using `i % n`.
2. During the first pass, push unresolved indices.
3. During both passes, use current values to resolve waiting indices.
4. The second pass gives end-of-array elements access to beginning values.
5. Avoid pushing indices during the second pass.
**Memory flow:** `First pass creates work → Second pass finishes work`
```java
int n = nums.length;
int[] answer = new int[n];
Arrays.fill(answer, -1);

Deque<Integer> stack = new ArrayDeque<>();

for (int i = 0; i < 2 * n; i++) {
    int current = i % n;

    while (!stack.isEmpty()
            && nums[current] > nums[stack.peek()]) {

        answer[stack.pop()] = nums[current];
    }

    if (i < n) {
        stack.push(current);
    }
}
```
### Why process `2n` positions?
An element near the end may find its answer near the beginning:
```plain text
nums = [5, 1, 2, 3, 4]
```
For `4`, the next greater circular value is `5`.
Practice:
- LC 503 — Next Greater Element II
- LC 556 — Next Greater Element III
- LC 1019 — Next Greater Node in Linked List
## Common Form 5: Expression Evaluation
Use stacks when expressions contain operators, parentheses, different precedence levels, or nested subexpressions.
Depending on the problem, maintain a number stack, operator stack, or stack of previous results and signs.
### How it works
1. Build multi-digit numbers one character at a time.
2. Apply the previous operator when another operator is reached.
3. Push deferred values or states onto the stack.
4. Resolve multiplication and division before addition and subtraction when required.
5. For parentheses, save the outer state and restore it when the inner expression ends.
**Memory flow:** `Read token → Save unfinished state → Resolve in correct order`
### Basic Calculator II style template
```java
Deque<Integer> stack = new ArrayDeque<>();

int number = 0;
char operation = '+';

for (int i = 0; i <= s.length(); i++) {
    char character =
        i < s.length() ? s.charAt(i) : '+';

    if (Character.isDigit(character)) {
        number = number * 10 + (character - '0');
    }

    if ((!Character.isDigit(character)
            && character != ' ')
            || i == s.length()) {

        if (operation == '+') {
            stack.push(number);
        } else if (operation == '-') {
            stack.push(-number);
        } else if (operation == '*') {
            stack.push(stack.pop() * number);
        } else if (operation == '/') {
            stack.push(stack.pop() / number);
        }

        operation = character;
        number = 0;
    }
}

int answer = 0;

while (!stack.isEmpty()) {
    answer += stack.pop();
}

return answer;
```
Practice:
- LC 150 — Evaluate Reverse Polish Notation
- LC 224 — Basic Calculator
- LC 227 — Basic Calculator II
- LC 394 — Decode String
- LC 71 — Simplify Path
- LC 772 — Basic Calculator III
## Common Form 6: Decode Nested Strings
Use this when nested sections repeat or transform their contents.
Example:
```plain text
3[a2[c]]
```
The inner section must be completed first:
```plain text
2[c]   → cc
a2[c]  → acc
3[acc] → accaccacc
```
### How it works
1. Build the current repeat count.
2. When `[` appears, save the current string and repeat count.
3. Begin a fresh inner string.
4. When `]` appears, complete the inner string.
5. Restore the outer string and append the inner string repeatedly.
**Memory flow:** `Save outer state → Build inner state → Restore and combine`
```java
Deque<Integer> counts = new ArrayDeque<>();
Deque<StringBuilder> strings = new ArrayDeque<>();

StringBuilder current = new StringBuilder();
int number = 0;

for (char character : s.toCharArray()) {
    if (Character.isDigit(character)) {
        number = number * 10 + character - '0';
    } else if (character == '[') {
        counts.push(number);
        strings.push(current);

        number = 0;
        current = new StringBuilder();
    } else if (character == ']') {
        int repetitions = counts.pop();
        StringBuilder outer = strings.pop();

        while (repetitions-- > 0) {
            outer.append(current);
        }

        current = outer;
    } else {
        current.append(character);
    }
}

return current.toString();
```
Practice:
- LC 394 — Decode String
- LC 726 — Number of Atoms
- LC 1190 — Reverse Substrings Between Each Pair of Parentheses
## Common Form 7: Stack-Based Simulation
Use this when items are created and later removed or combined according to LIFO behavior.
Examples:
- Asteroid collisions
- Removing adjacent duplicates
- Directory navigation
- Undoing operations
- Comparing typed strings with backspaces
### How it works
1. Process elements from left to right.
2. Compare the current element with the stack’s top.
3. Pop while the latest stored element conflicts with or is cancelled by the current element.
4. Push the current element if it survives.
5. The remaining stack represents the final state.
**Memory flow:** `Compare with latest → Cancel or combine → Push survivor`
### Adjacent-removal template
```java
Deque<Character> stack = new ArrayDeque<>();

for (char character : s.toCharArray()) {
    if (!stack.isEmpty()
            && stack.peek() == character) {
        stack.pop();
    } else {
        stack.push(character);
    }
}
```
Practice:
- LC 735 — Asteroid Collision
- LC 1047 — Remove All Adjacent Duplicates in String
- LC 1209 — Remove All Adjacent Duplicates in String II
- LC 71 — Simplify Path
- LC 844 — Backspace String Compare
- LC 682 — Baseball Game
## Common Form 8: Stack with Additional State
Sometimes every stack element needs extra information, such as minimum so far, maximum so far, frequency, previous result, or current span.
The extra information must be updated with every push and restored automatically by pop.
### How it works
1. Store the normal value.
2. Store the additional state associated with that stack depth.
3. On push, derive the new state from the previous top.
4. On pop, remove both the value and its state.
5. The top always contains the current answer.
**Memory flow:** `Push value with state → Pop restores previous state`
### Min Stack using two stacks
```java
class MinStack {
    private final Deque<Integer> values =
        new ArrayDeque<>();

    private final Deque<Integer> minimums =
        new ArrayDeque<>();

    public void push(int value) {
        values.push(value);

        if (minimums.isEmpty()) {
            minimums.push(value);
        } else {
            minimums.push(
                Math.min(value, minimums.peek())
            );
        }
    }

    public void pop() {
        values.pop();
        minimums.pop();
    }

    public int top() {
        return values.peek();
    }

    public int getMin() {
        return minimums.peek();
    }
}
```
Practice:
- LC 155 — Min Stack
- LC 895 — Maximum Frequency Stack
- LC 901 — Online Stock Span
- LC 716 — Max Stack
## Common Form 9: Iterative DFS Using a Stack
Recursion internally uses a call stack. An explicit stack can simulate the same behavior.
Use this for tree traversal, graph traversal, avoiding recursive depth limits, or controlling processing order.
### How it works
1. Push the starting node.
2. Pop the most recently discovered node.
3. Process it.
4. Push its unvisited neighbors.
5. Continue until the stack becomes empty.
**Memory flow:** `Push work → Pop latest → Add its next work`
### Tree preorder template
```java
Deque<TreeNode> stack = new ArrayDeque<>();

if (root != null) {
    stack.push(root);
}

while (!stack.isEmpty()) {
    TreeNode current = stack.pop();

    // Process current.

    if (current.right != null) {
        stack.push(current.right);
    }

    if (current.left != null) {
        stack.push(current.left);
    }
}
```
Push `right` before `left` because the stack processes `left` first.
Practice:
- LC 144 — Binary Tree Preorder Traversal
- LC 94 — Binary Tree Inorder Traversal
- LC 200 — Number of Islands
- LC 133 — Clone Graph
- LC 841 — Keys and Rooms
## Common Form 10: Recursion Using the Call Stack
Some problems allow only stack operations and recursion.
Examples:
- Sort a stack recursively
- Reverse a stack recursively
- Insert an element at the bottom
The call stack temporarily stores removed elements.
### How it works
1. Remove the top element.
2. Recursively solve the smaller stack.
3. During recursion unwinding, insert the removed element into its correct position.
4. Each call remembers one element.
5. The original stack is rebuilt in the required order.
**Memory flow:** `Remove → Solve smaller problem → Reinsert while returning`
### Recursive stack sort
```java
private void sort(Deque<Integer> stack) {
    if (stack.isEmpty()) {
        return;
    }

    int top = stack.pop();

    sort(stack);
    insertSorted(stack, top);
}

private void insertSorted(
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
- LC 1047 — Remove Adjacent Duplicates as a simpler stack exercise
## Monotonic Stack Direction Guide
The naming describes the stack’s order—not necessarily the answer being searched.
### Increasing stack
Values increase from bottom to top:
```plain text
[2, 4, 7, 9]
```
Commonly useful for finding smaller boundaries.
### Decreasing stack
Values decrease from bottom to top:
```plain text
[9, 7, 4, 2]
```
Commonly useful for finding greater boundaries.
The safer approach is not memorizing the name. Instead ask:
> Which previous elements does the current value resolve?
```plain text
Current greater than stack top → resolve next greater
Current smaller than stack top → resolve next smaller
```
## Quick Interview Checklist
1. Is the most recently added item processed first?
2. What exactly does each stack entry represent?
3. Should I store values, indices, nodes, or complete states?
4. What does it mean for an item to remain in the stack?
5. What condition causes elements to pop?
6. Can one current element resolve multiple previous elements?
7. Should the comparison be strict or non-strict?
8. What happens when the stack is empty?
9. Must remaining stack elements be processed at the end?
10. Would a sentinel simplify final cleanup?
11. Is the input circular?
12. Do I need one stack or multiple stacks?
13. Could recursion serve as the stack?
14. Does the output need the value, index, or distance?
## Technique Decision Rule
```plain text
Nested matching                 → normal stack
Next/previous greater/smaller   → monotonic stack
Expansion boundaries            → monotonic stack
Circular next greater           → simulate two passes
Nested expression               → state/operator stacks
Collision or cancellation       → simulation stack
Minimum/maximum at every depth  → stack with extra state
Iterative DFS                   → explicit node stack
Restricted stack operations     → recursion/call stack
```
## Common Mistakes
- Calling `pop()` or `peek()` before checking `isEmpty()`.
- Storing values when the problem requires indices or distances.
- Using the wrong comparison:
```java
<,<=,>,>=
```
Duplicates often determine whether the comparison should be strict.
- Forgetting that `ArrayDeque` does not allow `null`.
- Assuming `PriorityQueue` behaves like a stack.
- Pushing resolved elements back onto a monotonic stack.
- Forgetting to process elements left in the stack.
- Processing circular-array indices twice as new work.
- Reversing the final output accidentally because stack removal is reversed.
- Losing outer state during nested-expression processing.
- Not resetting the current number after processing an operator.
- Forgetting that Java integer division truncates toward zero.
- Using recursion without accounting for call-stack space.
- Confusing the top of a stack with the front of a queue.
## Complexity Analysis
### Basic stack operations
```plain text
push:  O(1)
pop:   O(1)
peek:  O(1)
```
### Standard stack traversal
For `n` input elements:
```plain text
Time:  O(n)
Space: O(n)
```
### Monotonic stack
Although there is a `while` loop inside a `for` loop:
```java
for (...) {
    while (...) {
        stack.pop();
    }
}
```
the total time is still `O(n)` because every element:
```plain text
is pushed at most once
is popped at most once
```
Therefore:
```plain text
Time:  O(n)
Space: O(n)
```
### Expression evaluation
```plain text
Time:  O(n)
Space: O(n)
```
### Iterative DFS
For a graph:
```plain text
Time:  O(vertices + edges)
Space: O(vertices)
```
### Recursive stack operations
Sorting a stack recursively may remove and reinsert elements repeatedly:
```plain text
Time:  O(n²)
Space: O(n) call stack
```
## Final Reusable Model
> A stack stores unresolved work, and the newest unresolved item is always the first one available to resolve.
```plain text
Push unfinished work
→ Inspect the latest work
→ Pop when resolved
```
For monotonic-stack problems, remember:
> The current element may resolve several previous elements, so popping usually requires a `while` loop rather than an `if`.
<empty-block/>
