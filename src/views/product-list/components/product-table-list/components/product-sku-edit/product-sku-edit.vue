<script>
  import { noop } from 'lodash'
  import createModal from './modal'
  import config from './config'

  export default {
    name: 'product-sku-edit',
    props: {
      felid: {
        type: [Number, String],
        required: true
      },
      product: {
        type: Object,
        required: true
      },
      skuList: {
        type: Array,
        required: true
      }
    },
    computed: {
      isSingleSku () {
        return this.skuList.length <= 1
      }
    },
    methods: {
      handleChange (sku, value) {
        const info = config[this.felid] || noop
        const message = info.validator(value)
        if (message) {
          this.$Message.error(message)
          return false
        }
        this.$emit('change', this.product, sku, value)
      },
      showModal () {
        const props = {
          felid: this.felid,
          skuList: this.skuList,
          product: this.product,
          edit: this.$scopedSlots.edit,
          onChange: this.handleChange
        }
        createModal(props)
      },
      handleSingleChange (value) {
        return this.handleChange(this.skuList[0], value)
      }
    },
    render (h) {
      const info = config[this.felid]
      if (this.isSingleSku) {
        const sku = this.skuList[0]
        return info.editRender(h, { sku, onChange: this.handleSingleChange })
      }
      return (
        <div>
          { info.displayRender(h, { product: this.product, skuList: this.skuList }) }
          <Icon class="edit-icon" color="#F89800" local="edit" vOn:click={this.showModal} size="20" />
        </div>
      )
    }
  }
</script>
