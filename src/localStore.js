// 键名前缀
let preKey = '';

// 测试键名
let testKey = '__test__';

/**
 * 获取某个localStorage值
 *
 * @param {string} key
 * @return {string}
 * @example obj.getItem('a2')
 */
const getItem = (key) => {
  return localStorage.getItem(preKey + key);
};

/**
 * 设置某个localStorage值
 *
 * @param {string} key
 * @param {string} value
 * @example obj.setItem('a2', 'b')
 */
const setItem = (key, value) => {
  localStorage.setItem(preKey + key, value);
};

/**
 * 删除某个localStorage键
 *
 * @param {string} key
 * @example obj.removeItem('a2')
 */
const removeItem = (key) => {
  localStorage.removeItem(preKey + key);
};

/**
 * 验证是否支持localStorage
 *
 * @return {boolean}
 * @example obj.isSupport()
 */
const isSupport = () => {
  try {
    setItem(testKey, 'a');
    const value1 = getItem(testKey);
    removeItem(testKey);
    const value2 = getItem(testKey);
    return value1 === 'a' && value2 === null;
  } catch (e) {
    return false;
  }
};

/**
 * 设置键名前缀
 *
 * @param {string} key
 * @example obj.setPreKey('h5-')
 */
const setPreKey = (key) => {
  preKey = key;
};

/**
 * 设置测试键名
 *
 * @param {string} key
 * @example obj.setTestKey('__test_key__')
 */
const setTestKey = (key) => {
  testKey = key;
};

export default {
  // 获取某个值
  getItem,
  // 设置某个值
  setItem,
  // 删除某个键值
  removeItem,
  // 是否支持localStorage
  isSupport,
  // 设置键名前缀
  setPreKey,
  // 设置测试键名
  setTestKey,
};
