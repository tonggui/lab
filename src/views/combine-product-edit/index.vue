<template>
  <div class="combine-product-edit">
    <Loading v-if="loading" />
    <Form
      v-else
      v-model="product"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>
<script>
  import Form from '@/views/components/configurable-form/instance/common-form'
  import { fetchGetProductDetail } from '@/data/repos/product'
  import {
    fetchGetSpInfoById
  } from '@/data/repos/standardProduct'

  export default {
    name: 'combine-product-edit',
    data () {
      return {
        // TODO
        loading: true,
        product: {}
      }
    },
    components: { Form },
    computed: {
      spuId () {
        return this.$route.query.spuId
      },
      spId () {
        return this.$route.query.spId
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
      handleConfirm () {
        console.log('confirm', this.product)
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
