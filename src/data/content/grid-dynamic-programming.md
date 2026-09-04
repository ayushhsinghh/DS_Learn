## 1. Introduction to the Pattern

Grid DP is used when a problem takes place on a matrix and the answer for one cell depends on answers from other cells.

Typical state:

```plain text
dp[row][col]
= answer associated with reaching or starting from cell (row, col)

```

Depending on the problem, `dp[row][col]` may represent:

- Number of ways to reach the cell
- Minimum cost to reach the cell
- Maximum value collected up to the cell
- Whether the cell is reachable
- Best answer starting from the cell
- Size of a shape ending at the cell

#### Core mental model

> Treat every cell as a state and determine which neighboring states can transition into it.

---

## 2. How to Identify It

Look for these signals:

- The input is a matrix or grid.
- You move between neighboring cells.
- Movement is restricted, such as:
	- Right and down
	- Down, down-left, and down-right
	- Four directions
- The problem asks for:
	- Number of paths
	- Minimum or maximum path cost
	- Reachability
	- Maximum collected value
	- Size of a square or other shape
- Recursive paths repeatedly reach the same cell.
- The state can usually be represented using row and column.

Common wording:

```plain text
travel from top-left to bottom-right
minimum path sum
number of unique paths
falling path
collect maximum points
blocked cells
move only right or down

```

#### Recognition question

> If I know the answer for neighboring cells, can I calculate the answer for the current cell?

If yes, consider Grid DP.

#### Important warning

Not every grid problem is DP.

- Shortest path with equal edge weights and four-direction movement usually suggests BFS.
- Weighted movement with arbitrary directions may suggest Dijkstra.
- Visiting every cell exactly once often suggests backtracking or bitmask DP.
- Connected components usually suggest DFS, BFS, or Union Find.

Grid DP works best when movement creates a clear dependency order.

---

## 3. State Definition and Recursive Function Contract

Before writing code, define exactly what the state means.

Complete this sentence:

> `solve(row, col)` returns .

Two common contracts exist.

### Contract A: Start from the current cell

```plain text
solve(row, col)
= answer obtained by starting from (row, col)
  and moving toward the destination

```

Example:

```plain text
solve(row, col)
= minimum cost required to travel from (row, col)
  to the bottom-right cell

```

### Contract B: End at the current cell

```plain text
dp[row][col]
= answer obtained by reaching (row, col)
  from the starting cell

```

Example:

```plain text
dp[row][col]
= number of ways to reach (row, col)
  from the top-left cell

```

These contracts determine:

- Your base cases
- Your recurrence
- Your iteration direction
- Which cell contains the final answer

#### State parameters

A basic Grid DP state needs:

```plain text
(row, col)

```

Some problems require extra state:

```plain text
(row, col, remainingMoves)
(row, col, health)
(row, col1, col2)
(row, col, direction)

```

Only add a parameter if it can change the answer for the same cell.

---

## 4. Brute-Force Recursive Decision

Consider a grid where we may move right or down.
At cell `(row, col)`, the available decisions are:

```plain text
Move right: solve(row, col + 1)
Move down:  solve(row + 1, col)

```

For minimum path sum:

```java
int solve(int[][] grid, int row, int col) {
    if (row >= grid.length || col >= grid[0].length) {
        return Integer.MAX_VALUE;
    }

    if (row == grid.length - 1 && col == grid[0].length - 1) {
        return grid[row][col];
    }

    int right = solve(grid, row, col + 1);
    int down = solve(grid, row + 1, col);

    return grid[row][col] + Math.min(right, down);
}

```

#### Recursive decision tree

From `(0, 0)`:

```plain text
            (0,0)
         /         \
     (0,1)         (1,0)
    /     \        /    \
(0,2)    (1,1)  (1,1)  (2,0)

```

The same cell `(1,1)` is calculated multiple times.
That repeated work is the signal to use DP.

#### Brute-force complexity

For right and down movement:

```plain text
Time: O(2^(rows + columns))
Space: O(rows + columns)

```

The recursion depth is bounded by the path length.

---

## 5. Base Cases

Grid DP commonly needs three kinds of base cases.

### Destination reached

For counting paths:

```java
if (row == rows - 1 && col == cols - 1) {
    return 1;
}

```

For minimum cost:

```java
if (row == rows - 1 && col == cols - 1) {
    return grid[row][col];
}

```

### Outside the grid

For counting paths, an invalid path contributes zero ways:

```java
if (row >= rows || col >= cols) {
    return 0;
}

```

For minimum cost, an invalid path must never be selected:

```java
if (row >= rows || col >= cols) {
    return INF;
}

```

For maximum value:

```java
if (row >= rows || col >= cols) {
    return NEGATIVE_INFINITY;
}

```

### Blocked cell

For a grid containing obstacles:

```java
if (grid[row][col] == 1) {
    return 0;
}

```

#### Important rule

The invalid-state value must match the objective:

```plain text
Counting ways  -> 0
Minimum        -> positive infinity
Maximum        -> negative infinity
Feasibility    -> false

```

---

## 6. Recurrence Relation

The recurrence combines valid neighboring states.

### Count paths

```plain text
ways(row, col)
= ways(row + 1, col)
+ ways(row, col + 1)

```

### Minimum path sum

```plain text
minCost(row, col)
= grid[row][col]
+ min(
    minCost(row + 1, col),
    minCost(row, col + 1)
  )

```

### Maximum path value

```plain text
maxValue(row, col)
= grid[row][col]
+ max(valid neighboring states)

```

### Feasibility

```plain text
reachable(row, col)
= reachable(previous cell 1)
  OR reachable(previous cell 2)

```

### Falling path

If we move from one row to the next using down-left, down, or down-right:

```plain text
dp[row][col]
= matrix[row][col]
+ min(
    dp[row - 1][col - 1],
    dp[row - 1][col],
    dp[row - 1][col + 1]
  )

```

#### General recurrence template

```plain text
dp[current cell]
=
value/contribution of current cell
+
combine(dp[valid dependency cells])

```

Where `combine` can be:

```plain text
sum  -> count paths
min  -> minimum cost
max  -> maximum value
OR   -> feasibility

```

---

## 7. Memoization Template

### Minimum path sum

```java
class Solution {
    private int[][] memo;
    private int rows;
    private int cols;

    private int solve(int[][] grid, int row, int col) {
        if (row >= rows || col >= cols) {
            return Integer.MAX_VALUE;
        }

        if (row == rows - 1 && col == cols - 1) {
            return grid[row][col];
        }

        if (memo[row][col] != -1) {
            return memo[row][col];
        }

        int right = solve(grid, row, col + 1);
        int down = solve(grid, row + 1, col);

        int nextCost = Math.min(right, down);

        return memo[row][col] = grid[row][col] + nextCost;
    }

    public int minPathSum(int[][] grid) {
        rows = grid.length;
        cols = grid[0].length;

        memo = new int[rows][cols];

        for (int[] row : memo) {
            Arrays.fill(row, -1);
        }

        return solve(grid, 0, 0);
    }
}

```

#### Memoization complexity

Each cell is solved once:

```plain text
Time:  O(rows × columns)
Space: O(rows × columns)

```

Recursion stack:

```plain text
O(rows + columns)

```

for right/down movement.

#### Memoization warning

Using `-1` as “not calculated” works only if `-1` cannot be a valid answer.

Otherwise use:

```java
Integer[][] memo;

```

Then:

```java
if (memo[row][col] != null) {
    return memo[row][col];
}

```

---

## 8. Tabulation Template

There are two common tabulation directions.

### Prefix-style tabulation

Define:

```plain text
dp[row][col]
= answer for reaching (row, col) from the start

```

Dependencies come from above and left:

```java
for (int row = 0; row < rows; row++) {
    for (int col = 0; col < cols; col++) {
        // Calculate dp[row][col] using:
        // dp[row - 1][col]
        // dp[row][col - 1]
    }
}

```

### Suffix-style tabulation

Define:

```plain text
dp[row][col]
= answer from (row, col) to the destination

```

Dependencies come from below and right:

```java
for (int row = rows - 1; row >= 0; row--) {
    for (int col = cols - 1; col >= 0; col--) {
        // Calculate dp[row][col] using:
        // dp[row + 1][col]
        // dp[row][col + 1]
    }
}

```

### Minimum path sum tabulation

```java
int[][] dp = new int[rows][cols];

for (int row = 0; row < rows; row++) {
    for (int col = 0; col < cols; col++) {
        if (row == 0 && col == 0) {
            dp[row][col] = grid[row][col];
        } else {
            int fromTop = row > 0
                ? dp[row - 1][col]
                : Integer.MAX_VALUE;

            int fromLeft = col > 0
                ? dp[row][col - 1]
                : Integer.MAX_VALUE;

            dp[row][col] =
                grid[row][col] + Math.min(fromTop, fromLeft);
        }
    }
}

return dp[rows - 1][cols - 1];

```

---

## 9. Correct Iteration Order

The iteration order comes from the recurrence dependencies.

#### Rule

> Every dependency must already be calculated before the current state.

### Depends on top and left

```plain text
dp[row][col]
depends on:
dp[row - 1][col]
dp[row][col - 1]

```

Process:

```java
for (int row = 0; row < rows; row++) {
    for (int col = 0; col < cols; col++) {
    }
}

```

### Depends on bottom and right

```plain text
dp[row][col]
depends on:
dp[row + 1][col]
dp[row][col + 1]

```

Process:

```java
for (int row = rows - 1; row >= 0; row--) {
    for (int col = cols - 1; col >= 0; col--) {
    }
}

```

### Depends on the previous row

Process rows from top to bottom:

```java
for (int row = 1; row < rows; row++) {
    for (int col = 0; col < cols; col++) {
    }
}

```

### Depends on the next row

Process rows from bottom to top:

```java
for (int row = rows - 2; row >= 0; row--) {
    for (int col = 0; col < cols; col++) {
    }
}

```

#### Fast interview technique

Draw arrows from every dependency toward the current cell.
Then process the grid in the same direction as those arrows.

---

## 10. Space Optimization

If each row depends only on the previous row, the entire matrix is unnecessary.

### Two-row optimization

```java
int[] previous = new int[cols];

for (int row = 0; row < rows; row++) {
    int[] current = new int[cols];

    for (int col = 0; col < cols; col++) {
        // current[col]     represents the current row
        // previous[col]    represents the previous row
        // current[col - 1] represents the current row's left cell
    }

    previous = current;
}

```

Space:

```plain text
O(columns)

```

### One-row optimization

For minimum path sum:

```java
public int minPathSum(int[][] grid) {
    int rows = grid.length;
    int cols = grid[0].length;

    int[] dp = new int[cols];

    for (int row = 0; row < rows; row++) {
        for (int col = 0; col < cols; col++) {
            if (row == 0 && col == 0) {
                dp[col] = grid[row][col];
            } else if (row == 0) {
                dp[col] = dp[col - 1] + grid[row][col];
            } else if (col == 0) {
                dp[col] = dp[col] + grid[row][col];
            } else {
                dp[col] =
                    grid[row][col]
                    + Math.min(dp[col], dp[col - 1]);
            }
        }
    }

    return dp[cols - 1];
}

```

#### Meaning during the update

Before updating:

```plain text
dp[col] = value from the previous row

```

After updating:

```plain text
dp[col] = value for the current row

```

And:

```plain text
dp[col - 1] = updated value for the cell on the left

```

#### When not to space-optimize

Avoid immediate space optimization when:

- You need to reconstruct the complete path.
- The recurrence depends on several previous rows.
- It makes the solution harder to verify.
- The full table is required for later decisions.

---

## 11. Common Problem Forms

### Common Form 1: Count Paths

Find the number of ways to travel from the top-left to the bottom-right.

#### How it works

Each cell receives paths from the cells that can directly enter it. With right/down movement, those cells are above and left.

#### State

```plain text
dp[row][col]
= number of ways to reach (row, col)

```

#### Transition

```plain text
dp[row][col]
= dp[row - 1][col]
+ dp[row][col - 1]

```

#### Code

```java
public int uniquePaths(int rows, int cols) {
    int[][] dp = new int[rows][cols];

    for (int row = 0; row < rows; row++) {
        dp[row][0] = 1;
    }

    for (int col = 0; col < cols; col++) {
        dp[0][col] = 1;
    }

    for (int row = 1; row < rows; row++) {
        for (int col = 1; col < cols; col++) {
            dp[row][col] =
                dp[row - 1][col] + dp[row][col - 1];
        }
    }

    return dp[rows - 1][cols - 1];
}

```

Practice:

- LC 62 — Unique Paths
- LC 576 — Out of Boundary Paths
- LC 2328 — Number of Increasing Paths in a Grid

---

### Common Form 2: Count Paths With Obstacles

Some cells cannot be used.

#### How it works

A blocked cell contributes zero paths. Every unblocked cell receives paths from valid neighboring cells.

#### State

```plain text
dp[row][col]
= number of valid ways to reach (row, col)

```

#### Code

```java
public int uniquePathsWithObstacles(int[][] grid) {
    int rows = grid.length;
    int cols = grid[0].length;

    int[][] dp = new int[rows][cols];

    if (grid[0][0] == 1) {
        return 0;
    }

    dp[0][0] = 1;

    for (int row = 0; row < rows; row++) {
        for (int col = 0; col < cols; col++) {
            if (grid[row][col] == 1) {
                dp[row][col] = 0;
                continue;
            }

            if (row > 0) {
                dp[row][col] += dp[row - 1][col];
            }

            if (col > 0) {
                dp[row][col] += dp[row][col - 1];
            }
        }
    }

    return dp[rows - 1][cols - 1];
}

```

Practice:

- LC 63 — Unique Paths II

---

### Common Form 3: Minimum or Maximum Path Cost

Every cell contains a cost or reward.

#### How it works

Choose the best predecessor and then include the current cell’s value.

#### State

```plain text
dp[row][col]
= minimum cost required to reach (row, col)

```

#### Transition

```plain text
dp[row][col]
= grid[row][col]
+ min(top, left)

```

#### Code

```java
public int minPathSum(int[][] grid) {
    int rows = grid.length;
    int cols = grid[0].length;

    int[][] dp = new int[rows][cols];
    dp[0][0] = grid[0][0];

    for (int col = 1; col < cols; col++) {
        dp[0][col] = dp[0][col - 1] + grid[0][col];
    }

    for (int row = 1; row < rows; row++) {
        dp[row][0] = dp[row - 1][0] + grid[row][0];
    }

    for (int row = 1; row < rows; row++) {
        for (int col = 1; col < cols; col++) {
            dp[row][col] =
                grid[row][col]
                + Math.min(
                    dp[row - 1][col],
                    dp[row][col - 1]
                );
        }
    }

    return dp[rows - 1][cols - 1];
}

```

Practice:

- LC 64 — Minimum Path Sum
- LC 120 — Triangle
- LC 2304 — Minimum Path Cost in a Grid

---

### Common Form 4: Falling Path

You move from one row to the next using a set of allowed columns.

#### How it works

Every cell checks which cells from the previous row can enter it, selects the best one, and includes its own value.

#### State

```plain text
dp[row][col]
= minimum falling-path sum ending at (row, col)

```

#### Transition

```plain text
dp[row][col]
= matrix[row][col]
+ min(
    top-left,
    top,
    top-right
  )

```

#### Code

```java
public int minFallingPathSum(int[][] matrix) {
    int rows = matrix.length;
    int cols = matrix[0].length;

    int[][] dp = new int[rows][cols];

    for (int col = 0; col < cols; col++) {
        dp[0][col] = matrix[0][col];
    }

    for (int row = 1; row < rows; row++) {
        for (int col = 0; col < cols; col++) {
            int best = dp[row - 1][col];

            if (col > 0) {
                best = Math.min(best, dp[row - 1][col - 1]);
            }

            if (col + 1 < cols) {
                best = Math.min(best, dp[row - 1][col + 1]);
            }

            dp[row][col] = matrix[row][col] + best;
        }
    }

    int answer = Integer.MAX_VALUE;

    for (int col = 0; col < cols; col++) {
        answer = Math.min(answer, dp[rows - 1][col]);
    }

    return answer;
}

```

The answer is the minimum value in the final row because the path may finish in any column.

Practice:

- LC 931 — Minimum Falling Path Sum
- LC 1289 — Minimum Falling Path Sum II
- LC 1301 — Number of Paths With Max Score

---

### Common Form 5: Triangle DP

Each position can move to one of two positions in the following row.

#### How it works

Starting from the bottom, each cell chooses the better of its two children. This gradually compresses the triangle into one answer.

#### State

```plain text
dp[col]
= minimum path sum from the current row's position
  to the bottom

```

#### Code

```java
public int minimumTotal(List<List<Integer>> triangle) {
    int rows = triangle.size();
    int[] dp = new int[rows];

    for (int col = 0; col < rows; col++) {
        dp[col] = triangle.get(rows - 1).get(col);
    }

    for (int row = rows - 2; row >= 0; row--) {
        for (int col = 0; col <= row; col++) {
            dp[col] =
                triangle.get(row).get(col)
                + Math.min(dp[col], dp[col + 1]);
        }
    }

    return dp[0];
}

```

Practice:

- LC 120 — Triangle

---

### Common Form 6: Grid With Limited Moves

The answer depends on the current cell and how many moves remain.

#### How it works

The same cell can produce a different answer depending on the remaining move count. Therefore, remaining moves must be included in the state.

#### State

```plain text
dp[row][col][moves]
= number of ways to leave the grid
  starting from (row, col)
  with moves remaining

```

#### Recurrence

```plain text
solve(row, col, moves)
=
sum of solve(nextRow, nextCol, moves - 1)
for all four directions

```

#### Code structure

```java
private int solve(
    int row,
    int col,
    int moves,
    int rows,
    int cols,
    Integer[][][] memo
) {
    if (row < 0 || col < 0 || row >= rows || col >= cols) {
        return 1;
    }

    if (moves == 0) {
        return 0;
    }

    if (memo[row][col][moves] != null) {
        return memo[row][col][moves];
    }

    long ways = 0;

    ways += solve(row + 1, col, moves - 1, rows, cols, memo);
    ways += solve(row - 1, col, moves - 1, rows, cols, memo);
    ways += solve(row, col + 1, moves - 1, rows, cols, memo);
    ways += solve(row, col - 1, moves - 1, rows, cols, memo);

    return memo[row][col][moves] = (int) ways;
}

```

Practice:

- LC 576 — Out of Boundary Paths
- LC 688 — Knight Probability in Chessboard

---

### Common Form 7: Two-Agent Grid DP

Two people or robots move through the grid simultaneously.

#### How it works

At a given row, the future answer depends on both agents’ columns. Their row is usually identical, so the state needs one row and two columns.

#### State

```plain text
solve(row, col1, col2)
= maximum value collectable from this row onward
  when robot 1 is at col1 and robot 2 is at col2

```

Each robot may move to:

```plain text
column - 1
column
column + 1

```

This produces:

```plain text
3 × 3 = 9 transitions

```

#### Recurrence structure

```java
int answer = Integer.MIN_VALUE;

for (int move1 = -1; move1 <= 1; move1++) {
    for (int move2 = -1; move2 <= 1; move2++) {
        answer = Math.max(
            answer,
            currentReward
                + solve(
                    row + 1,
                    col1 + move1,
                    col2 + move2
                )
        );
    }
}

```

If both robots occupy the same cell, count its value once:

```java
int currentReward;

if (col1 == col2) {
    currentReward = grid[row][col1];
} else {
    currentReward = grid[row][col1] + grid[row][col2];
}

```

Practice:

- LC 1463 — Cherry Pickup II
- LC 741 — Cherry Pickup

---

### Common Form 8: Shape-Based Grid DP

The goal is to find the largest square or another structure inside a binary matrix.

#### How it works

A cell can extend a square only when its top, left, and top-left neighbors can also support that square. The weakest neighbor limits its size.

#### State

```plain text
dp[row][col]
= side length of the largest square
  whose bottom-right corner is (row, col)

```

#### Transition

If the current cell is `1`:

```plain text
dp[row][col]
=
1 + min(
    top,
    left,
    top-left
)

```

#### Code

```java
public int maximalSquare(char[][] matrix) {
    int rows = matrix.length;
    int cols = matrix[0].length;

    int[][] dp = new int[rows + 1][cols + 1];
    int largestSide = 0;

    for (int row = 1; row <= rows; row++) {
        for (int col = 1; col <= cols; col++) {
            if (matrix[row - 1][col - 1] == '1') {
                dp[row][col] =
                    1 + Math.min(
                        dp[row - 1][col - 1],
                        Math.min(
                            dp[row - 1][col],
                            dp[row][col - 1]
                        )
                    );

                largestSide = Math.max(
                    largestSide,
                    dp[row][col]
                );
            }
        }
    }

    return largestSide * largestSide;
}

```

Practice:

- LC 221 — Maximal Square
- LC 1277 — Count Square Submatrices With All Ones

---

### Common Form 9: Reverse Grid DP

Sometimes the future determines how much resource is required at the current cell.

#### How it works

Instead of calculating what has been accumulated so far, work backward and calculate the minimum resource needed to safely enter every cell.

#### State

```plain text
dp[row][col]
= minimum health required before entering (row, col)

```

#### Transition

```plain text
requiredAfterCurrent
= min(right, down)

dp[row][col]
= max(1, requiredAfterCurrent - dungeon[row][col])

```

We use `max(1, ...)` because health must never drop below `1`.

#### Code

```java
public int calculateMinimumHP(int[][] dungeon) {
    int rows = dungeon.length;
    int cols = dungeon[0].length;

    int[][] dp = new int[rows][cols];

    dp[rows - 1][cols - 1] =
        Math.max(1, 1 - dungeon[rows - 1][cols - 1]);

    for (int col = cols - 2; col >= 0; col--) {
        dp[rows - 1][col] =
            Math.max(
                1,
                dp[rows - 1][col + 1] - dungeon[rows - 1][col]
            );
    }

    for (int row = rows - 2; row >= 0; row--) {
        dp[row][cols - 1] =
            Math.max(
                1,
                dp[row + 1][cols - 1] - dungeon[row][cols - 1]
            );
    }

    for (int row = rows - 2; row >= 0; row--) {
        for (int col = cols - 2; col >= 0; col--) {
            int requiredNext =
                Math.min(
                    dp[row + 1][col],
                    dp[row][col + 1]
                );

            dp[row][col] =
                Math.max(
                    1,
                    requiredNext - dungeon[row][col]
                );
        }
    }

    return dp[0][0];
}

```

Practice:

- LC 174 — Dungeon Game

---

### Common Form 10: Grid DP With Previous-Choice Restrictions

The choice in the current row depends on which column was selected previously.

#### How it works

For every cell, check valid selections from the previous row. If some columns are forbidden, exclude them from the transition.

#### State

```plain text
dp[row][col]
= best value after selecting column col in row

```

#### Basic transition

```plain text
dp[row][col]
=
grid[row][col]
+ best valid value from the previous row

```

#### Code structure

```java
for (int row = 1; row < rows; row++) {
    for (int col = 0; col < cols; col++) {
        int bestPrevious = Integer.MAX_VALUE;

        for (int previousCol = 0;
             previousCol < cols;
             previousCol++) {

            if (previousCol != col) {
                bestPrevious = Math.min(
                    bestPrevious,
                    dp[row - 1][previousCol]
                );
            }
        }

        dp[row][col] =
            grid[row][col] + bestPrevious;
    }
}

```

Practice:

- LC 1289 — Minimum Falling Path Sum II
- LC 1937 — Maximum Number of Points With Cost

---

## 12. Answer Reconstruction

If the problem asks for the actual path, the optimal value alone is insufficient.
Store the predecessor of every state.

```java
int[][] parentRow = new int[rows][cols];
int[][] parentCol = new int[rows][cols];

```

When selecting the best transition:

```java
if (fromTop <= fromLeft) {
    dp[row][col] =
        grid[row][col] + fromTop;

    parentRow[row][col] = row - 1;
    parentCol[row][col] = col;
} else {
    dp[row][col] =
        grid[row][col] + fromLeft;

    parentRow[row][col] = row;
    parentCol[row][col] = col - 1;
}

```

Then backtrack from the destination:

```java
List<int[]> path = new ArrayList<>();

int row = rows - 1;
int col = cols - 1;

while (row != -1 && col != -1) {
    path.add(new int[]{row, col});

    int previousRow = parentRow[row][col];
    int previousCol = parentCol[row][col];

    row = previousRow;
    col = previousCol;
}

Collections.reverse(path);

```

#### Alternative reconstruction

If the full DP table is available, compare neighboring values and determine which transition produced the current answer.

#### Important consequence

Space optimization may prevent reconstruction because previous rows have been discarded.

---

## 13. Quick Interview Checklist

Before coding, ask:

1. What does `dp[row][col]` mean?
2. Am I starting from this cell or ending at this cell?
3. Which neighboring cells can transition into the current cell?
4. What are the valid movement directions?
5. Does movement create a dependency order?
6. What should an out-of-bounds state return?
7. What should a blocked cell return?
8. Am I counting, minimizing, maximizing, or checking feasibility?
9. Does the current cell’s value need to be included?
10. Can the path start or finish in multiple cells?
11. Is the answer one specific cell or the best value in an entire row?
12. Does the same cell need extra state such as remaining moves?
13. What iteration order guarantees that dependencies are ready?
14. Can I reduce the table to one or two rows?
15. Do I need to reconstruct the path?
16. Is this actually DP, or would BFS/Dijkstra be more appropriate?

---

## 14. Common Mistakes

- Writing recursion without a precise state definition.
- Using zero for an invalid minimum-cost path.
- Adding a value to `Integer.MAX_VALUE`, causing overflow.
- Forgetting to check grid boundaries.
- Initializing the first row or first column incorrectly.
- Treating blocked cells as ordinary cells.
- Counting an obstacle as reachable.
- Using an iteration order that evaluates dependencies too late.
- Returning `dp[rows - 1][cols - 1]` when the path may finish in any column.
- Forgetting to include the current cell’s value.
- Including the current value twice.
- Using BFS for a path-counting problem without recognizing repeated states.
- Using ordinary Grid DP when four-direction movement creates cycles.
- Forgetting an extra state such as remaining moves or the second robot’s column.
- Counting the same cell twice when two agents occupy it.
- Space-optimizing before understanding the full table.
- Destroying information required for path reconstruction.
- Using `-1` as an uncomputed marker when `-1` is a valid answer.
- Forgetting modulo operations in large counting problems.
- Confusing number of cells with number of moves.

---

## 15. Complexity Analysis

Let:

```plain text
R = number of rows
C = number of columns

```

### Brute-force recursion

For two choices at each step:

```plain text
Time:  exponential
Space: O(R + C) recursion depth

```

### Memoization

Each cell is solved once:

```plain text
Time:  O(R × C)
Space: O(R × C)

```

Plus recursion stack.

### Tabulation

```plain text
Time:  O(R × C)
Space: O(R × C)

```

### Space-optimized tabulation

```plain text
Time:  O(R × C)
Space: O(C)

```

If columns are much larger than rows, sometimes the smaller dimension can be used:

```plain text
Space: O(min(R, C))

```

### Grid DP with an extra dimension

If the state is:

```plain text
(row, col, moves)

```

then:

```plain text
Time:  O(R × C × moves × transitions)
Space: O(R × C × moves)

```

### Two-agent Grid DP

State:

```plain text
(row, col1, col2)

```

With nine transitions:

```plain text
Time:  O(R × C² × 9)
      = O(R × C²)

Space: O(R × C²)

```

---

## 16. Practice Progression

### Foundation

1. LC 62 — Unique Paths
2. LC 64 — Minimum Path Sum
3. LC 63 — Unique Paths II

### Falling-path transitions

1. LC 120 — Triangle
2. LC 931 — Minimum Falling Path Sum
3. LC 1289 — Minimum Falling Path Sum II

### Shape-based Grid DP

1. LC 221 — Maximal Square
2. LC 1277 — Count Square Submatrices With All Ones

### Extra-state problems

1. LC 576 — Out of Boundary Paths
2. LC 688 — Knight Probability in Chessboard
3. LC 1937 — Maximum Number of Points With Cost

### Advanced

1. LC 174 — Dungeon Game
2. LC 1463 — Cherry Pickup II
3. LC 741 — Cherry Pickup
4. LC 2328 — Number of Increasing Paths in a Grid
5. LC 1301 — Number of Paths With Max Score

---

## 17. Final Reusable Mental Model

```plain text
1. Define what one cell represents.
2. Identify which neighboring states can produce that cell.
3. Decide whether to sum, minimize, maximize, or OR those states.
4. Choose invalid-state values that cannot be selected accidentally.
5. Determine the iteration direction from the dependencies.
6. Add extra state only when the same cell can have different futures.
7. Optimize space only after the full recurrence is correct.

```

The shortest memory rule is:

> Current cell = current contribution + combined answers from valid dependency cells.

