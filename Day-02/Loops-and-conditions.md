# Conditions & Loops

## 🔹 Conditions

Conditions are used to control the flow of the program based on specific rules or expressions.

---

## Equality Operators

- `==` → compares values only
- `===` → compares values and data types

```js
console.log(5 == "5");   // true
console.log(5 === "5");  // false
```

---

## if / else

Used when you want to execute code based on a condition.

```js
let score = 85;

if(score > 85){
    console.log("Excellent");
}
else{
    console.log("Good");
}
```

---

## switch statement

Used when you have fixed or known cases.

> `switch` uses strict comparison (`===`).

```js
const day = 3;

let dayName;

switch(day){

    case 1:
        dayName = "Sunday";
        break;

    case 2:
        dayName = "Monday";
        break;

    case 3:
        dayName = "Tuesday";
        break;

    default:
        dayName = "Invalid day";
}

console.log(dayName);
```

### Example

```js
let num = 1;

switch(num){

    case "1":
        console.log("From string");
        break;

    case 1:
        console.log("From int");
        break;

    default:
        console.log("Default");
}
```

### Notes

- `break` stops the execution of the switch statement.
- Without `break`, JavaScript continues executing the next cases.

---

## ternary operator `? :`

A shorter way to write simple `if...else` statements.

```js
let age = 20;

let status = age >= 18 ? "Adult" : "Child";

console.log(status);
```

### Nested ternary operator

```js
let score = 90;

let result =
    score >= 90 ? "A" :
    score >= 70 ? "C" :
    "Failed";

console.log(result);
```

### Notes

- Use ternary operators for simple conditions only.
- Avoid deeply nested ternary operators because they reduce readability.

---

## When to use switch vs if/else

### Use `switch`

- When you have fixed values
- When there are many known cases

### Use `if...else`

- For complex conditions
- For ranges and logical expressions

---

# 🔹 Short Circuit Evaluation

JavaScript stops evaluating expressions as soon as the final result is determined.

Logical operators return actual values, not only `true` or `false`.

---

## Logical OR `||`

Returns the first truthy value.

```js
let userName = "" || "Guest";

console.log(userName); // Guest
```

---

## Logical AND `&&`

Returns the first falsy value.

```js
let result = true && "Nadia" && "Fatma";

console.log(result); // Fatma
```

```js
let result = false && "Nadia" && "Fatma";

console.log(result); // false
```

---

# 🔹 Truthy and Falsy Values

## Falsy Values

```js
false
0
-0
0n
""
null
undefined
NaN
```

Everything else in JavaScript is considered truthy.

---

## Examples

```js
console.log(Boolean(""));      // false
console.log(Boolean(0));       // false
console.log(Boolean({}));      // true
console.log(Boolean([]));      // true
console.log(Boolean("Hello")); // true
```

### Note

Objects `{}` and arrays `[]` are truthy because they are reference types.

---

# 🔹 Nullish Coalescing Operator `??`

The nullish operator checks only for:

- `null`
- `undefined`

Unlike `||`, it does not convert values to truthy or falsy values.

---

## OR Operator `||`

```js
let input = "";

let userName = input || "Guest";

console.log(userName); // Guest
```

Because an empty string `""` is considered falsy.

---

## Nullish Operator `??`

```js
let input = "";

let userName = input ?? "Guest";

console.log(userName); // ""
```

The empty string is not `null` or `undefined`, so it is returned normally.

---

## Example

```js
let isOnline = false;

console.log(isOnline || true); // true
console.log(isOnline ?? true); // false
```

### Note

Use `??` when `false`, `0`, or `""` are valid values and should not be replaced.


---

# 🔹 Loops in JavaScript

Loops are used to execute a block of code repeatedly.

JavaScript provides multiple loop types for different use cases.

---

## Loop Types for Arrays

- `for`
- `for...of`
- `forEach`
- `while`

---

## Example

```js
let nums = [10, 20, 30, 40, 50];


// for loop
for(let i = 0; i < nums.length; i++){
    console.log("For", nums[i]);
}


// for...of
for(const element of nums){
    console.log("For of", element);
}


// forEach
nums.forEach((element) => {
    console.log("forEach", element);
});


// while
let j = 0;

while(j < nums.length){
    console.log("While", nums[j]);
    j++;
}
```

---

# 🔹 forEach Performance

`forEach` uses a callback function internally.

Each callback creates a new execution context inside the call stack, which may reduce performance when working with very large arrays.

---

## High Order Functions

A higher-order function is a function that:

- takes another function as an argument
- or returns a function

Examples:
- `forEach`
- `map`
- `filter`
- `reduce`

---

## Performance Comparison

```js
let arr = Array(1_000_000).fill(4);


// console.time()
// starts a timer to measure execution time

 console.time("For");
 let total=0;
 for(let i=0 ; i < arr.Length;i++)  total+=arr[i]
 console.timeEnd("For") //For: 0.037ms


 console.time("Foreach");
 let totaleach=0;
 arr.forEach( num => totaleach+=num) 
 console.timeEnd("Foreach") //Foreach: 45.623ms
  
 console.time("Forof");
 let totalof=0;
 for(const ele of arr) totalof +=ele 
 console.timeEnd("Forof")//Forof: 67.508ms


```

---

# 🔹 Why is `for` Usually Faster?

The JavaScript engine (like V8 in Chrome) tries to optimize loops when:

- arrays contain the same data type
- memory structure is predictable
- execution is simple and direct

The `for` loop runs inline without creating additional function calls.

However, `forEach` creates a callback execution context for every iteration.

### Example

If the array contains `1,000,000` items:

- `forEach` creates `1,000,000` callback executions
- `for` executes directly without extra stack frames

This is why `for` is usually faster.

---

# 🔹 When to Use Each Loop

## Use `for`

- when performance is important
- when you need index access
- when working with very large arrays

---

## Use `forEach`


- when performing operations on every item
- when you do not need `break` or `continue`

---

# 🔹 Important Notes

## `forEach`

- does not return a new array
- cannot use `break` or `continue`

---

## `map`

Use `map()` when you want to return a new transformed array.

```js
let nums = [1, 2, 3];

let doubled = nums.map(num => num * 2);

console.log(doubled);
```

---

## `reduce`

Use `reduce()` when you want to accumulate values into a single result.

```js
let nums = [1, 2, 3, 4];

let total = nums.reduce((acc, current) => {
    return acc + current;
}, 0);

console.log(total);
```
---

# 🔹 Cached vs Uncached Loops

Loop performance can also be affected by how many times a value is recalculated inside the loop.

One common optimization is caching the array length.

---

## Uncached Loop

In this example, `arr.length` is accessed during every iteration.

```js
let arr = Array(1_000_000).fill(4);

console.time("uncached");

let total = 0;

for(let i = 0; i < arr.length; i++){
    total += arr[i];
}

console.timeEnd("uncached"); //uncached: 10.294ms
```

### Explanation

The loop checks `arr.length` every iteration.

If the loop runs `1,000,000` times, the length is also accessed `1,000,000` times.

---

## Cached Loop

In this example, the array length is stored once before looping.

```js
let arr = Array(1_000_000).fill(4);

console.time("cached");

let sum = 0;

for(let i = 0, dataLength = arr.length; i < dataLength; i++){
    sum += arr[i];
}

console.timeEnd("cached"); //cached: 2.005ms
```

---

# 🔹 Why is Cached Faster?

```js
for(let i = 0, dataLength = arr.length; i < dataLength; i++)
```

Here:
- `arr.length` is calculated only one time
- `dataLength` is reused during all iterations

This reduces repeated property access inside the loop.

---

# 🔹 Summary

## Uncached
- accesses `.length` every iteration
- slightly slower
## Cached
- stores length once
- more optimized for large loops

---

# 🔹 Important Note

Modern JavaScript engines like Google's V8 already optimize many cases automatically.

So in small applications, the performance difference is usually very small.

However, caching can still be useful in performance-critical code or very large loops.

---

