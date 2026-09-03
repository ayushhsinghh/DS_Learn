A binary tree is a hierarchical structure where each node has at most two children:
```plain text
left child
right child
```
Unlike arrays and linked lists, a tree can branch into multiple paths.
```plain text
    1
   / \
  2   3
 / \
4   5
```
The tree rooted at node `2` is itself a complete smaller tree:
```plain text
  2
 / \
4   5
```
This self-similar structure is why recursion works naturally with trees.
---
## TreeNode Structure
In Java:
```java
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;

    TreeNode(int val) {
        this.val = val;
    }
}
```
Each node contains:
```plain text
value
reference to left child
reference to right child
```
A missing child is represented by:
```java
null
```
---
## Core Mental Model
> Every node is the root of its own smaller subtree.
When solving a tree problem, do not initially think about the entire tree.
Think:
```plain text
What should I do at the current node?
What should the left subtree do?
What should the right subtree do?
```
For recursive problems:
> Trust that the recursive call correctly solves the subtree given to it.
---
## Important Tree Terminology
Using:
```plain text
    1
   / \
  2   3
 / \
4   5
```
## Root
The topmost node:
```plain text
1
```
## Parent and child
```plain text
2 is a child of 1
1 is the parent of 2
```
## Leaf
A node with no children:
```plain text
3, 4, 5
```
A leaf satisfies:
```java
node.left == null && node.right == null
```
## Subtree
A node together with all its descendants.
## Depth
The distance from the root to a node.
```plain text
Depth of 1 = 0
Depth of 2 = 1
Depth of 4 = 2
```
## Height
The distance from a node down to its deepest leaf.
```plain text
Height of leaf 4 = 0
Height of node 2 = 1
Height of root 1 = 2
```
Some questions count height in nodes rather than edges. Always verify the definition.
## Ancestor
A node appearing above another node on the same path.
```plain text
1 and 2 are ancestors of 4
```
## Descendant
A node appearing below another node.
```plain text
4 and 5 are descendants of 2
```
---
## Common Binary Tree Types
## Full Binary Tree
Every node has either:
```plain text
0 children or 2 children
```
## Complete Binary Tree
Every level is completely filled except possibly the last, and the last level is filled from left to right.
## Perfect Binary Tree
Every internal node has two children and every leaf is at the same depth.
## Balanced Binary Tree
The left and right subtree heights do not differ excessively.
For an AVL-style balance condition:
```plain text
abs(leftHeight - rightHeight) <= 1
```
at every node.
## Skewed Binary Tree
Every node has only one child:
```plain text
1
 \
  2
   \
    3
     \
      4
```
A skewed tree behaves like a linked list and can produce recursion depth `O(n)`.
---
## What Is Tree Traversal?
Traversal means visiting every tree node in a defined order.
The three main DFS traversal orders are:
```plain text
Preorder  → Node, Left, Right
Inorder   → Left, Node, Right
Postorder → Left, Right, Node
```
The only difference is:
> When do we process the current node relative to its children?
---
## Small Traversal Example
For:
```plain text
    1
   / \
  2   3
 / \
4   5
```
## Preorder
```plain text
Node → Left → Right
```
Result:
```plain text
1, 2, 4, 5, 3
```
## Inorder
```plain text
Left → Node → Right
```
Result:
```plain text
4, 2, 5, 1, 3
```
## Postorder
```plain text
Left → Right → Node
```
Result:
```plain text
4, 5, 2, 3, 1
```
---
## The Three Processing Positions
Every recursive tree function has three possible locations for processing the current node:
```java
void dfs(TreeNode node) {
    if (node == null) {
        return;
    }

    // Position 1: Preorder

    dfs(node.left);

    // Position 2: Inorder

    dfs(node.right);

    // Position 3: Postorder
}
```
This is the most reusable traversal template.
```plain text
Before both children  → preorder
Between the children  → inorder
After both children   → postorder
```
---
## How to Choose a Traversal
## Choose Preorder When
You need to process the parent before its children.
Common uses:
- Copy or serialize a tree
- Pass information from parent to child
- Build paths from the root
- Create a tree from preorder information
- Produce prefix expressions
Mental model:
```plain text
Parent decides first
→ Children receive its state
```
## Choose Inorder When
The relative order between left subtree, node, and right subtree matters.
Common uses:
- Retrieve BST values in sorted order
- Find BST predecessor or successor
- Find kth smallest value in a BST
- Validate BST ordering
Mental model:
```plain text
Process values from left to right
```
## Choose Postorder When
A parent needs information from its children before it can calculate its own answer.
Common uses:
- Calculate height
- Determine balance
- Calculate diameter
- Delete a tree
- Calculate subtree sums
- Find maximum path values
Mental model:
```plain text
Children answer first
→ Parent combines their answers
```
---
## How to Identify Tree-Traversal Problems
Look for these signals:
- The input is a `TreeNode`.
- Every node or subtree must be examined.
- The question asks about:
	- depth
	- height
	- paths
	- subtree information
	- BST ordering
	- copying or serialization
- The same operation applies independently to left and right subtrees.
- Recursive calls naturally use:
	- `node.left`
	- `node.right`
### Most important recognition question
> Should the current node be processed before, between, or after its children?
That decision identifies preorder, inorder, or postorder.
---
## Common Forms
## Common Form 1: Recursive Preorder Traversal
Preorder processes the current node before visiting its children.
```plain text
Node → Left → Right
```
### How it works
1. Return when the current node is `null`.
2. Process the current node.
3. Recursively traverse the left subtree.
4. Recursively traverse the right subtree.
**Memory flow:** `Process node → Explore left → Explore right`
```java
void preorder(
        TreeNode node,
        List<Integer> answer
) {
    if (node == null) {
        return;
    }

    answer.add(node.val);

    preorder(node.left, answer);
    preorder(node.right, answer);
}
```
### Recursive contract
> `preorder(node)` processes every node in the subtree rooted at `node` in Node–Left–Right order.
Practice:
- LC 144 — Binary Tree Preorder Traversal
- LC 257 — Binary Tree Paths
- LC 100 — Same Tree
- LC 226 — Invert Binary Tree
- LC 297 — Serialize and Deserialize Binary Tree
---
## Common Form 2: Recursive Inorder Traversal
Inorder processes the node between its two subtrees.
```plain text
Left → Node → Right
```
### How it works
1. Return when the node is `null`.
2. Recursively traverse the left subtree.
3. Process the current node.
4. Recursively traverse the right subtree.
**Memory flow:** `Explore left → Process node → Explore right`
```java
void inorder(
        TreeNode node,
        List<Integer> answer
) {
    if (node == null) {
        return;
    }

    inorder(node.left, answer);

    answer.add(node.val);

    inorder(node.right, answer);
}
```
### Critical BST property
For a valid Binary Search Tree, inorder traversal produces values in increasing order:
```plain text
Left values < Node value < Right values
```
Practice:
- LC 94 — Binary Tree Inorder Traversal
- LC 98 — Validate Binary Search Tree
- LC 230 — Kth Smallest Element in a BST
- LC 530 — Minimum Absolute Difference in BST
- LC 501 — Find Mode in Binary Search Tree
---
## Common Form 3: Recursive Postorder Traversal
Postorder processes the current node after both children.
```plain text
Left → Right → Node
```
### How it works
1. Return when the node is `null`.
2. Recursively solve the left subtree.
3. Recursively solve the right subtree.
4. Process or calculate the current node’s result.
5. Return information to the parent when required.
**Memory flow:** `Ask left → Ask right → Process current`
```java
void postorder(
        TreeNode node,
        List<Integer> answer
) {
    if (node == null) {
        return;
    }

    postorder(node.left, answer);
    postorder(node.right, answer);

    answer.add(node.val);
}
```
### Return-value postorder
```java
int height(TreeNode node) {
    if (node == null) {
        return 0;
    }

    int leftHeight = height(node.left);
    int rightHeight = height(node.right);

    return 1 + Math.max(
        leftHeight,
        rightHeight
    );
}
```
The parent cannot calculate its height until both children provide theirs.
Practice:
- LC 145 — Binary Tree Postorder Traversal
- LC 104 — Maximum Depth of Binary Tree
- LC 110 — Balanced Binary Tree
- LC 543 — Diameter of Binary Tree
- LC 124 — Binary Tree Maximum Path Sum
---
## Common Form 4: Iterative Preorder Traversal
Recursion uses an internal call stack. Iterative traversal uses an explicit stack.
Preorder is the easiest iterative DFS traversal.
### How it works
1. Push the root.
2. Pop and process the current node.
3. Push its right child.
4. Push its left child.
5. Because the stack is LIFO, the left child is processed first.
**Memory flow:** `Pop node → Process → Push right → Push left`
```java
List<Integer> answer = new ArrayList<>();

if (root == null) {
    return answer;
}

Deque<TreeNode> stack = new ArrayDeque<>();
stack.push(root);

while (!stack.isEmpty()) {
    TreeNode current = stack.pop();

    answer.add(current.val);

    if (current.right != null) {
        stack.push(current.right);
    }

    if (current.left != null) {
        stack.push(current.left);
    }
}

return answer;
```
### Why push right first?
Desired processing order:
```plain text
Node → Left → Right
```
Since the stack removes the newest item first:
```plain text
Push right
Push left

Left is popped first
```
Practice:
- LC 144 — Binary Tree Preorder Traversal
- LC 589 — N-ary Tree Preorder Traversal
- LC 100 — Same Tree
---
## Common Form 5: Iterative Inorder Traversal
Iterative inorder must first travel as far left as possible.
### How it works
1. Push the current node and move left.
2. Repeat until the current node becomes `null`.
3. Pop the most recent node.
4. Process it.
5. Move to its right subtree.
6. Repeat the same leftward process.
**Memory flow:** `Push left chain → Pop and process → Move right`
```java
List<Integer> answer = new ArrayList<>();
Deque<TreeNode> stack = new ArrayDeque<>();

TreeNode current = root;

while (current != null || !stack.isEmpty()) {
    while (current != null) {
        stack.push(current);
        current = current.left;
    }

    current = stack.pop();
    answer.add(current.val);

    current = current.right;
}

return answer;
```
### Stack meaning
The stack contains ancestors whose left subtree is being processed or has just finished, but whose own value has not yet been processed.
Practice:
- LC 94 — Binary Tree Inorder Traversal
- LC 230 — Kth Smallest Element in a BST
- LC 173 — Binary Search Tree Iterator
- LC 530 — Minimum Absolute Difference in BST
---
## Common Form 6: Iterative Postorder with Two Stacks
Postorder is harder iteratively because a node must wait until both children have been processed.
A simple approach uses two stacks.
### How it works
1. Push the root into the first stack.
2. Pop a node from the first stack and push it into the second.
3. Push its left and right children into the first stack.
4. Continue until the first stack is empty.
5. Pop the second stack to obtain Left–Right–Node order.
**Memory flow:** `Build reverse order → Reverse it again → Get postorder`
```java
List<Integer> answer = new ArrayList<>();

if (root == null) {
    return answer;
}

Deque<TreeNode> first = new ArrayDeque<>();
Deque<TreeNode> second = new ArrayDeque<>();

first.push(root);

while (!first.isEmpty()) {
    TreeNode current = first.pop();
    second.push(current);

    if (current.left != null) {
        first.push(current.left);
    }

    if (current.right != null) {
        first.push(current.right);
    }
}

while (!second.isEmpty()) {
    answer.add(second.pop().val);
}

return answer;
```
The first phase creates:
```plain text
Node → Right → Left
```
Reversing that order produces:
```plain text
Left → Right → Node
```
Practice:
- LC 145 — Binary Tree Postorder Traversal
- LC 590 — N-ary Tree Postorder Traversal
---
## Common Form 7: One Stack with Processing State
A single stack can perform any traversal if each entry remembers whether the node is being entered or processed.
This explicitly simulates recursive call frames.
### How it works
1. Push the root as unprocessed.
2. Pop one entry.
3. If it is marked for processing, add its value.
4. Otherwise, push the node and its children in reverse desired order.
5. The stack recreates the required traversal sequence.
**Memory flow:** `Push future actions in reverse execution order`
### Preorder example
```java
class State {
    TreeNode node;
    boolean process;

    State(TreeNode node, boolean process) {
        this.node = node;
        this.process = process;
    }
}
```
```java
Deque<State> stack = new ArrayDeque<>();
stack.push(new State(root, false));

while (!stack.isEmpty()) {
    State state = stack.pop();

    if (state.node == null) {
        continue;
    }

    if (state.process) {
        answer.add(state.node.val);
        continue;
    }

    // Desired order: Node, Left, Right.
    // Push in reverse order.
    stack.push(new State(state.node.right, false));
    stack.push(new State(state.node.left, false));
    stack.push(new State(state.node, true));
}
```
To create inorder:
```plain text
Desired: Left, Node, Right
Push:    Right, Node, Left
```
To create postorder:
```plain text
Desired: Left, Right, Node
Push:    Node, Right, Left
```
Practice:
- LC 94 — Binary Tree Inorder Traversal
- LC 144 — Binary Tree Preorder Traversal
- LC 145 — Binary Tree Postorder Traversal
---
## Common Form 8: Morris Traversal
Morris traversal performs inorder or preorder traversal without recursion or an explicit stack.
It temporarily creates links from a node’s inorder predecessor back to the current node.
This is an advanced technique and should be learned after recursive and stack-based traversal.
### How it works
1. If the current node has no left child, process it and move right.
2. Otherwise, find the rightmost node in its left subtree.
3. Temporarily connect that predecessor back to the current node.
4. Traverse the left subtree.
5. When the temporary connection is encountered again, remove it.
6. Process the current node and move right.
**Memory flow:** `Create temporary return path → Traverse left → Remove path`
```java
TreeNode current = root;

while (current != null) {
    if (current.left == null) {
        answer.add(current.val);
        current = current.right;
    } else {
        TreeNode predecessor = current.left;

        while (predecessor.right != null
                && predecessor.right != current) {
            predecessor = predecessor.right;
        }

        if (predecessor.right == null) {
            predecessor.right = current;
            current = current.left;
        } else {
            predecessor.right = null;
            answer.add(current.val);
            current = current.right;
        }
    }
}
```
### Critical rule
Always remove the temporary connection:
```java
predecessor.right = null;
```
Otherwise, the original tree remains modified and contains a cycle.
Practice:
- LC 94 — Binary Tree Inorder Traversal
- LC 144 — Binary Tree Preorder Traversal
- LC 99 — Recover Binary Search Tree
---
## Traversal Decision Guide
```plain text
Process parent before children       → preorder
Pass parent information downward     → preorder
Process BST in sorted order          → inorder
Parent needs answers from children   → postorder
Calculate height, balance, diameter  → postorder
Avoid recursion                      → explicit stack
Need simplest iterative DFS          → iterative preorder
Need O(1) auxiliary traversal space  → Morris traversal
```
---
## Recursive Return Types
Tree functions generally fall into two categories.
## Traversal-only function
The function processes nodes but returns nothing:
```java
void dfs(TreeNode node)
```
Examples:
- Print values
- Add values to a list
- Update external state
## Information-returning function
The function returns information about its subtree:
```java
int height(TreeNode node)
boolean isValid(TreeNode node)
TreeNode find(TreeNode node)
```
Before coding, complete:
> `solve(node)` returns  for the subtree rooted at `node`.
This return contract is more important than choosing preorder or postorder by name.
---
## Null Base Cases and Neutral Values
The correct `null` return depends on what the parent does with the answer.
## Counting nodes
```java
if (node == null) {
    return 0;
}
```
## Calculating height in nodes
```java
if (node == null) {
    return 0;
}
```
## Checking a condition
```java
if (node == null) {
    return true;
}
```
## Searching for a node
```java
if (node == null) {
    return null;
}
```
The base value must behave correctly when combined by the parent.
---
## Quick Interview Checklist
1. What does `solve(node)` return?
2. What should happen when `node == null`?
3. Is the current node processed before, between, or after its children?
4. Does information travel downward or upward?
5. Does the parent need answers from both children?
6. Is external/global state required?
7. Can the answer be returned directly instead?
8. Should traversal stop early after finding something?
9. Do I need recursion or an explicit stack?
10. What does each stack entry represent?
11. In iterative traversal, why are children pushed in that order?
12. Could the tree be skewed enough to overflow the call stack?
13. Is the tree a BST with additional ordering?
14. Am I comparing node identity or node values?
15. What is the tree’s maximum height?
---
## Common Mistakes
- Accessing `node.val` before checking whether `node` is `null`.
- Memorizing traversal names without understanding processing position.
- Using inorder simply because the input is a tree.
- Assuming inorder is sorted for every binary tree; it is sorted only for a valid BST.
- Using preorder when the parent requires completed child answers.
- Returning the wrong neutral value for `null`.
- Calculating only one subtree when both are required.
- Forgetting to return the combined recursive result.
- Mixing depth and height.
- Mixing edge-based and node-based height definitions.
- Comparing `node.val` when node identity is required.
- Pushing left before right during iterative preorder, which processes right first.
- Using `while (!stack.isEmpty())` alone for iterative inorder and losing the initial left chain.
- Forgetting to restore temporary links in Morris traversal.
- Claiming recursive traversal uses `O(1)` space.
- Ignoring the possibility of a skewed tree.
---
## Complexity Analysis
For a tree with `n` nodes, each standard traversal visits every node once:
```plain text
Time: O(n)
```
## Recursive traversal
The call stack depends on tree height `h`:
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
## Iterative traversal
The explicit stack can hold up to `O(h)` nodes in many traversals.
```plain text
Space: O(h)
```
The two-stack postorder approach can store all nodes:
```plain text
Space: O(n)
```
## Morris traversal
```plain text
Time:  O(n)
Space: O(1)
```
Although predecessor links may be examined more than once, each temporary edge is created and removed once, keeping total work linear.
---
## Final Reusable Model
> Every tree node represents a smaller subtree. Decide when to process the node and define exactly what its subtree returns.
```plain text
Preorder:
Process current → Visit children

Inorder:
Visit left → Process current → Visit right

Postorder:
Visit children → Combine at current
```
The most important question is:
> “What information should this node return to its parent?”
