import { SPU_FELID } from '../felid'
import lx from '@/common/lx/lxReport'
import Modal from '@/components/modal'

export default (service) => ({
  name: '_SuggestCategory_',
  context: {
    suggesting: false,
    suggest: {},
    ignoreId: null
  },
  config: [{
    key: SPU_FELID.NAME,
    events: {
      'change' (name) {
        this.triggerEvent('changeName', name)
      }
    }
  }, {
    key: SPU_FELID.CATEGORY,
    options: {
      suggesting: false,
      suggest: {}
    },
    events: {
      ignoreSuggest (id) {
        this.triggerEvent('changeIgnoreId', id)
      },
      // 类目推荐首次出现
      suggestDebut (suggestCategoryId) {
        const name = this.getData('name')
        // 类目推荐mv，只记录初次
        lx.mv({
          bid: 'b_shangou_online_e_b7qvo2f9_mv',
          val: { product_spu_name: name, tag_id: suggestCategoryId }
        })
      },
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
        'options.suggesting' () {
          return this.getContext('suggesting')
        },
        'options.suggest' () {
          const ignoreId = this.getContext('ignoreId')
          const suggest = this.getContext('suggest')
          return suggest.id === ignoreId ? {} : suggest
        }
      }
    }
  }],
  mutations: {
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
    }
  },
  actions: {
    changeName ({ getData, commit, dispatch }, name) {
      const spId = getData('spId')
      // 标品或者name为空，不做推荐
      if (!name || spId > 0) {
        commit('setSuggest', {})
      } else {
        dispatch('getSuggest', name)
      }
    },
    async getSuggest ({ getContext, getData, commit }, name) {
      const productName = name || getData('name')
      commit('setSuggesting', true)
      const suggestCategory = await service.getSuggestCategoryByProductName(productName)
      const category = getData('category')
      // 回填逻辑
      if (!category || !category.id) {
        commit('setCategory', suggestCategory)
      }
      const currentSuggestCategory = getContext('suggest')
      if (suggestCategory.id !== currentSuggestCategory.id) {
        if (suggestCategory.id && currentSuggestCategory.id) {
          commit('setIgnoreId', null)
        }
        commit('setSuggest', suggestCategory)
      }
      commit('setSuggesting', false)
    }
  },
  hooks: {
    async start ({ getData, dispatch }) {
      const id = getData('id')
      if (!id) {
        return
      }
      const categoryAppealInfo = await service.getCategoryAppealInfo(id)
      if (categoryAppealInfo && categoryAppealInfo.suggestCategoryId) {
        dispatch('changeIgnoreId', categoryAppealInfo.suggestCategoryId)
      }
    },
    update ({ dispatch, commit }, newData, oldData) {
      if (oldData.spId > 0 && newData.spId <= 0) {
        dispatch('getSuggest')
      } else if (oldData.spId <= 0 && newData.spId > 0) {
        commit('setSuggest', {})
      }
    },
    async submit ({ getContext, getData, commit }) {
      const spId = getData('spId')
      // 标品不做处理
      if (spId > 0) {
        return false
      }
      const suggest = getContext('suggest')
      const ignoreId = getContext('ignoreId')
      const category = getData('category')

      if (suggest.id && suggest.id !== ignoreId && suggest.id !== category.id) {
        return new Promise((resolve) => {
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
