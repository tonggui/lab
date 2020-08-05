<template>
  <div class="combine-product-edit">
    <Loading v-if="loading" />
    <Form
      v-else
      v-model="product"
      ref="form"
      :disabled="true"
      :hideFooter="true"
      :context="context"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>
<script>
  import Form from './form'
  import { fetchGetAuditProductDetail } from '@/data/repos/merchantProduct' // 商家商品中心审核详情接口
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  import { convertProductFormToServer } from '@/data/helper/product/withCategoryAttr/convertToServer'
  import { getPoiId } from '@/common/constants'
  import {
    destroy,
    registerActionHandler,
    sendMessage,
    setup,
    unregisterActionHandler
  } from '@/common/bridge/bridge_manager'
  import _isString from 'lodash/isString'

  export default {
    name: 'combine-product-edit',
    data () {
      return {
        loading: true,
        product: {}
      }
    },
    components: { Form },
    computed: {
      spuId () {
        return +(this.$route.query.spuId || 0)
      },
      isManagerEdit () {
        return +this.$route.query.isEdit === 1
      },
      context () {
        return {
          field: {
            // TODO 审核暂不支持，所以写死，融合的时候去掉
            [SPU_FIELD.SELL_STATUS]: {
              visible: false
            },
            [SPU_FIELD.UPC_CODE]: {
              visible: !!(this.product.id && this.product.upcCode)
            },
            [SPU_FIELD.UPC_IMAGE]: {
              disabled: true,
              visible: !!this.product.upcImage
            }
          },
          features: {
            excludeDisableFields: this.isManagerEdit ? [SPU_FIELD.NAME, SPU_FIELD.CATEGORY, SPU_FIELD.CATEGORY_ATTRS] : []
          }
        }
      }
    },
    mounted () {
      window.t = this
      setup()
      registerActionHandler('getProductData', this.handleGetProductDataEvent)
    },
    async created () {
      try {
        this.loading = true
        if (this.spuId) {
          await this.getDetail()
        }
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      } finally {
        this.loading = false
      }
    },
    methods: {
      handleCancel () {},
      handleConfirm () {},
      async getDetail () {
        try {
          this.product = await fetchGetAuditProductDetail(+this.spuId)
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      async handleGetProductDataEvent ({ mid }, origin) {
        if (this.productForm) {
          try {
            await this.$refs['form'].validate()
            // const { product } = await this.productForm.validateAndCompute()
            const productInfo = convertProductFormToServer({
              poiId: getPoiId(),
              product: this.product,
              context: {
                entranceType: this.$route.query.entranceType,
                dataSource: this.$route.query.dataSource
              }
            })
            sendMessage('productData', productInfo, null, mid, origin)
          } catch (e) {
            const errorMsg = _isString(e) ? e : e.message
            sendMessage('productData', null, errorMsg, mid, origin)
          }
        }
      }
    },
    beforeDestroy () {
      unregisterActionHandler('getProductData', this.handleGetProductDataEvent)
      destroy()
    }
  }
</script>
