# Bloom Filter for Username Availability Check

## Overview

This project implements a Bloom Filter in JavaScript to efficiently check whether a username may already exist in a database.

A Bloom Filter is a probabilistic data structure that provides:

* Fast insert operations
* Fast lookup operations
* Low memory usage
* No false negatives
* Possible false positives

This makes Bloom Filters useful for applications such as username availability checks, cache systems, spell checkers, and database query optimization.

---

## How It Works

### 1. Bit Array

The Bloom Filter maintains a bit array of size:

```javascript
const BIT_SIZE = 500;
```

Initially, all positions are set to `0`.

```javascript
const bits = new Array(BIT_SIZE).fill(0);
```

---

### 2. Hash Functions

Two hash functions are used:

#### DJB2

```javascript
function djb2(str)
```

* Starts with a seed value of `5381`
* Uses the formula:

```text
hash = hash × 33 + character
```

* Produces a 32-bit unsigned integer

#### FNV-1a

```javascript
function fnv1a(str)
```

* Starts with a seed value of `2166136261`
* Uses XOR and multiplication by the FNV prime `16777619`
* Produces a 32-bit unsigned integer

---

### 3. Double Hashing

Instead of creating multiple independent hash functions, the implementation generates multiple hash values using:

```text
hash(i) = (h1 + i × h2) mod BIT_SIZE
```

where:

* `h1` = DJB2 hash
* `h2` = FNV-1a hash
* `i` = hash number

This technique reduces computation while maintaining good hash distribution.

---

### 4. Insertion

When a username is inserted:

```javascript
add("kikinagu");
```

The Bloom Filter:

1. Computes hash positions.
2. Maps them into the bit array.
3. Sets those positions to `1`.

---

### 5. Lookup

When checking a username:

```javascript
contains("kikiii");
```

The Bloom Filter:

1. Computes the same hash positions.
2. Checks the corresponding bits.

Results:

* If any bit is `0` → Username is definitely not present.
* If all bits are `1` → Username may be present.

---

## Configuration

```javascript
const DB_CAPACITY = 50;
const BIT_SIZE = 500;
const NUM_HASHES = Math.log(2) * (BIT_SIZE / DB_CAPACITY);
```

### Parameters

| Parameter   | Value | Description                        |
| ----------- | ----- | ---------------------------------- |
| DB_CAPACITY | 50    | Expected number of usernames       |
| BIT_SIZE    | 500   | Number of bits in the Bloom Filter |
| NUM_HASHES  | ~6.93 | Optimal number of hash functions   |

The value of `NUM_HASHES` is calculated using:

```text
k = (m / n) × ln(2)
```

where:

* `m` = bit array size
* `n` = expected number of elements

This minimizes the false positive rate.

---

## Example

Inserted usernames:

```javascript
[
  "kikinagu",
  "keerthikaoffl",
  "nkeerthika",
  "kikii",
  "kikinagu09",
  "prethika",
  "notafamousperson",
  "sandhiyag"
]
```

Query:

```javascript
contains("kikiii")
```

Output:

```text
Username available :)
```

or

```text
Username may be already taken :(
```

depending on the Bloom Filter result.

---

## Complexity

| Operation | Complexity   |
| --------- | ------------ |
| Insert    | O(p+k)       |
| Search    | O(p+k)       |
| Space     | O(m)         |

where:

* `p` = length of username
* `k` = number of hash functions
* `m` = size of bit array
