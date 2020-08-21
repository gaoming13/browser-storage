// 获取某个sessionStorage值
export type getItem = (key: string) => string | null;

// 设置某个sessionStorage值
export type setItem = (key: string, value: string) => void;

// 删除某个sessionStorage键
export type removeItem = (key: string)  => void;

// 清空sessionStorage键
export type clear = () => void;

// 验证是否支持sessionStorage
export type isSupport = () => boolean;

// 设置键名前缀
export type setPreKey = (key: string) => void;

// 设置测试键名
export type setTestKey = (key: string) => void;