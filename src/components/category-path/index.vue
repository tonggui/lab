<template>
  <div class="category-path">
    <WithSearch
      arrow
      ref="withSearch"
      :value="val"
      :name="name"
      :source="fetchCategory"
      :disabled="disabled || lockByEmptySuggesting"
      :placeholder="placeholder"
      :debounce="debounce"
      :width="width"
      :triggerMode="triggerMode"
      :onSearch="handleOnSearch"
      @focus="handleFocus"
      @blur="handleBlur"
      @search="handleSearch"
      @change="handleChange"
      @open="handleOpen"
      @close="handleClose"
      @trigger="handleTrigger"
      @trigger-locked="handleTriggerLocked"
    >
      <template slot="shortcut" @click.stop>
        <div class="suggest" v-if="suggest && suggest.id" v-show="suggest.id !== value.id">
          <div class="suggest-title">
            <span>推荐类目：</span>
            <span class="suggest-name">{{ suggestName }}</span>
            <div>
              <span class="opr opr-yes" @click="accept">确定使用</span>
              <span class="opr opr-no" @click="deny">暂不使用</span>
            </div>
          </div>
          <div class="suggest-desc">
            如果类目选择错误，将会影响门店的曝光和商品成交，如推荐类目与商品不匹配，请点击“暂不使用”
          </div>
        </div>
      </template>
      <template slot="disabled" v-if="suggesting && lockByEmptySuggesting">
        <div class="loading">
          类目自动获取中，请稍后
          <Icon type="loading" style="margin-left: 5px" />
        </div>
      </template>
      <template v-if="showProductList" v-slot:append>
        <slot
          name="splist"
          v-bind="{ categoryId, categoryName, handleSelect }"
        >
          <SpList :categoryId="categoryId" :categoryName="categoryName" @on-select="handleSelect" />
        </slot>
      </template>
    </WithSearch>
    <Tooltip
      style="margin-left:10px"
      placement="bottom"
      max-width="225px"
      content="商品类目是大众统一认知的分类，是为买家推荐和搜索的重要依据之一，请认真准确填写，否则将影响曝光和订单转化"
    >
      <Icon class="tip" local="question-circle"/>
    </Tooltip>
    <AuditFieldTip :formatter="displayValueFormatter" :contents="auditTips"/>
  </div>
</template>

<script>
  import _ from 'lodash'
  import WithSearch from '@/components/cascader/with-search'
  import SpList from './sp-list'
  import qualificationModal from '@/components/qualification-modal'
  import AuditFieldTip from '@/views/components/product-form/components/audit-field-tip'
  import { fetchGetCategoryListByParentId, fetchGetCategoryByName } from '@/data/repos/category'
  import { LX as lx } from '@/common/lx/lxReport'
  import TimeCounters from '@/common/lx/lxReport/lxTime'

  const NOTIFICATION_CATEGORY_ID = 200002308 // 店铺公告及相关

  export default {
    name: 'category-path',
    components: { WithSearch, SpList, AuditFieldTip },
    props: {
      value: {
        type: Object,
        required: true
      },
      isCorrect: {
        type: Boolean,
        default: false
      },
      auditTips: Array,
      suggesting: Boolean,
      suggest: {
        type: Object,
        default: () => ({})
      },
      separator: {
        type: String,
        default: ' > '
      },
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      debounce: {
        type: Number,
        default: 400
      },
      width: {
        type: Number,
        default: 440
      },
      triggerMode: {
        type: String,
        default: 'hover'
      },
      showProductList: {
        type: Boolean,
        default: true
      },
      supportLocked: {
        type: Boolean,
        default: true
      },
      fetchCategoryListByParentId: {
        type: Function,
        default: fetchGetCategoryListByParentId
      },
      searchCategoryListByName: {
        type: Function,
        default: fetchGetCategoryByName
      }
    },
    mounted () {
      this.suggestMV = false // 推荐类目mv
      this.denyConfirmMV = false // 暂不使用推荐类目的二次确认框mv
    },
    data () {
      return {
        categoryId: null,
        categoryName: ''
      }
    },
    computed: {
      // 传入withSearch组件的value，需要转换
      val () {
        return this.value.idPath || []
      },
      // 根据categoryNamePath和separator生成的展示名
      name () {
        return (this.value.namePath || []).join(this.separator)
      },
      displayValueFormatter () {
        return category => ((category || {}).namePath || []).join(this.separator)
      },
      suggestName () {
        return this.suggest ? (this.suggest.namePath || []).join(this.separator) : ''
      },
      // 无值并且正在获取推荐类目时锁定
      lockByEmptySuggesting () {
        return this.suggesting && !this.val.length
      },
      showSuggest () {
        return this.suggest.id && this.suggest.id !== this.value.id
      }
    },
    watch: {
      showSuggest (v) {
        if (v && !this.suggestMV) {
          this.suggestMV = true
          this.$emit('suggestDebut', this.suggest.id)
        }
      }
    },
    methods: {
      handleFocus () {
        TimeCounters.setTime('category', +new Date(), 's2e')
      },
      handleBlur () {
        TimeCounters.setEndTime('category', +new Date())
      },
      convertCategoryList (list) {
        if (!this.supportLocked) {
          return _.map(list, item => {
            item.locked = false
            item.lockTips = ''
            return item
          })
        }
        return list
      },
      // 获取后台类目
      fetchCategory (parentId) {
        return this.fetchCategoryListByParentId(parentId).then(data => ({
          id: parentId,
          children: this.convertCategoryList(data),
          total: data.length
        }))
      },
      handleSearch () {
        // 重新查找时先清空之前的splist
        this.categoryId = null
        this.categoryName = ''
      },
      handleOnSearch ({ keyword }) {
        if (!keyword) return Promise.resolve([])
        return this.searchCategoryListByName(keyword).then((data) => {
          const result = data.map((item) => {
            const {
              idPath,
              namePath
            } = item
            const path = idPath.map((v, i) => ({
              id: v,
              name: namePath[i] || ''
            }))
            return {
              ...item,
              name: namePath.join(this.separator),
              path,
              isLeaf: true
            }
          })
          return { data: this.convertCategoryList(result), total: result.length }
        })
      },
      handleChange (idPath = [], namePath = []) {
        lx.mc({
          bid: 'b_shangou_online_e_6yqwcxfr_mc',
          val: { query: this.$refs['withSearch'].keyword || '', tag_id: idPath[2] || '' }
        }, this)

        // 特殊类目需要给出提示
        if (idPath.includes(NOTIFICATION_CATEGORY_ID)) {
          this.$Modal.info({
            title: '提示',
            content: '此类目下的商品仅用于店内展示，不支持搜索以及推荐等多种引流',
            okText: '我知道了'
          })
        }
        const params = {
          id: idPath[idPath.length - 1] || null,
          idPath,
          name: namePath[namePath.length - 1] || '',
          namePath,
          isLeaf: true,
          level: idPath.length
        }
        TimeCounters.setEndTime('category', +new Date())
        this.$emit(this.isCorrect ? 'change' : 'on-change', params)
      },
      handleOpen () {
        this.$emit('start')
      },
      handleClose () {
        TimeCounters.stopTime('category')
        this.categoryId = null
        this.$emit('end')
      },
      handleTrigger (item) {
        const {
          id,
          name,
          searchable,
          isLeaf = true
        } = item
        this.categoryId = (isLeaf && searchable) ? id : null
        this.categoryName = name || ''
      },
      // 选中锁定项
      handleTriggerLocked (item) {
        console.log('点击商品类目置灰项', item)
        if (item.searchable) {
          this.$Modal.confirm({
            title: '提示',
            content: item.lockTips,
            okText: '前往商品库',
            cancel: '取消',
            onOk: () => {
              this.$emit('showSpListModal')
            }
          })
        } else if (item.lockStatus === -1) {
          // 【B2C医药】商家建品流程调整 - 商品类目选中锁定项
          this.$Modal.confirm({
            title: '提示',
            content: item.lockTips,
            okText: '确定',
            cancel: '取消'
          })
        } else {
          qualificationModal(item.lockTips)
        }
        this.$refs.withSearch.hide()
      },
      // 选择标品回调
      handleSelect (product) {
        lx.mc({
          bid: 'b_shangou_online_e_ob2vg99w_mc',
          val: { query: this.$refs['withSearch'].keyword || '', tag_id: product.category.id, st_spu_id: product.id }
        }, this)
        this.$emit('on-select-product', product)
        this.$refs.withSearch.hide()
        // 必须手动触发一下popup的click使其内部状态变为关闭，否则下次需要点两次才能打开
        this.$refs.withSearch.$refs.triggerRef.handleClick()
      },
      accept () {
        lx.mc({ bid: 'b_shangou_online_e_9h019gfx_mc',
                val: {
                  tag_id: this.suggest.id
                } }, this)
        TimeCounters.setEndTime('category', +new Date())

        this.$emit('on-change', {
          id: this.suggest.id,
          idPath: this.suggest.idPath,
          name: this.suggest.name,
          namePath: this.suggest.namePath,
          isLeaf: this.suggest.isLeaf,
          level: this.suggest.level
        })
      },
      deny () {
        const val = { tag_id: this.suggest.id } // 埋点额外参数
        lx.mc({ bid: 'b_shangou_online_e_am1yd975_mc', val }, this)
        if (!this.denyConfirmMV) {
          this.denyConfirmMV = true
          this.$emit('denyConfirmDebut', this.suggest.id)
        }
        this.$Modal.confirm({
          title: '暂不使用注意事项',
          centerLayout: true,
          okText: '返回修改',
          cancelText: '确定',
          render () {
            return (
              <div>
                <div>类目与商品可能不符，将严重影响您的商品曝光及转化。如果您的类目是正确的，请点击“确定”（申报审核前，将不影响您正常售卖）</div>
              </div>
            )
          },
          onCancel: () => {
            lx.mc({ bid: 'b_shangou_online_e_j6ly9996_mc', val }, this)
            this.$emit('ignoreSuggest', this.suggest.id)
          },
          onOk: () => {
            lx.mc({ bid: 'b_shangou_online_e_t20x927w_mc', val }, this)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/styles/common.less';
  .category-path {
    display: flex;
    align-items: flex-start;
    .extra-info {
      .audit-need-correction-tip()
    }
    .correction-info {
      .audit-correction-info();
    }
  }
  .suggest {
    font-size: @font-size-base;
    line-height: 1.5;
    padding: 10px;
    border: 1px solid @disabled-border-color;
    border-top: none;
    border-radius: 2px;
    box-shadow: 0 0 6px rgba(0,0,0,.1);
    margin-top: 1px;
    .suggest-title {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      margin-bottom: 5px;
      .suggest-name {
        flex: 1;
        margin: 0 5px 0 2px;
        word-break: break-all;
      }
      .opr {
        display: inline-block;
        padding-left: 5px;
        cursor: pointer;
        color: @highlight-color;
        line-height: 1;
        &:not(:last-of-type) {
          border-right: 1px solid @primary-color;
          padding-right: 5px;
        }
      }
      .opr-no {
        color: @text-tip-color;
      }
    }
    .suggest-desc {
      font-size: @font-size-small;
      text-align: justify;
      color: @text-tip-color;
    }
  }
  .loading {
    display: inline-flex;
    align-items: center;
  }
</style>
