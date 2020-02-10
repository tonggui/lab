<template>
  <WithSearch
    arrow
    ref="withSearch"
    :value="val"
    :name="name"
    :source="fetchCategory"
    :disabled="disabled"
    :placeholder="placeholder"
    :debounce="debounce"
    :width="width"
    :triggerMode="triggerMode"
    :onSearch="handleOnSearch"
    @search="handleSearch"
    @change="handleChange"
    @close="handleClose"
    @trigger="handleTrigger"
    @trigger-locked="handleTriggerLocked"
  >
    <template slot="shortcut" @click.stop>
      <div class="suggest" v-if="suggest && suggest.id" v-show="suggest.id !== this.value.id">
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
    <template v-if="showProductList" v-slot:append>
      <SpList :categoryId="categoryId" :categoryName="categoryName" @on-select="handleSelect" />
    </template>
  </WithSearch>
</template>

<script>
  import WithSearch from '@/components/cascader/with-search'
  import SpList from './sp-list'
  import qualificationModal from '@/components/qualification-modal'
  import { fetchGetCategoryListByParentId, fetchGetCategoryByName } from '@/data/repos/category'

  const NOTIFICATION_CATEGORY_ID = 200002308 // 店铺公告及相关

  export default {
    name: 'category-path',
    components: { WithSearch, SpList },
    props: {
      value: {
        type: Object,
        required: true
      },
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
      }
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
      suggestName () {
        return this.suggest ? (this.suggest.namePath || []).join(this.separator) : ''
      }
    },
    methods: {
      // 获取后台类目
      fetchCategory (parentId) {
        return fetchGetCategoryListByParentId(parentId).then(data => ({
          id: parentId,
          children: data,
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
        return fetchGetCategoryByName(keyword).then((data) => {
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
          return { data: result, total: result.length }
        })
      },
      handleChange (idPath = [], namePath = []) {
        // 特殊类目需要给出提示
        if (idPath.includes(NOTIFICATION_CATEGORY_ID)) {
          this.$Modal.info({
            title: '提示',
            content: '此类目下的商品仅用于店内展示，不支持搜索以及推荐等多种引流',
            okText: '我知道了'
          })
        }
        this.$emit('on-change', {
          id: idPath[idPath.length - 1] || null,
          idPath,
          name: namePath[namePath.length - 1] || '',
          namePath,
          isLeaf: true,
          level: idPath.length
        })
      },
      handleClose () {
        this.categoryId = null
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
        } else {
          qualificationModal(item.lockTips)
        }
        this.$refs.withSearch.hide()
      },
      // 选择标品回调
      handleSelect (product) {
        this.$emit('on-select-product', product)
        this.$refs.withSearch.hide()
        // 必须手动触发一下popup的click使其内部状态变为关闭，否则下次需要点两次才能打开
        this.$refs.withSearch.$refs.triggerRef.handleClick()
      },
      accept () {
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
        this.$Modal.confirm({
          title: '暂不使用注意事项',
          centerLayout: true,
          okText: '返回修改',
          cancelText: '确定',
          render () {
            return (
              <div>
                <div>系统检测到您的商品可能与已填写的类目不符合，建议使用推荐类目：如您选择“暂不使用”，平台将对您的商品进行审核</div>
                <div>1) 审核通过，则您的商品将可以正常售卖</div>
                <div class="danger">2) 审核不通过，将降低您门店内的商品曝光</div>
                <div>审核周期：1-7个工作日，审核期间您可以正常售卖</div>
              </div>
            )
          },
          onCancel: () => {
            this.$emit('ignoreSuggest', this.suggest.id)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
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
</style>
