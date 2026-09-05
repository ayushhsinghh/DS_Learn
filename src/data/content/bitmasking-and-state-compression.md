Bitmasking uses the bits of one integer to represent a collection of yes/no states.
Instead of storing:

```java
boolean[] selected = new boolean[n];
```

we can store the same information inside one integer:

```java
int mask;
```

Each bit represents one item:

```plain text
Bit position:  3  2  1  0
Item:          D  C  B  A
Mask:          1  0  1  1
```

This means items `A`, `B`, and `D` are selected.

## Why It Is Called State Compression

Suppose a problem has five keys, and each key can be:

```plain text
Collected or not collected
```

A normal state could be:

```java
boolean[] keys = {true, false, true, false, true};
```

A bitmask compresses that state into:

```plain text
10101
```

This can be stored as one integer:

```java
int mask = 21;
```

Therefore, an entire set of boolean conditions becomes one value.

## When Bitmasking Is Useful

Look for problems where:

- There are a small number of items, usually around `n ≤ 20`.
- Each item has two states: chosen/not chosen or visited/not visited.
- The order of selected items does not matter.
- You need to generate every subset.
- A DP or BFS state depends on which items have been used.
- You repeatedly compare sets of characters, skills, keys, or nodes.

The strongest clue is:

> The algorithm needs to remember a subset of a small collection.

## Representing a Set

Suppose:

```plain text
0 → Apple
1 → Banana
2 → Mango
3 → Orange
```

Mask:

```plain text
1101
```

represents:

```plain text
Apple  → selected
Banana → not selected
Mango  → selected
Orange → selected
```

### Check Whether Item `i` Is Present

```java
(mask & (1 << i)) != 0
```

### Add Item `i`

```java
mask |= 1 << i;
```

### Remove Item `i`

```java
mask &= ~(1 << i);
```

### Toggle Item `i`

```java
mask ^= 1 << i;
```

## Number of Possible States

If there are `n` items and every item has two choices:

```plain text
Selected or not selected
```

then there are:

```plain text
2^n
```

possible subsets.
For three items:

```plain text
000 → {}
001 → {A}
010 → {B}
011 → {A, B}
100 → {C}
101 → {A, C}
110 → {B, C}
111 → {A, B, C}
```

Every number from `0` to `(1 << n) - 1` represents one subset.

```java
for (int mask = 0; mask < (1 << n); mask++) {
    // mask represents one subset
}
```

## One Example: Generate All Subsets

For:

```plain text
nums = [10, 20, 30]
```

There are:

```plain text
2³ = 8
```

possible masks.

```java
List<List<Integer>> answer = new ArrayList<>();
int n = nums.length;

for (int mask = 0; mask < (1 << n); mask++) {
    List<Integer> subset = new ArrayList<>();

    for (int i = 0; i < n; i++) {
        if ((mask & (1 << i)) != 0) {
            subset.add(nums[i]);
        }
    }

    answer.add(subset);
}
```

For `mask = 5`:

```plain text
5 = 101
```

Therefore:

```plain text
Bit 0 is set → select 10
Bit 1 is not set → skip 20
Bit 2 is set → select 30

Subset = [10, 30]
```

This single example demonstrates:

- A bit represents an item.
- A mask represents a subset.
- `1 << i` selects an item’s position.
- AND checks whether an item belongs to the subset.
- Iterating from `0` to `2^n - 1` generates every subset.

## State Compression in Dynamic Programming

In DP, the mask becomes part of the state.
Suppose workers must be assigned to jobs, and each job can be used once.

```java
dp[mask]
```

can mean:

> The best answer after assigning exactly the jobs present in `mask`.

If job `j` has not been used:

```java
if ((mask & (1 << j)) == 0) {
    int nextMask = mask | (1 << j);
}
```

The transition moves from the current subset of used jobs to a larger subset.
This replaces a full `boolean[] used` with one integer.

## State Compression in BFS

Sometimes location alone is not enough to describe a state.
Example:

```plain text
(node, collectedKeys)
```

Reaching the same node with different keys represents different situations:

```plain text
(node = 4, mask = 0011)
(node = 4, mask = 1011)
```

Therefore, visited state must include both:

```java
boolean[][] visited =
    new boolean[numberOfNodes][1 << numberOfKeys];
```

This appears in problems where you must collect keys, visit every node, or satisfy multiple conditions.

## Common Operations

```java
// Empty set
int mask = 0;

// Set containing every one of n items
int fullMask = (1 << n) - 1;

// Check item
boolean present = (mask & (1 << i)) != 0;

// Add item
int nextMask = mask | (1 << i);

// Remove item
int nextMask = mask & ~(1 << i);

// Count selected items
int selected = Integer.bitCount(mask);

// Check whether one set contains all bits of another
boolean contains = (mask & requiredMask) == requiredMask;

// Union of two sets
int union = mask1 | mask2;

// Intersection of two sets
int intersection = mask1 & mask2;

// Difference: items in mask1 but not mask2
int difference = mask1 & ~mask2;
```

## Java Limits

For an `int` mask:

```java
1 << n
```

is generally suitable when the problem has a small number of states, commonly up to about 20 for exponential algorithms.
For larger bit positions, use `long`:

```java
long mask = 1L << i;
```

Remember that although an integer can store many bits, algorithms that process every mask take:

```plain text
O(2^n)
```

time or space. The practical limit comes from the number of states, not only the integer size.

## Core Mental Model

Always define the meaning of a bit and the meaning of the whole mask.
For example:

```plain text
Bit i = 1 → item i has been selected
mask      → complete set of selected items
dp[mask]  → best answer for this selected set
```

Before coding, write this sentence:

> In my mask, bit `i` represents , and `mask` represents .

If that sentence is unclear, the state definition is not ready.

---

## Core Patterns

## Bitmask as a Set

Use one integer to represent a set when the number of possible items is small.

```plain text
Bit i = 1 → item i is present
Bit i = 0 → item i is absent
```

Example:

```plain text
Items: A, B, C, D
Index: 0, 1, 2, 3

mask = 1011
```

The mask contains `A`, `B`, and `D`.

```java
int mask = 0;

// Add A and D
mask |= 1 << 0;
mask |= 1 << 3;

// Check whether D exists
boolean hasD = (mask & (1 << 3)) != 0;

// Remove A
mask &= ~(1 << 0);

// Number of selected items
int size = Integer.bitCount(mask);
```

Common set operations:

```java
int union = mask1 | mask2;
int intersection = mask1 & mask2;
int difference = mask1 & ~mask2;

boolean containsAll =
    (mask & requiredMask) == requiredMask;
```

Use this pattern when:

- Items have only present/absent states.
- You frequently add, remove, or compare small sets.
- The items represent characters, permissions, skills, keys, or visited nodes.

**Practice:**

- LC 1178 — Number of Valid Words for Each Puzzle
- LC 1239 — Maximum Length of a Concatenated String with Unique Characters
- LC 318 — Maximum Product of Word Lengths

## Generating All Subsets

For `n` items, there are `2ⁿ` possible subsets.
Each number from `0` to `(1 << n) - 1` represents one subset.
Example:

```plain text
nums = [10, 20, 30]
mask = 101
```

Here, bits `0` and `2` are set, so the subset is:

```plain text
[10, 30]
```

Code:

```java
List<List<Integer>> answer = new ArrayList<>();
int n = nums.length;

for (int mask = 0; mask < (1 << n); mask++) {
    List<Integer> subset = new ArrayList<>();

    for (int i = 0; i < n; i++) {
        if ((mask & (1 << i)) != 0) {
            subset.add(nums[i]);
        }
    }

    answer.add(subset);
}
```

Use this pattern when:

- You need to examine every possible subset.
- Every item has two choices: take or skip.
- `n` is small, usually around `20` or less.

**Complexity:**

```plain text
Number of subsets: 2ⁿ
Time:  O(n × 2ⁿ)
Space: O(n) excluding the generated output
```

**Practice:**

- LC 78 — Subsets
- LC 90 — Subsets II
- LC 784 — Letter Case Permutation
- LC 1239 — Maximum Length of a Concatenated String with Unique Characters

## Enumerating Submasks

Sometimes you already have a mask and need to examine every subset contained inside it.
Use:

```java
for (int submask = mask; submask > 0;
     submask = (submask - 1) & mask) {
    // Process submask
}
```

Example:

```plain text
mask = 1011
```

Its non-empty submasks are generated as:

```plain text
1011
1010
1001
1000
0011
0010
0001
```

Why this works:

- `submask - 1` moves to a smaller bit pattern.
- `& mask` removes bits that are not present in the original mask.

To include the empty submask:

```java
int submask = mask;

while (true) {
    // Process submask

    if (submask == 0) {
        break;
    }

    submask = (submask - 1) & mask;
}
```

Use this pattern when:

- Splitting a set into two groups.
- Trying every subset of the currently available items.
- A DP transition depends on a smaller subset.

**Complexity:**

```plain text
Submasks of one mask: O(2^k)
```

Here, `k` is the number of set bits in `mask`.
Enumerating submasks for every possible `n`-bit mask takes:

```plain text
O(3ⁿ)
```

**Practice:**

- LC 1986 — Minimum Number of Work Sessions to Finish the Tasks
- LC 2305 — Fair Distribution of Cookies
- LC 1494 — Parallel Courses II

## Encoding Character or Feature Sets

Assign one bit to each possible character or feature.
For lowercase English letters:

```plain text
bit 0  → a
bit 1  → b
...
bit 25 → z
```

Example: encode `"cab"`:

```java
int mask = 0;

for (char ch : "cab".toCharArray()) {
    mask |= 1 << (ch - 'a');
}
```

Result:

```plain text
c → bit 2
a → bit 0
b → bit 1

mask = 0111
```

Now compare two words quickly:

```java
boolean shareCharacter = (mask1 & mask2) != 0;
boolean disjoint = (mask1 & mask2) == 0;
```

Detect a repeated character:

```java
int bit = 1 << (ch - 'a');

if ((mask & bit) != 0) {
    // Character already exists
}

mask |= bit;
```

Use this when:

- The character set or number of features is small.
- Only presence matters, not frequency.
- You need to compare many character sets.

Do not use one bit per character when duplicate counts matter. `"ab"` and `"aab"` produce the same mask.
**Practice:**

- LC 318 — Maximum Product of Word Lengths
- LC 1239 — Maximum Length of a Concatenated String with Unique Characters
- LC 1178 — Number of Valid Words for Each Puzzle
- LC 1371 — Find the Longest Substring Containing Vowels in Even Counts

## Visited-State Compression

Sometimes reaching the same position with different collected items represents different states.
Therefore, position alone cannot be marked as visited.
Example: You reach node `4` with different keys:

```plain text
(node = 4, mask = 001) → only key A
(node = 4, mask = 101) → keys A and C
```

These must be treated as separate states.

```java
boolean[][] visited =
    new boolean[numberOfNodes][1 << numberOfItems];
```

BFS state:

```java
class State {
    int node;
    int mask;

    State(int node, int mask) {
        this.node = node;
        this.mask = mask;
    }
}
```

When item `i` is collected:

```java
int nextMask = mask | (1 << i);

if (!visited[nextNode][nextMask]) {
    visited[nextNode][nextMask] = true;
    queue.offer(new State(nextNode, nextMask));
}
```

Use this when:

- The answer depends on both your position and collected items.
- You must collect keys or visit every node.
- Returning to the same location with a different mask can produce a new result.

State meaning:

```plain text
visited[node][mask]
= Have we reached this node with exactly this collected set?
```

**Complexity for a graph:**

```plain text
States: O(V × 2ⁿ)
Time:   O((V + E) × 2ⁿ)
Space:  O(V × 2ⁿ)
```

**Practice:**

- LC 847 — Shortest Path Visiting All Nodes
- LC 864 — Shortest Path to Get All Keys
- LC 1129 — Shortest Path with Alternating Colors, using a small state instead of a full mask

## Assignment and Matching With Masks

Use a mask when items must be assigned once, such as assigning jobs to workers.
State:

```plain text
Bit j = 1 → job j has already been assigned
dp[mask]  → minimum cost after assigning the jobs in mask
```

The number of assigned workers is:

```java
int worker = Integer.bitCount(mask);
```

Example transition:

```java
int solve(int mask) {
    int worker = Integer.bitCount(mask);

    if (worker == n) {
        return 0;
    }

    int answer = Integer.MAX_VALUE;

    for (int job = 0; job < n; job++) {
        if ((mask & (1 << job)) == 0) {
            int nextMask = mask | (1 << job);

            answer = Math.min(
                answer,
                cost[worker][job] + solve(nextMask)
            );
        }
    }

    return answer;
}
```

Use this when:

- Every worker chooses exactly one job.
- Every job can be used only once.
- You need the minimum or maximum cost across all assignments.
- `n` is small enough for approximately `O(n × 2ⁿ)` states and transitions.

The mask prevents assigning the same job twice.
**Complexity:**

```plain text
Time:  O(n × 2ⁿ)
Space: O(2ⁿ)
```

**Practice:**

- LC 1879 — Minimum XOR Sum of Two Arrays
- LC 1947 — Maximum Compatibility Score Sum
- LC 2172 — Maximum AND Sum of Array
- LC 1066 — Campus Bikes II

## `dp[mask][last]`

Use this when the answer depends on:

1. Which items have already been used.
2. Which item was chosen most recently.

State:

```plain text
dp[mask][last]
= best answer after using items in mask
  and ending at item last
```

Example: visit every city once with minimum cost.

```java
for (int mask = 0; mask < (1 << n); mask++) {
    for (int last = 0; last < n; last++) {
        if ((mask & (1 << last)) == 0) {
            continue;
        }

        for (int next = 0; next < n; next++) {
            if ((mask & (1 << next)) == 0) {
                int nextMask = mask | (1 << next);

                dp[nextMask][next] = Math.min(
                    dp[nextMask][next],
                    dp[mask][last] + cost[last][next]
                );
            }
        }
    }
}
```

Why `last` is required:

```plain text
mask = 0111
```

tells us which cities were visited, but not the current city. The cost of visiting the next city depends on where we currently are.
Use this when:

- Every item must be visited or arranged once.
- Transition cost depends on the previously selected item.
- The state needs both the selected set and the current endpoint.

**Complexity:**

```plain text
States: O(n × 2ⁿ)
Time:   O(n² × 2ⁿ)
Space:  O(n × 2ⁿ)
```

**Practice:**

- LC 943 — Find the Shortest Superstring
- LC 847 — Shortest Path Visiting All Nodes
- LC 996 — Number of Squareful Arrays
- Travelling Salesman Problem (classic)
