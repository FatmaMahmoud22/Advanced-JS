# Advanced JavaScript Nightmare Assignment

This file explains my approach for each problem in the assignment.

## Rules I followed

I did not use:

- map
- filter
- reduce
- find
- some
- every
- flat
- flatMap
- sort
- includes
- indexOf

I used:

- functions
- loops
- recursion
- closures
- objects
- arrays
- promises
- call / apply / bind

---

## 1. customMap

### What it does

`customMap` creates a new array by applying a callback function to each item in the original array.

### How I solved it

I created a new array with the same length as the input array. Then I used a `for` loop to go through the array and call the callback for each existing item.

### Edge cases handled

- Throws an error if the first argument is not an array.
- Throws an error if the callback is not a function.
- Preserves empty slots in sparse arrays.
- Does not mutate the original array.
- Supports `thisArg`.

---

## 2. customFilter

### What it does

`customFilter` returns a new array containing only the items that pass a condition.

### How I solved it

I used a loop and called the callback for each item. If the callback returns a truthy value, I push the item into the result array.

### Edge cases handled

- Throws an error if input is not an array.
- Throws an error if callback is not a function.
- Skips empty slots in sparse arrays.
- Does not mutate the original array.
- Supports `thisArg`.

---

## 3. customReduce

### What it does

`customReduce` reduces an array into a single value.

### How I solved it

I used an accumulator variable. If an initial value is provided, I start with it. If no initial value is provided, I use the first available item in the array.

### Edge cases handled

- Throws an error if input is not an array.
- Throws an error if callback is not a function.
- Throws an error for empty arrays without initial value.
- Handles sparse arrays.
- Supports initial value.

---

## 4. groupBy

### What it does

`groupBy` groups array items by a specific property.

### Example

```js
groupBy(users, "role");