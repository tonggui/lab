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
    <div :key="`${product.id}--${felid}`" slot="modal-content" style="margin-top: 20px">
      <span style="margin-right: 20px">选择设置范围</span>
      <RadioGroup v-model="poiType">
        <Radio v-for="option in options" :label="option.value" :key="option.value">
          {{ option.label }}
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
  import Drawer from '@/views/components/poi-select/poi-select-drawer'
  import config, {
    defaultPoiType,
    POI_SELECT_OPTIONS,
    POI_SELECT_TYPE
  } from './config'

  const createPoiDrawer = createPopper(Drawer)

  export default {
    name: 'merchant-product-sku-edit',
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
        poiType: defaultPoiType,
        modalProps: {
          okText: '下一步'
        }
      }
    },
    computed: {
      options () {
        return POI_SELECT_OPTIONS
      }
    },
    created () {
      this.submitData = {
        skuList: [],
        poiIdList: []
      }
    },
    components: {
      ProductSkuEdit
    },
    methods: {
      handlePoiTypeChange (type) {
        this.poiType = type
      },
      handleNext (skuList) {
        this.submitData.skuList = skuList
        this.submitData.poiIdList = []
        const type = this.poiType
        if (type === POI_SELECT_TYPE.PART_POI) {
          createPoiDrawer({
            props: { title: '选择门店' },
            on: { 'on-confirm': this.handleSelectPoi }
          })
        } else if (type === POI_SELECT_TYPE.ALL_POI) {
          this.$Modal.confirm({
            title: '提示',
            content: config[this.felid].confirmContent,
            onOk: this.handleSubmit
          })
        }
      },
      handleSelectPoi (poiIdList) {
        this.submitData.poiIdList = poiIdList
        return this.handleSubmit()
      },
      async handleSubmit () {
        try {
          await new Promise((resolve, reject) => {
            this.$emit('submit', this.submitData, this.createCallback(resolve, reject))
          })
          this.$Message.success(config[this.felid].successTip)
        } catch (err) {
          this.$Message.warning(err.message || config[this.felid].errorTip)
        }
      }
    }
  }
</script>
