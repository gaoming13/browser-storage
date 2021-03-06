# browser-storage

[English](README.md) | [中文简体](README-zh-CN.md)

[![Version][npm-v]][npm-url]
[![codecov][codecov]][codecov-url]
[![Build Status][travis]][travis-url]
[![Downloads][npm-dm]][npm-url]

Use Cookie, LocalStorage, SessionStorage according to priority.

Automatically detect whether the browser supports it, if it does not support using the next priority item for storage.

## Features
- Cookie storage options can be modified
- Compact size 8.1KB (2.3KB gzipped)

## Installation

You can install it via [yarn](https://yarnpkg.com/) or [NPM](http://npmjs.org/).
```
$ yarn add @gaoming13/browser-storage
$ npm i @gaoming13/browser-storage
```

### CDN

[jsdelivr](https://cdn.jsdelivr.net/npm/@gaoming13/browser-storage@1.0.1)

```html
<script src="https://cdn.jsdelivr.net/npm/@gaoming13/browser-storage@1.0.1"></script>
```

[unpkg](https://unpkg.com/@gaoming13/browser-storage@1.0.1)

```html
<script src="https://unpkg.com/@gaoming13/browser-storage@1.0.1"></script>
```

## Example

```js
import browserStorage from '@gaoming13/browser-storage';

// Define the storage priority, and find the storage supported by the browser according to the priority
// `c` means Cookie, `s` is SessionStorage, `l` is LocalStorage
browserStorage.setPriority('csl');

// Store a value
browserStorage.setItem('item1', 'hello world');

// Get stored content
browserStorage.getItem('item1'); // It will return `hello world`

// Delete a value
browserStorage.removeItem('item1');
```

```js
// Set priority to restrict use of cookie storage
browserStorage.setPriority('c');

// Set the prefix of the stored key name (for example, `item2` is stored, then the actual stored key name is` h5-item2`)
browserStorage.setPreKey('h5-');

// Set cookie storage options
// Set Expires / Max-Age = Session
browserStorage.setCookieOptions({ path: '/abc', domain: 'local.com' });
// For more options, please refer to [https://github.com/jshttp/cookie#options-1](https://github.com/jshttp/cookie#options-1)
browserStorage.setCookieOptions({ path: '/abc', maxAge: 86400, domain: 'local.com' });

// Store a value
browserStorage.setItem('item2', 'xxxx');
```

## API
- `getItem(key)` Get stored content
- `setItem(key, value)` Store a value
- `removeItem(key)` Delete a value
- `setPriority(priority)` Set storage priority
  - example `obj.setPriority('c')`
  - example `obj.setPriority('cl')`
  - example `obj.setPriority('cs')`
  - example `obj.setPriority('cls')`
- `setPreKey(key)` Set key prefix
  - @example `obj.setPreKey('h5-')`
- `cookieStoreSetPreKey(key)` Set cookie key name prefix
  - @example `obj.cookieStoreSetPreKey('h5-')`
- `localStoreSetPreKey(key)` Set LocalStorage key name prefix
- `seesionStoreSetPreKey(key)` Set SessionStorage key name prefix
- `cookieStoreIsSupport()` Does the browser support Cookie
- `localStoreIsSupport()` Does the browser support LocalStorage
- `seesionStoreIsSupport()` Does the browser support SessionStorage
- `cookieSetOptions` Set cookie storage options
  - example `setCookieOptions({ path: '/abc', maxAge: 86400, domain: 'local.com' })`

## Changelog

Details changes for each release are documented in the [release notes](https://github.com/gaoming13/browser-storage/releases).

## Contribution

If you find a bug or want to contribute to the code or documentation, you can help by submitting an [issue](https://github.com/gaoming13/browser-storage/issues) or a [pull request](https://github.com/gaoming13/browser-storage/pulls).

## License

[MIT](http://opensource.org/licenses/MIT)

[codecov]: https://codecov.io/gh/gaoming13/browser-storage/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/gaoming13/browser-storage
[travis]: https://travis-ci.com/gaoming13/browser-storage.svg?branch=master
[travis-url]: https://travis-ci.com/gaoming13/browser-storage
[npm-dm]: https://img.shields.io/npm/dm/@gaoming13/browser-storage.svg
[npm-v]: https://img.shields.io/npm/v/@gaoming13/browser-storage.svg
[npm-url]: https://www.npmjs.com/package/@gaoming13/browser-storage