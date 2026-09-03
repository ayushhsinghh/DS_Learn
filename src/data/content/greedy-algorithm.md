A greedy algorithm builds an answer by repeatedly making the best decision available **at the current moment**.
It does not explore every possibility or undo earlier choices.
The difficult part is not making a locally good choice. The difficult part is proving:
> This local choice cannot prevent us from reaching an optimal final answer.
## Core Mental Model
```plain text
Choose the best safe option now
→ Permanently commit to it
→ Reduce the remaining problem
→ Repeat
```
Greedy is an algorithmic strategy, not a particular data structure.
Depending on the problem, a greedy solution may use:
- Sorting
- Two pointers
- A heap
- A stack
- A single running variable
## How to Identify Greedy Problems
Look for these signals:
- The problem asks for a minimum or maximum result.
- You must repeatedly select, assign, remove, or schedule something.
- A locally best choice leaves the remaining problem in the same form.
- Once a choice is made, revisiting it appears unnecessary.
- The problem involves maximum activities, minimum removals, assigning resources, reaching the farthest position, choosing the earliest finishing interval, or minimizing cost through ordered decisions.
- Sorting reveals a natural best choice.
- The question asks only for the optimal value, not every possible solution.
### Most important recognition question
> If I make the best-looking choice now, can I prove that replacing any optimal solution’s first choice with mine will not make it worse?
If yes, greedy may work.
## When Greedy Does Not Work
Greedy is dangerous when a locally best choice can damage a better future combination.
Example:
```plain text
Coins = [1, 3, 4]
Amount = 6
```
Choosing the largest coin first gives:
```plain text
4 + 1 + 1 = 3 coins
```
But the optimal answer is:
```plain text
3 + 3 = 2 coins
```
The local choice `4` is not globally safe.
This requires dynamic programming rather than a greedy rule.
## How to Prove a Greedy Choice
### 1. Exchange Argument
Show that an optimal solution can replace its choice with the greedy choice without becoming worse.
Example:
> If an optimal meeting schedule begins with a later-finishing meeting, replace it with the earliest-finishing meeting. This leaves at least as much time for future meetings.
### 2. Staying-Ahead Argument
Show that after every decision, the greedy solution is at least as good as any alternative so far.
Example:
> At every position, maintain the farthest index currently reachable.
### 3. Invariant
Define something that remains true after every greedy choice.
Example:
> After processing the first `i` intervals, `end` is the smallest possible ending point among solutions keeping the same number of intervals.
## Small Intuition Example
Suppose meetings are:
```plain text
[1,4], [2,3], [3,5]
```
To attend the maximum number of meetings, choose the meeting that ends earliest:
```plain text
[2,3]
```
Then `[3,5]` can also be attended.
Answer:
```plain text
[2,3], [3,5] → 2 meetings
```
If we choose `[1,4]`, only one meeting can be attended.
Why is earliest ending greedy?
> Finishing earlier leaves the maximum remaining space for future meetings.
## Common Form 1: Sort and Choose the Best Available Candidate
Use this when sorting exposes a safe order for making decisions.
Typical sorting choices:
- Smallest first
- Largest first
- Earliest finishing first
- Cheapest first
- Highest benefit first
### How it works
1. Identify the property that makes one candidate safer than another.
2. Sort candidates by that property.
3. Process them in greedy order.
4. Accept a candidate if it remains valid.
5. Never revisit accepted decisions.
**Memory flow:** `Find safe order → Sort → Accept when valid`
```java
Arrays.sort(items, (a, b) ->
    Integer.compare(a.score, b.score)
);

for (Item item : items) {
    if (canChoose(item)) {
        choose(item);
    }
}
```
The difficult part is deciding what `score` should represent.
Practice:
- LC 455 — Assign Cookies
- LC 1710 — Maximum Units on a Truck
- LC 1005 — Maximize Sum of Array After K Negations
- LC 1402 — Reducing Dishes
- LC 1833 — Maximum Ice Cream Bars
## Common Form 2: Interval Scheduling
Use this when selecting the maximum number of non-overlapping intervals or removing the minimum number of overlaps.
The greedy rule is:
> Keep the interval that finishes earliest.
### How it works
1. Sort intervals by ending point.
2. Select the first interval.
3. Accept another interval only if it starts after the last selected interval ends.
4. Update the ending point after accepting it.
5. Earliest finishing leaves maximum room for future intervals.
**Memory flow:** `Sort by end → Keep earliest finish → Leave future space`
```java
Arrays.sort(intervals, (a, b) ->
    Integer.compare(a[1], b[1])
);

int selected = 0;
int previousEnd = Integer.MIN_VALUE;

for (int[] interval : intervals) {
    if (interval[0] >= previousEnd) {
        selected++;
        previousEnd = interval[1];
    }
}
```
For minimum removals:
```java
int removals = intervals.length - selected;
```
Practice:
- LC 435 — Non-overlapping Intervals
- LC 452 — Minimum Number of Arrows to Burst Balloons
- LC 646 — Maximum Length of Pair Chain
- LC 1024 — Video Stitching
- Activity Selection Problem
## Common Form 3: Greedy Pairing with Two Pointers
Use this after sorting when small and large elements can be paired strategically.
Examples:
- Pair the lightest person with the heaviest.
- Assign the smallest sufficient resource.
- Match available resources to requirements.
### How it works
1. Sort the candidates.
2. Place one pointer at each relevant boundary.
3. Try to pair or assign the current candidates.
4. If pairing succeeds, move both necessary pointers.
5. Otherwise, commit the candidate that cannot benefit from waiting.
**Memory flow:** `Sort → Try extreme pairing → Commit unavoidable choice`
### Boats to Save People
```java
Arrays.sort(people);

int lightest = 0;
int heaviest = people.length - 1;
int boats = 0;

while (lightest <= heaviest) {
    if (people[lightest] + people[heaviest]
            <= limit) {
        lightest++;
    }

    heaviest--;
    boats++;
}

return boats;
```
Why always take the heaviest person?
The heaviest remaining person must use a boat. If they can share with the lightest, pair them. Otherwise, they must go alone.
Practice:
- LC 455 — Assign Cookies
- LC 881 — Boats to Save People
- LC 948 — Bag of Tokens
- LC 1578 — Minimum Time to Make Rope Colorful
- LC 2410 — Maximum Matching of Players With Trainers
## Common Form 4: Farthest Reach
Use this when moving through positions and each position extends how far you can currently reach.
Instead of exploring every path, track the best reachable boundary.
### How it works
1. Maintain the farthest index reachable so far.
2. At each position, verify that the position is reachable.
3. Extend the farthest boundary using the current position.
4. If a position lies beyond the boundary, it cannot be reached.
5. If the boundary reaches the destination, success is guaranteed.
**Memory flow:** `Confirm reachable → Extend farthest → Never reconsider paths`
```java
int farthest = 0;

for (int i = 0; i < nums.length; i++) {
    if (i > farthest) {
        return false;
    }

    farthest = Math.max(
        farthest,
        i + nums[i]
    );

    if (farthest >= nums.length - 1) {
        return true;
    }
}

return true;
```
Practice:
- LC 55 — Jump Game
- LC 45 — Jump Game II
- LC 1326 — Minimum Number of Taps to Open to Water a Garden
- LC 1024 — Video Stitching
- LC 763 — Partition Labels
## Common Form 5: Minimum Jumps Using Greedy Levels
Jump Game II resembles BFS levels, but the levels can be represented using boundaries instead of a queue.
Maintain:
```plain text
currentEnd = boundary reachable using current jump count
farthest   = best boundary reachable from this level
```
### How it works
1. Scan positions in the current reachable range.
2. Track the farthest position those positions can reach.
3. When the scan reaches `currentEnd`, one jump level is complete.
4. Increment the jump count.
5. Extend `currentEnd` to `farthest`.
**Memory flow:** `Explore current range → Find farthest next range → Take one jump`
```java
int jumps = 0;
int currentEnd = 0;
int farthest = 0;

for (int i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(
        farthest,
        i + nums[i]
    );

    if (i == currentEnd) {
        jumps++;
        currentEnd = farthest;
    }
}

return jumps;
```
Practice:
- LC 45 — Jump Game II
- LC 1326 — Minimum Number of Taps
- LC 1024 — Video Stitching
## Common Form 6: Greedy with a Heap
Use this when candidates become available over time, but you must choose the currently best candidate.
Sorting determines **when** candidates become available.
A heap determines **which available candidate** should be chosen.
### How it works
1. Sort candidates by availability or requirement.
2. Add every currently available candidate to a heap.
3. Choose the best candidate from the heap.
4. Update the current resource, time, or position.
5. Repeat until the target is reached or no valid candidate remains.
**Memory flow:** `Unlock candidates → Heap available choices → Pick best now`
### IPO-style template
```java
Arrays.sort(projects, (a, b) ->
    Integer.compare(a.requiredCapital, b.requiredCapital)
);

PriorityQueue<Project> maxHeap =
    new PriorityQueue<>((a, b) ->
        Integer.compare(b.profit, a.profit)
    );

int index = 0;

for (int choice = 0; choice < k; choice++) {
    while (index < projects.length
            && projects[index].requiredCapital
                <= currentCapital) {

        maxHeap.offer(projects[index]);
        index++;
    }

    if (maxHeap.isEmpty()) {
        break;
    }

    currentCapital += maxHeap.poll().profit;
}
```
Practice:
- LC 502 — IPO
- LC 630 — Course Schedule III
- LC 871 — Minimum Number of Refueling Stops
- LC 1353 — Maximum Number of Events That Can Be Attended
- LC 1642 — Furthest Building You Can Reach
## Common Form 7: Greedy Reset
Use this when a running segment becomes harmful and no future optimal solution benefits from keeping its failed prefix.
The key question is:
> If the current candidate fails here, can any earlier point inside this candidate become a valid start?
If not, reset after the failure.
### Gas Station intuition
If starting at station `start` causes the tank to become negative at station `i`, then no station between `start` and `i` can be a valid starting point.
### How it works
1. Maintain the running balance from the current candidate start.
2. If the balance becomes invalid, discard the entire current segment.
3. Begin a new candidate immediately after the failure.
4. Continue scanning once.
5. Use a global condition to verify that a solution exists.
**Memory flow:** `Accumulate → Failure invalidates segment → Reset after failure`
```java
int totalBalance = 0;
int currentBalance = 0;
int start = 0;

for (int i = 0; i < gas.length; i++) {
    int difference = gas[i] - cost[i];

    totalBalance += difference;
    currentBalance += difference;

    if (currentBalance < 0) {
        start = i + 1;
        currentBalance = 0;
    }
}

return totalBalance >= 0 ? start : -1;
```
Practice:
- LC 134 — Gas Station
- LC 53 — Maximum Subarray
- LC 918 — Maximum Sum Circular Subarray
## Common Form 8: Greedy Partitioning
Use this when the current segment should end as soon as all elements associated with it are fully contained.
### Partition Labels intuition
For every character, record its final occurrence.
While scanning a partition:
```plain text
partitionEnd = farthest final occurrence
               of any character seen so far
```
When the current index reaches `partitionEnd`, the partition is complete.
### How it works
1. Precompute the last occurrence of every value.
2. Start scanning the current segment.
3. Extend the segment’s end using each encountered value’s last occurrence.
4. When the current index reaches that end, close the segment.
5. Start the next segment.
**Memory flow:** `Track required end → Extend if necessary → Close when reached`
```java
int[] lastIndex = new int[26];

for (int i = 0; i < s.length(); i++) {
    lastIndex[s.charAt(i) - 'a'] = i;
}

List<Integer> answer = new ArrayList<>();

int segmentStart = 0;
int segmentEnd = 0;

for (int i = 0; i < s.length(); i++) {
    segmentEnd = Math.max(
        segmentEnd,
        lastIndex[s.charAt(i) - 'a']
    );

    if (i == segmentEnd) {
        answer.add(segmentEnd - segmentStart + 1);
        segmentStart = i + 1;
    }
}
```
Practice:
- LC 763 — Partition Labels
- LC 1520 — Maximum Number of Non-Overlapping Substrings
- LC 678 — Valid Parenthesis String
## Common Form 9: Greedy Construction with a Monotonic Stack
Use this when you must construct the smallest or largest possible sequence while preserving relative order.
Example:
```plain text
Remove k digits to create the smallest number.
```
When a smaller digit arrives, previously selected larger digits may be removed.
### How it works
1. Process values from left to right.
2. Compare the current value with the latest selected value.
3. While removing the latest value improves the answer and removals remain, pop it.
4. Add the current value.
5. If removals remain afterward, remove values from the end.
**Memory flow:** `Better current value → Remove worse previous choices → Build result`
```java
Deque<Character> stack = new ArrayDeque<>();

for (char digit : number.toCharArray()) {
    while (k > 0
            && !stack.isEmpty()
            && stack.peekLast() > digit) {

        stack.pollLast();
        k--;
    }

    stack.offerLast(digit);
}

while (k > 0) {
    stack.pollLast();
    k--;
}
```
Practice:
- LC 402 — Remove K Digits
- LC 316 — Remove Duplicate Letters
- LC 1081 — Smallest Subsequence of Distinct Characters
- LC 1673 — Find the Most Competitive Subsequence
## Greedy Decision Guide
```plain text
Choose maximum compatible intervals → earliest ending
Pair constrained values             → sort + two pointers
Determine reachability              → farthest reachable
Minimize number of jumps            → greedy range boundaries
Best among currently available      → sorting + heap
Running candidate becomes hopeless  → reset
Close independent segments          → track farthest required end
Build smallest/largest sequence      → monotonic stack
```
## Quick Interview Checklist
1. What exactly am I minimizing or maximizing?
2. What is the proposed local greedy choice?
3. Why is that choice safe?
4. Can I replace an optimal solution’s choice with mine without making it worse?
5. What invariant remains true after each choice?
6. Does sorting reveal a useful decision order?
7. Should I sort by start, end, value, cost, or benefit?
8. Is a heap required to choose among currently available candidates?
9. Can a failed prefix be permanently discarded?
10. Does the remaining problem have the same structure?
11. Could a locally attractive choice harm a better future combination?
12. Does the problem require DP because multiple future choices interact?
13. Are ties important to the sorting order?
14. Can comparator arithmetic overflow?
## Common Mistakes
- Assuming every optimization problem is greedy.
- Writing a greedy rule without proving why it is safe.
- Choosing the largest immediate value simply because it looks best.
- Sorting by the wrong property.
- Ignoring tie-breaking rules.
- Using greedy coin selection for arbitrary coin systems.
- Keeping the later-finishing interval during scheduling.
- Forgetting that the heaviest person in Boats to Save People must always be assigned a boat.
- Updating a reachable boundary before verifying the current position is reachable.
- Taking another jump at the final array position.
- Adding candidates to a heap before they become available.
- Resetting a running candidate without proving the whole failed segment is unusable.
- Confusing a greedy monotonic stack with a normal next-greater stack.
- Using subtraction in comparators when values can overflow.
- Assuming a greedy solution is correct only because it passes examples.
## Complexity Analysis
Greedy does not have one fixed complexity. It depends on its supporting operations.
### Sorting followed by a scan
```plain text
Sorting: O(n log n)
Scan:    O(n)

Total:   O(n log n)
```
### Greedy two-pointer scan after sorting
```plain text
Time:  O(n log n)
Space: O(1), excluding sorting
```
### Farthest-reach scan
```plain text
Time:  O(n)
Space: O(1)
```
### Sorting with a heap
Each candidate enters and leaves the heap at most once:
```plain text
Time:  O(n log n)
Space: O(n)
```
If the heap is restricted to size `k`:
```plain text
Time:  O(n log k)
Space: O(k)
```
### Monotonic-stack construction
Each element is pushed and popped at most once:
```plain text
Time:  O(n)
Space: O(n)
```
## Final Reusable Model
> Greedy works when the best safe decision now can be permanently committed without preventing an optimal final result.
```plain text
Define the local choice
→ Prove it is safe
→ Commit permanently
→ Solve the remaining smaller problem
```
Before using greedy, complete this sentence:
> “Choosing this candidate now is safe because any optimal solution can use it—or replace its own choice with it—without becoming worse.”
