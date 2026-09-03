A Binary Search Tree (BST) is a binary tree with an ordering rule.
For every node:
```plain text
All values in the left subtree  < node.val
All values in the right subtree > node.val
```
This rule applies to the entire subtree—not only the immediate children.
```plain text
    8
   / \
  3   10
 / \    \
1   6    14
   / \   /
  4   7 13
```
Because values are ordered, many BST operations can discard an entire subtree, similar to binary search.
---
## Core BST Invariant
> Every node creates a valid range for all its descendants.
For example:
```plain text
  8
 / \
3   10
```
The left subtree must contain only values smaller than `8`.
The right subtree must contain only values greater than `8`.
For node `3`:
```plain text
Allowed range: (-∞, 8)
```
Its right child must be:
```plain text
greater than 3
and
smaller than 8
```
Therefore, checking only the immediate parent-child relationship is insufficient.
---
## BST versus Binary Tree
A binary tree guarantees only:
```plain text
Each node has at most two children
```
A BST additionally guarantees:
```plain text
left subtree values < node value < right subtree values
```
This ordering enables:
- Faster search
- Faster insertion and deletion
- Sorted inorder traversal
- Efficient predecessor and successor queries
- Range pruning
---
## Important BST Property: Inorder Is Sorted
BST inorder traversal follows:
```plain text
Left → Node → Right
```
Because the left subtree contains smaller values and the right subtree contains larger values:
> Inorder traversal of a valid BST produces values in increasing order.
Example:
```plain text
    5
   / \
  3   7
 / \   \
2   4   9
```
Inorder:
```plain text
2, 3, 4, 5, 7, 9
```
This property is central to many BST problems.
---
## Balanced and Skewed BSTs
A balanced BST has height approximately:
```plain text
O(log n)
```
```plain text
    4
   / \
  2   6
 / \ / \
1  3 5  7
```
A skewed BST can have height:
```plain text
O(n)
```
```plain text
1
 \
  2
   \
    3
     \
      4
```
BST operations are therefore generally:
```plain text
Average/Balanced: O(log n)
Worst/Skewed:     O(n)
```
A BST is not automatically balanced.
---
## How to Identify BST Problems
Look for these signals:
- The input is explicitly called a Binary Search Tree.
- The question involves sorted ordering between nodes.
- You need to search for a particular value.
- You need the kth smallest or kth largest value.
- You need a predecessor, successor, floor, or ceiling.
- You need to validate whether a tree follows BST rules.
- You need to process values within a range.
- You need to insert or delete while preserving order.
- The question can eliminate the left or right subtree using comparisons.
### Most important recognition question
> Can the BST ordering rule tell me that one entire subtree is irrelevant?
If yes, use the BST property instead of traversing the entire tree.
---
## Common Forms
## Common Form 1: Search in a BST
Compare the target with the current node.
```plain text
target < node.val → search left
target > node.val → search right
target = node.val → found
```
### How it works
1. Start at the root.
2. If the target equals the current value, return the node.
3. If the target is smaller, move left.
4. If the target is larger, move right.
5. Stop when the target is found or the current node becomes `null`.
**Memory flow:** `Compare → Eliminate one subtree → Continue`
### Iterative template
```java
TreeNode searchBST(
        TreeNode root,
        int target
) {
    TreeNode current = root;

    while (current != null) {
        if (current.val == target) {
            return current;
        }

        if (target < current.val) {
            current = current.left;
        } else {
            current = current.right;
        }
    }

    return null;
}
```
### Recursive template
```java
TreeNode searchBST(
        TreeNode root,
        int target
) {
    if (root == null || root.val == target) {
        return root;
    }

    if (target < root.val) {
        return searchBST(root.left, target);
    }

    return searchBST(root.right, target);
}
```
Practice:
- LC 700 — Search in a Binary Search Tree
- LC 938 — Range Sum of BST
- Find Floor in a BST
- Find Ceil in a BST
---
## Common Form 2: Validate a BST
A valid BST must satisfy the ordering rule across complete subtrees.
This tree is invalid:
```plain text
  10
 /  \
5    15
    /  \
   6    20
```
Although `6 < 15`, it is inside the right subtree of `10`, so it must also be greater than `10`.
### How it works using ranges
1. Give the root an unrestricted range.
2. Every node must lie strictly inside its permitted range.
3. For the left child, the current value becomes the upper bound.
4. For the right child, the current value becomes the lower bound.
5. Recursively validate both subtrees.
**Memory flow:** `Carry allowed range downward → Narrow range at every node`
```java
boolean isValidBST(TreeNode root) {
    return validate(
        root,
        Long.MIN_VALUE,
        Long.MAX_VALUE
    );
}

boolean validate(
        TreeNode node,
        long lower,
        long upper
) {
    if (node == null) {
        return true;
    }

    if (node.val <= lower || node.val >= upper) {
        return false;
    }

    return validate(node.left, lower, node.val)
        && validate(node.right, node.val, upper);
}
```
### Why use `long` boundaries?
A node may contain:
```java
Integer.MIN_VALUE
Integer.MAX_VALUE
```
Using those same integer values as exclusive boundaries could incorrectly reject valid nodes.
### Alternative: Validate inorder order
A valid BST’s inorder values must be strictly increasing.
```java
TreeNode previous;

boolean validate(TreeNode node) {
    if (node == null) {
        return true;
    }

    if (!validate(node.left)) {
        return false;
    }

    if (previous != null
            && previous.val >= node.val) {
        return false;
    }

    previous = node;

    return validate(node.right);
}
```
Practice:
- LC 98 — Validate Binary Search Tree
- LC 333 — Largest BST Subtree
- LC 1373 — Maximum Sum BST in Binary Tree
---
## Common Form 3: Insert into a BST
Insertion searches for the appropriate empty position while preserving BST ordering.
### How it works
1. If the current subtree is empty, create and return the new node.
2. If the value is smaller, insert into the left subtree.
3. If the value is larger, insert into the right subtree.
4. Reconnect the returned subtree.
5. Return the current root.
**Memory flow:** `Find null position → Create node → Reconnect while returning`
```java
TreeNode insertIntoBST(
        TreeNode root,
        int value
) {
    if (root == null) {
        return new TreeNode(value);
    }

    if (value < root.val) {
        root.left = insertIntoBST(root.left, value);
    } else {
        root.right = insertIntoBST(root.right, value);
    }

    return root;
}
```
### Recursive contract
> `insertIntoBST(root, value)` returns the root of the updated subtree after inserting `value`.
Practice:
- LC 701 — Insert into a Binary Search Tree
- LC 1382 — Balance a Binary Search Tree
- Build a BST from insertion order
---
## Common Form 4: Delete from a BST
Deletion has three cases.
### Case 1: Leaf node
```plain text
Delete the node and return null.
```
### Case 2: One child
```plain text
Return the existing child to replace the deleted node.
```
### Case 3: Two children
Replace the deleted node using either:
```plain text
Inorder successor   → smallest value in right subtree
Inorder predecessor → largest value in left subtree
```
Then delete the replacement value from its original position.
### How it works
1. Search for the target using BST ordering.
2. Reconnect the modified left or right subtree.
3. When the target is found, handle its child case.
4. For two children, copy the successor’s value.
5. Recursively delete that successor.
**Memory flow:** `Search → Handle child case → Return updated subtree root`
```java
TreeNode deleteNode(
        TreeNode root,
        int key
) {
    if (root == null) {
        return null;
    }

    if (key < root.val) {
        root.left = deleteNode(root.left, key);
    } else if (key > root.val) {
        root.right = deleteNode(root.right, key);
    } else {
        if (root.left == null) {
            return root.right;
        }

        if (root.right == null) {
            return root.left;
        }

        TreeNode successor = findMinimum(root.right);

        root.val = successor.val;
        root.right = deleteNode(
            root.right,
            successor.val
        );
    }

    return root;
}

TreeNode findMinimum(TreeNode node) {
    while (node.left != null) {
        node = node.left;
    }

    return node;
}
```
### Why reconnect returned subtrees?
Deletion can change the root of a subtree:
```java
root.left = deleteNode(root.left, key);
```
Without assignment, the parent may continue pointing to the deleted node.
Practice:
- LC 450 — Delete Node in a BST
- LC 669 — Trim a Binary Search Tree
---
## Common Form 5: Ordered Inorder Problems
Use inorder when the question depends on sorted BST order.
Examples:
- kth smallest
- minimum difference
- two-sum using sorted values
- recovering swapped nodes
- converting BST into an ordered structure
### How it works
1. Traverse the left subtree.
2. Process the current value as the next value in sorted order.
3. Compare it with previously processed values when required.
4. Traverse the right subtree.
5. Stop early when the answer is found.
**Memory flow:** `Generate values in sorted order → Process only what is needed`
### Kth-smallest template
```java
int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode current = root;

    while (current != null || !stack.isEmpty()) {
        while (current != null) {
            stack.push(current);
            current = current.left;
        }

        current = stack.pop();
        k--;

        if (k == 0) {
            return current.val;
        }

        current = current.right;
    }

    return -1;
}
```
### Minimum-difference idea
Because inorder is sorted, the smallest difference must occur between consecutive inorder values.
```java
TreeNode previous;
int minimum = Integer.MAX_VALUE;

void inorder(TreeNode node) {
    if (node == null) {
        return;
    }

    inorder(node.left);

    if (previous != null) {
        minimum = Math.min(
            minimum,
            node.val - previous.val
        );
    }

    previous = node;

    inorder(node.right);
}
```
Practice:
- LC 230 — Kth Smallest Element in a BST
- LC 530 — Minimum Absolute Difference in BST
- LC 501 — Find Mode in Binary Search Tree
- LC 653 — Two Sum IV
- LC 99 — Recover Binary Search Tree
---
## Common Form 6: Floor, Ceiling, Predecessor and Successor
These questions ask for the nearest value satisfying an ordering condition.
```plain text
Floor:
largest value <= target

Ceiling:
smallest value >= target

Predecessor:
largest value < node

Successor:
smallest value > node
```
### How floor works
1. If the current value equals the target, it is the floor.
2. If the current value is greater, move left.
3. If the current value is smaller, save it as a candidate and move right.
4. A larger valid candidate may exist in the right subtree.
**Memory flow:** `Save valid candidate → Search for a closer candidate`
```java
Integer floor(TreeNode root, int target) {
    Integer answer = null;
    TreeNode current = root;

    while (current != null) {
        if (current.val == target) {
            return current.val;
        }

        if (current.val > target) {
            current = current.left;
        } else {
            answer = current.val;
            current = current.right;
        }
    }

    return answer;
}
```
### How ceiling differs
For ceiling:
```plain text
current.val < target → move right
current.val > target → save candidate and move left
```
### Successor using the tree root
```java
TreeNode successor(
        TreeNode root,
        TreeNode target
) {
    TreeNode candidate = null;

    while (root != null) {
        if (target.val < root.val) {
            candidate = root;
            root = root.left;
        } else {
            root = root.right;
        }
    }

    return candidate;
}
```
Practice:
- LC 285 — Inorder Successor in BST
- LC 510 — Inorder Successor in BST II
- LC 270 — Closest Binary Search Tree Value
- Find Floor and Ceil in a BST
---
## Common Form 7: Lowest Common Ancestor in a BST
A BST allows us to locate the LCA without searching both complete subtrees.
### How it works
For the current node:
```plain text
p and q are both smaller → LCA is in the left subtree
p and q are both larger  → LCA is in the right subtree
They split across sides  → current node is the LCA
```
The current node may itself equal one target.
**Memory flow:** `Compare both targets → Move together or stop at split`
```java
TreeNode lowestCommonAncestor(
        TreeNode root,
        TreeNode p,
        TreeNode q
) {
    TreeNode current = root;

    while (current != null) {
        if (p.val < current.val
                && q.val < current.val) {
            current = current.left;
        } else if (p.val > current.val
                && q.val > current.val) {
            current = current.right;
        } else {
            return current;
        }
    }

    return null;
}
```
### Split-point mental model
> The LCA is the first node where the two target values no longer move in the same direction.
Practice:
- LC 235 — Lowest Common Ancestor of a BST
- LC 236 — Lowest Common Ancestor of a Binary Tree
---
## Common Form 8: Range-Based BST Problems
BST ordering allows entire subtrees to be skipped.
For a required range:
```plain text
[low, high]
```
At a node:
```plain text
node.val < low  → left subtree is also too small
node.val > high → right subtree is also too large
```
### How it works
1. Compare the current value with the permitted range.
2. If it is too small, skip the entire left subtree.
3. If it is too large, skip the entire right subtree.
4. If it is inside the range, process it and explore both subtrees.
**Memory flow:** `Compare with range → Prune impossible subtree`
### Range-sum template
```java
int rangeSumBST(
        TreeNode root,
        int low,
        int high
) {
    if (root == null) {
        return 0;
    }

    if (root.val < low) {
        return rangeSumBST(root.right, low, high);
    }

    if (root.val > high) {
        return rangeSumBST(root.left, low, high);
    }

    return root.val
        + rangeSumBST(root.left, low, high)
        + rangeSumBST(root.right, low, high);
}
```
### Trimming template idea
```plain text
node.val < low  → discard node and its left subtree
node.val > high → discard node and its right subtree
otherwise       → recursively trim both children
```
Practice:
- LC 938 — Range Sum of BST
- LC 669 — Trim a Binary Search Tree
- LC 776 — Split BST
- LC 1214 — Two Sum BSTs
---
## Common Form 9: Construct or Balance a BST
BSTs can be constructed efficiently from sorted information.
To produce a balanced BST from a sorted array, choose the middle element as the root.
### How it works
1. Choose the middle value as the current root.
2. Values before the middle belong to the left subtree.
3. Values after the middle belong to the right subtree.
4. Recursively construct both sides.
5. Return the current root.
**Memory flow:** `Choose middle → Build left half → Build right half`
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
### Why choose the middle?
Choosing the middle keeps the two subtree sizes close:
```plain text
Height: O(log n)
```
Repeatedly inserting sorted values would instead create a skewed tree.
Practice:
- LC 108 — Convert Sorted Array to BST
- LC 109 — Convert Sorted List to BST
- LC 1008 — Construct BST from Preorder Traversal
- LC 1382 — Balance a Binary Search Tree
- LC 449 — Serialize and Deserialize BST
---
## Common Form 10: BST Iterator
A BST iterator returns values one at a time in sorted order without storing the complete traversal.
It performs controlled iterative inorder traversal.
### How it works
1. Push the complete left chain onto a stack.
2. The top of the stack is the next smallest node.
3. Pop that node when `next()` is called.
4. Push the left chain of its right subtree.
5. Repeat until the stack becomes empty.
**Memory flow:** `Store path to next smallest → Pop one → Prepare its successor`
```java
class BSTIterator {
    private Deque<TreeNode> stack =
        new ArrayDeque<>();

    BSTIterator(TreeNode root) {
        pushLeft(root);
    }

    private void pushLeft(TreeNode node) {
        while (node != null) {
            stack.push(node);
            node = node.left;
        }
    }

    int next() {
        TreeNode node = stack.pop();
        pushLeft(node.right);
        return node.val;
    }

    boolean hasNext() {
        return !stack.isEmpty();
    }
}
```
### Complexity
Each node is pushed and popped once:
```plain text
next():    O(1) amortized
hasNext(): O(1)
Space:     O(h)
```
Practice:
- LC 173 — Binary Search Tree Iterator
- LC 653 — Two Sum IV
- LC 1586 — Binary Search Tree Iterator II
---
## BST Decision Guide
```plain text
Find a value
→ Compare and choose one subtree

Check whether the tree is a BST
→ Carry valid lower and upper bounds

Need sorted values
→ Inorder traversal

Need kth smallest
→ Stop inorder after k nodes

Need nearest smaller/larger value
→ Save candidate while searching

Need LCA
→ Find where target directions split

Need values in a range
→ Prune impossible subtrees

Insert or delete
→ Return the updated subtree root

Build a balanced BST
→ Choose the middle value recursively

Return sorted values one at a time
→ Controlled inorder with a stack
```
---
## BST Search versus Full Traversal
Use BST-directed search when ordering eliminates a subtree:
```java
if (target < node.val) {
    search(node.left);
} else {
    search(node.right);
}
```
Use full traversal when both subtrees may contain part of the answer:
```java
solve(node.left);
solve(node.right);
```
Examples requiring both sides:
- Calculate tree height
- Calculate diameter
- Count every node
- Transform every value
- Find structural properties unrelated to ordering
> Do not force BST search into a problem where the ordering does not eliminate any possibilities.
---
## Duplicate Values
Different BST definitions may handle duplicates differently:
```plain text
Duplicates forbidden
Duplicates always placed left
Duplicates always placed right
Duplicates counted inside the node
```
LeetCode BST problems commonly assume distinct values unless stated otherwise.
Always check the problem’s rule before using:
```plain text
< and >
```
versus:
```plain text
<= and >=
```
---
## Quick Interview Checklist
1. Is the input guaranteed to be a BST?
2. Are duplicate values allowed?
3. What exact ordering rule applies to duplicates?
4. Can comparison eliminate an entire subtree?
5. Would inorder produce the order I need?
6. Can inorder stop early?
7. Does validation require ancestor boundaries?
8. Should boundaries use `long`?
9. Do I need a running candidate for floor or ceiling?
10. Is the answer based on node identity or value?
11. Does insertion or deletion change a subtree root?
12. Did I reconnect the returned subtree?
13. Which deletion case applies?
14. Should I use the predecessor or successor?
15. Can range conditions prune a subtree?
16. Is the tree guaranteed to be balanced?
17. What is the height in the worst case?
18. Is recursion safe for a skewed tree?
19. Can I use an explicit stack?
20. What information should each subtree return?
---
## Common Mistakes
- Checking only immediate children while validating a BST.
- Assuming every binary tree is a BST.
- Assuming every BST is balanced.
- Claiming every BST operation is always `O(log n)`.
- Ignoring the `O(n)` skewed-tree case.
- Using `int` boundaries when values can equal integer limits.
- Using inorder ordering without ensuring the tree is a valid BST.
- Traversing both subtrees when comparison can eliminate one.
- Forgetting to stop inorder after finding the kth element.
- Comparing a node with itself as the previous inorder node.
- Using absolute difference unnecessarily for sorted inorder values.
- Forgetting to save a floor or ceiling candidate.
- Returning the wrong candidate after moving away from it.
- Mishandling deletion when the node has two children.
- Forgetting to reconnect the subtree returned by insertion or deletion.
- Losing a child reference while modifying the tree.
- Assuming duplicates are forbidden without checking.
- Using node values when node identity matters.
- Keeping recursive or global state between separate executions.
---
## Complexity Analysis
Let:
```plain text
n = number of nodes
h = tree height
```
## Search, insertion and deletion
```plain text
Time:  O(h)
Space: O(h) recursive
       O(1) iterative
```
Balanced BST:
```plain text
Time: O(log n)
```
Skewed BST:
```plain text
Time: O(n)
```
## Full inorder traversal
```plain text
Time:  O(n)
Space: O(h)
```
## Range queries
With pruning, only relevant parts may be visited.
Worst case:
```plain text
Time: O(n)
```
## Construct balanced BST from a sorted array
```plain text
Time:  O(n)
Stack: O(log n)
```
## BST iterator
```plain text
Initialization: O(h)
next():         O(1) amortized
hasNext():      O(1)
Space:          O(h)
```
---
## Final Reusable Model
> A BST is a binary tree where ordering allows you to either generate sorted values or eliminate an entire subtree.
```plain text
Compare with current node
→ Move left or right

Need global ordering
→ Use inorder

Need structural validity
→ Carry ancestor bounds

Need nearest valid value
→ Save a candidate

Need a range
→ Prune impossible branches

Need structural changes
→ Return and reconnect subtree roots
```
The key interview question is:
> “How can the BST ordering rule reduce the amount of tree I need to explore?”
