/*
 * @description
 *   Please write the validator script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-04)
 */
import { findParentByName } from '@/common/vue'
import { isFunction } from 'lodash'

export default {
  created () {
    const container = findParentByName.call(this, 'dynamic-form')
    if (container) {
      this.__validatorContainer = container
      container.add(this)
    }
  },
  methods: {
    async validate () {
      const componentRef = this.$item.componentInstance
      if (this.config && this.config.validate) {
        await this.config.validate.call(this, this.config, componentRef, ...arguments)
      } else if (componentRef && isFunction(componentRef.validate)) {
        await componentRef.validate(...arguments)
      }
      return true
    }
  },
  destroyed () {
    const container = this.__validatorContainer
    if (container) {
      container.remove(this)
    }
  }
}
