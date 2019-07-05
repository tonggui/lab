import Vue from 'vue'
import { isString } from 'lodash'
import DefaultFormItemContainer from './defaultFormItemContainer'
import FormItem from './form-item'
import validatorContainerMixin from './validator/validatorContainer'
import { weave } from './weaver'
import { assignToSealObject, traverse } from './util'
import renderFormItem from './render-item'

/*
 * customComponents 当前表单用到的组件集合，formConfig中的type需要在此集合中选取
 */
export default (customComponents = {}, FormItemContainer = DefaultFormItemContainer) => Vue.extend({
  name: 'dynamic-form',
  components: { FormItemContainer, FormItem: FormItem({ FormItemContainer, ...customComponents }) },
  mixins: [validatorContainerMixin],
  render (h) {
    const { formConfig } = this
    return h(
      'div',
      formConfig.map(config => renderFormItem(h, config))
    )
  },
  props: {
    formConfig: {
      type: Array,
      default () {
        return []
      }
    },
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    context: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    data: {
      handler (data) {
        this.formData = assignToSealObject(this.formData, data)
      }
    },
    formConfig (config) {
      console.log('formConfig changed')
      if (this.__removeConfigListener) {
        this.__removeConfigListener(this.handleConfigChange)
      }
      if (config) {
        this.setupFormConfig(config)
      }
    }
  },
  computed: {
    mountedFormConfig () {
      // 如果没有mounted属性，默认是挂载，如果有则根据具体值判断是否要挂载
      return this.formConfig.filter(config => config.mounted === undefined ? true : !!config.mounted)
    }
  },
  methods: {
    setupFormConfig (formConfig) {
      const { addConfigListener, removeConfigListener } = weave({
        formConfig,
        formData: this.data,
        context: this.context
      })
      addConfigListener(this.handleConfigChange)
      this.__removeConfigListener = removeConfigListener
    },
    handleConfigChange (config, resultKey, value) {
      if (!resultKey) return
      if (isString(config)) {
        const configKey = config
        config = traverse(this.formConfig, config => config.key === configKey)
        if (!config) return
      }
      const keyPath = resultKey.split('.')
      const len = keyPath.length
      keyPath.reduce((t, key, i) => {
        if (!t) return t
        // 找到最终的目标点然后赋值，否则一直往下找
        if (i === len - 1) {
          t[key] = value
          return t
        }
        t[key] = Object.assign(Array.isArray(t[key]) ? [] : {}, t[key])
        return t[key]
      }, config)
    }
  },
  created () {
    this.setupFormConfig(this.formConfig)
  },
  destory () {
    this.__removeConfigListener = null
  }
})
