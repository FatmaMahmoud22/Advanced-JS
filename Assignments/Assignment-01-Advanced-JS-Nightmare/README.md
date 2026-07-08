# Advanced JavaScript Nightmare Assignment

This project is a mini JavaScript utility library built from scratch.

The goal of this assignment is to practice core JavaScript concepts such as:

* Functions
* Closures
* Loops
* Recursion
* Async flow
* Problem solving
* Weird JavaScript behavior
* Event-driven programming

## Rules

In this project, I did not use the following built-in array methods:

* map
* filter
* reduce
* find
* some
* every
* flat
* flatMap
* sort
* includes
* indexOf

Instead, I used:

* for loops
* recursion
* functions
* arrays
* objects
* closures
* promises

## Features

The library includes the following utilities:

1. `customMap`
2. `customFilter`
3. `customReduce`
4. `groupBy`
5. `deepClone`
6. `once`
7. `memoize`
8. `compose`
9. `flattenArray`
10. `createCounter`
11. `createSecretHolder`
12. `pipeAsync`
13. Weird JavaScript examples
14. `EventEmitter`

## Project Structure

```text
advanced-js-nightmare/
│
├── src/
│   └── advancedUtils.js
│
├── tests.js
├── PROBLEMS.md
└── README.md
```

## How to Run

First, make sure Node.js is installed.

Then open the project folder in the terminal and run:

```bash
node tests.js
```

## Files Description

### `src/advancedUtils.js`

This file contains the full implementation of all utility functions.

### `tests.js`

This file contains examples and test cases for all functions.

### `PROBLEMS.md`

This file explains every problem, the approach I used, and the edge cases handled.

## Implemented Utilities

### customMap

Creates a new array by applying a callback function to every item in the array.

### customFilter

Creates a new array containing only the items that pass a condition.

### customReduce

Reduces an array into a single value.

### groupBy

Groups array items based on a specific property.

### deepClone

Creates a deep copy of objects and arrays, including nested data.

### once

Allows a function to execute only one time.

### memoize

Caches function results to improve performance.

### compose

Combines multiple functions from right to left.

### flattenArray

Flattens deeply nested arrays using recursion.

### createCounter

Creates a private counter using closures.

### createSecretHolder

Protects private data using closures.

### pipeAsync

Runs asynchronous functions in order.

### EventEmitter

A small event emitter system that supports:

* on
* once
* off
* emit
* listenerCount
* removeAllListeners

## Weird JavaScript Topics Covered

The project also demonstrates and explains:

* `this`
* hoisting
* closures in loops
* `bind`
* `call`
* `apply`

## Notes

This project focuses on understanding how JavaScript works internally instead of relying on built-in methods.
