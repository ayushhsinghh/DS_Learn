# 2 Pointers
## How to Identify the Two Pointers Pattern
Look for these strong signals:
- The input is **sorted**, or sorting would create useful order.
- You need to find a **pair or triplet** satisfying a condition.
- The problem compares values from **opposite ends**.
- You must modify an array **in place**.
- You need to remove duplicates or move selected elements while preserving order.
- After comparing two elements, you can prove that one pointer should move.
> **Most important question:** Can the current comparison prove that one side cannot contribute to the answer?
## The Elimination Intuition
Consider a sorted array and a target of 18:
```plain text
[2, 4, 7, 11, 15]
 L               R
```
The current sum is 17, which is too small.
- Moving `right` left would only make the sum smaller.
- Therefore, the only useful move is `left++`.
This elimination proof is the heart of the pattern:
> **Compare → eliminate one side → move one pointer.π**
## Common Form 1: Opposite-Direction Pointers
Use this form when the two pointers represent candidates or boundaries, usually in sorted data.
**How it works:**
1. Start one pointer at each end.
2. Compare the two current values.
3. Use the result to prove which value cannot be part of the answer.
4. Move only that pointer inward.
**Memory flow:** `Compare → Eliminate → Move`
```java
int left = 0;
int right = nums.length - 1;

while (left < right) {
    if (condition(nums[left], nums[right])) {
        // Process the answer.
    } else if (needLargerValue) {
        left++;
    } else {
        right--;
    }
}
```
Common appearances:
- Pair sum in a sorted array
- Palindrome checking
- Container With Most Water
- 3Sum after fixing one element
- Comparing or shrinking boundaries
<callout icon="✅" color="green_bg">
	**Invariant:** Everything outside `[left, right]` has already been decided. Each comparison proves that at least one current boundary cannot participate in a better valid answer.
</callout>
## Common Form 2: Same-Direction Read/Write Pointers
Use this form when you must scan the input while compacting or rewriting it in place.
**How it works:**
1. The `read` pointer examines every element.
2. When an element should be kept, place it at the `write` position.
3. Move `write` only after placing an accepted element.
4. Everything before `write` is the completed answer.
**Memory flow:** `Read → Accept → Write`
```java
int write = 0;

for (int read = 0; read < nums.length; read++) {
    if (shouldKeep(nums[read])) {
        nums[write++] = nums[read];
    }
}
```
- `read` explores every input element.
- `write` marks where the next accepted element belongs.
Common appearances:
- Remove duplicates
- Move zeroes
- Remove a particular value
- In-place array compaction
- Partition accepted and rejected elements
<callout icon="✅" color="green_bg">
	**Invariant:** The range before `write` contains exactly the accepted elements seen so far, in their required order.
</callout>
## Quick Interview Checklist
Ask yourself:
1. Is the input sorted, or can sorting create useful order?
2. Am I searching for a pair, triplet, or relationship between two positions?
3. Can one comparison eliminate a candidate permanently?
4. Can each pointer move only forward or inward?
5. Can this reduce an `O(n²)` comparison to an `O(n)` scan?
6. For read/write pointers, can I clearly state what the completed prefix contains?
If most answers are yes, Two Pointers is probably the intended pattern.
## Common Mistakes
- Moving both pointers without proving that both candidates are impossible
- Applying the pattern to unsorted data without a valid monotone rule
- Losing original indices after sorting when the output requires them
- Using `int` when pair or triplet sums can overflow
- Confusing the relationship between two positions with the state of an entire sliding window
- Forgetting whether the loop should use `left < right` or `left <= right`
## Complexity Reminder
- Typical scan: `O(n)` time and `O(1)` auxiliary space
- If sorting is required first: `O(n log n)` total time
- Three-sum style approach: fix one element and run a linear two-pointer scan, producing `O(n²)` total time after sorting
---
> **Reusable mnemonic:** Compare → prove which side is impossible → move only that pointer.
# Sliding Window
Sliding window is a two-pointer technique for problems involving a **contiguous range**—a subarray or substring.
<callout icon="🧠" color="blue_bg">
	**Core mental model:** Expand the right side to acquire elements. Shrink the left side when necessary. Maintain enough information to evaluate the current window efficiently.
</callout>
## How to Identify Sliding-Window Questions
Look for these signals:
- The answer must be a **contiguous** subarray or substring.
- The question asks for the longest, shortest, maximum, minimum, or number of valid ranges.
- The range must satisfy a condition such as at most `k` distinct values, no repeated characters, or sum at least a target.
- When one element enters or leaves, you can update the window state efficiently.
- After moving `right`, an invalid window can be repaired by moving `left` forward.
> **Most important question:** If I move `right` forward, can I repair the window by moving `left` forward?
If yes, sliding window is probably useful.
Sliding window usually does **not** apply when:
- Elements can be selected from arbitrary positions.
- The required range is not contiguous.
- Removing elements from the left cannot systematically restore validity.
- The condition is not monotonic.
### Examples
- “Maximum sum subarray of size `k`” → fixed-size window.
- “Longest substring without repeating characters” → variable window; shrink when invalid.
- “Minimum subarray with sum at least target” → variable window; shrink while valid.
Sliding window usually does **not** apply when the selected elements need not be contiguous, or when removing elements from the left cannot systematically restore validity.
## Common Form 1: Fixed-Size Window
Use this when every candidate range has exactly size `k`.
**How it works:**
1. Add the element at `right`.
2. If the window becomes larger than `k`, remove the element at `left` and move `left`.
3. When the window size is exactly `k`, calculate the answer.
4. Repeat to process every window of size `k`.
**Memory flow:** `Add → Maintain size k → Calculate`
```java
int left = 0;
int windowSum = 0;
int answer = Integer.MIN_VALUE;

for (int right = 0; right < nums.length; right++) {
    windowSum += nums[right];

    if (right - left + 1 > k) {
        windowSum -= nums[left];
        left++;
    }

    if (right - left + 1 == k) {
        answer = Math.max(answer, windowSum);
    }
}
```
Small example: `[2,1,5,1,3,2]`, `k = 3` has window sums `8, 7, 9, 6`; the maximum is `9`.
Practice:
- LC 643 — Maximum Average Subarray I
- LC 438 — Find All Anagrams in a String
- LC 567 — Permutation in String
- LC 1456 — Maximum Number of Vowels in a Substring
## Common Form 2: Variable Window — Longest Valid Range
Expand `right`. When the window becomes invalid, move `left` until it is valid again. Calculate the answer only after validity is restored.
**How it works:**
1. Add the element at `right`.
2. If the window becomes invalid, keep removing elements from `left`.
3. Stop shrinking when the window becomes valid again.
4. Record the current length because `[left, right]` is now a valid window.
**Memory flow:** `Add → Fix invalid window → Record longest`
```java
int left = 0;
int answer = 0;

for (int right = 0; right < nums.length; right++) {
    add(nums[right]);

    while (windowIsInvalid()) {
        remove(nums[left]);
        left++;
    }

    answer = Math.max(answer, right - left + 1);
}
```
<callout icon="✅" color="green_bg">
	**Invariant:** Whenever the answer is calculated, `[left, right]` is a valid window.
</callout>
Practice:
- LC 3 — Longest Substring Without Repeating Characters
- LC 424 — Longest Repeating Character Replacement
- LC 904 — Fruit Into Baskets
- LC 1004 — Max Consecutive Ones III
- LC 1493 — Longest Subarray of 1’s After Deleting One Element
## Common Form 3: Variable Window — Shortest Valid Range
Expand until the window becomes valid. Then record the answer and shrink repeatedly while it remains valid.
**How it works:**
1. Add elements using `right` until the window becomes valid.
2. Record the current window length.
3. Remove the element at `left` to check whether a smaller valid window exists.
4. Continue shrinking and recording while the window remains valid.
**Memory flow:** `Become valid → Record → Shrink again`
```java
int left = 0;
int answer = Integer.MAX_VALUE;

for (int right = 0; right < nums.length; right++) {
    add(nums[right]);

    while (windowIsValid()) {
        answer = Math.min(answer, right - left + 1);
        remove(nums[left]);
        left++;
    }
}

return answer == Integer.MAX_VALUE ? 0 : answer;
```
Small example: For `[2,3,1,2,4,3]` and target `7`, the shortest valid window is `[4,3]`, so the answer is `2`.
> **Key difference:** For longest-valid problems, shrink while **invalid**. For shortest-valid problems, record and shrink while **valid**.
Practice:
- LC 209 — Minimum Size Subarray Sum
- LC 76 — Minimum Window Substring
- LC 1234 — Replace the Substring for Balanced String
## Common Form 4: Frequency-Map Window
Use this when validity depends on the frequency of characters or numbers.
**How it works:**
1. Add the entering element’s frequency when `right` moves.
2. Remove the leaving element’s frequency when `left` moves.
3. Maintain a counter that tells you whether the required frequencies are satisfied.
4. Use that counter instead of comparing the complete frequency map repeatedly.
**Memory flow:** `Add frequency → Remove frequency → Check requirements`
```java
Map<Character, Integer> frequency = new HashMap<>();
int left = 0;

for (int right = 0; right < s.length(); right++) {
    char entering = s.charAt(right);
    // Update the state for the entering character.

    if (right - left + 1 > requiredLength) {
        char leaving = s.charAt(left);
        // Undo the state for the leaving character.
        left++;
    }

    if (right - left + 1 == requiredLength) {
        // Check whether all frequency requirements are satisfied.
    }
}
```
Choose:
- `int[26]` for lowercase English letters.
- `int[128]` for ASCII characters.
- `HashMap` for arbitrary characters or numbers.
- A missing-requirements counter to avoid comparing the entire map repeatedly.
Practice:
- LC 438 — Find All Anagrams in a String
- LC 567 — Permutation in String
- LC 76 — Minimum Window Substring
## Common Form 5: Count Windows Using At Most
Problems asking for **exactly ****`k`** can often be transformed:
**How it works:**
1. Add the element at `right`.
2. If the window violates the “at most `k`” condition, move `left` until it becomes valid.
3. Once valid, every subarray ending at `right` and starting between `left` and `right` is also valid.
4. Therefore, add `right - left + 1` to the answer.
5. For exactly `k`, calculate `atMost(k) - atMost(k - 1)`.
**Memory flow:** `Make valid → Count all valid endings → Subtract for exactly k`
```plain text
exactly(k) = atMost(k) - atMost(k - 1)
```
Generic `atMost` template:
```java
private int atMost(int[] nums, int k) {
    int left = 0;
    int answer = 0;

    for (int right = 0; right < nums.length; right++) {
        add(nums[right]);

        while (windowIsInvalid(k)) {
            remove(nums[left]);
            left++;
        }

        answer += right - left + 1;
    }

    return answer;
}
```
If `[left, right]` is valid, then every window ending at `right` and starting from `left` through `right` is valid. Their count is `right - left + 1`.
Practice:
- LC 992 — Subarrays with K Different Integers
- LC 1248 — Count Number of Nice Subarrays
- LC 930 — Binary Subarrays With Sum
## Common Form 6: Window with a Monotonic Deque
Use a deque when every window needs its current maximum or minimum.
**How it works:**
1. Remove indices from the back whose values can never become the window’s maximum.
2. Add the current index at the back.
3. Remove the front index if it is outside the current window.
4. The index at the front now represents the maximum value in the window.
For a minimum window, reverse the comparison.
**Memory flow:** `Remove useless → Add current → Remove expired → Read front`
```java
Deque<Integer> deque = new ArrayDeque<>();

for (int right = 0; right < nums.length; right++) {
    while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[right]) {
        deque.pollLast();
    }
    deque.offerLast(right);

    if (deque.peekFirst() <= right - k) {
        deque.pollFirst();
    }

    if (right >= k - 1) {
        int windowMaximum = nums[deque.peekFirst()];
    }
}
```
Practice:
- LC 239 — Sliding Window Maximum
- LC 1438 — Longest Continuous Subarray With Absolute Difference Within Limit
## Quick Interview Checklist
1. Must the answer be contiguous?
2. Is the window size fixed or variable?
3. What state describes the window: sum, frequency, distinct count, zero count, maximum, or minimum?
4. What exactly makes the window valid or invalid?
5. When should `left` move?
6. Should I calculate the answer before shrinking, after restoring validity, or repeatedly while valid?
7. Can every element enter and leave the window at most once?
<callout icon="🎯" color="yellow_bg">
	**Reusable flow:** Add `right` → restore the invariant using `left` → calculate the answer.
	For minimum-valid windows: Add `right` → once valid, calculate and shrink repeatedly.
</callout>
## Common Mistakes
- Using sliding window when the answer is not contiguous.
- Forgetting to remove the left element from the maintained state.
- Using `if` when the window may require a `while` loop to become valid.
- Calculating length incorrectly; an inclusive window has length `right - left + 1`.
- Recording a longest-window answer before restoring validity.
- Shrinking a minimum-valid window before recording its valid size.
- Confusing distinct-character count with total-character count.
- Recalculating the full sum or frequency map for every window.
- Assuming nested loops automatically mean `O(n²)`.
- Applying a normal sum window when negative numbers break the monotonic behavior.
## Complexity Analysis
- **Typical time:** `O(n)`.
- **Simple sum or counters:** `O(1)` auxiliary space.
- **Fixed alphabet array:** `O(1)` auxiliary space.
- **HashMap:** `O(k)` or up to `O(n)`, depending on distinct values in the window.
- **Monotonic deque:** `O(k)` space.
Even with a `while` loop inside a `for` loop, the usual running time is linear:
```plain text
right moves at most n times
left moves at most n times
total movements <= 2n
therefore O(n)
```
---
> **Final mental model:** The right pointer introduces information. The left pointer removes old information until the window has exactly the property required by the problem.
# Prefix Sum
Prefix sum stores the cumulative result up to each position so that the result for any range can be calculated without scanning that range again.
<callout icon="🧠" color="blue_bg">
	**Core mental model:** Store everything before each position. Subtract two stored states to isolate the range between them.
</callout>
```plain text
prefix up to right - prefix before left = required range
```
## How to Identify Prefix-Sum Questions
Look for these signals:
- The problem repeatedly asks about a **contiguous range**.
- You need the sum or count between two indices.
- You need to count subarrays whose sum equals `k`, is divisible by `k`, or has equal quantities of two values.
- Negative numbers make a normal sliding window unreliable.
- The question asks for the number, length, or value of valid ranges.
- A range property can be derived by subtracting two cumulative states.
> **Most important question:** Can the property of `nums[left...right]` be calculated by subtracting the state before `left` from the state at `right`?
Prefix sum may need an additional structure: a HashMap for previous states, binary search for ordered prefixes, a monotonic deque for optimized candidates, or a difference array for range updates.
## Intuition Example
```plain text
nums   = [2, 3, 1, 4]
prefix = [0, 2, 5, 6, 10]

sum from index 1 to 3
= prefix[4] - prefix[1]
= 10 - 2
= 8
```
The subtraction removes everything before index `1`.
## Common Form 1: Prefix Array for Range Sum
Use this when multiple queries ask for the sum of different ranges.
**How it works:**
1. Create a prefix array of size `n + 1`.
2. Store the sum of the first `i` elements in `prefix[i]`.
3. For `[left, right]`, calculate `prefix[right + 1] - prefix[left]`.
4. Each range query is now answered in constant time.
**Memory flow:** `Build once → Subtract prefixes → Answer ranges`
```java
int[] prefix = new int[nums.length + 1];

for (int i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
}

int rangeSum = prefix[right + 1] - prefix[left];
```
`prefix[0] = 0` represents the sum before the array begins, so ranges starting at index `0` need no special case.
Practice:
- LC 303 — Range Sum Query: Immutable
- LC 1480 — Running Sum of 1D Array
- LC 724 — Find Pivot Index
- LC 1732 — Find the Highest Altitude
## Common Form 2: Count Subarrays with a Target Sum
Use a frequency map when the question asks how many subarrays have sum `target`.
```plain text
currentPrefix - previousPrefix = target
previousPrefix = currentPrefix - target
```
**How it works:**
1. Store how many times each prefix sum has appeared.
2. Add the current element to `prefixSum`.
3. Look for `prefixSum - target` in the map.
4. Every occurrence represents a valid subarray ending at the current index.
5. Store the current prefix for future positions.
**Memory flow:** `Add current → Find needed past → Count → Store current`
```java
Map<Integer, Integer> frequency = new HashMap<>();
frequency.put(0, 1);

int prefixSum = 0;
int answer = 0;

for (int num : nums) {
    prefixSum += num;
    int needed = prefixSum - target;
    answer += frequency.getOrDefault(needed, 0);
    frequency.put(prefixSum, frequency.getOrDefault(prefixSum, 0) + 1);
}
```
Practice:
- LC 560 — Subarray Sum Equals K
- LC 930 — Binary Subarrays With Sum
- LC 1248 — Count Number of Nice Subarrays
- LC 437 — Path Sum III
## Common Form 3: Longest Subarray with a Target Property
For the longest range, store the **earliest index** where each prefix state appeared.
**How it works:**
1. Calculate the current prefix state.
2. Find the earlier prefix needed to form a valid range.
3. Measure the distance from its earliest index.
4. Store a prefix state only the first time it appears.
5. Never replace the earliest index.
**Memory flow:** `Find needed past → Measure distance → Preserve earliest`
```java
Map<Integer, Integer> firstIndex = new HashMap<>();
firstIndex.put(0, -1);

int prefixSum = 0;
int answer = 0;

for (int i = 0; i < nums.length; i++) {
    prefixSum += nums[i];
    int needed = prefixSum - target;

    if (firstIndex.containsKey(needed)) {
        answer = Math.max(answer, i - firstIndex.get(needed));
    }

    firstIndex.putIfAbsent(prefixSum, i);
}
```
Practice:
- LC 325 — Maximum Size Subarray Sum Equals K
- LC 525 — Contiguous Array
- LC 1371 — Find the Longest Substring Containing Vowels in Even Counts
## Common Form 4: Transform Values into a Prefix State
Use this when the question does not directly mention sums but can be represented as a running balance.
**How it works:**
1. Convert every value into a contribution to the required balance.
2. Maintain the running balance as a prefix state.
3. If the same state appears twice, the range between them has net contribution zero.
4. Store frequencies for counting or the earliest index for maximum length.
**Memory flow:** `Transform → Build state → Match previous state`
Example: Convert `0 → -1` and `1 → +1`. A range with equal zeroes and ones now has sum `0`.
```java
Map<Integer, Integer> firstIndex = new HashMap<>();
firstIndex.put(0, -1);

int balance = 0;
int answer = 0;

for (int i = 0; i < nums.length; i++) {
    balance += nums[i] == 0 ? -1 : 1;

    if (firstIndex.containsKey(balance)) {
        answer = Math.max(answer, i - firstIndex.get(balance));
    } else {
        firstIndex.put(balance, i);
    }
}
```
Practice:
- LC 525 — Contiguous Array
- LC 1248 — Count Number of Nice Subarrays
- LC 1371 — Find the Longest Substring Containing Vowels in Even Counts
- LC 1542 — Find Longest Awesome Substring
## Common Form 5: Prefix Remainder
Use this when the question asks about sums divisible by `k`. If two prefixes have the same remainder, their difference is divisible by `k`.
**How it works:**
1. Calculate the running prefix sum.
2. Normalize its remainder into the range `0` to `k - 1`.
3. Look for the same remainder among previous prefixes.
4. Equal remainders form a range divisible by `k`.
5. Store frequencies for counting or the earliest index for maximum length.
**Memory flow:** `Calculate remainder → Match same remainder → Form divisible range`
```java
Map<Integer, Integer> frequency = new HashMap<>();
frequency.put(0, 1);

int prefixSum = 0;
int answer = 0;

for (int num : nums) {
    prefixSum += num;
    int remainder = ((prefixSum % k) + k) % k;
    answer += frequency.getOrDefault(remainder, 0);
    frequency.put(remainder, frequency.getOrDefault(remainder, 0) + 1);
}
```
Practice:
- LC 974 — Subarray Sums Divisible by K
- LC 523 — Continuous Subarray Sum
- LC 1590 — Make Sum Divisible by P
## Common Form 6: Two-Dimensional Prefix Sum
Use this when the problem asks for sums inside rectangular regions of a matrix.
**How it works:**
1. Build a cumulative value for every matrix position.
2. Begin a query with the complete bottom-right prefix.
3. Subtract the region above and the region to the left.
4. Add back the top-left overlap because it was subtracted twice.
**Memory flow:** `Whole rectangle → Subtract top → Subtract left → Add overlap`
```java
int rows = matrix.length;
int cols = matrix[0].length;
int[][] prefix = new int[rows + 1][cols + 1];

for (int row = 0; row < rows; row++) {
    for (int col = 0; col < cols; col++) {
        prefix[row + 1][col + 1] = matrix[row][col]
            + prefix[row][col + 1]
            + prefix[row + 1][col]
            - prefix[row][col];
    }
}
```
Rectangle query:
```java
int sum = prefix[row2 + 1][col2 + 1]
    - prefix[row1][col2 + 1]
    - prefix[row2 + 1][col1]
    + prefix[row1][col1];
```
Practice:
- LC 304 — Range Sum Query 2D: Immutable
- LC 1314 — Matrix Block Sum
- LC 1074 — Number of Submatrices That Sum to Target
## Common Form 7: Difference Array Followed by Prefix Sum
Use this when multiple operations add a value to an entire range.
**How it works:**
1. Add the change where the range begins.
2. Cancel it immediately after the range ends.
3. Repeat for every update.
4. Build a running prefix to reconstruct the final values.
**Memory flow:** `Mark start → Cancel after end → Build prefix`
```java
int[] difference = new int[n + 1];

for (int[] update : updates) {
    int left = update[0];
    int right = update[1];
    int value = update[2];

    difference[left] += value;
    difference[right + 1] -= value;
}

int runningValue = 0;
for (int i = 0; i < n; i++) {
    runningValue += difference[i];
    nums[i] += runningValue;
}
```
Practice:
- LC 1094 — Car Pooling
- LC 1109 — Corporate Flight Bookings
- LC 370 — Range Addition
- LC 1854 — Maximum Population Year
## Quick Interview Checklist
1. Is the answer based on a contiguous range?
2. Can I express the range as a difference between two prefix states?
3. Do I need one answer or many range queries?
4. Do I need a count, the longest range, or a range value?
5. Should the map store a frequency or the earliest index?
6. What initial prefix state is required?
7. Are negative numbers present?
8. Can the problem be transformed into a balance, remainder, or bitmask state?
### Map Decision Rule
```plain text
Count subarrays     → store frequency
Longest subarray    → store earliest index
Range-sum queries   → store prefix array
Divisible by k      → store remainder
Equal quantities    → store balance
Range updates       → store difference array
```
## Common Mistakes
- Forgetting `frequency.put(0, 1)` for counting.
- Forgetting `firstIndex.put(0, -1)` for longest length.
- Storing the current prefix before searching for the needed previous prefix.
- Using frequency when the problem needs the earliest index.
- Overwriting the earliest index.
- Using the wrong range formula instead of `prefix[right + 1] - prefix[left]`.
- Forgetting to normalize negative remainders.
- Using `int` when cumulative sums can overflow.
- Assuming sliding window works when negative values break monotonicity.
- Forgetting the overlap correction in a 2D prefix sum.
## Complexity Analysis
- Building a one-dimensional prefix array: `O(n)` time and `O(n)` space.
- Each range query: `O(1)` time.
- Prefix sum with a HashMap: `O(n)` average time and `O(n)` space.
- Two-dimensional prefix construction: `O(rows × columns)` time and space; each rectangle query is `O(1)`.
- Difference array: `O(1)` per range update and `O(n)` final reconstruction.
```plain text
O(n) preprocessing + O(q) range queries = O(n + q)
```
---
> **Final reusable model:** Store the cumulative state up to every position, then compare or subtract previous states to understand the range between them.
```plain text
Build cumulative state → Find required previous state → Derive the range
```
<empty-block/>
# Overlapping Intervals
Intervals represent ranges such as `[start, end]`. Sorting them makes related or overlapping ranges appear next to each other.
<callout icon="🧠" color="blue_bg">
	**Core mental model:** Sort by the appropriate boundary, compare neighboring ranges, then merge, select, intersect, or count.
</callout>
For closed intervals, `[a,b]` and `[c,d]` overlap when `c <= b`. Their merged interval is `[a, max(b,d)]`.
## How to Identify Interval Problems
Look for these signals:
- Inputs represent meetings, bookings, events, occupied positions, or other start/end ranges.
- The question asks you to merge ranges, insert a range, detect conflicts, remove overlaps, find intersections, count concurrent events, or allocate resources.
- Relative input order is unimportant, so sorting is allowed.
- The decision depends on comparing one interval’s start with another interval’s end.
> **Most important question:** After sorting, can I process each interval by comparing it with the last interval I accepted?
## Intuition Example
```plain text
[[1,3], [2,6], [8,10]]

[1,3] and [2,6] overlap because 2 <= 3
merge them into [1,6]
[8,10] does not overlap because 8 > 6

answer = [[1,6], [8,10]]
```
## Common Form 1: Merge Overlapping Intervals
Use this when every overlapping range must be combined.
**How it works:**
1. Sort intervals by starting point.
2. Track one current merged interval.
3. If the next interval starts before the current one ends, extend the current end.
4. Otherwise, save the current interval and begin a new one.
5. Add the final tracked interval after the loop.
**Memory flow:** `Sort → Compare → Extend or Save`
```java
Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
List<int[]> merged = new ArrayList<>();
int[] current = intervals[0];

for (int i = 1; i < intervals.length; i++) {
    int[] next = intervals[i];
    if (next[0] <= current[1]) {
        current[1] = Math.max(current[1], next[1]);
    } else {
        merged.add(current);
        current = next;
    }
}
merged.add(current);
return merged.toArray(new int[merged.size()][]);
```
Practice:
- LC 56 — Merge Intervals
- LC 57 — Insert Interval
- LC 1288 — Remove Covered Intervals
## Common Form 2: Insert an Interval
Use this when sorted, non-overlapping intervals receive one new interval.
**How it works:**
1. Add intervals that end before the new interval begins.
2. Merge every interval that overlaps the new interval.
3. Add the final merged interval.
4. Add all remaining intervals.
**Memory flow:** `Add before → Merge overlap → Add after`
```java
List<int[]> answer = new ArrayList<>();
int i = 0;

while (i < intervals.length && intervals[i][1] < newInterval[0])
    answer.add(intervals[i++]);

while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
}
answer.add(newInterval);

while (i < intervals.length) answer.add(intervals[i++]);
```
Practice:
- LC 57 — Insert Interval
- LC 986 — Interval List Intersections
## Common Form 3: Interval Intersection
Use this when two sorted interval lists need their common portions.
**How it works:**
1. Keep one pointer for each list.
2. The possible intersection is `[max(starts), min(ends)]`.
3. Save it when its start is not greater than its end.
4. Move the pointer whose interval ends first.
**Memory flow:** `Find overlap → Save → Move earlier end`
```java
int i = 0, j = 0;
List<int[]> answer = new ArrayList<>();

while (i < first.length && j < second.length) {
    int start = Math.max(first[i][0], second[j][0]);
    int end = Math.min(first[i][1], second[j][1]);
    if (start <= end) answer.add(new int[]{start, end});

    if (first[i][1] < second[j][1]) i++;
    else j++;
}
```
Practice:
- LC 986 — Interval List Intersections
- LC 1229 — Meeting Scheduler
## Common Form 4: Remove Overlapping Intervals
Use this to keep the maximum number of non-overlapping intervals or remove the minimum number of conflicts.
**How it works:**
1. Sort intervals by ending point.
2. Accept the first interval.
3. Accept another only if it starts at or after the last accepted end.
4. Keeping the earliest-finishing interval leaves maximum space for future intervals.
5. Removals equal total intervals minus accepted intervals.
**Memory flow:** `Sort by end → Keep earliest finish → Leave future space`
```java
Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
int kept = 1;
int previousEnd = intervals[0][1];

for (int i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= previousEnd) {
        kept++;
        previousEnd = intervals[i][1];
    }
}
int removed = intervals.length - kept;
```
Practice:
- LC 435 — Non-overlapping Intervals
- LC 646 — Maximum Length of Pair Chain
- LC 452 — Minimum Number of Arrows to Burst Balloons
## Common Form 5: Minimum Rooms or Concurrent Resources
Use this when overlapping intervals require separate rooms, servers, platforms, workers, or machines.
**How it works:**
1. Sort intervals by start time.
2. Store ending times of active intervals in a min-heap.
3. Remove every interval that finished before the current one starts.
4. Add the current ending time.
5. The largest heap size is the maximum number of simultaneous resources.
**Memory flow:** `Sort starts → Remove finished → Add current → Track maximum`
```java
Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
PriorityQueue<Integer> ends = new PriorityQueue<>();
int answer = 0;

for (int[] interval : intervals) {
    while (!ends.isEmpty() && ends.peek() <= interval[0]) ends.poll();
    ends.offer(interval[1]);
    answer = Math.max(answer, ends.size());
}
```
Practice:
- LC 253 — Meeting Rooms II
- LC 2406 — Divide Intervals Into Minimum Number of Groups
- LC 1094 — Car Pooling
## Common Form 6: Sweep Line with Start and End Events
Use this to track how many intervals are active over time.
**How it works:**
1. Represent each start as `+1` and each end as `-1`.
2. Sort event positions.
3. Apply changes to a running count.
4. The running count is the number of active intervals.
5. Track its maximum or verify it never exceeds a capacity.
**Memory flow:** `Mark changes → Sort events → Running count`
```java
Map<Integer, Integer> events = new TreeMap<>();
for (int[] interval : intervals) {
    events.merge(interval[0], 1, Integer::sum);
    events.merge(interval[1], -1, Integer::sum);
}

int active = 0, maximum = 0;
for (int change : events.values()) {
    active += change;
    maximum = Math.max(maximum, active);
}
```
Practice:
- LC 1094 — Car Pooling
- LC 1109 — Corporate Flight Bookings
- LC 1854 — Maximum Population Year
- LC 732 — My Calendar III
## Common Form 7: Covered Intervals
Use this when one interval may be completely contained inside another.
**How it works:**
1. Sort by start ascending.
2. When starts are equal, sort by end descending so the largest interval appears first.
3. Track the farthest ending point.
4. An interval ending at or before that point is covered.
5. Otherwise, update the farthest end.
**Memory flow:** `Largest first → Track farthest end → Detect contained`
```java
Arrays.sort(intervals, (a, b) -> {
    if (a[0] == b[0]) return Integer.compare(b[1], a[1]);
    return Integer.compare(a[0], b[0]);
});

int remaining = 0;
int farthestEnd = -1;
for (int[] interval : intervals) {
    if (interval[1] > farthestEnd) {
        remaining++;
        farthestEnd = interval[1];
    }
}
```
Practice:
- LC 1288 — Remove Covered Intervals
- LC 354 — Russian Doll Envelopes
## Quick Interview Checklist
1. Are the inputs ranges with a start and end?
2. Are they already sorted?
3. Are they closed `[start,end]` or half-open `[start,end)`?
4. Does touching count as overlapping?
5. Should I sort by start, end, or start ascending with end descending?
6. Do I need to merge, intersect, remove conflicts, count concurrency, or allocate resources?
7. What does my tracked ending point represent?
8. Why is it safe to accept, discard, or merge the current interval?
### Sorting Decision Rule
```plain text
Merge intervals          → sort by start
Insert interval          → input is usually already sorted
Select maximum intervals → sort by end
Remove minimum overlaps  → sort by end
Count active intervals   → sort events or starts
Detect covered intervals → start ascending, end descending
Intersect two lists      → two pointers
```
## Common Mistakes
- Forgetting to sort or sorting by the wrong endpoint.
- Forgetting to save the final tracked interval.
- Returning an array sized to the original input rather than the result.
- Treating touching intervals incorrectly.
- Using `<` when closed intervals require `<=`.
- Moving both pointers during interval intersection.
- Keeping the later-ending interval when removing overlaps.
- Ignoring required tie-breaking rules.
- Using `a[0] - b[0]` in a comparator, which can overflow; use `Integer.compare`.
- Using a heap when a greedy scan is sufficient.
## Complexity Analysis
- Most sorting-based interval algorithms: `O(n log n)` time.
- Linear scan after sorting: `O(n)`.
- Merge or greedy scan variables: `O(1)` auxiliary space, excluding output and sorting.
- Intersection of lists of sizes `m` and `n`: `O(m + n)` time and `O(1)` auxiliary space.
- Minimum rooms with a heap: `O(n log n)` time and `O(n)` space.
- Sweep line with a sorted map: `O(n log n)` time and `O(n)` space.
---
> **Final reusable model:** Sort intervals so related ranges become neighbors, then compare their boundaries to merge, select, intersect, or count them.
```plain text
Sort → Compare boundaries → Preserve invariant → Process each interval once
```
<empty-block/>
# Linked List
A linked list stores values in nodes connected through pointers. The main challenge is changing connections without losing the remaining list.
<callout icon="🧠" color="blue_bg">
	**Core mental model:** Before changing a pointer, save every connection you will still need.
</callout>
```plain text
Save next → Change pointer → Move forward
```
## How to Identify Linked-List Patterns
Look for these signals:
- The input is a `ListNode`.
- Nodes must be reversed, removed, merged, reordered, or grouped.
- The problem asks about a cycle, middle node, nth node from the end, or intersection.
- The list should be modified in place.
> **Most important question:** What should each node’s `next` pointer reference after the operation?
## Pointer Example
To remove node `2` from `1 → 2 → 3`, make node `1` point directly to node `3`:
```java
previous.next = current.next;
```
A linked-list node is removed by changing a connection, not by shifting elements.
## Common Form 1: Basic Traversal
Use this when every node must be inspected once.
**How it works:**
1. Start a pointer at `head`.
2. Process the current node.
3. Move to `current.next`.
4. Stop when the pointer becomes `null`.
**Memory flow:** `Process current → Move next`
```java
ListNode current = head;
while (current != null) {
    // Process current.val
    current = current.next;
}
```
Practice:
- LC 1290 — Convert Binary Number in a Linked List to Integer
- LC 203 — Remove Linked List Elements
- LC 83 — Remove Duplicates from Sorted List
## Common Form 2: Dummy Node
Use a dummy node when an operation might change or remove the head.
**How it works:**
1. Create a dummy node pointing to `head`.
2. Traverse from the dummy node.
3. Modify nodes through their predecessor.
4. Return `dummy.next`, the possibly updated head.
**Memory flow:** `Dummy before head → Modify safely → Return dummy.next`
```java
ListNode dummy = new ListNode(0);
dummy.next = head;
ListNode current = dummy;

while (current.next != null) {
    if (shouldRemove(current.next)) {
        current.next = current.next.next;
    } else {
        current = current.next;
    }
}
return dummy.next;
```
Practice:
- LC 19 — Remove Nth Node From End of List
- LC 21 — Merge Two Sorted Lists
- LC 82 — Remove Duplicates from Sorted List II
- LC 203 — Remove Linked List Elements
## Common Form 3: Fast and Slow Pointers
Use this when the problem involves relative distance, the middle, or a cycle.
**How it works:**
1. Start `slow` and `fast` at the same node.
2. Move `slow` one step and `fast` two steps.
3. When `fast` reaches the end, `slow` is near the middle.
4. If they meet before the end, the list contains a cycle.
**Memory flow:** `Slow moves 1 → Fast moves 2 → Distance reveals structure`
```java
ListNode slow = head;
ListNode fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
```
Practice:
- LC 141 — Linked List Cycle
- LC 142 — Linked List Cycle II
- LC 876 — Middle of the Linked List
- LC 234 — Palindrome Linked List
- LC 143 — Reorder List
## Common Form 4: Fixed Gap Between Two Pointers
Use this to find a node relative to the end without first calculating the list’s length.
**How it works:**
1. Move `fast` ahead by the required gap.
2. Move `slow` and `fast` together.
3. When `fast` reaches the end, `slow` is the required distance from the end.
4. Use a dummy node when the target may be the head.
**Memory flow:** `Create gap → Move together → Slow finds target`
```java
ListNode dummy = new ListNode(0, head);
ListNode slow = dummy;
ListNode fast = dummy;

for (int i = 0; i <= n; i++) fast = fast.next;
while (fast != null) {
    slow = slow.next;
    fast = fast.next;
}
slow.next = slow.next.next;
return dummy.next;
```
Practice:
- LC 19 — Remove Nth Node From End of List
- LC 61 — Rotate List
- LC 1721 — Swapping Nodes in a Linked List
## Common Form 5: Reverse a Linked List
Use this when node directions or a portion of the list must be reversed.
**How it works:**
1. Save `current.next`.
2. Point `current.next` backward to `previous`.
3. Move `previous` to `current`.
4. Move `current` to the saved node.
5. When traversal ends, `previous` is the new head.
**Memory flow:** `Save next → Reverse link → Move both`
```java
ListNode previous = null;
ListNode current = head;

while (current != null) {
    ListNode next = current.next;
    current.next = previous;
    previous = current;
    current = next;
}
return previous;
```
<callout icon="✅" color="green_bg">
	**Invariant:** `previous` is the head of the reversed portion; `current` is the first node of the unreversed portion.
</callout>
Practice:
- LC 206 — Reverse Linked List
- LC 92 — Reverse Linked List II
- LC 25 — Reverse Nodes in k-Group
- LC 234 — Palindrome Linked List
## Common Form 6: Merge Two Sorted Lists
Use one pointer for each sorted list and attach the smaller current node.
**How it works:**
1. Create a dummy result node.
2. Compare the current nodes of both lists.
3. Attach the smaller node and advance its pointer.
4. Move the result tail.
5. Attach the remaining list when one becomes empty.
**Memory flow:** `Compare → Attach smaller → Advance`
```java
ListNode dummy = new ListNode(0);
ListNode tail = dummy;

while (first != null && second != null) {
    if (first.val <= second.val) {
        tail.next = first;
        first = first.next;
    } else {
        tail.next = second;
        second = second.next;
    }
    tail = tail.next;
}
tail.next = first != null ? first : second;
return dummy.next;
```
Practice:
- LC 21 — Merge Two Sorted Lists
- LC 23 — Merge k Sorted Lists
- LC 148 — Sort List
## Common Form 7: Find the Start of a Cycle
Floyd’s algorithm finds whether a cycle exists and where it begins.
**How it works:**
1. Move `slow` by one and `fast` by two until they meet.
2. Reset one pointer to `head`.
3. Move both one step at a time.
4. Their next meeting point is the cycle entrance.
**Memory flow:** `Meet inside cycle → Reset one → Move equally → Find entrance`
```java
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow == fast) {
        slow = head;
        while (slow != fast) {
            slow = slow.next;
            fast = fast.next;
        }
        return slow;
    }
}
return null;
```
Practice:
- LC 141 — Linked List Cycle
- LC 142 — Linked List Cycle II
- LC 287 — Find the Duplicate Number
## Common Form 8: Find the Intersection of Two Lists
Use this when two lists may eventually share the same node chain.
**How it works:**
1. Start one pointer at each head.
2. Move each pointer one node at a time.
3. At the end of one list, redirect it to the other list’s head.
4. Both pointers now travel the same combined distance.
5. They meet at the intersection or both become `null`.
**Memory flow:** `Walk own list → Switch heads → Equalize distance`
```java
ListNode first = headA;
ListNode second = headB;

while (first != second) {
    first = first == null ? headB : first.next;
    second = second == null ? headA : second.next;
}
return first;
```
Practice:
- LC 160 — Intersection of Two Linked Lists
## Common Form 9: Split, Reverse, and Merge
Use this when a problem combines middle-finding, reversal, and comparison or reordering.
**How it works:**
1. Find the middle with slow and fast pointers.
2. Reverse the second half.
3. Compare or merge the two halves.
4. Save both next nodes before rewiring.
5. Restore the original list if required.
**Memory flow:** `Find middle → Reverse second half → Compare or merge`
```java
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}

ListNode second = reverse(slow);
ListNode first = head;
while (second != null) {
    ListNode nextFirst = first.next;
    ListNode nextSecond = second.next;
    first.next = second;
    second.next = nextFirst;
    first = nextFirst;
    second = nextSecond;
}
```
Practice:
- LC 143 — Reorder List
- LC 234 — Palindrome Linked List
- LC 2130 — Maximum Twin Sum of a Linked List
## Quick Interview Checklist
1. Can the head change?
2. Would a dummy node remove a special case?
3. Do I need the current node or the node before it?
4. Which pointer am I changing, and have I saved its original `next`?
5. Do I need traversal, slow/fast, a fixed gap, reversal, or merging?
6. What does each pointer represent?
7. What portion is already completed?
8. Could the rewiring accidentally create a cycle?
9. Must the original list be restored?
### Technique Decision Rule
```plain text
Inspect every node          → basic traversal
Head may change             → dummy node
Find middle or cycle        → slow and fast
Find nth node from end      → fixed pointer gap
Change direction            → reversal
Combine sorted lists        → dummy + merge pointers
Find intersection           → switch heads
Reorder or palindrome       → middle + reverse + merge/compare
```
## Common Mistakes
- Accessing `node.next` before checking whether the node is `null`.
- Changing `current.next` before saving the remainder of the list.
- Returning `head` when the head may have changed instead of `dummy.next` or the new head.
- Moving the predecessor immediately after deleting its next node.
- Comparing values when node identity is required.
- Using an unsafe fast-pointer condition instead of `fast != null && fast.next != null`.
- Creating an accidental cycle while merging or reordering.
- Reversing too many or too few nodes in a partial reversal.
- Forgetting to reconnect a reversed section.
- Ignoring empty and single-node inputs.
## Complexity Analysis
- Basic traversal, reversal, and slow/fast pointers: `O(n)` time and `O(1)` space.
- Merge lists of lengths `m` and `n`: `O(m + n)` time and `O(1)` auxiliary space.
- Recursive traversal or reversal: `O(n)` time and `O(n)` call-stack space.
- Merge `k` sorted lists containing `N` total nodes with a heap: `O(N log k)` time and `O(k)` space.
---
> **Final reusable model:** Save the connections you still need, change one link at a time, and maintain a clear meaning for every pointer.
```plain text
Understand pointer roles → Save required links → Rewire safely → Move forward
```
<empty-block/>
# Matrix Manipulation
A matrix is a two-dimensional grid where each element is identified by `matrix[row][column]`.
<callout icon="🧠" color="blue_bg">
	**Core mental model:** First decide how cells are related, then define the order in which they should be visited or modified.
</callout>
```plain text
Understand coordinates → Choose traversal order → Protect boundaries → Preserve required information
```
## How to Identify Matrix-Manipulation Problems
Look for these signals:
- The input is a two-dimensional array or grid.
- The problem mentions rows, columns, neighbors, diagonals, rotation, or reflection.
- A cell’s result depends on its position or nearby cells.
- The matrix must be traversed or modified in place.
> **Most important questions:** In what order should I visit the cells? If I modify a cell now, will I destroy information needed later?
## Coordinate Mental Model
For a matrix with `rows × columns`:
```plain text
valid row    = 0 to rows - 1
valid column = 0 to columns - 1
```
```java
boolean valid = row >= 0
    && row < matrix.length
    && column >= 0
    && column < matrix[0].length;
```
For `[[1,2,3],[4,5,6]]`, `matrix[0][2] = 3` and `matrix[1][1] = 5`.
## Common Form 1: Standard Row and Column Traversal
Use this when every cell must be processed independently.
**How it works:**
1. The outer loop chooses a row.
2. The inner loop visits every column in that row.
3. Process `matrix[row][column]`.
4. Continue until every cell has been visited.
**Memory flow:** `Choose row → Visit columns → Process cell`
```java
int rows = matrix.length;
int columns = matrix[0].length;

for (int row = 0; row < rows; row++) {
    for (int column = 0; column < columns; column++) {
        int value = matrix[row][column];
        // Process value.
    }
}
```
Column-first traversal:
```java
for (int column = 0; column < columns; column++) {
    for (int row = 0; row < rows; row++) {
        // Process matrix[row][column].
    }
}
```
Practice:
- LC 1572 — Matrix Diagonal Sum
- LC 1672 — Richest Customer Wealth
- LC 766 — Toeplitz Matrix
- LC 867 — Transpose Matrix
## Common Form 2: Direction-Array Traversal
Use this when a cell must inspect or interact with surrounding cells.
**How it works:**
1. Store every allowed movement in a direction array.
2. Add each direction to the current coordinates.
3. Check whether the new coordinates are inside the matrix.
4. Process only valid neighbors.
5. Include diagonal directions only when the problem permits them.
**Memory flow:** `Current cell → Apply direction → Validate → Process neighbor`
Four-directional movement:
```java
int[][] directions = {
    {1, 0},
    {-1, 0},
    {0, 1},
    {0, -1}
};

for (int[] direction : directions) {
    int nextRow = row + direction[0];
    int nextColumn = column + direction[1];

    if (nextRow >= 0
            && nextRow < matrix.length
            && nextColumn >= 0
            && nextColumn < matrix[0].length) {
        // Process the valid neighbor.
    }
}
```
For eight-directional movement, also include `{-1,-1}`, `{-1,1}`, `{1,-1}`, and `{1,1}`.
Practice:
- LC 733 — Flood Fill
- LC 200 — Number of Islands
- LC 994 — Rotting Oranges
- LC 1091 — Shortest Path in Binary Matrix
- LC 130 — Surrounded Regions
## Common Form 3: Rotate a Square Matrix
Use this when a square matrix must be rotated in place.
```plain text
Clockwise rotation        = transpose + reverse every row
Counterclockwise rotation = transpose + reverse every column
```
**How it works:**
1. Transpose the matrix by swapping `matrix[row][column]` with `matrix[column][row]`.
2. Process only cells above the diagonal so each pair is swapped once.
3. Reverse every row.
4. The combined transformation rotates the matrix 90 degrees clockwise.
**Memory flow:** `Transpose → Reverse rows → Rotate clockwise`
Small example:
```plain text
Original      Transpose     Reverse rows
1 2 3         1 4 7         7 4 1
4 5 6    →    2 5 8    →    8 5 2
7 8 9         3 6 9         9 6 3
```
```java
int n = matrix.length;

// Transpose.
for (int row = 0; row < n; row++) {
    for (int column = row + 1; column < n; column++) {
        int temporary = matrix[row][column];
        matrix[row][column] = matrix[column][row];
        matrix[column][row] = temporary;
    }
}

// Reverse every row.
for (int row = 0; row < n; row++) {
    int left = 0;
    int right = n - 1;

    while (left < right) {
        int temporary = matrix[row][left];
        matrix[row][left] = matrix[row][right];
        matrix[row][right] = temporary;
        left++;
        right--;
    }
}
```
Starting the transpose column at `row + 1` prevents swapping every pair twice.
Practice:
- LC 48 — Rotate Image
- LC 1886 — Determine Whether Matrix Can Be Obtained by Rotation
## Quick Interview Checklist
1. What do `row` and `column` represent?
2. Is the matrix rectangular or square?
3. In what order should cells be visited?
4. Does every cell need to be processed?
5. Which directions are allowed?
6. Are diagonal movements allowed?
7. Are the new coordinates inside the matrix?
8. Can I safely modify the matrix during traversal?
9. Do I need the original value later?
10. Can the operation be decomposed into transpose, reverse, or swap steps?
### Technique Decision Rule
```plain text
Process every cell       → nested row/column loops
Inspect nearby cells     → direction array + boundary check
Rotate clockwise        → transpose + reverse rows
Rotate counterclockwise → transpose + reverse columns
```
## Common Mistakes
- Confusing `matrix.length` (rows) with `matrix[0].length` (columns).
- Assuming every matrix is square.
- Using the row count for both dimensions.
- Accessing a neighbor before checking its boundaries.
- Mixing four-directional and eight-directional movement.
- Modifying a cell before preserving information needed later.
- Swapping every transpose pair twice.
- Beginning the transpose inner loop at `0` instead of `row + 1`.
- Applying in-place square rotation to a rectangular matrix.
- Reversing columns instead of rows for clockwise rotation.
## Complexity Analysis
For `m` rows and `n` columns:
- Standard full traversal: `O(m × n)` time and `O(1)` auxiliary space.
- Direction-array processing: normally `O(m × n)` because each cell checks a constant number of neighbors.
- Transposing a square matrix in place: `O(n²)` time and `O(1)` space.
- Rotating a square matrix in place: `O(n²)` time and `O(1)` space.
---
> **Final reusable model:** Define the coordinate meaning, choose the traversal order, validate every movement, and preserve information before modifying cells.
```plain text
Define coordinates → Choose traversal → Check boundaries → Modify safely
```
# Binary Search
Binary search is not simply “searching inside a sorted array.”
The deeper idea is:
> Find a boundary in a search space where the answer changes from one state to another.
At every step, binary search uses information at `mid` to permanently eliminate half of the remaining candidates.
## Core Mental Model
```plain text
Define the search space
→ Inspect mid
→ Prove which half is impossible
→ Keep the half containing the answer
```
The most important part is not calculating `mid`. It is proving why one half can be discarded.
```plain text
false false false | true true true
                  ↑ boundary
```
## How to Identify Binary-Search Problems
Look for these signals:
- The input is sorted, rotated-sorted, or has a directional shape.
- You need an exact value, first/last occurrence, or first/last valid candidate.
- The answer lies in an ordered numeric range.
- A feasibility condition changes monotonically.
- The problem asks to minimize the maximum or maximize the minimum.
> **Most important question:** If I test one candidate, can I prove that every candidate on one side is impossible?
## Small Intuition Example
```plain text
nums = [2, 4, 7, 11, 15]
target = 11

[2, 4, 7, 11, 15]
 L      M       R
```
`nums[mid] = 7`, which is smaller than `11`. Because the array is sorted, everything left of `mid` is also at most `7`. None of those values can be `11`.
> Moving `low` to `mid + 1` is safe because `mid` and everything before it are too small.
## Binary Search Vocabulary
```java
int mid = low + (high - low) / 2;
```
Prefer this over `(low + high) / 2` because `low + high` could overflow.
<callout icon="✅" color="green_bg">
	**Search-space invariant:** Before every iteration, if the answer exists, it is inside the current search space. Every update must preserve this statement.
</callout>
## Common Form 1: Exact-Value Search
Use this to find one exact target in a sorted collection.
**How it works:**
1. Search the inclusive range `[low, high]`.
2. Compare `nums[mid]` with `target`.
3. Return immediately when they are equal.
4. If `mid` is too small, discard `mid` and everything left of it.
5. If `mid` is too large, discard `mid` and everything right of it.
**Memory flow:** `Compare → Discard mid and one half → Find exact value`
```java
int low = 0, high = nums.length - 1;
while (low <= high) {
    int mid = low + (high - low) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
}
return -1;
```
`low <= high` is used because `[low, high]` is inclusive. When `low == high`, one candidate still remains. We use `mid + 1` and `mid - 1` because `mid` has already been checked.
Practice:
- LC 704 — Binary Search
- LC 374 — Guess Number Higher or Lower
- LC 367 — Valid Perfect Square
- LC 69 — Sqrt(x)
## Common Form 2: First Position Satisfying a Condition
Use this for the first occurrence, first value greater than or equal to a target, first valid candidate, or minimum feasible answer.
```plain text
false false false | true true true
                  ↑ first true
```
**How it works:**
1. Keep a search space that may contain the first valid candidate.
2. If `mid` is valid, keep it and search further left.
3. If `mid` is invalid, discard it and search right.
4. Stop when one candidate remains.
5. That candidate is the first valid position.
**Memory flow:** `Valid → Keep mid and go left | Invalid → Remove mid and go right`
```java
int low = 0, high = nums.length;
while (low < high) {
    int mid = low + (high - low) / 2;
    if (condition(mid)) high = mid;
    else low = mid + 1;
}
return low;
```
This uses the half-open range `[low, high)`. `high = nums.length` can represent that no valid array element was found.
Lower bound uses `condition(mid) = nums[mid] >= target`.
Practice:
- LC 35 — Search Insert Position
- LC 278 — First Bad Version
- LC 744 — Find Smallest Letter Greater Than Target
- LC 34 — Find First and Last Position
## Common Form 3: Last Position Satisfying a Condition
Use this for the last occurrence, last valid candidate, maximum feasible answer, or greatest value less than or equal to a target.
```plain text
true true true | false false false
             ↑ last true
```
**How it works:**
1. If `mid` is valid, keep it and search right.
2. If invalid, discard it and search left.
3. Use the upper middle when assigning `low = mid` so the loop always progresses.
**Memory flow:** `Valid → Keep mid and go right | Invalid → Remove mid and go left`
```java
int low = 0, high = nums.length - 1;
while (low < high) {
    int mid = low + (high - low + 1) / 2;
    if (condition(mid)) low = mid;
    else high = mid - 1;
}
return low;
```
Practice:
- LC 34 — Find First and Last Position
- LC 658 — Find K Closest Elements
- LC 1552 — Magnetic Force Between Two Balls
- LC 1802 — Maximum Value at a Given Index
## Common Form 4: Search in a Rotated Sorted Array
A rotated array has two sorted sections; at least one side around `mid` is sorted.
**How it works:**
1. Check whether `mid` is the target.
2. Identify the sorted half.
3. Check whether the target lies inside that half’s boundaries.
4. Keep it if yes; otherwise search the other half.
**Memory flow:** `Find sorted half → Check target range → Keep correct half`
```java
int low = 0, high = nums.length - 1;
while (low <= high) {
    int mid = low + (high - low) / 2;
    if (nums[mid] == target) return mid;

    if (nums[low] <= nums[mid]) {
        if (nums[low] <= target && target < nums[mid]) high = mid - 1;
        else low = mid + 1;
    } else {
        if (nums[mid] < target && target <= nums[high]) low = mid + 1;
        else high = mid - 1;
    }
}
return -1;
```
Practice:
- LC 33 — Search in Rotated Sorted Array
- LC 81 — Search in Rotated Sorted Array II
- LC 153 — Find Minimum in Rotated Sorted Array
- LC 154 — Find Minimum in Rotated Sorted Array II
## Common Form 5: Minimum or Peak Using Direction
Use this when the array is not globally sorted but its shape tells you which side contains a minimum or peak.
**How it works:**
1. Compare `mid` with a useful neighbor or boundary.
2. Decide whether the sequence is rising, falling, or crossing the rotation.
3. Preserve `mid` when it may still be the answer.
4. Continue until one candidate remains.
**Memory flow:** `Read direction → Keep promising side → Converge`
Rotated minimum:
```java
int low = 0, high = nums.length - 1;
while (low < high) {
    int mid = low + (high - low) / 2;
    if (nums[mid] > nums[high]) low = mid + 1;
    else high = mid;
}
return nums[low];
```
Peak element:
```java
int low = 0, high = nums.length - 1;
while (low < high) {
    int mid = low + (high - low) / 2;
    if (nums[mid] < nums[mid + 1]) low = mid + 1;
    else high = mid;
}
return low;
```
Practice:
- LC 153 — Find Minimum in Rotated Sorted Array
- LC 162 — Find Peak Element
- LC 852 — Peak Index in a Mountain Array
- LC 1095 — Find in Mountain Array
## Common Form 6: Binary Search on the Answer
Use this when the answer is a number inside a range rather than an array index. Common wording includes minimum capacity, minimum speed, minimum days, maximum distance, smallest acceptable limit, or largest feasible value.
**How it works:**
1. Define the minimum and maximum possible answers.
2. Test whether `mid` is feasible.
3. If feasible, keep it and search for a smaller answer.
4. If infeasible, discard it and every smaller value.
5. Stop at the minimum feasible answer.
**Memory flow:** `Guess answer → Check feasibility → Keep valid boundary`
```java
int low = minimumPossible;
int high = maximumPossible;
while (low < high) {
    int mid = low + (high - low) / 2;
    if (canSolve(mid)) high = mid;
    else low = mid + 1;
}
return low;
```
Example feasibility for Koko Eating Bananas:
```java
private boolean canEat(int[] piles, int hours, int speed) {
    long requiredHours = 0;
    for (int pile : piles) {
        requiredHours += (pile + speed - 1L) / speed;
    }
    return requiredHours <= hours;
}
```
Practice:
- LC 875 — Koko Eating Bananas
- LC 1011 — Capacity to Ship Packages Within D Days
- LC 410 — Split Array Largest Sum
- LC 1482 — Minimum Number of Days to Make m Bouquets
- LC 1552 — Magnetic Force Between Two Balls
- LC 1760 — Minimum Limit of Balls in a Bag
- LC 2187 — Minimum Time to Complete Trips
## Common Form 7: Binary Search on a Matrix
Choose the method from the matrix’s exact ordering guarantee.
### Form 7A: Matrix Behaves Like One Sorted Array
Use this when rows are sorted and each row begins after the previous row ends.
**How it works:**
1. Treat the matrix as a virtual array of length `rows × columns`.
2. Binary-search a virtual index.
3. Convert it using `row = mid / columns` and `column = mid % columns`.
4. Perform a normal exact-value comparison.
**Memory flow:** `Virtual index → Convert coordinates → Normal binary search`
```java
int rows = matrix.length, columns = matrix[0].length;
int low = 0, high = rows * columns - 1;
while (low <= high) {
    int mid = low + (high - low) / 2;
    int row = mid / columns;
    int column = mid % columns;
    int value = matrix[row][column];
    if (value == target) return true;
    if (value < target) low = mid + 1;
    else high = mid - 1;
}
return false;
```
Practice:
- LC 74 — Search a 2D Matrix
### Form 7B: Independently Sorted Rows and Columns
Use this when every row and column is sorted but the matrix is not globally ordered.
**How it works:**
1. Start at the top-right cell.
2. Move left when the value is too large.
3. Move down when it is too small.
4. Each move eliminates an entire column or row.
5. Alternatively, binary-search each row in `O(rows × log columns)`.
**Memory flow:** `Check guarantee → Eliminate row or column → Move`
```java
int row = 0, column = matrix[0].length - 1;
while (row < matrix.length && column >= 0) {
    if (matrix[row][column] == target) return true;
    if (matrix[row][column] > target) column--;
    else row++;
}
return false;
```
```plain text
LC 74  → globally sorted → virtual 1D binary search
LC 240 → rows and columns independently sorted → staircase search
```
Practice:
- LC 240 — Search a 2D Matrix II
- LC 1351 — Count Negative Numbers in a Sorted Matrix
- LC 378 — Kth Smallest Element in a Sorted Matrix
## Common Form 8: Binary Search on a Partition
Use this when sorted collections must be divided into valid left and right portions.
**How it works:**
1. Binary-search how many elements to take from the smaller array.
2. Derive the second partition from the required left-side size.
3. Inspect values immediately around both partitions.
4. Accept when every left value is no greater than every right value.
5. Otherwise move the first partition left or right.
**Memory flow:** `Choose partition 1 → Derive partition 2 → Validate boundaries`
```java
int partition1 = low + (high - low) / 2;
int partition2 = totalLeftSize - partition1;
int left1 = partition1 == 0 ? Integer.MIN_VALUE : nums1[partition1 - 1];
int right1 = partition1 == nums1.length ? Integer.MAX_VALUE : nums1[partition1];
int left2 = partition2 == 0 ? Integer.MIN_VALUE : nums2[partition2 - 1];
int right2 = partition2 == nums2.length ? Integer.MAX_VALUE : nums2[partition2];

boolean valid = left1 <= right2 && left2 <= right1;
```
Movement:
- `left1 > right2` → partition 1 is too far right.
- `left2 > right1` → partition 1 is too far left.
Practice:
- LC 4 — Median of Two Sorted Arrays
## Choosing `low < high` or `low <= high`
### Use `while (low <= high)`
Use this when the range is inclusive, you are looking for an exact target, and `mid` is completely discarded after checking it. The loop ends when `low > high`, meaning no candidates remain.
### Use `while (low < high)`
Use this when converging to a boundary and `mid` may still be the answer. The loop ends when `low == high`, meaning exactly one candidate remains.
```plain text
Exact value, return inside loop → low <= high
Boundary, return after loop     → low < high

Use (low <= high)
low = mid + 1;
high = mid - 1;  


Use (low < high)
high = mid;
low = mid + 1;
```
## Quick Interview Checklist
1. What exactly is the search space?
2. Is it an index range or a range of possible answers?
3. Is it inclusive or half-open?
4. What condition is tested at `mid`?
5. Is that condition monotonic?
6. Am I finding an exact value, first true, last true, minimum feasible, or maximum feasible?
7. Can `mid` still be the answer?
8. Why is the discarded half impossible?
9. If assigning `low = mid`, do I need the upper middle?
10. Can any calculation overflow?
11. Is the feasibility check efficient enough?
### Binary-Search Decision Rule
```plain text
Exact target                    → inclusive classic search
First value >= target           → lower bound / first true
Last value <= target            → last true
Minimum feasible answer         → first true on answer space
Maximum feasible answer         → last true on answer space
Rotated target search           → identify sorted half
Rotated minimum                 → compare mid with high
Peak element                    → compare mid with mid + 1
Globally ordered matrix         → virtual 1D search
Independently sorted matrix     → staircase or per-row search
Two sorted-array median         → binary search on partition
```
## Common Mistakes
- Using binary search without a monotonic condition.
- Mixing inclusive and half-open boundary rules.
- Using `high = mid` after proving `mid` impossible.
- Using `high = mid - 1` when `mid` may still be the answer.
- Creating an infinite loop with `low = mid` and a lower middle.
- Accessing `mid - 1` or `mid + 1` without boundary protection.
- Searching a rotated array without identifying the sorted half.
- Using an aggregate shortcut instead of accurately simulating feasibility.
- Starting an answer search at an impossible value such as capacity `0`.
- Confusing the ordering guarantees of LC 74 and LC 240.
- Returning `mid` after a boundary search instead of the converged boundary.
- Ignoring integer overflow.
## Complexity Analysis
- Classic search: `O(log n)` time and `O(1)` space.
- Boundary search: `O(log n)` time and `O(1)` space.
- Answer search: `O(feasibilityCost × log(answerRange))`.
- Globally sorted matrix: `O(log(rows × columns))` time and `O(1)` space.
- Staircase matrix search: `O(rows + columns)` time and `O(1)` space.
- Per-row matrix binary search: `O(rows × log columns)`.
- Median of two sorted arrays: `O(log(min(m,n)))` time and `O(1)` space.
---
> **Final reusable model:** Binary search works when testing one candidate gives enough information to permanently eliminate half of an ordered search space.
```plain text
Define search space → Define monotonic condition → Test mid 
→ Eliminate half → Preserve candidate
```
> Before moving a boundary, complete: “I can discard this half because __.”<br>If you cannot prove that statement, the binary-search movement is not yet justified.
<empty-block/>
<empty-block/>
# Top K Elements
The Top K Elements pattern finds the largest, smallest, most frequent, closest, or highest-priority `k` items without fully sorting all `n` items.
The key idea is:
> If you only need `k` elements, avoid doing unnecessary work on all `n` elements.
A heap is the most common tool because it can maintain the best `k` candidates seen so far.
## Core Mental Model
For the `k` largest elements, maintain a **min-heap of size ****`k`**:
```plain text
The heap contains the k largest values seen so far.
The smallest among those k values stays at the top.
```
When a better candidate arrives:
```plain text
Add candidate
→ If size exceeds k, remove the weakest candidate
```
For the `k` smallest elements, use a **max-heap of size ****`k`**.
```plain text
Top K largest  → min-heap
Top K smallest → max-heap
```
This often feels reversed, but the heap’s root must represent the candidate you want to remove.
## How to Identify Top K Problems
Look for these signals:
- The question explicitly asks for top `k`, kth largest or kth smallest, `k` most frequent, `k` closest, or `k` highest priority.
- You need only part of the sorted result.
- Sorting the complete input would do unnecessary work.
- Elements arrive continuously and the current kth result must be maintained.
- Multiple sorted collections need to be processed in sorted order.
- The answer depends on a score such as value, frequency, distance, profit, or priority.
### Most important recognition question
> Do I need the complete sorted order, or only the best `k` candidates?
If only `k` candidates matter, consider a heap, bucket sort, or quickselect.
## Intuition Example
Find the three largest values:
```plain text
nums = [7, 2, 9, 4, 8]
k = 3
```
Maintain a min-heap of size `3`:
```plain text
Add 7 → [7]
Add 2 → [2,7]
Add 9 → [2,7,9]

Add 4 → [2,4,7,9]
Remove smallest 2
Heap contains [4,7,9]

Add 8 → [4,7,8,9]
Remove smallest 4
Heap contains [7,8,9]
```
The heap contains the three largest values.
The root is `7`, which is also the third-largest value.
## Common Form 1: Keep the Best K Elements with a Heap
Use this when every element has a score and only the best `k` elements are needed.
### How it works
1. Examine each element.
2. Add it to a heap.
3. If the heap grows beyond size `k`, remove its root.
4. Choose the heap direction so the root is the weakest accepted candidate.
5. After processing everything, the heap contains the best `k` elements.
**Memory flow:** `Add candidate → Remove weakest → Keep best k`
### K largest using a min-heap
```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

for (int num : nums) {
    minHeap.offer(num);

    if (minHeap.size() > k) {
        minHeap.poll();
    }
}
```
### K smallest using a max-heap
```java
PriorityQueue<Integer> maxHeap =
    new PriorityQueue<>(Collections.reverseOrder());

for (int num : nums) {
    maxHeap.offer(num);

    if (maxHeap.size() > k) {
        maxHeap.poll();
    }
}
```
### Heap decision rule
```plain text
Keep k largest  → remove smallest → min-heap
Keep k smallest → remove largest  → max-heap
```
Practice:
- LC 215 — Kth Largest Element in an Array
- LC 973 — K Closest Points to Origin
- LC 1046 — Last Stone Weight
- LC 703 — Kth Largest Element in a Stream
- LC 2558 — Take Gifts From the Richest Pile
## Common Form 2: Top K Frequent Elements Using a Heap
Use this when elements must first be ranked by frequency.
The values themselves are not the priority—their frequencies are.
### How it works
1. Count every element’s frequency using a HashMap.
2. Add unique elements to a min-heap ordered by frequency.
3. If the heap size exceeds `k`, remove the least frequent element.
4. After processing all unique values, the heap contains the `k` most frequent.
5. Extract those values into the result.
**Memory flow:** `Count frequencies → Heap by frequency → Remove least frequent`
```java
Map<Integer, Integer> frequency = new HashMap<>();

for (int num : nums) {
    frequency.put(
        num,
        frequency.getOrDefault(num, 0) + 1
    );
}

PriorityQueue<Integer> minHeap =
    new PriorityQueue<>(
        (a, b) -> Integer.compare(
            frequency.get(a),
            frequency.get(b)
        )
    );

for (int num : frequency.keySet()) {
    minHeap.offer(num);

    if (minHeap.size() > k) {
        minHeap.poll();
    }
}

int[] answer = new int[k];

for (int i = k - 1; i >= 0; i--) {
    answer[i] = minHeap.poll();
}
```
Practice:
- LC 347 — Top K Frequent Elements
- LC 692 — Top K Frequent Words
- LC 451 — Sort Characters By Frequency
## Common Form 3: Top K Frequent Elements Using Buckets
Use bucket sort when the ranking value—usually frequency—has a small known range.
An element in an array of length `n` can appear at most `n` times.
Therefore, create buckets indexed by frequency:
```plain text
bucket[frequency] = elements having that frequency
```
### How it works
1. Count each value’s frequency.
2. Create `n + 1` frequency buckets.
3. Place each unique value into the bucket matching its frequency.
4. Traverse buckets from highest frequency to lowest.
5. Stop after collecting `k` elements.
**Memory flow:** `Count → Group by frequency → Read buckets backward`
```java
Map<Integer, Integer> frequency = new HashMap<>();

for (int num : nums) {
    frequency.put(
        num,
        frequency.getOrDefault(num, 0) + 1
    );
}

List<Integer>[] buckets = new List[nums.length + 1];

for (Map.Entry<Integer, Integer> entry
        : frequency.entrySet()) {

    int value = entry.getKey();
    int count = entry.getValue();

    if (buckets[count] == null) {
        buckets[count] = new ArrayList<>();
    }

    buckets[count].add(value);
}

int[] answer = new int[k];
int index = 0;

for (int count = buckets.length - 1;
        count >= 0 && index < k;
        count--) {

    if (buckets[count] == null) {
        continue;
    }

    for (int value : buckets[count]) {
        answer[index++] = value;

        if (index == k) {
            break;
        }
    }
}
```
Practice:
- LC 347 — Top K Frequent Elements
- LC 451 — Sort Characters By Frequency
- LC 692 — Top K Frequent Words
## Common Form 4: Quickselect
Use quickselect when finding the kth element in an unsorted array and average `O(n)` time is preferred.
Quickselect uses quicksort’s partition step but explores only the side containing the required index.
### How it works
1. Choose a pivot.
2. Partition the array so the pivot reaches its final sorted position.
3. Compare the pivot index with the target index.
4. If equal, return the pivot.
5. Otherwise, continue into only the relevant partition.
**Memory flow:** `Partition → Check pivot index → Search one side`
For the kth largest value:
```plain text
Target sorted index = nums.length - k
```
```java
int targetIndex = nums.length - k;
int low = 0;
int high = nums.length - 1;

while (low <= high) {
    int pivotIndex = partition(nums, low, high);

    if (pivotIndex == targetIndex) {
        return nums[pivotIndex];
    }

    if (pivotIndex < targetIndex) {
        low = pivotIndex + 1;
    } else {
        high = pivotIndex - 1;
    }
}
```
Partition template:
```java
private int partition(int[] nums, int low, int high) {
    int pivot = nums[high];
    int write = low;

    for (int current = low; current < high; current++) {
        if (nums[current] <= pivot) {
            swap(nums, current, write);
            write++;
        }
    }

    swap(nums, write, high);
    return write;
}
```
Randomizing the pivot helps avoid consistently bad partitions.
Practice:
- LC 215 — Kth Largest Element in an Array
- LC 973 — K Closest Points to Origin
- LC 347 — Top K Frequent Elements
## Common Form 5: K Closest Elements
Use this when candidates are ranked by distance rather than their original value.
Examples:
- Points closest to the origin
- Values closest to a target
- Locations closest to a user
To keep the `k` closest candidates, use a max-heap containing their distances.
The farthest currently accepted candidate stays at the root and is removed when a closer one arrives.
### How it works
1. Calculate each candidate’s distance or comparison score.
2. Add it to a max-heap.
3. If the heap exceeds size `k`, remove the farthest candidate.
4. Continue until every candidate has been processed.
5. The heap now contains the `k` closest candidates.
**Memory flow:** `Calculate distance → Add → Remove farthest`
```java
PriorityQueue<int[]> maxHeap =
    new PriorityQueue<>((a, b) ->
        Long.compare(distance(b), distance(a))
    );

for (int[] point : points) {
    maxHeap.offer(point);

    if (maxHeap.size() > k) {
        maxHeap.poll();
    }
}
```
For a point `(x, y)`, compare squared distance:
```java
long distance = (long) x * x + (long) y * y;
```
There is no need to calculate the square root because squared distances preserve the same ordering.
Practice:
- LC 973 — K Closest Points to Origin
- LC 658 — Find K Closest Elements
- LC 1779 — Find Nearest Point That Has the Same X or Y Coordinate
## Common Form 6: Streaming Top K
Use this when values arrive one at a time and the current kth result must be available after every insertion.
### How it works
1. Maintain a heap as object state.
2. Add each incoming value.
3. Remove the weakest candidate whenever the heap exceeds `k`.
4. The root always represents the current kth-ranked value.
5. There is no need to reprocess earlier elements.
**Memory flow:** `Receive value → Update heap → Root is current kth`
```java
class KthLargest {
    private final PriorityQueue<Integer> minHeap;
    private final int k;

    public KthLargest(int k, int[] nums) {
        this.k = k;
        this.minHeap = new PriorityQueue<>();

        for (int num : nums) {
            add(num);
        }
    }

    public int add(int value) {
        minHeap.offer(value);

        if (minHeap.size() > k) {
            minHeap.poll();
        }

        return minHeap.peek();
    }
}
```
Practice:
- LC 703 — Kth Largest Element in a Stream
- LC 295 — Find Median from Data Stream
- LC 1825 — Finding MK Average
## Common Form 7: K-Way Merge with a Heap
Use this when multiple collections are already sorted and you need their combined order or kth result.
Examples:
- Merge `k` sorted linked lists
- Find the kth smallest matrix value
- Find the smallest range containing values from multiple lists
The heap contains the next available candidate from each collection.
### How it works
1. Add the first candidate from each sorted collection to a min-heap.
2. Remove the smallest candidate.
3. Add the next candidate from the same collection.
4. Repeat until enough elements have been processed.
5. The heap never needs more than one active candidate per collection.
**Memory flow:** `One candidate per source → Remove smallest → Add its successor`
Example node for sorted arrays:
```java
class Entry {
    int value;
    int list;
    int index;

    Entry(int value, int list, int index) {
        this.value = value;
        this.list = list;
        this.index = index;
    }
}
```
```java
PriorityQueue<Entry> minHeap =
    new PriorityQueue<>(
        (a, b) -> Integer.compare(a.value, b.value)
    );

for (int list = 0; list < lists.size(); list++) {
    if (!lists.get(list).isEmpty()) {
        minHeap.offer(
            new Entry(lists.get(list).get(0), list, 0)
        );
    }
}

while (!minHeap.isEmpty()) {
    Entry current = minHeap.poll();

    int nextIndex = current.index + 1;

    if (nextIndex < lists.get(current.list).size()) {
        minHeap.offer(
            new Entry(
                lists.get(current.list).get(nextIndex),
                current.list,
                nextIndex
            )
        );
    }
}
```
Practice:
- LC 23 — Merge k Sorted Lists
- LC 378 — Kth Smallest Element in a Sorted Matrix
- LC 373 — Find K Pairs with Smallest Sums
- LC 632 — Smallest Range Covering Elements from K Lists
## Choosing the Correct Approach
```plain text
Need top k from arbitrary values       → size-k heap
Need kth value only                    → heap or quickselect
Need top k by frequency                → frequency map + heap/buckets
Frequency range is bounded by n        → bucket sort
Need average O(n) kth selection        → quickselect
Values arrive continuously             → persistent size-k heap
Multiple inputs are already sorted     → k-way merge heap
Need complete sorted order             → normal sorting
```
## Heap Direction Rule
Ask:
> Which accepted candidate should be removed when a better one arrives?
```plain text
Keep largest values  → remove smallest → min-heap
Keep smallest values → remove largest  → max-heap
Keep closest values  → remove farthest → max-heap by distance
Keep frequent values → remove least frequent → min-heap by frequency
```
## Quick Interview Checklist
1. Do I need all elements sorted or only `k` of them?
2. Am I finding top `k`, bottom `k`, kth largest, or kth smallest?
3. What determines an element’s rank?
4. Which candidate should be removed when the heap exceeds `k`?
5. Should the heap be a min-heap or max-heap?
6. Can frequency buckets replace the heap?
7. Is average `O(n)` quickselect acceptable?
8. Must the answer itself be sorted?
9. Are values arriving as a stream?
10. Are the input collections already sorted?
11. Can comparator arithmetic overflow?
12. Are duplicate elements treated independently?
## Common Mistakes
- Using a max-heap for the `k` largest elements without understanding the resulting complexity.
- Choosing heap direction based on what you want to keep instead of what you need to remove.
- Allowing the heap to grow to size `n` when only `k` elements are required.
- Returning the heap’s root as the largest value when it actually represents the kth largest.
- Forgetting to build a frequency map before ranking by frequency.
- Calling `buckets.get(index)` on an `ArrayList` whose positions were never initialized.
- Incrementing instead of decrementing while extracting a bucket.
- Assuming Java’s `PriorityQueue` returns elements in fully sorted order.
- Using subtraction in comparators:
```java
b.frequency - a.frequency
```
Prefer:
```java
Integer.compare(b.frequency, a.frequency)
```
- Calculating squared distance with `int` and causing overflow.
- Using deterministic quickselect pivots on already adversarial input.
- Forgetting that quickselect modifies the input array.
- Sorting the final heap output only when the problem actually requires ordered output.
## Complexity Analysis
### Complete sorting
```plain text
Time:  O(n log n)
Space: depends on sorting implementation
```
### Size-k heap
Each element may perform a heap operation costing `O(log k)`:
```plain text
Time:  O(n log k)
Space: O(k)
```
This is especially useful when:
```plain text
k << n
```
### Frequency map and size-k heap
Let `u` be the number of unique values:
```plain text
Frequency counting: O(n)
Heap processing:    O(u log k)

Total: O(n + u log k)
Space: O(u + k)
```
### Bucket sort by frequency
```plain text
Time:  O(n)
Space: O(n)
```
### Quickselect
```plain text
Average time: O(n)
Worst time:   O(n²)
Space:        O(1) iterative, excluding randomization
```
Randomized pivot selection makes repeated worst-case partitions unlikely.
### K-way merge
For `N` total elements across `k` sorted collections:
```plain text
Time:  O(N log k)
Space: O(k)
```
If only the first `x` elements are required:
```plain text
Time: O(x log k)
```
## Final Reusable Model
> Keep only the candidates that can still belong to the final Top K result, and make the weakest accepted candidate easy to remove.
```plain text
Define ranking
→ Choose removable boundary
→ Maintain k candidates
→ Read or extract the answer
```
The most important heap question is:
> Which element should be at the root so I can remove it when a better candidate arrives?
# Stack
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
# Queue
A queue stores elements in **First In, First Out** order:
```plain text
First element added
→ First element removed
```
```plain text
Front             Back
  ↓                ↓
[1] → [2] → [3] → [4]
```
`1` entered first, so it is processed first.
## Core Mental Model
> A queue processes older work before newer work.
```plain text
Add new work at the back
→ Process old work from the front
```
A deque extends this idea by allowing insertion and removal from both ends.
## How to Identify Queue Problems
Look for these signals:
- Elements must be processed in arrival order.
- The oldest pending item must be handled first.
- The problem describes waiting lines, requests, tickets, scheduling, or repeated rounds.
- You need a fixed-size queue that reuses storage.
- A sliding window needs its maximum or minimum efficiently.
- Old or useless candidates must be removed from opposite ends.
### Most important recognition question
> Should the item that arrived first be processed first?
For monotonic deque problems, ask:
> Can older candidates become permanently useless when a better value arrives?
## Basic Queue and Deque Operations in Java
### Queue
```java
Queue<Integer> queue = new ArrayDeque<>();

queue.offer(value); // Add at back
queue.poll();       // Remove from front
queue.peek();       // Read front
```
### Deque
```java
Deque<Integer> deque = new ArrayDeque<>();

deque.offerFirst(value);
deque.offerLast(value);

deque.pollFirst();
deque.pollLast();

deque.peekFirst();
deque.peekLast();
```
Prefer `ArrayDeque` over:
```plain text
Stack
LinkedList
```
for most stack and queue implementations.
## Common Form 1: Basic FIFO Simulation
Use this when tasks, requests, or objects must be processed in the order they arrive.
Examples:
- People waiting for tickets
- Recent requests
- Students waiting for food
- Players taking turns
- Items moving through processing stages
### How it works
1. Add new elements at the back.
2. Remove the oldest element from the front.
3. Process that element.
4. Add any newly created work at the back.
5. Continue until the queue becomes empty or the stopping condition is reached.
**Memory flow:** `Add at back → Remove from front → Process in order`
```java
Queue<Integer> queue = new ArrayDeque<>();

for (int value : initialValues) {
    queue.offer(value);
}

while (!queue.isEmpty()) {
    int current = queue.poll();

    // Process current.

    for (int next : generateNext(current)) {
        queue.offer(next);
    }
}
```
### Small example
```plain text
Initial queue: [1, 2, 3]

Remove 1
Queue: [2, 3]

Add 4
Queue: [2, 3, 4]

Remove 2
Queue: [3, 4]
```
The relative arrival order is preserved.
Practice:
- LC 933 — Number of Recent Calls
- LC 1700 — Number of Students Unable to Eat Lunch
- LC 2073 — Time Needed to Buy Tickets
- LC 649 — Dota2 Senate
- LC 950 — Reveal Cards in Increasing Order
- LC 1823 — Find the Winner of the Circular Game
## Common Form 2: Circular Queue
A circular queue implements a fixed-capacity queue using an array.
When an index reaches the end of the array, it wraps back to the beginning:
```plain text
nextIndex = (currentIndex + 1) % capacity
```
This allows positions freed by dequeue operations to be reused.
### Core state
A simple implementation maintains:
```plain text
array
front index
current size
```
The next rear position can be calculated as:
```plain text
(front + size) % capacity
```
The current rear element is located at:
```plain text
(front + size - 1) % capacity
```
### How it works
1. Store elements in a fixed-size array.
2. Keep `front` pointing to the oldest element.
3. Keep `size` equal to the number of stored elements.
4. Insert at `(front + size) % capacity`.
5. Remove by advancing `front` using modulo arithmetic.
6. Reuse array positions after the indices wrap around.
**Memory flow:** `Calculate index → Wrap with modulo → Reuse storage`
```java
class MyCircularQueue {
    private final int[] values;
    private int front;
    private int size;

    MyCircularQueue(int capacity) {
        values = new int[capacity];
        front = 0;
        size = 0;
    }

    public boolean enQueue(int value) {
        if (isFull()) {
            return false;
        }

        int rear =
            (front + size) % values.length;

        values[rear] = value;
        size++;

        return true;
    }

    public boolean deQueue() {
        if (isEmpty()) {
            return false;
        }

        front = (front + 1) % values.length;
        size--;

        return true;
    }

    public int Front() {
        return isEmpty() ? -1 : values[front];
    }

    public int Rear() {
        if (isEmpty()) {
            return -1;
        }

        int rear =
            (front + size - 1) % values.length;

        return values[rear];
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public boolean isFull() {
        return size == values.length;
    }
}
```
### Small example
For capacity `3`:
```plain text
Array: [_, _, _]
front = 0
size  = 0
```
Add `10`, `20`, and `30`:
```plain text
Array: [10, 20, 30]
front = 0
size  = 3
```
Remove `10`:
```plain text
Array: [10, 20, 30]
           ↑
         front

front = 1
size  = 2
```
The old value can remain physically in the array because it is outside the logical queue.
Add `40`:
```plain text
rear = (front + size) % capacity
     = (1 + 2) % 3
     = 0
```
```plain text
Array: [40, 20, 30]
            ↑
          front
```
Logical queue:
```plain text
20 → 30 → 40
```
### Important distinction
The physical array order may be:
```plain text
[40, 20, 30]
```
while the logical queue order is:
```plain text
[20, 30, 40]
```
Always interpret positions relative to `front`.
Practice:
- LC 622 — Design Circular Queue
- LC 641 — Design Circular Deque
- LC 1670 — Design Front Middle Back Queue
- Design a Ring Buffer
## Common Form 3: Monotonic Deque
A monotonic deque maintains useful candidates in sorted order while processing a sliding window.
It supports operations from both ends:
- The front stores the current best candidate.
- The back is used to remove candidates that have become useless.
For a sliding-window maximum, values are kept in decreasing order:
```plain text
largest → ... → smallest
front             back
```
## What Should the Deque Store?
Usually store **indices**, not values.
An index gives you:
- The value: `nums[index]`
- Its position
- Whether it has left the current window
If only values are stored, detecting expired elements becomes difficult when duplicates exist.
## Two Reasons an Index Is Removed
### 1. It has expired
The index is outside the current window.
For a window ending at `right` with size `k`, valid indices are:
```plain text
right - k + 1 through right
```
Therefore, remove the front when:
```java
deque.peekFirst() <= right - k
```
### 2. A better candidate has arrived
For a maximum window, suppose the deque contains index `i`, and the current index is `j`.
If:
```plain text
j > i
nums[j] >= nums[i]
```
then `i` is useless because `j`:
- Has a value at least as large
- Appears later
- Will remain in future windows longer
Therefore, remove `i` from the back.
### How it works
1. Remove indices from the front when they are outside the current window.
2. For a maximum, remove indices from the back while their values are less than or equal to the current value.
3. Add the current index at the back.
4. Once the first complete window is formed, the front contains its maximum.
5. Repeat for every window.
**Memory flow:** `Remove expired → Remove weaker → Add current → Read best`
## Sliding-Window Maximum Template
```java
int n = nums.length;
int[] answer = new int[n - k + 1];
int answerIndex = 0;

Deque<Integer> deque = new ArrayDeque<>();

for (int right = 0; right < n; right++) {

    // Remove indices outside the window.
    while (!deque.isEmpty()
            && deque.peekFirst() <= right - k) {
        deque.pollFirst();
    }

    // Remove values weaker than the current value.
    while (!deque.isEmpty()
            && nums[deque.peekLast()] <= nums[right]) {
        deque.pollLast();
    }

    // Current index may help this or a future window.
    deque.offerLast(right);

    // Record the answer after forming a complete window.
    if (right >= k - 1) {
        answer[answerIndex++] =
            nums[deque.peekFirst()];
    }
}

return answer;
```
## Detailed Example
```plain text
nums = [1, 3, -1, -3, 5]
k = 3
```
### Add index `0`, value `1`
```plain text
Deque indices: [0]
Deque values:  [1]
```
### Add index `1`, value `3`
`3` is greater than `1`, so `1` can never become the maximum while `3` is available.
Remove index `0`, then add index `1`:
```plain text
Deque indices: [1]
Deque values:  [3]
```
### Add index `2`, value `-1`
`-1` is not stronger than `3`, so add it behind `3`:
```plain text
Deque indices: [1, 2]
Deque values:  [3, -1]
```
The first complete window is:
```plain text
[1, 3, -1]
```
The maximum is at the front:
```plain text
nums[1] = 3
```
### Add index `3`, value `-3`
Before insertion, index `0` would be expired, but it is no longer in the deque.
`-3` is weaker than `-1`, so add it:
```plain text
Deque indices: [1, 2, 3]
Deque values:  [3, -1, -3]
```
Window:
```plain text
[3, -1, -3]
```
Maximum:
```plain text
3
```
### Add index `4`, value `5`
Index `1` is expired because:
```plain text
1 <= 4 - 3
```
Remove it from the front.
Then `5` removes `-3` and `-1` from the back because they can never beat `5`.
```plain text
Deque indices: [4]
Deque values:  [5]
```
Window:
```plain text
[-1, -3, 5]
```
Maximum:
```plain text
5
```
Final result so far:
```plain text
[3, 3, 5]
```
## Why Not Use a Normal Queue?
A normal queue can remove expired elements from the front, but it cannot efficiently remove weaker elements from the back.
Without removing weaker candidates, finding the maximum may require scanning the entire window:
```plain text
O(k) per window
```
Total:
```plain text
O(n × k)
```
The monotonic deque keeps only candidates that can still become an answer, reducing the total to `O(n)`.
## Sliding-Window Minimum
For a minimum, maintain increasing values:
```plain text
smallest → ... → largest
front              back
```
Reverse the comparison:
```java
while (!deque.isEmpty()
        && nums[deque.peekLast()] >= nums[right]) {
    deque.pollLast();
}
```
Now:
```java
nums[deque.peekFirst()]
```
is the current minimum.
## Monotonic Deque Invariant
For a maximum window:
```plain text
Indices increase from front to back.
Values decrease from front to back.
All indices belong to the current window.
```
For a minimum window:
```plain text
Indices increase from front to back.
Values increase from front to back.
All indices belong to the current window.
```
Practice:
- LC 239 — Sliding Window Maximum
- LC 1438 — Longest Continuous Subarray With Absolute Difference Within Limit
- LC 862 — Shortest Subarray with Sum at Least K
- LC 1696 — Jump Game VI
- LC 1499 — Max Value of Equation
- LC 2398 — Maximum Number of Robots Within Budget
## Quick Interview Checklist
1. Is this normal arrival-order processing?
2. Do I need a fixed-capacity queue?
3. Do I need insertion or removal from both ends?
4. Does every sliding window need its maximum or minimum?
5. What exactly does each deque entry represent?
6. Should I store values or indices?
7. How do I know when an index has expired?
8. What makes a previous candidate permanently useless?
9. Should values be increasing or decreasing?
10. Should the comparison be strict or non-strict?
11. When is the first complete window formed?
12. What should always remain at the deque’s front?
## Technique Decision Rule
```plain text
Arrival-order processing       → normal queue
Fixed-size reusable storage    → circular queue
Window maximum                 → decreasing monotonic deque
Window minimum                 → increasing monotonic deque
Need expiration information    → store indices
Need removal from both ends    → deque
```
## Common Mistakes
- Using a stack when FIFO order is required.
- Calling `poll()` or `peek()` without handling an empty queue.
- Confusing the queue’s front with its back.
- Using `ArrayDeque` with `null`, which is not allowed.
- Using physical array order as logical order in a circular queue.
- Forgetting modulo arithmetic when circular indices wrap.
- Confusing current size with array capacity.
- Using `% capacity` when capacity may be zero.
- Storing values instead of indices in a monotonic deque.
- Forgetting to remove expired indices.
- Removing expired indices from the back instead of the front.
- Removing weaker candidates from the front instead of the back.
- Reading the answer before a complete window of size `k` exists.
- Using the wrong inequality when duplicate values are present.
- Assuming that every value in the current window must remain in the deque.
## Complexity Analysis
### Basic queue operations
```plain text
offer: O(1)
poll:  O(1)
peek:  O(1)
```
A simulation processing `n` elements is generally:
```plain text
Time:  O(n)
Space: O(n)
```
The exact space depends on the maximum number of pending elements.
### Circular queue
Every operation uses direct indexing:
```plain text
Enqueue: O(1)
Dequeue: O(1)
Front:   O(1)
Rear:    O(1)
Space:   O(capacity)
```
### Monotonic deque
Although it contains nested `while` loops, every index:
```plain text
enters the deque at most once
leaves the deque at most once
```
Therefore:
```plain text
Time:  O(n)
Space: O(k)
```
The deque cannot contain more useful indices than the current window size.
## Final Reusable Model
> A queue preserves arrival order, while a monotonic deque additionally removes candidates that can no longer contribute to a future answer.
```plain text
Normal queue:
Add at back → Remove from front

Monotonic deque:
Remove expired → Remove useless → Add current → Read front
```
For monotonic-deque problems, always explain both removal rules:
1. Remove the front because it is outside the window.
2. Remove from the back because a newer candidate is better.
<empty-block/>
<empty-block/>
# Greedy Algorithm
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
# Recursion
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
# Binary Tree Fundamentals and Traversals
A binary tree is a hierarchical structure where each node has at most two children:
```plain text
left child
right child
```
Unlike arrays and linked lists, a tree can branch into multiple paths.
```plain text
    1
   / \
  2   3
 / \
4   5
```
The tree rooted at node `2` is itself a complete smaller tree:
```plain text
  2
 / \
4   5
```
This self-similar structure is why recursion works naturally with trees.
---
# TreeNode Structure
In Java:
```java
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;

    TreeNode(int val) {
        this.val = val;
    }
}
```
Each node contains:
```plain text
value
reference to left child
reference to right child
```
A missing child is represented by:
```java
null
```
---
# Core Mental Model
> Every node is the root of its own smaller subtree.
When solving a tree problem, do not initially think about the entire tree.
Think:
```plain text
What should I do at the current node?
What should the left subtree do?
What should the right subtree do?
```
For recursive problems:
> Trust that the recursive call correctly solves the subtree given to it.
---
# Important Tree Terminology
Using:
```plain text
    1
   / \
  2   3
 / \
4   5
```
## Root
The topmost node:
```plain text
1
```
## Parent and child
```plain text
2 is a child of 1
1 is the parent of 2
```
## Leaf
A node with no children:
```plain text
3, 4, 5
```
A leaf satisfies:
```java
node.left == null && node.right == null
```
## Subtree
A node together with all its descendants.
## Depth
The distance from the root to a node.
```plain text
Depth of 1 = 0
Depth of 2 = 1
Depth of 4 = 2
```
## Height
The distance from a node down to its deepest leaf.
```plain text
Height of leaf 4 = 0
Height of node 2 = 1
Height of root 1 = 2
```
Some questions count height in nodes rather than edges. Always verify the definition.
## Ancestor
A node appearing above another node on the same path.
```plain text
1 and 2 are ancestors of 4
```
## Descendant
A node appearing below another node.
```plain text
4 and 5 are descendants of 2
```
---
# Common Binary Tree Types
## Full Binary Tree
Every node has either:
```plain text
0 children or 2 children
```
## Complete Binary Tree
Every level is completely filled except possibly the last, and the last level is filled from left to right.
## Perfect Binary Tree
Every internal node has two children and every leaf is at the same depth.
## Balanced Binary Tree
The left and right subtree heights do not differ excessively.
For an AVL-style balance condition:
```plain text
abs(leftHeight - rightHeight) <= 1
```
at every node.
## Skewed Binary Tree
Every node has only one child:
```plain text
1
 \
  2
   \
    3
     \
      4
```
A skewed tree behaves like a linked list and can produce recursion depth `O(n)`.
---
# What Is Tree Traversal?
Traversal means visiting every tree node in a defined order.
The three main DFS traversal orders are:
```plain text
Preorder  → Node, Left, Right
Inorder   → Left, Node, Right
Postorder → Left, Right, Node
```
The only difference is:
> When do we process the current node relative to its children?
---
# Small Traversal Example
For:
```plain text
    1
   / \
  2   3
 / \
4   5
```
## Preorder
```plain text
Node → Left → Right
```
Result:
```plain text
1, 2, 4, 5, 3
```
## Inorder
```plain text
Left → Node → Right
```
Result:
```plain text
4, 2, 5, 1, 3
```
## Postorder
```plain text
Left → Right → Node
```
Result:
```plain text
4, 5, 2, 3, 1
```
---
# The Three Processing Positions
Every recursive tree function has three possible locations for processing the current node:
```java
void dfs(TreeNode node) {
    if (node == null) {
        return;
    }

    // Position 1: Preorder

    dfs(node.left);

    // Position 2: Inorder

    dfs(node.right);

    // Position 3: Postorder
}
```
This is the most reusable traversal template.
```plain text
Before both children  → preorder
Between the children  → inorder
After both children   → postorder
```
---
# How to Choose a Traversal
## Choose Preorder When
You need to process the parent before its children.
Common uses:
- Copy or serialize a tree
- Pass information from parent to child
- Build paths from the root
- Create a tree from preorder information
- Produce prefix expressions
Mental model:
```plain text
Parent decides first
→ Children receive its state
```
## Choose Inorder When
The relative order between left subtree, node, and right subtree matters.
Common uses:
- Retrieve BST values in sorted order
- Find BST predecessor or successor
- Find kth smallest value in a BST
- Validate BST ordering
Mental model:
```plain text
Process values from left to right
```
## Choose Postorder When
A parent needs information from its children before it can calculate its own answer.
Common uses:
- Calculate height
- Determine balance
- Calculate diameter
- Delete a tree
- Calculate subtree sums
- Find maximum path values
Mental model:
```plain text
Children answer first
→ Parent combines their answers
```
---
# How to Identify Tree-Traversal Problems
Look for these signals:
- The input is a `TreeNode`.
- Every node or subtree must be examined.
- The question asks about:
	- depth
	- height
	- paths
	- subtree information
	- BST ordering
	- copying or serialization
- The same operation applies independently to left and right subtrees.
- Recursive calls naturally use:
	- `node.left`
	- `node.right`
### Most important recognition question
> Should the current node be processed before, between, or after its children?
That decision identifies preorder, inorder, or postorder.
---
# Common Forms
## Common Form 1: Recursive Preorder Traversal
Preorder processes the current node before visiting its children.
```plain text
Node → Left → Right
```
### How it works
1. Return when the current node is `null`.
2. Process the current node.
3. Recursively traverse the left subtree.
4. Recursively traverse the right subtree.
**Memory flow:** `Process node → Explore left → Explore right`
```java
void preorder(
        TreeNode node,
        List<Integer> answer
) {
    if (node == null) {
        return;
    }

    answer.add(node.val);

    preorder(node.left, answer);
    preorder(node.right, answer);
}
```
### Recursive contract
> `preorder(node)` processes every node in the subtree rooted at `node` in Node–Left–Right order.
Practice:
- LC 144 — Binary Tree Preorder Traversal
- LC 257 — Binary Tree Paths
- LC 100 — Same Tree
- LC 226 — Invert Binary Tree
- LC 297 — Serialize and Deserialize Binary Tree
---
## Common Form 2: Recursive Inorder Traversal
Inorder processes the node between its two subtrees.
```plain text
Left → Node → Right
```
### How it works
1. Return when the node is `null`.
2. Recursively traverse the left subtree.
3. Process the current node.
4. Recursively traverse the right subtree.
**Memory flow:** `Explore left → Process node → Explore right`
```java
void inorder(
        TreeNode node,
        List<Integer> answer
) {
    if (node == null) {
        return;
    }

    inorder(node.left, answer);

    answer.add(node.val);

    inorder(node.right, answer);
}
```
### Critical BST property
For a valid Binary Search Tree, inorder traversal produces values in increasing order:
```plain text
Left values < Node value < Right values
```
Practice:
- LC 94 — Binary Tree Inorder Traversal
- LC 98 — Validate Binary Search Tree
- LC 230 — Kth Smallest Element in a BST
- LC 530 — Minimum Absolute Difference in BST
- LC 501 — Find Mode in Binary Search Tree
---
## Common Form 3: Recursive Postorder Traversal
Postorder processes the current node after both children.
```plain text
Left → Right → Node
```
### How it works
1. Return when the node is `null`.
2. Recursively solve the left subtree.
3. Recursively solve the right subtree.
4. Process or calculate the current node’s result.
5. Return information to the parent when required.
**Memory flow:** `Ask left → Ask right → Process current`
```java
void postorder(
        TreeNode node,
        List<Integer> answer
) {
    if (node == null) {
        return;
    }

    postorder(node.left, answer);
    postorder(node.right, answer);

    answer.add(node.val);
}
```
### Return-value postorder
```java
int height(TreeNode node) {
    if (node == null) {
        return 0;
    }

    int leftHeight = height(node.left);
    int rightHeight = height(node.right);

    return 1 + Math.max(
        leftHeight,
        rightHeight
    );
}
```
The parent cannot calculate its height until both children provide theirs.
Practice:
- LC 145 — Binary Tree Postorder Traversal
- LC 104 — Maximum Depth of Binary Tree
- LC 110 — Balanced Binary Tree
- LC 543 — Diameter of Binary Tree
- LC 124 — Binary Tree Maximum Path Sum
---
## Common Form 4: Iterative Preorder Traversal
Recursion uses an internal call stack. Iterative traversal uses an explicit stack.
Preorder is the easiest iterative DFS traversal.
### How it works
1. Push the root.
2. Pop and process the current node.
3. Push its right child.
4. Push its left child.
5. Because the stack is LIFO, the left child is processed first.
**Memory flow:** `Pop node → Process → Push right → Push left`
```java
List<Integer> answer = new ArrayList<>();

if (root == null) {
    return answer;
}

Deque<TreeNode> stack = new ArrayDeque<>();
stack.push(root);

while (!stack.isEmpty()) {
    TreeNode current = stack.pop();

    answer.add(current.val);

    if (current.right != null) {
        stack.push(current.right);
    }

    if (current.left != null) {
        stack.push(current.left);
    }
}

return answer;
```
### Why push right first?
Desired processing order:
```plain text
Node → Left → Right
```
Since the stack removes the newest item first:
```plain text
Push right
Push left

Left is popped first
```
Practice:
- LC 144 — Binary Tree Preorder Traversal
- LC 589 — N-ary Tree Preorder Traversal
- LC 100 — Same Tree
---
## Common Form 5: Iterative Inorder Traversal
Iterative inorder must first travel as far left as possible.
### How it works
1. Push the current node and move left.
2. Repeat until the current node becomes `null`.
3. Pop the most recent node.
4. Process it.
5. Move to its right subtree.
6. Repeat the same leftward process.
**Memory flow:** `Push left chain → Pop and process → Move right`
```java
List<Integer> answer = new ArrayList<>();
Deque<TreeNode> stack = new ArrayDeque<>();

TreeNode current = root;

while (current != null || !stack.isEmpty()) {
    while (current != null) {
        stack.push(current);
        current = current.left;
    }

    current = stack.pop();
    answer.add(current.val);

    current = current.right;
}

return answer;
```
### Stack meaning
The stack contains ancestors whose left subtree is being processed or has just finished, but whose own value has not yet been processed.
Practice:
- LC 94 — Binary Tree Inorder Traversal
- LC 230 — Kth Smallest Element in a BST
- LC 173 — Binary Search Tree Iterator
- LC 530 — Minimum Absolute Difference in BST
---
## Common Form 6: Iterative Postorder with Two Stacks
Postorder is harder iteratively because a node must wait until both children have been processed.
A simple approach uses two stacks.
### How it works
1. Push the root into the first stack.
2. Pop a node from the first stack and push it into the second.
3. Push its left and right children into the first stack.
4. Continue until the first stack is empty.
5. Pop the second stack to obtain Left–Right–Node order.
**Memory flow:** `Build reverse order → Reverse it again → Get postorder`
```java
List<Integer> answer = new ArrayList<>();

if (root == null) {
    return answer;
}

Deque<TreeNode> first = new ArrayDeque<>();
Deque<TreeNode> second = new ArrayDeque<>();

first.push(root);

while (!first.isEmpty()) {
    TreeNode current = first.pop();
    second.push(current);

    if (current.left != null) {
        first.push(current.left);
    }

    if (current.right != null) {
        first.push(current.right);
    }
}

while (!second.isEmpty()) {
    answer.add(second.pop().val);
}

return answer;
```
The first phase creates:
```plain text
Node → Right → Left
```
Reversing that order produces:
```plain text
Left → Right → Node
```
Practice:
- LC 145 — Binary Tree Postorder Traversal
- LC 590 — N-ary Tree Postorder Traversal
---
## Common Form 7: One Stack with Processing State
A single stack can perform any traversal if each entry remembers whether the node is being entered or processed.
This explicitly simulates recursive call frames.
### How it works
1. Push the root as unprocessed.
2. Pop one entry.
3. If it is marked for processing, add its value.
4. Otherwise, push the node and its children in reverse desired order.
5. The stack recreates the required traversal sequence.
**Memory flow:** `Push future actions in reverse execution order`
### Preorder example
```java
class State {
    TreeNode node;
    boolean process;

    State(TreeNode node, boolean process) {
        this.node = node;
        this.process = process;
    }
}
```
```java
Deque<State> stack = new ArrayDeque<>();
stack.push(new State(root, false));

while (!stack.isEmpty()) {
    State state = stack.pop();

    if (state.node == null) {
        continue;
    }

    if (state.process) {
        answer.add(state.node.val);
        continue;
    }

    // Desired order: Node, Left, Right.
    // Push in reverse order.
    stack.push(new State(state.node.right, false));
    stack.push(new State(state.node.left, false));
    stack.push(new State(state.node, true));
}
```
To create inorder:
```plain text
Desired: Left, Node, Right
Push:    Right, Node, Left
```
To create postorder:
```plain text
Desired: Left, Right, Node
Push:    Node, Right, Left
```
Practice:
- LC 94 — Binary Tree Inorder Traversal
- LC 144 — Binary Tree Preorder Traversal
- LC 145 — Binary Tree Postorder Traversal
---
## Common Form 8: Morris Traversal
Morris traversal performs inorder or preorder traversal without recursion or an explicit stack.
It temporarily creates links from a node’s inorder predecessor back to the current node.
This is an advanced technique and should be learned after recursive and stack-based traversal.
### How it works
1. If the current node has no left child, process it and move right.
2. Otherwise, find the rightmost node in its left subtree.
3. Temporarily connect that predecessor back to the current node.
4. Traverse the left subtree.
5. When the temporary connection is encountered again, remove it.
6. Process the current node and move right.
**Memory flow:** `Create temporary return path → Traverse left → Remove path`
```java
TreeNode current = root;

while (current != null) {
    if (current.left == null) {
        answer.add(current.val);
        current = current.right;
    } else {
        TreeNode predecessor = current.left;

        while (predecessor.right != null
                && predecessor.right != current) {
            predecessor = predecessor.right;
        }

        if (predecessor.right == null) {
            predecessor.right = current;
            current = current.left;
        } else {
            predecessor.right = null;
            answer.add(current.val);
            current = current.right;
        }
    }
}
```
### Critical rule
Always remove the temporary connection:
```java
predecessor.right = null;
```
Otherwise, the original tree remains modified and contains a cycle.
Practice:
- LC 94 — Binary Tree Inorder Traversal
- LC 144 — Binary Tree Preorder Traversal
- LC 99 — Recover Binary Search Tree
---
# Traversal Decision Guide
```plain text
Process parent before children       → preorder
Pass parent information downward     → preorder
Process BST in sorted order          → inorder
Parent needs answers from children   → postorder
Calculate height, balance, diameter  → postorder
Avoid recursion                      → explicit stack
Need simplest iterative DFS          → iterative preorder
Need O(1) auxiliary traversal space  → Morris traversal
```
---
# Recursive Return Types
Tree functions generally fall into two categories.
## Traversal-only function
The function processes nodes but returns nothing:
```java
void dfs(TreeNode node)
```
Examples:
- Print values
- Add values to a list
- Update external state
## Information-returning function
The function returns information about its subtree:
```java
int height(TreeNode node)
boolean isValid(TreeNode node)
TreeNode find(TreeNode node)
```
Before coding, complete:
> `solve(node)` returns  for the subtree rooted at `node`.
This return contract is more important than choosing preorder or postorder by name.
---
# Null Base Cases and Neutral Values
The correct `null` return depends on what the parent does with the answer.
## Counting nodes
```java
if (node == null) {
    return 0;
}
```
## Calculating height in nodes
```java
if (node == null) {
    return 0;
}
```
## Checking a condition
```java
if (node == null) {
    return true;
}
```
## Searching for a node
```java
if (node == null) {
    return null;
}
```
The base value must behave correctly when combined by the parent.
---
# Quick Interview Checklist
1. What does `solve(node)` return?
2. What should happen when `node == null`?
3. Is the current node processed before, between, or after its children?
4. Does information travel downward or upward?
5. Does the parent need answers from both children?
6. Is external/global state required?
7. Can the answer be returned directly instead?
8. Should traversal stop early after finding something?
9. Do I need recursion or an explicit stack?
10. What does each stack entry represent?
11. In iterative traversal, why are children pushed in that order?
12. Could the tree be skewed enough to overflow the call stack?
13. Is the tree a BST with additional ordering?
14. Am I comparing node identity or node values?
15. What is the tree’s maximum height?
---
# Common Mistakes
- Accessing `node.val` before checking whether `node` is `null`.
- Memorizing traversal names without understanding processing position.
- Using inorder simply because the input is a tree.
- Assuming inorder is sorted for every binary tree; it is sorted only for a valid BST.
- Using preorder when the parent requires completed child answers.
- Returning the wrong neutral value for `null`.
- Calculating only one subtree when both are required.
- Forgetting to return the combined recursive result.
- Mixing depth and height.
- Mixing edge-based and node-based height definitions.
- Comparing `node.val` when node identity is required.
- Pushing left before right during iterative preorder, which processes right first.
- Using `while (!stack.isEmpty())` alone for iterative inorder and losing the initial left chain.
- Forgetting to restore temporary links in Morris traversal.
- Claiming recursive traversal uses `O(1)` space.
- Ignoring the possibility of a skewed tree.
---
# Complexity Analysis
For a tree with `n` nodes, each standard traversal visits every node once:
```plain text
Time: O(n)
```
## Recursive traversal
The call stack depends on tree height `h`:
```plain text
Space: O(h)
```
Balanced tree:
```plain text
h = O(log n)
```
Skewed tree:
```plain text
h = O(n)
```
## Iterative traversal
The explicit stack can hold up to `O(h)` nodes in many traversals.
```plain text
Space: O(h)
```
The two-stack postorder approach can store all nodes:
```plain text
Space: O(n)
```
## Morris traversal
```plain text
Time:  O(n)
Space: O(1)
```
Although predecessor links may be examined more than once, each temporary edge is created and removed once, keeping total work linear.
---
# Final Reusable Model
> Every tree node represents a smaller subtree. Decide when to process the node and define exactly what its subtree returns.
```plain text
Preorder:
Process current → Visit children

Inorder:
Visit left → Process current → Visit right

Postorder:
Visit children → Combine at current
```
The most important question is:
> “What information should this node return to its parent?”
# Binary Tree Problem Patterns
After learning traversals, the next step is recognizing:
> What information must move between the parent and its children?
Most binary-tree questions are variations of:
```plain text
Information moves downward → carry state through parameters
Information moves upward   → return information from subtrees
Need nodes level by level   → BFS
Need movement to parent     → convert tree into an undirected graph
```
---
# Core Mental Model
For every tree problem, define the recursive contract:
> `solve(node)` returns  for the subtree rooted at `node`.
Then decide whether the answer is:
1. Returned from the current subtree
2. Stored in a global variable
3. Carried downward through parameters
4. Collected level by level using BFS
---
# How to Identify the Pattern
Ask these questions:
```plain text
Does the parent need information from its children?
→ Postorder recursion

Do children need information from the parent?
→ Preorder recursion with parameters

Does the question mention root-to-leaf paths?
→ Path-state recursion or backtracking

Can the required path pass through a node and use both children?
→ Return one branch and update a global answer

Does the question ask for levels, views, or horizontal ordering?
→ BFS or DFS with level/position information

Do I need to move upward from a node?
→ Parent map + graph traversal

Am I changing links or constructing a new tree?
→ Tree modification or construction
```
---
# Common Forms
## Common Form 1: Height-Based Problems
These problems require information from both child subtrees before the current node can calculate its answer.
Examples include:
- Maximum depth
- Balanced tree
- Diameter
- Minimum depth
- Subtree height
### How it works
1. Recursively calculate information for the left subtree.
2. Recursively calculate information for the right subtree.
3. Use both answers to calculate the current node’s result.
4. Return the information required by the parent.
**Memory flow:** `Ask children → Combine answers → Return upward`
### Basic height template
```java
int height(TreeNode node) {
    if (node == null) {
        return 0;
    }

    int leftHeight = height(node.left);
    int rightHeight = height(node.right);

    return 1 + Math.max(leftHeight, rightHeight);
}
```
### Balanced-tree template
Instead of separately calculating height at every node, return a special value when a subtree is unbalanced:
```java
int checkHeight(TreeNode node) {
    if (node == null) {
        return 0;
    }

    int leftHeight = checkHeight(node.left);
    if (leftHeight == -1) {
        return -1;
    }

    int rightHeight = checkHeight(node.right);
    if (rightHeight == -1) {
        return -1;
    }

    if (Math.abs(leftHeight - rightHeight) > 1) {
        return -1;
    }

    return 1 + Math.max(leftHeight, rightHeight);
}
```
Here:
```plain text
0 or greater → valid subtree height
-1           → subtree is unbalanced
```
Practice:
- LC 104 — Maximum Depth of Binary Tree
- LC 111 — Minimum Depth of Binary Tree
- LC 110 — Balanced Binary Tree
- LC 543 — Diameter of Binary Tree
- LC 687 — Longest Univalue Path
---
## Common Form 2: Root-to-Leaf Path Problems
These problems follow one path from the root toward a leaf.
The current path’s state is passed downward.
Examples:
- Does a path have a given sum?
- Return every root-to-leaf path
- Form a number using path digits
- Find the smallest root-to-leaf string
### How it works
1. Update the path state using the current node.
2. Check whether the current node is a leaf.
3. At a leaf, evaluate or save the completed path.
4. Otherwise, pass the updated state to both children.
**Memory flow:** `Update path state → Move downward → Evaluate at leaf`
### Path-sum template
```java
boolean hasPathSum(
        TreeNode node,
        int remaining
) {
    if (node == null) {
        return false;
    }

    remaining -= node.val;

    if (node.left == null && node.right == null) {
        return remaining == 0;
    }

    return hasPathSum(node.left, remaining)
        || hasPathSum(node.right, remaining);
}
```
### Important distinction
A valid root-to-leaf path must end at a leaf:
```java
node.left == null && node.right == null
```
Reaching a `null` child does not itself mean that a valid path was completed.
Practice:
- LC 112 — Path Sum
- LC 113 — Path Sum II
- LC 257 — Binary Tree Paths
- LC 129 — Sum Root to Leaf Numbers
- LC 988 — Smallest String Starting From Leaf
---
## Common Form 3: Path Construction with Backtracking
Use backtracking when the complete sequence of nodes in the current path must be stored.
Examples:
- Return all paths having a target sum
- Return all root-to-leaf paths
- Examine or compare complete paths
### How it works
1. Add the current node to the path.
2. Check or save the path when the required endpoint is reached.
3. Recursively explore the children.
4. Remove the current node before returning to the parent.
**Memory flow:** `Choose node → Explore children → Undo node`
```java
void collectPaths(
        TreeNode node,
        List<Integer> path,
        List<List<Integer>> answer
) {
    if (node == null) {
        return;
    }

    path.add(node.val);

    if (node.left == null && node.right == null) {
        answer.add(new ArrayList<>(path));
    } else {
        collectPaths(node.left, path, answer);
        collectPaths(node.right, path, answer);
    }

    path.remove(path.size() - 1);
}
```
### Why must we copy the path?
```java
answer.add(new ArrayList<>(path));
```
The original `path` list continues changing during backtracking. Saving the same reference would corrupt previously stored answers.
Practice:
- LC 113 — Path Sum II
- LC 257 — Binary Tree Paths
- LC 437 — Path Sum III
- LC 988 — Smallest String Starting From Leaf
---
## Common Form 4: Any-to-Any Path Problems
These paths do not necessarily start at the root or end at a leaf.
A valid path may:
```plain text
start inside the left subtree
pass through the current node
end inside the right subtree
```
This is the central pattern behind diameter and maximum path sum.
### How it works
At each node, calculate two different answers:
1. **Return value:** the best single branch that can be extended by the parent.
2. **Global candidate:** the complete path passing through the current node, possibly using both children.
**Memory flow:** `Children return one branch → Current node joins two branches → Return one branch`
### Generic template
```java
int answer;

int solve(TreeNode node) {
    if (node == null) {
        return 0;
    }

    int left = solve(node.left);
    int right = solve(node.right);

    int pathThroughNode =
        left + node.val + right;

    answer = Math.max(
        answer,
        pathThroughNode
    );

    return node.val + Math.max(left, right);
}
```
### Why can’t we return both branches?
The parent-to-child path cannot split:
```plain text
   parent
      |
   current
   /     \
left    right
```
If the current node returned both branches to its parent, the result would no longer be a single path.
Therefore:
```plain text
Use both branches for the final/global candidate
Return only one branch to the parent
```
For maximum path sum, negative child contributions are ignored:
```java
int left = Math.max(0, solve(node.left));
int right = Math.max(0, solve(node.right));
```
Practice:
- LC 543 — Diameter of Binary Tree
- LC 124 — Binary Tree Maximum Path Sum
- LC 687 — Longest Univalue Path
- LC 1372 — Longest ZigZag Path in a Binary Tree
---
## Common Form 5: Lowest Common Ancestor
The Lowest Common Ancestor is the deepest node whose subtree contains both target nodes.
The current node can receive three kinds of information from each subtree:
```plain text
null → neither target was found
p    → p was found
q    → q was found
```
### How it works
1. Return `null` when the subtree is empty.
2. Return the current node when it equals either target.
3. Search both subtrees.
4. If both sides return non-null, the current node is the LCA.
5. If only one side returns non-null, pass that result upward.
**Memory flow:** `Search both sides → Detect split → Propagate found node`
```java
TreeNode lowestCommonAncestor(
        TreeNode node,
        TreeNode p,
        TreeNode q
) {
    if (node == null || node == p || node == q) {
        return node;
    }

    TreeNode left =
        lowestCommonAncestor(node.left, p, q);

    TreeNode right =
        lowestCommonAncestor(node.right, p, q);

    if (left != null && right != null) {
        return node;
    }

    return left != null ? left : right;
}
```
### LCA mental model
Imagine both target nodes sending signals upward:
```plain text
No signal                  → return null
One signal                 → pass it upward
Signals from both children → current node is LCA
```
### Important assumption
This template assumes both nodes exist in the tree. If existence is not guaranteed, additional tracking is required.
Practice:
- LC 236 — Lowest Common Ancestor of a Binary Tree
- LC 235 — Lowest Common Ancestor of a BST
- LC 1644 — LCA of a Binary Tree II
- LC 1650 — LCA of a Binary Tree III
- LC 1123 — LCA of Deepest Leaves
---
## Common Form 6: Tree Views and Level Problems
Tree-view problems ask which nodes are visible when looking from a particular direction.
Examples:
```plain text
Right-side view
Left-side view
Top view
Bottom view
Vertical traversal
Zigzag traversal
```
The traversal must track structural position such as:
- Level
- Horizontal column
- Order within a level
### How it works for side views
1. Traverse the tree level by level using BFS.
2. Process all nodes belonging to one level.
3. Save either the first or last node from that level.
4. Add children for the next level.
**Memory flow:** `Process one level → Select visible node → Move to next level`
### Right-side view template
```java
List<Integer> rightSideView(TreeNode root) {
    List<Integer> answer = new ArrayList<>();

    if (root == null) {
        return answer;
    }

    Deque<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        int size = queue.size();

        for (int i = 0; i < size; i++) {
            TreeNode current = queue.poll();

            if (i == size - 1) {
                answer.add(current.val);
            }

            if (current.left != null) {
                queue.offer(current.left);
            }

            if (current.right != null) {
                queue.offer(current.right);
            }
        }
    }

    return answer;
}
```
### Horizontal-position problems
Assign a column to every node:
```plain text
root        → column 0
left child  → column - 1
right child → column + 1
```
Then group nodes by their columns.
These problems often require:
```plain text
BFS/DFS + column number + Hashmap<column, Nodes>
```
Practice:
- LC 102 — Binary Tree Level Order Traversal
- LC 103 — Binary Tree Zigzag Level Order Traversal
- LC 199 — Binary Tree Right Side View
- LC 515 — Find Largest Value in Each Tree Row
- LC 987 — Vertical Order Traversal of a Binary Tree
- LC 314 — Binary Tree Vertical Order Traversal
---
## Common Form 7: Tree Modification
These problems change the tree’s links or values.
Examples:
- Invert a tree
- Flatten a tree
- Delete nodes
- Prune subtrees
- Add a row
- Transform a tree
The traversal order depends on whether modification must happen before or after processing the children.
### How it works
1. Determine whether children must be processed before changing the current node.
2. Save references that may be lost during modification.
3. Recursively modify the required subtrees.
4. Reconnect the returned subtree roots.
5. Return the new root of the current subtree.
**Memory flow:** `Save links → Modify subtrees → Reconnect → Return root`
### Generic modification template
```java
TreeNode modify(TreeNode node) {
    if (node == null) {
        return null;
    }

    TreeNode newLeft = modify(node.left);
    TreeNode newRight = modify(node.right);

    node.left = newLeft;
    node.right = newRight;

    return node;
}
```
### Invert-tree example
```java
TreeNode invertTree(TreeNode node) {
    if (node == null) {
        return null;
    }

    TreeNode left = invertTree(node.left);
    TreeNode right = invertTree(node.right);

    node.left = right;
    node.right = left;

    return node;
}
```
### Critical question
> After modifying the subtree, what should this function return to its parent?
Usually it returns the root of the modified subtree.
Practice:
- LC 226 — Invert Binary Tree
- LC 114 — Flatten Binary Tree to Linked List
- LC 814 — Binary Tree Pruning
- LC 1110 — Delete Nodes and Return Forest
- LC 623 — Add One Row to Tree
- LC 1325 — Delete Leaves With a Given Value
---
## Common Form 8: Convert Tree to Graph
A normal tree node lets us move:
```plain text
parent → child
```
But some problems require movement in every direction:
```plain text
child → parent
parent → child
```
Examples:
- Find nodes at distance `K` from a target
- Spread infection or fire through the tree
- Find time required to reach every node
### How it works
1. Traverse the tree and record each node’s parent.
2. Treat every node as connected to:
	- its left child
	- its right child
	- its parent
3. Start BFS from the target node.
4. Use a visited set because the converted structure is now an undirected graph.
5. Process one BFS level per unit of distance or time.
**Memory flow:** `Build parent links → Start from target → BFS in three directions`
### Parent-map template
```java
void buildParents(
        TreeNode node,
        TreeNode parent,
        Map<TreeNode, TreeNode> parents
) {
    if (node == null) {
        return;
    }

    if (parent != null) {
        parents.put(node, parent);
    }

    buildParents(node.left, node, parents);
    buildParents(node.right, node, parents);
}
```
### BFS neighbors
```java
TreeNode[] neighbors = {
    current.left,
    current.right,
    parents.get(current)
};

for (TreeNode next : neighbors) {
    if (next != null && visited.add(next)) {
        queue.offer(next);
    }
}
```
### Why is `visited` required?
After adding parent edges, movement can form cycles:
```plain text
parent → child → parent
```
Without `visited`, BFS would repeatedly revisit the same nodes.
Practice:
- LC 863 — All Nodes Distance K in Binary Tree
- LC 2385 — Amount of Time for Binary Tree to Be Infected
- Burning Tree
- Minimum Distance Between Two Tree Nodes
---
## Common Form 9: Tree Construction
These problems ask you to create a tree from traversal information or recursively divide an input range.
Examples:
- Build a tree from preorder and inorder
- Build a balanced BST from a sorted array
- Construct a maximum binary tree
### How it works
1. Identify the root for the current subtree.
2. Determine which elements belong to the left subtree.
3. Determine which elements belong to the right subtree.
4. Recursively construct both subtrees.
5. Attach them to the root and return it.
**Memory flow:** `Choose root → Divide input → Build children → Return root`
### Sorted-array-to-BST template
```java
TreeNode build(
        int[] nums,
        int left,
        int right
) {
    if (left > right) {
        return null;
    }

    int middle = left + (right - left) / 2;

    TreeNode root = new TreeNode(nums[middle]);

    root.left = build(nums, left, middle - 1);
    root.right = build(nums, middle + 1, right);

    return root;
}
```
### Important construction contract
> `build(left, right)` returns the root of the tree constructed from that range.
Practice:
- LC 105 — Construct Binary Tree from Preorder and Inorder
- LC 106 — Construct Binary Tree from Inorder and Postorder
- LC 108 — Convert Sorted Array to BST
- LC 654 — Maximum Binary Tree
- LC 889 — Construct Binary Tree from Preorder and Postorder
---
# Direction-of-Information Guide
```plain text
Parent information moves to children
→ Preorder with parameters

Children provide information to parent
→ Postorder with return values

Need the entire current path
→ Backtracking

Need a path using both subtrees
→ Return one branch, update global answer with two

Need nearest common meeting point
→ LCA recursion

Need level or visible-position information
→ BFS with level/column state

Need upward movement from a target
→ Parent map + BFS

Need to change links
→ Return the modified subtree root

Need to build a new tree
→ Choose root, recursively build children
```
---
# Choosing Between Return Value and Global Answer
Use a return value when:
> The parent needs this information to calculate its own result.
Examples:
```plain text
subtree height
best downward path
whether subtree is valid
modified subtree root
```
Use a global answer when:
> The candidate answer can be completed at any node and cannot be passed upward as-is.
Examples:
```plain text
diameter through a node
maximum path sum through a node
largest answer seen anywhere
```
Some problems require both:
```java
int solve(TreeNode node) {
    int left = solve(node.left);
    int right = solve(node.right);

    globalAnswer = combineBoth(left, right);

    return valueParentCanExtend(left, right);
}
```
---
# Quick Interview Checklist
1. What does `solve(node)` return?
2. What should `null` return?
3. Does information move upward or downward?
4. Does the parent need one child or both children?
5. Can a path split, or must it remain a single chain?
6. Is the answer root-to-leaf, downward-only, or any-to-any?
7. Must the endpoint be a leaf?
8. Do I need to store the current path?
9. If storing a path, did I undo the choice?
10. Is a global answer necessary?
11. Does the question require level-order processing?
12. Must I track levels or horizontal columns?
13. Do I need to move from a child to its parent?
14. Am I modifying existing links?
15. Could modification destroy a reference I still need?
16. Should the function return the modified subtree root?
17. Are target nodes guaranteed to exist?
18. Am I comparing node identity or only node values?
19. Could the tree be skewed?
20. What are the time and stack-space complexities?
---
# Common Mistakes
- Coding before defining the recursive return contract.
- Confusing height with depth.
- Recalculating subtree height repeatedly and producing `O(n²)` time.
- Treating a `null` child as a valid root-to-leaf endpoint.
- Returning both branches of a path to the parent.
- Forgetting to ignore negative branches in maximum path sum.
- Using a global variable when a return value is sufficient.
- Forgetting to reset global state between executions.
- Saving the same mutable path instead of copying it.
- Forgetting to backtrack after exploring a path.
- Assuming both LCA targets exist when the problem does not guarantee it.
- Using node values when node identity matters.
- Forgetting `visited` after converting a tree to an undirected graph.
- Marking graph nodes visited too late.
- Losing child references while modifying links.
- Forgetting to reconnect returned subtree roots.
- Using BFS without capturing the level size first.
- Assuming inorder traversal is sorted for every binary tree.
---
# Complexity Analysis
For most tree problems, every node is processed once:
```plain text
Time: O(n)
```
Recursive stack space depends on tree height `h`:
```plain text
Space: O(h)
```
Balanced tree:
```plain text
h = O(log n)
```
Skewed tree:
```plain text
h = O(n)
```
BFS can store an entire level:
```plain text
Space: O(width)
```
In the worst case:
```plain text
Space: O(n)
```
Parent-map problems require:
```plain text
Parent map: O(n)
Visited set: O(n)
Queue:       O(n)

Total space: O(n)
```
Path backtracking uses:
```plain text
Current path: O(h)
```
If every complete path is returned, output storage may itself be larger than `O(n)`.
---
# Final Reusable Model
```plain text
Height problems:
Children return measurements

Root-to-leaf paths:
Carry state downward

Path construction:
Choose → Explore → Undo

Any-to-any paths:
Return one branch, test two branches

LCA:
Targets send signals upward

Views:
Process levels or positions

Tree modification:
Modify children and return subtree root

Tree as graph:
Add parent links and perform BFS

Tree construction:
Choose root, divide input, build children
```
The single most important question remains:
> “What information should this node receive, and what information should it return?”
# Binary Search Trees
A Binary Search Tree (BST) is a binary tree with an ordering rule.
For every node:
```plain text
All values in the left subtree  < node.val
All values in the right subtree > node.val
```
This rule applies to the entire subtree—not only the immediate children.
```plain text
    8
   / \
  3   10
 / \    \
1   6    14
   / \   /
  4   7 13
```
Because values are ordered, many BST operations can discard an entire subtree, similar to binary search.
---
# Core BST Invariant
> Every node creates a valid range for all its descendants.
For example:
```plain text
  8
 / \
3   10
```
The left subtree must contain only values smaller than `8`.
The right subtree must contain only values greater than `8`.
For node `3`:
```plain text
Allowed range: (-∞, 8)
```
Its right child must be:
```plain text
greater than 3
and
smaller than 8
```
Therefore, checking only the immediate parent-child relationship is insufficient.
---
# BST versus Binary Tree
A binary tree guarantees only:
```plain text
Each node has at most two children
```
A BST additionally guarantees:
```plain text
left subtree values < node value < right subtree values
```
This ordering enables:
- Faster search
- Faster insertion and deletion
- Sorted inorder traversal
- Efficient predecessor and successor queries
- Range pruning
---
# Important BST Property: Inorder Is Sorted
BST inorder traversal follows:
```plain text
Left → Node → Right
```
Because the left subtree contains smaller values and the right subtree contains larger values:
> Inorder traversal of a valid BST produces values in increasing order.
Example:
```plain text
    5
   / \
  3   7
 / \   \
2   4   9
```
Inorder:
```plain text
2, 3, 4, 5, 7, 9
```
This property is central to many BST problems.
---
# Balanced and Skewed BSTs
A balanced BST has height approximately:
```plain text
O(log n)
```
```plain text
    4
   / \
  2   6
 / \ / \
1  3 5  7
```
A skewed BST can have height:
```plain text
O(n)
```
```plain text
1
 \
  2
   \
    3
     \
      4
```
BST operations are therefore generally:
```plain text
Average/Balanced: O(log n)
Worst/Skewed:     O(n)
```
A BST is not automatically balanced.
---
# How to Identify BST Problems
Look for these signals:
- The input is explicitly called a Binary Search Tree.
- The question involves sorted ordering between nodes.
- You need to search for a particular value.
- You need the kth smallest or kth largest value.
- You need a predecessor, successor, floor, or ceiling.
- You need to validate whether a tree follows BST rules.
- You need to process values within a range.
- You need to insert or delete while preserving order.
- The question can eliminate the left or right subtree using comparisons.
### Most important recognition question
> Can the BST ordering rule tell me that one entire subtree is irrelevant?
If yes, use the BST property instead of traversing the entire tree.
---
# Common Forms
## Common Form 1: Search in a BST
Compare the target with the current node.
```plain text
target < node.val → search left
target > node.val → search right
target = node.val → found
```
### How it works
1. Start at the root.
2. If the target equals the current value, return the node.
3. If the target is smaller, move left.
4. If the target is larger, move right.
5. Stop when the target is found or the current node becomes `null`.
**Memory flow:** `Compare → Eliminate one subtree → Continue`
### Iterative template
```java
TreeNode searchBST(
        TreeNode root,
        int target
) {
    TreeNode current = root;

    while (current != null) {
        if (current.val == target) {
            return current;
        }

        if (target < current.val) {
            current = current.left;
        } else {
            current = current.right;
        }
    }

    return null;
}
```
### Recursive template
```java
TreeNode searchBST(
        TreeNode root,
        int target
) {
    if (root == null || root.val == target) {
        return root;
    }

    if (target < root.val) {
        return searchBST(root.left, target);
    }

    return searchBST(root.right, target);
}
```
Practice:
- LC 700 — Search in a Binary Search Tree
- LC 938 — Range Sum of BST
- Find Floor in a BST
- Find Ceil in a BST
---
## Common Form 2: Validate a BST
A valid BST must satisfy the ordering rule across complete subtrees.
This tree is invalid:
```plain text
  10
 /  \
5    15
    /  \
   6    20
```
Although `6 < 15`, it is inside the right subtree of `10`, so it must also be greater than `10`.
### How it works using ranges
1. Give the root an unrestricted range.
2. Every node must lie strictly inside its permitted range.
3. For the left child, the current value becomes the upper bound.
4. For the right child, the current value becomes the lower bound.
5. Recursively validate both subtrees.
**Memory flow:** `Carry allowed range downward → Narrow range at every node`
```java
boolean isValidBST(TreeNode root) {
    return validate(
        root,
        Long.MIN_VALUE,
        Long.MAX_VALUE
    );
}

boolean validate(
        TreeNode node,
        long lower,
        long upper
) {
    if (node == null) {
        return true;
    }

    if (node.val <= lower || node.val >= upper) {
        return false;
    }

    return validate(node.left, lower, node.val)
        && validate(node.right, node.val, upper);
}
```
### Why use `long` boundaries?
A node may contain:
```java
Integer.MIN_VALUE
Integer.MAX_VALUE
```
Using those same integer values as exclusive boundaries could incorrectly reject valid nodes.
### Alternative: Validate inorder order
A valid BST’s inorder values must be strictly increasing.
```java
TreeNode previous;

boolean validate(TreeNode node) {
    if (node == null) {
        return true;
    }

    if (!validate(node.left)) {
        return false;
    }

    if (previous != null
            && previous.val >= node.val) {
        return false;
    }

    previous = node;

    return validate(node.right);
}
```
Practice:
- LC 98 — Validate Binary Search Tree
- LC 333 — Largest BST Subtree
- LC 1373 — Maximum Sum BST in Binary Tree
---
## Common Form 3: Insert into a BST
Insertion searches for the appropriate empty position while preserving BST ordering.
### How it works
1. If the current subtree is empty, create and return the new node.
2. If the value is smaller, insert into the left subtree.
3. If the value is larger, insert into the right subtree.
4. Reconnect the returned subtree.
5. Return the current root.
**Memory flow:** `Find null position → Create node → Reconnect while returning`
```java
TreeNode insertIntoBST(
        TreeNode root,
        int value
) {
    if (root == null) {
        return new TreeNode(value);
    }

    if (value < root.val) {
        root.left = insertIntoBST(root.left, value);
    } else {
        root.right = insertIntoBST(root.right, value);
    }

    return root;
}
```
### Recursive contract
> `insertIntoBST(root, value)` returns the root of the updated subtree after inserting `value`.
Practice:
- LC 701 — Insert into a Binary Search Tree
- LC 1382 — Balance a Binary Search Tree
- Build a BST from insertion order
---
## Common Form 4: Delete from a BST
Deletion has three cases.
### Case 1: Leaf node
```plain text
Delete the node and return null.
```
### Case 2: One child
```plain text
Return the existing child to replace the deleted node.
```
### Case 3: Two children
Replace the deleted node using either:
```plain text
Inorder successor   → smallest value in right subtree
Inorder predecessor → largest value in left subtree
```
Then delete the replacement value from its original position.
### How it works
1. Search for the target using BST ordering.
2. Reconnect the modified left or right subtree.
3. When the target is found, handle its child case.
4. For two children, copy the successor’s value.
5. Recursively delete that successor.
**Memory flow:** `Search → Handle child case → Return updated subtree root`
```java
TreeNode deleteNode(
        TreeNode root,
        int key
) {
    if (root == null) {
        return null;
    }

    if (key < root.val) {
        root.left = deleteNode(root.left, key);
    } else if (key > root.val) {
        root.right = deleteNode(root.right, key);
    } else {
        if (root.left == null) {
            return root.right;
        }

        if (root.right == null) {
            return root.left;
        }

        TreeNode successor = findMinimum(root.right);

        root.val = successor.val;
        root.right = deleteNode(
            root.right,
            successor.val
        );
    }

    return root;
}

TreeNode findMinimum(TreeNode node) {
    while (node.left != null) {
        node = node.left;
    }

    return node;
}
```
### Why reconnect returned subtrees?
Deletion can change the root of a subtree:
```java
root.left = deleteNode(root.left, key);
```
Without assignment, the parent may continue pointing to the deleted node.
Practice:
- LC 450 — Delete Node in a BST
- LC 669 — Trim a Binary Search Tree
---
## Common Form 5: Ordered Inorder Problems
Use inorder when the question depends on sorted BST order.
Examples:
- kth smallest
- minimum difference
- two-sum using sorted values
- recovering swapped nodes
- converting BST into an ordered structure
### How it works
1. Traverse the left subtree.
2. Process the current value as the next value in sorted order.
3. Compare it with previously processed values when required.
4. Traverse the right subtree.
5. Stop early when the answer is found.
**Memory flow:** `Generate values in sorted order → Process only what is needed`
### Kth-smallest template
```java
int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode current = root;

    while (current != null || !stack.isEmpty()) {
        while (current != null) {
            stack.push(current);
            current = current.left;
        }

        current = stack.pop();
        k--;

        if (k == 0) {
            return current.val;
        }

        current = current.right;
    }

    return -1;
}
```
### Minimum-difference idea
Because inorder is sorted, the smallest difference must occur between consecutive inorder values.
```java
TreeNode previous;
int minimum = Integer.MAX_VALUE;

void inorder(TreeNode node) {
    if (node == null) {
        return;
    }

    inorder(node.left);

    if (previous != null) {
        minimum = Math.min(
            minimum,
            node.val - previous.val
        );
    }

    previous = node;

    inorder(node.right);
}
```
Practice:
- LC 230 — Kth Smallest Element in a BST
- LC 530 — Minimum Absolute Difference in BST
- LC 501 — Find Mode in Binary Search Tree
- LC 653 — Two Sum IV
- LC 99 — Recover Binary Search Tree
---
## Common Form 6: Floor, Ceiling, Predecessor and Successor
These questions ask for the nearest value satisfying an ordering condition.
```plain text
Floor:
largest value <= target

Ceiling:
smallest value >= target

Predecessor:
largest value < node

Successor:
smallest value > node
```
### How floor works
1. If the current value equals the target, it is the floor.
2. If the current value is greater, move left.
3. If the current value is smaller, save it as a candidate and move right.
4. A larger valid candidate may exist in the right subtree.
**Memory flow:** `Save valid candidate → Search for a closer candidate`
```java
Integer floor(TreeNode root, int target) {
    Integer answer = null;
    TreeNode current = root;

    while (current != null) {
        if (current.val == target) {
            return current.val;
        }

        if (current.val > target) {
            current = current.left;
        } else {
            answer = current.val;
            current = current.right;
        }
    }

    return answer;
}
```
### How ceiling differs
For ceiling:
```plain text
current.val < target → move right
current.val > target → save candidate and move left
```
### Successor using the tree root
```java
TreeNode successor(
        TreeNode root,
        TreeNode target
) {
    TreeNode candidate = null;

    while (root != null) {
        if (target.val < root.val) {
            candidate = root;
            root = root.left;
        } else {
            root = root.right;
        }
    }

    return candidate;
}
```
Practice:
- LC 285 — Inorder Successor in BST
- LC 510 — Inorder Successor in BST II
- LC 270 — Closest Binary Search Tree Value
- Find Floor and Ceil in a BST
---
## Common Form 7: Lowest Common Ancestor in a BST
A BST allows us to locate the LCA without searching both complete subtrees.
### How it works
For the current node:
```plain text
p and q are both smaller → LCA is in the left subtree
p and q are both larger  → LCA is in the right subtree
They split across sides  → current node is the LCA
```
The current node may itself equal one target.
**Memory flow:** `Compare both targets → Move together or stop at split`
```java
TreeNode lowestCommonAncestor(
        TreeNode root,
        TreeNode p,
        TreeNode q
) {
    TreeNode current = root;

    while (current != null) {
        if (p.val < current.val
                && q.val < current.val) {
            current = current.left;
        } else if (p.val > current.val
                && q.val > current.val) {
            current = current.right;
        } else {
            return current;
        }
    }

    return null;
}
```
### Split-point mental model
> The LCA is the first node where the two target values no longer move in the same direction.
Practice:
- LC 235 — Lowest Common Ancestor of a BST
- LC 236 — Lowest Common Ancestor of a Binary Tree
---
## Common Form 8: Range-Based BST Problems
BST ordering allows entire subtrees to be skipped.
For a required range:
```plain text
[low, high]
```
At a node:
```plain text
node.val < low  → left subtree is also too small
node.val > high → right subtree is also too large
```
### How it works
1. Compare the current value with the permitted range.
2. If it is too small, skip the entire left subtree.
3. If it is too large, skip the entire right subtree.
4. If it is inside the range, process it and explore both subtrees.
**Memory flow:** `Compare with range → Prune impossible subtree`
### Range-sum template
```java
int rangeSumBST(
        TreeNode root,
        int low,
        int high
) {
    if (root == null) {
        return 0;
    }

    if (root.val < low) {
        return rangeSumBST(root.right, low, high);
    }

    if (root.val > high) {
        return rangeSumBST(root.left, low, high);
    }

    return root.val
        + rangeSumBST(root.left, low, high)
        + rangeSumBST(root.right, low, high);
}
```
### Trimming template idea
```plain text
node.val < low  → discard node and its left subtree
node.val > high → discard node and its right subtree
otherwise       → recursively trim both children
```
Practice:
- LC 938 — Range Sum of BST
- LC 669 — Trim a Binary Search Tree
- LC 776 — Split BST
- LC 1214 — Two Sum BSTs
---
## Common Form 9: Construct or Balance a BST
BSTs can be constructed efficiently from sorted information.
To produce a balanced BST from a sorted array, choose the middle element as the root.
### How it works
1. Choose the middle value as the current root.
2. Values before the middle belong to the left subtree.
3. Values after the middle belong to the right subtree.
4. Recursively construct both sides.
5. Return the current root.
**Memory flow:** `Choose middle → Build left half → Build right half`
```java
TreeNode build(
        int[] nums,
        int left,
        int right
) {
    if (left > right) {
        return null;
    }

    int middle = left + (right - left) / 2;

    TreeNode root = new TreeNode(nums[middle]);

    root.left = build(nums, left, middle - 1);
    root.right = build(nums, middle + 1, right);

    return root;
}
```
### Why choose the middle?
Choosing the middle keeps the two subtree sizes close:
```plain text
Height: O(log n)
```
Repeatedly inserting sorted values would instead create a skewed tree.
Practice:
- LC 108 — Convert Sorted Array to BST
- LC 109 — Convert Sorted List to BST
- LC 1008 — Construct BST from Preorder Traversal
- LC 1382 — Balance a Binary Search Tree
- LC 449 — Serialize and Deserialize BST
---
## Common Form 10: BST Iterator
A BST iterator returns values one at a time in sorted order without storing the complete traversal.
It performs controlled iterative inorder traversal.
### How it works
1. Push the complete left chain onto a stack.
2. The top of the stack is the next smallest node.
3. Pop that node when `next()` is called.
4. Push the left chain of its right subtree.
5. Repeat until the stack becomes empty.
**Memory flow:** `Store path to next smallest → Pop one → Prepare its successor`
```java
class BSTIterator {
    private Deque<TreeNode> stack =
        new ArrayDeque<>();

    BSTIterator(TreeNode root) {
        pushLeft(root);
    }

    private void pushLeft(TreeNode node) {
        while (node != null) {
            stack.push(node);
            node = node.left;
        }
    }

    int next() {
        TreeNode node = stack.pop();
        pushLeft(node.right);
        return node.val;
    }

    boolean hasNext() {
        return !stack.isEmpty();
    }
}
```
### Complexity
Each node is pushed and popped once:
```plain text
next():    O(1) amortized
hasNext(): O(1)
Space:     O(h)
```
Practice:
- LC 173 — Binary Search Tree Iterator
- LC 653 — Two Sum IV
- LC 1586 — Binary Search Tree Iterator II
---
# BST Decision Guide
```plain text
Find a value
→ Compare and choose one subtree

Check whether the tree is a BST
→ Carry valid lower and upper bounds

Need sorted values
→ Inorder traversal

Need kth smallest
→ Stop inorder after k nodes

Need nearest smaller/larger value
→ Save candidate while searching

Need LCA
→ Find where target directions split

Need values in a range
→ Prune impossible subtrees

Insert or delete
→ Return the updated subtree root

Build a balanced BST
→ Choose the middle value recursively

Return sorted values one at a time
→ Controlled inorder with a stack
```
---
# BST Search versus Full Traversal
Use BST-directed search when ordering eliminates a subtree:
```java
if (target < node.val) {
    search(node.left);
} else {
    search(node.right);
}
```
Use full traversal when both subtrees may contain part of the answer:
```java
solve(node.left);
solve(node.right);
```
Examples requiring both sides:
- Calculate tree height
- Calculate diameter
- Count every node
- Transform every value
- Find structural properties unrelated to ordering
> Do not force BST search into a problem where the ordering does not eliminate any possibilities.
---
# Duplicate Values
Different BST definitions may handle duplicates differently:
```plain text
Duplicates forbidden
Duplicates always placed left
Duplicates always placed right
Duplicates counted inside the node
```
LeetCode BST problems commonly assume distinct values unless stated otherwise.
Always check the problem’s rule before using:
```plain text
< and >
```
versus:
```plain text
<= and >=
```
---
# Quick Interview Checklist
1. Is the input guaranteed to be a BST?
2. Are duplicate values allowed?
3. What exact ordering rule applies to duplicates?
4. Can comparison eliminate an entire subtree?
5. Would inorder produce the order I need?
6. Can inorder stop early?
7. Does validation require ancestor boundaries?
8. Should boundaries use `long`?
9. Do I need a running candidate for floor or ceiling?
10. Is the answer based on node identity or value?
11. Does insertion or deletion change a subtree root?
12. Did I reconnect the returned subtree?
13. Which deletion case applies?
14. Should I use the predecessor or successor?
15. Can range conditions prune a subtree?
16. Is the tree guaranteed to be balanced?
17. What is the height in the worst case?
18. Is recursion safe for a skewed tree?
19. Can I use an explicit stack?
20. What information should each subtree return?
---
# Common Mistakes
- Checking only immediate children while validating a BST.
- Assuming every binary tree is a BST.
- Assuming every BST is balanced.
- Claiming every BST operation is always `O(log n)`.
- Ignoring the `O(n)` skewed-tree case.
- Using `int` boundaries when values can equal integer limits.
- Using inorder ordering without ensuring the tree is a valid BST.
- Traversing both subtrees when comparison can eliminate one.
- Forgetting to stop inorder after finding the kth element.
- Comparing a node with itself as the previous inorder node.
- Using absolute difference unnecessarily for sorted inorder values.
- Forgetting to save a floor or ceiling candidate.
- Returning the wrong candidate after moving away from it.
- Mishandling deletion when the node has two children.
- Forgetting to reconnect the subtree returned by insertion or deletion.
- Losing a child reference while modifying the tree.
- Assuming duplicates are forbidden without checking.
- Using node values when node identity matters.
- Keeping recursive or global state between separate executions.
---
# Complexity Analysis
Let:
```plain text
n = number of nodes
h = tree height
```
## Search, insertion and deletion
```plain text
Time:  O(h)
Space: O(h) recursive
       O(1) iterative
```
Balanced BST:
```plain text
Time: O(log n)
```
Skewed BST:
```plain text
Time: O(n)
```
## Full inorder traversal
```plain text
Time:  O(n)
Space: O(h)
```
## Range queries
With pruning, only relevant parts may be visited.
Worst case:
```plain text
Time: O(n)
```
## Construct balanced BST from a sorted array
```plain text
Time:  O(n)
Stack: O(log n)
```
## BST iterator
```plain text
Initialization: O(h)
next():         O(1) amortized
hasNext():      O(1)
Space:          O(h)
```
---
# Final Reusable Model
> A BST is a binary tree where ordering allows you to either generate sorted values or eliminate an entire subtree.
```plain text
Compare with current node
→ Move left or right

Need global ordering
→ Use inorder

Need structural validity
→ Carry ancestor bounds

Need nearest valid value
→ Save a candidate

Need a range
→ Prune impossible branches

Need structural changes
→ Return and reconnect subtree roots
```
The key interview question is:
> “How can the BST ordering rule reduce the amount of tree I need to explore?”
# Backtracking
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
# Core Mental Model
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
# Recursion versus Backtracking
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
# Decision Tree Mental Model
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
# Anatomy of Backtracking
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
# How to Identify Backtracking Problems
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
# The Backtracking State
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
# Common Forms
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
# Choosing the Correct Form
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
# Understanding the Start Index
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
# When to Save an Answer
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
# Mutable State versus Value State
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
# Returning Boolean versus Collecting All Answers
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
# Backtracking versus Dynamic Programming
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
# Quick Interview Checklist
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
# Common Mistakes
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
# Complexity Analysis
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
# Final Reusable Model
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
# Graph Traversal Problems
A graph represents objects and the connections between them.
```plain text
Objects      → vertices or nodes
Connections  → edges
```
Example:
```plain text
0 ─── 1
│     │
│     │
2 ─── 3
```
The graph can be represented as:
```plain text
0 → [1, 2]
1 → [0, 3]
2 → [0, 3]
3 → [1, 2]
```
Unlike a tree:
- A graph may contain cycles.
- A node may have multiple incoming connections.
- The graph may be disconnected.
- There may be several paths between two nodes.
- There may not be a single root.
Because of these differences, graph traversal normally requires a `visited` structure.
---
# Core Mental Model
> Start from a node, process it, and discover its unvisited neighbors.
The two fundamental graph traversals are:
```plain text
DFS → Follow one path deeply before returning
BFS → Explore all nearby nodes before moving farther
```
Both can visit every reachable node.
The major difference is the order in which they explore nodes.
---
# DFS versus BFS
## Depth-First Search
DFS follows one path as far as possible.
```plain text
Start
→ Neighbor
→ Neighbor's neighbor
→ Continue deeply
→ Backtrack
```
DFS uses:
```plain text
Recursion
or
Explicit stack
```
## Breadth-First Search
BFS explores nodes by distance from the starting node.
```plain text
Distance 0
→ Distance 1
→ Distance 2
→ Distance 3
```
BFS uses:
```plain text
Queue
```
## Decision guide
```plain text
Need to visit all reachable nodes
→ DFS or BFS

Need the shortest path in an unweighted graph
→ BFS

Need nodes level by level
→ BFS

Need recursive exploration or backtracking
→ DFS

Need to analyze complete connected regions
→ DFS or BFS

Need to reconstruct the shortest path
→ BFS with a parent map

Need to detect structure after exploring descendants
→ DFS

Concerned about deep recursion
→ Iterative DFS or BFS
```
---
# Graph Terminology
## Vertex
An individual graph node.
```plain text
0, 1, 2, 3
```
## Edge
A connection between two vertices.
```plain text
0 — 1
```
## Directed edge
The connection has one direction:
```plain text
0 → 1
```
This does not automatically mean:
```plain text
1 → 0
```
## Undirected edge
The connection works in both directions:
```plain text
0 — 1
```
Represent it using:
```plain text
0 → 1
1 → 0
```
## Path
A sequence of connected vertices:
```plain text
0 → 1 → 3
```
## Cycle
A path that returns to a previously visited node:
```plain text
0 → 1 → 2 → 0
```
## Connected component
A group of vertices that can reach one another.
```plain text
0 — 1       3 — 4

Component 1  Component 2
```
## Degree
For an undirected graph:
```plain text
Degree of node = number of connected edges
```
For a directed graph:
```plain text
Indegree  = number of incoming edges
Outdegree = number of outgoing edges
```
---
# Graph Representations
## Adjacency List
Store every node’s neighbors.
```java
List<List<Integer>> graph =
    new ArrayList<>();

for (int i = 0; i < n; i++) {
    graph.add(new ArrayList<>());
}
```
For an undirected edge:
```java
graph.get(u).add(v);
graph.get(v).add(u);
```
For a directed edge:
```java
graph.get(u).add(v);
```
### Complexity
```plain text
Space: O(V + E)
```
This is usually the preferred representation for interview problems.
---
## Adjacency Matrix
```java
int[][] graph = new int[n][n];
```
For an edge:
```java
graph[u][v] = 1;
```
For an undirected edge:
```java
graph[u][v] = 1;
graph[v][u] = 1;
```
### Complexity
```plain text
Space: O(V²)
```
Use it when:
- The graph is dense.
- Constant-time edge lookup is important.
- The number of vertices is small.
- An all-pairs algorithm requires a matrix.
---
## Map-Based Adjacency List
Useful when nodes are strings or arbitrary values:
```java
Map<String, List<String>> graph =
    new HashMap<>();
```
```java
graph.computeIfAbsent(from, key -> new ArrayList<>())
     .add(to);
```
Used in problems such as:
- Evaluate Division
- Word transformations
- Currency conversion
- Account relationships
---
# Building the Graph Correctly
For:
```java
int[][] edges
```
## Undirected graph
```java
for (int[] edge : edges) {
    int u = edge[0];
    int v = edge[1];

    graph.get(u).add(v);
    graph.get(v).add(u);
}
```
## Directed graph
```java
for (int[] edge : edges) {
    int from = edge[0];
    int to = edge[1];

    graph.get(from).add(to);
}
```
### Critical question
> Does the relationship work in one direction or both?
Many graph solutions fail because the graph was constructed in the wrong direction.
---
# Why We Need `visited`
Consider:
```plain text
0 — 1
```
An undirected graph stores:
```plain text
0 → 1
1 → 0
```
Without `visited`:
```plain text
0 visits 1
1 visits 0
0 visits 1
...
```
Traversal never ends.
The visited structure ensures:
> Every node is processed at most once.
For integer nodes:
```java
boolean[] visited = new boolean[n];
```
For string or object nodes:
```java
Set<String> visited = new HashSet<>();
```
---
# When to Mark a Node Visited
## DFS
Mark the node when entering it:
```java
visited[node] = true;
```
## BFS
Mark the node when adding it to the queue:
```java
visited[next] = true;
queue.offer(next);
```
Do not wait until removing it from the queue.
### Why?
Two nodes might discover the same neighbor:
```plain text
  A
 / \
B   C
 \ /
  D
```
If `D` is marked only when removed:
```plain text
B adds D
C also adds D
```
Now `D` appears in the queue twice.
Correct:
```java
if (!visited[next]) {
    visited[next] = true;
    queue.offer(next);
}
```
---
# Common Forms
## Common Form 1: Recursive DFS Traversal
Recursive DFS explores one neighbor completely before trying the next neighbor.
### How it works
1. Mark the current node visited.
2. Process the current node.
3. Examine each neighbor.
4. Recursively visit every unvisited neighbor.
5. Return when all neighbors have been explored.
**Memory flow:** `Enter node → Mark visited → Explore neighbors → Return`
```java
void dfs(
        int node,
        List<List<Integer>> graph,
        boolean[] visited
) {
    visited[node] = true;

    // Process node here.

    for (int neighbor : graph.get(node)) {
        if (!visited[neighbor]) {
            dfs(neighbor, graph, visited);
        }
    }
}
```
### Recursive contract
> `dfs(node)` visits every unvisited node reachable from `node`.
Practice:
- LC 1971 — Find if Path Exists in Graph
- LC 841 — Keys and Rooms
- LC 547 — Number of Provinces
- LC 1319 — Number of Operations to Make Network Connected
---
## Common Form 2: Iterative DFS
Iterative DFS replaces the recursive call stack with an explicit stack.
### How it works
1. Push the starting node.
2. Mark it visited.
3. Pop one node.
4. Process it.
5. Push its unvisited neighbors.
6. Continue until the stack is empty.
**Memory flow:** `Push start → Pop node → Push unvisited neighbors`
```java
void dfs(
        int start,
        List<List<Integer>> graph
) {
    boolean[] visited =
        new boolean[graph.size()];

    Deque<Integer> stack = new ArrayDeque<>();

    stack.push(start);
    visited[start] = true;

    while (!stack.isEmpty()) {
        int node = stack.pop();

        // Process node here.

        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                stack.push(neighbor);
            }
        }
    }
}
```
### When iterative DFS is useful
- The graph may be too deep for recursion.
- Stack overflow is a concern.
- You want explicit control over traversal order.
- The language has a limited call stack.
Practice:
- LC 1971 — Find if Path Exists in Graph
- LC 841 — Keys and Rooms
- LC 133 — Clone Graph
---
## Common Form 3: Basic BFS Traversal
BFS explores all nodes one edge away before nodes two edges away.
### How it works
1. Add the starting node to the queue.
2. Mark it visited immediately.
3. Remove the front node.
4. Process it.
5. Add every unvisited neighbor.
6. Continue until the queue is empty.
**Memory flow:** `Offer start → Poll node → Offer unvisited neighbors`
```java
void bfs(
        int start,
        List<List<Integer>> graph
) {
    boolean[] visited =
        new boolean[graph.size()];

    Deque<Integer> queue = new ArrayDeque<>();

    queue.offer(start);
    visited[start] = true;

    while (!queue.isEmpty()) {
        int node = queue.poll();

        // Process node here.

        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.offer(neighbor);
            }
        }
    }
}
```
### Queue invariant
> Every node currently in the queue has been discovered but not yet processed.
Practice:
- LC 1971 — Find if Path Exists in Graph
- LC 841 — Keys and Rooms
- LC 1319 — Number of Operations to Make Network Connected
---
## Common Form 4: Reachability and Path Existence
These problems ask whether one node can reach another.
You do not need to traverse the rest of the graph after finding the target.
### How it works
1. Start DFS or BFS from the source.
2. Mark nodes visited as they are discovered.
3. Explore reachable neighbors.
4. Return immediately when the destination is found.
5. Return `false` if traversal finishes without finding it.
**Memory flow:** `Start from source → Explore reachable nodes → Stop at destination`
### BFS template
```java
boolean hasPath(
        int source,
        int destination,
        List<List<Integer>> graph
) {
    boolean[] visited =
        new boolean[graph.size()];

    Deque<Integer> queue = new ArrayDeque<>();

    queue.offer(source);
    visited[source] = true;

    while (!queue.isEmpty()) {
        int node = queue.poll();

        if (node == destination) {
            return true;
        }

        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.offer(neighbor);
            }
        }
    }

    return false;
}
```
### DFS template
```java
boolean hasPath(
        int node,
        int destination,
        List<List<Integer>> graph,
        boolean[] visited
) {
    if (node == destination) {
        return true;
    }

    visited[node] = true;

    for (int neighbor : graph.get(node)) {
        if (!visited[neighbor]
                && hasPath(
                    neighbor,
                    destination,
                    graph,
                    visited
                )) {
            return true;
        }
    }

    return false;
}
```
Practice:
- LC 1971 — Find if Path Exists in Graph
- LC 841 — Keys and Rooms
- LC 1466 — Reorder Routes to Make All Paths Lead to Zero
---
## Common Form 5: Connected Components
One DFS or BFS visits only the component containing its starting node.
To process the complete graph, start another traversal from every still-unvisited node.
### How it works
1. Iterate through all vertices.
2. If a vertex has already been visited, skip it.
3. Otherwise, a new connected component has been found.
4. Increment the component count.
5. Traverse from that node to mark its entire component.
**Memory flow:** `Find unvisited node → Count component → Mark complete component`
```java
int countComponents(
        int n,
        List<List<Integer>> graph
) {
    boolean[] visited = new boolean[n];
    int components = 0;

    for (int node = 0; node < n; node++) {
        if (!visited[node]) {
            components++;
            dfs(node, graph, visited);
        }
    }

    return components;
}
```
### Important principle
```plain text
One traversal call
= one complete connected component
```
Practice:
- LC 547 — Number of Provinces
- LC 323 — Number of Connected Components
- LC 1319 — Number of Operations to Make Network Connected
- LC 2316 — Count Unreachable Pairs of Nodes
---
## Common Form 6: Component Size
Sometimes the question needs the number of nodes in every connected component.
### How it works
1. Start traversal from an unvisited node.
2. Count the current node.
3. Recursively count every unvisited neighbor.
4. Return the total size to the caller.
5. Use component sizes to calculate the final answer.
**Memory flow:** `Count current node → Add reachable component sizes → Return total`
```java
int componentSize(
        int node,
        List<List<Integer>> graph,
        boolean[] visited
) {
    visited[node] = true;

    int size = 1;

    for (int neighbor : graph.get(node)) {
        if (!visited[neighbor]) {
            size += componentSize(
                neighbor,
                graph,
                visited
            );
        }
    }

    return size;
}
```
### Example use: unreachable pairs
If previously processed components contain `seen` nodes and the new component contains `size` nodes:
```java
answer += (long) seen * size;
seen += size;
```
This counts pairs containing one node from the new component and one from an earlier component.
Practice:
- LC 2316 — Count Unreachable Pairs of Nodes
- LC 695 — Max Area of Island
- LC 1020 — Number of Enclaves
- LC 1905 — Count Sub Islands
---
## Common Form 7: Unweighted Shortest Path
In an unweighted graph, BFS finds the path using the fewest edges.
### Why BFS works
BFS processes nodes in distance order:
```plain text
Source           → distance 0
Source neighbors → distance 1
Their neighbors  → distance 2
```
The first time a node is discovered, BFS has reached it using the minimum number of edges.
### How it works
1. Set the source distance to `0`.
2. Add the source to the queue.
3. For every unvisited neighbor, set:
	`distance[neighbor] = distance[node] + 1`.
4. Add the neighbor to the queue.
5. Stop when the destination is reached or traversal finishes.
**Memory flow:** `Process distance d → Discover nodes at distance d + 1`
```java
int shortestPath(
        int source,
        int destination,
        List<List<Integer>> graph
) {
    int[] distance = new int[graph.size()];
    Arrays.fill(distance, -1);

    Deque<Integer> queue = new ArrayDeque<>();

    queue.offer(source);
    distance[source] = 0;

    while (!queue.isEmpty()) {
        int node = queue.poll();

        if (node == destination) {
            return distance[node];
        }

        for (int neighbor : graph.get(node)) {
            if (distance[neighbor] == -1) {
                distance[neighbor] =
                    distance[node] + 1;

                queue.offer(neighbor);
            }
        }
    }

    return -1;
}
```
Here, `distance[neighbor] == -1` also acts as the visited check.
Practice:
- LC 752 — Open the Lock
- LC 127 — Word Ladder
- LC 433 — Minimum Genetic Mutation
- LC 1091 — Shortest Path in Binary Matrix
- LC 815 — Bus Routes
---
## Common Form 8: Level-Based BFS
Use this when the answer changes once per BFS layer.
Examples:
- Number of transformations
- Number of minutes
- Distance from the source
- Nodes at exactly distance `K`
### How it works
1. Record the queue’s current size.
2. Process exactly that many nodes.
3. Add their undiscovered neighbors.
4. After the level finishes, increase distance or time.
5. The newly added nodes form the next level.
**Memory flow:** `Capture level size → Process current layer → Increment distance`
```java
int distance = 0;

while (!queue.isEmpty()) {
    int size = queue.size();

    for (int i = 0; i < size; i++) {
        int node = queue.poll();

        // Process current-level node.

        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.offer(neighbor);
            }
        }
    }

    distance++;
}
```
### Why capture `size` first?
The queue changes while processing the level.
Without capturing its original size, nodes from the next level could be processed in the current level.
Practice:
- LC 752 — Open the Lock
- LC 127 — Word Ladder
- LC 863 — All Nodes Distance K in Binary Tree
- LC 994 — Rotting Oranges
---
## Common Form 9: Multi-Source BFS
Normal BFS starts from one source.
Multi-source BFS starts from every source simultaneously.
Example:
```plain text
Several infected nodes spread at the same time.
```
### How it works
1. Add every initial source to the queue.
2. Mark every source visited or give it distance `0`.
3. Run ordinary BFS.
4. Each BFS level represents simultaneous expansion from all sources.
5. Every node is reached by its nearest source.
**Memory flow:** `Add all sources → Expand together → Record nearest distance`
```java
Deque<Integer> queue = new ArrayDeque<>();
int[] distance = new int[n];

Arrays.fill(distance, -1);

for (int source : sources) {
    queue.offer(source);
    distance[source] = 0;
}

while (!queue.isEmpty()) {
    int node = queue.poll();

    for (int neighbor : graph.get(node)) {
        if (distance[neighbor] == -1) {
            distance[neighbor] =
                distance[node] + 1;

            queue.offer(neighbor);
        }
    }
}
```
### Why not run BFS separately from every source?
Separate BFS executions may cost:
```plain text
O(number of sources × (V + E))
```
A single multi-source BFS costs:
```plain text
O(V + E)
```
Practice:
- LC 994 — Rotting Oranges
- LC 542 — 01 Matrix
- LC 1162 — As Far from Land as Possible
- LC 1765 — Map of Highest Peak
---
## Common Form 10: Clone a Graph
Cloning requires creating exactly one new node for each original node while preserving connections.
A visited boolean is insufficient because we must also remember:
```plain text
original node → cloned node
```
### How it works
1. Create a clone for the starting node.
2. Store it in a map.
3. Traverse each original neighbor.
4. If a neighbor has not been cloned, recursively clone it.
5. Connect the current clone to the neighbor’s clone.
6. Return the clone associated with the current node.
**Memory flow:** `Map original to clone → Clone neighbors → Connect clones`
```java
Node cloneGraph(Node node) {
    if (node == null) {
        return null;
    }

    Map<Node, Node> clones = new HashMap<>();

    return clone(node, clones);
}

Node clone(
        Node node,
        Map<Node, Node> clones
) {
    if (clones.containsKey(node)) {
        return clones.get(node);
    }

    Node copy = new Node(node.val);
    clones.put(node, copy);

    for (Node neighbor : node.neighbors) {
        copy.neighbors.add(
            clone(neighbor, clones)
        );
    }

    return copy;
}
```
### Why store the clone before recursion?
If the graph contains a cycle, recursion may return to the same node.
The mapping must already exist so the repeated visit can return the existing clone instead of creating another one.
Practice:
- LC 133 — Clone Graph
- LC 138 — Copy List with Random Pointer
---
## Common Form 11: Path Reconstruction
A distance tells us how far the destination is, but not which path produced that distance.
To reconstruct the path, store which node first discovered every neighbor.
### How it works
1. Run BFS from the source.
2. When discovering a neighbor, store:
	`parent[neighbor] = current`.
3. Stop when the destination is found.
4. Start at the destination.
5. Follow parents backward to the source.
6. Reverse the collected sequence.
**Memory flow:** `Discover node → Save predecessor → Trace backward → Reverse`
```java
List<Integer> shortestPath(
        int source,
        int destination,
        List<List<Integer>> graph
) {
    int n = graph.size();

    boolean[] visited = new boolean[n];
    int[] parent = new int[n];

    Arrays.fill(parent, -1);

    Deque<Integer> queue = new ArrayDeque<>();

    queue.offer(source);
    visited[source] = true;

    while (!queue.isEmpty()) {
        int node = queue.poll();

        if (node == destination) {
            break;
        }

        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                parent[neighbor] = node;
                queue.offer(neighbor);
            }
        }
    }

    if (!visited[destination]) {
        return List.of();
    }

    List<Integer> path = new ArrayList<>();

    for (int node = destination;
            node != -1;
            node = parent[node]) {
        path.add(node);
    }

    Collections.reverse(path);
    return path;
}
```
Practice:
- LC 126 — Word Ladder II
- LC 815 — Bus Routes
- Shortest Path in an Unweighted Graph
- Print Shortest Path using BFS
---
# DFS with Returning Information
DFS does not always return `void`.
It can return information about the reachable structure.
```java
int dfs(int node) {
    visited[node] = true;

    int answer = 1;

    for (int neighbor : graph.get(node)) {
        if (!visited[neighbor]) {
            answer += dfs(neighbor);
        }
    }

    return answer;
}
```
Possible return values include:
```plain text
Component size
Whether the target was found
Maximum depth
Minimum or maximum reachable value
Whether the component satisfies a condition
```
Before coding, define:
> `dfs(node)` returns  for the unvisited graph reachable from `node`.
---
# BFS Without a Separate `visited` Array
A separate `visited` structure is not required when another structure already records discovery.
For shortest path:
```java
if (distance[neighbor] == -1) {
    distance[neighbor] = distance[node] + 1;
    queue.offer(neighbor);
}
```
Here:
```plain text
distance == -1 → not visited
distance >= 0  → already discovered
```
Similarly, a parent map can sometimes represent visited state:
```java
if (!parent.containsKey(neighbor)) {
    parent.put(neighbor, node);
}
```
> You still need visited information; it may simply be stored inside another structure.
---
# Traversing Disconnected Graphs
Starting from node `0` does not guarantee that every graph node will be visited.
```plain text
0 — 1       2 — 3
```
DFS from `0` reaches only:
```plain text
0, 1
```
To process the complete graph:
```java
for (int node = 0; node < n; node++) {
    if (!visited[node]) {
        dfs(node, graph, visited);
    }
}
```
Use this outer loop when the question concerns:
- Every vertex
- Number of components
- Whether every component satisfies a condition
- Complete graph traversal
Do not use it when the question asks only what is reachable from a specific source.
---
# Marking Visited: Global versus Current Path
These represent different ideas.
## Globally visited
```plain text
This node has already been completely discovered.
```
Used for:
- Normal DFS
- BFS
- Connected components
- Shortest path
## Current DFS path
```plain text
This node is part of the active recursive route.
```
Used for:
- Directed-cycle detection
- Backtracking
- Certain path enumeration problems
A node may be globally visited but no longer belong to the current recursive path.
We will cover this distinction fully in cycle detection.
---
# BFS Level versus Distance Array
Both can track distance.
## Level counter
Use when all nodes in one BFS layer share the same meaning:
```java
int level = 0;

while (!queue.isEmpty()) {
    int size = queue.size();

    // Process the complete level.

    level++;
}
```
## Distance array
Use when you need:
- The distance to many individual nodes
- Path reconstruction
- Distances after traversal finishes
- A visited marker combined with distance
```java
distance[neighbor] = distance[node] + 1;
```
---
# Quick Interview Checklist
1. What represents a graph node?
2. What represents an edge?
3. Is the graph directed or undirected?
4. Is it weighted or unweighted?
5. How should the adjacency list be constructed?
6. Should every edge be added once or twice?
7. Are nodes integers, strings, or objects?
8. What does visited mean in this problem?
9. When should a node be marked visited?
10. Is the graph guaranteed to be connected?
11. Am I exploring one source or the complete graph?
12. Is either BFS or DFS sufficient?
13. Do I need the shortest number of edges?
14. Do I need level-by-level processing?
15. Are there multiple starting sources?
16. Do I need to reconstruct the actual path?
17. Can another structure also track visited state?
18. Could recursive DFS overflow the call stack?
19. What does my DFS function return?
20. What are `V` and `E` for this problem?
---
# Common Mistakes
- Constructing a directed graph when the edges are undirected.
- Adding both directions for a directed edge.
- Forgetting to initialize adjacency lists for nodes without edges.
- Starting from node `0` and assuming the whole graph was visited.
- Forgetting the outer loop for disconnected graphs.
- Not using a visited structure in a cyclic graph.
- Marking BFS nodes visited only when polling them.
- Adding the same node to the queue several times.
- Using DFS for an unweighted shortest-path question without a valid reason.
- Assuming BFS finds minimum weighted distance.
- Increasing BFS distance once per node instead of once per level.
- Not capturing the queue size before processing a level.
- Running separate BFS from every source instead of multi-source BFS.
- Using only a visited boolean when cloning requires original-to-copy mapping.
- Storing parents but forgetting to reverse the reconstructed path.
- Confusing current-path state with globally visited state.
- Using recursive DFS without considering graph depth.
- Claiming graph traversal is always `O(V²)`.
---
# Complexity Analysis
Let:
```plain text
V = number of vertices
E = number of edges
```
## Adjacency-list construction
```plain text
Time:  O(V + E)
Space: O(V + E)
```
## DFS
Every vertex is visited once, and every adjacency entry is examined once:
```plain text
Time:  O(V + E)
Space: O(V)
```
Recursive stack:
```plain text
O(V) worst case
```
## BFS
Every vertex enters the queue at most once:
```plain text
Time:  O(V + E)
Space: O(V)
```
## Adjacency matrix traversal
Finding all neighbors of one node requires scanning an entire row:
```plain text
Time: O(V²)
```
## Connected components
Although DFS or BFS may start several times, every node and edge is still processed only once overall:
```plain text
Time:  O(V + E)
Space: O(V)
```
## Path reconstruction
BFS:
```plain text
O(V + E)
```
Tracing the final path:
```plain text
O(V) worst case
```
Total remains:
```plain text
O(V + E)
```
---
# Final Reusable Model
```plain text
Build adjacency list
→ Choose starting node
→ Mark it discovered
→ Process nodes
→ Explore unvisited neighbors
```
Use DFS when:
```plain text
Explore deeply
Process connected structures
Return information through recursion
```
Use BFS when:
```plain text
Explore by distance
Find an unweighted shortest path
Process levels
Expand from multiple sources
```
The most important interview question is:
> “What exactly makes a node discovered, and when should I prevent it from being added again?”
# Union-Find / Disjoint Set Union
Union-Find, also called Disjoint Set Union or DSU, maintains a collection of non-overlapping connected groups.
It efficiently answers two questions:
```plain text
Find:
Which connected group does this node belong to?

Union:
Combine the groups containing two nodes.
```
Example:
```plain text
0 — 1     2 — 3
```
Initially:
```plain text
Component A: {0, 1}
Component B: {2, 3}
```
After adding edge:
```plain text
1 — 2
```
Union-Find merges them:
```plain text
Component: {0, 1, 2, 3}
```
---
# Core Mental Model
> Every connected component chooses one representative node called its root.
Nodes in the same component have the same root:
```plain text
find(0) == find(1)
→ 0 and 1 are connected

find(0) != find(3)
→ 0 and 3 are in different components
```
When an edge connects two components:
```plain text
union(0, 3)
```
one component root is attached to the other.
---
# When to Use Union-Find
Look for these signals:
- Edges are being added over time.
- You repeatedly need to determine whether two nodes are connected.
- You need to merge groups.
- You need to count connected components.
- You need to detect whether an edge creates a cycle.
- You need to group equivalent items.
- The problem contains relationships such as “belongs to the same group.”
- Edges are processed in a particular sorted order.
- Connectivity changes through additions, not arbitrary deletions.
### Most important recognition question
> Am I repeatedly connecting two items and asking whether they already belong to the same connected group?
If yes, Union-Find is likely appropriate.
---
# Union-Find State
The basic structure contains:
```java
int[] parent;
int[] size;
```
## Parent array
```java
parent[x]
```
stores the next node on the path toward the representative root.
A root points to itself:
```java
parent[root] == root
```
## Size array
```java
size[root]
```
stores the number of nodes in the component represented by `root`.
The size value is meaningful only for representative roots.
---
# Initial State
Initially, every node belongs to its own component:
```plain text
{0} {1} {2} {3} {4}
```
Therefore:
```java
for (int node = 0; node < n; node++) {
    parent[node] = node;
    size[node] = 1;
}
```
Initial number of components:
```plain text
n
```
---
# Basic Union-Find Implementation
```java
class UnionFind {
    private int[] parent;
    private int[] size;
    private int components;

    UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        components = n;

        for (int node = 0; node < n; node++) {
            parent[node] = node;
            size[node] = 1;
        }
    }

    int find(int node) {
        if (parent[node] != node) {
            parent[node] = find(parent[node]);
        }

        return parent[node];
    }

    boolean union(int first, int second) {
        int rootFirst = find(first);
        int rootSecond = find(second);

        if (rootFirst == rootSecond) {
            return false;
        }

        if (size[rootFirst] < size[rootSecond]) {
            int temporary = rootFirst;
            rootFirst = rootSecond;
            rootSecond = temporary;
        }

        parent[rootSecond] = rootFirst;
        size[rootFirst] += size[rootSecond];
        components--;

        return true;
    }

    boolean connected(int first, int second) {
        return find(first) == find(second);
    }

    int componentSize(int node) {
        return size[find(node)];
    }

    int countComponents() {
        return components;
    }
}
```
---
# The `find` Operation
The `find` operation follows parent links until it reaches a node pointing to itself.
```java
int find(int node) {
    if (parent[node] == node) {
        return node;
    }

    return find(parent[node]);
}
```
Example:
```plain text
4 → 3 → 1 → 1
```
Therefore:
```plain text
find(4) = 1
```
Node `1` is the representative of the component.
---
# Path Compression
Without optimization:
```plain text
4 → 3 → 2 → 1
```
Finding the root of `4` requires following the entire chain.
Path compression directly connects every visited node to the root:
```java
parent[node] = find(parent[node]);
```
After `find(4)`:
```plain text
4 ─┐
3 ─┼→ 1
2 ─┘
```
Future `find` operations become much faster.
### Path-compressed `find`
```java
int find(int node) {
    if (parent[node] != node) {
        parent[node] = find(parent[node]);
    }

    return parent[node];
}
```
### Recursive contract
> `find(node)` returns the representative root of `node` and compresses the path from `node` to that root.
---
# Union by Size
When combining two components, attach the smaller tree under the larger tree.
```java
if (size[rootFirst] < size[rootSecond]) {
    int temporary = rootFirst;
    rootFirst = rootSecond;
    rootSecond = temporary;
}

parent[rootSecond] = rootFirst;
size[rootFirst] += size[rootSecond];
```
This prevents the parent structure from becoming unnecessarily deep.
### Why compare roots?
Incorrect:
```java
if (size[first] < size[second])
```
Correct:
```java
if (size[rootFirst] < size[rootSecond])
```
Only component roots store the current component size.
---
# Union by Rank
Rank approximates the height of the representative tree.
```java
if (rank[rootFirst] < rank[rootSecond]) {
    parent[rootFirst] = rootSecond;
} else if (rank[rootFirst] > rank[rootSecond]) {
    parent[rootSecond] = rootFirst;
} else {
    parent[rootSecond] = rootFirst;
    rank[rootFirst]++;
}
```
Use either:
```plain text
Union by size
or
Union by rank
```
Both work well with path compression. You do not need both simultaneously.
Union by size is often easier because it also gives component sizes.
---
# Understanding `union` Return Value
A useful `union` method returns:
```plain text
true  → two different components were merged
false → nodes were already connected
```
```java
boolean union(int first, int second) {
    int rootFirst = find(first);
    int rootSecond = find(second);

    if (rootFirst == rootSecond) {
        return false;
    }

    // Merge roots.

    return true;
}
```
This directly supports cycle detection and successful-merge counting.
---
# Common Forms
## Common Form 1: Basic Dynamic Connectivity
Edges are added, and we need to determine whether nodes belong to the same connected component.
### How it works
1. Initialize every node as its own component.
2. For every connection, call `union(u, v)`.
3. To answer a connectivity query, compare their roots.
4. Nodes are connected exactly when their roots are equal.
**Memory flow:** `Add connection → Merge representatives → Compare roots`
```java
UnionFind unionFind = new UnionFind(n);

for (int[] edge : edges) {
    unionFind.union(edge[0], edge[1]);
}

boolean connected =
    unionFind.find(source)
        == unionFind.find(destination);
```
Practice:
- LC 1971 — Find if Path Exists in Graph
- LC 323 — Number of Connected Components
- LC 1101 — The Earliest Moment When Everyone Become Friends
- LC 261 — Graph Valid Tree
---
## Common Form 2: Detect a Redundant Edge
In an undirected graph, an edge creates a cycle when its endpoints are already connected.
Before adding:
```plain text
find(u) == find(v)
```
means a path already exists between them.
Adding another edge between the same components creates a cycle.
### How it works
1. Process edges one at a time.
2. Find the roots of both endpoints.
3. If their roots are equal, the edge is redundant.
4. Otherwise, merge their components.
5. Return the edge that failed to merge.
**Memory flow:** `Check roots → Same means cycle → Different means merge`
```java
for (int[] edge : edges) {
    int u = edge[0];
    int v = edge[1];

    if (!unionFind.union(u, v)) {
        return edge;
    }
}
```
### Why this works only directly for undirected cycles
In an undirected graph, existing connectivity between `u` and `v` means another undirected edge closes a cycle.
Directed-cycle detection requires direction-aware logic and generally uses DFS states or topological sorting.
Practice:
- LC 684 — Redundant Connection
- LC 261 — Graph Valid Tree
- LC 685 — Redundant Connection II
---
## Common Form 3: Count Connected Components
Start with:
```plain text
components = n
```
Every successful union combines two components:
```plain text
components--
```
A union between already-connected nodes changes nothing.
### How it works
1. Begin with every node in its own component.
2. Process every edge.
3. Decrease the count after each successful union.
4. Return the final component count.
**Memory flow:** `Start with n groups → Successful union removes one group`
```java
UnionFind unionFind = new UnionFind(n);

for (int[] edge : edges) {
    unionFind.union(edge[0], edge[1]);
}

return unionFind.countComponents();
```
### Alternative calculation
If the Union-Find class does not track component count:
```java
int components = 0;

for (int node = 0; node < n; node++) {
    if (unionFind.find(node) == node) {
        components++;
    }
}
```
Practice:
- LC 323 — Number of Connected Components
- LC 547 — Number of Provinces
- LC 1319 — Number of Operations to Make Network Connected
- LC 2316 — Count Unreachable Pairs of Nodes
---
## Common Form 4: Validate a Tree
An undirected graph with `n` vertices is a valid tree when:
```plain text
It contains exactly n - 1 edges
and
all nodes are connected
```
Equivalently:
```plain text
It has no cycle
and
all nodes form one component
```
### How it works
1. Reject immediately if the edge count is not `n - 1`.
2. Union every edge.
3. If any union fails, a cycle exists.
4. Confirm only one connected component remains.
**Memory flow:** `Check edge count → Reject cycles → Confirm one component`
```java
boolean validTree(int n, int[][] edges) {
    if (edges.length != n - 1) {
        return false;
    }

    UnionFind unionFind = new UnionFind(n);

    for (int[] edge : edges) {
        if (!unionFind.union(edge[0], edge[1])) {
            return false;
        }
    }

    return unionFind.countComponents() == 1;
}
```
### Useful graph fact
For an undirected graph:
```plain text
n nodes + n - 1 edges + connected
→ valid tree
```
Practice:
- LC 261 — Graph Valid Tree
- LC 1319 — Number of Operations to Make Network Connected
---
## Common Form 5: Connect a Network
These problems ask whether separate components can be connected using available or redundant edges.
For `n` nodes, at least:
```plain text
n - 1 edges
```
are required to connect the entire network.
If there are `c` connected components, we need:
```plain text
c - 1 operations
```
to connect them.
### How it works
1. Check whether at least `n - 1` edges exist.
2. Union the endpoints of every edge.
3. Count the remaining connected components.
4. Return `components - 1`.
**Memory flow:** `Merge existing connections → Count groups → Connect groups with c - 1 edges`
```java
if (connections.length < n - 1) {
    return -1;
}

UnionFind unionFind = new UnionFind(n);

for (int[] edge : connections) {
    unionFind.union(edge[0], edge[1]);
}

return unionFind.countComponents() - 1;
```
Practice:
- LC 1319 — Number of Operations to Make Network Connected
- LC 1101 — The Earliest Moment When Everyone Become Friends
---
## Common Form 6: Group Equivalent Items
Sometimes graph nodes are not integers. They may be:
- Email addresses
- Strings
- Accounts
- Variables
- Coordinates
We must assign each unique item an integer ID or union related indices.
### How it works
1. Decide what represents a DSU node.
2. Map each object to an integer index when needed.
3. Union indices belonging to the same group.
4. Find the representative for every item.
5. Group items by their representative.
6. Build the final output from those groups.
**Memory flow:** `Map objects to IDs → Union related items → Group by root`
### Accounts Merge idea
For every account:
```plain text
First email = representative email for that account

Union:
first email with every remaining email
```
After all unions:
```java
Map<Integer, List<String>> groups =
    new HashMap<>();

for (String email : emailToId.keySet()) {
    int root = unionFind.find(emailToId.get(email));

    groups.computeIfAbsent(
        root,
        key -> new ArrayList<>()
    ).add(email);
}
```
Practice:
- LC 721 — Accounts Merge
- LC 839 — Similar String Groups
- LC 1202 — Smallest String With Swaps
- LC 737 — Sentence Similarity II
---
## Common Form 7: Equality and Equivalence Constraints
Equality relationships create connected components.
```plain text
a == b
b == c
```
implies:
```plain text
a == c
```
An inequality creates a contradiction if both variables are already in the same component.
### How it works
1. Process every equality first.
2. Union the variables declared equal.
3. Process every inequality.
4. If unequal variables have the same root, return `false`.
5. Otherwise, all equations are satisfiable.
**Memory flow:** `Merge equal variables → Test inequalities against components`
```java
for (String equation : equations) {
    if (equation.charAt(1) == '=') {
        int first = equation.charAt(0) - 'a';
        int second = equation.charAt(3) - 'a';

        unionFind.union(first, second);
    }
}

for (String equation : equations) {
    if (equation.charAt(1) == '!') {
        int first = equation.charAt(0) - 'a';
        int second = equation.charAt(3) - 'a';

        if (unionFind.connected(first, second)) {
            return false;
        }
    }
}

return true;
```
### Why process equalities first?
An inequality can only be evaluated correctly after all implied equality groups have been formed.
Practice:
- LC 990 — Satisfiability of Equality Equations
- LC 737 — Sentence Similarity II
- LC 1061 — Lexicographically Smallest Equivalent String
---
## Common Form 8: Union-Find on a Grid
A grid can be converted into DSU nodes.
For a grid with:
```plain text
rows × columns
```
convert coordinate `(row, column)` into:
```java
int id = row * columns + column;
```
### How it works
1. Give every relevant cell a unique integer ID.
2. For each cell, inspect its valid neighbors.
3. Union cells belonging to the same region.
4. Count successful merges, component roots, or component sizes.
5. Optionally activate cells dynamically as they appear.
**Memory flow:** `Convert coordinates to IDs → Union neighboring cells → Track regions`
```java
int id(int row, int col, int columns) {
    return row * columns + col;
}
```
```java
int current = row * columns + col;
int neighbor = nextRow * columns + nextCol;

unionFind.union(current, neighbor);
```
### Dynamic island idea
Initially, cells are inactive.
When land is added:
1. Activate the cell.
2. Increment the island count.
3. Union it with active land neighbors.
4. Decrease the island count for every successful union.
Practice:
- LC 200 — Number of Islands
- LC 305 — Number of Islands II
- LC 827 — Making a Large Island
- LC 959 — Regions Cut By Slashes
- LC 947 — Most Stones Removed
---
## Common Form 9: Component Size Problems
Union by size naturally maintains component sizes.
After finding a root:
```java
size[find(node)]
```
gives the number of nodes in that component.
### How it works
1. Union connected nodes.
2. Maintain the size only at representative roots.
3. Find the root of the requested node.
4. Read its component size.
5. Combine component sizes when evaluating possible new connections.
**Memory flow:** `Merge sizes at roots → Query size through representative`
### Making a Large Island idea
For each zero cell:
1. Look at neighboring island roots.
2. Add each distinct component size.
3. Do not count the same root twice.
4. Add one for converting the zero into land.
```java
Set<Integer> neighboringRoots =
    new HashSet<>();

int possibleSize = 1;

for (int[] direction : directions) {
    int root = unionFind.find(neighborId);

    if (neighboringRoots.add(root)) {
        possibleSize += unionFind.componentSize(root);
    }
}
```
### Why use a set?
Two neighboring cells may belong to the same island. Adding both sizes would double-count that component.
Practice:
- LC 827 — Making a Large Island
- LC 952 — Largest Component Size by Common Factor
- LC 2316 — Count Unreachable Pairs of Nodes
---
## Common Form 10: Process Edges in Sorted Order
Some problems ask connectivity questions under changing limits.
Instead of rebuilding the graph for every query:
1. Sort edges by weight.
2. Sort queries by their permitted limit.
3. Add all edges currently allowed by the query.
4. Use Union-Find to answer connectivity.
This is an offline-query technique.
### How it works
1. Sort graph edges by weight.
2. Sort queries by their threshold while preserving original indices.
3. For each query, union every edge satisfying its threshold.
4. Check whether the query endpoints are connected.
5. Store the result at the query’s original index.
**Memory flow:** `Sort events → Add currently valid edges → Answer connectivity`
For a query requiring edge weights smaller than `limit`:
```java
while (edgeIndex < edges.length
        && edges[edgeIndex][2] < limit) {
    unionFind.union(
        edges[edgeIndex][0],
        edges[edgeIndex][1]
    );

    edgeIndex++;
}
```
Practice:
- LC 1697 — Checking Existence of Edge Length Limited Paths
- LC 2421 — Number of Good Paths
- LC 1101 — The Earliest Moment When Everyone Become Friends
- LC 1584 — Min Cost to Connect All Points
---
## Common Form 11: Kruskal’s Algorithm
Kruskal’s algorithm uses Union-Find to build a Minimum Spanning Tree.
It processes edges from smallest to largest weight.
### How it works
1. Sort all edges by weight.
2. Process the cheapest remaining edge.
3. If its endpoints are already connected, skip it because it creates a cycle.
4. Otherwise, union the components and include the edge.
5. Stop after selecting `n - 1` edges.
**Memory flow:** `Sort edges → Add cheapest non-cycling edge → Merge components`
```java
Arrays.sort(
    edges,
    (first, second) ->
        Integer.compare(first[2], second[2])
);

int totalCost = 0;
int edgesUsed = 0;

for (int[] edge : edges) {
    int from = edge[0];
    int to = edge[1];
    int weight = edge[2];

    if (unionFind.union(from, to)) {
        totalCost += weight;
        edgesUsed++;

        if (edgesUsed == n - 1) {
            break;
        }
    }
}
```
Minimum Spanning Trees will be covered as a dedicated graph topic. Here, the important connection is:
> Union-Find lets Kruskal determine whether adding an edge would create a cycle.
Practice:
- LC 1584 — Min Cost to Connect All Points
- LC 1135 — Connecting Cities With Minimum Cost
- LC 1489 — Critical and Pseudo-Critical Edges in MST
---
## Common Form 12: Weighted Union-Find
Normal Union-Find tracks only whether nodes are connected.
Weighted Union-Find also tracks a relationship between a node and its parent.
Example:
```plain text
a / b = 2
b / c = 3
```
Then:
```plain text
a / c = 6
```
The structure stores ratios while merging components.
### How it works
1. Assign every variable a parent.
2. Store the ratio between each node and its parent.
3. During `find`, compress the path and multiply ratios.
4. During `union`, connect roots while preserving the given relationship.
5. If two variables have the same root, derive their ratio from stored weights.
**Memory flow:** `Find representative → Accumulate relationship → Merge roots consistently`
This is an advanced DSU extension. DFS or BFS is usually simpler for one-time Evaluate Division queries, but weighted Union-Find is useful for repeated dynamic relationships.
Practice:
- LC 399 — Evaluate Division
- LC 2307 — Check for Contradictions in Equations
---
# Union-Find versus DFS/BFS
Both can find connected components.
## Prefer DFS or BFS when
- The complete graph is already built.
- You need to traverse actual neighbors.
- You need paths or traversal order.
- Connectivity is queried only once.
- Edges may need to be explored structurally.
## Prefer Union-Find when
- Edges arrive incrementally.
- You repeatedly merge components.
- You repeatedly ask whether two nodes are connected.
- You need cycle detection while adding edges.
- You process edges in sorted order.
- You do not need the actual path.
### Important limitation
Union-Find can answer:
```plain text
Are u and v connected?
```
It does not directly answer:
```plain text
What is the path from u to v?
```
Use BFS or DFS when the actual path is needed.
---
# Union-Find versus Directed Graph Algorithms
Standard Union-Find ignores edge direction.
It is naturally suited to undirected connectivity.
It cannot generally replace:
- Directed-cycle detection
- Topological sorting
- Reachability in directed graphs
- Strongly connected component algorithms
For directed dependencies, use:
```plain text
DFS states
Kahn’s algorithm
Kosaraju
Tarjan
```
---
# Counting Successful and Failed Unions
For every edge:
```java
if (unionFind.union(u, v)) {
    // Two components merged.
} else {
    // Edge connects nodes already in one component.
}
```
This distinction can count:
```plain text
Successful unions
Redundant edges
Remaining components
Edges selected by Kruskal
```
If `m` successful unions occur from `n` initial nodes:
```plain text
Remaining components = n - m
```
---
# Indexing Considerations
Some problems label nodes:
```plain text
0 to n - 1
```
Use arrays of size:
```java
n
```
Other problems label nodes:
```plain text
1 to n
```
Use arrays of size:
```java
n + 1
```
Check the labels before initializing the DSU.
A wrong array size is one of the most common implementation bugs.
---
# Quick Interview Checklist
1. What represents one DSU node?
2. Are nodes zero-indexed or one-indexed?
3. What does one connected component represent?
4. Are the relationships undirected?
5. Do I need connectivity or the actual path?
6. Can I map non-integer objects to integer IDs?
7. Is every node initially active?
8. What should `find(node)` return?
9. Did I implement path compression?
10. Am I unioning roots rather than original nodes?
11. Am I using union by size or rank?
12. Does `union` return whether a merge occurred?
13. Should successful unions decrease the component count?
14. Does an already-connected edge represent a cycle?
15. Do I need component sizes?
16. Could neighboring nodes belong to the same component?
17. Do I need a set to avoid double-counting roots?
18. Should edges or queries be sorted?
19. Are constraints processed in multiple phases?
20. Is this actually a directed-graph problem where DSU is insufficient?
---
# Common Mistakes
- Unioning original nodes instead of their roots.
- Forgetting path compression.
- Updating the size of a non-root node.
- Comparing `parent[u] == parent[v]` instead of comparing `find(u)` and `find(v)`.
- Decreasing the component count when the nodes were already connected.
- Assuming a failed union is always irrelevant when it may indicate a cycle.
- Using DSU for directed-cycle detection.
- Expecting DSU to reconstruct an actual path.
- Initializing arrays with the wrong indexing scheme.
- Forgetting nodes that do not appear in any edge.
- Treating inactive grid cells as existing components.
- Double-counting the same component through multiple neighboring cells.
- Processing inequalities before all equalities have been merged.
- Forgetting to preserve original query indices after sorting.
- Using subtraction inside a comparator and risking integer overflow.
- Assuming `size[node]` is valid without first finding its root.
- Claiming every operation is strictly `O(1)`.
---
# Complexity Analysis
Let:
```plain text
n = number of nodes
m = number of operations
```
With:
- Path compression
- Union by size or rank
The amortized cost of each operation is:
```plain text
O(α(n))
```
Here, `α(n)` is the inverse Ackermann function, which grows extremely slowly.
For all practical input sizes:
```plain text
α(n) is smaller than 5
```
Therefore, Union-Find operations are often described as nearly constant time.
## Initialization
```plain text
Time:  O(n)
Space: O(n)
```
## `find`
```plain text
Amortized: O(α(n))
```
## `union`
It performs a constant number of `find` operations:
```plain text
Amortized: O(α(n))
```
## Processing all edges
```plain text
Time: O(E × α(V))
```
This is effectively close to:
```plain text
O(E)
```
## Sorted-edge problems
Sorting dominates:
```plain text
Sorting:    O(E log E)
DSU work:   O(E × α(V))

Total:      O(E log E)
```
---
# Final Reusable Model
```plain text
Initialize every node as its own component
→ Find representative roots
→ If roots differ, merge them
→ If roots match, they are already connected
```
Use:
```plain text
Path compression
+
Union by size or rank
```
The central template is:
```java
int rootFirst = find(first);
int rootSecond = find(second);

if (rootFirst == rootSecond) {
    // Already connected.
} else {
    // Merge the two components.
}
```
The most important interview question is:
> “What does one connected component represent in this problem, and what event should merge two components?”
# Topological Sorting
Topological sorting creates a linear ordering of vertices in a directed graph such that:
```plain text
For every directed edge:

u → v

u appears before v in the ordering.
```
Example:
```plain text
0 → 1
0 → 2
1 → 3
2 → 3
```
Valid topological orders include:
```plain text
0, 1, 2, 3
0, 2, 1, 3
```
Both are valid because every dependency appears before the node that depends on it.
---
# When Is Topological Sorting Possible?
Topological sorting is possible only for a:
```plain text
Directed Acyclic Graph
```
Also called a:
```plain text
DAG
```
## Why must the graph be directed?
Topological ordering represents a before-and-after relationship:
```plain text
prerequisite → dependent task
```
## Why must it be acyclic?
Consider:
```plain text
A → B
B → C
C → A
```
The requirements say:
```plain text
A must come before B
B must come before C
C must come before A
```
No ordering can satisfy all three.
Therefore:
> A directed graph has a valid topological order if and only if it contains no directed cycle.
---
# Core Mental Model
Topological sorting can be understood in two ways.
## Kahn’s algorithm
> Repeatedly complete nodes whose prerequisites are already resolved.
```plain text
Find indegree-zero nodes
→ Process them
→ Remove their outgoing dependency effects
→ Discover newly available nodes
```
## DFS topological sorting
> A node should enter the answer only after everything depending on its outgoing path has been processed.
```plain text
Explore descendants
→ Finish current node
→ Add current node
→ Reverse finishing order
```
---
# How to Identify Topological-Sort Problems
Look for these signals:
- Tasks have prerequisites.
- Courses depend on other courses.
- Jobs must execute in a valid order.
- Ingredients are needed to create recipes.
- One character must appear before another.
- One item must be above or left of another.
- The input contains directed before-and-after conditions.
- You need to determine whether all dependencies can be satisfied.
- You need to detect a cycle in a directed graph.
- The question asks for a valid build, execution, or dependency order.
Common wording:
```plain text
prerequisite
dependency
must come before
requires
can finish
valid order
build order
execution order
```
### Most important recognition question
> Does `A` need to happen before `B`?
If yes, represent it using:
```plain text
A → B
```
and consider topological sorting.
---
# Constructing the Graph
Suppose:
```plain text
Course 1 requires Course 0
```
The correct edge is:
```plain text
0 → 1
```
because completing course `0` makes course `1` closer to being available.
```java
graph.get(0).add(1);
indegree[1]++;
```
### Dependency rule
```plain text
prerequisite → dependent
```
Not:
```plain text
dependent → prerequisite
```
unless the selected algorithm and meaning are deliberately designed that way.
---
# Understanding Indegree
For a node:
```plain text
indegree = number of incoming edges
```
In dependency problems, this usually means:
> The number of unresolved prerequisites for this node.
Example:
```plain text
A → C
B → C
```
Node `C` has:
```plain text
indegree[C] = 2
```
After processing `A`:
```plain text
indegree[C] = 1
```
After processing `B`:
```plain text
indegree[C] = 0
```
Now `C` is available.
---
# Kahn’s Algorithm
Kahn’s algorithm performs topological sorting using BFS and indegrees.
### How it works
1. Build the directed graph.
2. Calculate every node’s indegree.
3. Add all indegree-zero nodes to a queue.
4. Remove one available node from the queue.
5. Add it to the topological order.
6. Decrease the indegree of its outgoing neighbors.
7. When a neighbor’s indegree becomes zero, add it to the queue.
8. If fewer than `V` nodes are processed, a cycle exists.
**Memory flow:** `Resolve available node → Remove its dependency effect → Unlock neighbors`
```java
int[] topologicalSort(
        int vertices,
        int[][] edges
) {
    List<List<Integer>> graph =
        new ArrayList<>();

    for (int node = 0; node < vertices; node++) {
        graph.add(new ArrayList<>());
    }

    int[] indegree = new int[vertices];

    for (int[] edge : edges) {
        int prerequisite = edge[0];
        int dependent = edge[1];

        graph.get(prerequisite).add(dependent);
        indegree[dependent]++;
    }

    Deque<Integer> queue = new ArrayDeque<>();

    for (int node = 0; node < vertices; node++) {
        if (indegree[node] == 0) {
            queue.offer(node);
        }
    }

    int[] order = new int[vertices];
    int index = 0;

    while (!queue.isEmpty()) {
        int node = queue.poll();

        order[index++] = node;

        for (int neighbor : graph.get(node)) {
            indegree[neighbor]--;

            if (indegree[neighbor] == 0) {
                queue.offer(neighbor);
            }
        }
    }

    if (index != vertices) {
        return new int[0];
    }

    return order;
}
```
---
# Why Kahn’s Algorithm Does Not Need `visited`
A node enters the queue only when:
```java
indegree[node] == 0
```
Its indegree reaches zero only once.
After it reaches zero, no remaining incoming edge can reduce it to zero again.
Therefore:
```plain text
indegree state controls when the node can enter the queue
```
This replaces the normal purpose of `visited`.
> Kahn’s algorithm still tracks processing state—it tracks it through indegrees instead of a separate visited array.
---
# Detecting a Cycle with Kahn’s Algorithm
Suppose a cycle exists:
```plain text
0 → 1
↑   ↓
3 ← 2
```
Every node in the cycle has at least one incoming edge from another node in the cycle.
Therefore, none of them can reach:
```plain text
indegree = 0
```
The queue eventually becomes empty while some nodes remain unprocessed.
Cycle check:
```java
return processedNodes != vertices;
```
Mental model:
> If some nodes can never have all prerequisites resolved, they belong to or depend on a cycle.
---
# DFS Topological Sorting
DFS creates a topological order using finishing time.
A node is added only after all its outgoing neighbors have been explored.
### How it works
1. Start DFS from every unvisited node.
2. Recursively explore each outgoing neighbor.
3. After all neighbors finish, add the current node to a stack.
4. Continue until every node is processed.
5. Pop the stack to obtain topological order.
**Memory flow:** `Explore dependencies forward → Add node while returning → Reverse completion order`
```java
void dfs(
        int node,
        List<List<Integer>> graph,
        boolean[] visited,
        Deque<Integer> order
) {
    visited[node] = true;

    for (int neighbor : graph.get(node)) {
        if (!visited[neighbor]) {
            dfs(neighbor, graph, visited, order);
        }
    }

    order.push(node);
}
```
```java
int[] topologicalSort(
        int vertices,
        List<List<Integer>> graph
) {
    boolean[] visited = new boolean[vertices];
    Deque<Integer> stack = new ArrayDeque<>();

    for (int node = 0; node < vertices; node++) {
        if (!visited[node]) {
            dfs(node, graph, visited, stack);
        }
    }

    int[] answer = new int[vertices];
    int index = 0;

    while (!stack.isEmpty()) {
        answer[index++] = stack.pop();
    }

    return answer;
}
```
### Important limitation
A simple boolean `visited` array creates an order, but it does not correctly detect a directed cycle.
For cycle detection, DFS needs three states.
---
# Three-State DFS
Each node can be in one of three states:
```plain text
0 → unvisited
1 → visiting: currently on the active DFS path
2 → completed: fully processed
```
### Cycle condition
If DFS finds an edge to a node with:
```plain text
state[neighbor] == 1
```
that edge returns to the active recursive path and creates a cycle.
### How it works
1. Mark the current node `visiting`.
2. Explore every outgoing neighbor.
3. If a neighbor is already `visiting`, a cycle exists.
4. Recursively process unvisited neighbors.
5. After every neighbor completes, mark the node `completed`.
6. Add it to the finishing-order stack.
**Memory flow:** `Enter active path → Explore → Detect return to active path → Complete`
```java
boolean dfs(
        int node,
        List<List<Integer>> graph,
        int[] state,
        Deque<Integer> order
) {
    state[node] = 1;

    for (int neighbor : graph.get(node)) {
        if (state[neighbor] == 1) {
            return false;
        }

        if (state[neighbor] == 0
                && !dfs(
                    neighbor,
                    graph,
                    state,
                    order
                )) {
            return false;
        }
    }

    state[node] = 2;
    order.push(node);

    return true;
}
```
```java
for (int node = 0; node < vertices; node++) {
    if (state[node] == 0
            && !dfs(node, graph, state, order)) {
        return new int[0];
    }
}
```
---
# Why DFS Adds the Node After Its Neighbors
For:
```plain text
A → B
```
`A` must appear before `B`.
DFS from `A` first reaches `B`.
Finishing order:
```plain text
B finishes first
A finishes second
```
If we add during finishing:
```plain text
B, A
```
This is reversed.
Putting nodes onto a stack gives:
```plain text
A, B
```
which is the required topological order.
> DFS topological sorting is reverse postorder.
---
# Kahn’s Algorithm versus DFS
## Kahn’s algorithm
Uses:
```plain text
Indegree array + queue
```
Best when:
- The problem describes resolved prerequisites.
- You need to process currently available items.
- External supplies or starting resources exist.
- You want simple cycle detection using processed count.
- You need a lexicographically smallest ordering with a priority queue.
## DFS approach
Uses:
```plain text
Three-state array + recursion stack
```
Best when:
- Directed-cycle detection is naturally recursive.
- You already have DFS-based graph logic.
- You want reverse postorder.
- You need to process descendant information during DFS.
## Complexity
Both require:
```plain text
Time:  O(V + E)
Space: O(V + E)
```
---
# Common Forms
## Common Form 1: Return One Valid Ordering
The question asks for any ordering satisfying all dependencies.
Several valid answers may exist.
### How it works
1. Create edges from prerequisites to dependent nodes.
2. Run Kahn’s algorithm or DFS topological sorting.
3. Store nodes in the order they become resolved.
4. Return the result only if every node was processed.
**Memory flow:** `Build dependency graph → Resolve all nodes → Return order`
Kahn’s algorithm template:
```java
while (!queue.isEmpty()) {
    int node = queue.poll();
    order[index++] = node;

    for (int neighbor : graph.get(node)) {
        indegree[neighbor]--;

        if (indegree[neighbor] == 0) {
            queue.offer(neighbor);
        }
    }
}

return index == vertices
    ? order
    : new int[0];
```
Practice:
- LC 210 — Course Schedule II
- LC 269 — Alien Dictionary
- LC 2392 — Build a Matrix With Conditions
- LC 1203 — Sort Items by Groups Respecting Dependencies
---
## Common Form 2: Determine Whether All Tasks Can Finish
Sometimes the actual order is unnecessary. We only need to determine whether a valid order exists.
### How it works with Kahn’s algorithm
1. Process every indegree-zero node.
2. Count how many nodes are processed.
3. If the count equals the total number of nodes, no cycle exists.
4. Otherwise, some nodes remain blocked by a cycle.
**Memory flow:** `Count resolved nodes → Compare with total`
```java
int processed = 0;

while (!queue.isEmpty()) {
    int node = queue.poll();
    processed++;

    for (int neighbor : graph.get(node)) {
        indegree[neighbor]--;

        if (indegree[neighbor] == 0) {
            queue.offer(neighbor);
        }
    }
}

return processed == numCourses;
```
### How it works with DFS
Return `false` when an edge reaches a currently visiting node.
Practice:
- LC 207 — Course Schedule
- LC 802 — Find Eventual Safe States
- LC 261 — Graph Valid Tree, for the undirected variation
---
## Common Form 3: Resolve Dependencies from Available Supplies
Some nodes are available initially even though they are not part of the result.
Example:
```plain text
Supplies → ingredients already available
Recipes  → nodes that become available later
```
### How it works
1. Create an edge from every required item to the recipe depending on it.
2. Set each recipe’s indegree to its number of required ingredients.
3. Add all initial supplies to the queue.
4. Process a supply or completed recipe as a resolved dependency.
5. Decrease the indegree of recipes depending on it.
6. When a recipe reaches zero, save it and add it to the queue.
7. The completed recipe can now act as an ingredient for other recipes.
**Memory flow:** `Start with available resources → Unlock recipes → Use recipes as resources`
```java
for (String supply : supplies) {
    queue.offer(supply);
}

while (!queue.isEmpty()) {
    String available = queue.poll();

    for (String recipe :
            graph.getOrDefault(
                available,
                List.of()
            )) {
        indegree.put(
            recipe,
            indegree.get(recipe) - 1
        );

        if (indegree.get(recipe) == 0) {
            answer.add(recipe);
            queue.offer(recipe);
        }
    }
}
```
### Why add supplies to the queue?
The queue represents:
```plain text
resolved and currently usable items
```
It does not represent only recipes.
Practice:
- LC 2115 — Find All Possible Recipes from Given Supplies
- Build-system dependency questions
- Package installation dependencies
---
## Common Form 4: Infer Ordering from Sorted Information
Sometimes edges are not provided directly. They must be inferred.
In Alien Dictionary, two adjacent sorted words reveal the ordering of their first different characters.
Example:
```plain text
"wrt"
"wrf"
```
First difference:
```plain text
t before f
```
Therefore:
```plain text
t → f
```
### How it works
1. Compare every adjacent pair of words.
2. Find their first different character.
3. Add an edge from the first word’s character to the second word’s character.
4. Stop comparing that word pair after the first difference.
5. Run topological sorting over all characters.
**Memory flow:** `Infer constraints → Build directed graph → Topologically order symbols`
### Invalid prefix case
This ordering is impossible:
```plain text
"abc"
"ab"
```
A longer word cannot appear before its exact prefix in lexicographic order.
Practice:
- LC 269 — Alien Dictionary
- LC 953 — Verifying an Alien Dictionary
- Derive Alphabet Order
---
## Common Form 5: Lexicographically Smallest Topological Order
If several nodes currently have indegree zero, ordinary Kahn’s algorithm may choose any of them.
If the smallest possible ordering is required, use a min-heap.
### How it works
1. Add every indegree-zero node to a priority queue.
2. Always process the smallest available node.
3. Decrease neighbor indegrees normally.
4. Add newly available nodes to the priority queue.
5. The result is the lexicographically smallest valid topological ordering.
**Memory flow:** `Track all available nodes → Always choose smallest`
```java
PriorityQueue<Integer> available =
    new PriorityQueue<>();

for (int node = 0; node < vertices; node++) {
    if (indegree[node] == 0) {
        available.offer(node);
    }
}

while (!available.isEmpty()) {
    int node = available.poll();

    for (int neighbor : graph.get(node)) {
        indegree[neighbor]--;

        if (indegree[neighbor] == 0) {
            available.offer(neighbor);
        }
    }
}
```
### Complexity difference
Ordinary queue:
```plain text
O(V + E)
```
Priority queue:
```plain text
O((V + E) log V)
```
Practice:
- LC 269 — Alien Dictionary
- Lexicographically Smallest Topological Ordering
- Build order with priority rules
---
## Common Form 6: Two Independent Topological Orders
Some problems contain two independent dependency dimensions.
Example:
```plain text
Row conditions
Column conditions
```
A number’s row position and column position must each satisfy separate constraints.
### How it works
1. Topologically sort the row conditions.
2. Topologically sort the column conditions.
3. If either sort fails, return no solution.
4. Convert each order into a position map.
5. Place every value using its row and column positions.
**Memory flow:** `Sort each dimension → Map values to positions → Combine coordinates`
```java
int[] rowOrder =
    topologicalSort(k, rowConditions);

int[] columnOrder =
    topologicalSort(k, columnConditions);
```
```java
int[] rowPosition = new int[k + 1];
int[] columnPosition = new int[k + 1];

for (int index = 0; index < k; index++) {
    rowPosition[rowOrder[index]] = index;
    columnPosition[columnOrder[index]] = index;
}
```
```java
for (int value = 1; value <= k; value++) {
    matrix[rowPosition[value]]
          [columnPosition[value]] = value;
}
```
Practice:
- LC 2392 — Build a Matrix With Conditions
---
## Common Form 7: Find Eventual Safe Nodes
A safe node cannot eventually reach a directed cycle.
This can be solved with DFS states or reverse-graph topological sorting.
### DFS approach
A node is unsafe if any outgoing path reaches a cycle.
States can represent:
```plain text
0 → unvisited
1 → visiting or currently unsafe
2 → confirmed safe
```
### Reverse-graph Kahn approach
In the original graph, terminal nodes have:
```plain text
outdegree = 0
```
Reverse every edge. Then process original terminal nodes like indegree-zero nodes.
### How it works
1. Reverse all graph edges.
2. Treat original outdegree as the unresolved count.
3. Add all terminal nodes to the queue.
4. When a node is confirmed safe, reduce the unresolved count of nodes leading to it.
5. A node becomes safe when all of its outgoing paths lead to safe nodes.
**Memory flow:** `Start from terminal nodes → Propagate safety backward`
Practice:
- LC 802 — Find Eventual Safe States
- Directed-cycle dependency questions
---
## Common Form 8: Find All Ancestors or Prerequisites
Topological order ensures that a node is processed only after its prerequisites.
This allows prerequisite information to be propagated forward.
### How it works
1. Create a set of ancestors for every node.
2. Process nodes in topological order.
3. For every edge `node → neighbor`:
	- Add `node` to the neighbor’s ancestor set.
	- Add all ancestors of `node` to the neighbor’s set.
4. Convert the sets into the required output.
**Memory flow:** `Process prerequisites first → Forward accumulated ancestor information`
```java
for (int neighbor : graph.get(node)) {
    ancestors.get(neighbor).add(node);

    ancestors.get(neighbor).addAll(
        ancestors.get(node)
    );

    indegree[neighbor]--;

    if (indegree[neighbor] == 0) {
        queue.offer(neighbor);
    }
}
```
Practice:
- LC 2192 — All Ancestors of a Node in a DAG
- LC 1462 — Course Schedule IV
---
## Common Form 9: Dynamic Programming on a DAG
A topological order ensures that all incoming dependencies are processed before the current node.
This makes it useful for dynamic programming on directed acyclic graphs.
Examples:
- Longest path in a DAG
- Minimum cost through dependencies
- Number of paths
- Largest color frequency on a path
### How it works
1. Topologically order the graph.
2. Define a DP value for every node.
3. Process nodes in topological order.
4. Propagate the current node’s result to outgoing neighbors.
5. If not all nodes are processed, reject because a cycle exists.
**Memory flow:** `Topological order → Finalize prerequisites → Propagate DP forward`
Generic transition:
```java
for (int node : topologicalOrder) {
    for (Edge edge : graph.get(node)) {
        dp[edge.to] = Math.max(
            dp[edge.to],
            dp[node] + edge.weight
        );
    }
}
```
Practice:
- LC 1857 — Largest Color Value in a Directed Graph
- LC 2050 — Parallel Courses III
- LC 2328 — Number of Increasing Paths in a Grid
- Longest Path in a DAG
---
## Common Form 10: Grouped Dependencies
Some problems require ordering both:
```plain text
individual items
and
groups containing those items
```
Dependencies may cross group boundaries.
### How it works
1. Assign standalone items to their own groups if necessary.
2. Build an item-level dependency graph.
3. Build a group-level dependency graph.
4. Topologically sort both graphs.
5. Arrange items according to group order while preserving item order.
6. Fail if either graph contains a cycle.
**Memory flow:** `Order groups → Order items → Combine without breaking either order`
Practice:
- LC 1203 — Sort Items by Groups Respecting Dependencies
This is an advanced extension of running multiple related topological sorts.
---
# Multiple Valid Topological Orders
A DAG may have more than one valid topological order.
Whenever multiple nodes have indegree zero:
```plain text
Any of them may legally appear next.
```
Example:
```plain text
0 → 2
1 → 2
```
Valid orders:
```plain text
0, 1, 2
1, 0, 2
```
Unless the question asks for a specific ordering, either answer is valid.
---
# Detecting Whether the Order Is Unique
During Kahn’s algorithm:
```plain text
queue size == 1
```
means only one node can be selected next.
If at any step:
```plain text
queue size > 1
```
multiple valid choices exist, so the topological order is not unique.
This technique appears in sequence-reconstruction problems.
Practice:
- LC 444 — Sequence Reconstruction
---
# Common Edge-Direction Examples
## Course prerequisites
Input:
```plain text
[course, prerequisite]
```
Edge:
```plain text
prerequisite → course
```
## Recipe ingredients
```plain text
ingredient → recipe
```
## Build dependency
```plain text
dependency → dependent project
```
## Character ordering
If `a` must appear before `b`:
```plain text
a → b
```
## Matrix row condition
If `above` must appear above `below`:
```plain text
above → below
```
The input pair order does not always equal the graph edge direction. Interpret what the pair means.
---
# Common Mistakes
- Building edges in the wrong direction.
- Increasing the indegree of the prerequisite instead of the dependent.
- Adding only one indegree-zero node initially.
- Forgetting isolated nodes with no edges.
- Assuming a topological order is unique.
- Returning a partial ordering when a cycle exists.
- Checking queue emptiness alone to detect a cycle.
- Forgetting to compare processed count with total vertices.
- Using a boolean visited array alone for DFS cycle detection.
- Confusing globally completed nodes with nodes on the current DFS path.
- Adding a DFS node before processing its neighbors.
- Forgetting to reverse DFS finishing order.
- Decreasing indegree more than once for a duplicated edge.
- Adding a node to Kahn’s queue before its indegree reaches zero.
- Adding a node repeatedly after its indegree becomes negative.
- Adding only desired output nodes to the queue when external supplies must also resolve dependencies.
- Treating topological sorting as valid for an undirected graph.
- Using topological sorting on a graph with unresolved cycles and expecting a complete answer.
- Missing the invalid-prefix case in Alien Dictionary.
- Using an ordinary queue when the smallest valid ordering is required.
- Combining two dependency dimensions into one graph when they must be ordered independently.
---
# Quick Interview Checklist
1. What does one graph node represent?
2. What does `u → v` mean?
3. Which item is the prerequisite?
4. Which node’s indegree should increase?
5. Are all vertices included, even isolated ones?
6. Is the graph directed?
7. Must the graph be acyclic?
8. Do I need an ordering or only cycle detection?
9. Should I use Kahn’s algorithm or DFS?
10. What does indegree represent in this problem?
11. Which nodes are initially resolved?
12. Are there external supplies or available resources?
13. Can multiple valid orders exist?
14. Is the smallest valid order required?
15. Should the queue be a priority queue?
16. Did I count processed nodes?
17. What should happen when a cycle exists?
18. Does DFS require three states?
19. When should DFS add a node to the result?
20. Are there multiple independent dependency graphs?
21. Can topological order support a later DP calculation?
22. Could duplicate edges corrupt indegrees?
23. What are `V` and `E` for the complexity?
---
# Complexity Analysis
Let:
```plain text
V = number of vertices
E = number of directed edges
```
## Graph construction
```plain text
Time:  O(V + E)
Space: O(V + E)
```
## Kahn’s algorithm
Every node enters the queue at most once, and every edge decreases an indegree once:
```plain text
Time:  O(V + E)
Space: O(V + E)
```
Additional queue and indegree storage:
```plain text
O(V)
```
## DFS topological sorting
Every node and edge is explored once:
```plain text
Time:  O(V + E)
Space: O(V + E)
```
Additional state and recursion stack:
```plain text
O(V)
```
## Priority-queue Kahn’s algorithm
Heap operations add a logarithmic factor:
```plain text
Time: O((V + E) log V)
```
## Ancestor propagation
If ancestor sets are copied between nodes, complexity can be significantly larger than ordinary topological sorting.
Depending on representation:
```plain text
Worst case: O(V² + E)
```
or greater with expensive set merging.
---
# Final Reusable Model
## Kahn’s algorithm
```plain text
Build prerequisite → dependent edges
→ Count unresolved prerequisites
→ Queue all zero-indegree nodes
→ Process one available node
→ Decrease dependent indegrees
→ Queue newly resolved nodes
→ Verify processed count
```
## DFS topological sorting
```plain text
Mark node visiting
→ Explore outgoing neighbors
→ Detect edges to visiting nodes
→ Mark node completed
→ Add during postorder
→ Reverse finishing order
```
The most important interview question is:
> “What does an edge mean, and which event makes a dependency resolved?”
# Shortest Path Algorithms
A shortest-path problem asks:
> What is the minimum cost required to travel from one node or state to another?
The meaning of cost depends on the problem:
```plain text
Number of edges
Distance
Time
Price
Effort
Risk
Number of transformations
```
The four primary algorithms are:
1. BFS
2. Dijkstra’s algorithm
3. Bellman–Ford
4. Floyd–Warshall
The correct algorithm depends mainly on:
```plain text
Edge weights
Number of sources
Number of destination queries
Presence of negative weights
Restrictions on the number of edges
```
---
# Core Mental Model
Every shortest-path algorithm repeatedly improves a known distance.
```java
newDistance = distance[current] + edgeWeight;
```
If the new route is better:
```java
if (newDistance < distance[next]) {
    distance[next] = newDistance;
}
```
This operation is called:
```plain text
Edge relaxation
```
The algorithms differ in the order and number of times they relax edges.
---
# Shortest-Path Decision Guide
```plain text
All edges have equal weight
→ BFS

All edges have non-negative weights
→ Dijkstra

Edges may have negative weights
→ Bellman–Ford

Need to detect a negative cycle
→ Bellman–Ford

Need shortest paths between every pair
→ Floyd–Warshall

Graph is small and many source-destination queries exist
→ Floyd–Warshall

Maximum number of edges or stops is restricted
→ Bounded Bellman–Ford

Several starting sources spread simultaneously
→ Multi-source BFS
```
---
# Quick Comparison
<table header-row="true">
<tr>
<td>Algorithm</td>
<td>Graph requirement</td>
<td>Finds</td>
<td>Time</td>
</tr>
<tr>
<td>BFS</td>
<td>Equal-weight or unweighted edges</td>
<td>One source to all nodes</td>
<td>`O(V + E)`</td>
</tr>
<tr>
<td>Dijkstra</td>
<td>Non-negative weights</td>
<td>One source to all nodes</td>
<td>`O((V + E) log V)`</td>
</tr>
<tr>
<td>Bellman–Ford</td>
<td>Negative weights allowed</td>
<td>One source to all nodes</td>
<td>`O(VE)`</td>
</tr>
<tr>
<td>Floyd–Warshall</td>
<td>Negative edges allowed, no negative cycle</td>
<td>Every pair</td>
<td>`O(V³)`</td>
</tr>
</table>
---
# What Is a Distance Array?
```java
int[] distance = new int[n];
Arrays.fill(distance, Integer.MAX_VALUE);

distance[source] = 0;
```
The meaning is:
> `distance[node]` stores the best cost currently known for reaching `node`.
Initially:
```plain text
Source      → distance 0
Other nodes → infinity because no path is known
```
As edges are relaxed, distances improve.
---
# Why a Node May Be Discovered More Than Once
In ordinary BFS, the first discovery is optimal because every edge has equal cost.
In a weighted graph, a node may first be discovered through an expensive path and later through a cheaper one.
Example:
```plain text
A ──10──→ B
A ──1───→ C ──1──→ B
```
First known path:
```plain text
A → B = 10
```
Later:
```plain text
A → C → B = 2
```
Therefore, weighted shortest-path algorithms must allow distance improvement.
---
# 1. BFS Shortest Path
BFS finds the shortest path in:
```plain text
Unweighted graphs
or
Graphs where every edge has the same cost
```
BFS minimizes:
```plain text
Number of edges used
```
---
# Why BFS Finds the Shortest Path
BFS explores nodes in layers:
```plain text
Layer 0 → source
Layer 1 → nodes one edge away
Layer 2 → nodes two edges away
Layer 3 → nodes three edges away
```
Therefore, the first time a node is discovered, it has been reached using the minimum number of edges.
---
# BFS Template
```java
int[] shortestPath(
        int source,
        List<List<Integer>> graph
) {
    int n = graph.size();

    int[] distance = new int[n];
    Arrays.fill(distance, -1);

    Deque<Integer> queue = new ArrayDeque<>();

    queue.offer(source);
    distance[source] = 0;

    while (!queue.isEmpty()) {
        int node = queue.poll();

        for (int neighbor : graph.get(node)) {
            if (distance[neighbor] == -1) {
                distance[neighbor] =
                    distance[node] + 1;

                queue.offer(neighbor);
            }
        }
    }

    return distance;
}
```
Here:
```plain text
distance == -1 → undiscovered
distance >= 0  → already discovered
```
A separate `visited` array is unnecessary.
---
# When to Prefer BFS
Use BFS when:
- Every edge costs the same.
- The graph is unweighted.
- Each move counts as one operation.
- You need the minimum number of transformations.
- You need the minimum number of grid steps.
- You need the nearest occurrence of something.
Do not use Dijkstra when ordinary BFS is sufficient. BFS is simpler and faster.
---
# 2. Dijkstra’s Algorithm
Dijkstra finds shortest paths from one source when every edge weight is non-negative.
```plain text
edgeWeight >= 0
```
It uses a min-priority queue to process the node with the smallest currently known distance.
---
# Dijkstra’s Core Mental Model
> Always continue from the currently cheapest reachable node.
```plain text
Take cheapest state
→ Try extending its path
→ Improve neighbor distances
→ Add improved states to the priority queue
```
---
# Weighted Graph Representation
```java
class Edge {
    int node;
    int weight;

    Edge(int node, int weight) {
        this.node = node;
        this.weight = weight;
    }
}
```
```java
List<List<Edge>> graph = new ArrayList<>();

for (int node = 0; node < n; node++) {
    graph.add(new ArrayList<>());
}
```
Directed edge:
```java
graph.get(from).add(new Edge(to, weight));
```
Undirected edge:
```java
graph.get(from).add(new Edge(to, weight));
graph.get(to).add(new Edge(from, weight));
```
---
# Dijkstra Template
```java
class State {
    int node;
    long distance;

    State(int node, long distance) {
        this.node = node;
        this.distance = distance;
    }
}
```
```java
long[] dijkstra(
        int source,
        List<List<Edge>> graph
) {
    int n = graph.size();

    long[] distance = new long[n];
    Arrays.fill(distance, Long.MAX_VALUE);

    PriorityQueue<State> queue =
        new PriorityQueue<>(
            (first, second) ->
                Long.compare(
                    first.distance,
                    second.distance
                )
        );

    distance[source] = 0;
    queue.offer(new State(source, 0));

    while (!queue.isEmpty()) {
        State current = queue.poll();

        if (current.distance
                != distance[current.node]) {
            continue;
        }

        for (Edge edge : graph.get(current.node)) {
            long candidate =
                current.distance + edge.weight;

            if (candidate < distance[edge.node]) {
                distance[edge.node] = candidate;

                queue.offer(
                    new State(
                        edge.node,
                        candidate
                    )
                );
            }
        }
    }

    return distance;
}
```
---
# Why Skip Stale Priority-Queue Entries?
Java’s `PriorityQueue` does not efficiently update an existing entry.
If a shorter path is found, we add a new state:
```plain text
(node B, distance 10)
(node B, distance 4)
```
Both entries may remain in the queue.
When `(B, 10)` is eventually removed, it is outdated.
```java
if (current.distance != distance[current.node]) {
    continue;
}
```
This prevents unnecessary processing.
---
# Why Dijkstra Does Not Need a `visited` Array
The distance array determines whether a priority-queue entry is current.
```java
current.distance == distance[current.node]
```
means this entry represents the best known distance.
An older entry is ignored.
A visited array can be used when a node is finalized after polling, but the stale-entry pattern is often simpler and safer.
---
# Why Dijkstra Requires Non-Negative Weights
Dijkstra assumes that when the smallest-distance state is processed, a later path cannot make it cheaper.
A negative edge can violate this assumption:
```plain text
A → B = 5
A → C = 10
C → B = -20
```
The later path gives:
```plain text
A → C → B = -10
```
Dijkstra’s greedy finalization is therefore invalid with negative edges.
---
# Early Exit in Dijkstra
If only one destination is needed:
```java
if (current.node == destination) {
    return current.distance;
}
```
This is safe when the state is removed as the current minimum after stale entries are skipped.
---
# 3. Bellman–Ford Algorithm
Bellman–Ford finds shortest paths from one source even when some edges have negative weights.
It can also detect a reachable negative-weight cycle.
---
# Bellman–Ford Core Mental Model
> Repeatedly relax every edge until shortest paths have had enough opportunities to propagate.
A shortest simple path can contain at most:
```plain text
V - 1 edges
```
Therefore, relaxing all edges `V - 1` times is sufficient when no negative cycle exists.
---
# Edge-List Representation
Bellman–Ford works naturally with an edge list:
```java
class Edge {
    int from;
    int to;
    long weight;

    Edge(int from, int to, long weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }
}
```
---
# Bellman–Ford Template
```java
long[] bellmanFord(
        int vertices,
        List<Edge> edges,
        int source
) {
    long infinity = Long.MAX_VALUE / 4;

    long[] distance = new long[vertices];
    Arrays.fill(distance, infinity);

    distance[source] = 0;

    for (int iteration = 1;
            iteration < vertices;
            iteration++) {
        boolean changed = false;

        for (Edge edge : edges) {
            if (distance[edge.from] == infinity) {
                continue;
            }

            long candidate =
                distance[edge.from] + edge.weight;

            if (candidate < distance[edge.to]) {
                distance[edge.to] = candidate;
                changed = true;
            }
        }

        if (!changed) {
            break;
        }
    }

    return distance;
}
```
---
# Why `V - 1` Iterations?
After one complete relaxation round, shortest paths using at most one edge can propagate.
After two rounds:
```plain text
paths using at most two edges
```
After `V - 1` rounds:
```plain text
paths using at most V - 1 edges
```
Any simple path contains at most `V - 1` edges.
If it contains more, it must repeat a vertex and therefore contain a cycle.
---
# Detecting a Negative Cycle
After the standard `V - 1` rounds, perform one additional relaxation pass.
If any reachable distance still improves:
```plain text
a reachable negative cycle exists
```
```java
boolean hasNegativeCycle = false;

for (Edge edge : edges) {
    if (distance[edge.from] == infinity) {
        continue;
    }

    if (distance[edge.from] + edge.weight
            < distance[edge.to]) {
        hasNegativeCycle = true;
        break;
    }
}
```
Why?
A normal shortest path should already be finalized after `V - 1` rounds.
Continued improvement means repeatedly traveling through a negative cycle keeps reducing the cost.
---
# 4. Floyd–Warshall Algorithm
Floyd–Warshall calculates shortest paths between every pair of vertices.
It uses dynamic programming over possible intermediate nodes.
---
# Floyd–Warshall Core Mental Model
For every pair `(from, to)`, ask:
> Is the path cheaper if it is allowed to pass through `via`?
```java
distance[from][to] = Math.min(
    distance[from][to],
    distance[from][via] + distance[via][to]
);
```
---
# Floyd–Warshall Initialization
```java
long[][] distance = new long[n][n];
long infinity = Long.MAX_VALUE / 4;

for (int from = 0; from < n; from++) {
    Arrays.fill(distance[from], infinity);
    distance[from][from] = 0;
}
```
For every edge:
```java
distance[from][to] =
    Math.min(distance[from][to], weight);
```
For an undirected edge:
```java
distance[from][to] =
    Math.min(distance[from][to], weight);

distance[to][from] =
    Math.min(distance[to][from], weight);
```
Using `Math.min` handles multiple edges between the same pair.
---
# Floyd–Warshall Template
```java
for (int via = 0; via < n; via++) {
    for (int from = 0; from < n; from++) {
        for (int to = 0; to < n; to++) {
            if (distance[from][via] == infinity
                    || distance[via][to] == infinity) {
                continue;
            }

            distance[from][to] = Math.min(
                distance[from][to],
                distance[from][via]
                    + distance[via][to]
            );
        }
    }
}
```
---
# Why Must `via` Be the Outer Loop?
The dynamic-programming meaning is:
> After processing `via`, distances may use nodes `0` through `via` as intermediate vertices.
The previous stage must be complete before allowing the next intermediate node.
Therefore:
```java
for (via)
    for (from)
        for (to)
```
Changing this order can violate the DP transition.
---
# Floyd–Warshall and Negative Cycles
After Floyd–Warshall:
```java
distance[node][node] < 0
```
means a negative cycle is reachable from that node.
Normally:
```plain text
distance[node][node] = 0
```
A negative diagonal means traveling through a cycle can reduce the cost below zero.
---
# When to Prefer Floyd–Warshall
Use Floyd–Warshall when:
- You need distances between every pair of nodes.
- The number of vertices is small.
- Many queries will ask about different source-destination pairs.
- A matrix representation is convenient.
- Negative edges may exist, but negative cycles do not invalidate the requested result.
Avoid it for a large sparse graph because:
```plain text
Time:  O(V³)
Space: O(V²)
```
---
# Common Forms
## Common Form 1: Unweighted Shortest Path
Every move has equal cost.
Examples:
- Fewest graph edges
- Minimum number of moves
- Minimum number of transformations
- Minimum number of grid steps
### How it works
1. Start BFS from the source.
2. Give the source distance `0`.
3. Discover every unvisited neighbor at distance `current + 1`.
4. The first discovery of a node is its shortest distance.
5. Stop early when the destination is found.
**Memory flow:** `Explore distance d → Discover distance d + 1`
```java
queue.offer(source);
distance[source] = 0;

while (!queue.isEmpty()) {
    int node = queue.poll();

    for (int neighbor : graph.get(node)) {
        if (distance[neighbor] == -1) {
            distance[neighbor] =
                distance[node] + 1;

            queue.offer(neighbor);
        }
    }
}
```
Practice:
- LC 1091 — Shortest Path in Binary Matrix
- LC 752 — Open the Lock
- LC 127 — Word Ladder
- LC 433 — Minimum Genetic Mutation
- LC 815 — Bus Routes
---
## Common Form 2: Multi-Source Shortest Distance
Several sources begin at distance `0`.
Examples:
- Infection spreads from several cells.
- Find every cell’s distance from the nearest zero.
- Find distance from the nearest gate.
- Find nearest source among many sources.
### How it works
1. Add every initial source to the queue.
2. Assign all source distances to `0`.
3. Run one BFS from all sources together.
4. Each undiscovered node is reached from its nearest source.
5. BFS levels represent simultaneous expansion.
**Memory flow:** `Initialize every source → Expand together → Record nearest distance`
```java
for (int source : sources) {
    queue.offer(source);
    distance[source] = 0;
}

while (!queue.isEmpty()) {
    int node = queue.poll();

    for (int neighbor : graph.get(node)) {
        if (distance[neighbor] == -1) {
            distance[neighbor] =
                distance[node] + 1;

            queue.offer(neighbor);
        }
    }
}
```
Practice:
- LC 994 — Rotting Oranges
- LC 542 — 01 Matrix
- LC 1162 — As Far from Land as Possible
- LC 1765 — Map of Highest Peak
- LC 286 — Walls and Gates
---
## Common Form 3: Implicit-State Shortest Path
Sometimes graph nodes and edges are not provided explicitly.
A state represents a node, and a valid operation generates a neighbor.
Examples:
```plain text
Lock combination
Word
Board configuration
Current stop
Current position
```
### How it works
1. Treat the starting configuration as the source node.
2. Generate all valid next states when processing it.
3. Skip forbidden or previously visited states.
4. Add new states to BFS.
5. Return the level when the target state is reached.
**Memory flow:** `State → Generate legal moves → BFS by number of moves`
Open Lock example:
```plain text
"0000"

Neighbors:
"1000", "9000"
"0100", "0900"
"0010", "0090"
"0001", "0009"
```
You do not need to build all `10,000` nodes before BFS. Generate neighbors only when a state is processed.
Practice:
- LC 752 — Open the Lock
- LC 127 — Word Ladder
- LC 433 — Minimum Genetic Mutation
- LC 773 — Sliding Puzzle
- LC 1345 — Jump Game IV
---
## Common Form 4: Standard Weighted Shortest Path
Edges have different non-negative costs.
### How it works
1. Store weighted neighbors in an adjacency list.
2. Initialize the source distance to zero.
3. Use a min-priority queue.
4. Poll the state with the smallest current distance.
5. Relax all outgoing edges.
6. Add improved neighbor states to the queue.
**Memory flow:** `Poll cheapest node → Relax weighted edges → Queue improvements`
Practice:
- LC 743 — Network Delay Time
- LC 787 — Cheapest Flights Within K Stops
- LC 1514 — Path with Maximum Probability
- LC 1976 — Number of Ways to Arrive at Destination
- LC 2662 — Minimum Cost of a Path With Special Roads
For LC 787, ordinary Dijkstra requires additional stop-count state; bounded Bellman–Ford is often simpler.
---
## Common Form 5: Minimax Path
Some paths are not scored by adding edge costs.
In Path With Minimum Effort, path cost is:
```plain text
maximum edge difference along the path
```
We want to minimize that maximum.
### How it works
1. Store the best known effort for every node.
2. When moving across an edge, calculate its local cost.
3. The candidate path effort is the worse of:
	- effort already used
	- new edge cost
4. Relax the neighbor if this candidate effort is smaller.
5. Use a min-priority queue as in Dijkstra.
**Memory flow:** `Carry worst edge so far → Minimize that worst value`
```java
int edgeDifference =
    Math.abs(
        heights[currentRow][currentCol]
        - heights[nextRow][nextCol]
    );

int candidateEffort = Math.max(
    currentEffort,
    edgeDifference
);
```
Why `Math.max`?
The path’s effort is determined by its most difficult edge.
Practice:
- LC 1631 — Path With Minimum Effort
- LC 778 — Swim in Rising Water
- LC 1102 — Path With Maximum Minimum Value
---
## Common Form 6: Maximum-Probability or Maximum-Product Path
Sometimes the best path maximizes a value rather than minimizing it.
For probabilities:
```plain text
path probability
= product of edge probabilities
```
Use a max-priority queue.
### How it works
1. Set the source probability to `1.0`.
2. Poll the node with the greatest current probability.
3. Multiply by each outgoing edge probability.
4. Update a neighbor when the new probability is larger.
5. Stop when the destination is removed as the best state.
**Memory flow:** `Poll most promising path → Multiply relationship → Keep maximum`
```java
double candidate =
    probability[current]
    * edge.probability;

if (candidate > probability[edge.node]) {
    probability[edge.node] = candidate;
}
```
Practice:
- LC 1514 — Path with Maximum Probability
- Currency-conversion variants with optimization objectives
---
## Common Form 7: Count the Number of Shortest Paths
Sometimes we need both:
```plain text
Shortest distance
Number of ways to achieve that distance
```
### How it works
For an edge from `current` to `next`:
```plain text
candidate < distance[next]
→ Found a better shortest distance
→ Replace distance
→ ways[next] = ways[current]

candidate == distance[next]
→ Found another shortest path
→ ways[next] += ways[current]
```
**Memory flow:** `Better distance replaces count → Equal distance adds count`
```java
if (candidate < distance[next]) {
    distance[next] = candidate;
    ways[next] = ways[current];

    queue.offer(
        new State(next, candidate)
    );
} else if (candidate == distance[next]) {
    ways[next] =
        (ways[next] + ways[current]) % MOD;
}
```
Practice:
- LC 1976 — Number of Ways to Arrive at Destination
- Number of Shortest Paths in an Unweighted Graph
---
## Common Form 8: Shortest Path with Limited Stops or Edges
The state is not described only by the current node.
Two routes reaching the same node may have:
```plain text
Different cost
Different number of edges used
```
A slightly more expensive path may be useful if it used fewer stops.
### How it works with bounded Bellman–Ford
1. Start with only the source distance known.
2. Perform one relaxation round per permitted edge.
3. Copy the previous distance array before each round.
4. Read from the previous array and write into the copy.
5. This prevents one round from using more than one new edge.
**Memory flow:** `One relaxation round → Allow one additional edge`
```java
int[] distance = new int[n];
Arrays.fill(distance, Integer.MAX_VALUE);

distance[source] = 0;

for (int edgesUsed = 0;
        edgesUsed <= maxStops;
        edgesUsed++) {
    int[] nextDistance =
        Arrays.copyOf(distance, n);

    for (int[] flight : flights) {
        int from = flight[0];
        int to = flight[1];
        int price = flight[2];

        if (distance[from]
                == Integer.MAX_VALUE) {
            continue;
        }

        nextDistance[to] = Math.min(
            nextDistance[to],
            distance[from] + price
        );
    }

    distance = nextDistance;
}
```
### Why copy the array?
If updates are immediately reused during the same round, one iteration could travel across several edges.
The copied array guarantees:
```plain text
Iteration 1 → paths using at most 1 edge
Iteration 2 → paths using at most 2 edges
...
```
Practice:
- LC 787 — Cheapest Flights Within K Stops
- Shortest Path with At Most K Edges
---
## Common Form 9: Negative-Weight Shortest Path
When negative edges exist, Dijkstra is unsafe.
Bellman–Ford repeatedly relaxes all edges.
### How it works
1. Initialize the source distance.
2. Relax every edge `V - 1` times.
3. Skip edges whose source remains unreachable.
4. Stop early if an iteration performs no update.
5. Optionally use one additional pass to detect a negative cycle.
**Memory flow:** `Relax every edge repeatedly → Propagate cheaper paths`
Practice:
- Bellman–Ford shortest-path problems
- Currency-arbitrage variants
- LC 787 — Cheapest Flights Within K Stops
---
## Common Form 10: Detect a Negative Cycle
A negative cycle allows the path cost to decrease indefinitely.
Example:
```plain text
A → B = 2
B → C = -5
C → A = 1

Cycle total = -2
```
Repeating the cycle keeps reducing total cost.
### How it works
1. Run `V - 1` Bellman–Ford relaxation rounds.
2. Perform one additional round.
3. If any reachable distance improves, a negative cycle exists.
4. If detecting a cycle anywhere, initialize appropriately or use a super-source.
**Memory flow:** `Finish normal relaxation → Test whether improvement is still possible`
Practice:
- Detect Negative Cycle
- Currency Arbitrage
- LC 2307 — Check for Contradictions in Equations, conceptually related
---
## Common Form 11: All-Pairs Shortest Path
The problem needs shortest distances for many or all source-destination pairs.
### How it works
1. Initialize a distance matrix.
2. Add all direct edge costs.
3. Set every diagonal entry to zero.
4. Try each node as an intermediate vertex.
5. Update every `from → to` pair through that intermediate.
**Memory flow:** `Allow one more intermediate node → Improve every pair`
```java
for (int via = 0; via < n; via++) {
    for (int from = 0; from < n; from++) {
        for (int to = 0; to < n; to++) {
            if (distance[from][via] == infinity
                    || distance[via][to] == infinity) {
                continue;
            }

            distance[from][to] = Math.min(
                distance[from][to],
                distance[from][via]
                    + distance[via][to]
            );
        }
    }
}
```
Practice:
- LC 1334 — Find the City With the Smallest Number of Neighbors
- LC 1462 — Course Schedule IV
- LC 399 — Evaluate Division, multiplicative variation
---
## Common Form 12: Threshold-Reachable Nodes
These problems ask:
```plain text
How many nodes can be reached with shortest distance <= threshold?
```
### How it works
1. Calculate shortest distances.
2. For every source, count destinations inside the threshold.
3. Compare these counts.
4. Apply the required tie-breaking rule.
For small graphs, use Floyd–Warshall.
For larger sparse graphs with non-negative weights, run Dijkstra from each source.
**Memory flow:** `Compute distances → Count values inside threshold → Apply tie rule`
Practice:
- LC 1334 — Find the City With the Smallest Number of Neighbors
---
## Common Form 13: Reconstruct the Shortest Path
Distance alone does not preserve the actual route.
Store the predecessor responsible for each improvement.
### How it works
1. When a shorter path to `next` is found, set:
	`parent[next] = current`.
2. After reaching the destination, follow parent links backward.
3. Continue until the source is reached.
4. Reverse the collected nodes.
**Memory flow:** `Improve distance → Save predecessor → Trace destination backward`
```java
if (candidate < distance[next]) {
    distance[next] = candidate;
    parent[next] = current;

    queue.offer(
        new State(next, candidate)
    );
}
```
```java
List<Integer> path = new ArrayList<>();

int node = destination;

while (node != -1) {
    path.add(node);
    node = parent[node];
}

Collections.reverse(path);
```
Practice:
- Print Shortest Path in an Unweighted Graph
- Print Dijkstra’s Shortest Path
- LC 126 — Word Ladder II
---
# Choosing Single-Source versus All-Pairs
## One source
Use:
```plain text
BFS
Dijkstra
Bellman–Ford
```
depending on edge weights.
## Every source
Options:
```plain text
Run BFS from every source
Run Dijkstra from every source
Use Floyd–Warshall
```
General guideline:
```plain text
Small graph or dense graph
→ Floyd–Warshall

Large sparse graph with non-negative weights
→ Dijkstra from required sources

Unweighted graph
→ BFS from required sources
```
---
# Shortest Path versus Minimum Spanning Tree
These solve different problems.
## Shortest path
Minimizes travel cost from a source:
```plain text
source → destination
```
## Minimum spanning tree
Minimizes the total edge cost required to connect every node.
A Minimum Spanning Tree does not guarantee the shortest route between every pair.
---
# Integer Overflow and Infinity
Avoid:
```java
Integer.MAX_VALUE + weight
```
It may overflow into a negative number.
Always check reachability before adding:
```java
if (distance[from] == infinity) {
    continue;
}
```
Prefer:
```java
long[] distance
```
for large path costs.
Safe infinity:
```java
long infinity = Long.MAX_VALUE / 4;
```
This leaves room for addition without overflow.
---
# Common Mistakes
- Using BFS when edge weights differ.
- Using Dijkstra with negative edges.
- Using Floyd–Warshall for a huge sparse graph.
- Forgetting to initialize the source distance to zero.
- Forgetting to initialize Floyd–Warshall diagonals to zero.
- Adding only one direction for an undirected edge.
- Adding both directions for a directed edge.
- Treating the first weighted discovery as final.
- Marking a Dijkstra node visited when adding it to the priority queue.
- Forgetting to skip stale priority-queue entries.
- Ordering the Dijkstra priority queue by node rather than distance.
- Using subtraction in comparators and risking overflow.
- Calculating minimax path cost using addition instead of `Math.max`.
- Using a min-heap for maximum-probability paths.
- Forgetting to handle equal shortest paths when counting routes.
- Reusing current-round Bellman–Ford updates in a stop-limited problem.
- Running Bellman–Ford fewer than the required relaxation rounds.
- Claiming every Bellman–Ford update represents a separate path.
- Forgetting the infinity guard before addition.
- Putting `via` inside the other Floyd–Warshall loops.
- Setting the Floyd–Warshall diagonal to `1` instead of `0`.
- Forgetting `Math.min` when multiple edges connect the same pair.
- Counting the source itself when the question asks for neighbors.
- Mishandling the tie-breaking rule.
- Storing only distances when the actual route must be returned.
---
# Quick Interview Checklist
1. What does one graph node represent?
2. What does one edge represent?
3. Is the graph directed or undirected?
4. Are all edge costs equal?
5. Can edge weights be negative?
6. Can a negative cycle exist?
7. Do I need one source or every source?
8. Is there one destination or many queries?
9. Is the graph sparse or dense?
10. Is the graph small enough for `O(V³)`?
11. Are there multiple starting sources?
12. Is there a restriction on stops or edges?
13. Does node alone describe the state?
14. Is path cost additive?
15. Is the objective a minimum sum, minimax, or maximum product?
16. Do I need the actual path?
17. Do I need the number of shortest paths?
18. When is a node’s result final?
19. Can priority-queue entries become stale?
20. Should I use `long` for distances?
21. Did I guard against adding infinity?
22. Are matrix diagonals initialized correctly?
23. What should happen for unreachable nodes?
24. What are the time and space complexities?
---
# Complexity Analysis
Let:
```plain text
V = number of vertices
E = number of edges
```
## BFS
```plain text
Time:  O(V + E)
Space: O(V)
```
## Multi-source BFS
All sources share one traversal:
```plain text
Time:  O(V + E)
Space: O(V)
```
## Dijkstra with adjacency list and binary heap
```plain text
Time:  O((V + E) log V)
Space: O(V + E)
```
Often simplified to:
```plain text
O(E log V)
```
for a connected graph.
## Bellman–Ford
Every edge is processed up to `V - 1` times:
```plain text
Time:  O(VE)
Space: O(V)
```
## Floyd–Warshall
```plain text
Time:  O(V³)
Space: O(V²)
```
## Repeated Dijkstra from every source
```plain text
Time: O(V × (V + E) log V)
```
This may be preferable to Floyd–Warshall for sparse graphs.
---
# Final Algorithm Selection Model
```plain text
Equal edge costs?
→ BFS

Several starting nodes?
→ Multi-source BFS

Different but non-negative weights?
→ Dijkstra

Negative edges?
→ Bellman–Ford

Limited number of stops or edges?
→ Bounded Bellman–Ford

All source-destination pairs?
→ Floyd–Warshall

Minimize the worst edge?
→ Minimax Dijkstra

Maximize multiplied probabilities?
→ Max-priority-queue Dijkstra
```
The most important interview question is:
> “What exactly does path cost mean in this problem, and which algorithm processes that cost correctly?”
# Minimum Spanning Trees
A Minimum Spanning Tree, or MST, connects every node in an undirected weighted graph using the minimum possible total edge cost.
It must satisfy three properties:
```plain text
Every vertex is connected
No cycle exists
Exactly V - 1 edges are selected
```
Example:
```plain text
A ──1── B
│      /│
4    2  5
│   /   │
C ──3── D
```
An MST selects enough low-cost edges to connect all four nodes without creating a cycle.
---
# Important Terminology
## Spanning
The selected edges include every graph vertex.
## Tree
The selected edges are connected and contain no cycle.
## Minimum
Among all possible spanning trees, it has the smallest total edge weight.
A connected graph can have:
- One unique MST
- Several different MSTs with the same minimum cost
---
# Core Mental Model
> Repeatedly select a safe, low-cost edge that connects previously separate parts of the graph.
The two main MST algorithms are:
```plain text
Kruskal’s algorithm
→ Process globally cheapest edges
→ Use Union-Find to prevent cycles

Prim’s algorithm
→ Grow one connected tree
→ Use a priority queue to select the cheapest outgoing edge
```
---
# When to Use an MST
Look for these signals:
- Connect all cities, points, computers, or buildings.
- Minimize the total cost of connecting the complete network.
- Select connections without creating cycles.
- Every node must become reachable.
- Edge costs represent the price of building a connection.
- The required result contains exactly `n - 1` connections.
- Existing connections can be treated as zero-cost edges.
- A virtual source can represent an alternative construction method.
Common wording:
```plain text
minimum cost to connect all
connect every node
minimum total wiring cost
build a network
roads, cables, pipes, bridges
```
### Most important recognition question
> Are we minimizing the total cost of connecting the entire graph, rather than the travel cost from one source?
If yes, consider a Minimum Spanning Tree.
---
# MST versus Shortest Path
These solve different optimization problems.
## Shortest path
Minimizes the cost of traveling from a source to a destination:
```plain text
source → destination
```
## Minimum spanning tree
Minimizes the total cost of connecting every node:
```plain text
all vertices become connected
```
An MST does not guarantee the shortest route from the source to every node.
A shortest-path tree does not necessarily have the minimum total connection cost.
---
# Fundamental MST Properties
## Exactly `V - 1` edges
A tree containing `V` vertices always contains:
```plain text
V - 1 edges
```
If fewer edges are selected:
```plain text
The graph is disconnected
```
If more edges are selected:
```plain text
A cycle must exist
```
---
## Cut Property
Imagine dividing the graph’s vertices into two groups.
```plain text
Group A | Group B
```
The cheapest edge crossing this division is safe to include in some MST.
This is the core intuition behind both Prim and Kruskal.
---
## Cycle Property
If an edge is the uniquely heaviest edge in a cycle, it does not need to belong to an MST.
Why?
Removing that edge keeps the cycle’s vertices connected while reducing total cost.
---
# Kruskal’s Algorithm
Kruskal processes all edges globally from smallest to largest weight.
It uses Union-Find to determine whether adding an edge would create a cycle.
### How it works
1. Sort all edges by weight.
2. Start with every node in a separate component.
3. Process edges from smallest to largest.
4. If an edge connects different components, include it.
5. Union those components.
6. If both endpoints are already connected, skip the edge.
7. Stop after selecting `V - 1` edges.
**Memory flow:** `Sort all edges → Add cheapest non-cycling edge → Merge components`
---
# Kruskal Template
```java
class Edge {
    int from;
    int to;
    int weight;

    Edge(int from, int to, int weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }
}
```
```java
long kruskal(
        int vertices,
        List<Edge> edges
) {
    edges.sort(
        (first, second) ->
            Integer.compare(
                first.weight,
                second.weight
            )
    );

    UnionFind unionFind =
        new UnionFind(vertices);

    long totalCost = 0;
    int edgesUsed = 0;

    for (Edge edge : edges) {
        if (unionFind.union(
                edge.from,
                edge.to
        )) {
            totalCost += edge.weight;
            edgesUsed++;

            if (edgesUsed == vertices - 1) {
                break;
            }
        }
    }

    return edgesUsed == vertices - 1
        ? totalCost
        : -1;
}
```
---
# Why Union-Find Works in Kruskal
Before adding edge:
```plain text
u — v
```
check:
```java
find(u) == find(v)
```
If true:
```plain text
u and v already have a path between them
```
Adding another edge closes a cycle.
If false:
```plain text
The edge joins two separate components
```
The edge can safely expand the spanning forest.
---
# Prim’s Algorithm
Prim grows one connected tree from a starting node.
At every step, it chooses the cheapest edge connecting the current tree to an unvisited node.
### How it works
1. Start from any graph node.
2. Add its candidate outgoing edges to a min-priority queue.
3. Remove the cheapest candidate.
4. If its destination is already in the MST, skip it.
5. Otherwise, include the node and edge.
6. Add the new node’s outgoing edges.
7. Continue until every node has joined the MST.
**Memory flow:** `Grow one tree → Select cheapest boundary edge → Add new node`
---
# Prim State
```java
class State {
    int node;
    int edgeCost;

    State(int node, int edgeCost) {
        this.node = node;
        this.edgeCost = edgeCost;
    }
}
```
The priority queue is ordered by:
```plain text
Cost of connecting this node to the current MST
```
It is not necessarily the total distance from the starting node.
---
# Prim Template
```java
long prim(List<List<Edge>> graph) {
    int vertices = graph.size();

    boolean[] inMst = new boolean[vertices];

    PriorityQueue<State> queue =
        new PriorityQueue<>(
            (first, second) ->
                Integer.compare(
                    first.edgeCost,
                    second.edgeCost
                )
        );

    queue.offer(new State(0, 0));

    long totalCost = 0;
    int nodesUsed = 0;

    while (!queue.isEmpty()) {
        State current = queue.poll();

        if (inMst[current.node]) {
            continue;
        }

        inMst[current.node] = true;
        totalCost += current.edgeCost;
        nodesUsed++;

        for (Edge edge : graph.get(current.node)) {
            if (!inMst[edge.to]) {
                queue.offer(
                    new State(
                        edge.to,
                        edge.weight
                    )
                );
            }
        }
    }

    return nodesUsed == vertices
        ? totalCost
        : -1;
}
```
---
# Why Prim Starts with Cost `0`
The starting node does not require an edge to enter the MST.
Therefore:
```java
queue.offer(new State(start, 0));
```
Its contribution to total cost is zero.
Every later node contributes the cost of the selected edge that connects it to the existing tree.
---
# Why Prim May Add a Node Several Times
A node may be reachable through several candidate edges:
```plain text
A ──10── C
B ──2─── C
```
Both candidate states may enter the priority queue.
When `C` is selected through cost `2`, it becomes part of the MST.
The later cost-`10` entry is skipped using:
```java
if (inMst[current.node]) {
    continue;
}
```
---
# Prim versus Dijkstra
Both use a min-priority queue, but the stored cost has a different meaning.
## Dijkstra
```plain text
distance[node]
= total path cost from the source
```
Candidate:
```java
distance[current] + edgeWeight
```
## Prim
```plain text
connectionCost[node]
= cost of one edge connecting node to the MST
```
Candidate:
```java
edgeWeight
```
Dijkstra minimizes source-to-node path distances.
Prim minimizes the total cost of the selected tree edges.
---
# Prim with a Best-Connection Array
Prim can store the cheapest known edge connecting each node to the current MST.
```java
int[] best = new int[n];
Arrays.fill(best, Integer.MAX_VALUE);

best[0] = 0;
```
Relaxation:
```java
if (!inMst[next]
        && edgeWeight < best[next]) {
    best[next] = edgeWeight;
    queue.offer(
        new State(next, edgeWeight)
    );
}
```
This avoids inserting candidates that are already known to be worse.
The priority queue can still contain stale entries, so `inMst` remains useful.
---
# Kruskal versus Prim
## Prefer Kruskal when
- The input is naturally an edge list.
- Edges are easy to sort.
- The graph is sparse.
- Union-Find is already useful.
- You need to classify MST edges.
- Edges arrive in globally sorted order.
## Prefer Prim when
- The graph is naturally an adjacency list.
- You want to grow a network from one node.
- The graph is dense.
- Edge weights can be generated from the current node.
- Constructing and sorting every possible edge would be expensive.
## Complexity comparison
Kruskal:
```plain text
O(E log E)
```
Prim with adjacency list and binary heap:
```plain text
O(E log V)
```
Because:
```plain text
log E and log V
```
are closely related for ordinary graphs, both are often similar in practice.
---
# Common Forms
## Common Form 1: Standard Minimum Cost to Connect All Nodes
The graph directly provides weighted undirected edges.
### How it works
1. Treat objects as graph vertices.
2. Treat available connections as weighted edges.
3. Run Kruskal or Prim.
4. Select exactly `V - 1` safe edges.
5. If fewer nodes can be connected, return failure.
**Memory flow:** `Model weighted graph → Build MST → Verify complete connectivity`
Practice:
- LC 1135 — Connecting Cities With Minimum Cost
- Minimum Cost to Connect All Cities
- Network Wiring Problems
---
## Common Form 2: Complete Graph with Calculated Edge Costs
Sometimes every pair of nodes can be connected, but edges are not listed explicitly.
Example:
```plain text
Points in a plane
Cost = Manhattan distance
```
```java
cost =
    Math.abs(x1 - x2)
    + Math.abs(y1 - y2);
```
The implied graph contains:
```plain text
O(V²) edges
```
### How it works
1. Treat every point as a graph node.
2. Calculate connection costs when required.
3. Either generate every pair and use Kruskal.
4. Or use Prim and find the next cheapest connection directly.
5. Add nodes until all points are connected.
**Memory flow:** `Implicit complete graph → Calculate edge cost → Grow MST`
For a dense complete graph, array-based Prim can avoid storing all edges:
```java
int[] best = new int[n];
boolean[] inMst = new boolean[n];

Arrays.fill(best, Integer.MAX_VALUE);
best[0] = 0;

int totalCost = 0;

for (int count = 0; count < n; count++) {
    int node = -1;

    for (int candidate = 0;
            candidate < n;
            candidate++) {
        if (!inMst[candidate]
                && (node == -1
                    || best[candidate] < best[node])) {
            node = candidate;
        }
    }

    inMst[node] = true;
    totalCost += best[node];

    for (int next = 0; next < n; next++) {
        if (!inMst[next]) {
            int cost =
                Math.abs(points[node][0] - points[next][0])
                + Math.abs(points[node][1] - points[next][1]);

            best[next] =
                Math.min(best[next], cost);
        }
    }
}
```
Complexity:
```plain text
Time:  O(V²)
Space: O(V)
```
Practice:
- LC 1584 — Min Cost to Connect All Points
---
## Common Form 3: Existing Connections
Some connections already exist and require no additional cost.
Model them as:
```plain text
zero-cost edges
```
or union them before processing paid edges.
### How it works
1. Initialize Union-Find.
2. Union all existing free connections.
3. Sort the optional paid connections by cost.
4. Add the cheapest edges joining different components.
5. Stop when one component remains.
**Memory flow:** `Merge existing network → Connect remaining components cheaply`
```java
for (int[] connection : existing) {
    unionFind.union(
        connection[0],
        connection[1]
    );
}

paidEdges.sort(
    Comparator.comparingInt(edge -> edge.weight)
);
```
Practice:
- Minimum Cost to Repair or Connect a Network
- Connecting Cities with Existing Roads
- Amazon-style network connection problems
---
## Common Form 4: Virtual Node
Sometimes every location has two options:
```plain text
Build something locally
or
Connect to another location
```
Example:
```plain text
Build a well in each house
or
Connect houses using pipes
```
Create a virtual node representing the local-building option.
```plain text
Virtual node 0
0 → house i with cost wells[i]
house i → house j with pipe cost
```
Now the complete problem becomes one MST.
### How it works
1. Add one virtual node.
2. Connect it to every real node using that node’s independent construction cost.
3. Add the normal connection edges.
4. Run an MST across all nodes.
5. The selected virtual edges represent local construction.
**Memory flow:** `Convert alternative choices into edges → Run one MST`
Practice:
- LC 1168 — Optimize Water Distribution in a Village
This is one of the most important MST modeling techniques.
---
## Common Form 5: Stop When All Nodes Become Connected
Sometimes edges arrive sorted by time or cost.
We need the first moment when the entire graph becomes connected.
### How it works
1. Sort events by time or cost.
2. Union the endpoints of each event.
3. Decrease component count after a successful union.
4. When component count becomes one, return the current event value.
5. If this never happens, return failure.
**Memory flow:** `Process connections in order → Merge groups → Stop at one component`
```java
Arrays.sort(
    logs,
    (first, second) ->
        Integer.compare(first[0], second[0])
);

for (int[] log : logs) {
    int time = log[0];
    int first = log[1];
    int second = log[2];

    unionFind.union(first, second);

    if (unionFind.countComponents() == 1) {
        return time;
    }
}
```
Practice:
- LC 1101 — The Earliest Moment When Everyone Become Friends
This is closely related to Kruskal because edges are processed in sorted order.
---
## Common Form 6: Minimum Bottleneck Connection
Sometimes the objective is not the total edge cost.
Instead, minimize the largest edge used.
```plain text
Path or network cost
= maximum selected edge
```
In an MST, the path between any two nodes minimizes the maximum edge required between them.
### How it works
1. Sort edges by weight.
2. Union endpoints from smallest weight upward.
3. Stop when the required nodes become connected.
4. The current edge weight is the minimum possible bottleneck.
**Memory flow:** `Enable edges from smallest upward → Stop when connectivity appears`
```java
for (Edge edge : sortedEdges) {
    unionFind.union(edge.from, edge.to);

    if (unionFind.connected(source, destination)) {
        return edge.weight;
    }
}
```
Practice:
- LC 1631 — Path With Minimum Effort
- LC 778 — Swim in Rising Water
- Minimum Bottleneck Path
These problems can also be solved with minimax Dijkstra or binary search plus connectivity testing.
---
## Common Form 7: Critical and Pseudo-Critical MST Edges
An MST problem may ask how individual edges affect the optimal answer.
## Critical edge
Removing it increases the MST cost or makes an MST impossible.
## Pseudo-critical edge
It can appear in at least one MST, but is not required in every MST.
### How it works
1. Calculate the original MST cost.
2. For each edge, calculate an MST while excluding it.
3. If the result is worse or impossible, the edge is critical.
4. Otherwise, calculate an MST forcing that edge first.
5. If the cost equals the original MST cost, it is pseudo-critical.
**Memory flow:** `Compute baseline → Exclude edge → Force edge → Compare costs`
Practice:
- LC 1489 — Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree
This repeated-Kruskal approach is appropriate because the problem constraints are relatively small.
---
## Common Form 8: Maximum Spanning Tree
Sometimes we want the largest total selected edge weight while still connecting all vertices without cycles.
The structure is the same as an MST, but edges are processed in descending order.
### How it works
1. Sort edges from largest to smallest.
2. Use Union-Find to avoid cycles.
3. Include an edge when it joins separate components.
4. Stop after selecting `V - 1` edges.
**Memory flow:** `Process largest safe edges → Build maximum-cost spanning tree`
```java
edges.sort(
    (first, second) ->
        Integer.compare(
            second.weight,
            first.weight
        )
);
```
Use this only when the problem explicitly asks to maximize total connection value.
---
## Common Form 9: MST Savings
Some questions provide the cost of every existing edge and ask how much cost can be saved while keeping the graph connected.
### How it works
1. Calculate the sum of all edge weights.
2. Calculate the MST cost.
3. Remove every unnecessary edge.
4. Return:
```plain text
total original cost - MST cost
```
**Memory flow:** `Total current cost → Keep cheapest connected structure → Subtract`
```java
long savings =
    totalEdgeCost - minimumSpanningTreeCost;
```
Practice:
- Network Savings
- Dark Roads
- Infrastructure cost-reduction problems
---
## Common Form 10: Connect Components Rather Than Individual Nodes
Sometimes some nodes are already grouped into connected components.
The real MST decision is between those components.
### How it works
1. Union every existing connection.
2. Treat each resulting root as one component.
3. Process candidate edges between components.
4. Skip edges whose endpoints now have the same root.
5. Select the cheapest edges that merge separate components.
**Memory flow:** `Compress existing groups → Connect component representatives`
This frequently appears in infrastructure and network-upgrade questions.
---
# Recovering the Selected MST Edges
If the question requires the actual connections, not only total cost, save each accepted edge.
## Kruskal
```java
List<Edge> selected = new ArrayList<>();

if (unionFind.union(edge.from, edge.to)) {
    selected.add(edge);
    totalCost += edge.weight;
}
```
## Prim
Store the parent that offered the selected edge:
```java
class State {
    int node;
    int parent;
    int edgeCost;
}
```
When the node first enters the MST:
```java
selected.add(
    new Edge(
        current.parent,
        current.node,
        current.edgeCost
    )
);
```
Skip the artificial starting edge whose parent does not exist.
---
# Detecting a Disconnected Graph
An MST exists only if every vertex can be connected.
## Kruskal check
```java
edgesUsed == vertices - 1
```
## Prim check
```java
nodesUsed == vertices
```
If the condition fails:
```plain text
No spanning tree exists
```
Return the failure value required by the problem.
---
# Handling Duplicate Edge Weights
Duplicate weights do not cause a problem.
They may mean multiple valid MSTs exist.
Kruskal or Prim can choose any safe edge with the same cost unless the question requires:
- A specific MST
- Lexicographic ordering
- Critical-edge classification
- Counting distinct MSTs
---
# Quick Interview Checklist
1. Is the graph undirected?
2. Is every node required to be connected?
3. Are we minimizing total network cost?
4. Is this actually shortest path rather than MST?
5. Does the final structure need exactly `V - 1` edges?
6. Is the graph already guaranteed to be connected?
7. Should failure be returned for a disconnected graph?
8. Is the input naturally an edge list or adjacency list?
9. Should I prefer Kruskal or Prim?
10. If using Kruskal, did I sort edges by weight?
11. Am I using Union-Find to prevent cycles?
12. Does `union` return whether a merge occurred?
13. If using Prim, what does the priority-queue cost represent?
14. Did I skip nodes already added to the MST?
15. Are edges directed or should both directions be stored?
16. Are some connections already free?
17. Can a virtual node model independent construction?
18. Is the graph complete with calculated edge costs?
19. Can I avoid explicitly creating `O(V²)` edges?
20. Do I need total cost or the actual selected edges?
21. Is the objective total cost or maximum edge cost?
22. Could the total cost require `long`?
23. How will I verify that every node was connected?
---
# Common Mistakes
- Using MST when the question asks for a source-to-destination shortest path.
- Using Dijkstra when the objective is minimum total network cost.
- Applying MST directly to a directed graph.
- Forgetting that a spanning tree uses exactly `V - 1` edges.
- Returning a cost without verifying complete connectivity.
- Adding an edge in Kruskal even when its endpoints are already connected.
- Sorting edges in the wrong direction.
- Using subtraction in a comparator and risking overflow.
- Forgetting path compression or union by size in Union-Find.
- Decreasing component count after a failed union.
- In Prim, adding the total path distance instead of the selected edge cost.
- Marking a Prim node selected when adding it to the priority queue.
- Forgetting to skip duplicate priority-queue entries.
- Adding only one direction for an undirected Prim graph.
- Forgetting the starting node’s connection cost should be zero.
- Building every edge of a huge implicit complete graph unnecessarily.
- Missing the virtual-node transformation.
- Double-counting selected edges.
- Using `int` when the total MST cost can overflow.
- Assuming the MST is unique because the total cost is unique.
---
# Complexity Analysis
Let:
```plain text
V = number of vertices
E = number of edges
```
## Kruskal
Sorting:
```plain text
O(E log E)
```
Union-Find work:
```plain text
O(E × α(V))
```
Total:
```plain text
Time:  O(E log E)
Space: O(V + E)
```
## Prim with adjacency list and binary heap
Every candidate edge may enter the priority queue:
```plain text
Time:  O(E log V)
Space: O(V + E)
```
## Prim with adjacency matrix or implicit complete graph
```plain text
Time:  O(V²)
Space: O(V)
```
This can be preferable for dense graphs.
## Repeated MST for edge classification
Running Kruskal for every edge can require approximately:
```plain text
O(E² log E)
```
This is acceptable only when constraints are small enough.
---
# Final Algorithm Selection Model
```plain text
Need minimum total cost to connect every node?
→ Minimum Spanning Tree

Input is an edge list or graph is sparse?
→ Kruskal

Input is an adjacency list?
→ Prim

Graph is dense or complete?
→ O(V²) Prim may be simpler

Existing free connections?
→ Union them first

Each node can build independently or connect?
→ Add a virtual node

Need minimum possible largest edge?
→ Kruskal until connected or minimax Dijkstra

Need critical edges?
→ Recompute MST while excluding and forcing edges
```
The most important interview question is:
> “Am I minimizing the cost of one route, or the total cost required to connect the entire network?”
