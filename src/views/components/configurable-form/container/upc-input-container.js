import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import convertStandardProduct from '@/views/components/configurable-form/helper/convertStandardProduct'

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
    handleSelectSp (sp) {
      if (!sp) {
        return
      }
      this.triggerChange(convertStandardProduct(sp))
    },
    handleUpdateCategory (category) {
      if (category.id && category.idPath) {
        this.triggerChange({ category })
      }
    },
    handleChange (upcCode) {
      this.triggerChange({
        upcCode,
        spId: 0,
        isSp: false,
        releaseType: 0, // TODO
        suggestedPrice: 0, // TODO
        maxPrice: 0, // TODO
        minPrice: 0 // TODO
      })
    },
    handleDelete () {
      this.$emit('delete')
    }
  },
  render (h) {
    return forwardComponent(this, WrapperComponent, {
      on: {
        'on-change': this.handleChange,
        'on-update-category': this.handleUpdateCategory,
        'on-select-product': this.handleSelectSp,
        'delete-all-data': this.handleDelete
      }
    })
  }
})
