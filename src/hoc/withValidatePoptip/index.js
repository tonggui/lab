import Vue from 'vue'
import { getName } from '../helper'
import Tooltip from '@/components/tooltip'
import './index.less'

export default (WrapperComponent, { duraution = 3000, transfer = false } = {}) => Vue.extend({
  name: getName('with-validate-poptip', WrapperComponent),
  data () {
    return {
      error: '',
      show: false
    }
  },
  created () {
    this.timer = null
  },
  methods: {
    handleError (error) {
      this.show = !!error
      this.error = error
      this.$emit('on-error', error)
      this.showError(error)
    },
    showError () {
      clearTimeout(this.timer)
      if (!this.error) {
        return
      }
      this.timer = setTimeout(() => {
        if (this.show) {
          this.show = false
        }
      }, duraution)
    }
  },
  render (h) {
    const { 'on-error': onError, ...rest } = this.$listeners
    const node = h(Tooltip, {
      attrs: {
        disabled: !this.show,
        always: true,
        content: this.error,
        placement: 'top',
        popperClass: 'validate-poptip',
        transfer
      }
    }, [h(WrapperComponent, {
      props: {
        showErrorTip: false
      },
      attrs: { ...this.$attrs },
      on: {
        ...rest,
        'on-error': this.handleError
      },
      scopedSlots: this.$scopedSlots
    })])
    return node
  }
})
