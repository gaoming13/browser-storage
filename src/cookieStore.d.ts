import cookie from 'cookie';

export default cookieStore;

declare namespace cookieStore {
  // 获取某个cookie值
  type getItem = (key: string) => null | string;

  // 设置某个cookie值
  type setItem = (key: string, value: string, options?: cookie.CookieSerializeOptions) => void;

  // 删除某个cookie
  type removeItem = (key: string, options?: cookie.CookieSerializeOptions) => void;

  // 验证是否支持cookie
  type isSupport = () => boolean;

  // 设置cookie存储选项
  interface setOptions { (option: cookie.CookieSerializeOptions): void }

  // 设置键名前缀
  type setPreKey = (key: string) => void;

  // 设置测试键名
  interface setTestKey { (key: string): void }
}