import { SPU_FELID } from '../felid'
import { merge } from 'lodash'
import { Store } from 'vuex'

const name = '_SuggestCategory_'

// TODO
const getContext = (scopedGetContext, contextName) => {
  const modules = scopedGetContext('subModules') || {}
  const scopedContext = modules[name] || {}
  return scopedContext[contextName]
}

let store = null
// prd：https://km.sankuai.com/page/206043849
export default {
  name,
  config: [{
    key: SPU_FELID.NAME,
    events: {
      'change' (name) {
        store.dispatch('changeName', name)
      }
    }
  }, {
    key: SPU_FELID.CATEGORY,
    events: {
      ignoreSuggest (id) {
        store.dispatch('ignoreSuggestCategory', id)
      }
    },
    rules: {
      result: {
        'options.suggesting' () {
          return getContext(this.getContext, 'suggestingCategory')
        },
        'options.suggest' () {
          const ignoreSuggestCategory = getContext(this.getContext, 'ignoreSuggestCategory')
          const suggestCategory = getContext(this.getContext, 'suggestCategory')
          return suggestCategory.id === ignoreSuggestCategory ? {} : suggestCategory
        }
      }
    }
  }],
  store: (rootStore, service) => {
    store = new Store({
      state () {
        return {
          context: {
            suggestingCategory: false,
            suggestCategory: {},
            ignoreSuggestCategory: null
          }
        }
      },
      mutations: {
        setContext (state, context) {
          state.context = merge({}, state.context, context)
        }
      },
      actions: {
        async init ({ dispatch }) {
          const id = rootStore.state.data.id
          if (id) {
            const categoryAppealInfo = await service.getCategoryAppealInfo(id)
            if (categoryAppealInfo && categoryAppealInfo.suggestCategoryId) {
              dispatch('ignoreSuggestCategory', categoryAppealInfo.suggestCategoryId)
            }
          }
        },
        async getSuggestCategory ({ commit, state }, name) {
          const productName = name || rootStore.state.data.name
          commit('setContext', { suggestingCategory: true })
          const suggestCategory = await service.getSuggestCategoryByProductName(productName)
          const { category } = rootStore.state.data
          // 回填逻辑
          if (!category || !category.id) {
            rootStore.commit('setData', { category: suggestCategory })
          }
          const currentSuggestCategory = state.context.suggestCategory
          if (suggestCategory.id !== currentSuggestCategory.id) {
            if (suggestCategory.id && currentSuggestCategory.id) {
              commit('setContext', { ignoreSuggestCategory: null })
            }
            commit('setContext', { suggestCategory })
          }
          commit('setContext', { suggestingCategory: false })
        },
        ignoreSuggestCategory ({ commit }, id) {
          commit('setContext', { ignoreSuggestCategory: id })
        },
        changeName ({ dispatch, commit }, name) {
          const spId = rootStore.state.data.spId
          // 标品或者name为空，不做推荐
          if (!name || spId > 0) {
            commit('setContext', { suggestCategory: {} })
            return
          }
          dispatch('getSuggestCategory', name)
        }
      }
    })
    rootStore.watch(state => {
      return state.data.spId
    }, (spId) => {
      if (spId > 0) {
        return
      }
      store.dispatch('getSuggestCategory')
    })
    return store
  }
}
