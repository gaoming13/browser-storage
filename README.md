# browser-storage [![codecov](https://codecov.io/gh/gaoming13/browser-storage/branch/master/graph/badge.svg)](https://codecov.io/gh/gaoming13/browser-storage) [![Build Status](https://travis-ci.com/gaoming13/browser-storage.svg?branch=master)](https://travis-ci.com/gaoming13/browser-storage) [![Downloads](https://img.shields.io/npm/dm/@gaoming13/browser-storage.svg)](https://www.npmjs.com/package/@gaoming13/browser-storage) [![Version](https://img.shields.io/npm/v/@gaoming13/browser-storage.svg)](https://www.npmjs.com/package/@gaoming13/browser-storage)

Use Cookie, LocalStorage, SessionStorage according to priority.

按自定义的优先级使用 Cookie、LocalStorage、SessionStorage 存储

Automatically detect whether the browser supports it, if it does not support using the next priority item for storage.

自动检测浏览器是否支持，若不支持使用下一优先级项进行存储

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
// 定义存储的优先级，按照优先级找浏览器支持的的存储
// `c` means Cookie, `s` is SessionStorage, `l` is LocalStorage
// `c` 指代 Cookie, `s` 指代 SessionStorage, `l` 指代 LocalStorage
browserStorage.setPriority('csl');

// Store a value (存储某个值)
browserStorage.setItem('item1', 'hello world');

// Get stored content (获取某个值)
browserStorage.getItem('item1'); // It will return `hello world`

// Delete a value (删除某个值)
browserStorage.removeItem('item1');
```

```js
// Set priority to restrict use of cookie storage
// 设置优先级，限制只使用 Cookie 存储
browserStorage.setPriority('c');

// Set the prefix of the stored key name (for example, `item2` is stored, then the actual stored key name is` h5-item2`)
// 设置存储键名的前缀（例如存储了 `item2`，那么实际存储的键名就是 `h5-item2`）
browserStorage.setPreKey('h5-');

// Set cookie storage options (设置 Cookie 存储选项)
// Set Expires / Max-Age = Session (设置 Expires/Max-Age = Session)
browserStorage.setCookieOptions({ path: '/abc', domain: 'local.com' });
// For more options, please refer to [https://github.com/jshttp/cookie#options-1](https://github.com/jshttp/cookie#options-1)
// 更多选项信息请查阅 [https://github.com/jshttp/cookie#options-1](https://github.com/jshttp/cookie#options-1)
browserStorage.setCookieOptions({ path: '/abc', maxAge: 86400, domain: 'local.com' });

// Store a value (存储某个值)
browserStorage.setItem('item2', 'xxxx');
```

## API
- `getItem(key)` Get stored content (获取某个值)
- `setItem(key, value)` Store a value (存储某个值)
- `removeItem(key)` Delete a value (删除某个值)
- `setPriority(priority)` Set storage priority (设置存储方式优先级)
  - example `obj.setPriority('c')`
  - example `obj.setPriority('cl')`
  - example `obj.setPriority('cs')`
  - example `obj.setPriority('cls')`
- `setPreKey(key)` Set key prefix (设置键名前缀)
  - @example `obj.setPreKey('h5-')`
- `cookieStoreSetPreKey(key)` Set cookie key name prefix (设置 Cookie 键名前缀)
  - @example `obj.cookieStoreSetPreKey('h5-')`
- `localStoreSetPreKey(key)` Set LocalStorage key name prefix (设置 LocalStorage 键名前缀)
- `seesionStoreSetPreKey(key)` Set SessionStorage key name prefix (设置 SessionStorage 键名前缀)
- `cookieStoreIsSupport()` Does the browser support Cookie (浏览器是否支持 Cookie)
- `localStoreIsSupport()` Does the browser support LocalStorage (浏览器是否支持 LocalStorage)
- `seesionStoreIsSupport()` Does the browser support SessionStorage (浏览器是否支持 SessionStorage)
- `cookieSetOptions` Set cookie storage options (设置 Cookie 存储选项)
  - example `setCookieOptions({ path: '/abc', maxAge: 86400, domain: 'local.com' })`

## Changelog

Details changes for each release are documented in the [release notes](https://github.com/gaoming13/browser-storage/releases).

## Contribution

If you find a bug or want to contribute to the code or documentation, you can help by submitting an [issue](https://github.com/gaoming13/browser-storage/issues) or a [pull request](https://github.com/gaoming13/browser-storage/pulls).

## License

[MIT](http://opensource.org/licenses/MIT)
