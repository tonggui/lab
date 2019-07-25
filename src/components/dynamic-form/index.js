import Vue from 'vue'
import { isPlainObject } from 'lodash'
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
  components: {
    ...customComponents,
    FormItemContainer,
    FormItem: FormItem({ FormItemContainer, ...customComponents })
  },
  mixins: [validatorContainerMixin],
  props: {
    config: {
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
  data () {
    return {
      formConfig: []
    }
  },
  watch: {
    data: {
      handler (data) {
        this.formData = assignToSealObject(this.formData, data)
      }
    },
    config (newConfig) {
      if (this.__removeConfigListener) {
        this.__removeConfigListener(this.handleConfigChange)
      }
      if (newConfig) {
        this.setupFormConfig(newConfig)
      }
    }
  },
  methods: {
    setupFormConfig (config) {
      const { formData, formConfig, addConfigListener, removeConfigListener } = weave({
        config,
        data: this.data,
        context: this.context
      })
      this.formConfig = formConfig
      this.formData = formData
      addConfigListener(this.handleConfigChange)
      this.__removeConfigListener = removeConfigListener
    },
    handleConfigChange (config, resultKey, value) {
      if (!resultKey) return
      if (!isPlainObject(config)) {
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
      if ((config.key in this.formData) && resultKey === 'value') {
        this.$emit('change', config.key, value)
      }
    }
  },
  created () {
    this.setupFormConfig(this.config)
  },
  render (h) {
    return h(
      'div',
      this.formConfig.map(config => renderFormItem(h, config))
    )
  },
  destory () {
    this.__removeConfigListener = null
  }
})
