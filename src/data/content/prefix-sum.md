Prefix sum stores the cumulative result up to each position so that the result for any range can be calculated without scanning that range again.
> **Core mental model:** Store everything before each position. Subtract two stored states to isolate the range between them.

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
