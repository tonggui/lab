<template>
  <div>
    <Loading v-if="loading" />
    <Form
      :spuId="spuId"
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

  import { poiId } from '@/common/constants'

  import { fetchGetProductInfo, fetchSaveProductInfo } from '@/data/repos/medicine'
  import { fetchGetMedicineAllTagList } from '@/data/repos/category'
  import {
    fetchGetSpUpdateInfoById
  } from '@/data/repos/standardProduct'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'MedicineProductEdit',
    components: { Form },
    async created () {
      try {
        this.loading = true
        const tagList = await fetchGetMedicineAllTagList(poiId)
        this.tagList = tagList
        if (this.spuId) {
          this.product = await fetchGetProductInfo(this.spuId, poiId)
          this.checkSpChangeInfo(this.spuId)
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
        changes: [],
        submitting: false
      }
    },
    computed: {
      spuId () {
        return +(this.$route.query.spuId || 0)
      }
    },
    methods: {
      async checkSpChangeInfo (spuId) {
        try {
          const changes = await fetchGetSpUpdateInfoById(spuId)
          if (changes && changes.length) {
            this.changes = changes
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
