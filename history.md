## 2023-03-12 v4.0.0
Breaking changes:
- Swap out the `node-sass` (deprecated) package for `sass` ([Dart Sass](https://sass-lang.com/dart-sass) @^1.59.2)
- Custom importer functions are only called **after** attempting to load the file from disk. `node-sass` passed imports to custom importers before loading them relative to the file in which the `@import` appears. This behavior is considered incorrect because it violates the principle of *locality*, which says that it should be possible to reason about a stylesheet without knowing everything about how the entire system is set up. If a user tries to import a stylesheet relative to another stylesheet, that import should *always* work. It shouldn’t be possible for some configuration somewhere else to break it. See here for more detail: [LegacySharedOptions.importer](https://sass-lang.com/documentation/js-api/interfaces/LegacySharedOptions#importer)
- The "file" event emits the entry file too
- Supports node 14, 16, 18

## 2017-11-08 v3.0.1
- adds check before displaying postcss warnings [#31](https://github.com/cody-greene/scssify/pull/31)

## 2017-10-25 v3.0.0
- upgrade to node-sass@4.5.3
- any warnings generated by postcss will now be printed to stderr
- supply `from` and `to` options to postcss. Thanks to [#28](https://github.com/cody-greene/scssify/pull/28)
- pretty print postcss syntax errors
- If autoInject=false or export=true and you want CSS as a string you should now just use `require('./foo.scss')` instead of `require('./foo.scss').css` thanks to [#29](https://github.com/cody-greene/scssify/pull/29)

## 2017-04-27 v2.3.0
- add autoInject.prepend [#27](https://github.com/cody-greene/scssify/pull/27)

## 2016-12-22 v2.2.1
- fix a crash related to autoprefixer [#25](https://github.com/cody-greene/scssify/pull/25)

## 2016-11-02 v2.2.0
Bump node-sass to `^3.10.1` from `^3.3.1` to ensure node 7 support.

Also upgraded some dev dependencies.

## 2016-08-10 v2.1.0
Breaking changes:
- removed `useNodeEnv` option; this was a bad idea.

New features:
- browserify's `--debug` option will also enable css sourcemaps. No extra configuration needed!

## 2016-08-09 v2.0.0
Breaking changes:
- `<link>` tag injection removed. `<style>` tags are now the default [#14](https://github.com/cody-greene/scssify/issues/14)
- `opt.autoInject` may now be one of `true|false|'verbose'`
- `postcss` is no longer a hard dependency. Install it yourself if you need it.

New features:
- added `useNodeEnv` option. Will enable sourcemaps if `process.env.NODE_ENV !== 'production'` otherwise uses `'compressed'` output

Fixes:
- use pre-formatted error text from node-sass
- handle postcss errors
- sourcemaps should work [#15](https://github.com/cody-greene/scssify/issues/15)

## 2016-06-16 v1.2.0
New features:
- [[`2963d08`](https://github.com/cody-greene/scssify/commit/2963d08)] allowing for importer factory functions - this will let the importer state be reset if scssify is called several times within the same process, e.g. by factor-bundle

## 2016-05-16 v1.1.0
New features:
- [[`002a0ad`](https://github.com/cody-greene/scssify/commit/002a0ad)] load custom importer files: this means you can set a custom sass importer in `package.json:browserify.transform`, like the `--importer` flag when using `node-sass` directly

## 2016-04-20 v1.0.0 *breaking changes*
The project is no longer transpiled before publishing; Node.js `4.0.0` & up is now required. The package is also a bit smaller now since the `lodash` and `browserify-transform-tools` dependencies have been removed. Hurray for fewer dependencies!

New features:
- [[`0d00236`](https://github.com/cody-greene/scssify/commit/0d00236)] add `--export` option, default: `false`, this means that raw css is no longer exported, greatly reducing file-size if you're just using autoInjection

## 2016-04-17 v0.3.8
Under new management. [Chris Hoage](https://github.com/chrishoage) has transferred this project over to me so here's a long awaited bugfix!

- [[`507d912`](https://github.com/cody-greene/scssify/commit/507d912)] inform browserify about @imported files [#1](https://github.com/cody-greene/scssify/issues/1)
