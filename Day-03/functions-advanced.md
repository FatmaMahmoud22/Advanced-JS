# JavaScript Functions — Advanced

> This file covers the advanced patterns built on top of JavaScript's first-class functions: **Higher-Order Functions**, **Closures**, **IIFE**, **Currying**, **Composition**, and **Memoization**.

---

## Table of Contents

1. [Higher-Order Functions (HOF)](#higher-order-functions-hof)
2. [Popular Built-in Higher-Order Functions](#popular-built-in-higher-order-functions)
3. [Advanced Techniques with HOFs](#advanced-techniques-with-hofs)
4. [Closures](#closures)
5. [Closures — Practical Use Cases](#closures--practical-use-cases)
6. [Variable Scope: `var` vs `let` in Loops](#variable-scope-var-vs-let-in-loops)
7. [IIFE — Immediately Invoked Function Expressions](#iife--immediately-invoked-function-expressions)

---

## Higher-Order Functions (HOF)

A **Higher-Order Function** is a function that does at least one of the following:

1. **Takes another function as an argument**
2. **Returns another function as its result**

This is possible because functions in JavaScript are first-class values.

### 1. Takes a Function as an Argument

```js
const numbers = [1, 2, 3];

const doubled = numbers.map(function (num) {
  return num * 2;
});

console.log(doubled); // [2, 4, 6]
```

### 2. Returns a Function

```js
function multiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = multiplier(2);
console.log(double(3)); // 6
console.log(double(5)); // 10
```

> The returned function "remembers" `factor` from the outer function — this is a **closure** (covered below).

---

## Popular Built-in Higher-Order Functions

JavaScript arrays come with powerful built-in HOFs. All of them accept a **callback function**.

### 1. `map` — Transform Every Element

Returns a **new array** where each element is transformed by the callback.

```js
const arr = [1, 2, 3, 4, 5];
const squares = arr.map(function (num) {
  return num * num;
});
console.log(squares); // [1, 4, 9, 16, 25]
```

### 2. `filter` — Keep Elements That Pass a Test

Returns a **new array** containing only the elements for which the callback returns `true`.

```js
const arr = [1, 2, 3, 4, 5];
const evens = arr.filter(function (num) {
  return num % 2 === 0;
});
console.log(evens); // [2, 4]
```

### 3. `reduce` — Accumulate to a Single Value

Reduces the array to **one value** by applying the callback cumulatively.

```js
const arr = [1, 2, 3, 4, 5];
const total = arr.reduce((accumulator, current) => accumulator + current, 0);
console.log(total); // 15
```

> The second argument (`0`) is the **initial value** of the accumulator.

### 4. `forEach` — Execute a Side Effect for Each Element

Like `map`, but returns **nothing** (`undefined`). Used for side effects only.

```js
const arr = [1, 2, 3, 4, 5];
arr.forEach(function (num) {
  console.log(num * 2);
});
// 2, 4, 6, 8, 10 (printed, not returned)
```

> ⚠️ Never use `forEach` when you need a transformed array — use `map` instead.

### 5. `find` — Return the First Match

Returns the **first element** that satisfies the condition, or `undefined` if none is found.

```js
const arr = [1, 2, 3, 4, 5];
const firstBig = arr.find(function (x) {
  return x > 3;
});
console.log(firstBig); // 4
```

### Quick Comparison

| Method | Returns | Mutates Original? | Use When |
|--------|---------|------------------|----------|
| `map` | New array | ❌ | Transforming every element |
| `filter` | New array (subset) | ❌ | Selecting elements by condition |
| `reduce` | Single value | ❌ | Summing, grouping, or building objects |
| `forEach` | `undefined` | ❌ | Side effects (logging, DOM updates) |
| `find` | First match or `undefined` | ❌ | Finding a specific element |

---

## Advanced Techniques with HOFs

### 1. Function Composition

Combining multiple functions so the output of one becomes the input of the next.

```js
const add10 = (x) => x + 10;
const multiply2 = (x) => x * 2;
const subtract5 = (x) => x - 5;

// Manual composition
const result = subtract5(multiply2(add10(3))); // (3+10)*2 - 5 = 21

// Reusable compose utility
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);

const transform = compose(subtract5, multiply2, add10);
console.log(transform(3)); // 21
```

### 2. Currying

Transforming a function that takes multiple arguments into a series of functions that each take **one argument**.

```js
// Normal function
function add(a, b, c) {
  return a + b + c;
}
console.log(add(1, 2, 3)); // 6

// Curried version
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

console.log(curriedAdd(1)(2)(3)); // 6

// Practical use — pre-configure a function
const add5 = curriedAdd(5);
const add5And3 = add5(3);
console.log(add5And3(10)); // 18
```

> **Why curry?** It creates reusable, partially-applied functions and makes code more composable.

### 3. Memoization

Caching the result of expensive function calls so they are not repeated for the same input.

```js
function memoize(fn) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache[key] !== undefined) {
      console.log("From cache:", key);
      return cache[key];
    }
    cache[key] = fn(...args);
    return cache[key];
  };
}

function slowSquare(n) {
  // Imagine this is a heavy computation
  return n * n;
}

const fastSquare = memoize(slowSquare);
console.log(fastSquare(5));  // 25 (computed)
console.log(fastSquare(5));  // 25 (from cache)
console.log(fastSquare(10)); // 100 (computed)
```

> **Why memoize?** Avoids redundant calculations — critical for performance in recursive algorithms (e.g., Fibonacci).

---

## Closures

A **closure** is a function that **remembers and accesses variables from its outer scope** even after the outer function has finished executing.

> Every time an inner function is created inside an outer function, a closure is formed automatically.

```js
function createCounter() {
  let counter = 0; // Lives in the closure

  return function increment() {
    counter++;
    return counter;
  };
}

const count = createCounter();
console.log(count);   // [Function: increment]
console.log(count()); // 1
console.log(count()); // 2
console.log(count()); // 3

// In browser DevTools: console.dir(count) → Scopes → Closure → increment
```

### How Closures Work

When `createCounter()` finishes executing, `counter` would normally be garbage-collected. But because the returned `increment` function **still references** `counter`, JavaScript keeps it alive in memory — this is the closure.

```
createCounter() call
│
├── counter = 0        ← kept alive in memory
│
└── returns increment()
        │
        └── can still read & write `counter`
```

### Key Benefits

- **Data encapsulation** — variables are hidden from the outside world
- **Private state** — only the returned functions can access the enclosed data
- **Stateful functions** — functions that remember values between calls

---

## Closures — Practical Use Cases

### Bank Account (Private Balance)

Simulating private class fields using closures — the original pattern before ES6 classes.

```js
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private — cannot be accessed directly

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) return "Insufficient funds";
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createBankAccount(9000);
console.log(account.deposit(100));    // 9100
console.log(account.withdraw(200));   // 8900
console.log(account.getBalance());    // 8900
console.log(account.balance);         // undefined — truly private!
```

> This is exactly what ES6 classes with private fields (`#balance`) achieve — closures were the original way.

---

## Variable Scope: `var` vs `let` in Loops

Understanding closure behavior with loops is a classic JavaScript interview topic.

### `var` — Function Scoped (Shared Variable)

```js
for (var i = 0; i <= 3; i++) {
  setTimeout(() => {
    console.log("from var", i);
  }, 2000);
}
// Output (after 2s):
// from var 4
// from var 4
// from var 4
// from var 4
```

**Why?** All four callbacks share the **same `i`** variable (function-scoped). By the time they run, the loop has finished and `i === 4`.

### `let` — Block Scoped (New Variable Per Iteration)

```js
for (let i = 0; i <= 3; i++) {
  setTimeout(() => {
    console.log("from let", i);
  }, 2000);
}
// Output (after 2s):
// from let 0
// from let 1
// from let 2
// from let 3
```

**Why?** `let` creates a **new binding** for each loop iteration. Each callback closes over its own separate `i`.

### `let` Declared Outside Loop (Back to Shared)

```js
let i = 0; // Single shared variable

for (i; i <= 3; i++) {
  setTimeout(() => {
    console.log("from let", i);
  }, 2000);
}
// Output (after 2s):
// from let 4
// from let 4
// from let 4
// from let 4
```

**Why?** Now `i` is declared outside the loop — it's a single shared variable again, same as `var`.

### Summary Table

| Scenario | Output | Reason |
|----------|--------|--------|
| `var i` in loop | All `4` | One shared variable (function scope) |
| `let i` in loop | `0, 1, 2, 3` | New binding per iteration (block scope) |
| `let i` outside loop | All `4` | Back to one shared variable |

---

## IIFE — Immediately Invoked Function Expressions

An **IIFE** is a function that is **defined and called immediately** in the same expression. It creates a private scope that doesn't pollute the global namespace.

### Basic Syntax

```js
(function () {
  // Code runs immediately
  var localVar = "This is a local variable";
  console.log(localVar); // "This is a local variable"
})();

// localVar is not accessible outside
console.log(typeof localVar); // "undefined"
```

### IIFE with Closures — Module Pattern

IIFEs combined with closures create **self-contained modules** — the original module system before ES6 `import`/`export`.

```js
const counter = (function () {
  let count = 0; // Private — inaccessible from outside

  return {
    increment: function () {
      count++;
      console.log(count);
    },
    decrement: function () {
      count--;
      console.log(count);
    },
    reset: function () {
      count = 0;
      console.log("Counter reset");
    },
    getCount: function () {
      return count;
    },
  };
})();

counter.increment(); // 1
counter.increment(); // 2
counter.increment(); // 3
counter.decrement(); // 2
counter.reset();     // Counter reset
console.log(counter.getCount()); // 0
console.log(counter.count);      // undefined — truly private
```

### Why Use IIFE?

| Benefit | Description |
|---------|-------------|
| **Avoid global pollution** | All variables stay inside the IIFE's scope |
| **Data privacy** | Exposed API controls what the outside world can access |
| **One-time setup** | Initialization code that only needs to run once |
| **Module encapsulation** | The pattern that CommonJS and AMD modules were inspired by |

> In modern JavaScript, ES6 modules (`import`/`export`) are preferred. But understanding IIFE is essential for reading legacy code and understanding module design patterns.