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
