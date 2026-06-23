# Advanced-JS / Day-04 / ES6 Modules & Bundler Tools

Topic of this session:

- ES6 Module
- npm / package.json
- Module bundler tools: Webpack, Rollup, Vite
- Bundler flow: Entry Point => Dependency Graph => Parsing => AST => Transform => Generate
- HtmlWebpackPlugin
- Loader with AST
- Plugin vs Loader
- Tree Shaking
- Webpack Dev Server
- HMR: Hot Module Replacement

---

# 1. package.json First

`package.json` => the main file that describes your JavaScript project.

It contains:

- project name
- version
- scripts
- dependencies
- devDependencies

Example real project package.json:

```json
{
  "name": "advanced-js-day-04",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "start": "npm run dev"
  },
  "dependencies": {
    "axios": "latest"
  },
  "devDependencies": {
    "@babel/generator": "latest",
    "@babel/parser": "latest",
    "@babel/traverse": "latest",
    "html-webpack-plugin": "latest",
    "webpack": "latest",
    "webpack-cli": "latest",
    "webpack-dev-server": "latest"
  },
  "sideEffects": false
}
```

Important:

```txt
scripts => commands we run using npm run

dependencies => packages needed when app runs

devDependencies => packages needed while development/build only

sideEffects false => helps bundler remove unused code
```

---

# 2. npm - Node Package Manager

npm => Node Package Manager.

It is used to:

- create `package.json`
- install packages
- run scripts
- manage project dependencies

## Steps

### Step 1: Create Project Folder

```bash
mkdir advanced-js-day-04
cd advanced-js-day-04
```

### Step 2: Create package.json

```bash
npm init -y
```

### Step 3: Install Runtime Package

Example: axios will be used inside app code.

```bash
npm i axios
```

This goes to:

```json
"dependencies": {
  "axios": "latest"
}
```

### Step 4: Install Development Packages

```bash
npm i -D webpack webpack-cli webpack-dev-server html-webpack-plugin
```

This goes to:

```json
"devDependencies": {}
```

### Step 5: Run Script

```bash
npm run dev
npm run build
```

---

# 3. ES6 Module

Module => JavaScript file that has its own scope and can export/import values.

Before modules:

```html
<script src="math.js"></script>
<script src="app.js"></script>
```

Problem:

- functions are global
- file order is important
- any file can override another file

With ES6 module:

```html
<script type="module" src="./app.js"></script>
```

Benefits:

- each file has private scope
- import only what you need
- easier to split code
- easier for bundlers to understand dependency graph
- helps tree shaking

---

# 4. Named Export

Named export => export many values by name from the same file.

```js
// src/utils/price.js
export function calculateTax(price, taxRate = 0.14) {
    return price * taxRate;
}

export function calculateTotal(price, taxRate = 0.14) {
    return price + calculateTax(price, taxRate);
}
```

Import:

```js
// src/main.js
import { calculateTotal } from "./utils/price.js";

console.log(calculateTotal(1000));
```

Important:

```txt
Named import must use the same exported name.
```

---

# 5. Named Export with Alias

Alias => rename while importing.

```js
import { calculateTotal as getTotal } from "./utils/price.js";

console.log(getTotal(1000));
```

---

# 6. Export at End of File

```js
// src/utils/math.js
const add = (a, b) => a + b;
const sub = (a, b) => a - b;

export { add, sub };
```

```js
// src/main.js
import { add, sub } from "./utils/math.js";

console.log(add(10, 5));
console.log(sub(10, 5));
```

---

# 7. Default Export

Default export => export one main value from file.

```js
// src/services/productService.js
export default function getProduct() {
    return {
        id: 1,
        name: "Laptop",
        price: 30000
    };
}
```

Import:

```js
// src/main.js
import getProduct from "./services/productService.js";

const product = getProduct();
console.log(product.name);
```

Important:

```txt
Default export can be imported with any name.
Each file can have only one default export.
```

Example:

```js
import anyName from "./services/productService.js";

console.log(anyName());
```

---

# 8. Named + Default Export Together

```js
// src/services/productService.js
export const currency = "EGP";

export function formatPrice(price) {
    return `${price} ${currency}`;
}

export default function getProduct() {
    return {
        id: 1,
        name: "Laptop",
        price: 30000
    };
}
```

```js
// src/main.js
import getProduct, { formatPrice } from "./services/productService.js";

const product = getProduct();
console.log(product.name);
console.log(formatPrice(product.price));
```

---

# 9. Import All as Object

```js
// src/utils/math.js
export const add = (a, b) => a + b;
export const sub = (a, b) => a - b;
export const multiply = (a, b) => a * b;
```

```js
// src/main.js
import * as math from "./utils/math.js";

console.log(math.add(10, 5));
console.log(math.sub(10, 5));
console.log(math.multiply(10, 5));
```

---

# 10. Side Effect Import

Side effect import => import file to execute it only.

```js
// src/setup.js
console.log("Application setup loaded");
```

```js
// src/main.js
import "./setup.js";

console.log("App started");
```

Use case:

- setup file
- polyfills
- global initialization

---

# 11. Dynamic Import

Dynamic import => load module only when needed.

It returns Promise.

```js
// src/main.js
const button = document.querySelector("#loadReportBtn");

button.addEventListener("click", async function () {
    const reportModule = await import("./reports/salesReport.js");

    reportModule.printSalesReport();
});
```

```js
// src/reports/salesReport.js
export function printSalesReport() {
    console.log("Sales report loaded only after button click");
}
```

Why dynamic import?

```txt
Load heavy files only when needed.
This improves first page load.
```

---

# 12. Real Example: Small Products App with ES6 Modules

This example is realistic because frontend apps usually split code into:

- API service
- formatter/helper
- UI renderer
- main entry file

## Folder Structure

```txt
advanced-js-day-04/
 ├── package.json
 ├── webpack.config.js
 └── src/
      ├── index.html
      ├── main.js
      ├── api/
      │    └── productsApi.js
      ├── utils/
      │    └── formatCurrency.js
      └── ui/
           └── productList.js
```

## Step 1: Create index.html

```html
<!-- src/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Products App</title>
</head>
<body>
    <h1>Products</h1>
    <button id="loadProductsBtn">Load Products</button>
    <div id="productsContainer"></div>
</body>
</html>
```

## Step 2: Create API Module

```js
// src/api/productsApi.js
export async function getProducts() {
    return [
        { id: 1, name: "Laptop", price: 30000 },
        { id: 2, name: "Mouse", price: 500 },
        { id: 3, name: "Keyboard", price: 1200 }
    ];
}
```

This file is responsible for getting products.

Later you can replace fake data with real API call:

```js
// example only
// const response = await fetch("/api/products");
// return await response.json();
```

## Step 3: Create Helper Module

```js
// src/utils/formatCurrency.js
export function formatCurrency(amount, currency = "EGP") {
    return `${amount.toLocaleString()} ${currency}`;
}
```

This file is responsible for formatting money.

## Step 4: Create UI Module

```js
// src/ui/productList.js
import { formatCurrency } from "../utils/formatCurrency.js";

export function renderProducts(products) {
    return products
        .map(function (product) {
            return `
                <article>
                    <h2>${product.name}</h2>
                    <p>Price: ${formatCurrency(product.price)}</p>
                </article>
            `;
        })
        .join("");
}
```

This file is responsible for building product HTML.

## Step 5: Create Main Entry File

```js
// src/main.js
import { getProducts } from "./api/productsApi.js";
import { renderProducts } from "./ui/productList.js";

const loadProductsBtn = document.querySelector("#loadProductsBtn");
const productsContainer = document.querySelector("#productsContainer");

loadProductsBtn.addEventListener("click", async function () {
    const products = await getProducts();
    productsContainer.innerHTML = renderProducts(products);
});
```

`main.js` is the entry point.

Bundler starts from it and follows all imports.

---

# 13. Module Bundler Tool

Bundler => tool that takes many files/modules and generates final optimized files for browser.

Examples:

- Webpack
- Rollup
- Vite

Why we need bundler?

```txt
1. Use npm packages in browser app.
2. Bundle many files into optimized output.
3. Build dependency graph.
4. Run transformations.
5. Remove unused code.
6. Create development server.
7. Support HMR.
```

---

# 14. Flow of Any Bundler

Any bundler normally follows this flow:

```txt
Entry Point
   ↓
Dependency Graph
   ↓
Parsing
   ↓
AST
   ↓
Transform
   ↓
Generate
   ↓
Output Files
```

## Step 1: Entry Point

Entry point => first file the bundler starts from.

Example:

```js
// src/main.js
import { getProducts } from "./api/productsApi.js";
import { renderProducts } from "./ui/productList.js";
```

Webpack config:

```js
entry: "./src/main.js"
```

## Step 2: Dependency Graph

Dependency graph => map of all files connected by imports.

Example:

```txt
src/main.js
 ├── src/api/productsApi.js
 └── src/ui/productList.js
        └── src/utils/formatCurrency.js
```

The bundler knows:

- used files
- import order
- unused modules
- final bundle content

## Step 3: Parsing

Parser reads code as text.

Example code:

```js
const price = 1000;
```

## Step 4: AST

AST => Abstract Syntax Tree.

AST is tree representation of code.

Example:

```txt
Program
 └── VariableDeclaration
      └── VariableDeclarator
           ├── Identifier: price
           └── NumericLiteral: 1000
```

Test AST here:

```txt
https://astexplorer.net/
```

## Step 5: Transform

Transform => change source code or AST.

Example:

```js
// before
console.log("Hello");
```

```js
// after
console.info("Hello");
```

## Step 6: Generate

Generate => convert final AST back to JavaScript text.

## Step 7: Output

Output => final files created in `dist` folder.

```txt
dist/index.html
dist/main.hash.js
```

---

# 15. Webpack

Webpack => module bundler.

It starts from entry point, builds dependency graph, transforms modules, then outputs final files.

Main concepts:

```txt
Entry
Output
Loader
Plugin
Mode
Dev Server
HMR
```

---

# 16. Webpack Implementation Steps

## Step 1: Install Webpack Packages

```bash
npm i -D webpack webpack-cli webpack-dev-server html-webpack-plugin
```

## Step 2: Add Scripts in package.json

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "start": "npm run dev"
  }
}
```

## Step 3: Create webpack.config.js

```js
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/main.js",
    output: {
        filename: "main.[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    devServer: {
        static: "./dist",
        port: 3000,
        open: true,
        hot: true
    }
};
```

## Step 4: Run Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Step 5: Run Production Build

```bash
npm run build
```

Output:

```txt
dist/index.html
dist/main.hash.js
```

---

# 17. HtmlWebpackPlugin

HtmlWebpackPlugin => Webpack plugin that creates HTML file and injects generated bundle automatically.

Without HtmlWebpackPlugin, you may need to write script file manually:

```html
<script src="main.js"></script>
```

Problem:

```txt
In production, filename can become main.8d7f3a.js
So manual script path is hard.
```

With HtmlWebpackPlugin:

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

plugins: [
    new HtmlWebpackPlugin({
        template: "./src/index.html"
    })
]
```

Webpack will generate:

```txt
dist/index.html
```

And inject:

```html
<script defer src="main.8d7f3a.js"></script>
```

---

# 18. Loader

Loader => function that transforms files before they enter the bundle.

Webpack understands JavaScript and JSON by default.

For other transformations, we use loaders.

Examples:

```txt
babel-loader => convert modern JS to older JS
custom loader => edit JS source code
file loader/asset modules => handle images/fonts
```

Simple definition:

```txt
Loader transforms a module/file.
```

---

# 19. Loader with AST

Some loaders use AST to transform JavaScript code.

Example target:

```txt
Replace console.log with console.info during build.
```

## Step 1: Install Babel AST Packages

```bash
npm i -D @babel/parser @babel/traverse @babel/generator
```

## Step 2: Create Loader Folder

```txt
loaders/console-info-loader.js
```

## Step 3: Write Custom Loader

```js
// loaders/console-info-loader.js
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

module.exports = function consoleInfoLoader(source) {
    const ast = parser.parse(source, {
        sourceType: "module"
    });

    traverse(ast, {
        MemberExpression(path) {
            const objectName = path.node.object && path.node.object.name;
            const propertyName = path.node.property && path.node.property.name;

            if (objectName === "console" && propertyName === "log") {
                path.node.property.name = "info";
            }
        }
    });

    const output = generate(ast, {}, source);
    return output.code;
};
```

## Step 4: Use Loader in Webpack

```js
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/main.js",
    output: {
        filename: "main.[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    path.resolve(__dirname, "loaders/console-info-loader.js")
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ]
};
```

## Step 5: Test It

Input source code:

```js
console.log("Products loaded");
```

After loader:

```js
console.info("Products loaded");
```

Loader flow:

```txt
Source code text
   ↓
Parser
   ↓
AST
   ↓
Traverse and edit AST
   ↓
Generate new code
   ↓
Webpack bundle
```

---

# 20. Loader Order

Loaders work from right to left.

Example:

```js
use: ["loader-a", "loader-b", "loader-c"]
```

Execution:

```txt
loader-c runs first
loader-b runs second
loader-a runs third
```

Why?

```txt
Each loader receives the output of the loader after it.
```

---

# 21. Plugin

Plugin => object/class that extends Webpack build lifecycle.

Plugin can:

- create files
- inject scripts into HTML
- optimize bundle
- print build messages
- run logic before/after compilation

Simple definition:

```txt
Plugin controls or extends the build process.
```

---

# 22. Plugin Example

Goal:

```txt
Print a message after build is done.
```

## Step 1: Create Plugin Folder

```txt
plugins/BuildMessagePlugin.js
```

## Step 2: Write Plugin

```js
// plugins/BuildMessagePlugin.js
class BuildMessagePlugin {
    apply(compiler) {
        compiler.hooks.done.tap("BuildMessagePlugin", function () {
            console.log("Build finished successfully");
        });
    }
}

module.exports = BuildMessagePlugin;
```

## Step 3: Use Plugin in Webpack

```js
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BuildMessagePlugin = require("./plugins/BuildMessagePlugin");

module.exports = {
    mode: "development",
    entry: "./src/main.js",
    output: {
        filename: "main.[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new BuildMessagePlugin()
    ]
};
```

## Step 4: Run Build

```bash
npm run build
```

Output in terminal:

```txt
Build finished successfully
```

---

# 23. Plugin vs Loader

Loader:

```txt
Transforms one file/module.
```

Plugin:

```txt
Controls or extends the whole build process.
```

Comparison:

| Point | Loader | Plugin |
|---|---|---|
| Works on | File/module | Build lifecycle |
| Used for | Transform files | Control build |
| Example | Change JS code using AST | Generate HTML file |
| Runs when | Module is loaded | During compiler lifecycle |

Simple sentence:

```txt
Loader changes files. Plugin changes/controls the build process.
```

---

# 24. Tree Shaking

Tree shaking => remove unused exports from final production bundle.

It works well with ES6 modules because imports/exports are static.

## Example

```js
// src/utils/calculations.js
export function usedFunction() {
    return "I am used";
}

export function unusedFunction() {
    return "I am not used";
}
```

```js
// src/main.js
import { usedFunction } from "./utils/calculations.js";

console.log(usedFunction());
```

In production build:

```bash
npm run build
```

Webpack can remove:

```js
unusedFunction
```

because it is never imported.

## package.json setting

```json
{
  "sideEffects": false
}
```

Meaning:

```txt
My modules do not execute hidden global changes.
Bundler can safely remove unused modules.
```

---

# 25. Webpack Dev Server

Webpack Dev Server => local server for development.

It helps you:

- run app locally
- rebuild on file changes
- open browser automatically
- use HMR

## Step 1: Install

```bash
npm i -D webpack-dev-server
```

## Step 2: Add Script

```json
{
  "scripts": {
    "dev": "webpack serve --mode development"
  }
}
```

## Step 3: Add devServer Config

```js
devServer: {
    static: "./dist",
    port: 3000,
    open: true,
    hot: true
}
```

## Step 4: Run

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

# 26. HMR : Hot Module Replacement

HMR => Hot Module Replacement.

It updates changed module while app is running without full page reload.

Why HMR?

- faster development
- keeps app state
- updates changed module only

## Example

```js
// src/message.js
export function getMessage() {
    return "Hello from HMR module";
}
```

```js
// src/main.js
import { getMessage } from "./message.js";

const app = document.querySelector("#productsContainer");

function render() {
    app.innerHTML = `<h2>${getMessage()}</h2>`;
}

render();

if (module.hot) {
    module.hot.accept("./message.js", function () {
        render();
    });
}
```

Flow:

```txt
Change message.js
   ↓
Webpack detects change
   ↓
Only message.js is replaced
   ↓
render() runs again
   ↓
No full page reload
```

---

# 27. Rollup

Rollup => module bundler focused on ES modules and optimized output.

Common use:

```txt
Libraries and packages.
```

## Steps

### Step 1: Install Rollup

```bash
npm i -D rollup
```

### Step 2: Create rollup.config.js

```js
// rollup.config.js
export default {
    input: "src/main.js",
    output: {
        file: "dist/bundle.js",
        format: "esm"
    }
};
```

### Step 3: Add Script

```json
{
  "type": "module",
  "scripts": {
    "build": "rollup -c"
  }
}
```

### Step 4: Run

```bash
npm run build
```

Output:

```txt
dist/bundle.js
```

---

# 28. Vite

Vite => modern frontend build tool.

In development:

```txt
Vite uses native ES modules and starts very fast.
```

In production:

```txt
Vite creates optimized build output.
```

## Steps

### Step 1: Create Vite App

```bash
npm create vite@latest my-vite-app -- --template vanilla
```

### Step 2: Open Project

```bash
cd my-vite-app
```

### Step 3: Install Packages

```bash
npm install
```

### Step 4: Run Dev Server

```bash
npm run dev
```

### Step 5: Build Production

```bash
npm run build
```

Basic Vite structure:

```txt
my-vite-app/
 ├── index.html
 ├── package.json
 └── src/
      └── main.js
```

---

# 29. Webpack vs Rollup vs Vite

| Tool | Best Use | Notes |
|---|---|---|
| Webpack | Large apps | Powerful and configurable |
| Rollup | Libraries | Great ES module output and tree shaking |
| Vite | Modern apps | Very fast dev server and HMR |

---

# 30. Full Implementation Summary

## Step 1: Create Project

```bash
mkdir advanced-js-day-04
cd advanced-js-day-04
npm init -y
```

## Step 2: Install Packages

```bash
npm i axios
npm i -D webpack webpack-cli webpack-dev-server html-webpack-plugin
npm i -D @babel/parser @babel/traverse @babel/generator
```

## Step 3: Add package.json Scripts

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "start": "npm run dev"
  }
}
```

## Step 4: Create Files

```txt
src/index.html
src/main.js
src/api/productsApi.js
src/utils/formatCurrency.js
src/ui/productList.js
webpack.config.js
loaders/console-info-loader.js
plugins/BuildMessagePlugin.js
```

## Step 5: Run App

```bash
npm run dev
```

## Step 6: Build App

```bash
npm run build
```

## Step 7: Check Output

```txt
dist/index.html
dist/main.hash.js
```

---

# 31. Interview Questions

## What is ES6 module?

ES6 module is a JavaScript file that can import and export values using `import` and `export`.

## What is npm?

npm is Node Package Manager. It installs packages and runs project scripts.

## What is package.json?

`package.json` is project configuration file that contains scripts, dependencies, devDependencies, and project metadata.

## What is bundler?

Bundler is a tool that starts from entry point, builds dependency graph, transforms modules, and generates optimized output files.

## What is entry point?

Entry point is the first file the bundler starts reading from.

## What is dependency graph?

Dependency graph is a map of all modules connected by import statements.

## What is parser?

Parser reads source code and converts it into AST.

## What is AST?

AST means Abstract Syntax Tree. It is a tree representation of code.

## What are the 3 levels of transformation tools?

```txt
Parse => Transform => Generate
```

## What is loader?

Loader transforms file/module before it is added to bundle.

## What is plugin?

Plugin extends or controls Webpack build lifecycle.

## Difference between loader and plugin?

```txt
Loader changes files.
Plugin controls build process.
```

## What is tree shaking?

Tree shaking removes unused code from production bundle.

## What is Webpack Dev Server?

Webpack Dev Server is local development server that rebuilds and serves app during development.

## What is HMR?

HMR means Hot Module Replacement. It replaces changed module without full page reload.

---

# 32. Quick Revision

```txt
ES6 Module => import/export
npm => install packages and run scripts
package.json => project config
Webpack => module bundler
Rollup => bundler mainly for libraries
Vite => fast modern frontend build tool
Entry Point => first file bundler starts from
Dependency Graph => all imports map
Parser => reads code
AST => tree representation of code
Transform => edit code/AST
Generate => create final code
Loader => transforms file
Plugin => controls build process
Tree Shaking => removes unused code
Dev Server => local development server
HMR => update module without full reload
```

---

# 33. Important Commands

```bash
npm init -y
npm i package-name
npm i -D package-name
npm run dev
npm run build
```

Webpack:

```bash
npm i -D webpack webpack-cli webpack-dev-server html-webpack-plugin
```

AST packages:

```bash
npm i -D @babel/parser @babel/traverse @babel/generator
```

Vite:

```bash
npm create vite@latest my-vite-app -- --template vanilla
```

Rollup:

```bash
npm i -D rollup
```
س