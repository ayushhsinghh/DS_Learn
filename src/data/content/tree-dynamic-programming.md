## 1. Introduction to the Pattern

Tree DP is used when the answer for a node or subtree can be calculated using answers returned by its children.

Typical state:

```plain text
dp[node]
= answer for the subtree rooted at node

```

Sometimes one value is insufficient, so every node returns multiple states:

```plain text
dp[node][state]

```

Examples:

```plain text
dp[node][0] = answer when node is not selected
dp[node][1] = answer when node is selected

```

Typical objectives include:

- Calculate subtree sizes or heights
- Find the longest or maximum-sum tree path
- Select non-adjacent nodes
- Place the minimum number of resources in a tree
- Count valid configurations
- Find answers for every possible root
- Combine choices made across child subtrees

#### Core mental model

> Each child solves its subtree and returns exactly the information its parent needs.

Tree DP is generally implemented using DFS because DFS naturally processes an entire subtree before returning to its parent.

---

## 2. How to Identify It

Look for these signals:

- The input is a tree.
- The answer for a node depends on its children or neighboring subtrees.
- The problem asks for a result over:
	- Every subtree
	- Every root-to-leaf path
	- Any path in the tree
	- Selected and unselected nodes
	- Every possible root
- Decisions made at a node affect what its children may do.
- Child subtrees become independent once the parent’s state is known.
- You need to calculate similar information for every node.

Common wording:

```plain text
maximum path
minimum cameras
nodes cannot be selected together
subtree answer
longest path
place minimum resources
for every possible root
choose or skip each node
maximum independent set

```

#### Recognition questions

Ask:

> If every child gives me its solved answer, can I calculate the answer for the current node?

Or:

> Does the parent need different answers depending on whether the current node is selected, covered, matched, or entered from a particular direction?

If yes, consider Tree DP.

#### Tree DP versus ordinary DFS

A DFS only describes the traversal.

Tree DP describes:

```plain text
What information each DFS call calculates and returns

```

For example, this is ordinary traversal:

```java
void dfs(TreeNode node) {
    if (node == null) {
        return;
    }

    dfs(node.left);
    dfs(node.right);
}

```

It becomes Tree DP when the children return information that is combined:

```java
int dfs(TreeNode node) {
    if (node == null) {
        return 0;
    }

    int left = dfs(node.left);
    int right = dfs(node.right);

    return combine(node, left, right);
}

```

#### Important observation

A rooted tree normally has no repeated subproblems because every subtree is reached once.
Therefore, Tree DP often does not need a separate memoization map.
The returned subtree values themselves form the DP.

---

## 3. State Definition and Recursive Function Contract

Before writing the recursion, complete this sentence:

> `dfs(node)` returns  for the subtree rooted at `node`.

Examples:

```plain text
dfs(node)
= height of the subtree rooted at node

```

```plain text
dfs(node)
= maximum downward path sum that starts at node

```

```plain text
dfs(node)
= [maximum value when node is selected,
   maximum value when node is skipped]

```

For an undirected tree, include the parent:

```plain text
dfs(node, parent)
= answer for node's subtree when the tree is rooted
  and parent must not be revisited

```

#### Single-state return

Use one value when the parent needs only one piece of information:

```java
int dfs(TreeNode node)

```

Examples:

- Height
- Subtree size
- Downward path sum
- Number of nodes in the subtree

#### Multiple-state return

Use an array or class when the parent needs multiple possibilities:

```java
int[] dfs(TreeNode node)

```

Example:

```plain text
result[0] = answer when node is selected
result[1] = answer when node is skipped

```

A named class can make complicated states clearer:

```java
class State {
    int selected;
    int skipped;

    State(int selected, int skipped) {
        this.selected = selected;
        this.skipped = skipped;
    }
}

```

#### Global answer versus returned answer

Some problems require two different values:

```plain text
Returned value
= information that can be extended by the parent

Global answer
= complete answer that may use multiple child branches

```

This distinction is essential for:

- Tree diameter
- Binary Tree Maximum Path Sum
- Longest ZigZag Path

---

## 4. Brute-Force Recursive Decision

Consider selecting nodes where directly connected nodes cannot both be selected.

At every node, we have two choices:

```plain text
Take the current node
Skip the current node

```

### If we take the current node

Its children cannot be taken:

```plain text
take
= node.value
+ skip(left child)
+ skip(right child)

```

### If we skip the current node

Each child may independently be taken or skipped:

```plain text
skip
= max(take(left), skip(left))
+ max(take(right), skip(right))

```

#### Incorrect brute-force approach

A naive solution may define:

```java
int solve(TreeNode node, boolean parentSelected)

```

and recursively calculate the same subtree under different decisions.

A cleaner Tree DP returns both possibilities simultaneously:

```plain text
[selected, skipped]

```

This avoids repeating subtree work.

#### Decision tree

```plain text
             node
           /      \
       take        skip
      /   \        /   \
skip(left) ...   best(left) ...

```

The key improvement is:

> Calculate every possible state for the node in one DFS call.

---

## 5. Base Cases

### Null node

For additive problems:

```java
if (node == null) {
    return 0;
}

```

For a two-state selection problem:

```java
if (node == null) {
    return new int[]{0, 0};
}

```

Meaning:

```plain text
select null = 0
skip null   = 0

```

### Leaf node

Sometimes the null base case automatically handles leaves:

```java
int left = dfs(node.left);   // returns 0
int right = dfs(node.right); // returns 0

return 1 + Math.max(left, right);

```

Sometimes a leaf needs a specific state:

```plain text
Leaf with camera:
camera = 1
covered without camera = impossible
needs coverage = 0

```

### Impossible state

For a maximization problem:

```plain text
negative infinity

```

For a minimization problem:

```plain text
positive infinity

```

Use a safe value to avoid overflow:

```java
int INF = 1_000_000_000;

```

#### Undirected-tree base behavior

Do not revisit the parent:

```java
for (int next : graph.get(node)) {
    if (next == parent) {
        continue;
    }
}

```

A separate visited array is unnecessary when the graph is guaranteed to be a tree and the parent is tracked.

---

## 6. Recurrence Relation

Tree DP recurrence generally has three steps:

```plain text
1. Solve every child.
2. Combine the child states.
3. Return the state required by the parent.

```

### Single-state recurrence

For subtree height:

```plain text
height(node)
=
1 + max(
    height(node.left),
    height(node.right)
)

```

### Additive subtree recurrence

For subtree size:

```plain text
size(node)
=
1 + sum(size(child))

```

### Take-or-skip recurrence

```plain text
take(node)
=
value(node)
+ sum(skip(child))

```

```plain text
skip(node)
=
sum(max(take(child), skip(child)))

```

### Path recurrence

```plain text
returned downward path
=
node.value
+ max(0, best child contribution)

```

But the complete path through the node may use two children:

```plain text
complete path through node
=
node.value
+ max(0, left contribution)
+ max(0, right contribution)

```

### General multi-state recurrence

```plain text
dp[node][state]
=
combine child states that are compatible
with the current node's state

```

---

## 7. Memoization Template

### Rooted binary tree

When every node is visited once, explicit memoization is normally unnecessary:

```java
private State dfs(TreeNode node) {
    if (node == null) {
        return new State(0, 0);
    }

    State left = dfs(node.left);
    State right = dfs(node.right);

    State current = combine(node, left, right);
    return current;
}

```

The returned result is the DP value for that subtree.

### Undirected tree

```java
private int dfs(
    int node,
    int parent,
    List<List<Integer>> graph
) {
    int answer = initialValue(node);

    for (int next : graph.get(node)) {
        if (next == parent) {
            continue;
        }

        int childAnswer = dfs(next, node, graph);
        answer = combine(answer, childAnswer);
    }

    return answer;
}

```

### When explicit memoization is needed

A memo table may be necessary when the state contains more than `(node, parent)` and the same state can be reached repeatedly.

Example:

```plain text
solve(node, selectedState)

```

Template:

```java
private int[][] memo;

private int solve(
    int node,
    int parent,
    int state,
    List<List<Integer>> graph
) {
    if (memo[node][state] != -1) {
        return memo[node][state];
    }

    int answer = initialValue(node, state);

    for (int next : graph.get(node)) {
        if (next == parent) {
            continue;
        }

        answer = combine(
            answer,
            solve(next, node, nextState, graph)
        );
    }

    return memo[node][state] = answer;
}

```

In most standard Tree DP problems, returning all relevant states together is cleaner than memoizing each state separately.

---

## 8. Tabulation Template

Tree DP is most naturally written recursively, but it can also be implemented iteratively.

The tabulation order must be postorder:

```plain text
children before parent

```

### Build parent and traversal order

```java
int[] parent = new int[n];
Arrays.fill(parent, -1);

List<Integer> order = new ArrayList<>();
Deque<Integer> stack = new ArrayDeque<>();

stack.push(0);
parent[0] = 0;

while (!stack.isEmpty()) {
    int node = stack.pop();
    order.add(node);

    for (int next : graph.get(node)) {
        if (next == parent[node]) {
            continue;
        }

        parent[next] = node;
        stack.push(next);
    }
}

```

The order currently contains parents before children.

Process it backward:

```java
for (int index = order.size() - 1;
     index >= 0;
     index--) {

    int node = order.get(index);

    for (int next : graph.get(node)) {
        if (parent[next] == node) {
            // dp[next] is already calculated.
        }
    }
}

```

### Subtree-size tabulation

```java
int[] subtreeSize = new int[n];
Arrays.fill(subtreeSize, 1);

for (int index = order.size() - 1;
     index > 0;
     index--) {

    int node = order.get(index);
    int parentNode = parent[node];

    subtreeSize[parentNode] += subtreeSize[node];
}

```

#### Why reverse the order?

The original DFS order contains:

```plain text
parent before child

```

Reversing it produces:

```plain text
child before parent

```

That is the dependency order required by Tree DP.

---

## 9. Correct Traversal Order

Most Tree DP problems use postorder traversal:

```plain text
left subtree
right subtree
current node

```

Because the current node depends on answers from its children.

```java
private State dfs(TreeNode node) {
    if (node == null) {
        return baseState;
    }

    State left = dfs(node.left);
    State right = dfs(node.right);

    return combine(node, left, right);
}

```

### When preorder is required

Some problems require information from the parent or from outside the current subtree.
This commonly happens in rerooting DP.

Rerooting uses two passes:

```plain text
Pass 1: Postorder
Calculate subtree information.

Pass 2: Preorder
Propagate information from the parent to the children.

```

### Traversal rule

```plain text
Needs child information
→ Postorder

Needs parent/outside-subtree information
→ Preorder after a postorder pass

Needs both
→ Two-pass rerooting

```

---

## 10. Space Optimization

Tree DP usually does not require an `n × n` table.

If every recursive call returns its state directly:

```plain text
Extra DP storage: O(tree height)

```

This is the recursion stack.

For a balanced tree:

```plain text
O(log n)

```

For a completely skewed tree:

```plain text
O(n)

```

### Returning state instead of storing maps

Prefer:

```java
int[] state = dfs(node);

```

over:

```java
Map<TreeNode, int[]> dp;

```

when the parent consumes the child state immediately and the result is not needed later.

### When arrays are required

Use `O(n)` arrays when:

- You need an answer for every node.
- You perform rerooting.
- You need answer reconstruction.
- The tree is processed iteratively.
- Child states must be reused later.

#### Important warning

Recursive DFS on a deeply skewed tree may cause stack overflow in Java.
For large trees, consider iterative postorder traversal.

---

## 11. Common Problem Forms

### Common Form 1: Subtree Aggregation

Calculate a property for every subtree.

Examples:

- Height
- Size
- Sum
- Number of leaves
- Minimum or maximum value

#### How it works

Each child returns its subtree result. The current node combines all child results and adds its own contribution.

#### State

```plain text
dfs(node)
= height of the subtree rooted at node

```

#### Recurrence

```plain text
height(node)
=
1 + max(height(left), height(right))

```

#### Code

```java
public int maxDepth(TreeNode root) {
    if (root == null) {
        return 0;
    }

    int leftHeight = maxDepth(root.left);
    int rightHeight = maxDepth(root.right);

    return 1 + Math.max(leftHeight, rightHeight);
}

```

Practice:

- LC 104 — Maximum Depth of Binary Tree
- LC 110 — Balanced Binary Tree
- LC 543 — Diameter of Binary Tree
- LC 333 — Largest BST Subtree

---

### Common Form 2: A Path Uses Two Child Branches

The complete answer may pass through the current node and use contributions from two children.

#### How it works

Each child returns one extendable branch. The current node combines the two best branches for the global answer but returns only one branch to its parent.

#### State

```plain text
dfs(node)
= maximum downward path sum starting at node

```

#### Complete path through a node

```plain text
node.value + left contribution + right contribution

```

#### Returned path

```plain text
node.value + max(left contribution, right contribution)

```

A parent cannot extend both branches because that would create a fork rather than a path.

#### Code

```java
class Solution {
    private int answer = Integer.MIN_VALUE;

    private int dfs(TreeNode node) {
        if (node == null) {
            return 0;
        }

        int leftContribution =
            Math.max(0, dfs(node.left));

        int rightContribution =
            Math.max(0, dfs(node.right));

        int completePath =
            node.val
            + leftContribution
            + rightContribution;

        answer = Math.max(answer, completePath);

        return node.val
            + Math.max(
                leftContribution,
                rightContribution
            );
    }

    public int maxPathSum(TreeNode root) {
        dfs(root);
        return answer;
    }
}

```

Practice:

- LC 124 — Binary Tree Maximum Path Sum
- LC 543 — Diameter of Binary Tree
- LC 687 — Longest Univalue Path
- LC 1372 — Longest ZigZag Path in a Binary Tree

---

### Common Form 3: Take or Skip a Node

Selecting a node restricts which neighboring nodes may be selected.

#### How it works

Return two answers for every subtree:

```plain text
take = answer when the current node is selected
skip = answer when the current node is not selected

```

When the current node is selected, its children must be skipped. When it is skipped, each child independently chooses its better state.

#### State

```plain text
state[0] = maximum value when node is selected
state[1] = maximum value when node is skipped

```

#### Recurrence

```plain text
take(node)
=
node.value
+ skip(left)
+ skip(right)

```

```plain text
skip(node)
=
max(take(left), skip(left))
+ max(take(right), skip(right))

```

#### Code

```java
class Solution {
    private int[] dfs(TreeNode node) {
        if (node == null) {
            return new int[]{0, 0};
        }

        int[] left = dfs(node.left);
        int[] right = dfs(node.right);

        int take =
            node.val
            + left[1]
            + right[1];

        int skip =
            Math.max(left[0], left[1])
            + Math.max(right[0], right[1]);

        return new int[]{take, skip};
    }

    public int rob(TreeNode root) {
        int[] result = dfs(root);
        return Math.max(result[0], result[1]);
    }
}

```

Practice:

- LC 337 — House Robber III
- Maximum Independent Set on a Tree
- Minimum Vertex Cover on a Tree

---

### Common Form 4: Multiple Semantic States

The parent must know more than selected or skipped.

#### How it works

Define a small set of precise states describing the current node’s relationship with its parent and children.

For Binary Tree Cameras, a node can be:

```plain text
0 = has a camera
1 = covered without a camera
2 = not covered and needs its parent

```

#### State contract

```plain text
dfs(node)
= coverage state of node after its subtree
  has been processed

```

#### Greedy Tree DP transitions

```plain text
If any child needs coverage:
    place a camera at current node

If any child has a camera:
    current node is covered

Otherwise:
    current node needs its parent

```

#### Code

```java
class Solution {
    private int cameras;

    private int dfs(TreeNode node) {
        if (node == null) {
            return 1;
        }

        int left = dfs(node.left);
        int right = dfs(node.right);

        if (left == 2 || right == 2) {
            cameras++;
            return 0;
        }

        if (left == 0 || right == 0) {
            return 1;
        }

        return 2;
    }

    public int minCameraCover(TreeNode root) {
        cameras = 0;

        if (dfs(root) == 2) {
            cameras++;
        }

        return cameras;
    }
}

```

#### Why does null return covered?

A missing node does not require a camera.
Returning the covered state prevents its parent from placing an unnecessary camera.

Practice:

- LC 968 — Binary Tree Cameras
- LC 979 — Distribute Coins in Binary Tree
- LC 834 — Sum of Distances in Tree

---

### Common Form 5: Direction-Dependent Tree DP

The answer depends on which direction or edge type was used previously.

#### How it works

Return a separate state for each possible continuation direction.

For a ZigZag path:

```plain text
goLeft
= path length if the next edge moves left

goRight
= path length if the next edge moves right

```

A left move must be followed by a right move, and a right move must be followed by a left move.

#### State

```plain text
dfs(node) returns:
[leftLength, rightLength]

```

#### Code

```java
class Solution {
    private int answer = 0;

    private int[] dfs(TreeNode node) {
        if (node == null) {
            return new int[]{-1, -1};
        }

        int[] left = dfs(node.left);
        int[] right = dfs(node.right);

        int moveLeft = 1 + left[1];
        int moveRight = 1 + right[0];

        answer = Math.max(
            answer,
            Math.max(moveLeft, moveRight)
        );

        return new int[]{moveLeft, moveRight};
    }

    public int longestZigZag(TreeNode root) {
        dfs(root);
        return answer;
    }
}

```

#### Why does null return `-1`?

For a leaf:

```plain text
moveLeft  = 1 + (-1) = 0
moveRight = 1 + (-1) = 0

```

A leaf has a ZigZag path of zero edges.

Practice:

- LC 1372 — Longest ZigZag Path in a Binary Tree
- LC 687 — Longest Univalue Path

---

### Common Form 6: Subtree Contribution to a Global Answer

Each subtree produces a quantity that contributes to the final result.

#### How it works

The child returns information such as subtree size, total excess, or required resources. The parent combines these contributions, while a global answer records the cost of moving information across edges.

For Distribute Coins:

```plain text
balance(node)
= coins in subtree - nodes in subtree

```

A positive balance means excess coins.
A negative balance means the subtree needs coins.

The number of moves across an edge is:

```plain text
absolute value of the child balance

```

#### Code

```java
class Solution {
    private int moves;

    private int dfs(TreeNode node) {
        if (node == null) {
            return 0;
        }

        int leftBalance = dfs(node.left);
        int rightBalance = dfs(node.right);

        moves += Math.abs(leftBalance);
        moves += Math.abs(rightBalance);

        return node.val
            + leftBalance
            + rightBalance
            - 1;
    }

    public int distributeCoins(TreeNode root) {
        moves = 0;
        dfs(root);
        return moves;
    }
}

```

Practice:

- LC 979 — Distribute Coins in Binary Tree
- LC 1339 — Maximum Product of Splitted Binary Tree
- LC 1530 — Number of Good Leaf Nodes Pairs
- LC 2477 — Minimum Fuel Cost to Report to the Capital

---

### Common Form 7: Rerooting DP

Find an answer for every node as though that node were the root.

#### How it works

Use two DFS passes:

```plain text
First pass:
Calculate subtree sizes and the answer for one root.

Second pass:
Move the root across each edge and update the answer efficiently.

```

For Sum of Distances in Tree, suppose the root moves from `node` to its child `next`.
Nodes inside `next`’s subtree become one unit closer:

```plain text
- subtreeSize[next]

```

All other nodes become one unit farther:

```plain text
+ (n - subtreeSize[next])

```

Therefore:

```plain text
answer[next]
=
answer[node]
- subtreeSize[next]
+ (n - subtreeSize[next])

```

Simplified:

```plain text
answer[next]
=
answer[node]
+ n
- 2 × subtreeSize[next]

```

#### Code

```java
class Solution {
    private List<List<Integer>> graph;
    private int[] subtreeSize;
    private int[] answer;
    private int n;

    private void calculateSubtrees(
        int node,
        int parent,
        int depth
    ) {
        subtreeSize[node] = 1;
        answer[0] += depth;

        for (int next : graph.get(node)) {
            if (next == parent) {
                continue;
            }

            calculateSubtrees(next, node, depth + 1);
            subtreeSize[node] += subtreeSize[next];
        }
    }

    private void reroot(int node, int parent) {
        for (int next : graph.get(node)) {
            if (next == parent) {
                continue;
            }

            answer[next] =
                answer[node]
                + n
                - 2 * subtreeSize[next];

            reroot(next, node);
        }
    }

    public int[] sumOfDistancesInTree(
        int n,
        int[][] edges
    ) {
        this.n = n;
        graph = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }

        for (int[] edge : edges) {
            graph.get(edge[0]).add(edge[1]);
            graph.get(edge[1]).add(edge[0]);
        }

        subtreeSize = new int[n];
        answer = new int[n];

        calculateSubtrees(0, -1, 0);
        reroot(0, -1);

        return answer;
    }
}

```

Practice:

- LC 834 — Sum of Distances in Tree
- LC 2581 — Count Number of Possible Root Nodes
- Tree Distances I — CSES
- Tree Distances II — CSES

---

### Common Form 8: Tree Knapsack

Select a limited number of elements from different subtrees.

#### How it works

Every child subtree provides multiple possibilities:

```plain text
childDP[count]
= best value obtained by selecting count nodes
  from that child's subtree

```

The parent merges one child at a time, similar to combining knapsack groups.

#### State

```plain text
dp[node][count]
= maximum value obtained by selecting count nodes
  from node's subtree

```

#### Child-merging transition

Suppose:

```plain text
current[selected]

```

contains the result after processing some children.

For the next child:

```plain text
childDP[takenFromChild]

```

Combine them:

```plain text
next[selected + takenFromChild]
=
max(
    next[selected + takenFromChild],
    current[selected] + childDP[takenFromChild]
)

```

#### Generic code structure

```java
private int[] dfs(
    int node,
    int parent,
    List<List<Integer>> graph,
    int[] values,
    int limit
) {
    int[] current = new int[limit + 1];
    Arrays.fill(current, Integer.MIN_VALUE);

    current[0] = 0;

    if (limit >= 1) {
        current[1] = values[node];
    }

    int processedSize = 1;

    for (int child : graph.get(node)) {
        if (child == parent) {
            continue;
        }

        int[] childDP =
            dfs(child, node, graph, values, limit);

        int[] next = new int[limit + 1];
        Arrays.fill(next, Integer.MIN_VALUE);

        for (int selected = 0;
             selected <= Math.min(processedSize, limit);
             selected++) {

            if (current[selected] == Integer.MIN_VALUE) {
                continue;
            }

            for (int childCount = 0;
                 selected + childCount <= limit;
                 childCount++) {

                if (childDP[childCount]
                        == Integer.MIN_VALUE) {
                    continue;
                }

                next[selected + childCount] =
                    Math.max(
                        next[selected + childCount],
                        current[selected]
                            + childDP[childCount]
                    );
            }
        }

        current = next;
        processedSize =
            Math.min(limit, processedSize + limit);
    }

    return current;
}

```

Tree Knapsack is less common in standard LeetCode problems but is important for advanced tree contests and interviews.

Practice:

- Tree Knapsack — standard competitive-programming pattern
- Maximum-weight connected subtree with a node limit
- Select exactly `k` nodes from a hierarchy
- Course-selection dependency problems

---

### Common Form 9: Count Configurations on a Tree

Count the number of valid ways to assign states to tree nodes.

#### How it works

Calculate the number of possibilities for each possible state of the current node. Child subtrees are independent after the current node’s state is fixed, so their counts are multiplied.
Suppose adjacent nodes cannot both be selected.

#### State

```plain text
selected[node]
= number of valid configurations when node is selected

skipped[node]
= number of valid configurations when node is skipped

```

#### Transition

If the current node is selected, every child must be skipped:

```plain text
selected[node]
=
product(skipped[child])

```

If the current node is skipped, each child may be selected or skipped:

```plain text
skipped[node]
=
product(
    selected[child] + skipped[child]
)

```

#### Code

```java
private static final long MOD = 1_000_000_007L;

private long[] dfs(
    int node,
    int parent,
    List<List<Integer>> graph
) {
    long selected = 1;
    long skipped = 1;

    for (int child : graph.get(node)) {
        if (child == parent) {
            continue;
        }

        long[] childState =
            dfs(child, node, graph);

        selected =
            selected * childState[1] % MOD;

        skipped =
            skipped
            * ((childState[0] + childState[1]) % MOD)
            % MOD;
    }

    return new long[]{selected, skipped};
}

```

Final answer:

```java
long[] rootState = dfs(0, -1, graph);

long answer =
    (rootState[0] + rootState[1]) % MOD;

```

Practice:

- Independent Set — AtCoder DP Contest
- Count valid colorings of a tree
- Count vertex selections under adjacency restrictions

---

## 12. Answer Reconstruction

If the problem asks which nodes were selected, store or recompute the choice made at each state.
Consider take-or-skip Tree DP.

After calculating:

```plain text
take[node]
skip[node]

```

start from the root’s better state.

### Reconstruction rules

If the current node is selected:

```plain text
Every child must be skipped.

```

If the current node is skipped:

```plain text
Each child selects whichever of its take/skip states is better.

```

#### Code structure

```java
private void reconstruct(
    TreeNode node,
    boolean takeNode,
    Map<TreeNode, int[]> dp,
    List<Integer> selected
) {
    if (node == null) {
        return;
    }

    if (takeNode) {
        selected.add(node.val);

        reconstruct(node.left, false, dp, selected);
        reconstruct(node.right, false, dp, selected);
        return;
    }

    if (node.left != null) {
        int[] left = dp.get(node.left);

        reconstruct(
            node.left,
            left[0] > left[1],
            dp,
            selected
        );
    }

    if (node.right != null) {
        int[] right = dp.get(node.right);

        reconstruct(
            node.right,
            right[0] > right[1],
            dp,
            selected
        );
    }
}

```

#### Reconstruction requirement

If child states were returned and discarded during recursion, they must be:

- Stored in a map or array, or
- Recalculated during reconstruction

Storing them avoids repeated work.

---

## 13. Quick Interview Checklist

Before coding, ask:

1. What exactly should `dfs(node)` return?
2. Does the parent need one value or multiple states?
3. What should a null node return?
4. Is the tree binary or an undirected adjacency-list tree?
5. How will I avoid revisiting the parent?
6. Does the current node depend only on its children?
7. Do I need information from outside the subtree?
8. Is a second rerooting pass required?
9. Is the returned answer different from the global answer?
10. Can a complete path use two child branches?
11. Can the parent extend both branches or only one?
12. Does selecting the current node restrict its children?
13. What does every index in the returned state represent?
14. Are child subtrees independent after fixing the parent state?
15. Am I minimizing, maximizing, or counting configurations?
16. Do I need an explicit memo table?
17. Could recursion overflow on a skewed tree?
18. Do I need to reconstruct the chosen nodes or edges?

---

## 14. Common Mistakes

- Writing DFS without defining its return contract.
- Returning the complete global answer to the parent when the parent can extend only one branch.
- Forgetting to update the global answer.
- Using both child branches in a value returned upward.
- Confusing node count with edge count.
- Using `0` instead of `-1` for a null edge-length state.
- Exploring the parent again in an undirected tree.
- Using a visited array unnecessarily when tracking the parent is sufficient.
- Treating an arbitrary graph as a tree.
- Calculating only the selected state and forgetting the skipped state.
- Assuming a skipped parent forces its child to be selected.
- Forgetting that different children choose their states independently.
- Mixing the meanings of indexes in a returned array.
- Modifying a shared mutable state without backtracking.
- Adding a memo map when every subtree is already visited once.
- Failing to use postorder when the parent depends on children.
- Attempting rerooting without first calculating subtree sizes.
- Using the rerooting transition in the wrong direction.
- Counting the same node twice when combining child paths.
- Ignoring negative child contributions in maximum-path problems.
- Returning an incorrect semantic state for a null child.
- Losing state values required for reconstruction.
- Causing stack overflow on a long chain-shaped tree.

---

## 15. Complexity Analysis

Let:

```plain text
n = number of nodes

```

### Standard Tree DP

Every node is visited once.

```plain text
Time: O(n)

```

For a tree:

```plain text
edges = n - 1

```

Every edge is processed a constant number of times.

### Recursive space

```plain text
O(h)

```

where `h` is the tree height.

Balanced tree:

```plain text
O(log n)

```

Skewed tree:

```plain text
O(n)

```

### Stored DP arrays

If each node stores a constant number of states:

```plain text
Space: O(n)

```

### Rerooting DP

Two complete traversals:

```plain text
Time: O(n)
Space: O(n)

```

### Tree Knapsack

If up to `k` selections are tracked for every node:

```plain text
Space: O(nk)

```

A straightforward child merge may require:

```plain text
Time: O(nk²)

```

The exact complexity depends on subtree sizes and merge limits.

### State count rule

```plain text
Total time
=
number of nodes
× states per node
× transition cost per state

```

---

## 16. Practice Progression

### Tree DP foundations

1. LC 104 — Maximum Depth of Binary Tree
2. LC 110 — Balanced Binary Tree
3. LC 543 — Diameter of Binary Tree
4. LC 687 — Longest Univalue Path

### Path-based Tree DP

1. LC 124 — Binary Tree Maximum Path Sum
2. LC 1372 — Longest ZigZag Path in a Binary Tree
3. LC 2246 — Longest Path With Different Adjacent Characters

### Take-or-skip states

1. LC 337 — House Robber III
2. Maximum Independent Set on a Tree
3. Independent Set — AtCoder DP Contest

### Subtree contribution problems

1. LC 979 — Distribute Coins in Binary Tree
2. LC 1339 — Maximum Product of Splitted Binary Tree
3. LC 2477 — Minimum Fuel Cost to Report to the Capital

### Multiple-state problems

1. LC 968 — Binary Tree Cameras
2. LC 968 — solve again using explicit three-state DP
3. Minimum Vertex Cover on a Tree

### Rerooting DP

1. LC 834 — Sum of Distances in Tree
2. LC 2581 — Count Number of Possible Root Nodes
3. Tree Distances I — CSES
4. Tree Distances II — CSES

### Advanced

1. Tree Knapsack
2. LC 1617 — Count Subtrees With Max Distance Between Cities
3. LC 2538 — Difference Between Maximum and Minimum Price Sum

---

## 17. Final Reusable Mental Model

```plain text
1. Root the tree.
2. Define exactly what dfs(node) returns.
3. Let every child solve its own subtree.
4. Combine child states at the current node.
5. Separate the value returned upward from the complete global answer.
6. Return multiple states when the parent's decision changes the child's options.
7. Use postorder when children must be solved first.
8. Use a second preorder pass when information must come from outside the subtree.
9. Store decisions only when reconstruction is required.

```

The shortest memory rule is:

> Every subtree returns a compact summary of everything its parent needs to make the optimal decision.

