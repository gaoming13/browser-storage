// 获取某个sessionStorage值
export function getItem(key: string) : string | null;

// 设置某个sessionStorage值
export function setItem(key: string, value: string) : void;

// 删除某个sessionStorage键
export function removeItem(key: string)  : void;

// 清空sessionStorage键
export function clear() : void;

// 验证是否支持sessionStorage
export function isSupport() : boolean;

// 设置键名前缀
export function setPreKey(key: string) : void;

// 设置测试键名
export function setTestKey(key: string) : void;