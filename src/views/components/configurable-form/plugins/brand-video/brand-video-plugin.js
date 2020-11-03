import { get, set } from 'lodash'
import { SPU_FIELD } from '@/views/components/configurable-form/field'
import brandVideoContainer from './brand-video-container'

export default () => ({
  name: '_combineBrandVideo_',
  context: {
    brandVideoEnabled: false, // 是否支持品牌商视频
    brandVideoEditable: true // 是否支持品牌商视频的编辑
  },
  config: [{
    key: SPU_FIELD.PRODUCT_VIDEO,
    container: brandVideoContainer,
    options: {
      brandVideoEnabled: false,
      brandVideoEditable: true,
      brandVideo: {
        value: null,
        status: 0
      },
      autoUse: false
    },
    rules: [
      {
        result: {
          'options.brandVideoEnabled' () {
            return this.getContext('brandVideoEnabled')
          },
          'options.brandVideoEditable' () {
            return this.getContext('brandVideoEditable')
          },
          'options.brandVideo' () {
            return this.getData(SPU_FIELD.PRODUCT_SP_VIDEO) || null
          },
          'options.autoUse' () {
            return !this.getData('id')
          }
        }
      }, {
        result: {
          mounted (isMounted) {
            return isMounted || (
              // 品牌商视频是否可用，且是否存在品牌商视频
              !isMounted && this.getContext('brandVideoEnabled') && get(this.getData(SPU_FIELD.PRODUCT_SP_VIDEO), 'id') !== undefined
            )
          }
        }
      }
    ],
    events: {
      videoModeChanged (brandVideoStatus) {
        const spVideoInfo = this.getData(SPU_FIELD.PRODUCT_SP_VIDEO) || {}
        this.setData(SPU_FIELD.PRODUCT_SP_VIDEO, set(spVideoInfo, 'status', brandVideoStatus))
      }
    }
  }],
  mutations: {
    setBrandVideoEnabled ({ setContext }, brandVideoEnabled) {
      setContext({ brandVideoEnabled })
    },
    setBrandVideoEditable ({ setContext }, brandVideoEditable) {
      setContext({ brandVideoEditable })
    }
  },
  hooks: {
    async start ({ commit, getRootContext }) {
      const field = (getRootContext('field') || {})[SPU_FIELD.PRODUCT_SP_VIDEO] || {}
      commit('setBrandVideoEnabled', field.visible || false)
      commit('setBrandVideoEditable', !(field.disabled || false))
    },
    // 同步 needCorrectionAudit和originalProduct
    updateContext ({ commit }, newContext, oldContext) {
      const newFieldVisible = get(newContext, ['field', SPU_FIELD.PRODUCT_SP_VIDEO, 'visible'], false)
      const oldFieldVisible = get(oldContext, ['field', SPU_FIELD.PRODUCT_SP_VIDEO, 'visible'], false)
      if (newFieldVisible !== oldFieldVisible) {
        commit('setBrandVideoEnabled', newFieldVisible)
      }
      const newFieldEditable = get(newContext, ['field', SPU_FIELD.PRODUCT_SP_VIDEO, 'disabled'], false)
      const oldFieldEditable = get(oldContext, ['field', SPU_FIELD.PRODUCT_SP_VIDEO, 'disabled'], false)
      if (newFieldEditable !== oldFieldEditable) {
        commit('setBrandVideoEditable', newFieldEditable)
      }
    }
  }
})
