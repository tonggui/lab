import SuggestTagList from './suggest-tag-list'
import { SPU_FIELD } from '../../field'

export default (service) => ({
  name: '_SuggestTagList_',
  context: {
    tagList: []
  },
  config: [{
    key: SPU_FIELD.TAG_LIST,
    type: SuggestTagList,
    options: {
      getSuggest: service.getSuggestList,
      source: []
    },
    rules: [{
      result: {
        'options.source' () {
          return this.getContext('tagList')
        },
        'options.categoryId' () {
          const category = this.getData('category') || {}
          return category.id
        }
      }
    }]
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
