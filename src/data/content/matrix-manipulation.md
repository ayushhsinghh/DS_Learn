A matrix is a two-dimensional grid where each element is identified by `matrix[row][column]`.
> **Core mental model:** First decide how cells are related, then define the order in which they should be visited or modified.
```plain text
Understand coordinates → Choose traversal order → Protect boundaries → Preserve required information
```
## How to Identify Matrix-Manipulation Problems
Look for these signals:
- The input is a two-dimensional array or grid.
- The problem mentions rows, columns, neighbors, diagonals, rotation, or reflection.
- A cell’s result depends on its position or nearby cells.
- The matrix must be traversed or modified in place.
> **Most important questions:** In what order should I visit the cells? If I modify a cell now, will I destroy information needed later?
## Coordinate Mental Model
For a matrix with `rows × columns`:
```plain text
valid row    = 0 to rows - 1
valid column = 0 to columns - 1
```
```java
boolean valid = row >= 0
    && row < matrix.length
    && column >= 0
    && column < matrix[0].length;
```
For `[[1,2,3],[4,5,6]]`, `matrix[0][2] = 3` and `matrix[1][1] = 5`.
## Common Form 1: Standard Row and Column Traversal
Use this when every cell must be processed independently.
**How it works:**
1. The outer loop chooses a row.
2. The inner loop visits every column in that row.
3. Process `matrix[row][column]`.
4. Continue until every cell has been visited.
**Memory flow:** `Choose row → Visit columns → Process cell`
```java
int rows = matrix.length;
int columns = matrix[0].length;

for (int row = 0; row < rows; row++) {
    for (int column = 0; column < columns; column++) {
        int value = matrix[row][column];
        // Process value.
    }
}
```
Column-first traversal:
```java
for (int column = 0; column < columns; column++) {
    for (int row = 0; row < rows; row++) {
        // Process matrix[row][column].
    }
}
```
Practice:
- LC 1572 — Matrix Diagonal Sum
- LC 1672 — Richest Customer Wealth
- LC 766 — Toeplitz Matrix
- LC 867 — Transpose Matrix
## Common Form 2: Direction-Array Traversal
Use this when a cell must inspect or interact with surrounding cells.
**How it works:**
1. Store every allowed movement in a direction array.
2. Add each direction to the current coordinates.
3. Check whether the new coordinates are inside the matrix.
4. Process only valid neighbors.
5. Include diagonal directions only when the problem permits them.
**Memory flow:** `Current cell → Apply direction → Validate → Process neighbor`
Four-directional movement:
```java
int[][] directions = {
    {1, 0},
    {-1, 0},
    {0, 1},
    {0, -1}
};

for (int[] direction : directions) {
    int nextRow = row + direction[0];
    int nextColumn = column + direction[1];

    if (nextRow >= 0
            && nextRow < matrix.length
            && nextColumn >= 0
            && nextColumn < matrix[0].length) {
        // Process the valid neighbor.
    }
}
```
For eight-directional movement, also include `{-1,-1}`, `{-1,1}`, `{1,-1}`, and `{1,1}`.
Practice:
- LC 733 — Flood Fill
- LC 200 — Number of Islands
- LC 994 — Rotting Oranges
- LC 1091 — Shortest Path in Binary Matrix
- LC 130 — Surrounded Regions
## Common Form 3: Rotate a Square Matrix
Use this when a square matrix must be rotated in place.
```plain text
Clockwise rotation        = transpose + reverse every row
Counterclockwise rotation = transpose + reverse every column
```
**How it works:**
1. Transpose the matrix by swapping `matrix[row][column]` with `matrix[column][row]`.
2. Process only cells above the diagonal so each pair is swapped once.
3. Reverse every row.
4. The combined transformation rotates the matrix 90 degrees clockwise.
**Memory flow:** `Transpose → Reverse rows → Rotate clockwise`
Small example:
```plain text
Original      Transpose     Reverse rows
1 2 3         1 4 7         7 4 1
4 5 6    →    2 5 8    →    8 5 2
7 8 9         3 6 9         9 6 3
```
```java
int n = matrix.length;

// Transpose.
for (int row = 0; row < n; row++) {
    for (int column = row + 1; column < n; column++) {
        int temporary = matrix[row][column];
        matrix[row][column] = matrix[column][row];
        matrix[column][row] = temporary;
    }
}

// Reverse every row.
for (int row = 0; row < n; row++) {
    int left = 0;
    int right = n - 1;

    while (left < right) {
        int temporary = matrix[row][left];
        matrix[row][left] = matrix[row][right];
        matrix[row][right] = temporary;
        left++;
        right--;
    }
}
```
Starting the transpose column at `row + 1` prevents swapping every pair twice.
Practice:
- LC 48 — Rotate Image
- LC 1886 — Determine Whether Matrix Can Be Obtained by Rotation
## Quick Interview Checklist
1. What do `row` and `column` represent?
2. Is the matrix rectangular or square?
3. In what order should cells be visited?
4. Does every cell need to be processed?
5. Which directions are allowed?
6. Are diagonal movements allowed?
7. Are the new coordinates inside the matrix?
8. Can I safely modify the matrix during traversal?
9. Do I need the original value later?
10. Can the operation be decomposed into transpose, reverse, or swap steps?
### Technique Decision Rule
```plain text
Process every cell       → nested row/column loops
Inspect nearby cells     → direction array + boundary check
Rotate clockwise        → transpose + reverse rows
Rotate counterclockwise → transpose + reverse columns
```
## Common Mistakes
- Confusing `matrix.length` (rows) with `matrix[0].length` (columns).
- Assuming every matrix is square.
- Using the row count for both dimensions.
- Accessing a neighbor before checking its boundaries.
- Mixing four-directional and eight-directional movement.
- Modifying a cell before preserving information needed later.
- Swapping every transpose pair twice.
- Beginning the transpose inner loop at `0` instead of `row + 1`.
- Applying in-place square rotation to a rectangular matrix.
- Reversing columns instead of rows for clockwise rotation.
## Complexity Analysis
For `m` rows and `n` columns:
- Standard full traversal: `O(m × n)` time and `O(1)` auxiliary space.
- Direction-array processing: normally `O(m × n)` because each cell checks a constant number of neighbors.
- Transposing a square matrix in place: `O(n²)` time and `O(1)` space.
- Rotating a square matrix in place: `O(n²)` time and `O(1)` space.
---
> **Final reusable model:** Define the coordinate meaning, choose the traversal order, validate every movement, and preserve information before modifying cells.
```plain text
Define coordinates → Choose traversal → Check boundaries → Modify safely
```
