import { post, get } from '@/utils/request';
const url = {
  getPens: 'pens/getPensInfo',
  addPen: 'pens/addPens',
  updatePens: 'pens/updatePens',
  updatePensStatus: 'pens/updatePensStatus',
};
export default class Pen {
  static async getPens(data) {
    return await post(url.getPens, data);
  }
  static async addPen(data) {
    return await post(url.addPen, data);
  }
  static async updatePens(data) {
    return await post(url.updatePens, data);
  }
  static async updatePensStatus(pensId) {
    return await post(url.updatePensStatus, { pensId });
  }
}
