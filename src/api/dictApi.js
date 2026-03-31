import { post, get, put } from '@/utils/request';
const url = {
  getDict: 'dict/getDict',
  getDictInfoByDitIdAndDicInfo: 'dictInfo/getDictInfoByDitIdAndDicInfo',
  addDict: 'dictInfo/addDictInfoByDictId',
  updateDicInfoStatus: 'dictInfo/updateDicInfoStatus',
  getDictInfoByDictId: 'dictInfo/getDictInfoByDictId',
};
export default class Dict {
  static async getDict() {
    return await post(url.getDict);
  }
  static async getDictInfoByDitIdAndDicInfo(data) {
    return await post(url.getDictInfoByDitIdAndDicInfo, data);
  }
  static async addDict(data) {
    return await post(url.addDict, data);
  }
  static async updateDicInfoStatus(dictId, dictInfoId) {
    return await put(url.updateDicInfoStatus, { dictId, dictInfoId });
  }
  static async getDictInfoByDictId(dictId) {
    return await get(url.getDictInfoByDictId, { dictId });
  }
}
