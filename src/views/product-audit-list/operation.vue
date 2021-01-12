<template>
  <div class="audit-product-operation">
    <span>
      <router-link class="active" :to="editPage" v-mc="{ bid: 'b_shangou_online_e_th64x9vo_mc', val: { type: 1 } }">查看</router-link>
      <!-- <NamedLink tag="a" class="active" :name="editPage" :query="{ spuId: product.id }">查看</NamedLink> -->
    </span>
    <span @click="handleCancel" v-if="showCancel" v-mc="{ bid: 'b_shangou_online_e_th64x9vo_mc', val: { type: 2 } }">撤销</span>
    <span @click="handleDelete" v-if="showDelete" v-mc="{ bid: deleteOperation.bid, val: { type: 3, spu_id: product.id } }">删除</span>
  </div>
</template>
<script>
  // import NamedLink from '@/components/link/named-link'
  // import editPage from '@sgfe/eproduct/navigator/pages/product/edit'
  import { AuditTriggerMode, PRODUCT_AUDIT_STATUS, PRODUCT_STATUS } from '@/data/enums/product'
  import {
    fetchSubmitCancelProductAudit,
    fetchSubmitDeleteProduct
  } from '@/data/repos/product'
  import DeleteOperation from './deleteOperation'

  export default {
    name: 'audit-product-operation',
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    computed: {
      deleteOperation () {
        return DeleteOperation[this.product.auditStatus]
      },
      showDelete () {
        return Object.keys(DeleteOperation).includes(this.product.auditStatus.toString())
      },
      showCancel () {
        return [PRODUCT_AUDIT_STATUS.AUDITING, PRODUCT_AUDIT_STATUS.START_SELL_AUDITING].includes(this.product.auditStatus)
      },
      editPage () {
        return {
          path: '/product/auditCheck',
          query: { ...this.$route.query, spuId: this.product.id }
        }
      }
    },
    methods: {
      handleDelete () {
        this.$Modal.confirm({
          title: '删除商品',
          content: this.deleteOperation.content,
          okText: '删除',
          onOk: () => {
            const param = { force: false, productStatus: PRODUCT_STATUS.ALL, tagId: 0 }
            fetchSubmitDeleteProduct(this.product, false, param).then(res => {
              this.$Message.success('删除成功')
              this.$emit('cancel')
            }).catch(err => {
              this.$Message.error(err.message)
            })
          }
        })
      },
      handleCancel () {
        let tip = '注：选择"撤销"后，新建的商品会被删除，在售商品可重新提审'
        switch (this.product.triggerMode) {
        case AuditTriggerMode.CREATE:
          tip = '注：该商品是新建商品，若选择"撤销"会删除商品'
          break
        case AuditTriggerMode.MODIFY:
          tip = '撤销后可重新提交审核'
          break
        default: break
        }
        const $modal = this.$Modal.open({
          title: '撤销商品审核',
          content: `撤销【${this.product.name}】的信息审核。<br><br>${tip}`,
          centerLayout: true,
          iconType: '',
          width: 412,
          closable: true,
          renderFooter: () => (
            <div>
              <Button onClick={async () => {
                try {
                  await fetchSubmitCancelProductAudit(this.product.id)
                  this.$emit('cancel')
                  $modal.destroy()
                } catch (err) {
                  this.$Message.error(err.message)
                  throw err
                }
              }}>撤销</Button>
              <Button type="primary" onClick={() => {
                $modal.destroy()
                // TODO 调整到重新提交的详情页面
                this.$router.push({ name: 'productAuditCheckEdit', query: { ...this.$route.query, spuId: this.product.id, modify: '1' } })
              }}>修改商品</Button>
            </div>
          )
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
