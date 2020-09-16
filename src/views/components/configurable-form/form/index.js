import createFormItem from '@sgfe/dynamic-form-vue/src/components/dynamic-form/form-item'
import * as componentCollection from './component-collection'
import * as containerCollection from './container-collection'
import * as layoutCollection from './layout-collection'
import BaseForm from './base-form'
import Vue from 'vue'
import createFormContainer from './create-form-container'
import createFormNavigation from './create-form-navigation'
import { get } from 'lodash'
import { getScrollElement } from '@/common/domUtils'

/**
 * 处理 渲染相关
 */
export default class Form extends BaseForm {
  constructor ({ components = {}, containers = {}, layouts = {} } = {}) {
    super()
    this.navigationComponent = createFormNavigation(this) // form 的导航组件，主要是把config传递过去
    this.components = { ...componentCollection, ...components, Navigation: this.navigationComponent } // 组件集合集合
    this.containers = { ...containerCollection, ...containers } // 容器组件集合
    this.layouts = { ...layoutCollection, ...layouts } // 布局组件集合
    this.FormItem = createFormItem({ ...this.components, ...this.layouts }) // 实例 formItem
    this.formContainerComponent = createFormContainer(this.FormItem, this) // form 的 container，主要做布局
    // TODO 和vue组件数据通信
    this.store = Vue.observable({
      data: {},
      context: {}
    })
    // form的vue实例
    this.instance = null
  }

  // 组件更新
  updateDom () {
    if (!this.instance || !this.instance.componentInstance) {
      return
    }
    this.instance.componentInstance.$forceUpdate()
    // TODO 导航成为表单一部分，考虑这部分是否还需要
    if (!this.navigation || !this.navigation.componentInstance) {
      return
    }
    this.navigation.componentInstance.$forceUpdate()
  }

  render (h, { columnCount = 1, columnGap = 0, navigation = false } = {}) {
    // 渲染form
    this.instance = h(this.formContainerComponent, {
      props: {
        columnCount,
        columnGap
      }
    })
    // 渲染导航
    // TODO 导航成为表单一部分，考虑这部分是否还需要
    // this.navigation = navigation ? h(this.navigationComponent) : null
    console.log('this,instance', this.instance)

    return h('div', {
      class: {
        'form-container': true,
        navigation
      }
    }, [this.instance])
  }

  // 校验出错时的回调
  onValidateError (...args) {
    super.onValidateError(...args)
    this.onValidateErrorUpdateDom()()
  }

  // 校验出错之后，往上滚动导航的高度
  // TODO 看看怎么优化，校验的方式有点锁定了，可配置比较友好
  onValidateErrorUpdateDom () {
    let start = false
    return () => {
      if (start) {
        return
      }
      start = true
      Promise.resolve().then(() => {
        this.updateDom()

        // const height = get(this.navigation, 'componentInstance.height')
        // TODO 其他获取高度方法?
        const height = get(document.getElementById('form-navigation-container'), 'offsetHeight')
        if (height) {
          const $scroll = getScrollElement()
          setTimeout(() => {
            $scroll.scrollTop -= height
          })
        }
      }).then(() => {
        start = false
      })
    }
  }

  init (...args) {
    super.init(...args)
    // 数据同步绑定
    this.store.data = Object.freeze({ ...this.data })
    this.store.context = Object.freeze({ ...this.context })
    // 监听变化同步
    this.weaver.addListener('data', () => {
      this.store.data = Object.freeze({ ...this.data })
    })
    // 监听变化同步
    this.weaver.addListener('context', () => {
      this.store.context = Object.freeze({ ...this.context })
    })

    // TODO dom的更新这块，不是很合适，考虑是否有更好的方式去响应式的更新dom

    // config 涉及的变化，需要重新渲染，才能把变化响应出来
    // config中部分和context和data 无关的动态变化，eg：error
    this.weaver.addListener('config', () => {
      this.updateDom()
    })

    this.plugins.forEach(plugin => {
      // 插件中的config变化时，也需要更新dom
      plugin.addListener('config', () => {
        this.updateDom()
      })
    })
  }
}
