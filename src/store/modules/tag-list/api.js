// TODO 暂时没想到好的方法 区分商家商品库和商品接口
import {
  PLATFORM
} from '@/data/enums/common'
import {
  fetchGetPoiTagInfo as productGet,
  fetchSubmitChangeTagLevel as productChangeLevel,
  fetchSubmitAddTag as productAdd,
  fetchSubmitModTag as productMod,
  fetchSubmitDeleteTag as productDel
} from '@/data/repos/category'
import {
  fetchGetSortedTagList as merchantGet,
  fetchSubmitChangeTagLevel as merchantChangeLevel,
  fetchSubmitAddTag as merchantAdd,
  fetchSubmitModTag as merchantMod,
  fetchSubmitDeleteTag as merchantDel
} from '@/data/repos/merchantCategory'

export default {
  [PLATFORM.PRODUCT]: {
    getList: productGet,
    changeLevel: productChangeLevel,
    modify: productMod,
    add: productAdd,
    delete: productDel
  },
  [PLATFORM.MERCHANT]: {
    getList: merchantGet,
    changeLevel: merchantChangeLevel,
    modify: merchantMod,
    add: merchantAdd,
    delete: merchantDel
  }
}
