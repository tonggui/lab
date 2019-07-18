/*
 * @description
 *   Please write the validatorContainer script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-04)
 */
import { isFunction } from 'lodash'

export default {
  created () {
    this.$_mixins_validatorContainer_items = []
  },
  methods: {
    // TODO 校验顺序的问题
    // mounted可能会导致挂载顺序跟显示不一致，导致校验的触发顺序不同
    /**
     * @param mode 全部校验模式/中断式校验  默认中断式校验 -- 1
     * @return {Promise<void>}
     */
    async validate (mode = 1, showError = true) {
      const errors = []
      for (let i = 0, length = this.$_mixins_validatorContainer_items.length; i < length; i++) {
        const item = this.$_mixins_validatorContainer_items[i]
        try {
          await item.validate(...arguments)
        } catch (error) {
          errors.push({ $node: item, error })
          if (mode === 1) {
            break
          }
        }
      }
      if (errors.length && showError) {
        if (isFunction(showError)) {
          showError(errors)
        } else {
          this.showError(errors)
        }
      }
      if (errors && errors.length) {
        throw errors
      }
    },
    showError (errors) {
      if (errors.length) {
        const { $node, error } = errors[0]
        if (this.$Message) {
          this.$Message.warning(((error && error.message) || error))
        }
        const $element = $node.$el
        if ($element && $element.scrollIntoView) {
          $element.scrollIntoView({
            behavior: 'auto',
            block: 'start'
          })
        }
      }
    },
    add (item) {
      this.$_mixins_validatorContainer_items.push(item)
    },
    remove (item) {
      this.$_mixins_validatorContainer_items = this.$_mixins_validatorContainer_items
        .filter(i => i !== item)
    }
  },
  destroyed () {
    this.$_mixins_validatorContainer_items = null
  }
}
