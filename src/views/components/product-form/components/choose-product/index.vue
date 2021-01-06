<template>
  <div class="choose-product">
    <Tabs name="choose-product" :value="tabValue" :animated="false" @input="handleTabChange">
      <TabPane tab="choose-product" :label="(h) => renderLabel(h, true)" name="upc">
        <div class="upc-content">
          <Tooltip placement="right" always :content="error" :disabled="!error">
            <Input
              style="width:460px"
              v-model="val"
              clearable
              :disabled="disabled"
              :placeholder="placeholder"
              @on-change="handleChange"
              @on-focus="handleFocusEvent"
              @on-blur="handleBlurEvent"
              @on-keyup.enter="triggerSearch"
            >
              <Icon slot="suffix" local="with-upc" class="boo-input-icon-scan" />
            </Input>
          </Tooltip>
          <AuditFieldTip :contents="auditTips" />
        </div>
      </TabPane>
      <TabPane tab="choose-product" :label="(h) => renderLabel(h, false)" name="noUpc">
        <div class="no-upc-content">
          <Button type="primary" @click="$emit('showSpListModal')" v-mc="{ bid: 'b_aq2pwt9s' }" :disabled="disabled">从商品库选择</Button>
          通过商品库可快速获取商品信息（标题、图片、属性等）
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import { fetchGetSpInfoByUpc } from '@/data/repos/standardProduct'
  import { QUALIFICATION_STATUS } from '@/data/enums/product'
  import qualificationModal from '@/components/qualification-modal'
  import AuditFieldTip from '../audit-field-tip'
  import { poiId } from '@/common/constants'
  import Icon from '@/components/icon/icon'
  import lx from '@/common/lx/lxReport'

  const UPC_NOT_FOUND_FAIL = '条码暂未收录，请直接录入商品信息'
  export default {
    name: 'ChooseProduct',
    components: {
      AuditFieldTip
    },
    props: {
      noUpc: Boolean,
      value: String,
      disabled: Boolean,
      placeholder: {
        type: String,
        default: '输入商品条码可快速从商品库获取商品信息（标题、图片、属性等）'
      },
      auditTips: Array
    },
    data () {
      return {
        val: this.value,
        error: null
      }
    },
    computed: {
      tabValue () {
        return this.noUpc ? 'noUpc' : 'upc'
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
      renderLabel (h, isUpc) {
        const text = isUpc ? '条码商品' : '无条码商品'
        const type = isUpc ? 'with-upc' : 'without-upc'
        const active = this.tabValue === 'upc' ? isUpc : !isUpc
        return (
          <span style={{ fontWeight: active ? 'bold' : 'normal' }}>
            <Icon style={{ color: active ? '#F89800' : '#585A6E' }} local={type} />
            <span style="vertical-align: middle">{ text }</span>
          </span>
        )
      },
      handleTabChange (v) {
        this.$emit('tabChange', v)
      },
      handleChange (event) {
        this.val = event.target.value
        this.$emit('input', this.val)
        this.$emit('on-change', this.val)
      },
      triggerSearch () {
        const upcCode = this.val
        // 如果和缓存的最后一次查询结果相同，避免请求
        if (this.lastSearchUpc === upcCode) return
        this.lastSearchUpc = upcCode
        // 如果为空，避免请求
        if (!upcCode) return
        return fetchGetSpInfoByUpc(upcCode, poiId)
          .then(product => {
            this.error = null
            this.triggerSelectProduct(product)
          })
          .catch(err => {
            let error = null
            if (err.code === 6000) {
              error = UPC_NOT_FOUND_FAIL
            } else if (err.code === QUALIFICATION_STATUS.NO || err.code === QUALIFICATION_STATUS.EXP) {
              qualificationModal(err.message)
            } else if (err.code === 2) {
              error = err.message
              // 存在返回的数据
              // TODO 现在只存在后台类目信息
              if (err.data && err.data.category) {
                const category = err.data.category
                this.$emit('on-update-category', {
                  id: category.id,
                  idPath: category.idPath,
                  name: category.name,
                  namePath: category.namePath,
                  isLeaf: category.isLeaf,
                  level: category.level
                })
              }
            } else {
              if (err.code === QUALIFICATION_STATUS.NOT_ALLOWED) {
                // 不可售卖商品提示埋点
                lx.mv({
                  bid: 'b_shangou_online_e_pz7m7ncm_mv',
                  val: { type: 1 } // 超出经营范围
                })
              }
              error = err.message
            }
            // 清空选择状态，支持下次查询
            this.lastSearchUpc = ''
            this.error = error
            this.$emit('upcSugFailed', upcCode)
          })
      },
      triggerSelectProduct (product) {
        if (product && product.isSp) {
          this.handleTabChange('upc')
        }
        setTimeout(() => {
          this.$emit('on-select-product', product)
        }, 0)
      },
      // 记录foucs之前的value，避免未修改value导致的第一次默认查询，容易修改类目属性的信息
      handleFocusEvent () {
        this.$emit('start')
        this.preValue = this.val
      },
      handleBlurEvent () {
        this.$emit('end')
        if (this.val !== this.preValue) {
          this.triggerSearch()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import '~@/styles/common.less';
  .choose-product {
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
  }
  /deep/ .boo-input[disabled] {
    color: #3F4156;
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
