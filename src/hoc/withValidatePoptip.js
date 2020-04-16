import Vue from 'vue'
import { getName } from './helper'
import Tooltip from '@/components/tooltip'

export default (WrapperComponent, { duraution = 3000, transfer = false } = {}) => Vue.extend({
  name: getName('with-validate-poptip', WrapperComponent),
  data () {
    return {
      error: '',
      show: false
    }
  },
  watch: {
    error () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.show) {
          this.show = false
        }
      }, duraution)
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
    }
  },
  render (h) {
    const { 'on-error': onError, ...rest } = this.$listeners
    const node = h(Tooltip, {
      attrs: {
        disabled: !this.show,
        always: true,
        content: this.error,
        placement: 'top-start',
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
      }
    })])
    return node
  }
})
