<template>
  <div class="choose-product" @click.capture="handleContainerClickEvent">
    <div class="header-tip">
      <LibraryAddColorful />
      {{confirmed ? '已使用商品库信息' : '直接使用平台商品库信息创建，商品无需审核。请先找一找您要创建的商品吧～'}}
    </div>
    <div class="choose-product-content">
      <CustomSearchSelector
        v-if="!confirmed"
        ref="custom-search"
        class="search-selector"
        :width="274"
        :loading="loading"
        :error="error"
        :dataSource="dataSource"
        :total="pagination.total"
        :value="val"
        :disabled="disabled"
        :inputAttrs="{ search: true, 'enter-button': true }"
        placeholder="输入商品条形/名称/品牌名查找"
        @on-input-change="handleInputChange"
        @on-input-blur="handleSelectorBlur"
        @on-input-focus="handleSelectorFocus"
        @on-reach-bottom="handleReachBottom"
        @on-input-enter="handleInputEnter"
        @on-select-item="handleClickItem"
      >
        <template v-slot:list-item="{ data, index, keyword }">
          <component
            :is="`ProductInfo`"
            :class="{'search-selector-list-item': true }"
            :keyword="keyword"
            :key="data.id + index"
            :product="data"
          />
        </template>
        <template slot="loading">
          <div class="loading-container">
            <FlashLoading size="mini" />
            <div class="loading-tips">从商品库查找中</div>
          </div>
        </template>
        <template slot="empty">
          暂未找到，请手动创建
        </template>
      </CustomSearchSelector>
      <Tag
        v-else
        closable
        class="selected-product-tag"
        :fade="false"
        @on-close="handleReselectEvent"
      >{{selectedItem.name}}</Tag>
      <Button
        class="primary-style-button"
        :disabled="disabled"
        type="text"
        @click="showSpListModal"
        v-if="supportProductLibrary && !confirmed">通过目录查找 ></Button>
      <div class="separator" v-if="selectedItem && supportProductLibrary && !confirmed" />
      <a :class="{ 'delete': true, 'disabled': disabled }" @click="handleDeleteQuickSelect" v-if="selectedItem">清空快捷录入</a>
      <AuditFieldTip :contents="auditTips" />
    </div>
  </div>
</template>

<script>
  import FlashLoading from '@/components/loading/flash-loading'
  import CustomSearchSelector from '@/components/custom-search-selector'
  import ProductInfo from './product-info'
  import { debounce, noop } from 'lodash'
  import { fetchGetSpList } from '@/data/repos/standardProduct'
  import AuditFieldTip from '@/views/components/product-form/components/audit-field-tip'
  import { QUALIFICATION_STATUS } from '@/data/enums/product'
  import LibraryAddColorful from '@/assets/icons/library-add-filled-colorful.svg'
  import { SearchTime, FillTime } from '@/common/lx/lxReport/lxTime'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'ChooseProduct',
    components: {
      FlashLoading,
      AuditFieldTip,
      CustomSearchSelector,
      ProductInfo,
      LibraryAddColorful
    },
    props: {
      value: [String, Number],
      disabled: Boolean,
      auditTips: Array,
      selectedSp: Object, // 选中的标品信息
      spListVisible: Boolean, // 从商品库选择弹窗是否显示中
      supportProductLibrary: Boolean // 是否支持从商品库选择
    },
    data () {
      return {
        val: this.value,
        error: null,
        loading: false,
        selectedItem: this.selectedSp,
        confirmed: false,
        // 联合确认当前失焦状态是否需要触发回滚逻辑
        modalVisible: this.spListVisible,
        confirmVisible: false,
        dataSource: [],
        pagination: {
          current: 1,
          total: 0,
          pageSize: 20
        },
        isInput: false
      }
    },
    watch: {
      value (value) {
        this.val = value
      },
      val () {
        this.error = null
      },
      spListVisible (v) {
        this.modalVisible = v
      },
      selectedSp (sp) {
        this.selectedItem = sp
        this.confirmed = true
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
          list.forEach(item => (item.disabled = this.isDisabled(item)))
          this.dataSource.push(...list)
        }).catch(err => {
          this.error = err.message
          this.loading = false
        })

        lx.mc({
          bid: 'b_shangou_online_e_n6pvpj89_mc',
          val: {
            select_time: new Date().getTime(),
            query: value
          }
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
        if (value && !this.isInput) {
          this.isInput = true
          lx.mv({
            bid: 'b_shangou_online_e_xm1bi3fq_mv'
          })
        }
        if (!value) this.isInput = false
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
      async handleClickItem (item, cb = noop) {
        if (this.isDisabled(item)) {
          cb(new Error('禁用选项，禁止选中！'))
          return
        }
        SearchTime.searchEndTime = +new Date()
        FillTime.fillStartTime = +new Date()
        // 如果选择弹窗显示中，不继续提示选择弹窗
        if (this.confirmVisible) {
          return
        }

        const isAccepted = await new Promise(resolve => {
          if (!this.selectedItem) {
            resolve(true)
            return
          }
          this.confirmVisible = true
          this.$Modal.confirm({
            title: '确定选择此商品',
            content: '选择此商品后，已填写的商品信息将被覆盖。是否选择此商品？',
            transfer: false,
            onOk: () => resolve(true),
            onCancel: () => resolve(false)
          })
        })
        this.confirmVisible = false

        if (isAccepted) {
          this.$emit('on-select-product', item)
          this.selectedItem = item
          this.confirmed = true
          // 选中商品时重新获取商品信息
          this.dataSource = []
          this.getSpList(item.name)
          this.$refs['custom-search'].hide()
          this.$Message.success('信息填充成功，请继续完善')
          lx.mc({
            bid: 'b_shangou_online_e_q9bg9t89_mc',
            val: {
              st_spu_id: item.id,
              select_time: new Date().getTime()
            }
          })
        } else {
          // 取消后，重新设置为选中状态。保持选中的场景
          setTimeout(() => this.resetToEditingMode(), 400)
        }
        cb(isAccepted ? null : new Error())
      },
      handleChange (val) {
        this.val = val

        this.$emit('input', this.val)
        this.$emit('on-change', this.val)
      },
      handleDeleteQuickSelect () {
        this.confirmVisible = true
        this.$Modal.open({
          width: '362px',
          title: '删除快捷录入',
          content: '是否将已选择的商品快捷录入删除，删除后录入信息将全部清空。',
          okText: '删除',
          cancelText: '取消',
          centerLayout: true,
          onOk: () => {
            this.selectedItem = null
            this.confirmed = false
            this.confirmVisible = false
            SearchTime.clearSearchTime()
            FillTime.fillStartTime = +new Date()
            this.$emit('delete-all-data')
          },
          onCancel: () => {
            this.confirmVisible = false
            if (this.selectedItem && !this.confirmed) {
              setTimeout(() => this.resetToEditingMode(), 400)
            }
          }
        })
      },
      handleSelectorFocus () {
        if (!SearchTime.searchStartTime) SearchTime.searchStartTime = +new Date()
        if (this.$_blurHandlerId) {
          clearTimeout(this.$_blurHandlerId)
          this.$_blurHandlerId = 0
        }
        this.handleEmitLx()
      },
      handleSelectorBlur () {
        if (this.$_blurHandlerId) {
          clearTimeout(this.$_blurHandlerId)
        }
        this.$_blurHandlerId = setTimeout(() => {
          this.error = null
          this.$_blurHandlerId = 0
          if ([this.modalVisible, this.confirmVisible].some(any => any)) {
            return
          }
          if (this.selectedItem) {
            this.confirmed = true
          }
        }, 300)
      },
      handleReselectEvent () {
        this.confirmed = false
        this.val = ''
        this.$nextTick(() => this.resetToEditingMode())
      },
      handleContainerClickEvent () {
        if (!SearchTime.searchStartTime) SearchTime.searchStartTime = +new Date()
        this.resetToEditingMode()
      },
      resetToEditingMode () {
        if (this.$_blurHandlerId) {
          clearTimeout(this.$_blurHandlerId)
          this.$_blurHandlerId = 0
        }
        if (!this.confirmed) {
          this.$nextTick(() => {
            if (this.$refs['custom-search']) {
              this.$refs['custom-search'].setFocusState()
            }
          })
        }
      },
      showSpListModal () {
        this.$emit('showSpListModal')
        this.handleEmitLx()
      },
      handleEmitLx: debounce(function () {
        lx.mc({
          bid: 'b_shangou_online_e_zt0bc7av_mc'
        })
      }, 300)
    },
    created () {
      this.$_blurHandlerId = 0
    }
  }
</script>

<style scoped lang="less">
  @import '~@/styles/common.less';
  .choose-product {
    margin: -20px;
    padding: 20px 30px;
    background: url('~@/assets/create-product-shortcut-background.svg') no-repeat;
    background-size: cover;
    .header-tip {
      width: 100%;
      font-size: 14px;
      font-weight: bolder;
      display: flex;
      align-items: center;

      > svg {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }
    .choose-product-content {
      margin-top: 8px;
      display: flex;
      align-items: center;
      .search-selector {
        margin-right: 10px;
        &-list-item {
          min-height: 82px;
          border-bottom: 1px solid #F2F2F7;
          padding: 4px 10px 0;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;

          .loading-tips {
            font-size: 14px;
            color: #999999;
            margin-left: 10px;
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
      .separator {
        border-right: 1px solid #A2A4B3;
        background: #E9EAF2;
        width: 1px;
        height: 10px;
      }
      .delete {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #5F5E5D;
        letter-spacing: 0;
        margin-left: 16px;
        &.disabled {
          pointer-events: none;
          color: #D9D9D9;
        }
      }

      /deep/ .boo-tag {
        font-size: @font-size-base;
        height: 36px;
        line-height: 36px;
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

  .primary-style-button {
    color: @highlight-color;
    background-color: transparent !important;
  }

  .search-selector-list-item {
    /deep/ .recommend-product-info-no-sp-marker {
      width: 41px;
      height: 17px;
      background: #7A7A7A;
      color: #fff;
      margin: 0;
      border: 0;
      border-left: 1px solid #7A7A7A;
      border-top: 1px solid #7A7A7A;
      padding: 0;
      line-height: 16px;
      text-align: center;
      vertical-align: middle;
    }
  }

  .selected-product-tag {
    background: #FFFFFF;
    border: 1px solid #E9EAF2;
    border-radius: 2px;

    font-size: 14px;
    color: #858692;
    letter-spacing: 0;
    line-height: 19px;
  }
</style>
