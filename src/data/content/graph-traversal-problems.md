A graph represents objects and the connections between them.
```plain text
Objects      → vertices or nodes
Connections  → edges
```
Example:
```plain text
0 ─── 1
│     │
│     │
2 ─── 3
```
The graph can be represented as:
```plain text
0 → [1, 2]
1 → [0, 3]
2 → [0, 3]
3 → [1, 2]
```
Unlike a tree:
- A graph may contain cycles.
- A node may have multiple incoming connections.
- The graph may be disconnected.
- There may be several paths between two nodes.
- There may not be a single root.

Because of these differences, graph traversal normally requires a `visited` structure.
---
## Core Mental Model
> Start from a node, process it, and discover its unvisited neighbors.

The two fundamental graph traversals are:
```plain text
DFS → Follow one path deeply before returning
BFS → Explore all nearby nodes before moving farther
```
Both can visit every reachable node.
The major difference is the order in which they explore nodes.
---
## DFS versus BFS
## Depth-First Search
DFS follows one path as far as possible.
```plain text
Start
→ Neighbor
→ Neighbor's neighbor
→ Continue deeply
→ Backtrack
```
DFS uses:
```plain text
Recursion
or
Explicit stack
```
## Breadth-First Search
BFS explores nodes by distance from the starting node.
```plain text
Distance 0
→ Distance 1
→ Distance 2
→ Distance 3
```
BFS uses:
```plain text
Queue
```
## Decision guide
```plain text
Need to visit all reachable nodes
→ DFS or BFS

Need the shortest path in an unweighted graph
→ BFS

Need nodes level by level
→ BFS

Need recursive exploration or backtracking
→ DFS

Need to analyze complete connected regions
→ DFS or BFS

Need to reconstruct the shortest path
→ BFS with a parent map

Need to detect structure after exploring descendants
→ DFS

Concerned about deep recursion
→ Iterative DFS or BFS
```
---
## Graph Terminology
## Vertex
An individual graph node.
```plain text
0, 1, 2, 3
```
## Edge
A connection between two vertices.
```plain text
0 — 1
```
## Directed edge
The connection has one direction:
```plain text
0 → 1
```
This does not automatically mean:
```plain text
1 → 0
```
## Undirected edge
The connection works in both directions:
```plain text
0 — 1
```
Represent it using:
```plain text
0 → 1
1 → 0
```
## Path
A sequence of connected vertices:
```plain text
0 → 1 → 3
```
## Cycle
A path that returns to a previously visited node:
```plain text
0 → 1 → 2 → 0
```
## Connected component
A group of vertices that can reach one another.
```plain text
0 — 1       3 — 4

Component 1  Component 2
```
## Degree
For an undirected graph:
```plain text
Degree of node = number of connected edges
```
For a directed graph:
```plain text
Indegree  = number of incoming edges
Outdegree = number of outgoing edges
```
---
## Graph Representations
## Adjacency List
Store every node’s neighbors.
```java
List<List<Integer>> graph =
    new ArrayList<>();

for (int i = 0; i < n; i++) {
    graph.add(new ArrayList<>());
}
```
For an undirected edge:
```java
graph.get(u).add(v);
graph.get(v).add(u);
```
For a directed edge:
```java
graph.get(u).add(v);
```
### Complexity
```plain text
Space: O(V + E)
```
This is usually the preferred representation for interview problems.
---
## Adjacency Matrix
```java
int[][] graph = new int[n][n];
```
For an edge:
```java
graph[u][v] = 1;
```
For an undirected edge:
```java
graph[u][v] = 1;
graph[v][u] = 1;
```
### Complexity
```plain text
Space: O(V²)
```
Use it when:
- The graph is dense.
- Constant-time edge lookup is important.
- The number of vertices is small.
- An all-pairs algorithm requires a matrix.
---
## Map-Based Adjacency List
Useful when nodes are strings or arbitrary values:
```java
Map<String, List<String>> graph =
    new HashMap<>();
```
```java
graph.computeIfAbsent(from, key -> new ArrayList<>())
     .add(to);
```
Used in problems such as:
- Evaluate Division
- Word transformations
- Currency conversion
- Account relationships
---
## Building the Graph Correctly
For:
```java
int[][] edges
```
## Undirected graph
```java
for (int[] edge : edges) {
    int u = edge[0];
    int v = edge[1];

    graph.get(u).add(v);
    graph.get(v).add(u);
}
```
## Directed graph
```java
for (int[] edge : edges) {
    int from = edge[0];
    int to = edge[1];

    graph.get(from).add(to);
}
```
### Critical question
> Does the relationship work in one direction or both?

Many graph solutions fail because the graph was constructed in the wrong direction.
---
## Why We Need `visited`
Consider:
```plain text
0 — 1
```
An undirected graph stores:
```plain text
0 → 1
1 → 0
```
Without `visited`:
```plain text
0 visits 1
1 visits 0
0 visits 1
...
```
Traversal never ends.

The visited structure ensures:
> Every node is processed at most once.

For integer nodes:
```java
boolean[] visited = new boolean[n];
```
For string or object nodes:
```java
Set<String> visited = new HashSet<>();
```
---
## When to Mark a Node Visited
## DFS
Mark the node when entering it:
```java
visited[node] = true;
```
## BFS
Mark the node when adding it to the queue:
```java
visited[next] = true;
queue.offer(next);
```
Do not wait until removing it from the queue.
### Why?
Two nodes might discover the same neighbor:
```plain text
  A
 / \
B   C
 \ /
  D
```
If `D` is marked only when removed:
```plain text
B adds D
C also adds D
```
Now `D` appears in the queue twice.

Correct:
```java
if (!visited[next]) {
    visited[next] = true;
    queue.offer(next);
}
```
---
## Common Forms
## Common Form 1: Recursive DFS Traversal
Recursive DFS explores one neighbor completely before trying the next neighbor.
### How it works
1. Mark the current node visited.
2. Process the current node.
3. Examine each neighbor.
4. Recursively visit every unvisited neighbor.
5. Return when all neighbors have been explored.

**Memory flow:** `Enter node → Mark visited → Explore neighbors → Return`
```java
void dfs(
        int node,
        List<List<Integer>> graph,
        boolean[] visited
) {
    visited[node] = true;

    // Process node here.

    for (int neighbor : graph.get(node)) {
        if (!visited[neighbor]) {
            dfs(neighbor, graph, visited);
        }
    }
}
```
### Recursive contract
> `dfs(node)` visits every unvisited node reachable from `node`.

Practice:
- LC 1971 — Find if Path Exists in Graph
- LC 841 — Keys and Rooms
- LC 547 — Number of Provinces
- LC 1319 — Number of Operations to Make Network Connected
---
## Common Form 2: Iterative DFS
Iterative DFS replaces the recursive call stack with an explicit stack.
### How it works
1. Push the starting node.
2. Mark it visited.
3. Pop one node.
4. Process it.
5. Push its unvisited neighbors.
6. Continue until the stack is empty.

**Memory flow:** `Push start → Pop node → Push unvisited neighbors`
```java
void dfs(
        int start,
        List<List<Integer>> graph
) {
    boolean[] visited =
        new boolean[graph.size()];

    Deque<Integer> stack = new ArrayDeque<>();

    stack.push(start);
    visited[start] = true;

    while (!stack.isEmpty()) {
        int node = stack.pop();

        // Process node here.

        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                stack.push(neighbor);
            }
        }
    }
}
```
### When iterative DFS is useful
- The graph may be too deep for recursion.
- Stack overflow is a concern.
- You want explicit control over traversal order.
- The language has a limited call stack.

Practice:
- LC 1971 — Find if Path Exists in Graph
- LC 841 — Keys and Rooms
- LC 133 — Clone Graph
---
## Common Form 3: Basic BFS Traversal
BFS explores all nodes one edge away before nodes two edges away.
### How it works
1. Add the starting node to the queue.
2. Mark it visited immediately.
3. Remove the front node.
4. Process it.
5. Add every unvisited neighbor.
6. Continue until the queue is empty.

**Memory flow:** `Offer start → Poll node → Offer unvisited neighbors`
```java
void bfs(
        int start,
        List<List<Integer>> graph
) {
    boolean[] visited =
        new boolean[graph.size()];

    Deque<Integer> queue = new ArrayDeque<>();

    queue.offer(start);
    visited[start] = true;

    while (!queue.isEmpty()) {
        int node = queue.poll();

        // Process node here.

        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.offer(neighbor);
            }
        }
    }
}
```
### Queue invariant
> Every node currently in the queue has been discovered but not yet processed.

Practice:
- LC 1971 — Find if Path Exists in Graph
- LC 841 — Keys and Rooms
- LC 1319 — Number of Operations to Make Network Connected
---
## Common Form 4: Reachability and Path Existence
These problems ask whether one node can reach another.
You do not need to traverse the rest of the graph after finding the target.
### How it works
1. Start DFS or BFS from the source.
2. Mark nodes visited as they are discovered.
3. Explore reachable neighbors.
4. Return immediately when the destination is found.
5. Return `false` if traversal finishes without finding it.

**Memory flow:** `Start from source → Explore reachable nodes → Stop at destination`
### BFS template
```java
boolean hasPath(
        int source,
        int destination,
        List<List<Integer>> graph
) {
    boolean[] visited =
        new boolean[graph.size()];

    Deque<Integer> queue = new ArrayDeque<>();

    queue.offer(source);
    visited[source] = true;

    while (!queue.isEmpty()) {
        int node = queue.poll();

        if (node == destination) {
            return true;
        }

        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.offer(neighbor);
            }
        }
    }

    return false;
}
```
### DFS template
```java
boolean hasPath(
        int node,
        int destination,
        List<List<Integer>> graph,
        boolean[] visited
) {
    if (node == destination) {
        return true;
    }

    visited[node] = true;

    for (int neighbor : graph.get(node)) {
        if (!visited[neighbor]
                && hasPath(
                    neighbor,
                    destination,
                    graph,
                    visited
                )) {
            return true;
        }
    }

    return false;
}
```
Practice:
- LC 1971 — Find if Path Exists in Graph
- LC 841 — Keys and Rooms
- LC 1466 — Reorder Routes to Make All Paths Lead to Zero
---
## Common Form 5: Connected Components
One DFS or BFS visits only the component containing its starting node.
To process the complete graph, start another traversal from every still-unvisited node.
### How it works
1. Iterate through all vertices.
2. If a vertex has already been visited, skip it.
3. Otherwise, a new connected component has been found.
4. Increment the component count.
5. Traverse from that node to mark its entire component.

**Memory flow:** `Find unvisited node → Count component → Mark complete component`
```java
int countComponents(
        int n,
        List<List<Integer>> graph
) {
    boolean[] visited = new boolean[n];
    int components = 0;

    for (int node = 0; node < n; node++) {
        if (!visited[node]) {
            components++;
            dfs(node, graph, visited);
        }
    }

    return components;
}
```
### Important principle
```plain text
One traversal call
= one complete connected component
```
Practice:
- LC 547 — Number of Provinces
- LC 323 — Number of Connected Components
- LC 1319 — Number of Operations to Make Network Connected
- LC 2316 — Count Unreachable Pairs of Nodes
---
## Common Form 6: Component Size
Sometimes the question needs the number of nodes in every connected component.
### How it works
1. Start traversal from an unvisited node.
2. Count the current node.
3. Recursively count every unvisited neighbor.
4. Return the total size to the caller.
5. Use component sizes to calculate the final answer.

**Memory flow:** `Count current node → Add reachable component sizes → Return total`
```java
int componentSize(
        int node,
        List<List<Integer>> graph,
        boolean[] visited
) {
    visited[node] = true;

    int size = 1;

    for (int neighbor : graph.get(node)) {
        if (!visited[neighbor]) {
            size += componentSize(
                neighbor,
                graph,
                visited
            );
        }
    }

    return size;
}
```
### Example use: unreachable pairs
If previously processed components contain `seen` nodes and the new component contains `size` nodes:
```java
answer += (long) seen * size;
seen += size;
```
This counts pairs containing one node from the new component and one from an earlier component.

Practice:
- LC 2316 — Count Unreachable Pairs of Nodes
- LC 695 — Max Area of Island
- LC 1020 — Number of Enclaves
- LC 1905 — Count Sub Islands
---
## Common Form 7: Unweighted Shortest Path
In an unweighted graph, BFS finds the path using the fewest edges.
### Why BFS works
BFS processes nodes in distance order:
```plain text
Source           → distance 0
Source neighbors → distance 1
Their neighbors  → distance 2
```
The first time a node is discovered, BFS has reached it using the minimum number of edges.
### How it works
1. Set the source distance to `0`.
2. Add the source to the queue.
3. For every unvisited neighbor, set:
	`distance[neighbor] = distance[node] + 1`.
4. Add the neighbor to the queue.
5. Stop when the destination is reached or traversal finishes.

**Memory flow:** `Process distance d → Discover nodes at distance d + 1`
```java
int shortestPath(
        int source,
        int destination,
        List<List<Integer>> graph
) {
    int[] distance = new int[graph.size()];
    Arrays.fill(distance, -1);

    Deque<Integer> queue = new ArrayDeque<>();

    queue.offer(source);
    distance[source] = 0;

    while (!queue.isEmpty()) {
        int node = queue.poll();

        if (node == destination) {
            return distance[node];
        }

        for (int neighbor : graph.get(node)) {
            if (distance[neighbor] == -1) {
                distance[neighbor] =
                    distance[node] + 1;

                queue.offer(neighbor);
            }
        }
    }

    return -1;
}
```
Here, `distance[neighbor] == -1` also acts as the visited check.

Practice:
- LC 752 — Open the Lock
- LC 127 — Word Ladder
- LC 433 — Minimum Genetic Mutation
- LC 1091 — Shortest Path in Binary Matrix
- LC 815 — Bus Routes
---
## Common Form 8: Level-Based BFS
Use this when the answer changes once per BFS layer.

Examples:
- Number of transformations
- Number of minutes
- Distance from the source
- Nodes at exactly distance `K`
### How it works
1. Record the queue’s current size.
2. Process exactly that many nodes.
3. Add their undiscovered neighbors.
4. After the level finishes, increase distance or time.
5. The newly added nodes form the next level.

**Memory flow:** `Capture level size → Process current layer → Increment distance`
```java
int distance = 0;

while (!queue.isEmpty()) {
    int size = queue.size();

    for (int i = 0; i < size; i++) {
        int node = queue.poll();

        // Process current-level node.

        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.offer(neighbor);
            }
        }
    }

    distance++;
}
```
### Why capture `size` first?
The queue changes while processing the level.
Without capturing its original size, nodes from the next level could be processed in the current level.

Practice:
- LC 752 — Open the Lock
- LC 127 — Word Ladder
- LC 863 — All Nodes Distance K in Binary Tree
- LC 994 — Rotting Oranges
---
## Common Form 9: Multi-Source BFS
Normal BFS starts from one source.
Multi-source BFS starts from every source simultaneously.

Example:
```plain text
Several infected nodes spread at the same time.
```
### How it works
1. Add every initial source to the queue.
2. Mark every source visited or give it distance `0`.
3. Run ordinary BFS.
4. Each BFS level represents simultaneous expansion from all sources.
5. Every node is reached by its nearest source.

**Memory flow:** `Add all sources → Expand together → Record nearest distance`
```java
Deque<Integer> queue = new ArrayDeque<>();
int[] distance = new int[n];

Arrays.fill(distance, -1);

for (int source : sources) {
    queue.offer(source);
    distance[source] = 0;
}

while (!queue.isEmpty()) {
    int node = queue.poll();

    for (int neighbor : graph.get(node)) {
        if (distance[neighbor] == -1) {
            distance[neighbor] =
                distance[node] + 1;

            queue.offer(neighbor);
        }
    }
}
```
### Why not run BFS separately from every source?
Separate BFS executions may cost:
```plain text
O(number of sources × (V + E))
```
A single multi-source BFS costs:
```plain text
O(V + E)
```
Practice:
- LC 994 — Rotting Oranges
- LC 542 — 01 Matrix
- LC 1162 — As Far from Land as Possible
- LC 1765 — Map of Highest Peak
---
## Common Form 10: Clone a Graph
Cloning requires creating exactly one new node for each original node while preserving connections.

A visited boolean is insufficient because we must also remember:
```plain text
original node → cloned node
```
### How it works
1. Create a clone for the starting node.
2. Store it in a map.
3. Traverse each original neighbor.
4. If a neighbor has not been cloned, recursively clone it.
5. Connect the current clone to the neighbor’s clone.
6. Return the clone associated with the current node.

**Memory flow:** `Map original to clone → Clone neighbors → Connect clones`
```java
Node cloneGraph(Node node) {
    if (node == null) {
        return null;
    }

    Map<Node, Node> clones = new HashMap<>();

    return clone(node, clones);
}

Node clone(
        Node node,
        Map<Node, Node> clones
) {
    if (clones.containsKey(node)) {
        return clones.get(node);
    }

    Node copy = new Node(node.val);
    clones.put(node, copy);

    for (Node neighbor : node.neighbors) {
        copy.neighbors.add(
            clone(neighbor, clones)
        );
    }

    return copy;
}
```
### Why store the clone before recursion?
If the graph contains a cycle, recursion may return to the same node.
The mapping must already exist so the repeated visit can return the existing clone instead of creating another one.

Practice:
- LC 133 — Clone Graph
- LC 138 — Copy List with Random Pointer
---
## Common Form 11: Path Reconstruction
A distance tells us how far the destination is, but not which path produced that distance.
To reconstruct the path, store which node first discovered every neighbor.
### How it works
1. Run BFS from the source.
2. When discovering a neighbor, store:
	`parent[neighbor] = current`.
3. Stop when the destination is found.
4. Start at the destination.
5. Follow parents backward to the source.
6. Reverse the collected sequence.

**Memory flow:** `Discover node → Save predecessor → Trace backward → Reverse`
```java
List<Integer> shortestPath(
        int source,
        int destination,
        List<List<Integer>> graph
) {
    int n = graph.size();

    boolean[] visited = new boolean[n];
    int[] parent = new int[n];

    Arrays.fill(parent, -1);

    Deque<Integer> queue = new ArrayDeque<>();

    queue.offer(source);
    visited[source] = true;

    while (!queue.isEmpty()) {
        int node = queue.poll();

        if (node == destination) {
            break;
        }

        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                parent[neighbor] = node;
                queue.offer(neighbor);
            }
        }
    }

    if (!visited[destination]) {
        return List.of();
    }

    List<Integer> path = new ArrayList<>();

    for (int node = destination;
            node != -1;
            node = parent[node]) {
        path.add(node);
    }

    Collections.reverse(path);
    return path;
}
```
Practice:
- LC 126 — Word Ladder II
- LC 815 — Bus Routes
- Shortest Path in an Unweighted Graph
- Print Shortest Path using BFS
---
## DFS with Returning Information
DFS does not always return `void`.
It can return information about the reachable structure.
```java
int dfs(int node) {
    visited[node] = true;

    int answer = 1;

    for (int neighbor : graph.get(node)) {
        if (!visited[neighbor]) {
            answer += dfs(neighbor);
        }
    }

    return answer;
}
```
Possible return values include:
```plain text
Component size
Whether the target was found
Maximum depth
Minimum or maximum reachable value
Whether the component satisfies a condition
```
Before coding, define:
> `dfs(node)` returns  for the unvisited graph reachable from `node`.

---
## BFS Without a Separate `visited` Array
A separate `visited` structure is not required when another structure already records discovery.

For shortest path:
```java
if (distance[neighbor] == -1) {
    distance[neighbor] = distance[node] + 1;
    queue.offer(neighbor);
}
```
Here:
```plain text
distance == -1 → not visited
distance >= 0  → already discovered
```
Similarly, a parent map can sometimes represent visited state:
```java
if (!parent.containsKey(neighbor)) {
    parent.put(neighbor, node);
}
```
> You still need visited information; it may simply be stored inside another structure.

---
## Traversing Disconnected Graphs
Starting from node `0` does not guarantee that every graph node will be visited.
```plain text
0 — 1       2 — 3
```
DFS from `0` reaches only:
```plain text
0, 1
```
To process the complete graph:
```java
for (int node = 0; node < n; node++) {
    if (!visited[node]) {
        dfs(node, graph, visited);
    }
}
```
Use this outer loop when the question concerns:
- Every vertex
- Number of components
- Whether every component satisfies a condition
- Complete graph traversal

Do not use it when the question asks only what is reachable from a specific source.
---
## Marking Visited: Global versus Current Path
These represent different ideas.
## Globally visited
```plain text
This node has already been completely discovered.
```
Used for:
- Normal DFS
- BFS
- Connected components
- Shortest path
## Current DFS path
```plain text
This node is part of the active recursive route.
```
Used for:
- Directed-cycle detection
- Backtracking
- Certain path enumeration problems

A node may be globally visited but no longer belong to the current recursive path.
We will cover this distinction fully in cycle detection.
---
## BFS Level versus Distance Array
Both can track distance.
## Level counter
Use when all nodes in one BFS layer share the same meaning:
```java
int level = 0;

while (!queue.isEmpty()) {
    int size = queue.size();

    // Process the complete level.

    level++;
}
```
## Distance array
Use when you need:
- The distance to many individual nodes
- Path reconstruction
- Distances after traversal finishes
- A visited marker combined with distance
```java
distance[neighbor] = distance[node] + 1;
```
---
## Quick Interview Checklist
1. What represents a graph node?
2. What represents an edge?
3. Is the graph directed or undirected?
4. Is it weighted or unweighted?
5. How should the adjacency list be constructed?
6. Should every edge be added once or twice?
7. Are nodes integers, strings, or objects?
8. What does visited mean in this problem?
9. When should a node be marked visited?
10. Is the graph guaranteed to be connected?
11. Am I exploring one source or the complete graph?
12. Is either BFS or DFS sufficient?
13. Do I need the shortest number of edges?
14. Do I need level-by-level processing?
15. Are there multiple starting sources?
16. Do I need to reconstruct the actual path?
17. Can another structure also track visited state?
18. Could recursive DFS overflow the call stack?
19. What does my DFS function return?
20. What are `V` and `E` for this problem?
---
## Common Mistakes
- Constructing a directed graph when the edges are undirected.
- Adding both directions for a directed edge.
- Forgetting to initialize adjacency lists for nodes without edges.
- Starting from node `0` and assuming the whole graph was visited.
- Forgetting the outer loop for disconnected graphs.
- Not using a visited structure in a cyclic graph.
- Marking BFS nodes visited only when polling them.
- Adding the same node to the queue several times.
- Using DFS for an unweighted shortest-path question without a valid reason.
- Assuming BFS finds minimum weighted distance.
- Increasing BFS distance once per node instead of once per level.
- Not capturing the queue size before processing a level.
- Running separate BFS from every source instead of multi-source BFS.
- Using only a visited boolean when cloning requires original-to-copy mapping.
- Storing parents but forgetting to reverse the reconstructed path.
- Confusing current-path state with globally visited state.
- Using recursive DFS without considering graph depth.
- Claiming graph traversal is always `O(V²)`.
---
## Complexity Analysis
Let:
```plain text
V = number of vertices
E = number of edges
```
## Adjacency-list construction
```plain text
Time:  O(V + E)
Space: O(V + E)
```
## DFS
Every vertex is visited once, and every adjacency entry is examined once:
```plain text
Time:  O(V + E)
Space: O(V)
```
Recursive stack:
```plain text
O(V) worst case
```
## BFS
Every vertex enters the queue at most once:
```plain text
Time:  O(V + E)
Space: O(V)
```
## Adjacency matrix traversal
Finding all neighbors of one node requires scanning an entire row:
```plain text
Time: O(V²)
```
## Connected components
Although DFS or BFS may start several times, every node and edge is still processed only once overall:
```plain text
Time:  O(V + E)
Space: O(V)
```
## Path reconstruction
BFS:
```plain text
O(V + E)
```
Tracing the final path:
```plain text
O(V) worst case
```
Total remains:
```plain text
O(V + E)
```
---
## Final Reusable Model
```plain text
Build adjacency list
→ Choose starting node
→ Mark it discovered
→ Process nodes
→ Explore unvisited neighbors
```
Use DFS when:
```plain text
Explore deeply
Process connected structures
Return information through recursion
```
Use BFS when:
```plain text
Explore by distance
Find an unweighted shortest path
Process levels
Expand from multiple sources
```
The most important interview question is:
> “What exactly makes a node discovered, and when should I prevent it from being added again?”
