## 1. Introduction to the Pattern
The 0/1 Knapsack pattern is used when every item has exactly two possibilities:
```plain text
Take the item once
or
Do not take the item
```
The `0/1` means:
```plain text
0 copies of an item
or
1 copy of an item
```
An item cannot be selected more than once.

Classic example:
```plain text
Item weights: [1, 3, 4, 5]
Item values:  [1, 4, 5, 7]
Capacity:     7
```
We must select items whose total weight is at most `7` while maximizing total value.

The pattern also appears when there are no explicit weights and values:
- Choose a subset having a target sum
- Divide an array into equal subsets
- Count subsets producing a sum
- Minimize the difference between two subset sums
- Assign `+` or `-` signs to numbers
- Select items under multiple capacity constraints
#### Core mental model
> For every item, decide whether to take it once or skip it permanently.

---
## 2. How to Identify It
Look for these signals:
- The input contains a collection of items.
- Every item can be selected at most once.
- You must choose a subset.
- There is a capacity, budget, target, or resource limit.
- The question asks for:
	- Maximum value
	- Minimum difference
	- Number of valid subsets
	- Whether a target is achievable
- The order of selected items does not matter.
- Each recursive state moves to the next item after both take and skip.
- The same `(index, remainingCapacity)` state appears repeatedly.

Common wording:
```plain text
Each item can be used once
Choose a subset
Can the array be partitioned?
Is target sum possible?
Count subsets with sum k
Maximum value within capacity
Assign plus or minus signs
```
#### Recognition question
> Am I deciding independently for every item whether to include it once or exclude it?

If yes, consider 0/1 Knapsack.
---
## 3. State Definition and Recursive Function Contract
The standard state contains:
```plain text
index
remaining capacity or remaining target
```
Complete:
> `solve(index, remaining)` returns  using items from `index` onward.

Examples:
```plain text
solve(index, capacity)
= maximum value obtainable using items from index onward
  without exceeding capacity

solve(index, target)
= whether items from index onward can produce target

solve(index, target)
= number of subsets from index onward whose sum equals target
```
### Why is `index` required?
The remaining capacity alone does not tell us which items are still available.
The same capacity may be reached after processing different sets of items.
### Why is `remaining` required?
The answer from the same index changes depending on how much capacity or target remains.

Therefore, the complete state is generally:
```plain text
(index, remaining)
```
---
## 4. Brute-Force Recursive Decision
At every item, make two choices.
```plain text
Skip:
Move to the next item
Keep remaining capacity unchanged

Take:
Use the current item
Reduce remaining capacity
Move to the next item
```
Classic maximum-value recursion:
```java
int solve(
        int[] weights,
        int[] values,
        int index,
        int capacity
) {
    if (index == weights.length) {
        return 0;
    }

    int skip = solve(
        weights,
        values,
        index + 1,
        capacity
    );

    int take = Integer.MIN_VALUE;

    if (weights[index] <= capacity) {
        take =
            values[index]
            + solve(
                weights,
                values,
                index + 1,
                capacity - weights[index]
            );
    }

    return Math.max(take, skip);
}
```
#### Why does take use `index + 1`?
```java
solve(index + 1, capacity - weights[index])
```
The current item has been consumed and cannot be selected again.
That is the defining difference between 0/1 and unbounded knapsack.

Decision tree:
```plain text
           item 0
         /        \
      take        skip
       /            \
    item 1          item 1
   /    \          /    \
take   skip     take    skip
```
For `n` items, brute force may explore:
```plain text
2ⁿ subsets
```
---
## 5. Base Cases
The base case depends on the objective.
### Maximum value
No items remain:
```java
if (index == weights.length) {
    return 0;
}
```
No additional value can be collected.
### Subset-sum feasibility
Target reached:
```java
if (target == 0) {
    return true;
}
```
No items remain before reaching the target:
```java
if (index == nums.length) {
    return false;
}
```
Combined safely:
```java
if (index == nums.length) {
    return target == 0;
}
```
### Count subsets
When every item has been processed:
```java
if (index == nums.length) {
    return target == 0 ? 1 : 0;
}
```
This form correctly handles zeros because every zero still gets a take-or-skip decision.
### Invalid target
When all values are non-negative:
```java
if (target < 0) {
    return 0;
}
```
or:
```java
return false;
```
depending on the return type.
#### Important warning
For counting subsets, this early return can be wrong:
```java
if (target == 0) {
    return 1;
}
```
If unprocessed zeros remain, each zero can be selected or skipped without changing the target, creating additional valid subsets.

Safer counting base case:
```java
if (index == nums.length) {
    return target == 0 ? 1 : 0;
}
```
---
## 6. Recurrence Relation
The recurrence comes directly from take and skip.
### Maximum-value knapsack
```plain text
skip = solve(index + 1, capacity)

take = value[index]
       + solve(
           index + 1,
           capacity - weight[index]
         )
```
When the item fits:
```plain text
solve(index, capacity)
= max(take, skip)
```
Otherwise:
```plain text
solve(index, capacity)
= skip
```
### Subset-sum feasibility
```plain text
skip = solve(index + 1, target)

take = solve(
    index + 1,
    target - nums[index]
)
```
Combine using OR:
```plain text
solve(index, target)
= take OR skip
```
### Count subsets
Combine using addition:
```plain text
solve(index, target)
= take + skip
```
#### Same choices, different objective
```plain text
Maximum value    → max(take, skip)
Target possible  → take OR skip
Count subsets    → take + skip
Minimum result   → min(take, skip)
```
The state structure remains similar; the combination operation changes.
---
## 7. Memoization Template
### Maximum-value template
```java
int solve(
        int[] weights,
        int[] values,
        int index,
        int capacity,
        int[][] memo
) {
    if (index == weights.length) {
        return 0;
    }

    if (memo[index][capacity] != -1) {
        return memo[index][capacity];
    }

    int skip = solve(
        weights,
        values,
        index + 1,
        capacity,
        memo
    );

    int take = Integer.MIN_VALUE;

    if (weights[index] <= capacity) {
        take =
            values[index]
            + solve(
                weights,
                values,
                index + 1,
                capacity - weights[index],
                memo
            );
    }

    memo[index][capacity] =
        Math.max(take, skip);

    return memo[index][capacity];
}
```
Initialization:
```java
int[][] memo =
    new int[weights.length][capacity + 1];

for (int[] row : memo) {
    Arrays.fill(row, -1);
}
```
### Boolean subset-sum template
```java
boolean solve(
        int[] nums,
        int index,
        int target,
        Boolean[][] memo
) {
    if (target == 0) {
        return true;
    }

    if (index == nums.length) {
        return false;
    }

    if (memo[index][target] != null) {
        return memo[index][target];
    }

    boolean skip =
        solve(nums, index + 1, target, memo);

    boolean take = false;

    if (nums[index] <= target) {
        take = solve(
            nums,
            index + 1,
            target - nums[index],
            memo
        );
    }

    memo[index][target] = take || skip;

    return memo[index][target];
}
```
#### Why use `Boolean[][]`?
It gives three states:
```plain text
null  → uncomputed
true  → possible
false → impossible
```
A primitive `boolean[][]` cannot distinguish uncomputed from computed `false` without an additional visited structure.
---
## 8. Tabulation Template
Define:
```plain text
dp[i][capacity]
= maximum value obtainable using the first i items
  with the given capacity
```
Array dimensions:
```java
int[][] dp =
    new int[numberOfItems + 1][capacity + 1];
```
Transition:
```java
int knapsack(
        int[] weights,
        int[] values,
        int capacity
) {
    int numberOfItems = weights.length;

    int[][] dp =
        new int[numberOfItems + 1][capacity + 1];

    for (int item = 1;
            item <= numberOfItems;
            item++) {
        int weight = weights[item - 1];
        int value = values[item - 1];

        for (int currentCapacity = 0;
                currentCapacity <= capacity;
                currentCapacity++) {
            int skip =
                dp[item - 1][currentCapacity];

            int take = Integer.MIN_VALUE;

            if (weight <= currentCapacity) {
                take =
                    value
                    + dp[item - 1]
                        [currentCapacity - weight];
            }

            dp[item][currentCapacity] =
                Math.max(take, skip);
        }
    }

    return dp[numberOfItems][capacity];
}
```
#### Why use `item - 1`?
DP row `item` represents the first `item` items.

The current item’s input-array index is:
```plain text
item - 1
```
#### Why do both choices read the previous row?
```plain text
skip → dp[item - 1][capacity]

take → dp[item - 1][capacity - weight]
```
Both choices consume the current item’s decision.
Reading from the previous row ensures the item is not reused.
---
## 9. Correct Iteration Order
### Two-dimensional DP
Each row depends only on the previous row:
```plain text
dp[item] depends on dp[item - 1]
```
Therefore:
```java
for (int item = 1; item <= n; item++) {
    for (int capacity = 0;
            capacity <= maxCapacity;
            capacity++) {
        // Calculate dp[item][capacity].
    }
}
```
Capacity may move left to right in the two-dimensional version because all reads come from the previous row.
### Suffix-state tabulation
If:
```plain text
dp[index][target]
depends on dp[index + 1][...]
```
then indices must be processed right to left:
```java
for (int index = n - 1; index >= 0; index--) {
    // Calculate states for index.
}
```
#### Core rule
> Process states only after every dependency used by the recurrence has already been calculated.

---
## 10. Space Optimization
The two-dimensional recurrence uses only:
```plain text
previous row
current row
```
It can first be reduced to two arrays.
### Two-row optimization
```java
int[] previous =
    new int[capacity + 1];

for (int item = 0;
        item < weights.length;
        item++) {
    int[] current =
        Arrays.copyOf(
            previous,
            previous.length
        );

    for (int currentCapacity = weights[item];
            currentCapacity <= capacity;
            currentCapacity++) {
        current[currentCapacity] =
            Math.max(
                previous[currentCapacity],
                values[item]
                    + previous[
                        currentCapacity
                            - weights[item]
                    ]
            );
    }

    previous = current;
}
```
### One-array optimization
```java
int[] dp = new int[capacity + 1];

for (int item = 0;
        item < weights.length;
        item++) {
    for (int currentCapacity = capacity;
            currentCapacity >= weights[item];
            currentCapacity--) {
        dp[currentCapacity] = Math.max(
            dp[currentCapacity],
            values[item]
                + dp[
                    currentCapacity
                        - weights[item]
                ]
        );
    }
}
```
### Why must capacity move backward?
Suppose the current item has weight `2`.

If capacity moves forward:
```plain text
dp[2] uses the item
dp[4] may use the newly updated dp[2]
```
The same item has now been used twice.

Moving backward ensures:
```plain text
dp[capacity - weight]
```
still represents the result before processing the current item.
#### Critical rule
```plain text
0/1 Knapsack:
iterate capacity from high to low
```
```plain text
Unbounded Knapsack:
usually iterate capacity from low to high
```
This direction difference controls whether the current item can be reused.
---
## 11. Common Problem Forms
### Common Form 1: Maximum Value Within Capacity
Each item has:
```plain text
Weight
Value
```
We need the maximum total value without exceeding capacity.
#### How it works
1. Process each item once.
2. For every capacity, compare taking and skipping it.
3. Taking uses the previous item state at reduced capacity.
4. Store the larger value.

**Memory flow:** `Take once or skip → Keep maximum value`
```plain text
dp[i][capacity]
= max(
    dp[i - 1][capacity],
    value[i - 1]
        + dp[i - 1][capacity - weight[i - 1]]
)
```
Practice:
- 0/1 Knapsack
- LC 474 — Ones and Zeroes
- LC 879 — Profitable Schemes
---
### Common Form 2: Subset Sum Feasibility
Determine whether some subset adds exactly to a target.
#### How it works
1. Define `dp[sum]` as whether the sum is achievable.
2. Initialize `dp[0] = true`.
3. Process every number once.
4. Iterate target backward.
5. Mark a sum possible if it was already possible or can be formed by adding the current number.

**Memory flow:** `Existing achievable sums → Add current number once`
```java
boolean subsetSum(
        int[] nums,
        int target
) {
    boolean[] dp =
        new boolean[target + 1];

    dp[0] = true;

    for (int number : nums) {
        for (int sum = target;
                sum >= number;
                sum--) {
            dp[sum] =
                dp[sum]
                || dp[sum - number];
        }
    }

    return dp[target];
}
```
Practice:
- LC 416 — Partition Equal Subset Sum
- Subset Sum
- LC 1049 — Last Stone Weight II
---
### Common Form 3: Partition into Equal Subsets
If total sum is `S`, two equal subsets must each have:
```plain text
S / 2
```
#### How it works
1. Calculate the total sum.
2. If it is odd, equal partitioning is impossible.
3. Set the target to `sum / 2`.
4. Determine whether a subset produces that target.
5. The remaining elements automatically produce the other half.

**Memory flow:** `Convert equal partition → Find one subset of half the total`
```java
int total = Arrays.stream(nums).sum();

if (total % 2 != 0) {
    return false;
}

return subsetSum(nums, total / 2);
```
Practice:
- LC 416 — Partition Equal Subset Sum
---
### Common Form 4: Minimum Subset-Sum Difference
Divide the array into two subsets minimizing:
```plain text
abs(sum1 - sum2)
```
Since:
```plain text
sum2 = totalSum - sum1
```
the difference is:
```plain text
abs(totalSum - 2 × sum1)
```
#### How it works
1. Find all achievable subset sums.
2. Only inspect sums up to `totalSum / 2`.
3. Choose the achievable sum closest to half.
4. Calculate `totalSum - 2 × subsetSum`.

**Memory flow:** `Find achievable sums → Choose sum closest to half`
```java
int answer = Integer.MAX_VALUE;

for (int subsetSum = 0;
        subsetSum <= total / 2;
        subsetSum++) {
    if (dp[subsetSum]) {
        answer = Math.min(
            answer,
            total - 2 * subsetSum
        );
    }
}
```
Practice:
- LC 1049 — Last Stone Weight II
- Minimum Subset Sum Difference
- Partition Array Into Two Subsets With Minimum Difference
---
### Common Form 5: Count Subsets with a Target Sum
Instead of storing feasibility, store the number of ways.
```plain text
dp[sum]
= number of subsets producing sum
```
#### How it works
1. Initialize `dp[0] = 1`.
2. Process each number once.
3. Iterate sums backward.
4. Add the number of subsets that produced `sum - number`.
5. Zeros automatically double existing counts.

**Memory flow:** `Count existing subsets → Add current item once`
```java
int countSubsets(
        int[] nums,
        int target
) {
    int[] dp = new int[target + 1];

    dp[0] = 1;

    for (int number : nums) {
        for (int sum = target;
                sum >= number;
                sum--) {
            dp[sum] += dp[sum - number];
        }
    }

    return dp[target];
}
```
#### How zeros behave
For `number == 0`:
```java
dp[sum] += dp[sum];
```
Every existing subset has two forms:
```plain text
Exclude zero
Include zero
```
Therefore, its count doubles.

Practice:
- Count Subsets With Sum K
- LC 494 — Target Sum
- LC 879 — Profitable Schemes
---
### Common Form 6: Target Sum Transformation
Assign `+` or `-` before every number.

Let:
```plain text
P = sum of positively assigned numbers
N = sum of negatively assigned numbers
```
We need:
```plain text
P - N = target
```
Also:
```plain text
P + N = totalSum
```
Adding the equations:
```plain text
2P = totalSum + target
```
Therefore:
```plain text
P = (totalSum + target) / 2
```
The problem becomes:
> Count subsets whose sum is `(totalSum + target) / 2`.

#### Validity checks
A solution is impossible when:
```plain text
abs(target) > totalSum
```
or:
```plain text
totalSum + target is odd
```
#### How it works
1. Calculate the total sum.
2. Validate the target range.
3. Validate parity.
4. Convert the problem into subset-count DP.
5. Count subsets producing the transformed target.

**Memory flow:** `Separate positive and negative groups → Convert to subset count`
```java
int transformed =
    totalSum + target;

if (Math.abs(target) > totalSum
        || transformed % 2 != 0) {
    return 0;
}

return countSubsets(
    nums,
    transformed / 2
);
```
Practice:
- LC 494 — Target Sum
---
### Common Form 7: Multiple Capacity Constraints
Some problems limit more than one resource.

Example:
```plain text
Number of zeros available
Number of ones available
```
State:
```plain text
dp[zeros][ones]
= maximum items selectable
```
#### How it works
1. Calculate each item’s resource consumption.
2. Process every item once.
3. Iterate every capacity dimension backward.
4. Compare taking and skipping the item.
5. Backward iteration prevents reuse.

**Memory flow:** `Consume several resources → Process each item once`
```java
for (String word : strings) {
    int zeros = countZeros(word);
    int ones = word.length() - zeros;

    for (int zeroCapacity = maxZeros;
            zeroCapacity >= zeros;
            zeroCapacity--) {
        for (int oneCapacity = maxOnes;
                oneCapacity >= ones;
                oneCapacity--) {
            dp[zeroCapacity][oneCapacity] =
                Math.max(
                    dp[zeroCapacity][oneCapacity],
                    1 + dp[
                        zeroCapacity - zeros
                    ][
                        oneCapacity - ones
                    ]
                );
        }
    }
}
```
Practice:
- LC 474 — Ones and Zeroes
- Multi-Dimensional 0/1 Knapsack
---
### Common Form 8: Select Items with an Exact Count or Additional Condition
Sometimes capacity is not the only changing condition.

State may include:
```plain text
index
remaining capacity
items remaining
```
or:
```plain text
index
remaining profit
remaining members
```
#### How it works
1. Add a DP dimension for every condition that changes future decisions.
2. Take or skip each item.
3. Reduce all resources affected by taking.
4. Combine results according to the objective.
5. Ensure the state does not contain information that can be derived from other parameters.

**Memory flow:** `Take or skip → Update multiple remaining conditions`

Example state:
```plain text
dp[index][remainingCapacity][itemsNeeded]
```
Practice:
- LC 879 — Profitable Schemes
- Pick Exactly K Items With Maximum Value
- Multi-Constraint Subset Problems
---
## 12. Answer Reconstruction
To determine which items were selected, preserve the two-dimensional DP table.

Starting from:
```plain text
item = n
capacity = maximumCapacity
```
Compare:
```plain text
dp[item][capacity]
```
with:
```plain text
dp[item - 1][capacity]
```
### If equal
The current item may have been skipped:
```java
item--;
```
### If different
The current item was selected:
```java
selected.add(item - 1);

capacity -= weights[item - 1];
item--;
```
Complete reconstruction:
```java
List<Integer> selected =
    new ArrayList<>();

int item = weights.length;
int remainingCapacity = capacity;

while (item > 0) {
    if (dp[item][remainingCapacity]
            == dp[item - 1][remainingCapacity]) {
        item--;
    } else {
        int selectedIndex = item - 1;

        selected.add(selectedIndex);
        remainingCapacity -=
            weights[selectedIndex];

        item--;
    }
}

Collections.reverse(selected);
```
#### Important note
If take and skip produce the same optimal value, several optimal subsets may exist.
The reconstruction above returns one valid optimal subset.
---
## 13. Quick Interview Checklist
1. Can every item be selected at most once?
2. Does order matter, or only the selected subset?
3. What does `solve(index, remaining)` return?
4. Which parameters completely define the state?
5. What are the take and skip transitions?
6. Does taking move to `index + 1`?
7. What should an impossible state return?
8. Am I maximizing, minimizing, counting, or checking feasibility?
9. How should take and skip be combined?
10. What does `dp[i][capacity]` represent?
11. Are items represented by rows or direct indices?
12. Do both transitions read from the previous row?
13. Can the DP be reduced to one dimension?
14. If using one dimension, is capacity moving backward?
15. Are zero-valued items present?
16. Can `-1` be a valid memoized answer?
17. Does the problem transform into subset sum?
18. Is the total sum parity important?
19. Can the target exceed the total sum?
20. Do I need the selected items or only the optimum value?
21. Is there more than one capacity dimension?
22. What are the number of states and work per state?
---
## 14. Common Mistakes
- Reusing the current item after taking it.
- Passing the same index in the take transition.
- Confusing 0/1 Knapsack with unbounded knapsack.
- Iterating one-dimensional capacity from low to high.
- Defining `dp[i][capacity]` without clarifying whether `i` is an index or item count.
- Reading the current DP row when an item should be used only once.
- Returning `0` for an impossible state in a maximization problem where it could appear valid.
- Using an unsafe negative sentinel and then adding value to it.
- Stopping count recursion immediately when target becomes zero despite remaining zeros.
- Forgetting `dp[0] = 1` for subset counting.
- Initializing all count-DP cells to one.
- Treating count DP as boolean DP.
- Forgetting the odd-total check for equal partition.
- Forgetting the range and parity checks for Target Sum.
- Using `(sum + target) / 2` before verifying it is valid.
- Double-counting a component of a transformed problem.
- Space-optimizing when reconstruction is required.
- Forgetting to iterate every capacity dimension backward.
- Assuming pseudo-polynomial complexity is polynomial only in the number of items.
---
## 15. Complexity Analysis
Let:
```plain text
n = number of items
C = capacity or target
```
### Brute-force recursion
Each item creates take and skip branches:
```plain text
Time:  O(2ⁿ)
Stack: O(n)
```
### Memoization
States:
```plain text
n × (C + 1)
```
Work per state:
```plain text
O(1)
```
Therefore:
```plain text
Time:  O(nC)
Memo:  O(nC)
Stack: O(n)
```
### Two-dimensional tabulation
```plain text
Time:  O(nC)
Space: O(nC)
```
### One-dimensional tabulation
```plain text
Time:  O(nC)
Space: O(C)
```
### Multiple constraints
For capacities `C1` and `C2`:
```plain text
Time:  O(n × C1 × C2)
Space: O(C1 × C2)
```
#### Pseudo-polynomial complexity
`O(nC)` depends on the numeric capacity, not only the number of input values.
If capacity is extremely large, standard knapsack DP may be impractical even when `n` is moderate.
---
## 16. Practice Progression
### Foundation
1. Subset Sum
2. 0/1 Knapsack
3. LC 416 — Partition Equal Subset Sum
### Count variations
1. Count Subsets With Sum K
2. LC 494 — Target Sum
3. LC 879 — Profitable Schemes
### Partition variations
1. Minimum Subset Sum Difference
2. LC 1049 — Last Stone Weight II
3. Partition Array Into Two Subsets With Minimum Difference
### Multiple constraints
1. LC 474 — Ones and Zeroes
2. Multi-Dimensional 0/1 Knapsack
### Advanced transformation and reconstruction
1. Reconstruct Selected Knapsack Items
2. Pick Exactly K Items
3. LC 956 — Tallest Billboard
---
## 17. Final Reusable Mental Model
```plain text
Define solve(index, remaining)
→ Choose take or skip
→ Move to the next item in both choices
→ Write objective-specific base cases
→ Combine choices using max, min, OR, or addition
→ Memoize repeated index-and-capacity states
→ Convert items into DP rows
→ Optimize to one dimension
→ Iterate capacity backward
```
The defining 0/1 Knapsack question is:
> “After selecting this item, have I permanently moved past it so it cannot be selected again?”
