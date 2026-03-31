import { get } from '@/utils/request';
const url = {
  getCityById: 'city/getCityInfoById',
};
export default class City {
  static async getCityById(cityId) {
    return await get(url.getCityById, { cityId });
  }
}
