// 获取某个localStorage值
export type getItem = (key: string) => string | null;

// 设置某个localStorage值
export type setItem = (key: string, value: string) => void;

// 删除某个localStorage键
export type removeItem = (key: string) => void;

// 验证是否支持localStorage
export type isSupport = () => boolean;

// 设置键名前缀
export type setPreKey = (key: string) => void;

// 设置测试键名
export type setTestKey = (key: string) => void;