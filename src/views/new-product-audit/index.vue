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
  import { combineCategoryMap } from '@/data/helper/category/operation'
  import _get from 'lodash/get'

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
      isManagerEdit () {
        return +this.$route.query.isEdit === 1
      },
      context () {
        return {
          field: {
            [SPU_FIELD.TAG_LIST]: {
              required: !this.usedBusinessTemplate
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
            audit: {
              snapshot: this.product.snapshot,
              productSource: this.product.productSource
            },
            excludeDisableFields: this.isManagerEdit ? [SPU_FIELD.NAME, SPU_FIELD.CATEGORY, SPU_FIELD.CATEGORY_ATTRS] : []
          }
        }
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
            const err = await this.$refs['form'].validate()
            if (err) {
              this.$Message.error(err)
            } else {
              const { normalAttributes, normalAttributesValueMap, sellAttributes, sellAttributesValueMap, ...rest } = this.product
              const { categoryAttrList, categoryAttrValueMap } = combineCategoryMap(normalAttributes, sellAttributes, normalAttributesValueMap, sellAttributesValueMap)
              const showLimitSale = _get(this.$refs.form.formContext, `field.${SPU_FIELD.LIMIT_SALE}.visible`)
              const productInfo = convertProductFormToServer({
                product: { ...rest, categoryAttrList, categoryAttrValueMap },
                context: {
                  showLimitSale,
                  entranceType: this.$route.query.entranceType,
                  dataSource: this.$route.query.dataSource
                }
              })
              sendMessage('productData', productInfo, null, mid, origin)
            }
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
    }
  }
</script>
