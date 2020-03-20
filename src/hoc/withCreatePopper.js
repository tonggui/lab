import Vue from 'vue'
import { isPlainObject } from 'lodash'
import moduleControl from '@/module'

const createInstance = (Component, options, onDestory) => {
  const $body = document.body
  const $dom = document.createElement('div')
  $body.appendChild($dom)
  if (isPlainObject(Component)) {
    Component = Vue.extend(Component)
  }
  let temp = options
  return new Vue({
    el: $dom,
    moduleControl: moduleControl,
    data () {
      return {
        value: false
      }
    },
    methods: {
      update (options) {
        this.value = true
        temp = options
      },
      show () {
        this.value = true
      },
      handleCancel () {
        this.value = false
        temp.on['on-cancel'] && temp.on['on-cancel']()
      },
      handleVisibleChange (value) {
        this.value = value
        temp.on['on-visible-change'] && temp.on['on-visible-change']()
      },
      destroy () {
        if (this.value) {
          this.value = false
        }
        this.$nextTick(() => {
          if (document.body.contains(this.$el)) {
            document.body.removeChild(this.$el)
          }
          onDestory && onDestory()
        })
      }
    },
    render (h) {
      const { slots = {}, attrs, props, ...rest } = temp
      const $slots = Object.entries(slots).map(([key, node]) => {
        return h('template', { slot: key }, [node])
      })
      return h(Component, {
        ...rest,
        attrs: { ...attrs, ...props, value: this.value },
        on: {
          ...rest.on,
          'on-cancel': this.handleCancel,
          'on-visible-change': this.handleVisibleChange
        }
      }, [$slots])
    }
  })
}

export default (Popper) => {
  let instance = null
  const onDestory = () => { instance = null }
  return (options = {}) => {
    if (!instance) {
      instance = createInstance(Popper, options, onDestory)
      instance.$nextTick(() => {
        instance.show()
      })
    } else {
      instance.update(options)
      // Object.entries(props).forEach(([key, value]) => {
      //   instance[key] = value
      // })
      // instance.value = true
    }

    // instance.$off('on-cancel')
    // instance.$off('on-visible-change')
    // Object.entries(on).forEach(([key, handler]) => {
    //   instance.$off(key)
    //   if (handler) {
    //     instance.$on(key, handler)
    //   }
    // })
    // instance.$on('on-cancel', () => {
    //   instance.value = false
    // })
    // instance.$on('on-visible-change', (value) => {
    //   if (instance.value !== value) {
    //     instance.value = value
    //   }
    // })

    // instance.$slots = slots || {}
    // instance.$scopedSlots = Object.entries(scopedSlots || {}).reduce((prev, [key, slot]) => {
    //   // prev[key] = ((h) => slot.bind(instance))(instance.$createElement)
    //   prev[key] = slot.bind(instance)
    //   return prev
    // }, {})

    return instance
  }
}
