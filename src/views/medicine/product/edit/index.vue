<template>
  <div>
    <Loading v-if="loading" />
    <Form
      v-else
      :changeInfo="changeInfo"
      :spuId="spuId"
      :modules="modules"
      :tagList="tagList"
      :product="product"
      :submitting="submitting"
      @on-confirm="handleConfirm"
      @cancel="goBack"
    />
  </div>
</template>

<script>
  import Form from '@/views/components/product-form/medicine-form'
  import { PRODUCT_LIMIT_SALE, PRODUCT_SELL_TIME } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  import { poiId } from '@/common/constants'

  import { fetchGetProductInfo, fetchGetSpUpdateInfo, fetchSaveProductInfo } from '@/data/repos/medicine'
  import { fetchGetMedicineAllTagList } from '@/data/repos/category'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'MedicineProductEdit',
    components: { Form },
    created: async function () {
      try {
        this.loading = true
        const tagList = await fetchGetMedicineAllTagList(poiId)
        this.tagList = tagList
        console.log('this.spuId', this.spuId)

        if (this.spuId) {
          this.product = await fetchGetProductInfo(this.spuId, poiId)
          console.log('this.spuId', this.product)
          if (this.product.type === 3) { // 只有类型是3才获取标品更新信息
            this.checkSpChangeInfo(this.spuId)
          }
        }
        this.loading = false
      } catch (err) {
        this.loading = false
        console.error(err)
        this.$Message.error(err.message || err)
      }
    },
    data () {
      return {
        loading: false,
        product: {},
        tagList: [],
        changeInfo: {},
        submitting: false
      }
    },
    computed: {
      ...mapModule({
        showSellTime: PRODUCT_SELL_TIME,
        showLimitSale: PRODUCT_LIMIT_SALE
      }),
      spuId () {
        return +(this.$route.query.spuId || 0)
      },
      modules () {
        return {
          sellTime: this.showSellTime,
          limitSale: this.showLimitSale
        }
      }
    },
    methods: {
      async checkSpChangeInfo (spuId) {
        try {
          const changeInfo = await fetchGetSpUpdateInfo(spuId)
          console.log('changeInfo', changeInfo)
          if (changeInfo.basicInfoList.length || changeInfo.categoryAttrInfoList.length) {
            this.changeInfo = changeInfo
          }
        } catch (err) {
          console.error(err.message)
        }
      },
      async handleConfirm (product, context) {
        const { spChangeInfoDecision = 0 } = context
        try {
          this.submitting = true
          await fetchSaveProductInfo(product, poiId)
          this.submitting = false
          // op_type 标品更新纠错处理，0表示没有弹窗
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 1, fail_reason: '', spu_id: this.spuId || 0 } })
          this.$Message.success('保存成功')
          setTimeout(() => this.goBack(), 2000) // 返回
        } catch (err) {
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 0, fail_reason: `${err.code}: ${err.message}`, spu_id: this.spuId || 0 } })
          this.$Message.error((err && err.message) || err || '保存失败')
        }
        this.submitting = false
      },
      goBack () {
        window.history.go(-1)
      }
    }
  }
</script>
