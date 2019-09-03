<script>
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
      },
      validator: {
        type: Function,
        default: () => ''
      }
    },
    computed: {
      isSingleSku () {
        return this.skuList.length <= 1
      }
    },
    methods: {
      handleChange (sku, value) {
        const message = this.validator(value)
        if (message) {
          this.$Message.warning(message)
          return
        }
        this.$emit('change', sku, value)
      },
      showModal () {
        const props = {
          felid: this.felid,
          skuList: this.skuList,
          product: this.product
        }
        const listeners = {
          onChange: this.handleChange
        }
        createModal(props, listeners)
      },
      handleSingleChange (value) {
        this.handleChange(this.skuList[0], value)
      }
    },
    render (h) {
      const info = config[this.felid]
      if (this.isSingleSku) {
        const sku = this.skuList[0]
        return info.editRender(h, { sku, onChange: this.handleSingleChange })
      }
      const { displayRender, editIcon } = info
      return <div>{ displayRender(h, this.product) }{ editIcon(h, { click: this.showModal }) }</div>
    }
  }
</script>
