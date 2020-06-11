<script>
  import WithValidatePoptip from '@/hoc/withValidatePoptip'
  import WithDefaultValue from '@/hoc/withDefaultValue'
  import WithInputTip from '@/hoc/withInputTip'
  import EditPrice from '@/components/product-price/edit-product-price'

  export default WithValidatePoptip(WithDefaultValue(WithInputTip(EditPrice)))
</script>
