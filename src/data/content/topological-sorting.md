Topological sorting creates a linear ordering of vertices in a directed graph such that:
```plain text
For every directed edge:

u → v

u appears before v in the ordering.
```
Example:
```plain text
0 → 1
0 → 2
1 → 3
2 → 3
```
Valid topological orders include:
```plain text
0, 1, 2, 3
0, 2, 1, 3
```
Both are valid because every dependency appears before the node that depends on it.
---
## When Is Topological Sorting Possible?
Topological sorting is possible only for a:
```plain text
Directed Acyclic Graph
```
Also called a:
```plain text
DAG
```
## Why must the graph be directed?
Topological ordering represents a before-and-after relationship:
```plain text
prerequisite → dependent task
```
## Why must it be acyclic?
Consider:
```plain text
A → B
B → C
C → A
```
The requirements say:
```plain text
A must come before B
B must come before C
C must come before A
```
No ordering can satisfy all three.

Therefore:
> A directed graph has a valid topological order if and only if it contains no directed cycle.

---
## Core Mental Model
Topological sorting can be understood in two ways.
## Kahn’s algorithm
> Repeatedly complete nodes whose prerequisites are already resolved.

```plain text
Find indegree-zero nodes
→ Process them
→ Remove their outgoing dependency effects
→ Discover newly available nodes
```
## DFS topological sorting
> A node should enter the answer only after everything depending on its outgoing path has been processed.

```plain text
Explore descendants
→ Finish current node
→ Add current node
→ Reverse finishing order
```
---
## How to Identify Topological-Sort Problems
Look for these signals:
- Tasks have prerequisites.
- Courses depend on other courses.
- Jobs must execute in a valid order.
- Ingredients are needed to create recipes.
- One character must appear before another.
- One item must be above or left of another.
- The input contains directed before-and-after conditions.
- You need to determine whether all dependencies can be satisfied.
- You need to detect a cycle in a directed graph.
- The question asks for a valid build, execution, or dependency order.

Common wording:
```plain text
prerequisite
dependency
must come before
requires
can finish
valid order
build order
execution order
```
### Most important recognition question
> Does `A` need to happen before `B`?

If yes, represent it using:
```plain text
A → B
```
and consider topological sorting.
---
## Constructing the Graph
Suppose:
```plain text
Course 1 requires Course 0
```
The correct edge is:
```plain text
0 → 1
```
because completing course `0` makes course `1` closer to being available.
```java
graph.get(0).add(1);
indegree[1]++;
```
### Dependency rule
```plain text
prerequisite → dependent
```
Not:
```plain text
dependent → prerequisite
```
unless the selected algorithm and meaning are deliberately designed that way.
---
## Understanding Indegree
For a node:
```plain text
indegree = number of incoming edges
```
In dependency problems, this usually means:
> The number of unresolved prerequisites for this node.

Example:
```plain text
A → C
B → C
```
Node `C` has:
```plain text
indegree[C] = 2
```
After processing `A`:
```plain text
indegree[C] = 1
```
After processing `B`:
```plain text
indegree[C] = 0
```
Now `C` is available.
---
## Kahn’s Algorithm
Kahn’s algorithm performs topological sorting using BFS and indegrees.
### How it works
1. Build the directed graph.
2. Calculate every node’s indegree.
3. Add all indegree-zero nodes to a queue.
4. Remove one available node from the queue.
5. Add it to the topological order.
6. Decrease the indegree of its outgoing neighbors.
7. When a neighbor’s indegree becomes zero, add it to the queue.
8. If fewer than `V` nodes are processed, a cycle exists.

**Memory flow:** `Resolve available node → Remove its dependency effect → Unlock neighbors`
```java
int[] topologicalSort(
        int vertices,
        int[][] edges
) {
    List<List<Integer>> graph =
        new ArrayList<>();

    for (int node = 0; node < vertices; node++) {
        graph.add(new ArrayList<>());
    }

    int[] indegree = new int[vertices];

    for (int[] edge : edges) {
        int prerequisite = edge[0];
        int dependent = edge[1];

        graph.get(prerequisite).add(dependent);
        indegree[dependent]++;
    }

    Deque<Integer> queue = new ArrayDeque<>();

    for (int node = 0; node < vertices; node++) {
        if (indegree[node] == 0) {
            queue.offer(node);
        }
    }

    int[] order = new int[vertices];
    int index = 0;

    while (!queue.isEmpty()) {
        int node = queue.poll();

        order[index++] = node;

        for (int neighbor : graph.get(node)) {
            indegree[neighbor]--;

            if (indegree[neighbor] == 0) {
                queue.offer(neighbor);
            }
        }
    }

    if (index != vertices) {
        return new int[0];
    }

    return order;
}
```
---
## Why Kahn’s Algorithm Does Not Need `visited`
A node enters the queue only when:
```java
indegree[node] == 0
```
Its indegree reaches zero only once.
After it reaches zero, no remaining incoming edge can reduce it to zero again.

Therefore:
```plain text
indegree state controls when the node can enter the queue
```
This replaces the normal purpose of `visited`.
> Kahn’s algorithm still tracks processing state—it tracks it through indegrees instead of a separate visited array.

---
## Detecting a Cycle with Kahn’s Algorithm
Suppose a cycle exists:
```plain text
0 → 1
↑   ↓
3 ← 2
```
Every node in the cycle has at least one incoming edge from another node in the cycle.

Therefore, none of them can reach:
```plain text
indegree = 0
```
The queue eventually becomes empty while some nodes remain unprocessed.

Cycle check:
```java
return processedNodes != vertices;
```
Mental model:
> If some nodes can never have all prerequisites resolved, they belong to or depend on a cycle.

---
## DFS Topological Sorting
DFS creates a topological order using finishing time.
A node is added only after all its outgoing neighbors have been explored.
### How it works
1. Start DFS from every unvisited node.
2. Recursively explore each outgoing neighbor.
3. After all neighbors finish, add the current node to a stack.
4. Continue until every node is processed.
5. Pop the stack to obtain topological order.

**Memory flow:** `Explore dependencies forward → Add node while returning → Reverse completion order`
```java
void dfs(
        int node,
        List<List<Integer>> graph,
        boolean[] visited,
        Deque<Integer> order
) {
    visited[node] = true;

    for (int neighbor : graph.get(node)) {
        if (!visited[neighbor]) {
            dfs(neighbor, graph, visited, order);
        }
    }

    order.push(node);
}
```
```java
int[] topologicalSort(
        int vertices,
        List<List<Integer>> graph
) {
    boolean[] visited = new boolean[vertices];
    Deque<Integer> stack = new ArrayDeque<>();

    for (int node = 0; node < vertices; node++) {
        if (!visited[node]) {
            dfs(node, graph, visited, stack);
        }
    }

    int[] answer = new int[vertices];
    int index = 0;

    while (!stack.isEmpty()) {
        answer[index++] = stack.pop();
    }

    return answer;
}
```
### Important limitation
A simple boolean `visited` array creates an order, but it does not correctly detect a directed cycle.
For cycle detection, DFS needs three states.
---
## Three-State DFS
Each node can be in one of three states:
```plain text
0 → unvisited
1 → visiting: currently on the active DFS path
2 → completed: fully processed
```
### Cycle condition
If DFS finds an edge to a node with:
```plain text
state[neighbor] == 1
```
that edge returns to the active recursive path and creates a cycle.
### How it works
1. Mark the current node `visiting`.
2. Explore every outgoing neighbor.
3. If a neighbor is already `visiting`, a cycle exists.
4. Recursively process unvisited neighbors.
5. After every neighbor completes, mark the node `completed`.
6. Add it to the finishing-order stack.

**Memory flow:** `Enter active path → Explore → Detect return to active path → Complete`
```java
boolean dfs(
        int node,
        List<List<Integer>> graph,
        int[] state,
        Deque<Integer> order
) {
    state[node] = 1;

    for (int neighbor : graph.get(node)) {
        if (state[neighbor] == 1) {
            return false;
        }

        if (state[neighbor] == 0
                && !dfs(
                    neighbor,
                    graph,
                    state,
                    order
                )) {
            return false;
        }
    }

    state[node] = 2;
    order.push(node);

    return true;
}
```
```java
for (int node = 0; node < vertices; node++) {
    if (state[node] == 0
            && !dfs(node, graph, state, order)) {
        return new int[0];
    }
}
```
---
## Why DFS Adds the Node After Its Neighbors
For:
```plain text
A → B
```
`A` must appear before `B`.
DFS from `A` first reaches `B`.

Finishing order:
```plain text
B finishes first
A finishes second
```
If we add during finishing:
```plain text
B, A
```
This is reversed.

Putting nodes onto a stack gives:
```plain text
A, B
```
which is the required topological order.
> DFS topological sorting is reverse postorder.

---
## Kahn’s Algorithm versus DFS
## Kahn’s algorithm
Uses:
```plain text
Indegree array + queue
```
Best when:
- The problem describes resolved prerequisites.
- You need to process currently available items.
- External supplies or starting resources exist.
- You want simple cycle detection using processed count.
- You need a lexicographically smallest ordering with a priority queue.
## DFS approach
Uses:
```plain text
Three-state array + recursion stack
```
Best when:
- Directed-cycle detection is naturally recursive.
- You already have DFS-based graph logic.
- You want reverse postorder.
- You need to process descendant information during DFS.
## Complexity
Both require:
```plain text
Time:  O(V + E)
Space: O(V + E)
```
---
## Common Forms
## Common Form 1: Return One Valid Ordering
The question asks for any ordering satisfying all dependencies.
Several valid answers may exist.
### How it works
1. Create edges from prerequisites to dependent nodes.
2. Run Kahn’s algorithm or DFS topological sorting.
3. Store nodes in the order they become resolved.
4. Return the result only if every node was processed.

**Memory flow:** `Build dependency graph → Resolve all nodes → Return order`

Kahn’s algorithm template:
```java
while (!queue.isEmpty()) {
    int node = queue.poll();
    order[index++] = node;

    for (int neighbor : graph.get(node)) {
        indegree[neighbor]--;

        if (indegree[neighbor] == 0) {
            queue.offer(neighbor);
        }
    }
}

return index == vertices
    ? order
    : new int[0];
```
Practice:
- LC 210 — Course Schedule II
- LC 269 — Alien Dictionary
- LC 2392 — Build a Matrix With Conditions
- LC 1203 — Sort Items by Groups Respecting Dependencies
---
## Common Form 2: Determine Whether All Tasks Can Finish
Sometimes the actual order is unnecessary. We only need to determine whether a valid order exists.
### How it works with Kahn’s algorithm
1. Process every indegree-zero node.
2. Count how many nodes are processed.
3. If the count equals the total number of nodes, no cycle exists.
4. Otherwise, some nodes remain blocked by a cycle.

**Memory flow:** `Count resolved nodes → Compare with total`
```java
int processed = 0;

while (!queue.isEmpty()) {
    int node = queue.poll();
    processed++;

    for (int neighbor : graph.get(node)) {
        indegree[neighbor]--;

        if (indegree[neighbor] == 0) {
            queue.offer(neighbor);
        }
    }
}

return processed == numCourses;
```
### How it works with DFS
Return `false` when an edge reaches a currently visiting node.

Practice:
- LC 207 — Course Schedule
- LC 802 — Find Eventual Safe States
- LC 261 — Graph Valid Tree, for the undirected variation
---
## Common Form 3: Resolve Dependencies from Available Supplies
Some nodes are available initially even though they are not part of the result.

Example:
```plain text
Supplies → ingredients already available
Recipes  → nodes that become available later
```
### How it works
1. Create an edge from every required item to the recipe depending on it.
2. Set each recipe’s indegree to its number of required ingredients.
3. Add all initial supplies to the queue.
4. Process a supply or completed recipe as a resolved dependency.
5. Decrease the indegree of recipes depending on it.
6. When a recipe reaches zero, save it and add it to the queue.
7. The completed recipe can now act as an ingredient for other recipes.

**Memory flow:** `Start with available resources → Unlock recipes → Use recipes as resources`
```java
for (String supply : supplies) {
    queue.offer(supply);
}

while (!queue.isEmpty()) {
    String available = queue.poll();

    for (String recipe :
            graph.getOrDefault(
                available,
                List.of()
            )) {
        indegree.put(
            recipe,
            indegree.get(recipe) - 1
        );

        if (indegree.get(recipe) == 0) {
            answer.add(recipe);
            queue.offer(recipe);
        }
    }
}
```
### Why add supplies to the queue?
The queue represents:
```plain text
resolved and currently usable items
```
It does not represent only recipes.

Practice:
- LC 2115 — Find All Possible Recipes from Given Supplies
- Build-system dependency questions
- Package installation dependencies
---
## Common Form 4: Infer Ordering from Sorted Information
Sometimes edges are not provided directly. They must be inferred.
In Alien Dictionary, two adjacent sorted words reveal the ordering of their first different characters.

Example:
```plain text
"wrt"
"wrf"
```
First difference:
```plain text
t before f
```
Therefore:
```plain text
t → f
```
### How it works
1. Compare every adjacent pair of words.
2. Find their first different character.
3. Add an edge from the first word’s character to the second word’s character.
4. Stop comparing that word pair after the first difference.
5. Run topological sorting over all characters.

**Memory flow:** `Infer constraints → Build directed graph → Topologically order symbols`
### Invalid prefix case
This ordering is impossible:
```plain text
"abc"
"ab"
```
A longer word cannot appear before its exact prefix in lexicographic order.

Practice:
- LC 269 — Alien Dictionary
- LC 953 — Verifying an Alien Dictionary
- Derive Alphabet Order
---
## Common Form 5: Lexicographically Smallest Topological Order
If several nodes currently have indegree zero, ordinary Kahn’s algorithm may choose any of them.
If the smallest possible ordering is required, use a min-heap.
### How it works
1. Add every indegree-zero node to a priority queue.
2. Always process the smallest available node.
3. Decrease neighbor indegrees normally.
4. Add newly available nodes to the priority queue.
5. The result is the lexicographically smallest valid topological ordering.

**Memory flow:** `Track all available nodes → Always choose smallest`
```java
PriorityQueue<Integer> available =
    new PriorityQueue<>();

for (int node = 0; node < vertices; node++) {
    if (indegree[node] == 0) {
        available.offer(node);
    }
}

while (!available.isEmpty()) {
    int node = available.poll();

    for (int neighbor : graph.get(node)) {
        indegree[neighbor]--;

        if (indegree[neighbor] == 0) {
            available.offer(neighbor);
        }
    }
}
```
### Complexity difference
Ordinary queue:
```plain text
O(V + E)
```
Priority queue:
```plain text
O((V + E) log V)
```
Practice:
- LC 269 — Alien Dictionary
- Lexicographically Smallest Topological Ordering
- Build order with priority rules
---
## Common Form 6: Two Independent Topological Orders
Some problems contain two independent dependency dimensions.

Example:
```plain text
Row conditions
Column conditions
```
A number’s row position and column position must each satisfy separate constraints.
### How it works
1. Topologically sort the row conditions.
2. Topologically sort the column conditions.
3. If either sort fails, return no solution.
4. Convert each order into a position map.
5. Place every value using its row and column positions.

**Memory flow:** `Sort each dimension → Map values to positions → Combine coordinates`
```java
int[] rowOrder =
    topologicalSort(k, rowConditions);

int[] columnOrder =
    topologicalSort(k, columnConditions);
```
```java
int[] rowPosition = new int[k + 1];
int[] columnPosition = new int[k + 1];

for (int index = 0; index < k; index++) {
    rowPosition[rowOrder[index]] = index;
    columnPosition[columnOrder[index]] = index;
}
```
```java
for (int value = 1; value <= k; value++) {
    matrix[rowPosition[value]]
          [columnPosition[value]] = value;
}
```
Practice:
- LC 2392 — Build a Matrix With Conditions
---
## Common Form 7: Find Eventual Safe Nodes
A safe node cannot eventually reach a directed cycle.
This can be solved with DFS states or reverse-graph topological sorting.
### DFS approach
A node is unsafe if any outgoing path reaches a cycle.

States can represent:
```plain text
0 → unvisited
1 → visiting or currently unsafe
2 → confirmed safe
```
### Reverse-graph Kahn approach
In the original graph, terminal nodes have:
```plain text
outdegree = 0
```
Reverse every edge. Then process original terminal nodes like indegree-zero nodes.
### How it works
1. Reverse all graph edges.
2. Treat original outdegree as the unresolved count.
3. Add all terminal nodes to the queue.
4. When a node is confirmed safe, reduce the unresolved count of nodes leading to it.
5. A node becomes safe when all of its outgoing paths lead to safe nodes.

**Memory flow:** `Start from terminal nodes → Propagate safety backward`

Practice:
- LC 802 — Find Eventual Safe States
- Directed-cycle dependency questions
---
## Common Form 8: Find All Ancestors or Prerequisites
Topological order ensures that a node is processed only after its prerequisites.
This allows prerequisite information to be propagated forward.
### How it works
1. Create a set of ancestors for every node.
2. Process nodes in topological order.
3. For every edge `node → neighbor`:
	- Add `node` to the neighbor’s ancestor set.
	- Add all ancestors of `node` to the neighbor’s set.
4. Convert the sets into the required output.

**Memory flow:** `Process prerequisites first → Forward accumulated ancestor information`
```java
for (int neighbor : graph.get(node)) {
    ancestors.get(neighbor).add(node);

    ancestors.get(neighbor).addAll(
        ancestors.get(node)
    );

    indegree[neighbor]--;

    if (indegree[neighbor] == 0) {
        queue.offer(neighbor);
    }
}
```
Practice:
- LC 2192 — All Ancestors of a Node in a DAG
- LC 1462 — Course Schedule IV
---
## Common Form 9: Dynamic Programming on a DAG
A topological order ensures that all incoming dependencies are processed before the current node.
This makes it useful for dynamic programming on directed acyclic graphs.

Examples:
- Longest path in a DAG
- Minimum cost through dependencies
- Number of paths
- Largest color frequency on a path
### How it works
1. Topologically order the graph.
2. Define a DP value for every node.
3. Process nodes in topological order.
4. Propagate the current node’s result to outgoing neighbors.
5. If not all nodes are processed, reject because a cycle exists.

**Memory flow:** `Topological order → Finalize prerequisites → Propagate DP forward`

Generic transition:
```java
for (int node : topologicalOrder) {
    for (Edge edge : graph.get(node)) {
        dp[edge.to] = Math.max(
            dp[edge.to],
            dp[node] + edge.weight
        );
    }
}
```
Practice:
- LC 1857 — Largest Color Value in a Directed Graph
- LC 2050 — Parallel Courses III
- LC 2328 — Number of Increasing Paths in a Grid
- Longest Path in a DAG
---
## Common Form 10: Grouped Dependencies
Some problems require ordering both:
```plain text
individual items
and
groups containing those items
```
Dependencies may cross group boundaries.
### How it works
1. Assign standalone items to their own groups if necessary.
2. Build an item-level dependency graph.
3. Build a group-level dependency graph.
4. Topologically sort both graphs.
5. Arrange items according to group order while preserving item order.
6. Fail if either graph contains a cycle.

**Memory flow:** `Order groups → Order items → Combine without breaking either order`

Practice:
- LC 1203 — Sort Items by Groups Respecting Dependencies

This is an advanced extension of running multiple related topological sorts.
---
## Multiple Valid Topological Orders
A DAG may have more than one valid topological order.

Whenever multiple nodes have indegree zero:
```plain text
Any of them may legally appear next.
```
Example:
```plain text
0 → 2
1 → 2
```
Valid orders:
```plain text
0, 1, 2
1, 0, 2
```
Unless the question asks for a specific ordering, either answer is valid.
---
## Detecting Whether the Order Is Unique
During Kahn’s algorithm:
```plain text
queue size == 1
```
means only one node can be selected next.

If at any step:
```plain text
queue size > 1
```
multiple valid choices exist, so the topological order is not unique.
This technique appears in sequence-reconstruction problems.

Practice:
- LC 444 — Sequence Reconstruction
---
## Common Edge-Direction Examples
## Course prerequisites
Input:
```plain text
[course, prerequisite]
```
Edge:
```plain text
prerequisite → course
```
## Recipe ingredients
```plain text
ingredient → recipe
```
## Build dependency
```plain text
dependency → dependent project
```
## Character ordering
If `a` must appear before `b`:
```plain text
a → b
```
## Matrix row condition
If `above` must appear above `below`:
```plain text
above → below
```
The input pair order does not always equal the graph edge direction. Interpret what the pair means.
---
## Common Mistakes
- Building edges in the wrong direction.
- Increasing the indegree of the prerequisite instead of the dependent.
- Adding only one indegree-zero node initially.
- Forgetting isolated nodes with no edges.
- Assuming a topological order is unique.
- Returning a partial ordering when a cycle exists.
- Checking queue emptiness alone to detect a cycle.
- Forgetting to compare processed count with total vertices.
- Using a boolean visited array alone for DFS cycle detection.
- Confusing globally completed nodes with nodes on the current DFS path.
- Adding a DFS node before processing its neighbors.
- Forgetting to reverse DFS finishing order.
- Decreasing indegree more than once for a duplicated edge.
- Adding a node to Kahn’s queue before its indegree reaches zero.
- Adding a node repeatedly after its indegree becomes negative.
- Adding only desired output nodes to the queue when external supplies must also resolve dependencies.
- Treating topological sorting as valid for an undirected graph.
- Using topological sorting on a graph with unresolved cycles and expecting a complete answer.
- Missing the invalid-prefix case in Alien Dictionary.
- Using an ordinary queue when the smallest valid ordering is required.
- Combining two dependency dimensions into one graph when they must be ordered independently.
---
## Quick Interview Checklist
1. What does one graph node represent?
2. What does `u → v` mean?
3. Which item is the prerequisite?
4. Which node’s indegree should increase?
5. Are all vertices included, even isolated ones?
6. Is the graph directed?
7. Must the graph be acyclic?
8. Do I need an ordering or only cycle detection?
9. Should I use Kahn’s algorithm or DFS?
10. What does indegree represent in this problem?
11. Which nodes are initially resolved?
12. Are there external supplies or available resources?
13. Can multiple valid orders exist?
14. Is the smallest valid order required?
15. Should the queue be a priority queue?
16. Did I count processed nodes?
17. What should happen when a cycle exists?
18. Does DFS require three states?
19. When should DFS add a node to the result?
20. Are there multiple independent dependency graphs?
21. Can topological order support a later DP calculation?
22. Could duplicate edges corrupt indegrees?
23. What are `V` and `E` for the complexity?
---
## Complexity Analysis
Let:
```plain text
V = number of vertices
E = number of directed edges
```
## Graph construction
```plain text
Time:  O(V + E)
Space: O(V + E)
```
## Kahn’s algorithm
Every node enters the queue at most once, and every edge decreases an indegree once:
```plain text
Time:  O(V + E)
Space: O(V + E)
```
Additional queue and indegree storage:
```plain text
O(V)
```
## DFS topological sorting
Every node and edge is explored once:
```plain text
Time:  O(V + E)
Space: O(V + E)
```
Additional state and recursion stack:
```plain text
O(V)
```
## Priority-queue Kahn’s algorithm
Heap operations add a logarithmic factor:
```plain text
Time: O((V + E) log V)
```
## Ancestor propagation
If ancestor sets are copied between nodes, complexity can be significantly larger than ordinary topological sorting.

Depending on representation:
```plain text
Worst case: O(V² + E)
```
or greater with expensive set merging.
---
## Final Reusable Model
## Kahn’s algorithm
```plain text
Build prerequisite → dependent edges
→ Count unresolved prerequisites
→ Queue all zero-indegree nodes
→ Process one available node
→ Decrease dependent indegrees
→ Queue newly resolved nodes
→ Verify processed count
```
## DFS topological sorting
```plain text
Mark node visiting
→ Explore outgoing neighbors
→ Detect edges to visiting nodes
→ Mark node completed
→ Add during postorder
→ Reverse finishing order
```
The most important interview question is:
> “What does an edge mean, and which event makes a dependency resolved?”
