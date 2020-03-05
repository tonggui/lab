<template>
  <div class="audit-product-operation">
    <span>
      <NamedLink tag="a" class="active" :name="editPage" :query="{ processId: product.processId }">查看</NamedLink>
    </span>
    <span @click="handleCancel" v-if="showCancel">撤销</span>
  </div>
</template>
<script>
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
          onOk: async () => {
            try {
              await fetchSubmitCancelProductAudit(this.product.processId)
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
    > span {
      margin-right: 20px;
      cursor: pointer;
    }
  }
</style>
