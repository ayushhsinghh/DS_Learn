## 1. Introduction to the Pattern
Unbounded Knapsack is used when every item may be selected any number of times.
For every item:
```plain text
Take it and allow it again
or
Skip it permanently
```
The word “unbounded” means there is no fixed limit on how many copies of an item may be selected.
Classic example:
```plain text
Weights:  [2, 3, 4]
Values:   [4, 5, 7]
Capacity: 8
```
Possible selections include:
```plain text
[2, 2, 2, 2]
[2, 3, 3]
[4, 4]
```
The same item can appear repeatedly.
This pattern commonly appears as:
- Minimum number of coins
- Number of coin combinations
- Number of ordered sequences
- Maximum value with reusable items
- Rod cutting
- Minimum number of perfect squares
- Exact-sum construction with unlimited pieces
#### Core mental model
> Taking an item does not remove it from future choices.
---
## 2. How to Identify It
Look for these signals:
- Each item may be used an unlimited number of times.
- The problem mentions coins, denominations, pieces, or reusable choices.
- You need to form a target amount.
- You need to maximize value within a capacity.
- You need the minimum number of reusable items.
- You need to count combinations or ordered sequences.
- After selecting an item, the same item remains available.
- The recursive take decision stays at the same index.
- The one-dimensional capacity loop naturally moves forward.
Common wording:
```plain text
Unlimited supply
Any number of times
Reuse elements
Infinite coins
Coin denominations
Cut a rod
Minimum number of pieces
Number of combinations
```
#### Recognition question
> After selecting the current item, am I allowed to select it again?
If yes, consider Unbounded Knapsack.
---
## 3. State Definition and Recursive Function Contract
The standard recursive state contains:
```plain text
index
remaining capacity or amount
```
Complete:
> `solve(index, remaining)` returns  using items from `index` onward, where every remaining item may be reused.
Examples:
```plain text
solve(index, capacity)
= maximum value obtainable with the remaining capacity

solve(index, amount)
= minimum number of coins needed to create the amount

solve(index, amount)
= number of combinations that create the amount

solve(index, target)
= whether the target can be created
```
### Why is `index` required?
The index determines which choices remain available and prevents counting the same unordered combination in different orders.
### Why is `remaining` required?
The answer changes depending on the amount or capacity still available.
The complete state is usually:
```plain text
(index, remaining)
```
For some bottom-up solutions, the item dimension can be removed:
```plain text
dp[amount]
```
The loop order then determines whether items are reusable and whether order matters.
---
## 4. Brute-Force Recursive Decision
At item `index`, there are two choices.
### Skip
Move past the current item:
```plain text
solve(index + 1, remaining)
```
### Take
Use the current item and remain at the same index:
```plain text
contribution
+ solve(index, remaining - cost[index])
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
                index,
                capacity - weights[index]
            );
    }

    return Math.max(take, skip);
}
```
#### Defining difference
```plain text
0/1 Knapsack take:
solve(index + 1, remaining - item)

Unbounded Knapsack take:
solve(index, remaining - item)
```
In Unbounded Knapsack, taking the item keeps its index available.
---
## 5. Base Cases
Base cases depend on the objective.
### Maximum value without requiring exact capacity
When no items remain:
```java
if (index == weights.length) {
    return 0;
}
```
Unused capacity is allowed.
### Minimum items for an exact amount
Amount completed:
```java
if (amount == 0) {
    return 0;
}
```
No items remain before completing the amount:
```java
if (index == coins.length) {
    return infinity;
}
```
Invalid negative amount:
```java
if (amount < 0) {
    return infinity;
}
```
### Count combinations for an exact amount
Successful completion:
```java
if (amount == 0) {
    return 1;
}
```
No items remain:
```java
if (index == coins.length) {
    return 0;
}
```
### Feasibility
```java
if (target == 0) {
    return true;
}

if (index == nums.length) {
    return false;
}
```
#### Impossible minimum-state warning
Do not return `0` for an impossible state:
```java
if (amount < 0) {
    return 0; // Incorrect for minimum coins.
}
```
It would make an invalid path look as if it used zero additional coins.
Use a large impossible value:
```java
int infinity = amount + 1;
```
or:
```java
Integer.MAX_VALUE / 2
```
---
## 6. Recurrence Relation
The recurrence comes from reusable take and permanent skip.
### Maximum-value Unbounded Knapsack
```plain text
skip =
solve(index + 1, capacity)

take =
value[index]
+ solve(
    index,
    capacity - weight[index]
)
```
Therefore:
```plain text
solve(index, capacity)
= max(take, skip)
```
### Minimum coins
```plain text
skip =
solve(index + 1, amount)

take =
1 + solve(
    index,
    amount - coin[index]
)
```
Therefore:
```plain text
solve(index, amount)
= min(take, skip)
```
### Count combinations
```plain text
solve(index, amount)
=
solve(index + 1, amount)
+
solve(index, amount - coin[index])
```
### Feasibility
```plain text
solve(index, target)
=
solve(index + 1, target)
OR
solve(index, target - value[index])
```
#### Same state structure, different combination
```plain text
Maximum value      → max
Minimum item count → min
Count combinations → addition
Check feasibility  → OR
```
---
## 7. Memoization Template
### Minimum-coins memoization
```java
int solve(
        int[] coins,
        int index,
        int amount,
        int[][] memo
) {
    if (amount == 0) {
        return 0;
    }

    if (index == coins.length) {
        return Integer.MAX_VALUE / 2;
    }

    if (memo[index][amount] != -1) {
        return memo[index][amount];
    }

    int skip = solve(
        coins,
        index + 1,
        amount,
        memo
    );

    int take = Integer.MAX_VALUE / 2;

    if (coins[index] <= amount) {
        take =
            1 + solve(
                coins,
                index,
                amount - coins[index],
                memo
            );
    }

    memo[index][amount] =
        Math.min(take, skip);

    return memo[index][amount];
}
```
Invocation:
```java
int[][] memo =
    new int[coins.length][amount + 1];

for (int[] row : memo) {
    Arrays.fill(row, -1);
}

int answer =
    solve(coins, 0, amount, memo);

return answer >= Integer.MAX_VALUE / 2
    ? -1
    : answer;
```
#### Why use `Integer.MAX_VALUE / 2`?
This is unsafe:
```java
1 + Integer.MAX_VALUE
```
It overflows into a negative number.
Using a smaller sentinel leaves room for addition.
A problem-specific value is often simpler:
```java
int infinity = amount + 1;
```
No valid answer can require more than `amount` coins when every coin value is positive and coin `1` is the smallest theoretical unit.
---
## 8. Tabulation Template
Define:
```plain text
dp[item][capacity]
= maximum value using the first item types
  with the given capacity
```
```java
int unboundedKnapsack(
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
                    + dp[item][
                        currentCapacity - weight
                    ];
            }

            dp[item][currentCapacity] =
                Math.max(take, skip);
        }
    }

    return dp[numberOfItems][capacity];
}
```
#### Important transition
Skip reads from the previous row:
```java
dp[item - 1][capacity]
```
Take reads from the current row:
```java
dp[item][capacity - weight]
```
Why?
The current row allows the same item type to be selected again.
Compare with 0/1 Knapsack:
```plain text
0/1 take:
dp[item - 1][capacity - weight]

Unbounded take:
dp[item][capacity - weight]
```
---
## 9. Correct Iteration Order
Iteration order is one of the most important parts of Unbounded Knapsack.
### Two-dimensional DP
The take transition reads:
```plain text
dp[item][capacity - weight]
```
This is the current row at a smaller capacity.
Therefore, capacity must move:
```plain text
low to high
```
```java
for (int capacity = 0;
        capacity <= maxCapacity;
        capacity++) {
    // Calculate current row.
}
```
### One-dimensional DP
To permit reuse of the current item:
```java
for (int item : items) {
    for (int capacity = item;
            capacity <= target;
            capacity++) {
        // Update dp[capacity].
    }
}
```
#### Comparison with 0/1 Knapsack
```plain text
0/1 Knapsack:
capacity moves high → low
prevents current item reuse

Unbounded Knapsack:
capacity moves low → high
allows current item reuse
```
#### Why forward iteration allows reuse
After updating:
```plain text
dp[coin]
```
a larger state such as:
```plain text
dp[2 × coin]
```
can reuse that updated result during the same item iteration.
That represents selecting the current coin again.
---
## 10. Space Optimization
The two-dimensional Unbounded Knapsack can usually be reduced to one array.
### Maximum-value template
```java
int[] dp = new int[capacity + 1];

for (int item = 0;
        item < weights.length;
        item++) {
    for (int currentCapacity = weights[item];
            currentCapacity <= capacity;
            currentCapacity++) {
        dp[currentCapacity] =
            Math.max(
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
### Minimum-coins template
```java
int[] dp = new int[amount + 1];

Arrays.fill(dp, amount + 1);
dp[0] = 0;

for (int coin : coins) {
    for (int currentAmount = coin;
            currentAmount <= amount;
            currentAmount++) {
        dp[currentAmount] =
            Math.min(
                dp[currentAmount],
                1 + dp[
                    currentAmount - coin
                ]
            );
    }
}

return dp[amount] == amount + 1
    ? -1
    : dp[amount];
```
#### Why does Coin Change I also work with amount as the outer loop?
For minimum coins:
```plain text
minimization does not distinguish ordering
```
Both loop orders can still produce the minimum number when transitions are otherwise correct.
For counting, however, loop order changes the meaning of the answer dramatically.
---
## 11. Common Problem Forms
### Common Form 1: Maximum Value with Reusable Items
Each item has:
```plain text
Weight
Value
Unlimited copies
```
The goal is to maximize total value without exceeding capacity.
#### How it works
1. Process every item type.
2. For every capacity, compare taking and skipping.
3. Taking reads the current item row or an already updated one-dimensional state.
4. This permits the item to be selected repeatedly.
5. Keep the maximum value.
**Memory flow:** `Take reusable item or skip its type → Keep maximum value`
```plain text
dp[capacity]
= max(
    dp[capacity],
    value
        + dp[capacity - weight]
)
```
Practice:
- Unbounded Knapsack
- Complete Knapsack
- Rod Cutting
---
### Common Form 2: Minimum Items to Reach an Exact Target
Choose reusable values to create an exact target using the fewest items.
#### How it works
1. Define `dp[amount]` as the minimum items required for that amount.
2. Initialize `dp[0] = 0`.
3. Initialize other states as impossible.
4. Try placing each reusable item after a smaller achievable amount.
5. Return failure if the target remains impossible.
**Memory flow:** `Reach smaller amount → Add one reusable item → Minimize count`
```java
int coinChange(
        int[] coins,
        int amount
) {
    int impossible = amount + 1;

    int[] dp = new int[amount + 1];
    Arrays.fill(dp, impossible);

    dp[0] = 0;

    for (int currentAmount = 1;
            currentAmount <= amount;
            currentAmount++) {
        for (int coin : coins) {
            if (coin <= currentAmount) {
                dp[currentAmount] =
                    Math.min(
                        dp[currentAmount],
                        1 + dp[
                            currentAmount - coin
                        ]
                    );
            }
        }
    }

    return dp[amount] == impossible
        ? -1
        : dp[amount];
}
```
Practice:
- LC 322 — Coin Change
- LC 279 — Perfect Squares
- Minimum Coins
- Minimum Number of Pieces
---
### Common Form 3: Count Unordered Combinations
Count how many combinations create an amount.
Order does not matter:
```plain text
[1, 2, 2]
and
[2, 1, 2]
```
represent the same combination.
#### How it works
1. Define `dp[amount]` as the number of combinations.
2. Initialize `dp[0] = 1`.
3. Process one coin type at a time.
4. Move amounts forward to allow coin reuse.
5. Keeping coins in the outer loop prevents different orders from being counted separately.
**Memory flow:** `Choose coin type → Extend existing combinations using that coin`
```java
int change(
        int amount,
        int[] coins
) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;

    for (int coin : coins) {
        for (int currentAmount = coin;
                currentAmount <= amount;
                currentAmount++) {
            dp[currentAmount] +=
                dp[currentAmount - coin];
        }
    }

    return dp[amount];
}
```
Practice:
- LC 518 — Coin Change II
- Count Ways to Make Change
---
### Common Form 4: Count Ordered Sequences
Here, order matters:
```plain text
[1, 2]
and
[2, 1]
```
are different answers.
#### How it works
1. Define `dp[target]` as the number of ordered sequences forming the target.
2. Process target amounts in the outer loop.
3. Try every possible final number in the inner loop.
4. Add the number of sequences forming `target - number`.
5. Different final choices create different orders.
**Memory flow:** `Choose final item for current total → Count preceding sequences`
```java
int combinationSum4(
        int[] nums,
        int target
) {
    int[] dp = new int[target + 1];
    dp[0] = 1;

    for (int currentTarget = 1;
            currentTarget <= target;
            currentTarget++) {
        for (int number : nums) {
            if (number <= currentTarget) {
                dp[currentTarget] +=
                    dp[
                        currentTarget - number
                    ];
            }
        }
    }

    return dp[target];
}
```
Practice:
- LC 377 — Combination Sum IV
- Count Ordered Compositions
---
### Combination versus Permutation Loop Order
This distinction is critical.
### Count combinations
Order does not matter:
```java
for (int coin : coins) {
    for (int amount = coin;
            amount <= target;
            amount++) {
        // Update.
    }
}
```
```plain text
Item outer
Amount inner
```
### Count ordered sequences
Order matters:
```java
for (int amount = 1;
        amount <= target;
        amount++) {
    for (int number : nums) {
        // Update.
    }
}
```
```plain text
Amount outer
Item inner
```
The recurrence may look similar, but loop order changes what is counted.
---
### Common Form 5: Rod Cutting
A rod of length `n` can be cut into pieces.
A piece length can be selected repeatedly, so each possible cut length behaves like an unlimited item.
```plain text
Weight   → piece length
Value    → price of that piece
Capacity → total rod length
```
#### How it works
1. Treat every possible piece length as an item.
2. Its weight is the amount of rod consumed.
3. Its value is the price earned.
4. Allow the same piece length to be selected repeatedly.
5. Maximize total price for the complete rod.
**Memory flow:** `Choose reusable cut length → Consume rod → Add price`
```java
for (int length = 1;
        length <= rodLength;
        length++) {
    for (int usedLength = length;
            usedLength <= rodLength;
            usedLength++) {
        dp[usedLength] =
            Math.max(
                dp[usedLength],
                price[length - 1]
                    + dp[usedLength - length]
            );
    }
}
```
Practice:
- Rod Cutting
- Unbounded Knapsack
- LC 1547 — Minimum Cost to Cut a Stick uses interval DP, not this pattern
The last distinction is important: not every cutting problem is Knapsack.
---
### Common Form 6: Minimum Number of Perfect Squares or Pieces
Available reusable items are generated rather than directly provided.
For Perfect Squares:
```plain text
1, 4, 9, 16, ...
```
Each square can be used repeatedly.
#### How it works
1. Generate every square not exceeding the target.
2. Treat each square as a reusable item.
3. Set `dp[0] = 0`.
4. For every amount, try every square that fits.
5. Minimize the number of selected squares.
**Memory flow:** `Generate reusable items → Build exact total with minimum count`
```java
int numSquares(int n) {
    int[] dp = new int[n + 1];
    Arrays.fill(dp, n + 1);

    dp[0] = 0;

    for (int amount = 1;
            amount <= n;
            amount++) {
        for (int number = 1;
                number * number <= amount;
                number++) {
            int square = number * number;

            dp[amount] = Math.min(
                dp[amount],
                1 + dp[amount - square]
            );
        }
    }

    return dp[n];
}
```
Practice:
- LC 279 — Perfect Squares
- Minimum Number of Coins
- Minimum Pieces to Reach a Length
---
### Common Form 7: Feasibility with Reusable Items
Determine whether an exact target can be constructed using reusable values.
State:
```plain text
dp[amount]
= whether amount can be formed
```
#### How it works
1. Initialize `dp[0] = true`.
2. Process every reusable item.
3. Move amount forward.
4. Mark a target possible when the smaller target was possible.
5. Reusing updated states permits repeated selection.
**Memory flow:** `Reach smaller total → Add reusable item → Mark new total possible`
```java
boolean[] dp =
    new boolean[target + 1];

dp[0] = true;

for (int number : nums) {
    for (int amount = number;
            amount <= target;
            amount++) {
        dp[amount] =
            dp[amount]
            || dp[amount - number];
    }
}
```
Practice:
- Unbounded Subset Sum
- Can Sum
- Word Break, conceptually similar but usually taught as partition DP
---
### Common Form 8: Maximum Number of Exact Pieces
Some problems require using the entire target while maximizing the number of pieces.
Example:
```plain text
Cut a segment of length n
using permitted lengths
and maximize the number of cuts
```
Unused capacity is not allowed.
#### How it works
1. Define `dp[length]` as the maximum number of pieces forming exactly that length.
2. Initialize impossible lengths with negative infinity.
3. Set `dp[0] = 0`.
4. Add one piece only to an achievable smaller length.
5. Return failure if the target remains impossible.
**Memory flow:** `Build exact length → Add one reusable piece → Maximize count`
```java
int impossible = Integer.MIN_VALUE / 2;

int[] dp = new int[target + 1];
Arrays.fill(dp, impossible);

dp[0] = 0;

for (int piece : pieces) {
    for (int length = piece;
            length <= target;
            length++) {
        dp[length] = Math.max(
            dp[length],
            1 + dp[length - piece]
        );
    }
}
```
#### Why not initialize everything to zero?
Zero would incorrectly mean every length is achievable using zero pieces.
Practice:
- Maximize the Cut Segments
- Exact Rod-Cutting Variations
- Ribbon Cut
---
## 12. Answer Reconstruction
To reconstruct which reusable items were selected, preserve the DP array and track the last choice.
For minimum coins:
```java
int[] previousCoin =
    new int[amount + 1];

Arrays.fill(previousCoin, -1);
```
When a coin improves the answer:
```java
if (1 + dp[currentAmount - coin]
        < dp[currentAmount]) {
    dp[currentAmount] =
        1 + dp[currentAmount - coin];

    previousCoin[currentAmount] = coin;
}
```
Reconstruct:
```java
List<Integer> selectedCoins =
    new ArrayList<>();

int currentAmount = amount;

while (currentAmount > 0
        && previousCoin[currentAmount] != -1) {
    int coin =
        previousCoin[currentAmount];

    selectedCoins.add(coin);
    currentAmount -= coin;
}
```
If the target is reachable:
```plain text
currentAmount eventually becomes 0
```
#### Reconstruction principle
> Store which reusable item produced each improved state, then repeatedly subtract that item.
The same item may appear multiple times in the reconstructed answer.
---
## 13. Quick Interview Checklist
1. Can every item be reused?
2. What does `solve(index, remaining)` return?
3. What happens to the index after taking an item?
4. What happens to the index after skipping it?
5. Is unused capacity allowed?
6. Must the target be formed exactly?
7. Am I maximizing, minimizing, counting, or checking feasibility?
8. What should an impossible state return?
9. Can adding to the impossible sentinel overflow?
10. What does `dp[amount]` represent?
11. Should capacity move forward or backward?
12. Does order matter in the counted answer?
13. Which loop should be outermost?
14. Do I need combinations or ordered sequences?
15. Is `dp[0]` zero, one, true, or another value?
16. Are all reusable item values positive?
17. Could a zero-valued reusable item cause infinite recursion?
18. Is this a cutting problem that actually uses interval DP?
19. Can the two-dimensional DP become one-dimensional?
20. Do I need to reconstruct selected items?
21. Could the count overflow `int`?
22. What are the number of states and work per state?
---
## 14. Common Mistakes
- Moving to `index + 1` after taking an item.
- Accidentally implementing 0/1 Knapsack.
- Iterating capacity backward in one-dimensional Unbounded Knapsack.
- Reading from the previous row in the take transition.
- Returning zero for an impossible minimum state.
- Adding one to `Integer.MAX_VALUE` and overflowing.
- Forgetting `dp[0] = 1` when counting constructions.
- Using `dp[0] = 1` for minimum coins instead of zero.
- Initializing impossible exact-sum maximization states to zero.
- Confusing number of combinations with number of ordered sequences.
- Using the wrong outer loop for counting.
- Assuming loop order never changes the DP meaning.
- Counting `[1, 2]` and `[2, 1]` separately when order should not matter.
- Merging them when order should matter.
- Allowing a reusable item with zero cost, causing infinite recursion or an unbounded answer.
- Using Unbounded Knapsack merely because the problem contains cuts.
- Forgetting that Minimum Cost to Cut a Stick is interval DP.
- Space-optimizing when answer reconstruction requires decisions.
- Assuming every coin system can form every amount.
- Returning the impossible sentinel instead of converting it to `-1`.
---
## 15. Complexity Analysis
Let:
```plain text
n = number of item types
C = capacity or target amount
```
### Brute-force recursion
Because an item can be selected repeatedly, the exact recursion tree depends on item values.
A loose exponential description is common:
```plain text
Time: exponential
```
Maximum recursion depth may be approximately:
```plain text
O(C / minimumItem)
```
when all item values are positive.
### Memoization
States:
```plain text
n × (C + 1)
```
Each state performs constant work:
```plain text
Time:  O(nC)
Memo:  O(nC)
```
Recursive stack:
```plain text
O(n + C / minimumItem)
```
depending on the path of skips and repeated takes.
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
### Generated items
For Perfect Squares, every amount checks up to `√amount` squares:
```plain text
Time:  O(n√n)
Space: O(n)
```
#### Pseudo-polynomial complexity
`O(nC)` depends on the numeric value of the capacity, so it is pseudo-polynomial rather than polynomial solely in the encoded input length.
---
## 16. Practice Progression
### Foundation
1. Unbounded Knapsack
2. Coin Change Minimum Coins
3. LC 322 — Coin Change
### Count combinations
1. Count Ways to Make Change
2. LC 518 — Coin Change II
### Count ordered sequences
1. LC 377 — Combination Sum IV
2. Count Ordered Compositions
### Cutting and reusable pieces
1. Rod Cutting
2. Maximize the Cut Segments
3. Ribbon Cut
### Generated reusable items
1. LC 279 — Perfect Squares
### Advanced distinctions
1. Reconstruct Selected Coins
2. Compare LC 322 and LC 518
3. Compare LC 518 and LC 377
4. Compare 0/1 Knapsack with Unbounded Knapsack
---
## 17. Final Reusable Mental Model
```plain text
Define solve(index, remaining)
→ Skip by moving to the next item
→ Take by staying at the current item
→ Reduce remaining capacity
→ Choose the correct objective operation
→ Memoize repeated index-and-capacity states
→ Convert into tabulation
→ Optimize into one dimension
→ Iterate capacity forward to permit reuse
→ Choose loop order based on whether order matters
```
The defining Unbounded Knapsack question is:
> “After selecting this item, should it remain available for the very next decision?”
