<template>
  <div class="combine-product-edit">
    <Loading v-if="loading" />
    <Form
      v-else
      v-model="product"
      ref="form"
      navigation
      :hideFooter="true"
      :context="context"
      :is-edit-mode="isEditMode"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>
<script>
  import Form from './form'
  import { fetchGetProductDetail } from '@/data/repos/product'
  import { categoryTemplateMix } from '@/views/category-template'
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  import { convertProductFormToServer } from '@/data/helper/product/withCategoryAttr/convertToServer'
  import {
    destroy,
    registerActionHandler,
    sendMessage,
    setup,
    unregisterActionHandler
  } from '@/common/bridge/bridge_manager'
  import _isString from 'lodash/isString'
  import { EDIT_TYPE } from '@/data/enums/common'

  export default {
    name: 'combine-product-edit',
    data () {
      return {
        loading: true,
        product: {}
      }
    },
    components: { Form },
    mixins: [categoryTemplateMix],
    computed: {
      mode () {
        return EDIT_TYPE.AUDIT
      },
      spuId () {
        return this.$route.query.spuId
      },
      // TODO 需要?
      isEditMode () {
        return this.spuId > 0
      },
      context () {
        return {
          field: {
            [SPU_FIELD.TAG_LIST]: {
              // TODO 使用分类模版?
              required: !this.usedBusinessTemplate
            }
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
      handleConfirm () {},
      handleCancel () {},
      async getDetail () {
        try {
          this.product = await fetchGetProductDetail(+this.spuId)
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      async handleGetProductDataEvent ({ mid }, origin) {
        if (this.$refs['form']) {
          try {
            await this.$refs['form'].validate()
            const productInfo = convertProductFormToServer({
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
