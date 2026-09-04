A shortest-path problem asks:
> What is the minimum cost required to travel from one node or state to another?

The meaning of cost depends on the problem:
```plain text
Number of edges
Distance
Time
Price
Effort
Risk
Number of transformations
```
The four primary algorithms are:
1. BFS
2. Dijkstra’s algorithm
3. Bellman–Ford
4. Floyd–Warshall

The correct algorithm depends mainly on:
```plain text
Edge weights
Number of sources
Number of destination queries
Presence of negative weights
Restrictions on the number of edges
```
---
## Core Mental Model
Every shortest-path algorithm repeatedly improves a known distance.
```java
newDistance = distance[current] + edgeWeight;
```
If the new route is better:
```java
if (newDistance < distance[next]) {
    distance[next] = newDistance;
}
```
This operation is called:
```plain text
Edge relaxation
```
The algorithms differ in the order and number of times they relax edges.
---
## Shortest-Path Decision Guide
```plain text
All edges have equal weight
→ BFS

All edges have non-negative weights
→ Dijkstra

Edges may have negative weights
→ Bellman–Ford

Need to detect a negative cycle
→ Bellman–Ford

Need shortest paths between every pair
→ Floyd–Warshall

Graph is small and many source-destination queries exist
→ Floyd–Warshall

Maximum number of edges or stops is restricted
→ Bounded Bellman–Ford

Several starting sources spread simultaneously
→ Multi-source BFS
```
---
## Quick Comparison
<table header-row="true">
<tr>
<td>Algorithm</td>
<td>Graph requirement</td>
<td>Finds</td>
<td>Time</td>
</tr>
<tr>
<td>BFS</td>
<td>Equal-weight or unweighted edges</td>
<td>One source to all nodes</td>
<td>`O(V + E)`</td>
</tr>
<tr>
<td>Dijkstra</td>
<td>Non-negative weights</td>
<td>One source to all nodes</td>
<td>`O((V + E) log V)`</td>
</tr>
<tr>
<td>Bellman–Ford</td>
<td>Negative weights allowed</td>
<td>One source to all nodes</td>
<td>`O(VE)`</td>
</tr>
<tr>
<td>Floyd–Warshall</td>
<td>Negative edges allowed, no negative cycle</td>
<td>Every pair</td>
<td>`O(V³)`</td>
</tr>
</table>
---
## What Is a Distance Array?
```java
int[] distance = new int[n];
Arrays.fill(distance, Integer.MAX_VALUE);

distance[source] = 0;
```
The meaning is:
> `distance[node]` stores the best cost currently known for reaching `node`.

Initially:
```plain text
Source      → distance 0
Other nodes → infinity because no path is known
```
As edges are relaxed, distances improve.
---
## Why a Node May Be Discovered More Than Once
In ordinary BFS, the first discovery is optimal because every edge has equal cost.
In a weighted graph, a node may first be discovered through an expensive path and later through a cheaper one.

Example:
```plain text
A ──10──→ B
A ──1───→ C ──1──→ B
```
First known path:
```plain text
A → B = 10
```
Later:
```plain text
A → C → B = 2
```
Therefore, weighted shortest-path algorithms must allow distance improvement.
---
## 1. BFS Shortest Path
BFS finds the shortest path in:
```plain text
Unweighted graphs
or
Graphs where every edge has the same cost
```
BFS minimizes:
```plain text
Number of edges used
```
---
## Why BFS Finds the Shortest Path
BFS explores nodes in layers:
```plain text
Layer 0 → source
Layer 1 → nodes one edge away
Layer 2 → nodes two edges away
Layer 3 → nodes three edges away
```
Therefore, the first time a node is discovered, it has been reached using the minimum number of edges.
---
## BFS Template
```java
int[] shortestPath(
        int source,
        List<List<Integer>> graph
) {
    int n = graph.size();

    int[] distance = new int[n];
    Arrays.fill(distance, -1);

    Deque<Integer> queue = new ArrayDeque<>();

    queue.offer(source);
    distance[source] = 0;

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

    return distance;
}
```
Here:
```plain text
distance == -1 → undiscovered
distance >= 0  → already discovered
```
A separate `visited` array is unnecessary.
---
## When to Prefer BFS
Use BFS when:
- Every edge costs the same.
- The graph is unweighted.
- Each move counts as one operation.
- You need the minimum number of transformations.
- You need the minimum number of grid steps.
- You need the nearest occurrence of something.

Do not use Dijkstra when ordinary BFS is sufficient. BFS is simpler and faster.
---
## 2. Dijkstra’s Algorithm
Dijkstra finds shortest paths from one source when every edge weight is non-negative.
```plain text
edgeWeight >= 0
```
It uses a min-priority queue to process the node with the smallest currently known distance.
---
## Dijkstra’s Core Mental Model
> Always continue from the currently cheapest reachable node.

```plain text
Take cheapest state
→ Try extending its path
→ Improve neighbor distances
→ Add improved states to the priority queue
```
---
## Weighted Graph Representation
```java
class Edge {
    int node;
    int weight;

    Edge(int node, int weight) {
        this.node = node;
        this.weight = weight;
    }
}
```
```java
List<List<Edge>> graph = new ArrayList<>();

for (int node = 0; node < n; node++) {
    graph.add(new ArrayList<>());
}
```
Directed edge:
```java
graph.get(from).add(new Edge(to, weight));
```
Undirected edge:
```java
graph.get(from).add(new Edge(to, weight));
graph.get(to).add(new Edge(from, weight));
```
---
## Dijkstra Template
```java
class State {
    int node;
    long distance;

    State(int node, long distance) {
        this.node = node;
        this.distance = distance;
    }
}
```
```java
long[] dijkstra(
        int source,
        List<List<Edge>> graph
) {
    int n = graph.size();

    long[] distance = new long[n];
    Arrays.fill(distance, Long.MAX_VALUE);

    PriorityQueue<State> queue =
        new PriorityQueue<>(
            (first, second) ->
                Long.compare(
                    first.distance,
                    second.distance
                )
        );

    distance[source] = 0;
    queue.offer(new State(source, 0));

    while (!queue.isEmpty()) {
        State current = queue.poll();

        if (current.distance
                != distance[current.node]) {
            continue;
        }

        for (Edge edge : graph.get(current.node)) {
            long candidate =
                current.distance + edge.weight;

            if (candidate < distance[edge.node]) {
                distance[edge.node] = candidate;

                queue.offer(
                    new State(
                        edge.node,
                        candidate
                    )
                );
            }
        }
    }

    return distance;
}
```
---
## Why Skip Stale Priority-Queue Entries?
Java’s `PriorityQueue` does not efficiently update an existing entry.

If a shorter path is found, we add a new state:
```plain text
(node B, distance 10)
(node B, distance 4)
```
Both entries may remain in the queue.
When `(B, 10)` is eventually removed, it is outdated.
```java
if (current.distance != distance[current.node]) {
    continue;
}
```
This prevents unnecessary processing.
---
## Why Dijkstra Does Not Need a `visited` Array
The distance array determines whether a priority-queue entry is current.
```java
current.distance == distance[current.node]
```
means this entry represents the best known distance.
An older entry is ignored.
A visited array can be used when a node is finalized after polling, but the stale-entry pattern is often simpler and safer.
---
## Why Dijkstra Requires Non-Negative Weights
Dijkstra assumes that when the smallest-distance state is processed, a later path cannot make it cheaper.

A negative edge can violate this assumption:
```plain text
A → B = 5
A → C = 10
C → B = -20
```
The later path gives:
```plain text
A → C → B = -10
```
Dijkstra’s greedy finalization is therefore invalid with negative edges.
---
## Early Exit in Dijkstra
If only one destination is needed:
```java
if (current.node == destination) {
    return current.distance;
}
```
This is safe when the state is removed as the current minimum after stale entries are skipped.
---
## 3. Bellman–Ford Algorithm
Bellman–Ford finds shortest paths from one source even when some edges have negative weights.
It can also detect a reachable negative-weight cycle.
---
## Bellman–Ford Core Mental Model
> Repeatedly relax every edge until shortest paths have had enough opportunities to propagate.

A shortest simple path can contain at most:
```plain text
V - 1 edges
```
Therefore, relaxing all edges `V - 1` times is sufficient when no negative cycle exists.
---
## Edge-List Representation
Bellman–Ford works naturally with an edge list:
```java
class Edge {
    int from;
    int to;
    long weight;

    Edge(int from, int to, long weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }
}
```
---
## Bellman–Ford Template
```java
long[] bellmanFord(
        int vertices,
        List<Edge> edges,
        int source
) {
    long infinity = Long.MAX_VALUE / 4;

    long[] distance = new long[vertices];
    Arrays.fill(distance, infinity);

    distance[source] = 0;

    for (int iteration = 1;
            iteration < vertices;
            iteration++) {
        boolean changed = false;

        for (Edge edge : edges) {
            if (distance[edge.from] == infinity) {
                continue;
            }

            long candidate =
                distance[edge.from] + edge.weight;

            if (candidate < distance[edge.to]) {
                distance[edge.to] = candidate;
                changed = true;
            }
        }

        if (!changed) {
            break;
        }
    }

    return distance;
}
```
---
## Why `V - 1` Iterations?
After one complete relaxation round, shortest paths using at most one edge can propagate.

After two rounds:
```plain text
paths using at most two edges
```
After `V - 1` rounds:
```plain text
paths using at most V - 1 edges
```
Any simple path contains at most `V - 1` edges.
If it contains more, it must repeat a vertex and therefore contain a cycle.
---
## Detecting a Negative Cycle
After the standard `V - 1` rounds, perform one additional relaxation pass.

If any reachable distance still improves:
```plain text
a reachable negative cycle exists
```
```java
boolean hasNegativeCycle = false;

for (Edge edge : edges) {
    if (distance[edge.from] == infinity) {
        continue;
    }

    if (distance[edge.from] + edge.weight
            < distance[edge.to]) {
        hasNegativeCycle = true;
        break;
    }
}
```
Why?
A normal shortest path should already be finalized after `V - 1` rounds.
Continued improvement means repeatedly traveling through a negative cycle keeps reducing the cost.
---
## 4. Floyd–Warshall Algorithm
Floyd–Warshall calculates shortest paths between every pair of vertices.
It uses dynamic programming over possible intermediate nodes.
---
## Floyd–Warshall Core Mental Model
For every pair `(from, to)`, ask:
> Is the path cheaper if it is allowed to pass through `via`?

```java
distance[from][to] = Math.min(
    distance[from][to],
    distance[from][via] + distance[via][to]
);
```
---
## Floyd–Warshall Initialization
```java
long[][] distance = new long[n][n];
long infinity = Long.MAX_VALUE / 4;

for (int from = 0; from < n; from++) {
    Arrays.fill(distance[from], infinity);
    distance[from][from] = 0;
}
```
For every edge:
```java
distance[from][to] =
    Math.min(distance[from][to], weight);
```
For an undirected edge:
```java
distance[from][to] =
    Math.min(distance[from][to], weight);

distance[to][from] =
    Math.min(distance[to][from], weight);
```
Using `Math.min` handles multiple edges between the same pair.
---
## Floyd–Warshall Template
```java
for (int via = 0; via < n; via++) {
    for (int from = 0; from < n; from++) {
        for (int to = 0; to < n; to++) {
            if (distance[from][via] == infinity
                    || distance[via][to] == infinity) {
                continue;
            }

            distance[from][to] = Math.min(
                distance[from][to],
                distance[from][via]
                    + distance[via][to]
            );
        }
    }
}
```
---
## Why Must `via` Be the Outer Loop?
The dynamic-programming meaning is:
> After processing `via`, distances may use nodes `0` through `via` as intermediate vertices.

The previous stage must be complete before allowing the next intermediate node.

Therefore:
```java
for (via)
    for (from)
        for (to)
```
Changing this order can violate the DP transition.
---
## Floyd–Warshall and Negative Cycles
After Floyd–Warshall:
```java
distance[node][node] < 0
```
means a negative cycle is reachable from that node.

Normally:
```plain text
distance[node][node] = 0
```
A negative diagonal means traveling through a cycle can reduce the cost below zero.
---
## When to Prefer Floyd–Warshall
Use Floyd–Warshall when:
- You need distances between every pair of nodes.
- The number of vertices is small.
- Many queries will ask about different source-destination pairs.
- A matrix representation is convenient.
- Negative edges may exist, but negative cycles do not invalidate the requested result.

Avoid it for a large sparse graph because:
```plain text
Time:  O(V³)
Space: O(V²)
```
---
## Common Forms
## Common Form 1: Unweighted Shortest Path
Every move has equal cost.

Examples:
- Fewest graph edges
- Minimum number of moves
- Minimum number of transformations
- Minimum number of grid steps
### How it works
1. Start BFS from the source.
2. Give the source distance `0`.
3. Discover every unvisited neighbor at distance `current + 1`.
4. The first discovery of a node is its shortest distance.
5. Stop early when the destination is found.

**Memory flow:** `Explore distance d → Discover distance d + 1`
```java
queue.offer(source);
distance[source] = 0;

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
Practice:
- LC 1091 — Shortest Path in Binary Matrix
- LC 752 — Open the Lock
- LC 127 — Word Ladder
- LC 433 — Minimum Genetic Mutation
- LC 815 — Bus Routes
---
## Common Form 2: Multi-Source Shortest Distance
Several sources begin at distance `0`.

Examples:
- Infection spreads from several cells.
- Find every cell’s distance from the nearest zero.
- Find distance from the nearest gate.
- Find nearest source among many sources.
### How it works
1. Add every initial source to the queue.
2. Assign all source distances to `0`.
3. Run one BFS from all sources together.
4. Each undiscovered node is reached from its nearest source.
5. BFS levels represent simultaneous expansion.

**Memory flow:** `Initialize every source → Expand together → Record nearest distance`
```java
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
Practice:
- LC 994 — Rotting Oranges
- LC 542 — 01 Matrix
- LC 1162 — As Far from Land as Possible
- LC 1765 — Map of Highest Peak
- LC 286 — Walls and Gates
---
## Common Form 3: Implicit-State Shortest Path
Sometimes graph nodes and edges are not provided explicitly.
A state represents a node, and a valid operation generates a neighbor.

Examples:
```plain text
Lock combination
Word
Board configuration
Current stop
Current position
```
### How it works
1. Treat the starting configuration as the source node.
2. Generate all valid next states when processing it.
3. Skip forbidden or previously visited states.
4. Add new states to BFS.
5. Return the level when the target state is reached.

**Memory flow:** `State → Generate legal moves → BFS by number of moves`

Open Lock example:
```plain text
"0000"

Neighbors:
"1000", "9000"
"0100", "0900"
"0010", "0090"
"0001", "0009"
```
You do not need to build all `10,000` nodes before BFS. Generate neighbors only when a state is processed.

Practice:
- LC 752 — Open the Lock
- LC 127 — Word Ladder
- LC 433 — Minimum Genetic Mutation
- LC 773 — Sliding Puzzle
- LC 1345 — Jump Game IV
---
## Common Form 4: Standard Weighted Shortest Path
Edges have different non-negative costs.
### How it works
1. Store weighted neighbors in an adjacency list.
2. Initialize the source distance to zero.
3. Use a min-priority queue.
4. Poll the state with the smallest current distance.
5. Relax all outgoing edges.
6. Add improved neighbor states to the queue.

**Memory flow:** `Poll cheapest node → Relax weighted edges → Queue improvements`

Practice:
- LC 743 — Network Delay Time
- LC 787 — Cheapest Flights Within K Stops
- LC 1514 — Path with Maximum Probability
- LC 1976 — Number of Ways to Arrive at Destination
- LC 2662 — Minimum Cost of a Path With Special Roads

For LC 787, ordinary Dijkstra requires additional stop-count state; bounded Bellman–Ford is often simpler.
---
## Common Form 5: Minimax Path
Some paths are not scored by adding edge costs.

In Path With Minimum Effort, path cost is:
```plain text
maximum edge difference along the path
```
We want to minimize that maximum.
### How it works
1. Store the best known effort for every node.
2. When moving across an edge, calculate its local cost.
3. The candidate path effort is the worse of:
	- effort already used
	- new edge cost
4. Relax the neighbor if this candidate effort is smaller.
5. Use a min-priority queue as in Dijkstra.

**Memory flow:** `Carry worst edge so far → Minimize that worst value`
```java
int edgeDifference =
    Math.abs(
        heights[currentRow][currentCol]
        - heights[nextRow][nextCol]
    );

int candidateEffort = Math.max(
    currentEffort,
    edgeDifference
);
```
Why `Math.max`?
The path’s effort is determined by its most difficult edge.

Practice:
- LC 1631 — Path With Minimum Effort
- LC 778 — Swim in Rising Water
- LC 1102 — Path With Maximum Minimum Value
---
## Common Form 6: Maximum-Probability or Maximum-Product Path
Sometimes the best path maximizes a value rather than minimizing it.

For probabilities:
```plain text
path probability
= product of edge probabilities
```
Use a max-priority queue.
### How it works
1. Set the source probability to `1.0`.
2. Poll the node with the greatest current probability.
3. Multiply by each outgoing edge probability.
4. Update a neighbor when the new probability is larger.
5. Stop when the destination is removed as the best state.

**Memory flow:** `Poll most promising path → Multiply relationship → Keep maximum`
```java
double candidate =
    probability[current]
    * edge.probability;

if (candidate > probability[edge.node]) {
    probability[edge.node] = candidate;
}
```
Practice:
- LC 1514 — Path with Maximum Probability
- Currency-conversion variants with optimization objectives
---
## Common Form 7: Count the Number of Shortest Paths
Sometimes we need both:
```plain text
Shortest distance
Number of ways to achieve that distance
```
### How it works
For an edge from `current` to `next`:
```plain text
candidate < distance[next]
→ Found a better shortest distance
→ Replace distance
→ ways[next] = ways[current]

candidate == distance[next]
→ Found another shortest path
→ ways[next] += ways[current]
```
**Memory flow:** `Better distance replaces count → Equal distance adds count`
```java
if (candidate < distance[next]) {
    distance[next] = candidate;
    ways[next] = ways[current];

    queue.offer(
        new State(next, candidate)
    );
} else if (candidate == distance[next]) {
    ways[next] =
        (ways[next] + ways[current]) % MOD;
}
```
Practice:
- LC 1976 — Number of Ways to Arrive at Destination
- Number of Shortest Paths in an Unweighted Graph
---
## Common Form 8: Shortest Path with Limited Stops or Edges
The state is not described only by the current node.

Two routes reaching the same node may have:
```plain text
Different cost
Different number of edges used
```
A slightly more expensive path may be useful if it used fewer stops.
### How it works with bounded Bellman–Ford
1. Start with only the source distance known.
2. Perform one relaxation round per permitted edge.
3. Copy the previous distance array before each round.
4. Read from the previous array and write into the copy.
5. This prevents one round from using more than one new edge.

**Memory flow:** `One relaxation round → Allow one additional edge`
```java
int[] distance = new int[n];
Arrays.fill(distance, Integer.MAX_VALUE);

distance[source] = 0;

for (int edgesUsed = 0;
        edgesUsed <= maxStops;
        edgesUsed++) {
    int[] nextDistance =
        Arrays.copyOf(distance, n);

    for (int[] flight : flights) {
        int from = flight[0];
        int to = flight[1];
        int price = flight[2];

        if (distance[from]
                == Integer.MAX_VALUE) {
            continue;
        }

        nextDistance[to] = Math.min(
            nextDistance[to],
            distance[from] + price
        );
    }

    distance = nextDistance;
}
```
### Why copy the array?
If updates are immediately reused during the same round, one iteration could travel across several edges.

The copied array guarantees:
```plain text
Iteration 1 → paths using at most 1 edge
Iteration 2 → paths using at most 2 edges
...
```
Practice:
- LC 787 — Cheapest Flights Within K Stops
- Shortest Path with At Most K Edges
---
## Common Form 9: Negative-Weight Shortest Path
When negative edges exist, Dijkstra is unsafe.
Bellman–Ford repeatedly relaxes all edges.
### How it works
1. Initialize the source distance.
2. Relax every edge `V - 1` times.
3. Skip edges whose source remains unreachable.
4. Stop early if an iteration performs no update.
5. Optionally use one additional pass to detect a negative cycle.

**Memory flow:** `Relax every edge repeatedly → Propagate cheaper paths`

Practice:
- Bellman–Ford shortest-path problems
- Currency-arbitrage variants
- LC 787 — Cheapest Flights Within K Stops
---
## Common Form 10: Detect a Negative Cycle
A negative cycle allows the path cost to decrease indefinitely.

Example:
```plain text
A → B = 2
B → C = -5
C → A = 1

Cycle total = -2
```
Repeating the cycle keeps reducing total cost.
### How it works
1. Run `V - 1` Bellman–Ford relaxation rounds.
2. Perform one additional round.
3. If any reachable distance improves, a negative cycle exists.
4. If detecting a cycle anywhere, initialize appropriately or use a super-source.

**Memory flow:** `Finish normal relaxation → Test whether improvement is still possible`

Practice:
- Detect Negative Cycle
- Currency Arbitrage
- LC 2307 — Check for Contradictions in Equations, conceptually related
---
## Common Form 11: All-Pairs Shortest Path
The problem needs shortest distances for many or all source-destination pairs.
### How it works
1. Initialize a distance matrix.
2. Add all direct edge costs.
3. Set every diagonal entry to zero.
4. Try each node as an intermediate vertex.
5. Update every `from → to` pair through that intermediate.

**Memory flow:** `Allow one more intermediate node → Improve every pair`
```java
for (int via = 0; via < n; via++) {
    for (int from = 0; from < n; from++) {
        for (int to = 0; to < n; to++) {
            if (distance[from][via] == infinity
                    || distance[via][to] == infinity) {
                continue;
            }

            distance[from][to] = Math.min(
                distance[from][to],
                distance[from][via]
                    + distance[via][to]
            );
        }
    }
}
```
Practice:
- LC 1334 — Find the City With the Smallest Number of Neighbors
- LC 1462 — Course Schedule IV
- LC 399 — Evaluate Division, multiplicative variation
---
## Common Form 12: Threshold-Reachable Nodes
These problems ask:
```plain text
How many nodes can be reached with shortest distance <= threshold?
```
### How it works
1. Calculate shortest distances.
2. For every source, count destinations inside the threshold.
3. Compare these counts.
4. Apply the required tie-breaking rule.

For small graphs, use Floyd–Warshall.
For larger sparse graphs with non-negative weights, run Dijkstra from each source.

**Memory flow:** `Compute distances → Count values inside threshold → Apply tie rule`

Practice:
- LC 1334 — Find the City With the Smallest Number of Neighbors
---
## Common Form 13: Reconstruct the Shortest Path
Distance alone does not preserve the actual route.
Store the predecessor responsible for each improvement.
### How it works
1. When a shorter path to `next` is found, set:
	`parent[next] = current`.
2. After reaching the destination, follow parent links backward.
3. Continue until the source is reached.
4. Reverse the collected nodes.

**Memory flow:** `Improve distance → Save predecessor → Trace destination backward`
```java
if (candidate < distance[next]) {
    distance[next] = candidate;
    parent[next] = current;

    queue.offer(
        new State(next, candidate)
    );
}
```
```java
List<Integer> path = new ArrayList<>();

int node = destination;

while (node != -1) {
    path.add(node);
    node = parent[node];
}

Collections.reverse(path);
```
Practice:
- Print Shortest Path in an Unweighted Graph
- Print Dijkstra’s Shortest Path
- LC 126 — Word Ladder II
---
## Choosing Single-Source versus All-Pairs
## One source
Use:
```plain text
BFS
Dijkstra
Bellman–Ford
```
depending on edge weights.
## Every source
Options:
```plain text
Run BFS from every source
Run Dijkstra from every source
Use Floyd–Warshall
```
General guideline:
```plain text
Small graph or dense graph
→ Floyd–Warshall

Large sparse graph with non-negative weights
→ Dijkstra from required sources

Unweighted graph
→ BFS from required sources
```
---
## Shortest Path versus Minimum Spanning Tree
These solve different problems.
## Shortest path
Minimizes travel cost from a source:
```plain text
source → destination
```
## Minimum spanning tree
Minimizes the total edge cost required to connect every node.
A Minimum Spanning Tree does not guarantee the shortest route between every pair.
---
## Integer Overflow and Infinity
Avoid:
```java
Integer.MAX_VALUE + weight
```
It may overflow into a negative number.

Always check reachability before adding:
```java
if (distance[from] == infinity) {
    continue;
}
```
Prefer:
```java
long[] distance
```
for large path costs.

Safe infinity:
```java
long infinity = Long.MAX_VALUE / 4;
```
This leaves room for addition without overflow.
---
## Common Mistakes
- Using BFS when edge weights differ.
- Using Dijkstra with negative edges.
- Using Floyd–Warshall for a huge sparse graph.
- Forgetting to initialize the source distance to zero.
- Forgetting to initialize Floyd–Warshall diagonals to zero.
- Adding only one direction for an undirected edge.
- Adding both directions for a directed edge.
- Treating the first weighted discovery as final.
- Marking a Dijkstra node visited when adding it to the priority queue.
- Forgetting to skip stale priority-queue entries.
- Ordering the Dijkstra priority queue by node rather than distance.
- Using subtraction in comparators and risking overflow.
- Calculating minimax path cost using addition instead of `Math.max`.
- Using a min-heap for maximum-probability paths.
- Forgetting to handle equal shortest paths when counting routes.
- Reusing current-round Bellman–Ford updates in a stop-limited problem.
- Running Bellman–Ford fewer than the required relaxation rounds.
- Claiming every Bellman–Ford update represents a separate path.
- Forgetting the infinity guard before addition.
- Putting `via` inside the other Floyd–Warshall loops.
- Setting the Floyd–Warshall diagonal to `1` instead of `0`.
- Forgetting `Math.min` when multiple edges connect the same pair.
- Counting the source itself when the question asks for neighbors.
- Mishandling the tie-breaking rule.
- Storing only distances when the actual route must be returned.
---
## Quick Interview Checklist
1. What does one graph node represent?
2. What does one edge represent?
3. Is the graph directed or undirected?
4. Are all edge costs equal?
5. Can edge weights be negative?
6. Can a negative cycle exist?
7. Do I need one source or every source?
8. Is there one destination or many queries?
9. Is the graph sparse or dense?
10. Is the graph small enough for `O(V³)`?
11. Are there multiple starting sources?
12. Is there a restriction on stops or edges?
13. Does node alone describe the state?
14. Is path cost additive?
15. Is the objective a minimum sum, minimax, or maximum product?
16. Do I need the actual path?
17. Do I need the number of shortest paths?
18. When is a node’s result final?
19. Can priority-queue entries become stale?
20. Should I use `long` for distances?
21. Did I guard against adding infinity?
22. Are matrix diagonals initialized correctly?
23. What should happen for unreachable nodes?
24. What are the time and space complexities?
---
## Complexity Analysis
Let:
```plain text
V = number of vertices
E = number of edges
```
## BFS
```plain text
Time:  O(V + E)
Space: O(V)
```
## Multi-source BFS
All sources share one traversal:
```plain text
Time:  O(V + E)
Space: O(V)
```
## Dijkstra with adjacency list and binary heap
```plain text
Time:  O((V + E) log V)
Space: O(V + E)
```
Often simplified to:
```plain text
O(E log V)
```
for a connected graph.
## Bellman–Ford
Every edge is processed up to `V - 1` times:
```plain text
Time:  O(VE)
Space: O(V)
```
## Floyd–Warshall
```plain text
Time:  O(V³)
Space: O(V²)
```
## Repeated Dijkstra from every source
```plain text
Time: O(V × (V + E) log V)
```
This may be preferable to Floyd–Warshall for sparse graphs.
---
## Final Algorithm Selection Model
```plain text
Equal edge costs?
→ BFS

Several starting nodes?
→ Multi-source BFS

Different but non-negative weights?
→ Dijkstra

Negative edges?
→ Bellman–Ford

Limited number of stops or edges?
→ Bounded Bellman–Ford

All source-destination pairs?
→ Floyd–Warshall

Minimize the worst edge?
→ Minimax Dijkstra

Maximize multiplied probabilities?
→ Max-priority-queue Dijkstra
```
The most important interview question is:
> “What exactly does path cost mean in this problem, and which algorithm processes that cost correctly?”
