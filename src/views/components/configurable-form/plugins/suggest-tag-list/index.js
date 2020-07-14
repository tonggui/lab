import { SPU_FELID } from '../../felid'
import { Store } from 'vuex'
import { merge } from 'lodash'
import SuggestTagList from './suggest-tag-list'

const name = '_SuggestTagList_'

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
    type: SuggestTagList,
    rules: {
      result: {
        'options.suggestList' () {
          return getContext(this.getContext, 'suggestList')
        }
      }
    }
  }],
  store: (rootStore, service) => {
    store = new Store({
      state () {
        return {
          context: {
            suggestList: []
          }
        }
      },
      mutations: {
        setContext (state, context) {
          state.context = merge({}, state.context, context)
        }
      },
      actions: {
        async getSuggestList ({ commit }, categoryId) {
          // TODO 使用B端分类模版才去拉取
          if (!categoryId) {
            return
          }
          const suggestList = await service.getSuggestTagList(categoryId)
          commit('setContext', { suggestList })
        }
      }
    })
    rootStore.watch(state => {
      return state.data.category.id
    }, (categoryId) => {
      store.dispatch('getSuggestList', categoryId)
    })
    return store
  }
}
