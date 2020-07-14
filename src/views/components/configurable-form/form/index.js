import { weave } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/weaver'
import { traverse, assignPath } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/util'
import createFormItem from '@sgfe/dynamic-form-vue/src/components/dynamic-form/form-item'
import renderFormItem from '@sgfe/dynamic-form-vue/src/components/dynamic-form/render-item'
import componentCollection from './component-collection'
import { mergeConfig } from './utils'
import createStore from './store'
import { merge } from 'lodash'

export default class Form {
  constructor (components = {}, service = {}) {
    const combineComponents = { ...componentCollection, ...components }
    this.components = {
      ...combineComponents,
      FormItem: createFormItem({ ...combineComponents })
    }
    this.service = service || {}
    this.store = null
    this.subStore = {}
    this.plugins = [] // 功能扩展
    this.modules = {}
    this.initial = false
  }

  init ({ data = {}, context = {}, config = {} } = {}) {
    // 先合并config
    const combineConfig = config
    this.plugins.forEach((plugin) => {
      if (!plugin.config) {
        return
      }
      plugin.config.forEach(config => {
        const findConfig = traverse(combineConfig, c => c.key === config.key)
        if (!findConfig) {
          combineConfig.push(config)
        } else {
          mergeConfig(findConfig, config)
        }
      })
    })
    // store 合并
    this.store = createStore(combineConfig, { data, context })
    const subStore = {}
    this.plugins.forEach((plugin) => {
      if (!plugin.store) {
        return
      }
      subStore[plugin.name] = plugin.store(this.store, this.service)
    })
    this.subStore = subStore

    const getContext = () => {
      const context = { ...this.store.state.context, subModules: {} }
      Object.entries(this.subStore).forEach(([key, store]) => {
        merge(context, { subModules: { [key]: { ...store.state.context } } })
      })
      return context
    }

    // 动态表单数据处理
    this.weaver = weave({
      config: combineConfig,
      data,
      context: getContext(),
      hooks: {}
    })
    // weaver的时候会修改 config，所以同步一下
    this.store.dispatch('updateConfig', [...combineConfig])

    // 双向绑定监听，当动态表单修改了 data 的时候，同步到store中
    this.weaver.addListener('data', (key, value) => {
      this.store.dispatch('updateData', { [key]: value })
    })
    // 双向绑定监听，当动态表单修改了 config 的时候，同步到store中
    this.weaver.addListener('config', (config, resultKey, value) => {
      if (!resultKey) return
      /**
       * TODO 双向改变，需要改变传递给动态表单的config，并且不可以解构
       * TODO 改变之后，同步到store中
       */
      config = traverse(combineConfig, c => c.key === config.key)
      if (!config) return
      const keyPath = resultKey.split('.')
      // 修改config
      assignPath(config, keyPath, value)
      // 同步到store中
      this.store.dispatch('updateConfig', [...combineConfig])
    })

    // 双向绑定监听，当store修改data的时候需要同步到动态表单中
    this.store.watch((state) => {
      return state.data
    }, (data) => {
      this.weaver.updateData(data)
    })

    // 监听context的变化，更新
    const storeList = [this.store, ...(Object.values(this.subStore))]
    storeList.forEach(store => {
      store.watch((state) => {
        return state.context
      }, () => {
        const context = getContext()
        this.weaver.updateContext(context)
      })
    })

    this.initial = true
  }

  start () {
    this.plugins.forEach((plugin) => {
      // 初始化
      this.subStore[plugin.name].dispatch('init')
    })
  }

  register (key, module) {
    if (!this.initial) {
      throw Error('还没有初始化')
    }
    const instance = module(this.store)
    this.modules[key] = instance
    instance.install()
    instance.addListener('data', (dataKey, value) => {
      const data = this.store.state.data[key]
      this.store.dispatch('updateData', { [key]: { ...data, [dataKey]: value } })
    })
    instance.addListener('config', () => {
      this.store.dispatch('updateConfig', [...this.config])
    })
  }

  // 扩展逻辑，存储信息，初始化的时候，进行扩展
  extends (plugin) {
    if (!plugin) {
      throw Error('入参不能为空')
    }
    if (this.initial) {
      throw Error('已经初始化过了，不可再扩展')
    }
    if (!plugin.name) {
      throw Error('extends 必须包涵名字')
    }
    this.plugins.push(plugin)
  }

  render (h) {
    const renderFormConfig = [...this.config]
    Object.entries(this.modules).forEach(([key, module]) => {
      const config = traverse(renderFormConfig, c => c.key === key)
      assignPath(config, ['children'], module.config)
    })
    return renderFormConfig.map(c => renderFormItem(h, c))
  }

  get data () {
    if (!this.store) {
      return {}
    }
    return this.store.state.data
  }

  set data (p) {
    if (!this.store) {
      return
    }
    this.store.dispatch('updateData', p)
  }

  get context () {
    if (!this.store) {
      return {}
    }
    return this.store.state.context
  }

  set context (context) {
    debugger
    if (!this.store) {
      return {}
    }
    console.log('setContext', context)
    this.store.dispatch('updateContext', context)
  }

  get config () {
    if (!this.store) {
      return {}
    }
    return this.store.state.config
  }
}
