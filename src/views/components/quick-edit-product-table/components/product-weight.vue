<script>
  import WrapperValidatePoptip from '@/hoc/withValidatePoptip'
  import EditWeight from '@/components/product-weight/edit-product-weight'
  import ProductWeight from '@/components/product-weight/product-weight'
  import WithInputTip from '@/hoc/withInputTip'

  const ValidateEditWeight = WithInputTip(WrapperValidatePoptip(EditWeight))

  export default {
    name: 'quick-edit-product-weight',
    props: {
      editable: Boolean,
      disabled: Boolean,
      value: Object,
      tip: String
    },
    methods: {
      handleChange (value) {
        this.$emit('on-change', value)
      }
    },
    render () {
      if (this.editable) {
        return <ValidateEditWeight tip={this.tip} disabled={this.disabled} width={180} onChange={this.handleChange} class="quick-edit-product-sku-weight" value={this.value} />
      }
      return <ProductWeight value={this.value} />
    }
  }
</script>
