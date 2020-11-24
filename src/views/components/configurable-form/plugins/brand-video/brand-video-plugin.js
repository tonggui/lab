import { get, without } from 'lodash'
import { SPU_FIELD } from '@/views/components/configurable-form/field'
import brandVideoContainer from './brand-video-container'
import { PRODUCT_BRAND_VIDEO_STATUS } from '@/data/enums/product'

const buildVideoComponentDescription = (excludeInvisibleFieldList, rootFieldsContext) => {
  // 如果video节点不可用，同时在排除范围内，则识别为品牌商场景，需要改变描述信息
  if (
    get(rootFieldsContext, [SPU_FIELD.PRODUCT_SP_VIDEO, 'disabled'], false) &&
    excludeInvisibleFieldList.indexOf(SPU_FIELD.PRODUCT_VIDEO) > -1
  ) {
    return {
      message: ['封面视频由品牌商提供，展示给买家有利于销量提升']
    }
  } else {
    const brandVideoVisible = get(rootFieldsContext, [SPU_FIELD.PRODUCT_SP_VIDEO, 'visible'], false)
    return {
      message: [
        '视频尺寸建议为1:1、3:4、16:9，支持上传200MB以内.mp4(推荐)/.mov/.wmv/.avi/.mpg/.mpeg等格式视频。',
        brandVideoVisible ? '品牌商视频由品牌商拍摄制作，视频质量高，您可以选择使用品牌商视频。' : '封面视频可使顾客更好地了解商品，进而提升商品销量'
      ]
    }
  }
}

const checkIsVideoValid = video => get(video, 'status') !== undefined

export default () => ({
  name: '_combineBrandVideo_',
  context: {
    brandVideoEnabled: false, // 是否支持品牌商视频
    brandVideoEditable: true, // 是否支持品牌商视频的编辑
    onlyBrandVideoActive: false // 是否为只激活品牌商视频模式
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
          'options.onlyBrandVideoActive' () {
            return this.getContext('onlyBrandVideoActive')
          },
          'options.brandVideo' () {
            const spVideoStatus = this.getData(SPU_FIELD.PRODUCT_SP_VIDEO_STATUS) || 0
            const spVideo = this.getData(SPU_FIELD.PRODUCT_SP_VIDEO)
            if (spVideo) {
              return Object.assign({}, spVideo, {
                status: spVideoStatus
              })
            }
            return null
          },
          'options.autoUse' () {
            return !this.getData('id')
          }
        }
      }
    ],
    events: {
      videoModeChanged (brandVideoStatus) {
        this.triggerEvent('videoModeChanged', brandVideoStatus)
      }
    }
  }],
  mutations: {
    setBrandVideoEnabled ({ setContext }, brandVideoEnabled) {
      setContext({ brandVideoEnabled })
    },
    setBrandVideoEditable ({ setContext }, brandVideoEditable) {
      setContext({ brandVideoEditable })
    },
    setSpVideoStatus ({ setData }, spVideoStatus) {
      setData({ spVideoStatus })
    },
    setVideoFieldToInVisibleFieldsFeature ({ setRootContext, getRootContext, setContext, getContext }, visible) {
      const features = getRootContext('features') || {}
      const excludeInvisibleFields = get(features, 'excludeInvisibleFields', [])
      let nextExcludeInvisibleFields
      if (visible && excludeInvisibleFields.indexOf(SPU_FIELD.PRODUCT_VIDEO) < 0) {
        nextExcludeInvisibleFields = [SPU_FIELD.PRODUCT_VIDEO].concat(excludeInvisibleFields)
      }
      if (!visible && excludeInvisibleFields.indexOf(SPU_FIELD.PRODUCT_VIDEO) >= 0) {
        nextExcludeInvisibleFields = without(excludeInvisibleFields, SPU_FIELD.PRODUCT_VIDEO)
      }
      if (nextExcludeInvisibleFields) {
        const field = getRootContext('field') || {}
        const { [SPU_FIELD.PRODUCT_VIDEO]: spuVideoField = {}, ...otherFields } = field
        setRootContext({
          features: {
            ...features,
            excludeInvisibleFields: nextExcludeInvisibleFields
          },
          field: {
            ...otherFields,
            [SPU_FIELD.PRODUCT_VIDEO]: {
              ...spuVideoField,
              description: buildVideoComponentDescription(nextExcludeInvisibleFields, field)
            }
          }
        })
        setContext({ onlyBrandVideoActive: visible })
      }
    }
  },
  actions: {
    videoModeChanged ({ commit }, brandVideoStatus) {
      commit('setSpVideoStatus', brandVideoStatus)
    },
    checkVideoVisible ({ commit, getRootContext, getContext, getData }) {
      const brandVideoEnabled = getContext('brandVideoEnabled')
      const spVideo = getData(SPU_FIELD.PRODUCT_SP_VIDEO)
      const spVideoUsable = get(spVideo, 'id') !== undefined
      commit('setVideoFieldToInVisibleFieldsFeature', brandVideoEnabled && spVideoUsable)
    }
  },
  hooks: {
    async start ({ commit, getRootContext }) {
      const field = (getRootContext('field') || {})[SPU_FIELD.PRODUCT_SP_VIDEO] || {}
      commit('setBrandVideoEnabled', field.visible || false)
      commit('setBrandVideoEditable', !(field.disabled || false))
    },
    // 同步 needCorrectionAudit和originalProduct
    updateContext ({ commit, dispatch }, newContext, oldContext) {
      const newFieldVisible = get(newContext, ['field', SPU_FIELD.PRODUCT_SP_VIDEO, 'visible'], false)
      const oldFieldVisible = get(oldContext, ['field', SPU_FIELD.PRODUCT_SP_VIDEO, 'visible'], false)
      if (newFieldVisible !== oldFieldVisible) {
        commit('setBrandVideoEnabled', newFieldVisible)
        dispatch('checkVideoVisible')
      }
      const newFieldDisabled = get(newContext, ['field', SPU_FIELD.PRODUCT_SP_VIDEO, 'disabled'], false)
      const oldFieldDisabled = get(oldContext, ['field', SPU_FIELD.PRODUCT_SP_VIDEO, 'disabled'], false)
      if (newFieldDisabled !== oldFieldDisabled) {
        commit('setBrandVideoEditable', !newFieldDisabled)
      }
    },
    updateData ({ dispatch }, newData, oldData) {
      const newSpVideo = get(newData, SPU_FIELD.PRODUCT_SP_VIDEO)
      const oldSpVideo = get(oldData, SPU_FIELD.PRODUCT_SP_VIDEO)
      if (newSpVideo !== oldSpVideo) {
        dispatch('checkVideoVisible')
      }
    },
    submit ({ commit, getContext, getData }) {
      const brandVideoEnabled = getContext('brandVideoEnabled') || false
      const productVideo = getData(SPU_FIELD.PRODUCT_VIDEO)
      const spVideoStatus = getData(SPU_FIELD.PRODUCT_SP_VIDEO_STATUS)
      if (brandVideoEnabled && spVideoStatus === 0 && checkIsVideoValid(productVideo)) {
        commit('setSpVideoStatus', PRODUCT_BRAND_VIDEO_STATUS.DISABLED)
      }
    }
  }
})
