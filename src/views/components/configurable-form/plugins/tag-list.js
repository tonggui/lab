import { SPU_FELID } from '../felid'
import { Store } from 'vuex'
import { merge } from 'lodash'

const name = '_TagList_'

const getContext = (scopedGetContext, contextName) => {
  const modules = scopedGetContext('subModules') || {}
  const scopedContext = modules[name] || {}
  return scopedContext[contextName]
}

let store = null

export default {
  name,
  config: [{
    key: SPU_FELID.TAG_LIST,
    options: {
      source: []
    },
    rules: {
      result: {
        'options.source' () {
          return getContext(this.getContext, 'tagList')
        }
      }
    }
  }],
  store: (_rootStore, service) => {
    store = new Store({
      state () {
        return {
          context: {
            tagList: []
          }
        }
      },
      mutations: {
        setContext (state, context) {
          state.context = merge({}, state.context, context)
        }
      },
      actions: {
        async init ({ commit }) {
          const tagList = await service.getTagList()
          commit('setContext', { tagList })
        }
      }
    })
    return store
  }
}
