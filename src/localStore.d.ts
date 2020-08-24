// 获取某个localStorage值
export function getItem(key: string): string | null;

// 设置某个localStorage值
export function setItem(key: string, value: string): void;

// 删除某个localStorage键
export function removeItem(key: string): void;

// 验证是否支持localStorage
export function isSupport(): boolean;

// 设置键名前缀
export function setPreKey(key: string): void;

// 设置测试键名
export function setTestKey(key: string): void;