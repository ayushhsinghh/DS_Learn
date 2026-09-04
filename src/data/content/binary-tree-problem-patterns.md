After learning traversals, the next step is recognizing:
> What information must move between the parent and its children?

Most binary-tree questions are variations of:
```plain text
Information moves downward → carry state through parameters
Information moves upward   → return information from subtrees
Need nodes level by level   → BFS
Need movement to parent     → convert tree into an undirected graph
```
---
## Core Mental Model
For every tree problem, define the recursive contract:
> `solve(node)` returns  for the subtree rooted at `node`.

Then decide whether the answer is:
1. Returned from the current subtree
2. Stored in a global variable
3. Carried downward through parameters
4. Collected level by level using BFS
---
## How to Identify the Pattern
Ask these questions:
```plain text
Does the parent need information from its children?
→ Postorder recursion

Do children need information from the parent?
→ Preorder recursion with parameters

Does the question mention root-to-leaf paths?
→ Path-state recursion or backtracking

Can the required path pass through a node and use both children?
→ Return one branch and update a global answer

Does the question ask for levels, views, or horizontal ordering?
→ BFS or DFS with level/position information

Do I need to move upward from a node?
→ Parent map + graph traversal

Am I changing links or constructing a new tree?
→ Tree modification or construction
```
---
## Common Forms
## Common Form 1: Height-Based Problems
These problems require information from both child subtrees before the current node can calculate its answer.

Examples include:
- Maximum depth
- Balanced tree
- Diameter
- Minimum depth
- Subtree height
### How it works
1. Recursively calculate information for the left subtree.
2. Recursively calculate information for the right subtree.
3. Use both answers to calculate the current node’s result.
4. Return the information required by the parent.

**Memory flow:** `Ask children → Combine answers → Return upward`
### Basic height template
```java
int height(TreeNode node) {
    if (node == null) {
        return 0;
    }

    int leftHeight = height(node.left);
    int rightHeight = height(node.right);

    return 1 + Math.max(leftHeight, rightHeight);
}
```
### Balanced-tree template
Instead of separately calculating height at every node, return a special value when a subtree is unbalanced:
```java
int checkHeight(TreeNode node) {
    if (node == null) {
        return 0;
    }

    int leftHeight = checkHeight(node.left);
    if (leftHeight == -1) {
        return -1;
    }

    int rightHeight = checkHeight(node.right);
    if (rightHeight == -1) {
        return -1;
    }

    if (Math.abs(leftHeight - rightHeight) > 1) {
        return -1;
    }

    return 1 + Math.max(leftHeight, rightHeight);
}
```
Here:
```plain text
0 or greater → valid subtree height
-1           → subtree is unbalanced
```
Practice:
- LC 104 — Maximum Depth of Binary Tree
- LC 111 — Minimum Depth of Binary Tree
- LC 110 — Balanced Binary Tree
- LC 543 — Diameter of Binary Tree
- LC 687 — Longest Univalue Path
---
## Common Form 2: Root-to-Leaf Path Problems
These problems follow one path from the root toward a leaf.
The current path’s state is passed downward.

Examples:
- Does a path have a given sum?
- Return every root-to-leaf path
- Form a number using path digits
- Find the smallest root-to-leaf string
### How it works
1. Update the path state using the current node.
2. Check whether the current node is a leaf.
3. At a leaf, evaluate or save the completed path.
4. Otherwise, pass the updated state to both children.

**Memory flow:** `Update path state → Move downward → Evaluate at leaf`
### Path-sum template
```java
boolean hasPathSum(
        TreeNode node,
        int remaining
) {
    if (node == null) {
        return false;
    }

    remaining -= node.val;

    if (node.left == null && node.right == null) {
        return remaining == 0;
    }

    return hasPathSum(node.left, remaining)
        || hasPathSum(node.right, remaining);
}
```
### Important distinction
A valid root-to-leaf path must end at a leaf:
```java
node.left == null && node.right == null
```
Reaching a `null` child does not itself mean that a valid path was completed.

Practice:
- LC 112 — Path Sum
- LC 113 — Path Sum II
- LC 257 — Binary Tree Paths
- LC 129 — Sum Root to Leaf Numbers
- LC 988 — Smallest String Starting From Leaf
---
## Common Form 3: Path Construction with Backtracking
Use backtracking when the complete sequence of nodes in the current path must be stored.

Examples:
- Return all paths having a target sum
- Return all root-to-leaf paths
- Examine or compare complete paths
### How it works
1. Add the current node to the path.
2. Check or save the path when the required endpoint is reached.
3. Recursively explore the children.
4. Remove the current node before returning to the parent.

**Memory flow:** `Choose node → Explore children → Undo node`
```java
void collectPaths(
        TreeNode node,
        List<Integer> path,
        List<List<Integer>> answer
) {
    if (node == null) {
        return;
    }

    path.add(node.val);

    if (node.left == null && node.right == null) {
        answer.add(new ArrayList<>(path));
    } else {
        collectPaths(node.left, path, answer);
        collectPaths(node.right, path, answer);
    }

    path.remove(path.size() - 1);
}
```
### Why must we copy the path?
```java
answer.add(new ArrayList<>(path));
```
The original `path` list continues changing during backtracking. Saving the same reference would corrupt previously stored answers.

Practice:
- LC 113 — Path Sum II
- LC 257 — Binary Tree Paths
- LC 437 — Path Sum III
- LC 988 — Smallest String Starting From Leaf
---
## Common Form 4: Any-to-Any Path Problems
These paths do not necessarily start at the root or end at a leaf.

A valid path may:
```plain text
start inside the left subtree
pass through the current node
end inside the right subtree
```
This is the central pattern behind diameter and maximum path sum.
### How it works
At each node, calculate two different answers:
1. **Return value:** the best single branch that can be extended by the parent.
2. **Global candidate:** the complete path passing through the current node, possibly using both children.

**Memory flow:** `Children return one branch → Current node joins two branches → Return one branch`
### Generic template
```java
int answer;

int solve(TreeNode node) {
    if (node == null) {
        return 0;
    }

    int left = solve(node.left);
    int right = solve(node.right);

    int pathThroughNode =
        left + node.val + right;

    answer = Math.max(
        answer,
        pathThroughNode
    );

    return node.val + Math.max(left, right);
}
```
### Why can’t we return both branches?
The parent-to-child path cannot split:
```plain text
   parent
      |
   current
   /     \
left    right
```
If the current node returned both branches to its parent, the result would no longer be a single path.

Therefore:
```plain text
Use both branches for the final/global candidate
Return only one branch to the parent
```
For maximum path sum, negative child contributions are ignored:
```java
int left = Math.max(0, solve(node.left));
int right = Math.max(0, solve(node.right));
```
Practice:
- LC 543 — Diameter of Binary Tree
- LC 124 — Binary Tree Maximum Path Sum
- LC 687 — Longest Univalue Path
- LC 1372 — Longest ZigZag Path in a Binary Tree
---
## Common Form 5: Lowest Common Ancestor
The Lowest Common Ancestor is the deepest node whose subtree contains both target nodes.

The current node can receive three kinds of information from each subtree:
```plain text
null → neither target was found
p    → p was found
q    → q was found
```
### How it works
1. Return `null` when the subtree is empty.
2. Return the current node when it equals either target.
3. Search both subtrees.
4. If both sides return non-null, the current node is the LCA.
5. If only one side returns non-null, pass that result upward.

**Memory flow:** `Search both sides → Detect split → Propagate found node`
```java
TreeNode lowestCommonAncestor(
        TreeNode node,
        TreeNode p,
        TreeNode q
) {
    if (node == null || node == p || node == q) {
        return node;
    }

    TreeNode left =
        lowestCommonAncestor(node.left, p, q);

    TreeNode right =
        lowestCommonAncestor(node.right, p, q);

    if (left != null && right != null) {
        return node;
    }

    return left != null ? left : right;
}
```
### LCA mental model
Imagine both target nodes sending signals upward:
```plain text
No signal                  → return null
One signal                 → pass it upward
Signals from both children → current node is LCA
```
### Important assumption
This template assumes both nodes exist in the tree. If existence is not guaranteed, additional tracking is required.

Practice:
- LC 236 — Lowest Common Ancestor of a Binary Tree
- LC 235 — Lowest Common Ancestor of a BST
- LC 1644 — LCA of a Binary Tree II
- LC 1650 — LCA of a Binary Tree III
- LC 1123 — LCA of Deepest Leaves
---
## Common Form 6: Tree Views and Level Problems
Tree-view problems ask which nodes are visible when looking from a particular direction.

Examples:
```plain text
Right-side view
Left-side view
Top view
Bottom view
Vertical traversal
Zigzag traversal
```
The traversal must track structural position such as:
- Level
- Horizontal column
- Order within a level
### How it works for side views
1. Traverse the tree level by level using BFS.
2. Process all nodes belonging to one level.
3. Save either the first or last node from that level.
4. Add children for the next level.

**Memory flow:** `Process one level → Select visible node → Move to next level`
### Right-side view template
```java
List<Integer> rightSideView(TreeNode root) {
    List<Integer> answer = new ArrayList<>();

    if (root == null) {
        return answer;
    }

    Deque<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        int size = queue.size();

        for (int i = 0; i < size; i++) {
            TreeNode current = queue.poll();

            if (i == size - 1) {
                answer.add(current.val);
            }

            if (current.left != null) {
                queue.offer(current.left);
            }

            if (current.right != null) {
                queue.offer(current.right);
            }
        }
    }

    return answer;
}
```
### Horizontal-position problems
Assign a column to every node:
```plain text
root        → column 0
left child  → column - 1
right child → column + 1
```
Then group nodes by their columns.

These problems often require:
```plain text
BFS/DFS + column number + Hashmap<column, Nodes>
```
Practice:
- LC 102 — Binary Tree Level Order Traversal
- LC 103 — Binary Tree Zigzag Level Order Traversal
- LC 199 — Binary Tree Right Side View
- LC 515 — Find Largest Value in Each Tree Row
- LC 987 — Vertical Order Traversal of a Binary Tree
- LC 314 — Binary Tree Vertical Order Traversal
---
## Common Form 7: Tree Modification
These problems change the tree’s links or values.

Examples:
- Invert a tree
- Flatten a tree
- Delete nodes
- Prune subtrees
- Add a row
- Transform a tree

The traversal order depends on whether modification must happen before or after processing the children.
### How it works
1. Determine whether children must be processed before changing the current node.
2. Save references that may be lost during modification.
3. Recursively modify the required subtrees.
4. Reconnect the returned subtree roots.
5. Return the new root of the current subtree.

**Memory flow:** `Save links → Modify subtrees → Reconnect → Return root`
### Generic modification template
```java
TreeNode modify(TreeNode node) {
    if (node == null) {
        return null;
    }

    TreeNode newLeft = modify(node.left);
    TreeNode newRight = modify(node.right);

    node.left = newLeft;
    node.right = newRight;

    return node;
}
```
### Invert-tree example
```java
TreeNode invertTree(TreeNode node) {
    if (node == null) {
        return null;
    }

    TreeNode left = invertTree(node.left);
    TreeNode right = invertTree(node.right);

    node.left = right;
    node.right = left;

    return node;
}
```
### Critical question
> After modifying the subtree, what should this function return to its parent?

Usually it returns the root of the modified subtree.

Practice:
- LC 226 — Invert Binary Tree
- LC 114 — Flatten Binary Tree to Linked List
- LC 814 — Binary Tree Pruning
- LC 1110 — Delete Nodes and Return Forest
- LC 623 — Add One Row to Tree
- LC 1325 — Delete Leaves With a Given Value
---
## Common Form 8: Convert Tree to Graph
A normal tree node lets us move:
```plain text
parent → child
```
But some problems require movement in every direction:
```plain text
child → parent
parent → child
```
Examples:
- Find nodes at distance `K` from a target
- Spread infection or fire through the tree
- Find time required to reach every node
### How it works
1. Traverse the tree and record each node’s parent.
2. Treat every node as connected to:
	- its left child
	- its right child
	- its parent
3. Start BFS from the target node.
4. Use a visited set because the converted structure is now an undirected graph.
5. Process one BFS level per unit of distance or time.

**Memory flow:** `Build parent links → Start from target → BFS in three directions`
### Parent-map template
```java
void buildParents(
        TreeNode node,
        TreeNode parent,
        Map<TreeNode, TreeNode> parents
) {
    if (node == null) {
        return;
    }

    if (parent != null) {
        parents.put(node, parent);
    }

    buildParents(node.left, node, parents);
    buildParents(node.right, node, parents);
}
```
### BFS neighbors
```java
TreeNode[] neighbors = {
    current.left,
    current.right,
    parents.get(current)
};

for (TreeNode next : neighbors) {
    if (next != null && visited.add(next)) {
        queue.offer(next);
    }
}
```
### Why is `visited` required?
After adding parent edges, movement can form cycles:
```plain text
parent → child → parent
```
Without `visited`, BFS would repeatedly revisit the same nodes.

Practice:
- LC 863 — All Nodes Distance K in Binary Tree
- LC 2385 — Amount of Time for Binary Tree to Be Infected
- Burning Tree
- Minimum Distance Between Two Tree Nodes
---
## Common Form 9: Tree Construction
These problems ask you to create a tree from traversal information or recursively divide an input range.

Examples:
- Build a tree from preorder and inorder
- Build a balanced BST from a sorted array
- Construct a maximum binary tree
### How it works
1. Identify the root for the current subtree.
2. Determine which elements belong to the left subtree.
3. Determine which elements belong to the right subtree.
4. Recursively construct both subtrees.
5. Attach them to the root and return it.

**Memory flow:** `Choose root → Divide input → Build children → Return root`
### Sorted-array-to-BST template
```java
TreeNode build(
        int[] nums,
        int left,
        int right
) {
    if (left > right) {
        return null;
    }

    int middle = left + (right - left) / 2;

    TreeNode root = new TreeNode(nums[middle]);

    root.left = build(nums, left, middle - 1);
    root.right = build(nums, middle + 1, right);

    return root;
}
```
### Important construction contract
> `build(left, right)` returns the root of the tree constructed from that range.

Practice:
- LC 105 — Construct Binary Tree from Preorder and Inorder
- LC 106 — Construct Binary Tree from Inorder and Postorder
- LC 108 — Convert Sorted Array to BST
- LC 654 — Maximum Binary Tree
- LC 889 — Construct Binary Tree from Preorder and Postorder
---
## Direction-of-Information Guide
```plain text
Parent information moves to children
→ Preorder with parameters

Children provide information to parent
→ Postorder with return values

Need the entire current path
→ Backtracking

Need a path using both subtrees
→ Return one branch, update global answer with two

Need nearest common meeting point
→ LCA recursion

Need level or visible-position information
→ BFS with level/column state

Need upward movement from a target
→ Parent map + BFS

Need to change links
→ Return the modified subtree root

Need to build a new tree
→ Choose root, recursively build children
```
---
## Choosing Between Return Value and Global Answer
Use a return value when:
> The parent needs this information to calculate its own result.

Examples:
```plain text
subtree height
best downward path
whether subtree is valid
modified subtree root
```
Use a global answer when:
> The candidate answer can be completed at any node and cannot be passed upward as-is.

Examples:
```plain text
diameter through a node
maximum path sum through a node
largest answer seen anywhere
```
Some problems require both:
```java
int solve(TreeNode node) {
    int left = solve(node.left);
    int right = solve(node.right);

    globalAnswer = combineBoth(left, right);

    return valueParentCanExtend(left, right);
}
```
---
## Quick Interview Checklist
1. What does `solve(node)` return?
2. What should `null` return?
3. Does information move upward or downward?
4. Does the parent need one child or both children?
5. Can a path split, or must it remain a single chain?
6. Is the answer root-to-leaf, downward-only, or any-to-any?
7. Must the endpoint be a leaf?
8. Do I need to store the current path?
9. If storing a path, did I undo the choice?
10. Is a global answer necessary?
11. Does the question require level-order processing?
12. Must I track levels or horizontal columns?
13. Do I need to move from a child to its parent?
14. Am I modifying existing links?
15. Could modification destroy a reference I still need?
16. Should the function return the modified subtree root?
17. Are target nodes guaranteed to exist?
18. Am I comparing node identity or only node values?
19. Could the tree be skewed?
20. What are the time and stack-space complexities?
---
## Common Mistakes
- Coding before defining the recursive return contract.
- Confusing height with depth.
- Recalculating subtree height repeatedly and producing `O(n²)` time.
- Treating a `null` child as a valid root-to-leaf endpoint.
- Returning both branches of a path to the parent.
- Forgetting to ignore negative branches in maximum path sum.
- Using a global variable when a return value is sufficient.
- Forgetting to reset global state between executions.
- Saving the same mutable path instead of copying it.
- Forgetting to backtrack after exploring a path.
- Assuming both LCA targets exist when the problem does not guarantee it.
- Using node values when node identity matters.
- Forgetting `visited` after converting a tree to an undirected graph.
- Marking graph nodes visited too late.
- Losing child references while modifying links.
- Forgetting to reconnect returned subtree roots.
- Using BFS without capturing the level size first.
- Assuming inorder traversal is sorted for every binary tree.
---
## Complexity Analysis
For most tree problems, every node is processed once:
```plain text
Time: O(n)
```
Recursive stack space depends on tree height `h`:
```plain text
Space: O(h)
```
Balanced tree:
```plain text
h = O(log n)
```
Skewed tree:
```plain text
h = O(n)
```
BFS can store an entire level:
```plain text
Space: O(width)
```
In the worst case:
```plain text
Space: O(n)
```
Parent-map problems require:
```plain text
Parent map: O(n)
Visited set: O(n)
Queue:       O(n)

Total space: O(n)
```
Path backtracking uses:
```plain text
Current path: O(h)
```
If every complete path is returned, output storage may itself be larger than `O(n)`.
---
## Final Reusable Model
```plain text
Height problems:
Children return measurements

Root-to-leaf paths:
Carry state downward

Path construction:
Choose → Explore → Undo

Any-to-any paths:
Return one branch, test two branches

LCA:
Targets send signals upward

Views:
Process levels or positions

Tree modification:
Modify children and return subtree root

Tree as graph:
Add parent links and perform BFS

Tree construction:
Choose root, divide input, build children
```
The single most important question remains:
> “What information should this node receive, and what information should it return?”
