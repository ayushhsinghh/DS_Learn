A linked list stores values in nodes connected through pointers. The main challenge is changing connections without losing the remaining list.
> **Core mental model:** Before changing a pointer, save every connection you will still need.
```plain text
Save next → Change pointer → Move forward
```
## How to Identify Linked-List Patterns
Look for these signals:
- The input is a `ListNode`.
- Nodes must be reversed, removed, merged, reordered, or grouped.
- The problem asks about a cycle, middle node, nth node from the end, or intersection.
- The list should be modified in place.
> **Most important question:** What should each node’s `next` pointer reference after the operation?
## Pointer Example
To remove node `2` from `1 → 2 → 3`, make node `1` point directly to node `3`:
```java
previous.next = current.next;
```
A linked-list node is removed by changing a connection, not by shifting elements.
## Common Form 1: Basic Traversal
Use this when every node must be inspected once.
**How it works:**
1. Start a pointer at `head`.
2. Process the current node.
3. Move to `current.next`.
4. Stop when the pointer becomes `null`.
**Memory flow:** `Process current → Move next`
```java
ListNode current = head;
while (current != null) {
    // Process current.val
    current = current.next;
}
```
Practice:
- LC 1290 — Convert Binary Number in a Linked List to Integer
- LC 203 — Remove Linked List Elements
- LC 83 — Remove Duplicates from Sorted List
## Common Form 2: Dummy Node
Use a dummy node when an operation might change or remove the head.
**How it works:**
1. Create a dummy node pointing to `head`.
2. Traverse from the dummy node.
3. Modify nodes through their predecessor.
4. Return `dummy.next`, the possibly updated head.
**Memory flow:** `Dummy before head → Modify safely → Return dummy.next`
```java
ListNode dummy = new ListNode(0);
dummy.next = head;
ListNode current = dummy;

while (current.next != null) {
    if (shouldRemove(current.next)) {
        current.next = current.next.next;
    } else {
        current = current.next;
    }
}
return dummy.next;
```
Practice:
- LC 19 — Remove Nth Node From End of List
- LC 21 — Merge Two Sorted Lists
- LC 82 — Remove Duplicates from Sorted List II
- LC 203 — Remove Linked List Elements
## Common Form 3: Fast and Slow Pointers
Use this when the problem involves relative distance, the middle, or a cycle.
**How it works:**
1. Start `slow` and `fast` at the same node.
2. Move `slow` one step and `fast` two steps.
3. When `fast` reaches the end, `slow` is near the middle.
4. If they meet before the end, the list contains a cycle.
**Memory flow:** `Slow moves 1 → Fast moves 2 → Distance reveals structure`
```java
ListNode slow = head;
ListNode fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
```
Practice:
- LC 141 — Linked List Cycle
- LC 142 — Linked List Cycle II
- LC 876 — Middle of the Linked List
- LC 234 — Palindrome Linked List
- LC 143 — Reorder List
## Common Form 4: Fixed Gap Between Two Pointers
Use this to find a node relative to the end without first calculating the list’s length.
**How it works:**
1. Move `fast` ahead by the required gap.
2. Move `slow` and `fast` together.
3. When `fast` reaches the end, `slow` is the required distance from the end.
4. Use a dummy node when the target may be the head.
**Memory flow:** `Create gap → Move together → Slow finds target`
```java
ListNode dummy = new ListNode(0, head);
ListNode slow = dummy;
ListNode fast = dummy;

for (int i = 0; i <= n; i++) fast = fast.next;
while (fast != null) {
    slow = slow.next;
    fast = fast.next;
}
slow.next = slow.next.next;
return dummy.next;
```
Practice:
- LC 19 — Remove Nth Node From End of List
- LC 61 — Rotate List
- LC 1721 — Swapping Nodes in a Linked List
## Common Form 5: Reverse a Linked List
Use this when node directions or a portion of the list must be reversed.
**How it works:**
1. Save `current.next`.
2. Point `current.next` backward to `previous`.
3. Move `previous` to `current`.
4. Move `current` to the saved node.
5. When traversal ends, `previous` is the new head.
**Memory flow:** `Save next → Reverse link → Move both`
```java
ListNode previous = null;
ListNode current = head;

while (current != null) {
    ListNode next = current.next;
    current.next = previous;
    previous = current;
    current = next;
}
return previous;
```
> **Invariant:** `previous` is the head of the reversed portion; `current` is the first node of the unreversed portion.
Practice:
- LC 206 — Reverse Linked List
- LC 92 — Reverse Linked List II
- LC 25 — Reverse Nodes in k-Group
- LC 234 — Palindrome Linked List
## Common Form 6: Merge Two Sorted Lists
Use one pointer for each sorted list and attach the smaller current node.
**How it works:**
1. Create a dummy result node.
2. Compare the current nodes of both lists.
3. Attach the smaller node and advance its pointer.
4. Move the result tail.
5. Attach the remaining list when one becomes empty.
**Memory flow:** `Compare → Attach smaller → Advance`
```java
ListNode dummy = new ListNode(0);
ListNode tail = dummy;

while (first != null && second != null) {
    if (first.val <= second.val) {
        tail.next = first;
        first = first.next;
    } else {
        tail.next = second;
        second = second.next;
    }
    tail = tail.next;
}
tail.next = first != null ? first : second;
return dummy.next;
```
Practice:
- LC 21 — Merge Two Sorted Lists
- LC 23 — Merge k Sorted Lists
- LC 148 — Sort List
## Common Form 7: Find the Start of a Cycle
Floyd’s algorithm finds whether a cycle exists and where it begins.
**How it works:**
1. Move `slow` by one and `fast` by two until they meet.
2. Reset one pointer to `head`.
3. Move both one step at a time.
4. Their next meeting point is the cycle entrance.
**Memory flow:** `Meet inside cycle → Reset one → Move equally → Find entrance`
```java
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow == fast) {
        slow = head;
        while (slow != fast) {
            slow = slow.next;
            fast = fast.next;
        }
        return slow;
    }
}
return null;
```
Practice:
- LC 141 — Linked List Cycle
- LC 142 — Linked List Cycle II
- LC 287 — Find the Duplicate Number
## Common Form 8: Find the Intersection of Two Lists
Use this when two lists may eventually share the same node chain.
**How it works:**
1. Start one pointer at each head.
2. Move each pointer one node at a time.
3. At the end of one list, redirect it to the other list’s head.
4. Both pointers now travel the same combined distance.
5. They meet at the intersection or both become `null`.
**Memory flow:** `Walk own list → Switch heads → Equalize distance`
```java
ListNode first = headA;
ListNode second = headB;

while (first != second) {
    first = first == null ? headB : first.next;
    second = second == null ? headA : second.next;
}
return first;
```
Practice:
- LC 160 — Intersection of Two Linked Lists
## Common Form 9: Split, Reverse, and Merge
Use this when a problem combines middle-finding, reversal, and comparison or reordering.
**How it works:**
1. Find the middle with slow and fast pointers.
2. Reverse the second half.
3. Compare or merge the two halves.
4. Save both next nodes before rewiring.
5. Restore the original list if required.
**Memory flow:** `Find middle → Reverse second half → Compare or merge`
```java
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}

ListNode second = reverse(slow);
ListNode first = head;
while (second != null) {
    ListNode nextFirst = first.next;
    ListNode nextSecond = second.next;
    first.next = second;
    second.next = nextFirst;
    first = nextFirst;
    second = nextSecond;
}
```
Practice:
- LC 143 — Reorder List
- LC 234 — Palindrome Linked List
- LC 2130 — Maximum Twin Sum of a Linked List
## Quick Interview Checklist
1. Can the head change?
2. Would a dummy node remove a special case?
3. Do I need the current node or the node before it?
4. Which pointer am I changing, and have I saved its original `next`?
5. Do I need traversal, slow/fast, a fixed gap, reversal, or merging?
6. What does each pointer represent?
7. What portion is already completed?
8. Could the rewiring accidentally create a cycle?
9. Must the original list be restored?
### Technique Decision Rule
```plain text
Inspect every node          → basic traversal
Head may change             → dummy node
Find middle or cycle        → slow and fast
Find nth node from end      → fixed pointer gap
Change direction            → reversal
Combine sorted lists        → dummy + merge pointers
Find intersection           → switch heads
Reorder or palindrome       → middle + reverse + merge/compare
```
## Common Mistakes
- Accessing `node.next` before checking whether the node is `null`.
- Changing `current.next` before saving the remainder of the list.
- Returning `head` when the head may have changed instead of `dummy.next` or the new head.
- Moving the predecessor immediately after deleting its next node.
- Comparing values when node identity is required.
- Using an unsafe fast-pointer condition instead of `fast != null && fast.next != null`.
- Creating an accidental cycle while merging or reordering.
- Reversing too many or too few nodes in a partial reversal.
- Forgetting to reconnect a reversed section.
- Ignoring empty and single-node inputs.
## Complexity Analysis
- Basic traversal, reversal, and slow/fast pointers: `O(n)` time and `O(1)` space.
- Merge lists of lengths `m` and `n`: `O(m + n)` time and `O(1)` auxiliary space.
- Recursive traversal or reversal: `O(n)` time and `O(n)` call-stack space.
- Merge `k` sorted lists containing `N` total nodes with a heap: `O(N log k)` time and `O(k)` space.
---
> **Final reusable model:** Save the connections you still need, change one link at a time, and maintain a clear meaning for every pointer.
```plain text
Understand pointer roles → Save required links → Rewire safely → Move forward
```
<empty-block/>
