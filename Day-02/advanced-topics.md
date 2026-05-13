# Symbol & Generators

# 🔹 Symbol.iterator

`Symbol.iterator` is a built-in symbol used to make objects iterable.

An iterable object can be used with:

- `for...of`
- spread operator `...`
- destructuring

---

# 🔹 Why Arrays Work with `for...of`

Arrays are iterable by default because they already contain `Symbol.iterator`.

```js
let nums = [10, 20, 30];

for(const element of nums){
    console.log(element);
}
```

Internally, arrays have an iterator object with a `next()` method.

The `next()` method returns:

```js
{
   value: ...,
   done: false
}
```

When iteration finishes:

```js
{
   done: true
}
```

---

# 🔹 Objects are NOT Iterable by Default

```js
const user = {
    name: "Fatma",
    age: 24
};

for(const element of user){
    console.log(element);
} //TypeError: user is not iterable

```


# 🔹 Why Does This Error Happen?

Regular objects do not contain `Symbol.iterator`.

So JavaScript does not know how to iterate through them using `for...of`.

---

# 🔹 Using Symbols in Objects

```js
const user = {
    [Symbol("id")]: 101, //Symbols create unique property keys.
    name: "Fatma"
};

console.log(user);
```


# 🔹 Creating a Custom Iterable Object

We can make objects iterable manually by adding `Symbol.iterator`.

```js
let user ={}
const evenNumbers = {
     ...user , //spread وكمل عليه
    [Symbol.iterator](){
        let i = 0;
        return {
            next(){

                i += 2;

                return i <= 10
                    ? { value: i, done: false }
                    : { done: true };
            }
        };
    }
};
for(const element of evenNumbers){
    console.log(element);
}
```

use [] use dynamic keys
```js
let userName ="Fatma"
let user={
    [userName] : "Shatoora"
}
console.log(user) // {fatma : 'Shatoora'}
```
you can use 
# 🔹 Object.keys()

`Object.keys()` returns an array containing all object keys.
```js
const user={
    name:"fatma",
    age:24,
    salary:1000
}
for(const element of Object.keys(user)){
    console.log(user[element]);
}
```
# 🔹 Object.entries()

`Object.entries()` returns an array of arrays.

Each inner array contains:[key, value]

```js
for(const [key,value] of Object.entries(user))
{
    console.log(key,value);
    console.log(value);
}

console.log(Object.entries(user)) // array of array 

```





# 🔹 Important Notes
- Arrays are iterable by default
- Objects are not iterable by default
- `Symbol.iterator` allows custom iteration behavior
- Iterators work using the `next()` method
- `Object.keys()` returns keys only
- `Object.entries()` returns both keys and values



***************************************
#Generators : is a special type of function that can pause its execution and resume later, allowing you to produce a sequence of values on demand. 
 -- has yield keyword : used to pause the function’s execution and return a value to the caller.
When the generator is resumed (via .next()), execution continues right after the last yield. 
```js

function* counter(){
    yield 1;
    yield 2;
    yield 3;
    return 4;
}
const x= counter() // it is not execute when you call it you should use next() function
console.log(x.next()); //{value :1 , done:false}
console.log(x.next());//{value :2 , done:false}
console.log(x.next());//{value :3 , done:false}
console.log(x.next());//{value :4 , done:true} 
```

```js
 function* displayName(params){
  const x =yield "start-1"
  const y =yield "start-1"
  console.log(x,y)
  return x+y
  }


  const x=displayName()
  console.log(x.next(10));  //{ value: 'start-1', done: false } + x=10
 
  const x=displayName()
  console.log(x.next()) // x=10
  console.log(x.next(10));  //{ value: 'start-1', done: false } + x=5
  console.log(x.next(5)) //{ value: 15, done: true }
  
```
try...catch 
```js
fuction* test(){
 try{
    yield 1;
    yield 2;
 }
 finally{
    console.log("CleanUP")
 }
}
const x =test()
console.log(x.next())
console.log(x.return(99))// 
```
you can use it with pagination 

