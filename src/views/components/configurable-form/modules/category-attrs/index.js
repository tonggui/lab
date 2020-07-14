import { weave } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/weaver'
import { traverse, assignPath } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/util'
import createConfig from './config'
import { ATTR_TYPE } from '@/data/enums/category'

export default (rootStore) => {
  let weaver = null
  let config = []
  const listeners = {}

  const update = () => {
    const { data, context } = rootStore.state
    const attrs = data.categoryAttrList.filter(attr => attr.attrType !== ATTR_TYPE.SELL)
    const allowBrandApply = context.features.allowBrandApply
    const propertyLock = context.features.propertyLock
    const isSp = data.isSp
    config = createConfig(attrs)
    weaver = weave({
      config: config,
      data: data.categoryAttrValueMap,
      context: { allowBrandApply, propertyLock, isSp },
      hooks: {}
    })
    Object.entries(listeners).forEach(([key, handlers]) => {
      handlers.forEach((handler) => weaver.addListener(key, handler))
    })
  }

  const install = () => {
    update()
    addListener('config', (formConfig, resultKey, value) => {
      if (!resultKey) return
      /**
       * TODO 双向改变，需要改变传递给动态表单的config，并且不可以解构
       * TODO 改变之后，同步到store中
       */
      formConfig = traverse(config, c => c.key === formConfig.key)
      if (!formConfig) return
      const keyPath = resultKey.split('.')
      // 修改config
      assignPath(formConfig, keyPath, value)
    })
    rootStore.watch(state => {
      return state.data.categoryAttrList
    }, () => update())
    rootStore.watch(state => {
      return {
        isSp: state.data.isSp,
        allowBrandApply: state.context.features.allowBrandApply,
        propertyLock: state.context.features.propertyLock
      }
    }, (context) => {
      weaver.updateContext(context)
    })
  }

  const addListener = (key, handler) => {
    if (!listeners[key]) {
      listeners[key] = []
    }
    listeners[key].push(handler)
    weaver.addListener(key, handler)
  }

  return {
    install,
    update,
    addListener,
    get config () {
      return config
    },
    get weaver () {
      return weaver
    }
  }
}
