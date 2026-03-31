import { post } from '@/utils/request';
const url = {
  login: 'user/login',
  logout: 'user/logout',
};
export default class User {
  /**
   * 登录
   * @param {String} loginAccount 用户名
   * @param {String} password 密码
   * @returns
   */
  static async login(loginAccount, password) {
    return await post(url.login, {
      loginAccount,
      password,
    });
  }
  static async logout() {
    return await post(url.logout);
  }
}
