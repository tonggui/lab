import { SPU_FIELD } from '../field'
import lx from '@/common/lx/lxReport'
import Modal from '@/components/modal'
import { get } from 'core-js/fn/dict'

/**
 * 类目推荐逻辑
 * prd：https://km.sankuai.com/page/206043849
 * 主要功能
 * 对于自建商品（不是从标品库选择的 => spId === 0）的商品根据商品的 名称，进行算法推荐后台类目
 * !!!商品审核的时候，部分情况下，不能支持此功能，开关 allowSuggestCategory!!!
 * 对于这种情况，考虑动态还是静态
 * 正常情况，这种功能开关应该是静态的，就是detail获取完毕之后就确定了，是否支持此功能，这种情况下，使用plugins的卸载会比较彻底
 * 对于动态的情况则，只能通过开关去动态控制，此时开关应该是一个优先级比较高，可以直接关闭plugins的功能的
 * 此功能最好是通过plugins的卸载功能来做
 *
 * 但是目前的实现功能还是，具体实现具体使用，可以考虑场景化优化～。。～
 */
export default (service) => ({
  name: '_SuggestCategory_',
  context: {
    suggesting: false, // 类目推荐时锁定选择
    suggest: {}, // 推荐的类目
    ignoreId: null, // 忽略的类目id
    allowSuggestCategory: false, // 是否支持此功能的开关
    suggestValidateMV: false // 类目推荐校验mv，只记录初次
  },
  config: [{
    // name 名称的 触发 推荐
    key: SPU_FIELD.NAME,
    events: {
      'change' (name) {
        this.triggerEvent('changeName', name)
      }
    }
  }, {
    // 类目组件需要的推荐参数
    key: SPU_FIELD.CATEGORY,
    options: {
      suggesting: false,
      suggest: {}
    },
    events: {
      // 忽略推荐的事件
      ignoreSuggest (id) {
        this.triggerEvent('changeIgnoreId', id)
      },
      // 类目推荐首次出现，埋点使用 参考 src/views/components/product-form/config.js
      suggestDebut (suggestCategoryId) {
        const name = this.getData('name')
        // 类目推荐mv，只记录初次
        lx.mv({
          bid: 'b_shangou_online_e_b7qvo2f9_mv',
          val: { product_spu_name: name, tag_id: suggestCategoryId }
        })
      },
      // 埋点使用 参考 src/views/components/product-form/config.js
      denyConfirmDebut (suggestCategoryId) {
        const name = this.getData('name')
        // 推荐类目暂不使用mv，只记录初次
        lx.mv({
          bid: 'b_shangou_online_e_9hbu8q94_mv',
          val: { product_spu_name: name, tag_id: suggestCategoryId }
        })
      }
    },
    rules: {
      result: {
        // 参数 获取，动态表单用法
        'options.suggesting' () {
          return this.getContext('suggesting')
        },
        // 参数 获取，动态表单用法
        'options.suggest' () {
          const ignoreId = this.getContext('ignoreId')
          const suggest = this.getContext('suggest')
          // 推荐的类目和忽略的类目一致的时候，不展示推荐
          return suggest.id === ignoreId ? {} : suggest
        }
      }
    }
  }],
  mutations: {
    setAllowSuggestCategory ({ setContext }, allowSuggestCategory) {
      setContext({ allowSuggestCategory: !!allowSuggestCategory })
    },
    setIgnoreId ({ setContext }, id) {
      setContext({ ignoreId: id })
    },
    setSuggest ({ setContext }, suggest) {
      setContext({ suggest: suggest || {} })
    },
    setSuggesting ({ setContext }, suggesting) {
      setContext({ suggesting: !!suggesting })
    },
    setCategory ({ setData }, category) {
      setData({ category })
    },
    setSuggestValidateMV ({ setContext }, suggestValidateMV) {
      setContext({ suggestValidateMV })
    }
  },
  actions: {
    changeName ({ getData, commit, dispatch }, name) {
      const spId = getData('spId')
      // 标品或者name为空，不做推荐
      if (!name || spId > 0) {
        commit('setSuggest', {})
      } else {
        // 触发推荐
        dispatch('getSuggest', name)
      }
    },
    // 设置忽略类目
    changeIgnoreId ({ commit }, id) {
      commit('setIgnoreId', id)
    },
    // 获取推荐类目
    async getSuggest ({ getContext, getData, commit }, name) {
      const allowSuggestCategory = getContext('allowSuggestCategory')
      const productName = name || getData('name')
      // 不允许和名称为空时，置空 推荐类目
      if (!allowSuggestCategory || !productName) {
        commit('setSuggest', {})
        return
      }
      try {
        // 推荐ing
        commit('setSuggesting', true) // 类目推荐时锁定选择
        const suggestCategory = await service.getSuggestCategoryByProductName(productName)
        const category = getData('category')
        const id = getData('id')

        // 回填逻辑 - 编辑时调整不需要回填
        if (!id && (!category || !category.id)) {
          commit('setCategory', suggestCategory)
        }
        const currentSuggestCategory = getContext('suggest')
        // 当前推荐类目 和 之前推荐类目 不一致，替换推荐类目
        if (suggestCategory.id !== currentSuggestCategory.id) {
          if (suggestCategory.id && currentSuggestCategory.id) { // 初始时，suggestCategory还没获取到时不用考虑，只考虑后续的变更
            commit('setIgnoreId', null)
          }
          commit('setSuggest', suggestCategory)
        }
      } catch (err) {
        console.error(err)
      } finally {
        commit('setSuggesting', false) // 类目推荐时锁定选择
      }
    }
  },
  hooks: {
    // 初始化的时候，获取商品 已经忽略的类目
    async start ({ commit, getData, getRootContext, dispatch }) {
      const allowSuggestCategory = getRootContext('features').allowSuggestCategory
      commit('setAllowSuggestCategory', allowSuggestCategory)
      const id = getData('id')
      if (!id) {
        return
      }
      try {
        const categoryAppealInfo = await service.getCategoryAppealInfo(id)
        if (categoryAppealInfo && categoryAppealInfo.suggestCategoryId) {
          dispatch('changeIgnoreId', categoryAppealInfo.suggestCategoryId)
        }
      } catch (err) {
        console.error(err)
      }
    },
    // 商品信息变化的时候，触发的函数
    updateData ({ dispatch, commit }, newData, oldData) {
      // spId变化，从是标品库商品 ==> 变成自建商品 重新获取推荐
      if (oldData.spId > 0 && newData.spId <= 0) {
        dispatch('getSuggest')
      } else if (oldData.spId <= 0 && newData.spId > 0) { // spId变化，从是自建商品 ==> 变成标品库商品 置空推荐
        commit('setSuggest', {})
      }
    },
    // rootContext变化的时候，触发的函数
    updateContext ({ commit }, newContext, oldContext) {
      // 同步 allowSuggestCategory
      const allowSuggestCategory = get(newContext, 'features.allowSuggestCategory')
      if (allowSuggestCategory !== get(oldContext, 'features.allowSuggestCategory')) {
        commit('setAllowSuggestCategory', allowSuggestCategory)
      }
    },
    // 表单校验通过之后，提交前的 提醒弹框
    async submit ({ getContext, getData, commit }) {
      const spId = getData('spId')
      const allowSuggestCategory = getContext('allowSuggestCategory')
      // 标品不做处理
      if (spId > 0 || !allowSuggestCategory) {
        return false
      }
      const suggest = getContext('suggest')
      const ignoreId = getContext('ignoreId')
      const category = getData('category')

      if (suggest.id && suggest.id !== ignoreId && suggest.id !== category.id) {
        return new Promise((resolve) => {
          const suggestValidateMV = getContext('suggestValidateMV')
          console.log('suggestValidateMV', suggestValidateMV)
          if (!suggestValidateMV) {
            lx.mv({
              bid: 'b_shangou_online_e_zyic9lks_mv',
              val: { product_spu_name: getData('name'), tag_id: suggest.id }
            })
            commit('setSuggestValidateMV', true)
          }
          Modal.confirm({
            title: '注意',
            centerLayout: true,
            okText: '使用推荐类目',
            cancelText: '继续保存',
            render (h) {
              return h('div', [
                h('div', ['系统检测到您的商品可能与已填写的类目不符合，建议使用推荐类目：如您选择“继续保存”，平台将对您的商品进行审核']),
                h('div', ['1) 审核通过，则您的商品将可以正常售卖']),
                h('div', { class: 'danger' }, ['2) 审核不通过，将降低您门店内的商品曝光']),
                h('div', ['审核周期：1-7个工作日，审核期间您可以正常售卖'])
              ])
            },
            onOk: () => {
              lx.mc({ bid: 'b_shangou_online_e_57vvinqj_mc' })
              commit('setCategory', suggest)
              resolve(true)
            },
            onCancel: () => {
              lx.mc({ bid: 'b_shangou_online_e_tuexnuui_mc' })
              commit('setIgnoreId', suggest.id)
              resolve(false)
            }
          })
        })
      }

      return false
    }
  }
})
