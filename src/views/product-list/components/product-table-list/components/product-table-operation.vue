<template>
  <div class="product-table-op-cell" :class="{ disabled: disabled }">
    <span v-mc="{ bid: 'b_sfkii6px', val: { tab_id: tabId } }">
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
      <PermissionBtn component="span" need-permission btn-type="MODIFY_ON_AND_OFF_SHELVES" isNativeTag v-mc="{ bid: 'b_yo8d391g', val: { type: 1, tab_id: tabId } }" v-if="product.sellStatus === PRODUCT_SELL_STATUS.OFF" @click="handleChangeStatus(PRODUCT_SELL_STATUS.ON, product.isComplianceUnderAudit)">上架</PermissionBtn>
      <PermissionBtn component="span" need-permission btn-type="MODIFY_ON_AND_OFF_SHELVES" isNativeTag v-mc="{ bid: 'b_yo8d391g', val: { type: 0, tab_id: tabId } }" v-if="product.sellStatus === PRODUCT_SELL_STATUS.ON" @click="handleChangeStatus(PRODUCT_SELL_STATUS.OFF)">下架</PermissionBtn>
    </span>
    <PermissionBtn component="span" need-permission btn-type="DEL_PRODUCT" isNativeTag v-mc="{ bid: 'b_ugst7wnh', val: { tab_id: tabId } }" @click="handleDelete">删除</PermissionBtn>
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
    PACKAGE_PRODUCT_OPT_STATUS,
    PRODUCT_TYPE,
    PRODUCT_STATUS_MAIDIAN
  } from '@/data/enums/product'
  import { defaultTagId } from '@/data/constants/poi'
  import { createCallback } from '@/common/vuex'
  import createAddQualificationModal from '@/components/qualification-modal'
  import lx from '@/common/lx/lxReport'
  import PackageProductUnitTable from './package-product-unit-table'
  import PermissionBtn from '@/views/components/permission-bth/index'

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
      },
      tabValue: [String, Number] // tab当前选中值
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
      },
      tabId () {
        // 计算埋点需要的tab_id
        return PRODUCT_STATUS_MAIDIAN[this.tabValue.toString()]
      }
    },
    methods: {
      async handleChangeStatus (status, isComplianceUnderAudit) {
        if (this.disabled || this.submitting.status) {
          return
        }
        const statusStr = status === PRODUCT_SELL_STATUS.ON ? '上架' : '下架'
        if (this.submitting.status) {
          this.$Message.warning(`商品${statusStr}中，请稍后再操作～`)
          return
        }
        this.submitting.status = true
        this.changeProductStatus(status, false, isComplianceUnderAudit)
      },
      changeProductStatus (status, force = false, isComplianceUnderAudit) {
        const statusStr = status === PRODUCT_SELL_STATUS.ON ? '上架' : '下架'
        this.$emit('change-sell-status', this.product, status, force, this.createCallback(() => {
          // 上架且合规审核为先审后发审核中，需要加提示：'合规审核通过后可正常售卖'
          this.$Message.success(`${status === PRODUCT_SELL_STATUS.ON && isComplianceUnderAudit ? `商品${statusStr}成功，合规审核通过后可正常售卖` : `商品${statusStr}成功～`}`)
          this.submitting.status = false
        }, (err) => {
          this.submitting.status = false
          if (PACKAGE_PRODUCT_OPT_STATUS.SELL_STATUS_OFF_CONFIRM === err.code) {
            this.$Modal.confirm({
              title: '提示',
              content: '所选商品下架后将同步所关联组包商品下架，确认是否全部下架？',
              okText: '全部下架',
              onOk: () => {
                this.submitting.status = true
                this.changeProductStatus(status, true, isComplianceUnderAudit)
              }
            })
            return
          }
          if (PACKAGE_PRODUCT_OPT_STATUS.SELL_STATUS_ON_CONFIRM === err.code) {
            this.$Modal.confirm({
              title: '组包商品关联未上架商品明细信息',
              width: 600,
              render: () => (
                <PackageProductUnitTable
                  width={560}
                  source={err.data}
                />
              ),
              centerLayout: true,
              okText: '全部上架',
              onOk: () => {
                this.submitting.status = true
                this.changeProductStatus(status, true, isComplianceUnderAudit)
              }
            })
            return
          }
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
      triggerDelete (currentTag, force = false) {
        this.submitting.delete = true
        const callback = this.createCallback(() => {
          this.$Message.success('商品删除成功～')
          this.submitting.delete = false
        }, (err) => {
          if (err.code === PACKAGE_PRODUCT_OPT_STATUS.DELETE_CONFIRM) {
            this.$Modal.confirm({
              title: '删除商品',
              content: err.message,
              okText: '全部删除',
              onOk: () => this.triggerDelete(false, true),
              onCancel: () => { this.submitting.delete = false }
            })
          } else {
            this.$Message.error(err.message || '商品删除失败！')
            this.submitting.delete = false
          }
        })
        this.$emit('delete', this.product, currentTag, force, callback)
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
        this.$Modal.confirm({
          title: '删除商品',
          content: '是否确认删除商品',
          onOk: () => this.triggerDelete(false)
        })
      }
    },
    components: {
      PermissionBtn,
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
