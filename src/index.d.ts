import cookieStore from './cookieStore';
import localStore from './localStore';
import seesionStore from './sessionStore';

// 存储方式优先级
export type Prioritys = 'c' | 'l' | 's' | 'cl' | 'lc' | 'cs' | 'ls' | 'cls';

// 获取某个值
export function getItem(key: string): string | null;

// 设置某个值
export function setItem(key: string, value: string): boolean;

// 删除某个键值
export function removeItem(key: string): boolean;

// 设置存储方式优先级
export function setPriority(key: Prioritys): void;

// 设置键名前缀
export function setPreKey(key: string): void;

// cookie设置键名前缀
export type cookieStoreSetPreKey = typeof cookieStore.setPreKey;

// localStorage设置键名前缀
export const localStoreSetPreKey: typeof localStore.setPreKey;

// sessionStorage设置键名前缀
export const seesionStoreSetPreKey: typeof seesionStore.setPreKey;

// 是否支持cookie
export const cookieStoreIsSupport: typeof cookieStore.isSupport;

// 是否支持localStorage
export const localStoreIsSupport: typeof localStore.isSupport;

// 是否支持sessionStorage
export const seesionStoreIsSupport: typeof seesionStore.isSupport;

// cookie设置存储选项
export const cookieSetOptions: typeof cookieStore.setOptions;