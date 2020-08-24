import cookie from 'cookie';

// 获取某个cookie值
export function getItem(key: string): null | string;

// 设置某个cookie值
export function setItem(key: string, value: string, options?: cookie.CookieSerializeOptions): void;

// 删除某个cookie
export function removeItem(key: string, options?: cookie.CookieSerializeOptions): void;

// 验证是否支持cookie
export function isSupport(): boolean;

// 设置cookie存储选项
export function setOptions(option: cookie.CookieSerializeOptions): void;

// 设置键名前缀
export function setPreKey(key: string): void;

// 设置测试键名
export function setTestKey(key: string): void;