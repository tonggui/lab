<template>
  <div class="celluar-missing-product-sku-spec-name">
    <div v-if="hasCategoryAttr" class="name-container">
      <div class="name" :class="{ nowrap, 'with-icon': showIcon }" ref="categoryName">
        <Checkbox :value="sku.editable" @on-change="handleSkuSellStatusChange">售卖</Checkbox>
        {{ specName }}
      </div>
      <div class="icon" v-if="showIcon">
        <Tooltip transfer :max-width="200">
          <Icon size="16" local="file" />
          <span slot="content" class="tooltip-content">{{ specName }}</span>
        </Tooltip>
      </div>
    </div>
    <ValidateEidtSpecName placeholder="选填" v-else-if="editable" :required="required" :value="specName" @change="handleNameChange" type="textarea" :autosize="autosize" />
    <div v-else class="name-container">
      <div class="name" :class="{ nowrap, 'with-icon': showIcon }" ref="name">
        {{ specName }}
      </div>
      <div class="icon" v-if="showIcon">
        <Tooltip transfer :max-width="200">
          <Icon size="16" local="file" />
          <span slot="content" class="tooltip-content">{{ specName }}</span>
        </Tooltip>
      </div>
    </div>
  </div>
</template>
<script>
  import EditSpecName from '@/components/product-spec-name/edit-product-spec-name'
  import WrapperValidatePoptip from '@/hoc/withValidatePoptip'

  const ValidateEidtSpecName = WrapperValidatePoptip(EditSpecName)

  export default {
    name: 'celluar-missing-product-sku-spec-name',
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
        showIcon: false,
        autosize: { minRows: 1 }
      }
    },
    components: {
      ValidateEidtSpecName
    },
    watch: {
      sku (newSku, oldSku) {
        if (newSku.categoryAttrList !== oldSku || newSku.specName !== oldSku.specName) {
          this.showIcon = this.overflow()
        }
      }
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
    mounted () {
      const showIcon = this.overflow()
      this.showIcon = showIcon
    },
    methods: {
      overflow () {
        let $name
        if (this.hasCategoryAttr) {
          $name = this.$refs.categoryName
        } else if (!this.editable) {
          $name = this.$refs.name
        }
        if (!$name) {
          return false
        }
        return $name.scrollWidth > $name.clientWidth
      },
      handleSkuSellStatusChange (editable) {
        this.$emit('change-sell-status', editable)
      },
      handleNameChange (name) {
        this.$emit('change-name', name)
      }
    }
  }
</script>
<style lang="less" scoped>
  .celluar-missing-product-sku-spec-name {
    .name-container {
      position: relative;
      .name {
        text-align: left;
        &.nowrap {
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 100%;
          overflow: hidden;
        }
        white-space: normal;
        &.with-icon {
          padding-right: 16px;
        }
      }
      .icon {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      /deep/ .boo-checkbox-wrapper {
        margin-right: 8px;
      }
    }
  }
  .tooltip-content {
    white-space: normal;
    word-break: break-all;
  }
</style>
