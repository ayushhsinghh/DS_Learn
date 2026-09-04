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
