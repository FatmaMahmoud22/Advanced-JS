"use strict";

var utils = require("./src/advancedUtils");

console.log("========== customMap ==========");
var nums = [1, 2, 3];
var doubled = utils.customMap(nums, function (x) {
  return x * 2;
});
console.log(doubled);

console.log("========== customFilter ==========");
var users = [
  { name: "Ahmed", age: 22, role: "admin" },
  { name: "Sara", age: 15, role: "user" },
  { name: "Ali", age: 30, role: "admin" }
];

var adults = utils.customFilter(users, function (user) {
  return user.age >= 18;
});
console.log(adults);

console.log("========== customReduce ==========");
var total = utils.customReduce([1, 2, 3], function (acc, current) {
  return acc + current;
}, 0);
console.log(total);

console.log("========== groupBy ==========");
var grouped = utils.groupBy(users, "role");
console.log(grouped);

console.log("========== deepClone ==========");
var original = {
  name: "Omar",
  address: {
    city: "Cairo"
  },
  skills: ["JS", "C#"],
  createdAt: new Date("2026-01-01")
};

original.self = original;

var copy = utils.deepClone(original);
copy.address.city = "Giza";
copy.skills.push("SQL");

console.log("Original city:", original.address.city);
console.log("Copy city:", copy.address.city);
console.log("Original skills:", original.skills);
console.log("Copy skills:", copy.skills);
console.log("Circular works:", copy.self === copy);

console.log("========== once ==========");
var init = utils.once(function () {
  console.log("Initialized only once");
  return "done";
});

console.log(init());
console.log(init());

console.log("========== memoize ==========");
var slowCalls = 0;

var square = utils.memoize(function (n) {
  slowCalls++;
  return n * n;
});

console.log(square(5));
console.log(square(5));
console.log(square(6));
console.log("Real function calls:", slowCalls);

console.log("========== memoize fibonacci ==========");
var fib = utils.memoize(function (n) {
  if (n <= 1) {
    return n;
  }

  return fib(n - 1) + fib(n - 2);
});

console.log(fib(10));

console.log("========== compose ==========");
function addOne(x) {
  return x + 1;
}

function double(x) {
  return x * 2;
}

function minusThree(x) {
  return x - 3;
}

var composed = utils.compose(addOne, double, minusThree);
console.log(composed(10));

console.log("========== flattenArray ==========");
var nested = [1, [2, [3, [4, [5]]]], 6];
console.log(utils.flattenArray(nested));

console.log("========== createCounter ==========");
var counter = utils.createCounter(10);
console.log(counter.getValue());
console.log(counter.increment());
console.log(counter.increment(5));
console.log(counter.decrement(3));
console.log(counter.reset());

console.log("========== createSecretHolder ==========");
var secret = utils.createSecretHolder("123");
console.log(secret.getSecret());
secret.setSecret("456");
console.log(secret.getSecret());

console.log("========== pipeAsync ==========");
function asyncAddOne(x) {
  return Promise.resolve(x + 1);
}

function asyncDouble(x) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(x * 2);
    }, 100);
  });
}

function asyncMinusThree(x) {
  return Promise.resolve(x - 3);
}

var pipeline = utils.pipeAsync(asyncAddOne, asyncDouble, asyncMinusThree);

pipeline(5).then(function (result) {
  console.log(result);

  console.log("========== EventEmitter ==========");
  var emitter = new utils.EventEmitter();

  function onLogin(user) {
    console.log(user.name + " logged in");
  }

  function welcome(user) {
    console.log("Welcome " + user.name);
  }

  emitter.on("login", onLogin);
  emitter.once("login", welcome);

  emitter.emit("login", { name: "Ahmed" });
  emitter.emit("login", { name: "Sara" });

  console.log("Listeners:", emitter.listenerCount("login"));

  emitter.off("login", onLogin);
  console.log("Listeners after off:", emitter.listenerCount("login"));

  console.log("========== Weird JavaScript ==========");

  console.log("--- this ---");
  var person = {
    name: "Ahmed",
    sayName: function () {
      console.log(this.name);
    }
  };

  person.sayName();

  var detached = person.sayName;
  detached();

  console.log("--- hoisting ---");
  console.log(x);
  var x = 10;
  console.log(x);

  console.log("--- closures in loops with var ---");
  for (var i = 0; i < 3; i++) {
    (function (current) {
      setTimeout(function () {
        console.log("Fixed var loop:", current);
      }, 100);
    })(i);
  }

  console.log("--- bind / call / apply ---");
  function introduce(city, country) {
    console.log("My name is " + this.name + " from " + city + ", " + country);
  }

  var user = {
    name: "Mido"
  };

  introduce.call(user, "Cairo", "Egypt");
  introduce.apply(user, ["Giza", "Egypt"]);

  var boundIntroduce = introduce.bind(user, "Alexandria", "Egypt");
  boundIntroduce();
});