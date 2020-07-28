<template>
  <div class="combine-product-edit">
    <Loading v-if="loading" />
    <Form
      v-else
      v-model="product"
      navigation
      ref="form"
      :context="context"
      :is-edit-mode="isEditMode"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>
<script>
  import Form from './form'
  import {
    fetchGetProductDetail
  } from '@/data/repos/product'
  import {
    fetchGetSpInfoById
  } from '@/data/repos/standardProduct'
  import { categoryTemplateMix } from '@/views/category-template'
  import { sleep } from '@/common/utils'
  import errorHandler from './error'
  import { SPU_FELID } from '@/views/components/configurable-form/felid'

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
      spuId () {
        return this.$route.query.spuId
      },
      spId () {
        return this.$route.query.spId
      },
      isEditMode () {
        return this.spuId > 0
      },
      context () {
        return {
          felid: {
            [SPU_FELID.TAG_LIST]: {
              required: !this.usedBusinessTemplate
            }
          },
          features: {
            allowCategorySuggest: true // TODO 根据审核变化
          }
        }
      }
    },
    async mounted () {
      try {
        this.loading = true
        if (this.spuId) {
          await this.getDetail()
        } else if (this.spId) {
          await this.getSpDetail()
        }
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      } finally {
        this.loading = false
      }
    },
    methods: {
      async handleConfirm (callback) {
        try {
          // TODO 调接口
          const context = this.$refs.form.form.getPluginContext()
          console.log('confirm', this.product, context)
          await sleep(5000)
          this.handleCancel()
        } catch (err) {
          // 错误处理
          errorHandler(err)({
            isBusinessClient: this.isBusinessClient,
            confirm: this.confirm
          })
        } finally {
          callback()
        }
      },
      handleCancel () {
        this.$tryToNext()
      },
      async getDetail () {
        try {
          this.product = await fetchGetProductDetail(this.spuId)
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      async getSpDetail () {
        try {
          const spDetail = await fetchGetSpInfoById(+this.spId)
          const { id, ...rest } = spDetail
          this.product = Object.assign({}, rest, { spId: id })
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      }
    }
  }
</script>
