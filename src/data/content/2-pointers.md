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
> **Invariant:** Everything outside `[left, right]` has already been decided. Each comparison proves that at least one current boundary cannot participate in a better valid answer.
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
> **Invariant:** The range before `write` contains exactly the accepted elements seen so far, in their required order.
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
