<template>
  <ProductSkuEdit
    v-bind="$attrs"
    :product="product"
    :felid="felid"
    :single-inline="false"
    @submit="handleNext"
    editType="inline"
    showWeight
    :modalProps="modalProps"
  >
    <div class="range" :key="`${product.id}--${felid}`" slot="modal-content">
      <span class="range-label">选择设置范围</span>
      <RadioGroup v-model="poiType">
        <Radio v-for="option in options" :label="option.value" :key="option.value">
          <span>{{ option.label }}</span>
        </Radio>
      </RadioGroup>
    </div>
    <template v-slot:display="props" v-if="$slots.display || $scopedSlots.display">
      <slot name="display" v-bind="props"></slot>
    </template>
  </ProductSkuEdit>
</template>
<script>
  import createPopper from '@/hoc/withCreatePopper'
  import ProductSkuEdit from '@/views/components/product-sku-edit'
  import Drawer from '@/views/merchant/components/product-relpoi-select-drawer'
  import config, {
    defaultPoiType,
    POI_SELECT_OPTIONS,
    POI_SELECT_TYPE,
    MODAL_TITLE
  } from './config'

  const createPoiDrawer = createPopper(Drawer)

  export default {
    name: 'multi-store-product-sku-edit',
    props: {
      createCallback: {
        type: Function,
        default: (success) => success()
      },
      felid: Number,
      product: Object
    },
    data () {
      return {
        poiType: defaultPoiType
      }
    },
    computed: {
      options () {
        return POI_SELECT_OPTIONS
      },
      modalProps () {
        return {
          okText: '下一步',
          title: MODAL_TITLE[this.felid],
          centerLayout: true
        }
      }
    },
    created () {
      this.submitData = {
        isSelectAll: false,
        poiIdList: []
      }
      this.skuList = []
      this.$drawer = null
    },
    components: {
      ProductSkuEdit
    },
    beforeDestroy () {
      if (this.$drawer) {
        this.$drawer.destroy()
        this.$drawer = null
      }
    },
    methods: {
      handlePoiTypeChange (type) {
        this.poiType = type
      },
      handleNext (skuList) {
        this.submitData.isSelectAll = false
        this.skuList = skuList
        this.submitData.poiIdList = []
        const type = this.poiType
        if (type === POI_SELECT_TYPE.PART_POI) {
          this.$drawer = createPoiDrawer({
            props: { product: this.product },
            on: { 'on-confirm': this.handleSelectPoi }
          })
        } else if (type === POI_SELECT_TYPE.ALL_POI) {
          this.submitData.isSelectAll = true
          this.$Modal.open({
            centerLayout: true,
            width: 272,
            closable: false,
            maskClosable: false,
            render: () => <div style="text-align: center">{ config[this.felid].confirmContent }</div>,
            onOk: this.handleSubmit
          })
        }
      },
      handleSelectPoi (poiIdList) {
        this.submitData.poiIdList = poiIdList.map(item => item.id)
        return this.handleSubmit()
      },
      async handleSubmit () {
        try {
          await new Promise((resolve, reject) => {
            this.$emit('submit', this.product, this.skuList, this.submitData, this.createCallback(resolve, reject))
          })
          this.$Message.success(config[this.felid].successTip)
        } catch (err) {
          // TODO throw不是很合适
          this.$Message.warning(err.message || config[this.felid].errorTip)
          throw err
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .range {
    margin-top: 20px;
    display: flex;
    align-items: center;
    .range-label {
      margin-right: 20px;
      display: inline-block;
      vertical-align: middle;
    }
    /deep/ span.boo-radio + * {
      margin-left: 0;
      margin-right: 0;
    }
    /deep/ .boo-radio-wrapper {
      margin-right: 20px;
    }
  }
</style>
