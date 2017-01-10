Before opening an issue:
- If you're getting a build error, make sure your stylesheet works with `node-sass` directly: `node_modules/.bin/node-sass entry-file.scss >outfile.css` maybe it's a syntax problem!
- If possible, provide a _minimal_ and _complete_ project that reproduces your issue. Perhaps by stripping down your project you'll find out what the problem is!

```
// package.json
{
  "name": "scssify-issue",
  "private": true,
  "scripts": {
    "start": "browserify -t scssify app.js >bundle.js"
  },
  "dependencies": {
    "scssify": "latest",
    "browserify": "latest"
  }
}

// app.js
require('./styles.scss')

// styles.scss
.foo{ color: red }

// $ npm install
// $ npm start
... example output or an error message ...
```

What version of node/npm are you running?
```
$ node -v
$ npm -v
```
