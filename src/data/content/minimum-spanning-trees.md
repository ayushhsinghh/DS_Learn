A Minimum Spanning Tree, or MST, connects every node in an undirected weighted graph using the minimum possible total edge cost.

It must satisfy three properties:
```plain text
Every vertex is connected
No cycle exists
Exactly V - 1 edges are selected
```
Example:
```plain text
A ──1── B
│      /│
4    2  5
│   /   │
C ──3── D
```
An MST selects enough low-cost edges to connect all four nodes without creating a cycle.
---
## Important Terminology
## Spanning
The selected edges include every graph vertex.
## Tree
The selected edges are connected and contain no cycle.
## Minimum
Among all possible spanning trees, it has the smallest total edge weight.

A connected graph can have:
- One unique MST
- Several different MSTs with the same minimum cost
---
## Core Mental Model
> Repeatedly select a safe, low-cost edge that connects previously separate parts of the graph.

The two main MST algorithms are:
```plain text
Kruskal’s algorithm
→ Process globally cheapest edges
→ Use Union-Find to prevent cycles

Prim’s algorithm
→ Grow one connected tree
→ Use a priority queue to select the cheapest outgoing edge
```
---
## When to Use an MST
Look for these signals:
- Connect all cities, points, computers, or buildings.
- Minimize the total cost of connecting the complete network.
- Select connections without creating cycles.
- Every node must become reachable.
- Edge costs represent the price of building a connection.
- The required result contains exactly `n - 1` connections.
- Existing connections can be treated as zero-cost edges.
- A virtual source can represent an alternative construction method.

Common wording:
```plain text
minimum cost to connect all
connect every node
minimum total wiring cost
build a network
roads, cables, pipes, bridges
```
### Most important recognition question
> Are we minimizing the total cost of connecting the entire graph, rather than the travel cost from one source?

If yes, consider a Minimum Spanning Tree.
---
## MST versus Shortest Path
These solve different optimization problems.
## Shortest path
Minimizes the cost of traveling from a source to a destination:
```plain text
source → destination
```
## Minimum spanning tree
Minimizes the total cost of connecting every node:
```plain text
all vertices become connected
```
An MST does not guarantee the shortest route from the source to every node.
A shortest-path tree does not necessarily have the minimum total connection cost.
---
## Fundamental MST Properties
## Exactly `V - 1` edges
A tree containing `V` vertices always contains:
```plain text
V - 1 edges
```
If fewer edges are selected:
```plain text
The graph is disconnected
```
If more edges are selected:
```plain text
A cycle must exist
```
---
## Cut Property
Imagine dividing the graph’s vertices into two groups.
```plain text
Group A | Group B
```
The cheapest edge crossing this division is safe to include in some MST.
This is the core intuition behind both Prim and Kruskal.
---
## Cycle Property
If an edge is the uniquely heaviest edge in a cycle, it does not need to belong to an MST.
Why?
Removing that edge keeps the cycle’s vertices connected while reducing total cost.
---
## Kruskal’s Algorithm
Kruskal processes all edges globally from smallest to largest weight.
It uses Union-Find to determine whether adding an edge would create a cycle.
### How it works
1. Sort all edges by weight.
2. Start with every node in a separate component.
3. Process edges from smallest to largest.
4. If an edge connects different components, include it.
5. Union those components.
6. If both endpoints are already connected, skip the edge.
7. Stop after selecting `V - 1` edges.

**Memory flow:** `Sort all edges → Add cheapest non-cycling edge → Merge components`
---
## Kruskal Template
```java
class Edge {
    int from;
    int to;
    int weight;

    Edge(int from, int to, int weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }
}
```
```java
long kruskal(
        int vertices,
        List<Edge> edges
) {
    edges.sort(
        (first, second) ->
            Integer.compare(
                first.weight,
                second.weight
            )
    );

    UnionFind unionFind =
        new UnionFind(vertices);

    long totalCost = 0;
    int edgesUsed = 0;

    for (Edge edge : edges) {
        if (unionFind.union(
                edge.from,
                edge.to
        )) {
            totalCost += edge.weight;
            edgesUsed++;

            if (edgesUsed == vertices - 1) {
                break;
            }
        }
    }

    return edgesUsed == vertices - 1
        ? totalCost
        : -1;
}
```
---
## Why Union-Find Works in Kruskal
Before adding edge:
```plain text
u — v
```
check:
```java
find(u) == find(v)
```
If true:
```plain text
u and v already have a path between them
```
Adding another edge closes a cycle.

If false:
```plain text
The edge joins two separate components
```
The edge can safely expand the spanning forest.
---
## Prim’s Algorithm
Prim grows one connected tree from a starting node.
At every step, it chooses the cheapest edge connecting the current tree to an unvisited node.
### How it works
1. Start from any graph node.
2. Add its candidate outgoing edges to a min-priority queue.
3. Remove the cheapest candidate.
4. If its destination is already in the MST, skip it.
5. Otherwise, include the node and edge.
6. Add the new node’s outgoing edges.
7. Continue until every node has joined the MST.

**Memory flow:** `Grow one tree → Select cheapest boundary edge → Add new node`
---
## Prim State
```java
class State {
    int node;
    int edgeCost;

    State(int node, int edgeCost) {
        this.node = node;
        this.edgeCost = edgeCost;
    }
}
```
The priority queue is ordered by:
```plain text
Cost of connecting this node to the current MST
```
It is not necessarily the total distance from the starting node.
---
## Prim Template
```java
long prim(List<List<Edge>> graph) {
    int vertices = graph.size();

    boolean[] inMst = new boolean[vertices];

    PriorityQueue<State> queue =
        new PriorityQueue<>(
            (first, second) ->
                Integer.compare(
                    first.edgeCost,
                    second.edgeCost
                )
        );

    queue.offer(new State(0, 0));

    long totalCost = 0;
    int nodesUsed = 0;

    while (!queue.isEmpty()) {
        State current = queue.poll();

        if (inMst[current.node]) {
            continue;
        }

        inMst[current.node] = true;
        totalCost += current.edgeCost;
        nodesUsed++;

        for (Edge edge : graph.get(current.node)) {
            if (!inMst[edge.to]) {
                queue.offer(
                    new State(
                        edge.to,
                        edge.weight
                    )
                );
            }
        }
    }

    return nodesUsed == vertices
        ? totalCost
        : -1;
}
```
---
## Why Prim Starts with Cost `0`
The starting node does not require an edge to enter the MST.

Therefore:
```java
queue.offer(new State(start, 0));
```
Its contribution to total cost is zero.
Every later node contributes the cost of the selected edge that connects it to the existing tree.
---
## Why Prim May Add a Node Several Times
A node may be reachable through several candidate edges:
```plain text
A ──10── C
B ──2─── C
```
Both candidate states may enter the priority queue.
When `C` is selected through cost `2`, it becomes part of the MST.
The later cost-`10` entry is skipped using:
```java
if (inMst[current.node]) {
    continue;
}
```
---
## Prim versus Dijkstra
Both use a min-priority queue, but the stored cost has a different meaning.
## Dijkstra
```plain text
distance[node]
= total path cost from the source
```
Candidate:
```java
distance[current] + edgeWeight
```
## Prim
```plain text
connectionCost[node]
= cost of one edge connecting node to the MST
```
Candidate:
```java
edgeWeight
```
Dijkstra minimizes source-to-node path distances.
Prim minimizes the total cost of the selected tree edges.
---
## Prim with a Best-Connection Array
Prim can store the cheapest known edge connecting each node to the current MST.
```java
int[] best = new int[n];
Arrays.fill(best, Integer.MAX_VALUE);

best[0] = 0;
```
Relaxation:
```java
if (!inMst[next]
        && edgeWeight < best[next]) {
    best[next] = edgeWeight;
    queue.offer(
        new State(next, edgeWeight)
    );
}
```
This avoids inserting candidates that are already known to be worse.
The priority queue can still contain stale entries, so `inMst` remains useful.
---
## Kruskal versus Prim
## Prefer Kruskal when
- The input is naturally an edge list.
- Edges are easy to sort.
- The graph is sparse.
- Union-Find is already useful.
- You need to classify MST edges.
- Edges arrive in globally sorted order.
## Prefer Prim when
- The graph is naturally an adjacency list.
- You want to grow a network from one node.
- The graph is dense.
- Edge weights can be generated from the current node.
- Constructing and sorting every possible edge would be expensive.
## Complexity comparison
Kruskal:
```plain text
O(E log E)
```
Prim with adjacency list and binary heap:
```plain text
O(E log V)
```
Because:
```plain text
log E and log V
```
are closely related for ordinary graphs, both are often similar in practice.
---
## Common Forms
## Common Form 1: Standard Minimum Cost to Connect All Nodes
The graph directly provides weighted undirected edges.
### How it works
1. Treat objects as graph vertices.
2. Treat available connections as weighted edges.
3. Run Kruskal or Prim.
4. Select exactly `V - 1` safe edges.
5. If fewer nodes can be connected, return failure.

**Memory flow:** `Model weighted graph → Build MST → Verify complete connectivity`

Practice:
- LC 1135 — Connecting Cities With Minimum Cost
- Minimum Cost to Connect All Cities
- Network Wiring Problems
---
## Common Form 2: Complete Graph with Calculated Edge Costs
Sometimes every pair of nodes can be connected, but edges are not listed explicitly.

Example:
```plain text
Points in a plane
Cost = Manhattan distance
```
```java
cost =
    Math.abs(x1 - x2)
    + Math.abs(y1 - y2);
```
The implied graph contains:
```plain text
O(V²) edges
```
### How it works
1. Treat every point as a graph node.
2. Calculate connection costs when required.
3. Either generate every pair and use Kruskal.
4. Or use Prim and find the next cheapest connection directly.
5. Add nodes until all points are connected.

**Memory flow:** `Implicit complete graph → Calculate edge cost → Grow MST`

For a dense complete graph, array-based Prim can avoid storing all edges:
```java
int[] best = new int[n];
boolean[] inMst = new boolean[n];

Arrays.fill(best, Integer.MAX_VALUE);
best[0] = 0;

int totalCost = 0;

for (int count = 0; count < n; count++) {
    int node = -1;

    for (int candidate = 0;
            candidate < n;
            candidate++) {
        if (!inMst[candidate]
                && (node == -1
                    || best[candidate] < best[node])) {
            node = candidate;
        }
    }

    inMst[node] = true;
    totalCost += best[node];

    for (int next = 0; next < n; next++) {
        if (!inMst[next]) {
            int cost =
                Math.abs(points[node][0] - points[next][0])
                + Math.abs(points[node][1] - points[next][1]);

            best[next] =
                Math.min(best[next], cost);
        }
    }
}
```
Complexity:
```plain text
Time:  O(V²)
Space: O(V)
```
Practice:
- LC 1584 — Min Cost to Connect All Points
---
## Common Form 3: Existing Connections
Some connections already exist and require no additional cost.

Model them as:
```plain text
zero-cost edges
```
or union them before processing paid edges.
### How it works
1. Initialize Union-Find.
2. Union all existing free connections.
3. Sort the optional paid connections by cost.
4. Add the cheapest edges joining different components.
5. Stop when one component remains.

**Memory flow:** `Merge existing network → Connect remaining components cheaply`
```java
for (int[] connection : existing) {
    unionFind.union(
        connection[0],
        connection[1]
    );
}

paidEdges.sort(
    Comparator.comparingInt(edge -> edge.weight)
);
```
Practice:
- Minimum Cost to Repair or Connect a Network
- Connecting Cities with Existing Roads
- Amazon-style network connection problems
---
## Common Form 4: Virtual Node
Sometimes every location has two options:
```plain text
Build something locally
or
Connect to another location
```
Example:
```plain text
Build a well in each house
or
Connect houses using pipes
```
Create a virtual node representing the local-building option.
```plain text
Virtual node 0
0 → house i with cost wells[i]
house i → house j with pipe cost
```
Now the complete problem becomes one MST.
### How it works
1. Add one virtual node.
2. Connect it to every real node using that node’s independent construction cost.
3. Add the normal connection edges.
4. Run an MST across all nodes.
5. The selected virtual edges represent local construction.

**Memory flow:** `Convert alternative choices into edges → Run one MST`

Practice:
- LC 1168 — Optimize Water Distribution in a Village

This is one of the most important MST modeling techniques.
---
## Common Form 5: Stop When All Nodes Become Connected
Sometimes edges arrive sorted by time or cost.
We need the first moment when the entire graph becomes connected.
### How it works
1. Sort events by time or cost.
2. Union the endpoints of each event.
3. Decrease component count after a successful union.
4. When component count becomes one, return the current event value.
5. If this never happens, return failure.

**Memory flow:** `Process connections in order → Merge groups → Stop at one component`
```java
Arrays.sort(
    logs,
    (first, second) ->
        Integer.compare(first[0], second[0])
);

for (int[] log : logs) {
    int time = log[0];
    int first = log[1];
    int second = log[2];

    unionFind.union(first, second);

    if (unionFind.countComponents() == 1) {
        return time;
    }
}
```
Practice:
- LC 1101 — The Earliest Moment When Everyone Become Friends

This is closely related to Kruskal because edges are processed in sorted order.
---
## Common Form 6: Minimum Bottleneck Connection
Sometimes the objective is not the total edge cost.
Instead, minimize the largest edge used.
```plain text
Path or network cost
= maximum selected edge
```
In an MST, the path between any two nodes minimizes the maximum edge required between them.
### How it works
1. Sort edges by weight.
2. Union endpoints from smallest weight upward.
3. Stop when the required nodes become connected.
4. The current edge weight is the minimum possible bottleneck.

**Memory flow:** `Enable edges from smallest upward → Stop when connectivity appears`
```java
for (Edge edge : sortedEdges) {
    unionFind.union(edge.from, edge.to);

    if (unionFind.connected(source, destination)) {
        return edge.weight;
    }
}
```
Practice:
- LC 1631 — Path With Minimum Effort
- LC 778 — Swim in Rising Water
- Minimum Bottleneck Path

These problems can also be solved with minimax Dijkstra or binary search plus connectivity testing.
---
## Common Form 7: Critical and Pseudo-Critical MST Edges
An MST problem may ask how individual edges affect the optimal answer.
## Critical edge
Removing it increases the MST cost or makes an MST impossible.
## Pseudo-critical edge
It can appear in at least one MST, but is not required in every MST.
### How it works
1. Calculate the original MST cost.
2. For each edge, calculate an MST while excluding it.
3. If the result is worse or impossible, the edge is critical.
4. Otherwise, calculate an MST forcing that edge first.
5. If the cost equals the original MST cost, it is pseudo-critical.

**Memory flow:** `Compute baseline → Exclude edge → Force edge → Compare costs`

Practice:
- LC 1489 — Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree

This repeated-Kruskal approach is appropriate because the problem constraints are relatively small.
---
## Common Form 8: Maximum Spanning Tree
Sometimes we want the largest total selected edge weight while still connecting all vertices without cycles.
The structure is the same as an MST, but edges are processed in descending order.
### How it works
1. Sort edges from largest to smallest.
2. Use Union-Find to avoid cycles.
3. Include an edge when it joins separate components.
4. Stop after selecting `V - 1` edges.

**Memory flow:** `Process largest safe edges → Build maximum-cost spanning tree`
```java
edges.sort(
    (first, second) ->
        Integer.compare(
            second.weight,
            first.weight
        )
);
```
Use this only when the problem explicitly asks to maximize total connection value.
---
## Common Form 9: MST Savings
Some questions provide the cost of every existing edge and ask how much cost can be saved while keeping the graph connected.
### How it works
1. Calculate the sum of all edge weights.
2. Calculate the MST cost.
3. Remove every unnecessary edge.
4. Return:
```plain text
total original cost - MST cost
```
**Memory flow:** `Total current cost → Keep cheapest connected structure → Subtract`
```java
long savings =
    totalEdgeCost - minimumSpanningTreeCost;
```
Practice:
- Network Savings
- Dark Roads
- Infrastructure cost-reduction problems
---
## Common Form 10: Connect Components Rather Than Individual Nodes
Sometimes some nodes are already grouped into connected components.
The real MST decision is between those components.
### How it works
1. Union every existing connection.
2. Treat each resulting root as one component.
3. Process candidate edges between components.
4. Skip edges whose endpoints now have the same root.
5. Select the cheapest edges that merge separate components.

**Memory flow:** `Compress existing groups → Connect component representatives`
This frequently appears in infrastructure and network-upgrade questions.
---
## Recovering the Selected MST Edges
If the question requires the actual connections, not only total cost, save each accepted edge.
## Kruskal
```java
List<Edge> selected = new ArrayList<>();

if (unionFind.union(edge.from, edge.to)) {
    selected.add(edge);
    totalCost += edge.weight;
}
```
## Prim
Store the parent that offered the selected edge:
```java
class State {
    int node;
    int parent;
    int edgeCost;
}
```
When the node first enters the MST:
```java
selected.add(
    new Edge(
        current.parent,
        current.node,
        current.edgeCost
    )
);
```
Skip the artificial starting edge whose parent does not exist.
---
## Detecting a Disconnected Graph
An MST exists only if every vertex can be connected.
## Kruskal check
```java
edgesUsed == vertices - 1
```
## Prim check
```java
nodesUsed == vertices
```
If the condition fails:
```plain text
No spanning tree exists
```
Return the failure value required by the problem.
---
## Handling Duplicate Edge Weights
Duplicate weights do not cause a problem.
They may mean multiple valid MSTs exist.

Kruskal or Prim can choose any safe edge with the same cost unless the question requires:
- A specific MST
- Lexicographic ordering
- Critical-edge classification
- Counting distinct MSTs
---
## Quick Interview Checklist
1. Is the graph undirected?
2. Is every node required to be connected?
3. Are we minimizing total network cost?
4. Is this actually shortest path rather than MST?
5. Does the final structure need exactly `V - 1` edges?
6. Is the graph already guaranteed to be connected?
7. Should failure be returned for a disconnected graph?
8. Is the input naturally an edge list or adjacency list?
9. Should I prefer Kruskal or Prim?
10. If using Kruskal, did I sort edges by weight?
11. Am I using Union-Find to prevent cycles?
12. Does `union` return whether a merge occurred?
13. If using Prim, what does the priority-queue cost represent?
14. Did I skip nodes already added to the MST?
15. Are edges directed or should both directions be stored?
16. Are some connections already free?
17. Can a virtual node model independent construction?
18. Is the graph complete with calculated edge costs?
19. Can I avoid explicitly creating `O(V²)` edges?
20. Do I need total cost or the actual selected edges?
21. Is the objective total cost or maximum edge cost?
22. Could the total cost require `long`?
23. How will I verify that every node was connected?
---
## Common Mistakes
- Using MST when the question asks for a source-to-destination shortest path.
- Using Dijkstra when the objective is minimum total network cost.
- Applying MST directly to a directed graph.
- Forgetting that a spanning tree uses exactly `V - 1` edges.
- Returning a cost without verifying complete connectivity.
- Adding an edge in Kruskal even when its endpoints are already connected.
- Sorting edges in the wrong direction.
- Using subtraction in a comparator and risking overflow.
- Forgetting path compression or union by size in Union-Find.
- Decreasing component count after a failed union.
- In Prim, adding the total path distance instead of the selected edge cost.
- Marking a Prim node selected when adding it to the priority queue.
- Forgetting to skip duplicate priority-queue entries.
- Adding only one direction for an undirected Prim graph.
- Forgetting the starting node’s connection cost should be zero.
- Building every edge of a huge implicit complete graph unnecessarily.
- Missing the virtual-node transformation.
- Double-counting selected edges.
- Using `int` when the total MST cost can overflow.
- Assuming the MST is unique because the total cost is unique.
---
## Complexity Analysis
Let:
```plain text
V = number of vertices
E = number of edges
```
## Kruskal
Sorting:
```plain text
O(E log E)
```
Union-Find work:
```plain text
O(E × α(V))
```
Total:
```plain text
Time:  O(E log E)
Space: O(V + E)
```
## Prim with adjacency list and binary heap
Every candidate edge may enter the priority queue:
```plain text
Time:  O(E log V)
Space: O(V + E)
```
## Prim with adjacency matrix or implicit complete graph
```plain text
Time:  O(V²)
Space: O(V)
```
This can be preferable for dense graphs.
## Repeated MST for edge classification
Running Kruskal for every edge can require approximately:
```plain text
O(E² log E)
```
This is acceptable only when constraints are small enough.
---
## Final Algorithm Selection Model
```plain text
Need minimum total cost to connect every node?
→ Minimum Spanning Tree

Input is an edge list or graph is sparse?
→ Kruskal

Input is an adjacency list?
→ Prim

Graph is dense or complete?
→ O(V²) Prim may be simpler

Existing free connections?
→ Union them first

Each node can build independently or connect?
→ Add a virtual node

Need minimum possible largest edge?
→ Kruskal until connected or minimax Dijkstra

Need critical edges?
→ Recompute MST while excluding and forcing edges
```
The most important interview question is:
> “Am I minimizing the cost of one route, or the total cost required to connect the entire network?”
