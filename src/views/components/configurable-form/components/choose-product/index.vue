<template>
  <div class="choose-product">
    <p>推荐从商品库中选择商品，快捷录入信息</p>
    <CustomSearchSelector
      ref="custom-search"
      class="search-selector"
      :width="274"
      :loading="loading"
      :error="error"
      :dataSource="dataSource"
      :total="pagination.total"
      :value="val"
      :disabled="disabled"
      placeholder="输入条形码/品牌/名称"
      @on-input-change="handleInputChange"
      @on-input-blur="error = null"
      @on-reach-bottom="handleReachBottom"
      @on-input-enter="handleInputEnter"
    >
      <template v-slot:list-item="{ data, index, keyword }">
        <li
          is="ProductInfo"
          :class="{'search-selector-list-item': true, 'gray': isDisabled(data)}"
          :keyword="keyword"
          :key="data.id + index"
          :product="data"
          @click.native="handleClickItem(data)"
        />
      </template>
    </CustomSearchSelector>
    <Button :disabled="disabled" type="primary" @click="$emit('showSpListModal')" v-if="supportProductLibrary">从商品库选择</Button>
    <AuditFieldTip :contents="auditTips" />
    <a :class="{ 'delete': true, 'disabled': disabled }" @click="handleDeleteQuickSelect" v-if="val">删除快捷录入</a>
  </div>
</template>

<script>
  import CustomSearchSelector from '@/components/custom-search-selector'
  import ProductInfo from './product-info'
  import { debounce } from 'lodash'
  import { fetchGetSpList } from '@/data/repos/standardProduct'
  // import { QUALIFICATION_STATUS } from '@/data/enums/product'
  // import qualificationModal from '@/components/qualification-modal'
  import AuditFieldTip from '@/views/components/product-form/components/audit-field-tip'
  import { QUALIFICATION_STATUS } from '@/data/enums/product'
  // import { poiId } from '@/common/constants'
  // import Icon from '@/components/icon/icon'
  // import lx from '@/common/lx/lxReport'

  // const UPC_NOT_FOUND_FAIL = '条码暂未收录，请直接录入商品信息'
  export default {
    name: 'ChooseProduct',
    components: {
      AuditFieldTip,
      CustomSearchSelector,
      ProductInfo
    },
    props: {
      value: [String, Number],
      disabled: Boolean,
      auditTips: Array,
      supportProductLibrary: Boolean // 是否支持从商品库选择
    },
    data () {
      return {
        val: this.value,
        error: null,
        loading: false,
        dataSource: [],
        pagination: {
          current: 1,
          total: 0,
          pageSize: 20
        }
      }
    },
    watch: {
      value (value) {
        this.val = value
      },
      val () {
        this.error = null
      }
    },
    methods: {
      isQualified (v) {
        return v.qualificationStatus === QUALIFICATION_STATUS.YES
      },
      isDisabled (v) {
        return !!v.existInPoi || !this.isQualified(v)
      },
      getSpList: debounce(function (value) {
        const formData = {
          keyword: value,
          pagination: this.pagination
        }
        this.error = null
        fetchGetSpList(formData).then(res => {
          this.loading = false
          const { pagination, list } = res
          this.pagination = pagination
          this.dataSource.push(...list)
        }).catch(err => {
          this.error = err.message
          this.loading = false
        })
      }, 500),
      handleReachBottom (value) {
        this.pagination = Object.assign(this.pagination, { current: this.pagination.current + 1 })
        this.loading = true
        this.getSpList(value)
      },
      handleInputEnter () {
        if (!this.loading && !this.dataSource.length) this.$Message.info('暂未找到匹配结果')
        else {
          this.$emit('showSpListModal', this.val)
        }
      },
      handleInputChange (value) {
        this.loading = true
        this.dataSource = []
        this.pagination = Object.assign(this.pagination, { current: 1, total: 0 })
        if (value) {
          this.getSpList(value)
        } else {
          this.loading = false
        }
        this.handleChange(value)

        // fetchGetSpInfoByUpc(value, poiId)
        //   .then(product => {
        //     this.error = null
        //     this.loading = false
        //   }).catch(err => {
        //     this.error = err.message
        //     this.loading = false
        //   })
      },
      handleClickItem (item) {
        if (this.isDisabled(item)) return
        this.$emit('on-select-product', item)
        // 选中商品时重新获取商品信息
        this.dataSource = []
        this.getSpList(item.name)
        this.$refs['custom-search'].hide()
      },
      handleChange (val) {
        this.val = val
        // console.log('变了', this.val)
        this.$emit('input', this.val)
        this.$emit('on-change', this.val)
      },
      // triggerSearch () {
      //   const upcCode = this.val
      //   // 如果和缓存的最后一次查询结果相同，避免请求
      //   if (this.lastSearchUpc === upcCode) return
      //   this.lastSearchUpc = upcCode
      //   // 如果为空，避免请求
      //   if (!upcCode) return
      //   return fetchGetSpInfoByUpc(upcCode, poiId)
      //     .then(product => {
      //       this.error = null
      //       this.triggerSelectProduct(product)
      //     })
      //     .catch(err => {
      //       let error = null
      //       if (err.code === 6000) {
      //         error = UPC_NOT_FOUND_FAIL
      //       } else if (err.code === QUALIFICATION_STATUS.NO || err.code === QUALIFICATION_STATUS.EXP) {
      //         qualificationModal(err.message)
      //       } else if (err.code === 2) {
      //         error = err.message
      //         // 存在返回的数据
      //         // TODO 现在只存在后台类目信息
      //         if (err.data && err.data.category) {
      //           const category = err.data.category
      //           this.$emit('on-update-category', {
      //             id: category.id,
      //             idPath: category.idPath,
      //             name: category.name,
      //             namePath: category.namePath,
      //             isLeaf: category.isLeaf,
      //             level: category.level
      //           })
      //         }
      //       } else {
      //         if (err.code === QUALIFICATION_STATUS.NOT_ALLOWED) {
      //           // 不可售卖商品提示埋点
      //           lx.mv({
      //             bid: 'b_shangou_online_e_pz7m7ncm_mv',
      //             val: { type: 1 } // 超出经营范围
      //           })
      //         }
      //         error = err.message
      //       }
      //       // 清空选择状态，支持下次查询
      //       this.lastSearchUpc = ''
      //       this.error = error
      //       this.$emit('upcSugFailed', upcCode)
      //     })
      // },
      // triggerSelectProduct (product) {
      //   this.$emit('on-select-product', product)
      // },
      // 记录foucs之前的value，避免未修改value导致的第一次默认查询，容易修改类目属性的信息
      // handleFocusEvent () {
      //   this.preValue = this.val
      // },
      // handleBlurEvent () {
      //   if (this.val !== this.preValue) {
      //     this.triggerSearch()
      //   }
      // },
      handleDeleteQuickSelect () {
        this.$Modal.confirm({
          title: '删除快捷录入',
          content: '是否将已选择的商品快捷录入删除，删除后录入信息将全部清空',
          okText: '删除',
          cancelText: '取消',
          onOk: () => {
            this.$emit('delete-all-data')
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import '~@/styles/common.less';
  .choose-product {
    display: flex;
    align-items: center;
    .search-selector {
      margin-left: 20px;
      margin-right: 10px;
      &-list-item {
        min-height: 82px;
        border-bottom: 1px solid #F2F2F7;
        padding: 4px 10px 0;
        &:hover {
          background: #F3F4F6;
          cursor: pointer;
        }
        &.gray {
          width: 100%;
          min-height: 82px;
          position: relative;
          &::before {
            content: '';
            position: absolute;
            display: inline-block;
            cursor: not-allowed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            min-height: 82px;
            background: #fff;
            z-index: 1;
            opacity: 0.5;
          }
        }
      }
    }
    /deep/ .boo-tabs-bar {
      margin-bottom: 20px;
    }
    /deep/ .boo-tabs {
      overflow: visible;
      .boo-tooltip-inner {
        max-width: none;
        white-space: normal;
      }
    }
    .delete {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #3F4156;
      letter-spacing: 0;
      text-decoration: underline;
      margin-left: 16px;
      &.disabled {
        pointer-events: none;
        color: #D9D9D9;
      }
    }
  }
  /deep/ .boo-input[disabled] {
    color: #3f4156;
  }
  .upc-content {
    display: flex;
    align-items: flex-start;
  }

  .no-upc-content {
    height: 36px;
    display: flex;
    align-items: center;
    color: @text-tip-color;

    .boo-btn {
      margin-right: 12px;
    }
  }

  .boo-input-icon-scan {
    font-size: @font-size-base;
    height: 36px;
  }
</style>
