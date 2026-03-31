import { post, get } from '@/utils/request';
const url = {
  getFarms: 'farm/getFarms',
  addFarm: 'farm/addFarm',
  getCity: 'farm/getCity',
  getFarmsInfo: 'farm/getFarmsInfo',
  updateFarmStatus: 'farm/updateFarmStatus',
  updateFarm: 'farm/updateFarm',
};
export default class Farm {
  static async getFarms(data) {
    return await post(url.getFarms, data);
  }
  static async addFarm(data) {
    return await post(url.addFarm, data);
  }
  static async getCity() {
    return await get(url.getCity);
  }
  static async getFarmsInfo() {
    return await get(url.getFarmsInfo);
  }
  static async updateFarmStatus(farmName) {
    return await post(url.updateFarmStatus, { farmName });
  }
  static async updateFarm(data) {
    return await post(url.updateFarm, data);
  }
}
