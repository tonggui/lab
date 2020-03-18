<template>
  <div class="audit-product-operation">
    <span>
      <router-link class="active" :to="editPage">查看</router-link>
      <!-- <NamedLink tag="a" class="active" :name="editPage" :query="{ spuId: product.id }">查看</NamedLink> -->
    </span>
    <span @click="handleCancel" v-if="showCancel">撤销</span>
  </div>
</template>
<script>
  // import NamedLink from '@/components/link/named-link'
  // import editPage from '@sgfe/eproduct/navigator/pages/product/edit'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import {
    fetchSubmitCancelProductAudit
  } from '@/data/repos/product'

  export default {
    name: 'audit-product-operation',
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        editPage: {
          path: '/product/auditCheck',
          query: { ...this.$route.query, spuId: this.product.id }
        }
      }
    },
    computed: {
      showCancel () {
        return this.product.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING
      }
    },
    methods: {
      handleCancel () {
        this.$Modal.confirm({
          title: '撤销商品审核',
          content: `是否撤销 ${this.product.name} 信息审核`,
          centerLayout: true,
          iconType: '',
          width: 412,
          onOk: async () => {
            try {
              await fetchSubmitCancelProductAudit(this.product.id)
              this.$emit('cancel')
            } catch (err) {
              this.$Message.error(err.message)
              throw err
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .audit-product-operation {
    color: @link-color;
    text-align: center;
    > span {
      &:not(:last-child) {
        margin-right: 20px;
      }
      cursor: pointer;
      text-decoration: underline;
    }
  }
</style>
