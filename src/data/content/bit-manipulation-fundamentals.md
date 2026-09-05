Bit manipulation means working directly with the binary digits of an integer.
The most important foundation is:

> A number is a collection of bits, and each bit represents an independent power of two.

## Binary Representation

Java normally displays numbers in decimal, but internally they are stored in binary.

```plain text
Decimal: 22

Bit position:  4  3  2  1  0
Bit value:    16  8  4  2  1
Binary:        1  0  1  1  0
```

Therefore:

```plain text
22 = 16 + 4 + 2
   = 10110
```

A bit containing `1` is a **set bit**.
A bit containing `0` is an **unset bit**.
In Java:

```java
String binary = Integer.toBinaryString(22);
System.out.println(binary); // 10110
```

## The Mask Mental Model

Most bit operations follow the same process:

1. Decide which bit position matters.
2. Create a mask with `1` at that position.
3. Apply the correct operator.

To select position `i`:

```java
int mask = 1 << i;
```

For `i = 2`:

```plain text
1        = 00001
1 << 2   = 00100
```

The mask points to bit position `2`.

## Essential Operators

Use this single example:

```plain text
num  = 22 = 10110
mask =  4 = 00100
```

### AND `&`: Check or Preserve

AND produces `1` only when both bits are `1`.

```plain text
10110
00100
-----
00100
```

Check whether bit `i` is set:

```java
boolean isSet = (num & (1 << i)) != 0;
```

For `num = 22` and `i = 2`, the answer is `true`.
**Mental model:**

> AND asks: “Does this selected bit exist?”

### OR `|`: Set a Bit

OR produces `1` when either bit is `1`.

```java
int result = num | (1 << i);
```

**Mental model:**

> OR forces the selected bit to `1`.

### XOR `^`: Toggle or Cancel

XOR produces `1` when the bits are different.

```plain text
0 ^ 0 = 0
1 ^ 1 = 0
0 ^ 1 = 1
1 ^ 0 = 1
```

Toggle bit `i`:

```java
int result = num ^ (1 << i);
```

Important properties:

```plain text
x ^ x = 0
x ^ 0 = x
```

This is why XOR can find a unique value:

```plain text
[4, 1, 2, 1, 2]

4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1 ^ 1) ^ (2 ^ 2)
= 4
```

**Mental model:**

> XOR means “different,” so equal values cancel.

### NOT `~`: Invert All Bits

NOT changes every `0` to `1` and every `1` to `0`.

```java
int result = ~num;
```

For Java integers:

```java
~x == -(x + 1)
```

Example:

```java
~5 == -6
```

This happens because Java uses 32-bit two’s-complement representation for `int`.

## Check, Set, Clear, and Toggle

These four expressions should become automatic:

```java
int mask = 1 << i;

// Check
boolean isSet = (num & mask) != 0;

// Set to 1
num = num | mask;

// Clear to 0
num = num & ~mask;

// Toggle
num = num ^ mask;
```

**Memory rule:**

```plain text
Check  → AND
Set    → OR
Clear  → AND with NOT
Toggle → XOR
```

## Shift Operators

### Left Shift `<<`

```java
x << k
```

Moves bits left by `k` positions.

```plain text
5      = 00101
5 << 2 = 10100 = 20
```

When there is no overflow:

```plain text
x << k ≈ x × 2^k
```

The most common interview use is creating a mask:

```java
1 << i
```

### Signed Right Shift `>>`

```java
x >> k
```

Moves bits right while preserving the sign.
For non-negative values:

```plain text
x >> k ≈ x / 2^k
```

Example:

```plain text
20 >> 2 = 5
```

### Unsigned Right Shift `>>>`

```java
x >>> k
```

Moves bits right and inserts zeros from the left.
Use it when you want to process the raw binary representation without copying the sign bit.

## Two Essential Expressions

### Remove the Rightmost Set Bit

```java
n & (n - 1)
```

Example:

```plain text
n       = 12 = 1100
n - 1   = 11 = 1011
result       = 1000
```

One set bit disappears.
This gives an efficient set-bit counter:

```java
int count = 0;

while (n != 0) {
    n &= n - 1;
    count++;
}
```

The loop runs once per set bit.

### Isolate the Rightmost Set Bit

```java
n & -n
```

Example:

```plain text
12       = 1100
12 & -12 = 0100 = 4
```

This is useful for separating numbers into groups, such as in **Single Number III**.

## Power-of-Two Intuition

A positive power of two has exactly one set bit:

```plain text
1  = 0001
2  = 0010
4  = 0100
8  = 1000
```

Subtracting one changes that bit and everything after it:

```plain text
8     = 1000
8 - 1 = 0111
```

Therefore:

```java
boolean isPowerOfTwo =
    n > 0 && (n & (n - 1)) == 0;
```

The `n > 0` check is required because `0 & -1` is also `0`.

## Java-Specific Details

### `int` Has 32 Bits

```java
int x;
```

Bit positions are `0` through `31`.

### `long` Has 64 Bits

Use a long mask when working with a `long`:

```java
long mask = 1L << i;
```

Without `L`, the shift begins as a 32-bit integer operation.

### Use Parentheses

Prefer:

```java
if ((num & (1 << i)) != 0)
```

Clear and readable bit expressions are more important than writing them compactly.

### Negative Numbers

Java stores signed integers using two’s complement. A negative `int` generally has many leading `1` bits.
That is why this still works for counting bits:

```java
while (n != 0) {
    n &= n - 1;
}
```

But repeatedly using signed `>>` can retain leading `1`s. Use `>>>` when zeros must enter from the left.

## How to Recognize Bit-Manipulation Questions

Consider bits when the question mentions:

- Binary representation
- Set bits or Hamming distance
- Powers of two
- One unique number among duplicates
- XOR of a range or subarray
- Checking or changing flags
- Restrictions on arithmetic operators
- Very small sets that can be represented by bits
- Maximizing XOR

## Interview Problem-Solving Checklist

Before writing code, ask:

1. What does each bit represent?
2. Do I need to check, set, clear, or toggle a bit?
3. Can duplicate values cancel using XOR?
4. Can `n & (n - 1)` remove useful work?
5. Do I need to inspect all 32 bit positions?
6. Am I using `int` or `long`?
7. Can negative values appear?
8. What invariant does the bit operation preserve?

## Foundation to Memorize

```plain text
Create mask       → 1 << i
Check bit         → n & mask
Set bit           → n | mask
Clear bit         → n & ~mask
Toggle bit        → n ^ mask

Remove lowest 1   → n & (n - 1)
Isolate lowest 1  → n & -n

x ^ x = 0
x ^ 0 = x
```

The key interview mindset is:

> Do not memorize an unexplained bit trick. Write the number in binary, identify what must happen to each bit, and then choose the operator that produces that behavior.

---

## Core Patterns

## Check, Set, Clear, and Toggle Bits

To work with bit position `i`, create:

```java
int mask = 1 << i;
```

Operations:

```java
// Check bit
(num & mask) != 0

// Set bit to 1
num | mask

// Clear bit to 0
num & ~mask

// Toggle bit
num ^ mask
```

Example: `num = 10`, binary `1010`, and `i = 2`

```plain text
mask       = 0100
check      = 1010 & 0100 = 0000 → not set
set        = 1010 | 0100 = 1110 → 14
clear      = 1010 & 1011 = 1010 → 10
toggle     = 1010 ^ 0100 = 1110 → 14
```

Use this pattern when the question asks you to inspect or modify a particular bit, or when an integer represents a set of boolean states.
**Practice problems:**

- LC 191 — Number of 1 Bits
- LC 231 — Power of Two
- LC 338 — Counting Bits

## XOR Cancellation

XOR removes values that appear in pairs:

```plain text
x ^ x = 0
x ^ 0 = x
```

Because the order does not matter, every duplicate pair cancels out.
Example:

```plain text
nums = [4, 1, 2, 1, 2]

4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1 ^ 1) ^ (2 ^ 2)
= 4 ^ 0 ^ 0
= 4
```

Code:

```java
int answer = 0;

for (int num : nums) {
    answer ^= num;
}

return answer;
```

Use this when:

- Every value appears twice except one.
- You need to find a missing value from a known range.
- Elements can be paired and cancelled.

**Practice problems:**

- LC 136 — Single Number
- LC 268 — Missing Number
- LC 389 — Find the Difference

**Important:** Basic XOR cancellation works when duplicates appear exactly twice.

## Counting Set Bits

A set bit is a bit whose value is `1`.
To repeatedly remove the rightmost set bit:

```java
n = n & (n - 1);
```

Example:

```plain text
n       = 12 = 1100
n - 1   = 11 = 1011
n & n-1      = 1000
```

One `1` was removed. Repeat until `n == 0`; the number of repetitions is the number of set bits.

```java
int count = 0;

while (n != 0) {
    n &= (n - 1);
    count++;
}

return count;
```

Use this when the question asks for:

- Number of `1` bits.
- Whether a number has exactly one set bit.
- Comparison or grouping based on set-bit counts.

**Practice problems:**

- LC 191 — Number of 1 Bits
- LC 231 — Power of Two
- LC 338 — Counting Bits
- LC 1356 — Sort Integers by the Number of 1 Bits

## Lowest Set Bit and Power of Two

The expression below isolates the rightmost `1` bit:

```java
int lowestSetBit = n & -n;
```

Example:

```plain text
n          = 12 = 1100
n & -n          = 0100 = 4
```

It tells us that the lowest set bit has the value `4`.
A positive power of two has exactly one set bit:

```java
boolean isPowerOfTwo = n > 0 && (n & (n - 1)) == 0;
```

For `n = 8`:

```plain text
8 = 1000
7 = 0111

8 & 7 = 0000
```

Use this pattern for:

- Checking whether a number is a power of two.
- Extracting or removing the lowest set bit.
- Separating numbers based on one differing bit.

**Practice problems:**

- LC 231 — Power of Two
- LC 260 — Single Number III
- LC 342 — Power of Four
- LC 762 — Prime Number of Set Bits in Binary Representation

## Bit-by-Bit Counting

Instead of processing each number completely, examine the same bit position across all numbers.
Example: every number appears three times except one.

```plain text
nums = [2, 2, 2, 5]

2 = 010
2 = 010
2 = 010
5 = 101
---------
Number of 1s:
    1 3 1
```

Take every count modulo `3`:

```plain text
1 3 1 → 1 0 1 → 5
```

The repeated numbers disappear because their contribution is divisible by `3`.

```java
int answer = 0;

for (int bit = 0; bit < 32; bit++) {
    int count = 0;

    for (int num : nums) {
        if ((num & (1 << bit)) != 0) {
            count++;
        }
    }

    if (count % 3 != 0) {
        answer |= 1 << bit;
    }
}

return answer;
```

Use this when:

- Every number appears `k` times except one.
- Simple XOR cannot cancel the duplicates.
- You need to construct the answer one bit at a time.

**Practice problems:**

- LC 137 — Single Number II
- LC 477 — Total Hamming Distance
- LC 1318 — Minimum Flips to Make `a OR b` Equal to `c`

## Prefix XOR for Range Queries

Prefix XOR lets us calculate the XOR of any subarray quickly.

```java
prefix[i + 1] = prefix[i] ^ nums[i];
```

For the range `[left, right]`:

```java
rangeXor = prefix[right + 1] ^ prefix[left];
```

Example:

```plain text
nums   = [1, 3, 4, 8]
prefix = [0, 1, 2, 6, 14]
```

XOR of indices `1` through `3`:

```plain text
prefix[4] ^ prefix[1]
= 14 ^ 1
= 15
```

This works because the elements before `left` appear twice and cancel:

```plain text
(a ^ b) ^ a = b
```

Use this when:

- There are multiple XOR range queries.
- You need to count subarrays having a particular XOR.
- The question involves XOR over prefixes or subarrays.

**Practice problems:**

- LC 1310 — XOR Queries of a Subarray
- LC 1442 — Count Triplets That Can Form Two Arrays of Equal XOR
- LC 1738 — Find Kth Largest XOR Coordinate Value

## Maximum XOR Using a Binary Trie

To maximize:

```plain text
x XOR y
```

Prefer the opposite bit at each position:

```plain text
x bit = 0 → look for 1
x bit = 1 → look for 0
```

Different bits produce `1` in XOR, and differences at higher bit positions give a larger result.
Example:

```plain text
x = 5 = 101
y = 2 = 010

x ^ y = 111 = 7
```

For each number:

1. Insert its bits into a binary trie.
2. Start from the highest bit.
3. Search for the opposite bit.
4. Use the same bit only when the opposite is unavailable.

Use this when:

- You must find the maximum XOR of two numbers.
- For each number, you need the best XOR partner.
- Constraints are too large for checking every pair.

**Complexity:**

```plain text
Time:  O(32 × n) = O(n)
Space: O(32 × n) = O(n)
```

**Practice problems:**

- LC 421 — Maximum XOR of Two Numbers in an Array
- LC 1707 — Maximum XOR With an Element From Array
- LC 2935 — Maximum Strong Pair XOR II

## Arithmetic Using Bits

Binary addition follows the same idea as normal addition:

- XOR calculates the sum without carry.
- AND finds where the carry occurs.
- Shift the carry left by one position.

Example: `5 + 3`

```plain text
5 = 0101
3 = 0011

sum without carry = 0101 ^ 0011 = 0110
carry             = (0101 & 0011) << 1 = 0010

Repeat with 0110 and 0010 until carry becomes 0.
Result = 1000 = 8
```

Code:

```java
while (b != 0) {
    int carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
}

return a;
```

Use this when:

- Addition or subtraction operators are restricted.
- The problem asks you to reproduce arithmetic using bit operations.

**Practice problems:**

- LC 371 — Sum of Two Integers
- LC 29 — Divide Two Integers
- LC 67 — Add Binary

### Final Mental Model

```plain text
AND   → check or preserve
OR    → set
XOR   → toggle or cancel
NOT   → invert
Shift → move bit positions

n & (n - 1) → remove the lowest set bit
n & -n      → isolate the lowest set bit
Prefix XOR  → answer XOR range queries
Binary Trie → maximize XOR
```

---
