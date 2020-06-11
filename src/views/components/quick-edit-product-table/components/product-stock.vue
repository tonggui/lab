<script>
  import WithValidatePoptip from '@/hoc/withValidatePoptip'
  import WithDefaultValue from '@/hoc/withDefaultValue'
  import WithInputTip from '@/hoc/withInputTip'
  import EditStock from '@/components/product-stock/edit-product-stock'

  export default WithValidatePoptip(WithDefaultValue(WithInputTip(EditStock)))
</script>
