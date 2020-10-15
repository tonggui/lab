<template>
  <div class="audit-product-operation">
    <span>
      <router-link class="active" :to="editPage">{{ editText }}</router-link>
    </span>
    <span @click="handleCancel" v-if="showCancel">撤销</span>
    <span @click="handleDelete" v-if="showDelete">删除</span>
    <span v-if="showCreate">
      <router-link class="active" :to="createPage">新建</router-link>
    </span>
  </div>
</template>
<script>
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import {
    cancelAudit as fetchSubmitCancelSpAudit,
    fetchSubmitDeleteSpAudit
  } from '@/data/repos/medicineSpAudit'

  export default {
    name: 'audit-product-operation',
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    computed: {
      isSelfSp () {
        return !!(this.product.wmPoiId === parseInt(this.$route.query.wmPoiId))
      },
      // 只有审核中可以撤销 并且要是自己创建的 可以撤销
      showCancel () {
        return this.isSelfSp && (this.product.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING)
      },
      // 未送审 驳回 和 已撤销 并且要是自己创建的 可以删除
      showDelete () {
        return this.isSelfSp && [
          PRODUCT_AUDIT_STATUS.SP_UNAUDIT,
          PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
          PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION
        ].includes(this.product.auditStatus)
      },
      showCreate () {
        return this.product.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED
      },
      editPage () {
        return {
          name: 'spApply',
          query: { ...this.$route.query, spId: this.product.id }
        }
      },
      createPage () {
        return {
          name: 'spCreate',
          query: { ...this.$route.query, upc: this.product.upcCode, name: this.product.name }
        }
      },
      // 审核中 和 审核通过 叫 查看 其他叫 编辑
      editText () {
        return [
          PRODUCT_AUDIT_STATUS.AUDITING,
          PRODUCT_AUDIT_STATUS.AUDIT_APPROVED
        ].includes(this.product.auditStatus) ? '查看' : '编辑'
      }
    },
    methods: {
      handleCancel () {
        this.$Modal.confirm({
          title: '撤销商品审核',
          content: `撤销【${this.product.name}】的信息审核`,
          centerLayout: true,
          iconType: '',
          width: 412,
          onOk: async () => {
            try {
              await fetchSubmitCancelSpAudit(this.product.id)
              this.$emit('cancel')
            } catch (err) {
              this.$Message.error(err.message)
              throw err
            }
          }
        })
      },
      handleDelete () {
        this.$Modal.confirm({
          title: '删除商品',
          content: `从商品审核中删除商品【${this.product.name}】`,
          centerLayout: true,
          iconType: '',
          width: 412,
          onOk: async () => {
            try {
              await fetchSubmitDeleteSpAudit(this.product.id)
              this.$emit('delete')
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
