import { SPU_FELID } from '../felid'

export default (service) => ({
  name: '_TagList_',
  context: {
    tagList: []
  },
  config: [{
    key: SPU_FELID.TAG_LIST,
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
