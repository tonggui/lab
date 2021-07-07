<template>
  <OrderFormItem label="填写表格" :index="index + 1" style="margin-bottom: 0;">
    <ProductForm
      v-model="product"
      :context="context"
      @validate="handleValidate"
      @confirm="handleConfirm"
      hide-cancel
      class="batch-create-form"
    />
  </OrderFormItem>
</template>
<script>
  import { fetchSubmitBatchCreateByProduct } from '@/data/repos/batch'
  import { fetchGetSpInfoByUpc } from '@/data/repos/standardProduct'
  import OrderFormItem from '@components/order-form-item'
  import ProductForm from './form'
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  import errorHandler from '@/views/edit-page-common/error'
  import { combineCategoryMap } from '@/data/helper/category/operation'
  import TimeCounters, { FillTime, SearchTime } from '@/common/lx/lxReport/lxTime'
  import lx from '@/common/lx/lxReport'
  import { getProductChangInfo } from '@/common/utils'
  import { uuid } from '@utiljs/guid'
  import { debounce, get } from 'lodash'

  export default {
    name: 'new-batch-product-create',
    props: {
      index: {
        type: Number,
        default: 0
      },
      poiIdList: Array,
      isBusinessClient: Boolean
    },
    components: {
      ProductForm,
      OrderFormItem
    },
    data () {
      return {
        isUpcValid: true,
        product: {}
      }
    },
    watch: {
      'product.skuList' (newSkuList = [], oldSkuList = []) {
        const newSkuUpcCode = get(newSkuList.find(item => item.editable), 'upcCode', '').trim()
        const oldSkuUpcCode = get(oldSkuList.find(item => item.editable), 'upcCode', '').trim()

        if (newSkuUpcCode && newSkuUpcCode !== oldSkuUpcCode) {
          this.getUpcIsValid(newSkuUpcCode)
        } else if (!newSkuUpcCode) {
          this.isUpcValid = true
        }
      }
    },
    mounted () {
      this.createTime = Date.now()
      FillTime.fillStartTime = +new Date()
      window.addEventListener('beforeunload', this.pageLeave)
    },
    computed: {
      context () {
        return {
          field: {
            [SPU_FIELD.LIMIT_SALE]: {
              visible: false
            },
            [SPU_FIELD.PRODUCT_VIDEO]: {
              visible: false
            },
            [SPU_FIELD.UPC_IMAGE]: {
              required: this.isUpcValid
            }
          },
          features: {
            showCellularTopSale: false,
            allowAttrApply: false
          }
        }
      }
    },
    methods: {
      getUpcIsValid: debounce(async function (upcCode) {
        try {
          this.isUpcValid = !!await fetchGetSpInfoByUpc(upcCode)
        } catch (err) {
          this.isUpcValid = false
        }
      }, 200),
      handleValidate (cb) {
        let error
        if (this.poiIdList.length <= 0) {
          error = '请先选择目标门店'
        }
        cb(error)
      },
      async handleConfirm (callback, context = {}) {
        try {
          const { normalAttributes, normalAttributesValueMap, sellAttributes, sellAttributesValueMap, ...rest } = this.product
          const { categoryAttrList, categoryAttrValueMap } = combineCategoryMap(normalAttributes, sellAttributes, normalAttributesValueMap, sellAttributesValueMap)
          const traceId = uuid()
          const response = await fetchSubmitBatchCreateByProduct({
            product: {
              ...rest,
              categoryAttrList,
              categoryAttrValueMap
            },
            poiIdList: this.poiIdList,
            context,
            extra: {
              biz: this.product.spId ? '单个商品搜索新建批量生成（跨店）' : '单个商品手动新建批量生成（跨店）',
              traceId
            }
          })
          FillTime.fillEndTime = +new Date()
          lx.mv({
            bid: 'b_shangou_online_e_aifq7sdx_mv',
            val: {
              spu_id: this.product.spuId || response.id || 0,
              st_spu_id: this.product.spId || 0,
              source_id: 1,
              viewtime: `${(SearchTime.getSearchTime() + FillTime.getFillTime() + TimeCounters.getTotal('poi')).toFixed(2)}, ${SearchTime.getSearchTime()}, ${(FillTime.getFillTime() + TimeCounters.getTotal('poi')).toFixed(2)}`,
              select_time: +new Date(response && response.serverTime ? response.serverTime : Date.now()).getTime(),
              list: TimeCounters.getResult(),
              trace_id: traceId
            }
          })

          lx.mv({
            bid: 'b_shangou_online_e_5f609qb1_mv',
            val: {
              st_spu_id: this.product.spId || 0,
              op_type: this.product.spId ? 1 : 0,
              poi_num: this.poiIdList.length
            }
          })

          this.$emit('submit')
        } catch (err) {
          errorHandler(err)({
            isBusinessClient: this.isBusinessClient,
            confirm: this.handleConfirm
          })
        } finally {
          callback()
        }
      },
      pageLeave () {
        lx.mc({
          cid: 'c_fd6n21x7',
          bid: 'b_shangou_online_e_7cxe0v96_mc',
          val: {
            list: getProductChangInfo(this.product),
            op_type: this.product.spId ? 1 : 0
          }
        })
      }
    },
    beforeDestroy () {
      this.pageLeave()
    }
  }
</script>
<style lang="less" scoped>
  .batch-create-form {
    /deep/ .form .card {
      box-shadow: none;
    }
    /deep/ .footer {
      box-shadow: none;
    }
  }
</style>
