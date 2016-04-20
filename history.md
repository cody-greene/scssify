# scssify change log

## 2016-04-20 v1.0.0 *breaking changes*
The project is no longer transpiled before publishing; Node.js `4.0.0` & up is now required. The package is also a bit smaller now since the `lodash` and `browserify-transform-tools` dependencies have been removed. Hurray for fewer dependencies!

New features:
- [[`0d00236`](https://github.com/cody-greene/scssify/commit/0d00236)] add `--export` option, default: `false`, this means that raw css is no longer exported, greatly reducing file-size if you're just using autoInjection

## 2016-04-17 v0.3.8
Under new management. [Chris Hoage](https://github.com/chrishoage) has transferred this project over to me so here's a long awaited bugfix!

- [[`507d912`](https://github.com/cody-greene/scssify/commit/507d912)] inform browserify about @imported files [#1](https://github.com/cody-greene/scssify/issues/1)
