import SuggestTagList from './suggest-tag-list'
import { SPU_FIELD } from '../../field'

/**
 * 根据分类模版 + 商品后台类目，进行店内分类的推荐
 * prd：https://km.sankuai.com/page/207162042
 *
 * TODO 此功能涉及从头到尾的表单侵入流程，目前实现并不完善，可以根据具体场景抽象和实现 一套流程方案
 */
export default (service) => ({
  name: '_SuggestTagList_',
  config: [{
    key: SPU_FIELD.TAG_LIST,
    // 替换组件
    type: SuggestTagList,
    options: {
      // 获取推荐接口
      getSuggest: service.getSuggestList,
      // 获取店内分类列表接口
      getSource: service.getTagList
    },
    rules: [{
      result: {
        // 类目
        'options.categoryId' () {
          const category = this.getData('category') || {}
          return category.id
        },
        // 商品id
        'options.spuId' () {
          return this.getData('id')
        }
      }
    }]
  }]
})
