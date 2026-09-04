Sliding window is a two-pointer technique for problems involving a **contiguous range**—a subarray or substring.
> **Core mental model:** Expand the right side to acquire elements. Shrink the left side when necessary. Maintain enough information to evaluate the current window efficiently.

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
> **Invariant:** Whenever the answer is calculated, `[left, right]` is a valid window.

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
Problems asking for **exactly `k`** can often be transformed:

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
> **Reusable flow:** Add `right` → restore the invariant using `left` → calculate the answer.
> For minimum-valid windows: Add `right` → once valid, calculate and shrink repeatedly.

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
