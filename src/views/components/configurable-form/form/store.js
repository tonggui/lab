import { cloneDeep, merge } from 'lodash'
import { Store } from 'vuex'
// TODO
import { splitCategoryAttrMap } from './utils'

// 最基础的 store，管理 config，data，context
export default (formConfig, { data, context }) => {
  return new Store({
    state () {
      return {
        config: cloneDeep(formConfig),
        data: cloneDeep(data),
        context: cloneDeep(context)
      }
    },
    mutations: {
      setData (state, data) {
        state.data = { ...state.data, ...data }
        // state.data = merge({}, state.data, data)
      },
      setContext (state, context) {
        state.context = merge({}, state.context, context)
      },
      setConfig (state, config) {
        state.config = config
      }
    },
    actions: {
      updateData ({ commit }, data) {
        commit('setData', data)
      },
      updateContext ({ commit }, context) {
        commit('setContext', context)
      },
      updateConfig ({ commit }, config) {
        commit('setConfig', config)
      },
      selectSp ({ commit }, sp) {
        if (!sp) {
          return
        }
        // TODO
        const { categoryAttrList, categoryAttrValueMap, id, ...rest } = sp
        const {
          normalAttributes,
          normalAttributesValueMap,
          sellAttributes,
          sellAttributesValueMap
        } = splitCategoryAttrMap(sp.categoryAttrList, sp.categoryAttrValueMap)
        const data = {
          ...rest,
          normalAttributesValueMap,
          sellAttributesValueMap,
          spId: id
        }
        const context = {
          state: {
            normalAttributes,
            sellAttributes
          }
        }
        commit('setContext', context)
        commit('setData', data)
      }
    }
  })
}
