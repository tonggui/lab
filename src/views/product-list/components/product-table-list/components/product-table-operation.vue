<template>
  <div class="product-table-op-cell" :class="{ disabled: disabled }">
    <span v-mc="{ bid: 'b_sfkii6px' }">
      <Link
        v-if="isPackageProduct"
        :disabled="disabled"
        tag="a"
        :delay="30"
        class="active"
        :to="{ name: 'productPackageEdit', query: { spuId: product.id } }"
      >编辑</Link>
      <NamedLink
        v-else
        :disabled="disabled"
        tag="a"
        :delay="30"
        class="active"
        :name="editPage"
        :query="{spuId: product.id}"
      >编辑</NamedLink>
    </span>
    <span :class="{ disabled: product.isStopSell }"  v-if="!isAudit">
      <span v-mc="{ bid: 'b_yo8d391g', val: { type: 1 } }" v-if="product.sellStatus === PRODUCT_SELL_STATUS.OFF" @click="handleChangeStatus(PRODUCT_SELL_STATUS.ON)">上架</span>
      <span v-mc="{ bid: 'b_yo8d391g', val: { type: 0 } }" v-if="product.sellStatus === PRODUCT_SELL_STATUS.ON" @click="handleChangeStatus(PRODUCT_SELL_STATUS.OFF)">下架</span>
    </span>
    <span v-mc="{ bid: 'b_ugst7wnh' }" @click="handleDelete">删除</span>
  </div>
</template>
<script>
  import NamedLink from '@/components/link/named-link'
  import Link from '@/components/link/link'
  import editPage from '@sgfe/eproduct/navigator/pages/product/edit'
  import {
    PRODUCT_SELL_STATUS,
    QUALIFICATION_STATUS,
    PRODUCT_AUDIT_STATUS,
    PRODUCT_TYPE
  } from '@/data/enums/product'
  import { defaultTagId } from '@/data/constants/poi'
  import { createCallback } from '@/common/vuex'
  import createAddQualificationModal from '@/components/qualification-modal'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'product-list-table-operation',
    props: {
      product: {
        type: Object,
        default: () => ({})
      },
      disabled: Boolean,
      tagId: Number,
      createCallback: {
        type: Function,
        default: createCallback
      }
    },
    data () {
      return {
        submitting: {
          status: false,
          delete: false
        }
      }
    },
    computed: {
      editPage () {
        return editPage.name
      },
      PRODUCT_SELL_STATUS () {
        return PRODUCT_SELL_STATUS
      },
      isAudit () {
        return [PRODUCT_AUDIT_STATUS.AUDITING, PRODUCT_AUDIT_STATUS.AUDIT_REJECTED].includes(this.product.auditStatus)
      },
      isPackageProduct () {
        return this.product.type === PRODUCT_TYPE.PACKAGE
      }
    },
    methods: {
      async handleChangeStatus (status) {
        if (this.disabled || this.submitting.status) {
          return
        }
        const statusStr = status === PRODUCT_SELL_STATUS.ON ? '上架' : '下架'
        if (this.submitting.status) {
          this.$Message.warning(`商品${statusStr}中，请稍后再操作～`)
          return
        }
        this.submitting.status = true
        this.$emit('change-sell-status', this.product, status, this.createCallback(() => {
          this.$Message.success(`商品${statusStr}成功～`)
          this.submitting.status = false
        }, (err) => {
          this.submitting.status = false
          /**
           * 商品上架 出错的时候
           * 后端接口返回错误
           * 1. 资质问题 弹资质弹框
           * 2. 弹框显示
           */
          if (status === PRODUCT_SELL_STATUS.ON && err.message) {
            if ([QUALIFICATION_STATUS.NO, QUALIFICATION_STATUS.EXP].includes(err.code)) {
              createAddQualificationModal(err.message)
              return
            }
            if (err.code === QUALIFICATION_STATUS.NOT_ALLOWED) {
              // 不可售卖商品提示埋点
              lx.mv({
                bid: 'b_shangou_online_e_pz7m7ncm_mv',
                val: { type: 1 } // 超出经营范围
              })
            }
            this.$Modal.info({ content: err.message, title: '提示' })
            return
          }
          this.$Message.error(err.message || `商品${statusStr}失败！`)
        }))
      },
      triggerDelete (currentTag) {
        this.submitting.delete = true
        const callback = this.createCallback(() => {
          this.$Message.success('商品删除成功～')
          this.submitting.delete = false
        }, (err) => {
          this.$Message.error(err.message || '商品删除失败！')
          this.submitting.delete = false
        })
        this.$emit('delete', this.product, currentTag, callback)
      },
      async handleDelete () {
        if (this.disabled) {
          return
        }
        if (this.submitting.delete) {
          this.$Message.warning('商品删除中，请稍后再试～')
          return
        }

        if (this.product.tagCount > 1 && this.tagId !== defaultTagId) {
          const handler = (currentTag) => {
            if ($modal) {
              $modal.value = false
            }
            this.triggerDelete(currentTag)
          }
          let $modal = null
          $modal = this.$Modal.confirm({
            title: '删除商品',
            width: 400,
            content: '是否确认删除商品',
            closable: true,
            renderFooter: () => {
              return (
                <div>
                  <Button onClick={() => handler(true)}>仅移出当前分类</Button>
                  <Button type="primary" onClick={() => handler(false)}>彻底删除商品</Button>
                </div>
              )
            }
          })
          return
        }
        let confirmContent = '是否确认删除商品'
        if (this.isPackageProduct) {
          confirmContent = '当前商品为组包商品，所选商品删除后将同步所关联组包商品删除，确认是否全部删除？'
        }
        this.$Modal.confirm({
          title: '删除商品',
          content: confirmContent,
          onOk: () => this.triggerDelete(false)
        })
      }
    },
    components: {
      NamedLink,
      Link
    }
  }
</script>
<style lang="less" scoped>
.product-table-op-cell {
  &:not(.disabled) {
    &,
    .active {
      color: @link-color;
      font-size: @font-size-base;
    }
  }
  > span {
    margin-right: 20px;
    cursor: pointer;
  }
  &.disabled {
    cursor: not-allowed;
    color: @disabled-color;
  }
}
</style>
