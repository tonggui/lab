<template>
  <div class="audit-product-operation">
    <span>
      <span @click="handleViewDetail" class="active">查看</span>
    </span>
    <span @click="handleCancel" v-if="showCancel" v-mc="{ bid: 'b_shangou_online_e_qj5i2fwi_mc', val: { type: 2, spu_id: product.id } }">撤销</span>
    <span @click="handleDelete" v-if="showDelete" v-mc="{ bid: 'b_shangou_online_e_qbwg8zwh_mc', val: { type: 3, spu_id: product.id } }">删除</span>
  </div>
</template>
<script>
  import { AuditTriggerMode, PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import {
    fetchSubmitDeleteProduct,
    fetchGetProductRevocation
  } from '@/data/repos/merchantProduct'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'audit-product-operation',
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    computed: {
      showDelete () {
        return [PRODUCT_AUDIT_STATUS.AUDIT_REJECTED, PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED].includes(this.product.auditStatus)
      },
      showCancel () {
        return [PRODUCT_AUDIT_STATUS.AUDITING, PRODUCT_AUDIT_STATUS.START_SELL_AUDITING].includes(this.product.auditStatus)
      },
      editPage () {
        return {
          path: '/merchant/product/auditCheck',
          query: { ...this.$route.query, spuId: this.product.id }
        }
      }
    },
    methods: {
      handleDelete () {
        this.$Modal.confirm({
          title: '删除商品',
          content: '确定删除该商品？删除后将同步删除所有门店该商品，如需再次售卖请重新创建该商品',
          okText: '删除',
          onOk: () => {
            fetchSubmitDeleteProduct([this.product.id], false, true, []).then(res => {
              this.$Message.success('删除成功')
              this.$emit('cancel')
            }).catch(err => {
              this.$Message.error(err.message)
            })
          }
        })
      },
      handleViewDetail () {
        lx.mc({
          bid: 'b_shangou_online_e_19l479hy_mc',
          val: { spu_id: this.product.id, type: 1 }
        })
        this.$router.push({ ...this.editPage })
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
                  await fetchGetProductRevocation(this.product.id)
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
                this.$router.push({ path: '/merchant/product/auditCheckEdit', query: { ...this.$route.query, spuId: this.product.id, modify: '1' } })
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
