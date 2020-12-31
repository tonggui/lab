import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import convertStandardProduct from '@/views/components/configurable-form/helper/convertStandardProduct'

/**
 * upc-code 输入获取标品逻辑
 * 主要是做标品回填和删除填入信息（reset）
 */
export default (WrapperComponent) => Vue.extend({
  name: 'upc-input-container',
  methods: {
    triggerChange (updateProduct) {
      const { upcCode, ...rest } = updateProduct
      if ('upcCode' in updateProduct) {
        this.$emit('change', upcCode)
      }
      this.$emit('change-data', rest)
    },
    // 更新根据upc拉回来的标品信息，回填到商品信息上
    handleSelectSp (sp) {
      if (!sp) {
        return
      }
      this.triggerChange(convertStandardProduct(sp))
    },
    // 更新根据upc拉回来的类目信息
    handleUpdateCategory (category) {
      if (category.id && category.idPath) {
        this.triggerChange({ category })
      }
    },
    handleChange (upcCode) {
      // 更新upc 以及连带的 spId，isSp
      this.triggerChange({
        upcCode,
        spId: 0,
        isSp: false,
        releaseType: 0, // TODO 不知道做啥的，从旧代码迁移过来的
        suggestedPrice: 0, // TODO 不知道做啥的，从旧代码迁移过来的
        maxPrice: 0, // TODO 不知道做啥的，从旧代码迁移过来的
        minPrice: 0 // TODO 不知道做啥的，从旧代码迁移过来的
      })
    },
    handleDelete () {
      this.$emit('delete')
    }
  },
  render (h) {
    return forwardComponent(this, WrapperComponent, {
      on: {
        // 无需获取输入框信息变更带来的变化，不需要在输入框变更时将信息设置为非标品
        // 'on-change': this.handleChange,
        'on-update-category': this.handleUpdateCategory,
        'on-select-product': this.handleSelectSp,
        'delete-all-data': this.handleDelete
      }
    })
  }
})
