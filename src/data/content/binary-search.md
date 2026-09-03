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
> **Search-space invariant:** Before every iteration, if the answer exists, it is inside the current search space. Every update must preserve this statement.
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
