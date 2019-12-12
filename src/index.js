import cookieStore from './cookieStore';
import localStore from './localStore';
import seesionStore from './sessionStore';

// 存储是否被支持
const cookieStoreIsSupport = cookieStore.isSupport();
const localStoreIsSupport = localStore.isSupport();
const seesionStoreIsSupport = seesionStore.isSupport();

// 存储方式优先级
let priority = 'lc';

/**
 * 获取某个值
 *
 * @param {string} key
 * @return {string}
 * @example obj.getItem('a2')
 */
const getItem = (key) => {
  for (const type of priority) {
    if (type === 'l' && localStoreIsSupport) {
      return localStore.getItem(key);
    }
    if (type === 'c' && cookieStoreIsSupport) {
      return cookieStore.getItem(key);
    }
    if (type === 's' && seesionStoreIsSupport) {
      return seesionStore.getItem(key);
    }
  }
  return null;
};

/**
 * 设置某个值
 *
 * @param {string} key
 * @param {string} value
 * @return {boolean} 是否设置成功
 * @example obj.setItem('a2', 'b')
 */
const setItem = (key, value) => {
  for (const type of priority) {
    if (type === 'l' && localStoreIsSupport) {
      localStore.setItem(key, value);
      return true;
    }
    if (type === 'c' && cookieStoreIsSupport) {
      cookieStore.setItem(key, value);
      return true;
    }
    if (type === 's' && seesionStoreIsSupport) {
      seesionStore.setItem(key, value);
      return true;
    }
  }
  return false;
};

/**
 * 删除某个键值
 *
 * @param {string} key
 * @return {boolean} 是否删除成功
 * @example obj.removeItem('a2')
 */
const removeItem = (key) => {
  for (const type of priority) {
    if (type === 'l' && localStoreIsSupport) {
      localStore.removeItem(key);
      return true;
    }
    if (type === 'c' && cookieStoreIsSupport) {
      cookieStore.removeItem(key);
      return true;
    }
    if (type === 's' && seesionStoreIsSupport) {
      seesionStore.removeItem(key);
      return true;
    }
  }
  return false;
};

/**
 * 设置存储方式优先级
 *
 * @param {string} key
 * @example obj.setPriority('lcs')
 */
const setPriority = (key) => {
  priority = key;
};

/**
 * 设置键名前缀
 *
 * @param {string} key
 * @example obj.setPreKey('h5-')
 */
const setPreKey = (key) => {
  cookieStore.setPreKey(key);
  localStore.setPreKey(key);
  seesionStore.setPreKey(key);
};

export default {
  // 获取某个值
  getItem,
  // 设置某个值
  setItem,
  // 删除某个键值
  removeItem,
  // 设置存储方式优先级
  setPriority,
  // 设置键名前缀
  setPreKey,
  // cookie设置键名前缀
  cookieStoreSetPreKey: cookieStore.setPreKey,
  // localStorage设置键名前缀
  localStoreSetPreKey: localStore.setPreKey,
  // sessionStorage设置键名前缀
  seesionStoreSetPreKey: seesionStore.setPreKey,
  // 是否支持cookie
  cookieStoreIsSupport,
  // 是否支持localStorage
  localStoreIsSupport,
  // 是否支持sessionStorage
  seesionStoreIsSupport,
  // cookie设置存储选项
  cookieSetOptions: cookieStore.setOptions,
};

