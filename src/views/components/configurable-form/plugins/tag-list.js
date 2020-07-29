import { SPU_FIELD } from '../field'

export default (service) => ({
  name: '_TagList_',
  context: {
    tagList: []
  },
  config: [{
    key: SPU_FIELD.TAG_LIST,
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
