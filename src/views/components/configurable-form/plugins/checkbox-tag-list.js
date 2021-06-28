import { SPU_FIELD } from '../field'
import TagListWithSuggest from '@/components/taglist/tag-list-with-suggest'

/**
 * 获取店内分类
 * 店内分类选择组件，获取店内分类数据
 * service => { getTagList } 提供分类的接口
 */
export default (service) => ({
  name: '_TagList_',
  context: {
    tagList: []
  },
  config: [{
    key: SPU_FIELD.TAG_LIST,
    type: TagListWithSuggest,
    options: {
      source: []
    },
    rules: {
      result: {
        'options.source' () {
          return this.getContext('tagList')
        }
      }
    }
  }],
  mutations: {
    setTagList ({ setContext }, tagList) {
      setContext({ tagList: tagList || [] })
    }
  },
  hooks: {
    async start ({ commit }) {
      const tagList = await service.getTagList()
      commit('setTagList', tagList)
    }
  }
})
