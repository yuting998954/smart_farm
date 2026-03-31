import { post } from '@/utils/request';
const url = {
  getUser: 'user/getUserInfo',
  updateUser: 'user/updateUser',
  addUser: 'user/addUser',
  updateUserStatus: 'user/updateStatus',
};
export default class User {
  // 获取用户信息
  static async getUser(data) {
    return await post(url.getUser, data);
  }
  // 修改用户信息
  static async updateUser(data) {
    return await post(url.updateUser, data);
  }
  // 新增用户
  static async addUser(data) {
    return await post(url.addUser, data);
  }
  // 修改用户状态
  static async updateUserStatus(loginAccount) {
    return await post(url.updateUserStatus, { loginAccount });
  }
}
