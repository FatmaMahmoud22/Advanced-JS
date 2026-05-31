# JavaScript Functions — Basics

> A **function** in JavaScript is a block of code that creates its own execution context, acts as a scope creator, and can behave as a value, object constructor, or class equivalent.

---

## Table of Contents

1. [What is a Function?](#what-is-a-function)
2. [Declaration vs Expression Functions](#declaration-vs-expression-functions)
3. [Hoisting](#hoisting)
4. [Arrow Functions](#arrow-functions)
5. [Function Parameters & Arguments](#function-parameters--arguments)
6. [Functions as First-Class Citizens](#functions-as-first-class-citizens)
7. [The `this` Keyword](#the-this-keyword)
8. [Strict Mode](#strict-mode)

---

## What is a Function?

A function is a reusable block of code designed to perform a specific task. In JavaScript, functions are incredibly powerful — they are:

- **Execution context creators** — each function call gets its own scope
- **Scope creators** — variables declared inside are not accessible outside
- **Values** — they can be assigned, passed, and returned
- **Object constructors** — can be used with `new` to create objects
- **Class-like blueprints** — before ES6 classes, functions served this role

---

## Declaration vs Expression Functions

### Declaration Function

Any function that **starts with the `function` keyword** at the statement level.

```js
text(); // ✅ Works — hoisted to top
console.log(typeof text); // "function"

function text() {
  console.log("Hello from text");
}

text(); // ✅ Also works
```

### Expression Function

Any function **assigned to a variable** — does NOT start with `function` at the statement level.

```js
hello(); // ❌ ReferenceError: Cannot access 'hello' before initialization
console.log(typeof hello); // ReferenceError

const hello = function () {
  console.log("Hello");
};

hello(); // ✅ Works after declaration
```

> **Key Difference:** Declaration functions are hoisted; expression functions are not.

---

## Hoisting

When a JavaScript file runs, it goes through two phases:

| Phase | What Happens |
|-------|-------------|
| **Creation Phase** | Variables and function declarations are registered in memory |
| **Execution Phase** | Code runs line by line |

Only **declaration functions** are fully hoisted (both their name and body). Variables declared with `let`/`const` are hoisted but stay in the **Temporal Dead Zone** until their line is reached.

```js
// ✅ Declaration — hoisted fully
greet(); // "Hello!"
function greet() {
  console.log("Hello!");
}

// ❌ Expression — NOT hoisted
sayBye(); // ReferenceError
const sayBye = function () {
  console.log("Bye!");
};
```

---

## Arrow Functions

Introduced in ES6, arrow functions provide a shorter syntax and have **no own `this`**.

```js
// Traditional function
const add = function (a, b) {
  return a + b;
};

// Arrow function — short syntax
const add = (a, b) => a + b;

// Single parameter — no parentheses needed
const double = n => n * 2;

// No parameters — empty parentheses required
const greet = () => "Hello!";

// Multi-line body — curly braces + explicit return
const multiply = (a, b) => {
  const result = a * b;
  return result;
};
```

> ⚠️ Arrow functions do **not** have their own `arguments` object or `this` binding.

---

## Function Parameters & Arguments

### Default Parameter Values

You can assign default values to parameters — used when no argument is passed.

```js
function greet(name = "Fatma") {
  console.log("Hello", name);
}

greet("Nadia"); // Hello Nadia
greet();        // Hello Fatma
```

Default values can even reference earlier parameters:

```js
function test(a = 10, b = a) {
  console.log(a, b);
}
test(); // 10 10
```

### The `arguments` Object

All **non-arrow** functions have access to a special `arguments` object — an **array-like** object (has `length` and index access, but lacks real array methods like `.map()`).

```js
function sum() {
  console.log(arguments); // [10, 20, 30]
  // arguments.reduce — ❌ Not available (not a real array)
}
sum(10, 20, 30);
```

### Rest Parameters (`...`)

Introduced in ES6, rest parameters collect all remaining arguments into a **real array**.

```js
function sum(...nums) {
  return nums.reduce((total, curr) => total + curr, 0);
}

console.log(sum(10, 20, 30)); // 60
```

| Feature | `arguments` | Rest `...params` |
|---------|------------|-----------------|
| Type | Array-like object | Real Array |
| Array methods | ❌ | ✅ |
| Works in arrow functions | ❌ | ✅ |
| ES version | ES1 | ES6 |

---

## Functions as First-Class Citizens

In JavaScript, functions are **first-class citizens** — they are treated like any other value. This means they can be:

### 1. Assigned to Variables

```js
const sayHi = function () {
  return "hello";
};

console.log(sayHi()); // "hello"
```

### 2. Passed as Arguments (Callbacks)

```js
function exec(callback) {
  callback();
}

exec(function () {
  console.log("I'm a callback");
});
```

### 3. Returned from Other Functions

```js
function outer() {
  return function () {
    console.log("Inner function");
  };
}

const result = outer();
result(); // "Inner function"
```

### 4. Stored in Data Structures

```js
// Stored in an array
const arr = [1, 2, function () {}, function () {}];

// Stored in an object (method)
const user = {
  name: "Fatma",
  sayHi: function () {
    console.log("Hi");
  },
};

user.sayHi(); // "Hi"
```

---

## The `this` Keyword

`this` refers to the **caller** of the function — the object that invoked it.

```js
const user = {
  name: "Fatma",
  sayName: function () {
    console.log(this.name); // "Fatma" — `this` is `user`
  },
};

user.sayName(); // Fatma

// ⚠️ Detaching the method loses `this`
const fn = user.sayName; // Just a reference, no caller
fn(); // undefined — `this` is now the global object (or undefined in strict mode)
```

### `this` in Arrow Functions

Arrow functions do **not** have their own `this`. They inherit `this` **lexically** from the surrounding scope at the time they are defined — not where they are called.

```js
const user = {
  name: "Fatma",
  sayName: () => {
    console.log(this.name); // undefined — arrow functions inherit outer `this`
  },
};

user.sayName(); // undefined
```

> **Rule of thumb:** Use regular functions for object methods that need `this`. Use arrow functions for callbacks and nested functions where you want to inherit the outer `this`.

---

## Strict Mode

`"use strict"` enables a stricter parsing mode in JavaScript that helps catch common mistakes and "unsafe" patterns.

```js
"use strict";

// ❌ Reserved words can't be used as variable names
var let = 10; // SyntaxError in strict mode
```

### Effect on `this`

```js
// Without strict mode
function test() {
  console.log(this); // window (browser global)
}
test();

// With strict mode
"use strict";
function test() {
  console.log(this); // undefined
}
test();
```

### Why Use Strict Mode?

- Prevents accidental global variable creation
- Disallows duplicate parameter names
- Makes `this` `undefined` in standalone function calls (instead of the global object)
- Catches silent errors early
- Required for ES6 modules (they are always in strict mode)