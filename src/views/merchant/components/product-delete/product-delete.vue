<template>
  <span @click="handleClick" class="delete-operation"><slot></slot></span>
</template>
<script>
  import createPopper from '@/hoc/withCreatePopper'
  import Drawer from '@/views/merchant/components/product-relpoi-select-drawer'
  import { TYPE, OPTIONS, defaultType } from './constants'

  const createPoiDrawer = createPopper(Drawer)

  export default {
    name: 'merchant-product-delete',
    props: {
      product: {
        type: Object,
        required: true
      },
      createCallback: {
        type: Function,
        default: success => success
      }
    },
    data () {
      return {
        submitting: false,
        type: defaultType
      }
    },
    created () {
      this.poiIdList = []
      this.isSelectAll = false
      this.isMerchantDelete = false
    },
    methods: {
      handleClick () {
        this.$Modal.open({
          title: '删除商品',
          render: () => {
            return (
              <div>
                <div style="margin-bottom: 10px">
                  确认删除“{ this.product.name }”
                </div>
                <RadioGroup vModel={this.type}>
                  {
                    OPTIONS.map(({ value, label }) => (
                      <Radio label={value} key={value}>{ label }</Radio>
                    ))
                  }
                </RadioGroup>
              </div>
            )
          },
          onOk: this.handleNext,
          okText: '下一步'
        })
      },
      handleNext () {
        const type = this.type
        // 删除总部
        this.isMerchantDelete = false
        this.isSelectAll = false
        this.poiIdList = []
        if (type === TYPE.MERCHANT) {
          this.handleDeleteMerchant()
          return
        }
        if (type === TYPE.ALL_POI) {
          this.handleDeleteAll()
          return
        }
        if (type === TYPE.SELECT_POI) {
          createPoiDrawer({
            props: { product: this.product, loading: this.submitting },
            on: { 'on-confirm': this.handleSelectPoi }
          })
        }
      },
      handleDeleteMerchant () {
        this.isMerchantDelete = true
        this.$Modal.confirm({
          title: '确认仅删除总部商品',
          content: '只删除商家总部商品库的商品，门店商品不删除',
          onOk: this.handleSubmit
        })
      },
      handleDeleteAll (callback) {
        this.isSelectAll = true
        this.$Modal.confirm({
          title: '确认删除所有门店商品',
          content: '删除商家总部商品，并从所有关联门店中删除该商品。',
          onOk: this.handleSubmit
        })
      },
      handleSelectPoi (poiIdList) {
        this.poiIdList = poiIdList.map(item => item.id)
        return this.handleSubmit()
      },
      async handleSubmit () {
        try {
          const { isMerchantDelete, isSelectAll, poiIdList } = this
          await new Promise((resolve, reject) => {
            this.$emit('submit', { isMerchantDelete, isSelectAll, poiIdList }, this.createCallback(resolve, reject))
          })
          this.$Message.success('商品删除成功～')
        } catch (err) {
          this.$Message.warning(err.message || '商品删除失败！')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .delete-operation {
    color: #858692;
  }
</style>
