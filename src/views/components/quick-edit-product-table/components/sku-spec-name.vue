<template>
  <div class="quick-edit-product-sku-spec-name">
    <template v-if="hasCategoryAttr">
      <TextOverflowEllipsis v-if="nowrap" :text="specName">
        <template slot="text">
          <Checkbox :value="sku.editable" @on-change="handleSkuSellStatusChange">售卖</Checkbox>
          {{ specName }}
        </template>
      </TextOverflowEllipsis>
      <div v-else>
        <Checkbox :value="sku.editable" @on-change="handleSkuSellStatusChange">售卖</Checkbox>
        {{ specName }}
      </div>
    </template>
    <ValidateEditSpecName placeholder="选填" v-else-if="editable" :required="required" :value="specName" @change="handleNameChange" type="textarea" :autosize="autosize" />
    <template v-else>
      <TextOverflowEllipsis v-if="nowrap" :text="specName" />
      <div v-else class="">{{ specName }}</div>
    </template>
  </div>
</template>
<script>
  import TextOverflowEllipsis from '@/components/text-overflow-ellipsis'
  import EditSpecName from '@/components/product-spec-name/edit-product-spec-name'
  import WrapperValidatePoptip from '@/hoc/withValidatePoptip'

  const ValidateEditSpecName = WrapperValidatePoptip(EditSpecName)

  export default {
    name: 'quick-edit-product-sku-spec-name',
    props: {
      editable: Boolean,
      sku: {
        type: Object,
        required: true
      },
      nowrap: Boolean,
      required: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        autosize: { minRows: 1 }
      }
    },
    components: {
      ValidateEditSpecName,
      TextOverflowEllipsis
    },
    computed: {
      hasCategoryAttr () {
        const { categoryAttrList } = this.sku
        return categoryAttrList && categoryAttrList.length > 0
      },
      specName () {
        if (!this.hasCategoryAttr) {
          return this.sku.specName
        }
        return this.sku.categoryAttrList.reduce((prev, { name }) => { prev += prev ? ` ${name}` : name; return prev }, '')
      }
    },
    methods: {
      handleSkuSellStatusChange (editable) {
        this.$emit('change-sell-status', editable)
      },
      handleNameChange (name) {
        this.$emit('change-name', name)
      }
    }
  }
</script>
<style lang="less">
  .quick-edit-product-sku-spec-name .boo-checkbox-wrapper {
    margin-right: 8px;
  }
</style>
