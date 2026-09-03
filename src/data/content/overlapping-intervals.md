Intervals represent ranges such as `[start, end]`. Sorting them makes related or overlapping ranges appear next to each other.
> **Core mental model:** Sort by the appropriate boundary, compare neighboring ranges, then merge, select, intersect, or count.
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
