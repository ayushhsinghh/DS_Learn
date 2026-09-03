Union-Find, also called Disjoint Set Union or DSU, maintains a collection of non-overlapping connected groups.
It efficiently answers two questions:
```plain text
Find:
Which connected group does this node belong to?

Union:
Combine the groups containing two nodes.
```
Example:
```plain text
0 — 1     2 — 3
```
Initially:
```plain text
Component A: {0, 1}
Component B: {2, 3}
```
After adding edge:
```plain text
1 — 2
```
Union-Find merges them:
```plain text
Component: {0, 1, 2, 3}
```
---
## Core Mental Model
> Every connected component chooses one representative node called its root.
Nodes in the same component have the same root:
```plain text
find(0) == find(1)
→ 0 and 1 are connected

find(0) != find(3)
→ 0 and 3 are in different components
```
When an edge connects two components:
```plain text
union(0, 3)
```
one component root is attached to the other.
---
## When to Use Union-Find
Look for these signals:
- Edges are being added over time.
- You repeatedly need to determine whether two nodes are connected.
- You need to merge groups.
- You need to count connected components.
- You need to detect whether an edge creates a cycle.
- You need to group equivalent items.
- The problem contains relationships such as “belongs to the same group.”
- Edges are processed in a particular sorted order.
- Connectivity changes through additions, not arbitrary deletions.
### Most important recognition question
> Am I repeatedly connecting two items and asking whether they already belong to the same connected group?
If yes, Union-Find is likely appropriate.
---
## Union-Find State
The basic structure contains:
```java
int[] parent;
int[] size;
```
## Parent array
```java
parent[x]
```
stores the next node on the path toward the representative root.
A root points to itself:
```java
parent[root] == root
```
## Size array
```java
size[root]
```
stores the number of nodes in the component represented by `root`.
The size value is meaningful only for representative roots.
---
## Initial State
Initially, every node belongs to its own component:
```plain text
{0} {1} {2} {3} {4}
```
Therefore:
```java
for (int node = 0; node < n; node++) {
    parent[node] = node;
    size[node] = 1;
}
```
Initial number of components:
```plain text
n
```
---
## Basic Union-Find Implementation
```java
class UnionFind {
    private int[] parent;
    private int[] size;
    private int components;

    UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        components = n;

        for (int node = 0; node < n; node++) {
            parent[node] = node;
            size[node] = 1;
        }
    }

    int find(int node) {
        if (parent[node] != node) {
            parent[node] = find(parent[node]);
        }

        return parent[node];
    }

    boolean union(int first, int second) {
        int rootFirst = find(first);
        int rootSecond = find(second);

        if (rootFirst == rootSecond) {
            return false;
        }

        if (size[rootFirst] < size[rootSecond]) {
            int temporary = rootFirst;
            rootFirst = rootSecond;
            rootSecond = temporary;
        }

        parent[rootSecond] = rootFirst;
        size[rootFirst] += size[rootSecond];
        components--;

        return true;
    }

    boolean connected(int first, int second) {
        return find(first) == find(second);
    }

    int componentSize(int node) {
        return size[find(node)];
    }

    int countComponents() {
        return components;
    }
}
```
---
## The `find` Operation
The `find` operation follows parent links until it reaches a node pointing to itself.
```java
int find(int node) {
    if (parent[node] == node) {
        return node;
    }

    return find(parent[node]);
}
```
Example:
```plain text
4 → 3 → 1 → 1
```
Therefore:
```plain text
find(4) = 1
```
Node `1` is the representative of the component.
---
## Path Compression
Without optimization:
```plain text
4 → 3 → 2 → 1
```
Finding the root of `4` requires following the entire chain.
Path compression directly connects every visited node to the root:
```java
parent[node] = find(parent[node]);
```
After `find(4)`:
```plain text
4 ─┐
3 ─┼→ 1
2 ─┘
```
Future `find` operations become much faster.
### Path-compressed `find`
```java
int find(int node) {
    if (parent[node] != node) {
        parent[node] = find(parent[node]);
    }

    return parent[node];
}
```
### Recursive contract
> `find(node)` returns the representative root of `node` and compresses the path from `node` to that root.
---
## Union by Size
When combining two components, attach the smaller tree under the larger tree.
```java
if (size[rootFirst] < size[rootSecond]) {
    int temporary = rootFirst;
    rootFirst = rootSecond;
    rootSecond = temporary;
}

parent[rootSecond] = rootFirst;
size[rootFirst] += size[rootSecond];
```
This prevents the parent structure from becoming unnecessarily deep.
### Why compare roots?
Incorrect:
```java
if (size[first] < size[second])
```
Correct:
```java
if (size[rootFirst] < size[rootSecond])
```
Only component roots store the current component size.
---
## Union by Rank
Rank approximates the height of the representative tree.
```java
if (rank[rootFirst] < rank[rootSecond]) {
    parent[rootFirst] = rootSecond;
} else if (rank[rootFirst] > rank[rootSecond]) {
    parent[rootSecond] = rootFirst;
} else {
    parent[rootSecond] = rootFirst;
    rank[rootFirst]++;
}
```
Use either:
```plain text
Union by size
or
Union by rank
```
Both work well with path compression. You do not need both simultaneously.
Union by size is often easier because it also gives component sizes.
---
## Understanding `union` Return Value
A useful `union` method returns:
```plain text
true  → two different components were merged
false → nodes were already connected
```
```java
boolean union(int first, int second) {
    int rootFirst = find(first);
    int rootSecond = find(second);

    if (rootFirst == rootSecond) {
        return false;
    }

    // Merge roots.

    return true;
}
```
This directly supports cycle detection and successful-merge counting.
---
## Common Forms
## Common Form 1: Basic Dynamic Connectivity
Edges are added, and we need to determine whether nodes belong to the same connected component.
### How it works
1. Initialize every node as its own component.
2. For every connection, call `union(u, v)`.
3. To answer a connectivity query, compare their roots.
4. Nodes are connected exactly when their roots are equal.
**Memory flow:** `Add connection → Merge representatives → Compare roots`
```java
UnionFind unionFind = new UnionFind(n);

for (int[] edge : edges) {
    unionFind.union(edge[0], edge[1]);
}

boolean connected =
    unionFind.find(source)
        == unionFind.find(destination);
```
Practice:
- LC 1971 — Find if Path Exists in Graph
- LC 323 — Number of Connected Components
- LC 1101 — The Earliest Moment When Everyone Become Friends
- LC 261 — Graph Valid Tree
---
## Common Form 2: Detect a Redundant Edge
In an undirected graph, an edge creates a cycle when its endpoints are already connected.
Before adding:
```plain text
find(u) == find(v)
```
means a path already exists between them.
Adding another edge between the same components creates a cycle.
### How it works
1. Process edges one at a time.
2. Find the roots of both endpoints.
3. If their roots are equal, the edge is redundant.
4. Otherwise, merge their components.
5. Return the edge that failed to merge.
**Memory flow:** `Check roots → Same means cycle → Different means merge`
```java
for (int[] edge : edges) {
    int u = edge[0];
    int v = edge[1];

    if (!unionFind.union(u, v)) {
        return edge;
    }
}
```
### Why this works only directly for undirected cycles
In an undirected graph, existing connectivity between `u` and `v` means another undirected edge closes a cycle.
Directed-cycle detection requires direction-aware logic and generally uses DFS states or topological sorting.
Practice:
- LC 684 — Redundant Connection
- LC 261 — Graph Valid Tree
- LC 685 — Redundant Connection II
---
## Common Form 3: Count Connected Components
Start with:
```plain text
components = n
```
Every successful union combines two components:
```plain text
components--
```
A union between already-connected nodes changes nothing.
### How it works
1. Begin with every node in its own component.
2. Process every edge.
3. Decrease the count after each successful union.
4. Return the final component count.
**Memory flow:** `Start with n groups → Successful union removes one group`
```java
UnionFind unionFind = new UnionFind(n);

for (int[] edge : edges) {
    unionFind.union(edge[0], edge[1]);
}

return unionFind.countComponents();
```
### Alternative calculation
If the Union-Find class does not track component count:
```java
int components = 0;

for (int node = 0; node < n; node++) {
    if (unionFind.find(node) == node) {
        components++;
    }
}
```
Practice:
- LC 323 — Number of Connected Components
- LC 547 — Number of Provinces
- LC 1319 — Number of Operations to Make Network Connected
- LC 2316 — Count Unreachable Pairs of Nodes
---
## Common Form 4: Validate a Tree
An undirected graph with `n` vertices is a valid tree when:
```plain text
It contains exactly n - 1 edges
and
all nodes are connected
```
Equivalently:
```plain text
It has no cycle
and
all nodes form one component
```
### How it works
1. Reject immediately if the edge count is not `n - 1`.
2. Union every edge.
3. If any union fails, a cycle exists.
4. Confirm only one connected component remains.
**Memory flow:** `Check edge count → Reject cycles → Confirm one component`
```java
boolean validTree(int n, int[][] edges) {
    if (edges.length != n - 1) {
        return false;
    }

    UnionFind unionFind = new UnionFind(n);

    for (int[] edge : edges) {
        if (!unionFind.union(edge[0], edge[1])) {
            return false;
        }
    }

    return unionFind.countComponents() == 1;
}
```
### Useful graph fact
For an undirected graph:
```plain text
n nodes + n - 1 edges + connected
→ valid tree
```
Practice:
- LC 261 — Graph Valid Tree
- LC 1319 — Number of Operations to Make Network Connected
---
## Common Form 5: Connect a Network
These problems ask whether separate components can be connected using available or redundant edges.
For `n` nodes, at least:
```plain text
n - 1 edges
```
are required to connect the entire network.
If there are `c` connected components, we need:
```plain text
c - 1 operations
```
to connect them.
### How it works
1. Check whether at least `n - 1` edges exist.
2. Union the endpoints of every edge.
3. Count the remaining connected components.
4. Return `components - 1`.
**Memory flow:** `Merge existing connections → Count groups → Connect groups with c - 1 edges`
```java
if (connections.length < n - 1) {
    return -1;
}

UnionFind unionFind = new UnionFind(n);

for (int[] edge : connections) {
    unionFind.union(edge[0], edge[1]);
}

return unionFind.countComponents() - 1;
```
Practice:
- LC 1319 — Number of Operations to Make Network Connected
- LC 1101 — The Earliest Moment When Everyone Become Friends
---
## Common Form 6: Group Equivalent Items
Sometimes graph nodes are not integers. They may be:
- Email addresses
- Strings
- Accounts
- Variables
- Coordinates
We must assign each unique item an integer ID or union related indices.
### How it works
1. Decide what represents a DSU node.
2. Map each object to an integer index when needed.
3. Union indices belonging to the same group.
4. Find the representative for every item.
5. Group items by their representative.
6. Build the final output from those groups.
**Memory flow:** `Map objects to IDs → Union related items → Group by root`
### Accounts Merge idea
For every account:
```plain text
First email = representative email for that account

Union:
first email with every remaining email
```
After all unions:
```java
Map<Integer, List<String>> groups =
    new HashMap<>();

for (String email : emailToId.keySet()) {
    int root = unionFind.find(emailToId.get(email));

    groups.computeIfAbsent(
        root,
        key -> new ArrayList<>()
    ).add(email);
}
```
Practice:
- LC 721 — Accounts Merge
- LC 839 — Similar String Groups
- LC 1202 — Smallest String With Swaps
- LC 737 — Sentence Similarity II
---
## Common Form 7: Equality and Equivalence Constraints
Equality relationships create connected components.
```plain text
a == b
b == c
```
implies:
```plain text
a == c
```
An inequality creates a contradiction if both variables are already in the same component.
### How it works
1. Process every equality first.
2. Union the variables declared equal.
3. Process every inequality.
4. If unequal variables have the same root, return `false`.
5. Otherwise, all equations are satisfiable.
**Memory flow:** `Merge equal variables → Test inequalities against components`
```java
for (String equation : equations) {
    if (equation.charAt(1) == '=') {
        int first = equation.charAt(0) - 'a';
        int second = equation.charAt(3) - 'a';

        unionFind.union(first, second);
    }
}

for (String equation : equations) {
    if (equation.charAt(1) == '!') {
        int first = equation.charAt(0) - 'a';
        int second = equation.charAt(3) - 'a';

        if (unionFind.connected(first, second)) {
            return false;
        }
    }
}

return true;
```
### Why process equalities first?
An inequality can only be evaluated correctly after all implied equality groups have been formed.
Practice:
- LC 990 — Satisfiability of Equality Equations
- LC 737 — Sentence Similarity II
- LC 1061 — Lexicographically Smallest Equivalent String
---
## Common Form 8: Union-Find on a Grid
A grid can be converted into DSU nodes.
For a grid with:
```plain text
rows × columns
```
convert coordinate `(row, column)` into:
```java
int id = row * columns + column;
```
### How it works
1. Give every relevant cell a unique integer ID.
2. For each cell, inspect its valid neighbors.
3. Union cells belonging to the same region.
4. Count successful merges, component roots, or component sizes.
5. Optionally activate cells dynamically as they appear.
**Memory flow:** `Convert coordinates to IDs → Union neighboring cells → Track regions`
```java
int id(int row, int col, int columns) {
    return row * columns + col;
}
```
```java
int current = row * columns + col;
int neighbor = nextRow * columns + nextCol;

unionFind.union(current, neighbor);
```
### Dynamic island idea
Initially, cells are inactive.
When land is added:
1. Activate the cell.
2. Increment the island count.
3. Union it with active land neighbors.
4. Decrease the island count for every successful union.
Practice:
- LC 200 — Number of Islands
- LC 305 — Number of Islands II
- LC 827 — Making a Large Island
- LC 959 — Regions Cut By Slashes
- LC 947 — Most Stones Removed
---
## Common Form 9: Component Size Problems
Union by size naturally maintains component sizes.
After finding a root:
```java
size[find(node)]
```
gives the number of nodes in that component.
### How it works
1. Union connected nodes.
2. Maintain the size only at representative roots.
3. Find the root of the requested node.
4. Read its component size.
5. Combine component sizes when evaluating possible new connections.
**Memory flow:** `Merge sizes at roots → Query size through representative`
### Making a Large Island idea
For each zero cell:
1. Look at neighboring island roots.
2. Add each distinct component size.
3. Do not count the same root twice.
4. Add one for converting the zero into land.
```java
Set<Integer> neighboringRoots =
    new HashSet<>();

int possibleSize = 1;

for (int[] direction : directions) {
    int root = unionFind.find(neighborId);

    if (neighboringRoots.add(root)) {
        possibleSize += unionFind.componentSize(root);
    }
}
```
### Why use a set?
Two neighboring cells may belong to the same island. Adding both sizes would double-count that component.
Practice:
- LC 827 — Making a Large Island
- LC 952 — Largest Component Size by Common Factor
- LC 2316 — Count Unreachable Pairs of Nodes
---
## Common Form 10: Process Edges in Sorted Order
Some problems ask connectivity questions under changing limits.
Instead of rebuilding the graph for every query:
1. Sort edges by weight.
2. Sort queries by their permitted limit.
3. Add all edges currently allowed by the query.
4. Use Union-Find to answer connectivity.
This is an offline-query technique.
### How it works
1. Sort graph edges by weight.
2. Sort queries by their threshold while preserving original indices.
3. For each query, union every edge satisfying its threshold.
4. Check whether the query endpoints are connected.
5. Store the result at the query’s original index.
**Memory flow:** `Sort events → Add currently valid edges → Answer connectivity`
For a query requiring edge weights smaller than `limit`:
```java
while (edgeIndex < edges.length
        && edges[edgeIndex][2] < limit) {
    unionFind.union(
        edges[edgeIndex][0],
        edges[edgeIndex][1]
    );

    edgeIndex++;
}
```
Practice:
- LC 1697 — Checking Existence of Edge Length Limited Paths
- LC 2421 — Number of Good Paths
- LC 1101 — The Earliest Moment When Everyone Become Friends
- LC 1584 — Min Cost to Connect All Points
---
## Common Form 11: Kruskal’s Algorithm
Kruskal’s algorithm uses Union-Find to build a Minimum Spanning Tree.
It processes edges from smallest to largest weight.
### How it works
1. Sort all edges by weight.
2. Process the cheapest remaining edge.
3. If its endpoints are already connected, skip it because it creates a cycle.
4. Otherwise, union the components and include the edge.
5. Stop after selecting `n - 1` edges.
**Memory flow:** `Sort edges → Add cheapest non-cycling edge → Merge components`
```java
Arrays.sort(
    edges,
    (first, second) ->
        Integer.compare(first[2], second[2])
);

int totalCost = 0;
int edgesUsed = 0;

for (int[] edge : edges) {
    int from = edge[0];
    int to = edge[1];
    int weight = edge[2];

    if (unionFind.union(from, to)) {
        totalCost += weight;
        edgesUsed++;

        if (edgesUsed == n - 1) {
            break;
        }
    }
}
```
Minimum Spanning Trees will be covered as a dedicated graph topic. Here, the important connection is:
> Union-Find lets Kruskal determine whether adding an edge would create a cycle.
Practice:
- LC 1584 — Min Cost to Connect All Points
- LC 1135 — Connecting Cities With Minimum Cost
- LC 1489 — Critical and Pseudo-Critical Edges in MST
---
## Common Form 12: Weighted Union-Find
Normal Union-Find tracks only whether nodes are connected.
Weighted Union-Find also tracks a relationship between a node and its parent.
Example:
```plain text
a / b = 2
b / c = 3
```
Then:
```plain text
a / c = 6
```
The structure stores ratios while merging components.
### How it works
1. Assign every variable a parent.
2. Store the ratio between each node and its parent.
3. During `find`, compress the path and multiply ratios.
4. During `union`, connect roots while preserving the given relationship.
5. If two variables have the same root, derive their ratio from stored weights.
**Memory flow:** `Find representative → Accumulate relationship → Merge roots consistently`
This is an advanced DSU extension. DFS or BFS is usually simpler for one-time Evaluate Division queries, but weighted Union-Find is useful for repeated dynamic relationships.
Practice:
- LC 399 — Evaluate Division
- LC 2307 — Check for Contradictions in Equations
---
## Union-Find versus DFS/BFS
Both can find connected components.
## Prefer DFS or BFS when
- The complete graph is already built.
- You need to traverse actual neighbors.
- You need paths or traversal order.
- Connectivity is queried only once.
- Edges may need to be explored structurally.
## Prefer Union-Find when
- Edges arrive incrementally.
- You repeatedly merge components.
- You repeatedly ask whether two nodes are connected.
- You need cycle detection while adding edges.
- You process edges in sorted order.
- You do not need the actual path.
### Important limitation
Union-Find can answer:
```plain text
Are u and v connected?
```
It does not directly answer:
```plain text
What is the path from u to v?
```
Use BFS or DFS when the actual path is needed.
---
## Union-Find versus Directed Graph Algorithms
Standard Union-Find ignores edge direction.
It is naturally suited to undirected connectivity.
It cannot generally replace:
- Directed-cycle detection
- Topological sorting
- Reachability in directed graphs
- Strongly connected component algorithms
For directed dependencies, use:
```plain text
DFS states
Kahn’s algorithm
Kosaraju
Tarjan
```
---
## Counting Successful and Failed Unions
For every edge:
```java
if (unionFind.union(u, v)) {
    // Two components merged.
} else {
    // Edge connects nodes already in one component.
}
```
This distinction can count:
```plain text
Successful unions
Redundant edges
Remaining components
Edges selected by Kruskal
```
If `m` successful unions occur from `n` initial nodes:
```plain text
Remaining components = n - m
```
---
## Indexing Considerations
Some problems label nodes:
```plain text
0 to n - 1
```
Use arrays of size:
```java
n
```
Other problems label nodes:
```plain text
1 to n
```
Use arrays of size:
```java
n + 1
```
Check the labels before initializing the DSU.
A wrong array size is one of the most common implementation bugs.
---
## Quick Interview Checklist
1. What represents one DSU node?
2. Are nodes zero-indexed or one-indexed?
3. What does one connected component represent?
4. Are the relationships undirected?
5. Do I need connectivity or the actual path?
6. Can I map non-integer objects to integer IDs?
7. Is every node initially active?
8. What should `find(node)` return?
9. Did I implement path compression?
10. Am I unioning roots rather than original nodes?
11. Am I using union by size or rank?
12. Does `union` return whether a merge occurred?
13. Should successful unions decrease the component count?
14. Does an already-connected edge represent a cycle?
15. Do I need component sizes?
16. Could neighboring nodes belong to the same component?
17. Do I need a set to avoid double-counting roots?
18. Should edges or queries be sorted?
19. Are constraints processed in multiple phases?
20. Is this actually a directed-graph problem where DSU is insufficient?
---
## Common Mistakes
- Unioning original nodes instead of their roots.
- Forgetting path compression.
- Updating the size of a non-root node.
- Comparing `parent[u] == parent[v]` instead of comparing `find(u)` and `find(v)`.
- Decreasing the component count when the nodes were already connected.
- Assuming a failed union is always irrelevant when it may indicate a cycle.
- Using DSU for directed-cycle detection.
- Expecting DSU to reconstruct an actual path.
- Initializing arrays with the wrong indexing scheme.
- Forgetting nodes that do not appear in any edge.
- Treating inactive grid cells as existing components.
- Double-counting the same component through multiple neighboring cells.
- Processing inequalities before all equalities have been merged.
- Forgetting to preserve original query indices after sorting.
- Using subtraction inside a comparator and risking integer overflow.
- Assuming `size[node]` is valid without first finding its root.
- Claiming every operation is strictly `O(1)`.
---
## Complexity Analysis
Let:
```plain text
n = number of nodes
m = number of operations
```
With:
- Path compression
- Union by size or rank
The amortized cost of each operation is:
```plain text
O(α(n))
```
Here, `α(n)` is the inverse Ackermann function, which grows extremely slowly.
For all practical input sizes:
```plain text
α(n) is smaller than 5
```
Therefore, Union-Find operations are often described as nearly constant time.
## Initialization
```plain text
Time:  O(n)
Space: O(n)
```
## `find`
```plain text
Amortized: O(α(n))
```
## `union`
It performs a constant number of `find` operations:
```plain text
Amortized: O(α(n))
```
## Processing all edges
```plain text
Time: O(E × α(V))
```
This is effectively close to:
```plain text
O(E)
```
## Sorted-edge problems
Sorting dominates:
```plain text
Sorting:    O(E log E)
DSU work:   O(E × α(V))

Total:      O(E log E)
```
---
## Final Reusable Model
```plain text
Initialize every node as its own component
→ Find representative roots
→ If roots differ, merge them
→ If roots match, they are already connected
```
Use:
```plain text
Path compression
+
Union by size or rank
```
The central template is:
```java
int rootFirst = find(first);
int rootSecond = find(second);

if (rootFirst == rootSecond) {
    // Already connected.
} else {
    // Merge the two components.
}
```
The most important interview question is:
> “What does one connected component represent in this problem, and what event should merge two components?”
